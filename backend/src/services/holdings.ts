/**
 * Holdings Service - Portfolio Position Management
 * 
 * Manages user holdings (positions) with cost basis for P&L calculations.
 * Data sources are legitimate APIs only - no scraping.
 */

import { getLatestPrice } from "./market.ts";

export interface Holding {
  id: string;
  userId: string;
  symbol: string;
  shares: number;
  costBasis: number;    // Total cost
  avgPrice: number;     // Average price per share
  notes?: string;
  acquiredAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface HoldingWithPL extends Holding {
  currentPrice: number;
  currentValue: number;
  gainLoss: number;
  gainLossPercent: number;
  dayChange: number;
  dayChangePercent: number;
}

export interface PortfolioSummary {
  totalValue: number;
  totalCost: number;
  totalGainLoss: number;
  totalGainLossPercent: number;
  dayChange: number;
  dayChangePercent: number;
  holdings: HoldingWithPL[];
}

// Calculate P&L for a single holding
export async function calculateHoldingPL(holding: Holding): Promise<HoldingWithPL | null> {
  const priceData = await getLatestPrice(holding.symbol);
  
  if (!priceData) {
    return null;
  }

  const currentPrice = priceData.close;
  const currentValue = holding.shares * currentPrice;
  const gainLoss = currentValue - holding.costBasis;
  const gainLossPercent = (gainLoss / holding.costBasis) * 100;
  
  // Day change calculation
  const dayChange = (priceData.close - priceData.open) * holding.shares;
  const dayChangePercent = ((priceData.close - priceData.open) / priceData.open) * 100;

  return {
    ...holding,
    currentPrice,
    currentValue,
    gainLoss,
    gainLossPercent,
    dayChange,
    dayChangePercent,
  };
}

// Calculate portfolio summary with all holdings
export async function calculatePortfolioSummary(holdings: Holding[]): Promise<PortfolioSummary> {
  const results = await Promise.all(
    holdings.map((h) => calculateHoldingPL(h))
  );

  const validHoldings = results.filter((h): h is HoldingWithPL => h !== null);

  const totalValue = validHoldings.reduce((sum, h) => sum + h.currentValue, 0);
  const totalCost = validHoldings.reduce((sum, h) => sum + h.costBasis, 0);
  const totalGainLoss = totalValue - totalCost;
  const totalGainLossPercent = totalCost > 0 ? (totalGainLoss / totalCost) * 100 : 0;
  const dayChange = validHoldings.reduce((sum, h) => sum + h.dayChange, 0);
  const dayChangePercent = totalValue > 0 ? (dayChange / (totalValue - dayChange)) * 100 : 0;

  return {
    totalValue,
    totalCost,
    totalGainLoss,
    totalGainLossPercent,
    dayChange,
    dayChangePercent,
    holdings: validHoldings,
  };
}

// Format holding for email brief
export function formatHoldingForBrief(holding: HoldingWithPL): string {
  const sign = holding.gainLoss >= 0 ? "+" : "";
  const emoji = holding.gainLoss >= 0 ? "📈" : "📉";
  
  return `${emoji} ${holding.symbol}: ${holding.shares} shares @ $${holding.currentPrice.toFixed(2)} = $${holding.currentValue.toFixed(2)} (${sign}${holding.gainLossPercent.toFixed(1)}%)`;
}

// Format portfolio summary for email brief
export function formatPortfolioForBrief(summary: PortfolioSummary): string {
  const sign = summary.totalGainLoss >= 0 ? "+" : "";
  const daySign = summary.dayChange >= 0 ? "+" : "";
  
  let text = `💼 PORTFOLIO SUMMARY\n`;
  text += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
  text += `Total Value:    $${summary.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}\n`;
  text += `Total P&L:      ${sign}$${summary.totalGainLoss.toLocaleString(undefined, { minimumFractionDigits: 2 })} (${sign}${summary.totalGainLossPercent.toFixed(2)}%)\n`;
  text += `Today:          ${daySign}$${summary.dayChange.toLocaleString(undefined, { minimumFractionDigits: 2 })} (${daySign}${summary.dayChangePercent.toFixed(2)}%)\n\n`;
  
  text += `📊 POSITIONS\n`;
  text += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
  
  for (const h of summary.holdings) {
    const hSign = h.gainLoss >= 0 ? "+" : "";
    text += `${h.symbol.padEnd(6)} ${h.shares.toString().padStart(8)} shares  $${h.currentPrice.toFixed(2).padStart(10)}  ${hSign}${h.gainLossPercent.toFixed(1).padStart(6)}%\n`;
  }
  
  return text;
}

/**
 * DATA SOURCES - All Legitimate APIs
 * 
 * Market Pulse uses ONLY official APIs for financial data:
 * 
 * 1. Tiingo API (tiingo.com)
 *    - Real-time & historical prices
 *    - News with ticker tagging
 *    - Fundamentals (market cap, P/E, etc.)
 *    - WebSocket for streaming
 *    - Free tier: 500 requests/day
 * 
 * 2. Fear & Greed Index (optional)
 *    - CNN's market sentiment indicator
 *    - Public endpoint
 * 
 * NO WEB SCRAPING is used. All data comes from:
 * - Documented, official APIs
 * - Proper authentication (API keys)
 * - Rate limit compliance
 * 
 * For brokerage account sync (future feature):
 * - Plaid API (plaid.com) - Connects to 12,000+ institutions
 * - Handles OAuth, security, compliance
 * - ~$0.30/connection/month
 */
