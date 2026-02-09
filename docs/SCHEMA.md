# Database Schema

## PostgreSQL Tables

### users
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  telegram_chat_id BIGINT,
  telegram_username VARCHAR(255),
  brief_time TIME DEFAULT '06:00:00',
  timezone VARCHAR(50) DEFAULT 'America/Los_Angeles',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_telegram ON users(telegram_chat_id);
```

### watchlist
```sql
CREATE TABLE watchlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  symbol VARCHAR(10) NOT NULL,
  name VARCHAR(255),
  added_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, symbol)
);

CREATE INDEX idx_watchlist_user ON watchlist(user_id);
```

### alerts
```sql
CREATE TYPE alert_type AS ENUM ('price_above', 'price_below', 'volume_spike', 'news_mention');
CREATE TYPE alert_status AS ENUM ('active', 'triggered', 'disabled');

CREATE TABLE alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  symbol VARCHAR(10) NOT NULL,
  type alert_type NOT NULL,
  threshold DECIMAL(15, 4),
  status alert_status DEFAULT 'active',
  triggered_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_alerts_user ON alerts(user_id);
CREATE INDEX idx_alerts_symbol ON alerts(symbol);
CREATE INDEX idx_alerts_status ON alerts(status);
```

### convictions
```sql
CREATE TABLE convictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  symbol VARCHAR(10) NOT NULL,
  shares DECIMAL(15, 4),
  entry_price DECIMAL(15, 4),
  target_price DECIMAL(15, 4),
  stop_loss DECIMAL(15, 4),
  thesis TEXT,
  opened_at DATE DEFAULT CURRENT_DATE,
  closed_at DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_convictions_user ON convictions(user_id);
```

### briefs
```sql
CREATE TABLE briefs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  delivered_at TIMESTAMP,
  opened_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_briefs_user ON briefs(user_id);
CREATE INDEX idx_briefs_created ON briefs(created_at);
```

## Redis Keys

### Real-time cache
```
quote:{symbol}          # Latest quote data (TTL: 60s)
news:latest             # Recent news articles (TTL: 300s)
futures:snapshot        # Index futures (TTL: 60s)
sentiment:{symbol}      # Sentiment score (TTL: 3600s)
```

### User sessions
```
session:{token}         # User session data (TTL: 86400s)
```

### Rate limiting
```
ratelimit:{user_id}     # API rate limit counter (TTL: 60s)
```

## Migrations

Store in `backend/migrations/`:

```
001_create_users.sql
002_create_watchlist.sql
003_create_alerts.sql
004_create_convictions.sql
005_create_briefs.sql
```
