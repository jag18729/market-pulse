/**
 * WebSocket Server for Market Pulse
 * 
 * Connects to Tiingo IEX WebSocket for real-time stock data
 * and broadcasts to connected clients.
 * 
 * Architecture:
 * - Tiingo WS → This server → Redis pub/sub → Client connections
 * - Clients subscribe to specific tickers
 * - Server maintains single Tiingo connection, multiplexes to clients
 */

const PORT = parseInt(Deno.env.get("PORT") ?? "3004");
const TIINGO_API_KEY = Deno.env.get("TIINGO_API_KEY") ?? "";
const TIINGO_WS_URL = "wss://api.tiingo.com/iex";

// Track connected clients and their subscriptions
const clients = new Map<WebSocket, Set<string>>();
let tiingoWs: WebSocket | null = null;
let subscribedTickers = new Set<string>();

// Connect to Tiingo WebSocket
function connectToTiingo() {
  if (!TIINGO_API_KEY) {
    console.error("❌ TIINGO_API_KEY not set");
    return;
  }

  console.log("🔌 Connecting to Tiingo WebSocket...");
  
  tiingoWs = new WebSocket(TIINGO_WS_URL);

  tiingoWs.onopen = () => {
    console.log("✅ Connected to Tiingo WebSocket");
    
    // Subscribe to currently tracked tickers
    if (subscribedTickers.size > 0) {
      sendTiingoSubscribe([...subscribedTickers]);
    }
  };

  tiingoWs.onmessage = (event) => {
    try {
      const msg = JSON.parse(event.data);
      
      if (msg.messageType === "A") {
        // Price update - broadcast to subscribed clients
        const data = msg.data;
        if (data && data.length > 0) {
          const ticker = data[0]; // First element is usually the ticker
          broadcastToSubscribers(ticker, msg);
        }
      } else if (msg.messageType === "H") {
        // Heartbeat - ignore
      } else if (msg.messageType === "I") {
        // Info message
        console.log("📢 Tiingo:", msg);
      }
    } catch (e) {
      console.error("Failed to parse Tiingo message:", e);
    }
  };

  tiingoWs.onclose = () => {
    console.log("🔌 Tiingo WebSocket closed, reconnecting in 5s...");
    tiingoWs = null;
    setTimeout(connectToTiingo, 5000);
  };

  tiingoWs.onerror = (e) => {
    console.error("❌ Tiingo WebSocket error:", e);
  };
}

// Send subscription message to Tiingo
function sendTiingoSubscribe(tickers: string[]) {
  if (!tiingoWs || tiingoWs.readyState !== WebSocket.OPEN) return;

  const subscribeMsg = {
    eventName: "subscribe",
    authorization: TIINGO_API_KEY,
    eventData: {
      thresholdLevel: 5, // Top of book only
      tickers: tickers,
    },
  };

  tiingoWs.send(JSON.stringify(subscribeMsg));
  console.log(`📡 Subscribed to: ${tickers.join(", ")}`);
}

// Broadcast price update to clients subscribed to this ticker
function broadcastToSubscribers(ticker: string, data: unknown) {
  const message = JSON.stringify({
    type: "price",
    ticker,
    data,
    timestamp: Date.now(),
  });

  for (const [ws, subs] of clients) {
    if (subs.has(ticker.toUpperCase()) && ws.readyState === WebSocket.OPEN) {
      ws.send(message);
    }
  }
}

// Update Tiingo subscription based on all client subscriptions
function updateTiingoSubscription() {
  const allTickers = new Set<string>();
  for (const subs of clients.values()) {
    for (const ticker of subs) {
      allTickers.add(ticker);
    }
  }

  // Find new tickers to subscribe
  const newTickers = [...allTickers].filter((t) => !subscribedTickers.has(t));
  if (newTickers.length > 0) {
    sendTiingoSubscribe(newTickers);
  }

  subscribedTickers = allTickers;
}

// Handle client WebSocket connections
function handleClient(ws: WebSocket) {
  clients.set(ws, new Set());
  console.log(`👤 Client connected (${clients.size} total)`);

  ws.onmessage = (event) => {
    try {
      const msg = JSON.parse(event.data);

      if (msg.action === "subscribe" && Array.isArray(msg.tickers)) {
        // Client wants to subscribe to tickers
        const clientSubs = clients.get(ws)!;
        for (const ticker of msg.tickers) {
          clientSubs.add(ticker.toUpperCase());
        }
        updateTiingoSubscription();

        ws.send(JSON.stringify({
          type: "subscribed",
          tickers: [...clientSubs],
        }));
      } else if (msg.action === "unsubscribe" && Array.isArray(msg.tickers)) {
        // Client wants to unsubscribe
        const clientSubs = clients.get(ws)!;
        for (const ticker of msg.tickers) {
          clientSubs.delete(ticker.toUpperCase());
        }
        updateTiingoSubscription();

        ws.send(JSON.stringify({
          type: "unsubscribed",
          tickers: msg.tickers,
        }));
      } else if (msg.action === "ping") {
        ws.send(JSON.stringify({ type: "pong", timestamp: Date.now() }));
      }
    } catch (e) {
      console.error("Failed to parse client message:", e);
    }
  };

  ws.onclose = () => {
    clients.delete(ws);
    updateTiingoSubscription();
    console.log(`👤 Client disconnected (${clients.size} total)`);
  };

  ws.onerror = (e) => {
    console.error("Client WebSocket error:", e);
    clients.delete(ws);
  };

  // Send welcome message
  ws.send(JSON.stringify({
    type: "connected",
    message: "Connected to Market Pulse WebSocket",
    timestamp: Date.now(),
  }));
}

// Start WebSocket server
Deno.serve({ port: PORT }, (req) => {
  const url = new URL(req.url);

  // Health check endpoint
  if (url.pathname === "/health") {
    return new Response(JSON.stringify({
      status: "ok",
      clients: clients.size,
      tickers: [...subscribedTickers],
      tiingoConnected: tiingoWs?.readyState === WebSocket.OPEN,
    }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  // WebSocket upgrade
  if (url.pathname === "/ws") {
    const upgrade = req.headers.get("upgrade") || "";
    if (upgrade.toLowerCase() !== "websocket") {
      return new Response("Expected WebSocket", { status: 426 });
    }

    const { socket, response } = Deno.upgradeWebSocket(req);
    handleClient(socket);
    return response;
  }

  return new Response("Market Pulse WebSocket Server", { status: 200 });
});

// Connect to Tiingo on startup
console.log(`🚀 WebSocket server starting on port ${PORT}`);
connectToTiingo();
