# Market Pulse - Vision Document

> *"I choose a lazy person to do a hard job. Because a lazy person will find an easy way to do it."*
> — **Bill Gates**

> *"The advance of technology is based on making it fit in so that you don't really even notice it, so it's part of everyday life."*
> — **Bill Gates**

---

## 🎯 Mission

Wake up smarter than Wall Street. Every morning at 6 AM, receive a personalized market brief synthesized moments before delivery — not stale overnight compilations, but fresh intelligence pulled and analyzed in real-time.

---

## 🌅 Core Experience

```
5:55 AM  ──►  AI wakes, pulls fresh data
              │
              ├─ Pre-market futures & movers
              ├─ Overnight news & earnings
              ├─ Your watchlist positions
              ├─ Triggered price alerts
              ├─ Sentiment analysis
              │
5:59 AM  ──►  Claude synthesizes the brief
              │
6:00 AM  ──►  Telegram delivers your personalized report
```

**You open your eyes. Your market brief is waiting.**

---

## 💡 Differentiators

| Morning Brew / TLDR | Market Pulse |
|---------------------|--------------|
| Written by humans overnight | AI-generated at 5:59 AM |
| Same content for everyone | Personalized to YOUR watchlist |
| Stale by delivery time | Data pulled moments before |
| Generic market coverage | YOUR tickers, YOUR alerts |
| Read-only newsletter | Interactive: reply to ask questions |

---

## 🏗️ Architecture

### Frontend (stocks.vandine.us)
```
React + Tailwind + Vite
├── Landing page (sign up CTA)
├── Dashboard
│   ├── Watchlist management
│   ├── Alert configuration
│   ├── Conviction tracker
│   └── Newsletter archive
├── Settings
│   ├── Telegram connection
│   ├── Delivery time preference
│   └── Alert thresholds
└── Auth (email + OAuth)
```

### Backend (Deno on pi1)
```
Deno + Hono + PostgreSQL
├── /api/auth/* - User management
├── /api/watchlist/* - Ticker management
├── /api/alerts/* - Price/volume/news alerts
├── /api/conviction/* - Position tracking
├── /api/newsletter/* - Archive & preferences
└── /api/market/* - Real-time data proxy
```

### Data Pipeline
```
┌─────────────────────────────────────────────────────────────┐
│                     DATA SOURCES                            │
├─────────────────────────────────────────────────────────────┤
│  Finnhub API          │ Real-time quotes, pre-market       │
│  Alpha Vantage        │ Historical, fundamentals           │
│  NewsAPI / NewsData   │ Headlines, sentiment               │
│  Reddit API           │ r/wallstreetbets, r/stocks         │
│  Twitter/X API        │ $CASHTAG mentions (optional)       │
│  SEC EDGAR            │ Insider trades, 13F filings        │
│  Fear & Greed Index   │ Market sentiment                   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     PROCESSING                              │
├─────────────────────────────────────────────────────────────┤
│  Collector Service    │ WebSocket + REST polling           │
│  Redis                │ Real-time cache, pub/sub           │
│  PostgreSQL           │ User data, watchlists, history     │
│  Vector               │ Logs → Loki                        │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     INTELLIGENCE                            │
├─────────────────────────────────────────────────────────────┤
│  OpenClaw + Claude    │ Newsletter generation              │
│  Cron (5:55 AM)       │ Trigger morning brief              │
│  Alert Engine         │ Price/volume/news triggers         │
│  Sentiment Analyzer   │ News + social scoring              │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     DELIVERY                                │
├─────────────────────────────────────────────────────────────┤
│  Telegram Bot         │ Morning briefs, alerts             │
│  Web Dashboard        │ Archive, settings, watchlists      │
│  Email (optional)     │ Weekly digest                      │
└─────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Features

### MVP (Phase 1)
- [ ] User signup/login (reuse GuardQuote auth)
- [ ] Watchlist management (add/remove tickers)
- [ ] Telegram bot connection
- [ ] Morning brief generation (6 AM cron)
- [ ] Basic price alerts

### Phase 2
- [ ] Conviction tracker (position size, entry price, thesis)
- [ ] News-based alerts ("TSLA mentioned in WSJ")
- [ ] Sentiment scoring (bullish/bearish gauge)
- [ ] Interactive Telegram replies ("What's moving?")

### Phase 3
- [ ] Portfolio sync (Robinhood, Schwab APIs)
- [ ] Social features (share watchlists)
- [ ] Whale tracking (13F filings, insider trades)
- [ ] Options flow alerts
- [ ] Earnings calendar integration

---

## 📱 Sample Morning Brief

```
☀️ Good morning, Rafa — February 8, 2026

📊 PRE-MARKET SNAPSHOT (5:59 AM PST)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
S&P 500 Futures    +0.34%  │  4,892
Nasdaq Futures     +0.51%  │  17,234
10Y Treasury       4.12%   │  ▼2bp
VIX                14.2    │  -0.8
Bitcoin            $52,340 │  +1.2%

🎯 YOUR WATCHLIST
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
NVDA    $742.50  +2.1% pre  │ 🔥 Earnings beat!
AMD     $183.20  +0.8% pre  │ Following NVDA
AAPL    $189.30  -0.2% pre  │ Quiet
TSLA    $201.40  -3.1% pre  │ ⚠️ China concerns

🚨 TRIGGERED ALERTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ AMD crossed $180 target (set Jan 15)
✓ NVDA volume spike: 3.2M pre-market

📰 OVERNIGHT NEWS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• NVDA Q4 beats estimates, data center revenue +400% YoY
• Fed minutes today at 2PM EST — watch for rate hints
• Tesla pauses Berlin expansion amid demand concerns
• Apple Vision Pro sales tracking below expectations

🧠 AI TAKE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Strong day ahead for semis. NVDA earnings lift the sector.
Watch Fed minutes for volatility. Your TSLA position may
see pressure — consider your stop-loss at $195.

Reply with a ticker for instant quote. 📈
```

---

## 🔐 Infrastructure

### Reuse from GuardQuote
- React + Tailwind frontend
- Deno + Hono backend
- PostgreSQL database
- Cloudflare Pages + Tunnel
- JWT auth flow
- Admin dashboard patterns

### New Components
- Telegram bot (OpenClaw integration)
- WebSocket server (real-time quotes)
- Cron jobs (morning brief, alerts)
- Redis (real-time cache)
- External API integrations

---

## 📅 Timeline (Tentative)

| Phase | Target | Deliverables |
|-------|--------|--------------|
| Design | Feb 10-14 | Wireframes, DB schema, API spec |
| MVP | Feb 15-28 | Auth, watchlists, Telegram, basic brief |
| Polish | Mar 1-15 | Alerts, conviction tracker, UI polish |
| Beta | Mar 15+ | Invite friends, iterate |

---

## 💰 Potential Monetization (Future)
- Free tier: 5 tickers, daily brief
- Pro tier: Unlimited tickers, real-time alerts, sentiment
- API access for developers

---

*Last updated: 2026-02-07*
