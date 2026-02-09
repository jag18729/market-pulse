// Market data service using Tiingo API
// Docs: https://api.tiingo.com/documentation/general/overview

const TIINGO_API_KEY = Deno.env.get("TIINGO_API_KEY") ?? "";
const BASE_URL = "https://api.tiingo.com";

interface TiingoPrice {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  adjOpen: number;
  adjHigh: number;
  adjLow: number;
  adjClose: number;
  adjVolume: number;
}

interface TiingoNews {
  id: number;
  title: string;
  url: string;
  description: string;
  publishedDate: string;
  tickers: string[];
  tags: string[];
  source: string;
}

interface TiingoMeta {
  ticker: string;
  name: string;
  exchangeCode: string;
  startDate: string;
  endDate: string;
  description: string;
}

const headers = {
  "Content-Type": "application/json",
  "Authorization": `Token ${TIINGO_API_KEY}`,
};

// Get ticker metadata
export async function getTickerMeta(symbol: string): Promise<TiingoMeta | null> {
  try {
    const res = await fetch(`${BASE_URL}/tiingo/daily/${symbol}`, { headers });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error(`Failed to get metadata for ${symbol}:`, error);
    return null;
  }
}

// Get latest price for a ticker
export async function getLatestPrice(symbol: string): Promise<TiingoPrice | null> {
  try {
    const res = await fetch(`${BASE_URL}/iex/${symbol}/prices`, { headers });
    if (!res.ok) {
      // Fallback to end-of-day if IEX not available
      const eodRes = await fetch(`${BASE_URL}/tiingo/daily/${symbol}/prices?startDate=${getYesterday()}`, { headers });
      if (!eodRes.ok) return null;
      const data = await eodRes.json();
      return data[data.length - 1] ?? null;
    }
    const data = await res.json();
    return data[0] ?? null;
  } catch (error) {
    console.error(`Failed to get price for ${symbol}:`, error);
    return null;
  }
}

// Get prices for multiple tickers
export async function getPrices(symbols: string[]): Promise<Record<string, TiingoPrice | null>> {
  const results: Record<string, TiingoPrice | null> = {};
  
  // Fetch in parallel
  await Promise.all(
    symbols.map(async (symbol) => {
      results[symbol] = await getLatestPrice(symbol);
    })
  );
  
  return results;
}

// Get historical prices
export async function getHistoricalPrices(
  symbol: string,
  startDate: string,
  endDate?: string,
  frequency: "daily" | "weekly" | "monthly" = "daily"
): Promise<TiingoPrice[]> {
  try {
    const params = new URLSearchParams({
      startDate,
      resampleFreq: frequency,
    });
    if (endDate) params.set("endDate", endDate);

    const res = await fetch(
      `${BASE_URL}/tiingo/daily/${symbol}/prices?${params}`,
      { headers }
    );
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error(`Failed to get history for ${symbol}:`, error);
    return [];
  }
}

// Get news for tickers
export async function getNews(
  tickers: string[],
  options?: {
    startDate?: string;
    endDate?: string;
    limit?: number;
    tags?: string[];
    sources?: string[];
  }
): Promise<TiingoNews[]> {
  try {
    const params = new URLSearchParams({
      tickers: tickers.join(","),
      limit: String(options?.limit ?? 10),
    });
    if (options?.startDate) params.set("startDate", options.startDate);
    if (options?.endDate) params.set("endDate", options.endDate);
    if (options?.tags) params.set("tags", options.tags.join(","));
    if (options?.sources) params.set("source", options.sources.join(","));

    const res = await fetch(`${BASE_URL}/tiingo/news?${params}`, { headers });
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error("Failed to get news:", error);
    return [];
  }
}

// Get fundamentals (daily metrics like market cap)
export async function getFundamentalsDaily(
  symbol: string,
  startDate?: string,
  endDate?: string
): Promise<unknown[]> {
  try {
    const params = new URLSearchParams();
    if (startDate) params.set("startDate", startDate);
    if (endDate) params.set("endDate", endDate);

    const res = await fetch(
      `${BASE_URL}/tiingo/fundamentals/${symbol}/daily?${params}`,
      { headers }
    );
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error(`Failed to get fundamentals for ${symbol}:`, error);
    return [];
  }
}

// Get quarterly statements
export async function getFundamentalsStatements(
  symbol: string,
  startDate?: string,
  endDate?: string
): Promise<unknown[]> {
  try {
    const params = new URLSearchParams();
    if (startDate) params.set("startDate", startDate);
    if (endDate) params.set("endDate", endDate);

    const res = await fetch(
      `${BASE_URL}/tiingo/fundamentals/${symbol}/statements?${params}`,
      { headers }
    );
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error(`Failed to get statements for ${symbol}:`, error);
    return [];
  }
}

// Get crypto price
export async function getCryptoPrice(symbol: string): Promise<unknown | null> {
  try {
    const res = await fetch(`${BASE_URL}/tiingo/crypto/top?tickers=${symbol}`, {
      headers,
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data[0] ?? null;
  } catch (error) {
    console.error(`Failed to get crypto price for ${symbol}:`, error);
    return null;
  }
}

// Helper: get yesterday's date
function getYesterday(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split("T")[0];
}

// Helper: get today's date
export function getToday(): string {
  return new Date().toISOString().split("T")[0];
}

// Aggregate data for morning brief
export async function collectBriefData(watchlist: string[]): Promise<{
  prices: Record<string, { price: number; change: number; changePercent: number } | null>;
  news: TiingoNews[];
}> {
  const [prices, news] = await Promise.all([
    getPrices(watchlist),
    getNews(watchlist, { limit: 10, startDate: getYesterday() }),
  ]);

  // Calculate change percentages
  const priceData: Record<string, { price: number; change: number; changePercent: number } | null> = {};
  
  for (const [symbol, data] of Object.entries(prices)) {
    if (data) {
      const change = data.close - data.open;
      const changePercent = (change / data.open) * 100;
      priceData[symbol] = {
        price: data.close,
        change,
        changePercent,
      };
    } else {
      priceData[symbol] = null;
    }
  }

  return { prices: priceData, news };
}
