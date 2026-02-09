// Brief generation service

interface MarketData {
  futures: {
    sp500: { value: number; change: number };
    nasdaq: { value: number; change: number };
    vix: { value: number; change: number };
  };
  watchlist: Array<{
    symbol: string;
    price: number;
    change: number;
    note?: string;
  }>;
  alerts: Array<{
    symbol: string;
    message: string;
  }>;
  news: Array<{
    headline: string;
  }>;
  aiTake: string;
}

export function generateBriefHtml(data: MarketData): string {
  const time = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  });

  const watchlistRows = data.watchlist
    .map((t) => {
      const changeColor = t.change >= 0 ? "#22c55e" : "#ef4444";
      const changeSign = t.change >= 0 ? "+" : "";
      return `
        <tr>
          <td style="padding: 8px 0; font-weight: bold;">${t.symbol}</td>
          <td style="padding: 8px 0;">$${t.price.toFixed(2)}</td>
          <td style="padding: 8px 0; color: ${changeColor};">${changeSign}${t.change.toFixed(1)}%</td>
          <td style="padding: 8px 0; color: #666;">${t.note || ""}</td>
        </tr>
      `;
    })
    .join("");

  const alertsList = data.alerts
    .map((a) => `<li style="margin: 4px 0;">✓ ${a.symbol}: ${a.message}</li>`)
    .join("");

  const newsList = data.news
    .map((n) => `<li style="margin: 4px 0;">${n.headline}</li>`)
    .join("");

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f9fafb; margin: 0; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden;">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #1f2937 0%, #111827 100%); color: white; padding: 24px; text-align: center;">
          <h1 style="margin: 0; font-size: 24px;">📈 Market Pulse</h1>
          <p style="margin: 8px 0 0; opacity: 0.8; font-size: 14px;">Pre-market snapshot as of ${time}</p>
        </div>

        <!-- Futures -->
        <div style="padding: 24px; border-bottom: 1px solid #e5e7eb;">
          <h2 style="margin: 0 0 16px; font-size: 16px; color: #374151;">📊 FUTURES</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0;">S&P 500</td>
              <td style="padding: 8px 0; text-align: right;">${data.futures.sp500.value.toLocaleString()}</td>
              <td style="padding: 8px 0; text-align: right; color: ${data.futures.sp500.change >= 0 ? "#22c55e" : "#ef4444"};">
                ${data.futures.sp500.change >= 0 ? "+" : ""}${data.futures.sp500.change.toFixed(2)}%
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0;">Nasdaq</td>
              <td style="padding: 8px 0; text-align: right;">${data.futures.nasdaq.value.toLocaleString()}</td>
              <td style="padding: 8px 0; text-align: right; color: ${data.futures.nasdaq.change >= 0 ? "#22c55e" : "#ef4444"};">
                ${data.futures.nasdaq.change >= 0 ? "+" : ""}${data.futures.nasdaq.change.toFixed(2)}%
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0;">VIX</td>
              <td style="padding: 8px 0; text-align: right;">${data.futures.vix.value.toFixed(1)}</td>
              <td style="padding: 8px 0; text-align: right; color: ${data.futures.vix.change <= 0 ? "#22c55e" : "#ef4444"};">
                ${data.futures.vix.change >= 0 ? "+" : ""}${data.futures.vix.change.toFixed(1)}
              </td>
            </tr>
          </table>
        </div>

        <!-- Watchlist -->
        <div style="padding: 24px; border-bottom: 1px solid #e5e7eb;">
          <h2 style="margin: 0 0 16px; font-size: 16px; color: #374151;">🎯 YOUR WATCHLIST</h2>
          <table style="width: 100%; border-collapse: collapse;">
            ${watchlistRows}
          </table>
        </div>

        <!-- Alerts -->
        ${data.alerts.length > 0 ? `
        <div style="padding: 24px; border-bottom: 1px solid #e5e7eb; background: #fef3c7;">
          <h2 style="margin: 0 0 16px; font-size: 16px; color: #92400e;">🚨 TRIGGERED ALERTS</h2>
          <ul style="margin: 0; padding-left: 20px; color: #92400e;">
            ${alertsList}
          </ul>
        </div>
        ` : ""}

        <!-- News -->
        <div style="padding: 24px; border-bottom: 1px solid #e5e7eb;">
          <h2 style="margin: 0 0 16px; font-size: 16px; color: #374151;">📰 OVERNIGHT NEWS</h2>
          <ul style="margin: 0; padding-left: 20px; color: #4b5563;">
            ${newsList}
          </ul>
        </div>

        <!-- AI Take -->
        <div style="padding: 24px; background: #f0fdf4; border-bottom: 1px solid #e5e7eb;">
          <h2 style="margin: 0 0 16px; font-size: 16px; color: #166534;">🧠 AI TAKE</h2>
          <p style="margin: 0; color: #166534; line-height: 1.6;">${data.aiTake}</p>
        </div>

        <!-- Footer -->
        <div style="padding: 24px; text-align: center; color: #9ca3af; font-size: 12px;">
          <a href="https://stocks.vandine.us/dashboard" style="color: #22c55e; text-decoration: none; margin: 0 8px;">Manage Watchlist</a>
          |
          <a href="https://stocks.vandine.us/settings" style="color: #22c55e; text-decoration: none; margin: 0 8px;">Settings</a>
          |
          <a href="https://stocks.vandine.us/unsubscribe" style="color: #9ca3af; text-decoration: none; margin: 0 8px;">Unsubscribe</a>
          <p style="margin: 16px 0 0;">Market Pulse by vandine.us</p>
        </div>

      </div>
    </body>
    </html>
  `;
}

export function generateBriefText(data: MarketData): string {
  const time = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  });

  const watchlistText = data.watchlist
    .map((t) => {
      const sign = t.change >= 0 ? "+" : "";
      return `  ${t.symbol.padEnd(6)} $${t.price.toFixed(2).padStart(8)}  ${sign}${t.change.toFixed(1)}%  ${t.note || ""}`;
    })
    .join("\n");

  const alertsText = data.alerts.map((a) => `  ✓ ${a.symbol}: ${a.message}`).join("\n");
  const newsText = data.news.map((n) => `  • ${n.headline}`).join("\n");

  return `
☀️ MARKET PULSE — ${time}
════════════════════════════════════════

📊 FUTURES
  S&P 500    ${data.futures.sp500.value.toLocaleString().padStart(8)}  ${data.futures.sp500.change >= 0 ? "+" : ""}${data.futures.sp500.change.toFixed(2)}%
  Nasdaq     ${data.futures.nasdaq.value.toLocaleString().padStart(8)}  ${data.futures.nasdaq.change >= 0 ? "+" : ""}${data.futures.nasdaq.change.toFixed(2)}%
  VIX        ${data.futures.vix.value.toFixed(1).padStart(8)}  ${data.futures.vix.change >= 0 ? "+" : ""}${data.futures.vix.change.toFixed(1)}

🎯 YOUR WATCHLIST
${watchlistText}

${data.alerts.length > 0 ? `🚨 TRIGGERED ALERTS\n${alertsText}\n` : ""}
📰 OVERNIGHT NEWS
${newsText}

🧠 AI TAKE
${data.aiTake}

════════════════════════════════════════
Manage: https://stocks.vandine.us/dashboard
Unsubscribe: https://stocks.vandine.us/unsubscribe
  `.trim();
}
