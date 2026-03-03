/**
 * Mock data for US-only asset sections: Stocks, Derivatives, Predictions.
 * All amounts are in USD.
 */

export interface AssetItem {
  id: string;
  name: string;
  symbol: string;
  amountUSD: number;
  changePercent: number;
  /** "stock" renders an inline SVG brand logo; "crypto" renders a CryptoIcon */
  iconType: "stock" | "crypto";
}

export const STOCKS: AssetItem[] = [
  { id: "aapl", name: "Apple",    symbol: "AAPL", amountUSD: 1_840.00, changePercent:  1.23, iconType: "stock" },
  { id: "goog", name: "Alphabet", symbol: "GOOG", amountUSD:   920.00, changePercent: -0.47, iconType: "stock" },
  { id: "tsla", name: "Tesla",    symbol: "TSLA", amountUSD:   540.00, changePercent:  2.81, iconType: "stock" },
];

export const STOCKS_TOTAL_USD = STOCKS.reduce((s, a) => s + a.amountUSD, 0); // 3300

export const DERIVATIVES: AssetItem[] = [
  { id: "btc-perp", name: "BTC-PERP",  symbol: "BTC",  amountUSD: 2_100.00, changePercent:  3.12, iconType: "crypto" },
  { id: "eth-perp", name: "ETH-PERP",  symbol: "ETH",  amountUSD:   850.00, changePercent: -1.08, iconType: "crypto" },
];

export const DERIVATIVES_TOTAL_USD = DERIVATIVES.reduce((s, a) => s + a.amountUSD, 0); // 2950

export const PREDICTIONS: AssetItem[] = [
  { id: "pred-elec", name: "2024 Election",    symbol: "ELEC",  amountUSD: 340.00, changePercent:  5.50, iconType: "stock" },
  { id: "pred-rate", name: "Rate Cut by Dec",  symbol: "RATE",  amountUSD: 160.00, changePercent: -2.30, iconType: "stock" },
];

export const PREDICTIONS_TOTAL_USD = PREDICTIONS.reduce((s, a) => s + a.amountUSD, 0); // 500
