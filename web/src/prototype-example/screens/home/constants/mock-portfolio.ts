import { defaultCashTotal } from "../../cash/data";

export const TIME_PERIODS = ["1H", "1D", "1W", "1M", "1Y", "All"] as const;
export type TimePeriod = (typeof TIME_PERIODS)[number];

/** Crypto-only balance — used for per-asset breakdowns and jitter simulation. */
export const CRYPTO_BALANCE = 898.98;

export const PORTFOLIO = {
  /** Crypto-only balance in GBP. Cash is tracked separately via defaultCashTotal. */
  balance: CRYPTO_BALANCE,
  currency: "GBP",
};

// Absolute GBP change for the crypto portion only — cash is stable so total portfolio
// change equals crypto change. changePercent is relative to total portfolio start value.
const TOTAL_BALANCE = CRYPTO_BALANCE + defaultCashTotal;

export const PERIOD_CHANGES: Record<TimePeriod, { change: number; changePercent: number }> = {
  "1H": { change:   3.12, changePercent:  (3.12  / (TOTAL_BALANCE -   3.12)) * 100 },
  "1D": { change: -12.44, changePercent: (-12.44 / (TOTAL_BALANCE -  -12.44)) * 100 },
  "1W": { change:  28.61, changePercent:  (28.61 / (TOTAL_BALANCE -   28.61)) * 100 },
  "1M": { change: -45.20, changePercent: (-45.20 / (TOTAL_BALANCE -  -45.20)) * 100 },
  "1Y": { change: -189.32, changePercent: (-189.32 / (TOTAL_BALANCE - -189.32)) * 100 },
  All:  { change: -499.68, changePercent: (-499.68 / (TOTAL_BALANCE - -499.68)) * 100 },
};

// Chart data represents total portfolio value (crypto + cash) over time.
// Cash is flat so each series is the crypto curve shifted up by defaultCashTotal.
export const CHART_DATA: Record<TimePeriod, number[]> = {
  "1H": (() => {
    const base = 895.86 + defaultCashTotal;
    const pts: number[] = [];
    for (let i = 0; i <= 60; i++) {
      const t = i / 60;
      pts.push(base + Math.sin(t * 8) * 1.2 + Math.sin(t * 14) * 0.6 + t * 3.12);
    }
    return pts;
  })(),

  "1D": (() => {
    const start = 911.42 + defaultCashTotal;
    const pts: number[] = [];
    for (let i = 0; i <= 96; i++) {
      const t = i / 96;
      const trend = -12.44 * t;
      const intraday =
        Math.sin(t * 6.28 * 2) * 4 +
        Math.sin(t * 6.28 * 5) * 2 +
        Math.cos(t * 6.28 * 1.3) * 3;
      pts.push(start + trend + intraday);
    }
    return pts;
  })(),

  "1W": (() => {
    const start = 870.37 + defaultCashTotal;
    const pts: number[] = [];
    for (let i = 0; i <= 84; i++) {
      const t = i / 84;
      const trend = 28.61 * t;
      const wave =
        Math.sin(t * 6.28 * 3) * 8 +
        Math.sin(t * 6.28 * 1.2) * 5 +
        Math.cos(t * 6.28 * 7) * 2;
      pts.push(start + trend + wave);
    }
    return pts;
  })(),

  "1M": (() => {
    const start = 944.18 + defaultCashTotal;
    const pts: number[] = [];
    for (let i = 0; i <= 90; i++) {
      const t = i / 90;
      const trend = -45.20 * t;
      const swing =
        Math.sin(t * 6.28 * 1.5) * 18 +
        Math.sin(t * 6.28 * 4) * 6 +
        Math.cos(t * 6.28 * 0.7) * 10;
      pts.push(start + trend + swing);
    }
    return pts;
  })(),

  "1Y": (() => {
    const start = 1088.30 + defaultCashTotal;
    const pts: number[] = [];
    for (let i = 0; i <= 120; i++) {
      const t = i / 120;
      const trend = -189.32 * t;
      const cycle =
        Math.sin(t * 6.28 * 2.5) * 40 +
        Math.sin(t * 6.28 * 0.8) * 25 +
        Math.cos(t * 6.28 * 6) * 8;
      pts.push(start + trend + cycle);
    }
    return pts;
  })(),

  All: (() => {
    const start = 1398.66 + defaultCashTotal;
    const pts: number[] = [];
    for (let i = 0; i <= 150; i++) {
      const t = i / 150;
      const trend = -499.68 * t;
      const macro =
        Math.sin(t * 6.28 * 1.2) * 60 +
        Math.sin(t * 6.28 * 3) * 25 +
        Math.cos(t * 6.28 * 0.5) * 35;
      pts.push(start + trend + macro);
    }
    return pts;
  })(),
};
