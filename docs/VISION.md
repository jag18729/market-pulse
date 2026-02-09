# Market Pulse - Vision Document

> *"I choose a lazy person to do a hard job. Because a lazy person will find an easy way to do it."*
> — **Bill Gates**

---

## 🎯 Mission

Wake up smarter than Wall Street. Every morning at 6 AM, receive a personalized market brief in your inbox — synthesized moments before delivery, not stale overnight content.

---

## 🌅 Core Experience

```
5:55 AM  ──►  System wakes, pulls fresh data
              │
              ├─ Pre-market futures & movers
              ├─ Overnight news & earnings
              ├─ Your watchlist positions
              ├─ Triggered price alerts
              │
5:59 AM  ──►  AI synthesizes personalized brief
              │
6:00 AM  ──►  Email lands in your inbox
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
| Read-only | Click to drill down on any ticker |

---

## 🏗️ Architecture

### Frontend (stocks.vandine.us)
```
React + Tailwind + Vite
├── Landing page (email signup CTA)
├── Dashboard (after login)
│   ├── Watchlist management
│   ├── Alert configuration
│   ├── Brief archive
│   └── Settings
└── Auth (email magic link or password)
```

### Backend (Deno on pi1)
```
Deno + Hono + PostgreSQL
├── /api/auth/* - Signup, login, verify
├── /api/watchlist/* - Ticker management
├── /api/alerts/* - Price/volume alerts
├── /api/briefs/* - Archive & preferences
└── /api/market/* - Real-time data proxy
```

### Email Delivery (Resend)
```
Resend API
├── Transactional: Welcome, verify, password reset
├── Marketing: Daily briefs (6 AM cron)
└── Templates: React Email components
```

### Data Pipeline
```
┌─────────────────────────────────────────────────────────────┐
│                     DATA SOURCES                            │
├─────────────────────────────────────────────────────────────┤
│  Tiingo API           │ Prices, news, fundamentals (all-in-one) │
│  Fear & Greed Index   │ Market sentiment (optional)        │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     PROCESSING                              │
├─────────────────────────────────────────────────────────────┤
│  Cron Job (5:55 AM)   │ Trigger brief generation           │
│  Claude API           │ Synthesize personalized content    │
│  PostgreSQL           │ Users, watchlists, history         │
│  Redis                │ Rate limiting, caching             │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     DELIVERY                                │
├─────────────────────────────────────────────────────────────┤
│  Resend               │ Email delivery (transactional)     │
│  Web Dashboard        │ Archive, settings, watchlists      │
└─────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Features

### MVP (Phase 1)
- [ ] Email signup with verification
- [ ] Watchlist management (add/remove tickers)
- [ ] Morning brief generation (6 AM cron)
- [ ] Email delivery via Resend
- [ ] Brief archive in dashboard
- [ ] Unsubscribe handling

### Phase 2
- [ ] Price alerts (above/below threshold)
- [ ] Multiple delivery times
- [ ] Weekly digest option
- [ ] Referral system

### Phase 3 (Monetization)
- [ ] Free tier: 5 tickers, daily brief
- [ ] Pro tier ($5/mo): Unlimited tickers, real-time alerts
- [ ] API access for developers

---

## 📧 Sample Morning Brief (Email)

```
Subject: ☀️ Your Market Pulse — Feb 8, 2026

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 PRE-MARKET SNAPSHOT (5:59 AM PST)

  S&P 500 Futures    +0.34%  │  4,892
  Nasdaq Futures     +0.51%  │  17,234
  10Y Treasury       4.12%   │  ▼2bp
  VIX                14.2    │  -0.8

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 YOUR WATCHLIST

  NVDA    $742.50  +2.1%   🔥 Earnings beat expectations
  AMD     $183.20  +0.8%   Following NVDA higher
  AAPL    $189.30  -0.2%   Quiet pre-market
  TSLA    $201.40  -3.1%   ⚠️ China demand concerns

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🚨 TRIGGERED ALERTS

  ✓ AMD crossed your $180 target (set Jan 15)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📰 OVERNIGHT NEWS

  • NVDA Q4 crushes estimates, data center up 400% YoY
  • Fed minutes today at 2PM — watch for rate path hints
  • Tesla pauses Berlin expansion amid softening demand

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🧠 AI TAKE

Strong day ahead for semis. NVDA earnings lifting the
sector. Watch Fed minutes for volatility. Your TSLA
position may see pressure.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Manage Watchlist]  [View Full Brief]  [Unsubscribe]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Market Pulse by vandine.us
```

---

## 🔐 Infrastructure

### Reuse Existing
- React + Tailwind frontend patterns
- Deno + Hono backend
- PostgreSQL database
- Cloudflare Pages + Tunnel
- Resend (already set up for GitHub alerts)

### New Components
- Email templates (React Email)
- Cron job for brief generation
- Finnhub API integration
- Claude API for synthesis

---

## 📅 Timeline

| Phase | Target | Deliverables |
|-------|--------|--------------|
| Design | Feb 10-14 | Wireframes, email templates, DB schema |
| MVP | Feb 15-28 | Auth, watchlists, email delivery, basic brief |
| Polish | Mar 1-15 | Alerts, archive UI, landing page |
| Launch | Mar 15+ | Public beta, iterate on feedback |

---

## 💰 Unit Economics (Future)

| Tier | Price | Features |
|------|-------|----------|
| Free | $0 | 5 tickers, daily brief |
| Pro | $5/mo | Unlimited tickers, alerts, API |
| Team | $20/mo | Multiple portfolios, sharing |

**Break-even:** ~100 Pro subscribers covers Resend + API costs

---

## 🔑 API Keys Needed

| Service | Purpose | Cost |
|---------|---------|------|
| Tiingo | Prices, news, fundamentals | Free tier (500/day) |
| Resend | Email delivery | Free tier (3k/mo), then $20/mo |
| Anthropic | Brief synthesis | Per-token (~$0.01/brief) |

---

*Last updated: 2026-02-08*
