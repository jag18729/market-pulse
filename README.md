# Market Pulse 📈

> Wake up smarter than Wall Street.

AI-powered morning market briefs delivered via Telegram at 6 AM — personalized to your watchlist, synthesized moments before delivery.

## Features

- **Personalized Briefs** — Your watchlist, your alerts, your schedule
- **Real-Time Data** — Pulled at 5:59 AM, not stale overnight content
- **Interactive** — Reply to ask questions about any ticker
- **Conviction Tracker** — Track your positions and thesis
- **Smart Alerts** — Price, volume, and news-based triggers

## Stack

| Layer | Tech |
|-------|------|
| Frontend | React + Tailwind + Vite |
| Backend | Deno + Hono |
| Database | PostgreSQL |
| Cache | Redis |
| Delivery | Telegram Bot (OpenClaw) |
| Hosting | Cloudflare Pages + Pi Cluster |

## Quick Start

```bash
# Frontend
cd frontend
npm install
npm run dev

# Backend
cd backend
deno task dev
```

## Project Structure

```
market-pulse/
├── frontend/           # React + Tailwind
├── backend/            # Deno + Hono API
├── docs/               # Documentation
├── scripts/            # Utility scripts
└── .github/            # CI/CD workflows
```

## Environment Variables

```bash
# Backend
DATABASE_URL=postgresql://user:pass@localhost:5432/marketpulse
REDIS_URL=redis://localhost:6379
FINNHUB_API_KEY=your_key
JWT_SECRET=your_secret

# Frontend
VITE_API_URL=http://localhost:3003
```

## Roadmap

- [x] Project setup
- [ ] User auth (signup/login)
- [ ] Watchlist management
- [ ] Telegram bot connection
- [ ] Morning brief generation
- [ ] Price/volume alerts
- [ ] Conviction tracker
- [ ] News sentiment

## License

MIT

---

*Part of the vandine.us infrastructure*
