import { Hono } from "hono";
import { cors } from "hono/cors";

const app = new Hono();

// Middleware
app.use("/*", cors({
  origin: ["http://localhost:5174", "https://stocks.vandine.us"],
  credentials: true,
}));

// Health check
app.get("/health", (c) => c.json({ 
  status: "ok", 
  service: "market-pulse",
  version: "0.1.0",
}));

// ============================================================
// AUTH ROUTES
// ============================================================

app.post("/api/auth/signup", async (c) => {
  const body = await c.req.json();
  // TODO: Implement signup with email verification
  return c.json({ message: "Signup endpoint", email: body.email });
});

app.post("/api/auth/login", async (c) => {
  const body = await c.req.json();
  // TODO: Implement login
  return c.json({ message: "Login endpoint", email: body.email });
});

app.post("/api/auth/verify", async (c) => {
  const body = await c.req.json();
  // TODO: Verify email token
  return c.json({ message: "Verify endpoint", token: body.token });
});

// ============================================================
// WATCHLIST ROUTES
// ============================================================

app.get("/api/watchlist", (c) => {
  // TODO: Get user's watchlist from DB
  return c.json({
    tickers: [
      { symbol: "NVDA", name: "NVIDIA Corp" },
      { symbol: "AMD", name: "Advanced Micro Devices" },
      { symbol: "AAPL", name: "Apple Inc" },
    ],
  });
});

app.post("/api/watchlist", async (c) => {
  const body = await c.req.json();
  // TODO: Add ticker to watchlist
  return c.json({ message: "Added to watchlist", symbol: body.symbol });
});

app.delete("/api/watchlist/:symbol", (c) => {
  const symbol = c.req.param("symbol");
  // TODO: Remove ticker from watchlist
  return c.json({ message: "Removed from watchlist", symbol });
});

// ============================================================
// HOLDINGS (PORTFOLIO) ROUTES
// ============================================================

app.get("/api/holdings", (c) => {
  // TODO: Get user's holdings from DB with P&L
  return c.json({
    summary: {
      totalValue: 125000,
      totalCost: 100000,
      totalGainLoss: 25000,
      totalGainLossPercent: 25,
      dayChange: 1500,
      dayChangePercent: 1.2,
    },
    holdings: [
      {
        symbol: "NVDA",
        shares: 50,
        avgPrice: 450,
        costBasis: 22500,
        currentPrice: 742.5,
        currentValue: 37125,
        gainLoss: 14625,
        gainLossPercent: 65,
      },
      {
        symbol: "AAPL",
        shares: 100,
        avgPrice: 150,
        costBasis: 15000,
        currentPrice: 189.3,
        currentValue: 18930,
        gainLoss: 3930,
        gainLossPercent: 26.2,
      },
    ],
  });
});

app.post("/api/holdings", async (c) => {
  const body = await c.req.json();
  // Validate required fields
  if (!body.symbol || !body.shares || !body.avgPrice) {
    return c.json({ error: "Missing required fields: symbol, shares, avgPrice" }, 400);
  }
  
  const costBasis = body.shares * body.avgPrice;
  
  // TODO: Save to DB
  return c.json({
    message: "Holding added",
    holding: {
      symbol: body.symbol.toUpperCase(),
      shares: body.shares,
      avgPrice: body.avgPrice,
      costBasis,
      notes: body.notes,
      acquiredAt: body.acquiredAt,
    },
  });
});

app.put("/api/holdings/:symbol", async (c) => {
  const symbol = c.req.param("symbol");
  const body = await c.req.json();
  // TODO: Update holding in DB
  return c.json({ message: "Holding updated", symbol, ...body });
});

app.delete("/api/holdings/:symbol", (c) => {
  const symbol = c.req.param("symbol");
  // TODO: Delete holding from DB
  return c.json({ message: "Holding removed", symbol });
});

// ============================================================
// MARKET DATA ROUTES
// ============================================================

app.get("/api/market/quote/:symbol", async (c) => {
  const symbol = c.req.param("symbol");
  // TODO: Fetch from Tiingo
  return c.json({
    symbol: symbol.toUpperCase(),
    price: 100.00,
    change: 1.5,
    changePercent: 1.52,
    volume: 1000000,
    high: 101.50,
    low: 98.75,
    open: 99.00,
    previousClose: 98.50,
  });
});

app.get("/api/market/quotes", async (c) => {
  const symbols = c.req.query("symbols")?.split(",") || [];
  // TODO: Batch fetch from Tiingo
  return c.json({
    quotes: symbols.map((s) => ({
      symbol: s.toUpperCase(),
      price: 100 + Math.random() * 50,
      changePercent: (Math.random() - 0.5) * 10,
    })),
  });
});

app.get("/api/market/news", (c) => {
  const tickers = c.req.query("tickers")?.split(",");
  // TODO: Fetch from Tiingo
  return c.json({
    articles: [
      {
        id: 1,
        title: "NVDA Q4 beats estimates, data center revenue up 400% YoY",
        source: "Reuters",
        url: "https://example.com/nvda",
        tickers: ["NVDA"],
        publishedAt: new Date().toISOString(),
      },
    ],
  });
});

// ============================================================
// ALERTS ROUTES
// ============================================================

app.get("/api/alerts", (c) => {
  // TODO: Get user's alerts
  return c.json({
    alerts: [
      {
        id: "1",
        symbol: "AMD",
        type: "price_above",
        threshold: 180,
        status: "triggered",
        triggeredAt: "2026-02-08T14:30:00Z",
      },
    ],
  });
});

app.post("/api/alerts", async (c) => {
  const body = await c.req.json();
  // TODO: Create alert in DB
  return c.json({ message: "Alert created", alert: body });
});

app.delete("/api/alerts/:id", (c) => {
  const id = c.req.param("id");
  // TODO: Delete alert
  return c.json({ message: "Alert deleted", id });
});

// ============================================================
// BRIEFS ROUTES
// ============================================================

app.get("/api/briefs", (c) => {
  // TODO: Get user's brief history
  return c.json({
    briefs: [
      {
        id: "1",
        subject: "☀️ Your Market Pulse — Feb 8, 2026",
        deliveredAt: "2026-02-08T06:00:00Z",
        openedAt: "2026-02-08T06:45:00Z",
      },
    ],
  });
});

app.get("/api/briefs/:id", (c) => {
  const id = c.req.param("id");
  // TODO: Get specific brief content
  return c.json({
    id,
    subject: "☀️ Your Market Pulse — Feb 8, 2026",
    contentHtml: "<h1>Your brief...</h1>",
    contentText: "Your brief...",
    deliveredAt: "2026-02-08T06:00:00Z",
  });
});

// ============================================================
// SETTINGS ROUTES
// ============================================================

app.get("/api/settings", (c) => {
  // TODO: Get user settings
  return c.json({
    briefTime: "06:00",
    timezone: "America/Los_Angeles",
    emailVerified: true,
  });
});

app.put("/api/settings", async (c) => {
  const body = await c.req.json();
  // TODO: Update user settings
  return c.json({ message: "Settings updated", ...body });
});

// Start server
const port = parseInt(Deno.env.get("PORT") ?? "3003");
console.log(`🚀 Market Pulse API running on port ${port}`);
console.log(`📊 Endpoints: /api/watchlist, /api/holdings, /api/market, /api/alerts, /api/briefs`);
Deno.serve({ port }, app.fetch);
