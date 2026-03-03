import { PORTFOLIO } from "./mock-portfolio";

/** Total crypto balance for this account (from mock-portfolio). */
export const CRYPTO_TOTAL_BALANCE = PORTFOLIO.balance;

export interface CryptoAsset {
  id: string;
  name: string;
  symbol: string;
  /** Balance in account currency (GBP), must sum to total crypto balance */
  amount: number;
}

/**
 * Four assets whose amounts sum to the account's total crypto balance (PORTFOLIO.balance).
 */
export const CRYPTO_ASSETS: CryptoAsset[] = [
  { id: "btc", name: "Bitcoin", symbol: "BTC", amount: 400.0 },
  { id: "eth", name: "Ethereum", symbol: "ETH", amount: 250.0 },
  { id: "sol", name: "Solana", symbol: "SOL", amount: 148.98 },
  { id: "usdc", name: "USDC", symbol: "USDC", amount: 100.0 },
];
// 400 + 250 + 148.98 + 100 = 898.98 = PORTFOLIO.balance
