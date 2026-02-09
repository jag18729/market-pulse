# Market Pulse 📈

> Wake up smarter than Wall Street.

AI-powered morning market briefs delivered to your inbox at 6 AM — personalized to your watchlist, synthesized moments before delivery.

## Features

- **Personalized Briefs** — Your watchlist, your schedule
- **Fresh Data** — Pulled at 5:59 AM, not stale overnight content  
- **Smart Alerts** — Price thresholds that notify you
- **Zero Friction** — Sign up with email, done

## Stack

| Layer | Tech |
|-------|------|
| Frontend | React + Tailwind + Vite |
| Backend | Deno + Hono |
| Database | PostgreSQL |
| Email | Resend |
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
└── .github/            # CI/CD workflows
```

## Environment Variables

```bash
# Backend
DATABASE_URL=postgresql://user:pass@localhost:5432/marketpulse
RESEND_API_KEY=re_xxxxx
FINNHUB_API_KEY=xxxxx
ANTHROPIC_API_KEY=xxxxx
JWT_SECRET=xxxxx

# Frontend
VITE_API_URL=http://localhost:3003
```

## Roadmap

- [x] Project setup
- [ ] Email signup + verification
- [ ] Watchlist management
- [ ] Morning brief generation (6 AM cron)
- [ ] Email delivery via Resend
- [ ] Price alerts
- [ ] Pro tier ($5/mo)

## License

MIT

---

*Part of the vandine.us infrastructure*
