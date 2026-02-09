# Market Pulse 📈

> Wake up smarter than Wall Street.

AI-powered morning market briefs delivered to your inbox at 6 AM — personalized to your watchlist, synthesized moments before delivery.

## Features

- **Personalized Briefs** — Your watchlist + holdings, your schedule
- **Fresh Data** — Pulled at 5:59 AM, not stale overnight content
- **Portfolio Tracking** — Manual entry with real-time P&L
- **Smart Alerts** — Price thresholds that notify you
- **Real-time Updates** — WebSocket streaming for live prices
- **Zero Friction** — Sign up with email, done

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      DATA LAYER                             │
│  Tiingo API (prices, news, fundamentals, WebSocket)        │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────▼───────────────────────────────┐
│                    DOCKER SERVICES                          │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐       │
│  │   API   │  │   WS    │  │ Postgres│  │  Redis  │       │
│  │  :3003  │  │  :3004  │  │  :5433  │  │  :6380  │       │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘       │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────▼───────────────────────────────┐
│                      DELIVERY                               │
│  Resend → User's inbox @ 6 AM                              │
└─────────────────────────────────────────────────────────────┘
```

## Quick Start

```bash
# Clone
git clone https://github.com/jag18729/market-pulse.git
cd market-pulse

# Configure
cp .env.example .env
# Edit .env with your API keys

# Start services
docker-compose up -d

# Frontend dev
cd frontend
npm install
npm run dev
```

## Services

| Service | Port | Description |
|---------|------|-------------|
| API | 3003 | REST API (Deno + Hono) |
| WebSocket | 3004 | Real-time price streaming |
| PostgreSQL | 5433 | User data, holdings, briefs |
| Redis | 6380 | Cache, WebSocket pub/sub |

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Create account |
| POST | `/api/auth/login` | Login |
| GET | `/api/watchlist` | Get watchlist |
| POST | `/api/watchlist` | Add ticker |
| GET | `/api/holdings` | Get portfolio with P&L |
| POST | `/api/holdings` | Add position |
| GET | `/api/market/quote/:symbol` | Get quote |
| GET | `/api/alerts` | Get alerts |
| GET | `/api/briefs` | Get brief history |

## WebSocket

Connect to `ws://localhost:3004/ws`

```javascript
const ws = new WebSocket('ws://localhost:3004/ws');

// Subscribe to tickers
ws.send(JSON.stringify({
  action: 'subscribe',
  tickers: ['NVDA', 'AMD', 'AAPL']
}));

// Receive real-time updates
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log(data.ticker, data.price);
};
```

## Data Sources

All data comes from **legitimate APIs only** — no scraping.

| Source | Data | Docs |
|--------|------|------|
| Tiingo | Prices, news, fundamentals | [api.tiingo.com](https://api.tiingo.com) |
| Resend | Email delivery | [resend.com](https://resend.com) |
| Anthropic | AI brief synthesis | [anthropic.com](https://anthropic.com) |

See [docs/DATA-SOURCES.md](docs/DATA-SOURCES.md) for details.

## Environment Variables

```bash
# Required
TIINGO_API_KEY=xxx        # api.tiingo.com
RESEND_API_KEY=re_xxx     # resend.com
ANTHROPIC_API_KEY=sk-xxx  # anthropic.com
JWT_SECRET=xxx            # openssl rand -hex 32

# Database
DB_PASSWORD=xxx
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
```

## Roadmap

- [x] Project setup
- [x] Docker compose (API, WS, Postgres, Redis)
- [x] WebSocket server (Tiingo streaming)
- [x] Holdings/portfolio service
- [ ] Email signup + verification
- [ ] Morning brief generation (6 AM cron)
- [ ] Email delivery via Resend
- [ ] Price alerts
- [ ] Pro tier ($5/mo)

## License

MIT

---

*Part of the vandine.us infrastructure*
