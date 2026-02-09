# Data Sources

Market Pulse uses **only legitimate, documented APIs** for financial data. No web scraping.

## Primary: Tiingo API

**Website:** https://api.tiingo.com

| Endpoint | Data | Use Case |
|----------|------|----------|
| `/tiingo/daily/{ticker}/prices` | EOD prices, OHLCV | Historical charts |
| `/iex/{ticker}/prices` | Real-time IEX quotes | Current prices |
| `/tiingo/news` | News with ticker tags | Morning brief |
| `/tiingo/fundamentals/{ticker}/daily` | Market cap, P/E | Company metrics |
| `/tiingo/crypto/prices` | Crypto prices | BTC/ETH tracking |
| WebSocket `wss://api.tiingo.com/iex` | Streaming prices | Real-time dashboard |

**Pricing:**
- Free: 500 unique symbols/day, 50 requests/hour
- Starter ($10/mo): 10,000 requests/day
- Power ($30/mo): 100,000 requests/day

**Python Client:** `pip install tiingo` ([GitHub](https://github.com/hydrosquall/tiingo-python))

## Email Delivery: Resend

**Website:** https://resend.com

| Feature | Use Case |
|---------|----------|
| Transactional emails | Verification, password reset |
| Marketing emails | Morning briefs |
| React Email templates | Beautiful HTML emails |

**Pricing:**
- Free: 3,000 emails/month
- Pro ($20/mo): 50,000 emails/month

## AI Synthesis: Anthropic Claude

**Website:** https://anthropic.com

| Model | Use Case | Cost |
|-------|----------|------|
| Claude 3.5 Sonnet | Brief synthesis | ~$0.003/1K input, $0.015/1K output |

Estimated cost per brief: ~$0.01

## Optional: Fear & Greed Index

**Source:** CNN Business (public endpoint)

Provides market sentiment indicator (0-100 scale).

## Future: Brokerage Sync (Plaid)

**Website:** https://plaid.com

When we add portfolio sync:
- Connects to 12,000+ institutions (Fidelity, Schwab, etc.)
- Handles OAuth, security, compliance
- ~$0.30/connection/month

---

## Why No Scraping?

| Approach | Problems |
|----------|----------|
| Web scraping | ToS violations, IP bans, HTML changes break code, legal risk |
| Dark web | Sketchy data quality, legal issues, no financial data there anyway |
| **APIs** | Documented, reliable, legal, supported |

Tiingo provides everything we need:
- ✅ Real-time prices
- ✅ Historical data
- ✅ News (auto-tagged by ticker)
- ✅ Fundamentals
- ✅ WebSocket streaming
- ✅ Python client with pandas support

---

## API Key Setup

### 1. Tiingo
1. Sign up at https://api.tiingo.com
2. Get API key from dashboard
3. Add to 1Password: `op://Infrastructure/Tiingo/credential`

### 2. Resend
1. Sign up at https://resend.com
2. Create API key
3. Verify domain (stocks.vandine.us)
4. Add to 1Password: `op://Infrastructure/Resend/credential`

### 3. Anthropic
1. Sign up at https://console.anthropic.com
2. Create API key
3. Add to 1Password: `op://Infrastructure/Anthropic API Key/credential`

---

## Environment Variables

```bash
# Required
TIINGO_API_KEY=your_tiingo_key
RESEND_API_KEY=re_your_resend_key
ANTHROPIC_API_KEY=sk-ant-your_key

# Optional
DATABASE_URL=postgresql://user:pass@host:5432/marketpulse
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_secret
```

---

## Rate Limits

| Service | Free Tier | Recommended |
|---------|-----------|-------------|
| Tiingo | 50 req/hr, 500 symbols/day | Cache aggressively |
| Resend | 3,000 emails/mo | Batch users by timezone |
| Anthropic | Pay-per-use | Keep prompts concise |

### Caching Strategy

```
Request flow:
1. Check Redis cache (TTL: 60s for prices, 5min for news)
2. If miss, fetch from Tiingo
3. Store in Redis
4. Return to client
```

This keeps us well within rate limits even at scale.
