import { Hono } from "hono";
import { cors } from "hono/cors";

const app = new Hono();

// Middleware
app.use("/*", cors({
  origin: ["http://localhost:5174", "https://stocks.vandine.us"],
  credentials: true,
}));

// Health check
app.get("/health", (c) => c.json({ status: "ok", service: "market-pulse" }));

// API routes
app.get("/api/status", (c) => {
  return c.json({
    status: "ok",
    version: "0.1.0",
    uptime: process.uptime?.() ?? 0,
  });
});

// Auth routes (placeholder)
app.post("/api/auth/login", async (c) => {
  const body = await c.req.json();
  // TODO: Implement auth
  return c.json({ message: "Login endpoint", email: body.email });
});

app.post("/api/auth/signup", async (c) => {
  const body = await c.req.json();
  // TODO: Implement auth
  return c.json({ message: "Signup endpoint", email: body.email });
});

// Watchlist routes (placeholder)
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

// Market data routes (placeholder)
app.get("/api/market/quote/:symbol", async (c) => {
  const symbol = c.req.param("symbol");
  // TODO: Fetch from Finnhub
  return c.json({
    symbol,
    price: 100.00,
    change: 1.5,
    changePercent: 1.52,
    volume: 1000000,
  });
});

app.get("/api/market/news", (c) => {
  // TODO: Fetch market news
  return c.json({
    articles: [
      { title: "Market opens higher", source: "Reuters", timestamp: new Date().toISOString() },
    ],
  });
});

// Alerts routes (placeholder)
app.get("/api/alerts", (c) => {
  // TODO: Get user's alerts
  return c.json({ alerts: [] });
});

app.post("/api/alerts", async (c) => {
  const body = await c.req.json();
  // TODO: Create alert
  return c.json({ message: "Alert created", alert: body });
});

// Start server
const port = parseInt(Deno.env.get("PORT") ?? "3003");
console.log(`🚀 Market Pulse API running on port ${port}`);
Deno.serve({ port }, app.fetch);
