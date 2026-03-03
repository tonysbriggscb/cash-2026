import { CRYPTO_BALANCE } from "./mock-portfolio";

export interface Holding {
  id: string;
  name: string;
  iconName: string;
  /** Numeric balance in GBP — formatted by region at render time */
  balanceGBP?: number;
  actionLabel?: string;
}

export const HOLDINGS: Holding[] = [
  {
    id: "crypto",
    name: "Crypto",
    iconName: "crypto",
    balanceGBP: CRYPTO_BALANCE,
  },
  {
    id: "cash",
    name: "Cash & Stablecoins",
    iconName: "cashCoins",
  },
];
