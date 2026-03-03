import { CRYPTO_BALANCE } from "./mock-portfolio";
import { STOCKS_TOTAL_USD, DERIVATIVES_TOTAL_USD, PREDICTIONS_TOTAL_USD } from "./mock-us-assets";

export interface Holding {
  id: string;
  name: string;
  iconName: string;
  /** Numeric balance in GBP — formatted by region at render time */
  balanceGBP?: number;
  /** USD balance for US-only asset classes */
  balanceUSD?: number;
}

/** Holdings shown for all regions (UK + US) */
export const HOLDINGS: Holding[] = [
  { id: "crypto", name: "Crypto",             iconName: "crypto",    balanceGBP: CRYPTO_BALANCE },
  { id: "cash",   name: "Cash & Stablecoins", iconName: "cashCoins" },
];

/** Additional holdings shown only for the US region */
export const US_ONLY_HOLDINGS: Holding[] = [
  { id: "stocks",      name: "Stocks",      iconName: "candlesticks",           balanceUSD: STOCKS_TOTAL_USD },
  { id: "derivatives", name: "Derivatives", iconName: "derivativesProductNew",  balanceUSD: DERIVATIVES_TOTAL_USD },
  { id: "predictions", name: "Predictions", iconName: "nft",                    balanceUSD: PREDICTIONS_TOTAL_USD },
];
