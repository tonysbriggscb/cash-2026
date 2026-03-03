// ---------------------------------------------------------------------------
// Overview section
// ---------------------------------------------------------------------------

export interface OverviewBreakdownItem {
  label: string;
  /** Raw numeric amount — used to calculate segment width proportions */
  amount: number;
  /** Pre-formatted string shown in the ListCell detail */
  formatted: string;
  /** CSS color value used for both the circle icon and the bar segment */
  color: string;
}

export interface OverviewData {
  title: string;
  breakdown: OverviewBreakdownItem[];
}

export const defaultOverviewData: OverviewData = {
  title: "Cash & Stablecoins",
  breakdown: [
    { label: "Available to trade", amount: 10000, formatted: "£10,000.00", color: "rgb(var(--blue80))" },
    { label: "In use",             amount: 5000,  formatted: "£5,000.00",  color: "rgb(var(--blue40))" },
    { label: "Pending sweeps",     amount: 500,   formatted: "£500.00",     color: "rgb(var(--blue10))" },
  ],
};

/** Total cash across all breakdown items — used for portfolio-level calculations (e.g. chart data). */
export const defaultCashTotal = defaultOverviewData.breakdown.reduce((s, i) => s + i.amount, 0);

/**
 * Region-aware cash display total — sums only the items visible for the given region.
 * UK hides "Pending sweeps", so their displayed total is lower than the global defaultCashTotal.
 */
export function getCashDisplayTotal(region: "US" | "UK"): number {
  const items =
    region === "UK"
      ? defaultOverviewData.breakdown.filter((i) => i.label !== "Pending sweeps")
      : defaultOverviewData.breakdown;
  return items.reduce((s, i) => s + i.amount, 0);
}

// ---------------------------------------------------------------------------
// Rewards section
// ---------------------------------------------------------------------------

export type RewardItemEndVariant = "button" | "detail";

export interface RewardItem {
  title: string;
  /** e.g. "3.50% AER" */
  rate: string;
  detail: string;
  subdetail: string;
  /** CDS icon name */
  icon: string;
  /** CSS color value for the circle background */
  iconBg: string;
  buttonLabel: string;
  /** When "detail", the row shows detail in the end slot instead of the button; default "button" */
  endVariant?: RewardItemEndVariant;
}

export const REWARDS_SCALE = 1_000_000_000;

export interface RewardsData {
  /** Starting value in internal units (divide by REWARDS_SCALE for display) */
  startUnits: number;
  /** Amount added to startUnits per tick */
  stepUnits: number;
  items: RewardItem[];
}

export const defaultRewardsData: RewardsData = {
  startUnits: 99_999_999_999,
  stepUnits: 10,
  items: [
    {
      title: "USDC Rewards",
      rate: "3.50% AER",
      detail: "Detail",
      subdetail: "Subdetail",
      icon: "moneyCardCoin",
      iconBg: "rgb(var(--green40))",
      buttonLabel: "Earn",
    },
    {
      title: "GBP Savings",
      rate: "3.50% AER",
      detail: "Detail",
      subdetail: "Subdetail",
      icon: "savingsBank",
      iconBg: "var(--color-fgPositive)",
      buttonLabel: "Save",
    },
  ],
};

// ---------------------------------------------------------------------------
// Automations section
// ---------------------------------------------------------------------------

export interface AutomationItem {
  title: string;
  description: string;
  detail: string;
  /** CDS icon name */
  icon: string;
  /** CSS color value for the circle background */
  iconBg: string;
  buttonLabel: string;
  /** When 'toggle', the row shows a Switch instead of a button; buttonLabel is ignored */
  endType?: "button" | "toggle";
  /** Initial checked state when endType is 'toggle' */
  toggleDefaultChecked?: boolean;
  /** When true, render icon in active state (e.g. directDepositIcon) */
  iconActive?: boolean;
}

export interface AutomationsData {
  items: AutomationItem[];
}

export const defaultAutomationsData: AutomationsData = {
  items: [
    {
      title: "Hold cash as USDC",
      description: "Automatically convert all cash to USDC",
      detail: "",
      icon: "rollingSpot",
      iconBg: "var(--color-bgSecondary)",
      buttonLabel: "",
      endType: "toggle",
      toggleDefaultChecked: true,
    },
    {
      title: "Direct deposit",
      description: "Send your paycheck to Coinbase as crypto",
      detail: "",
      icon: "directDepositIcon",
      iconBg: "var(--color-bgSecondary)",
      buttonLabel: "Set up",
      iconActive: true,
    },
    {
      title: "Recurring deposits",
      description: "Manage recurring cash deposits",
      detail: "",
      icon: "deposit",
      iconBg: "var(--color-bgSecondary)",
      buttonLabel: "Manage",
    },
  ],
};

// ---------------------------------------------------------------------------
// Do more with your cash section
// ---------------------------------------------------------------------------

export interface DoMoreItem {
  title: string;
  description: string;
  /** CDS icon name */
  icon: string;
  /** Optional region tag — when set, only shown for that region */
  region?: "US" | "UK";
}

export interface DoMoreWithCashData {
  /** Flat list of items — DoMoreSection chunks them into rows automatically */
  items: DoMoreItem[];
}

export const defaultDoMoreWithCashData: DoMoreWithCashData = {
  items: [
    { title: "Lend",          description: "Lend onchain for higher yield",    icon: "percentage",   region: "US" },
    { title: "Borrow",        description: "Borrow against your crypto",        icon: "borrowProduct", region: "US" },
    { title: "Trade",         description: "Buy and sell crypto instantly",      icon: "trading",       region: "UK" },
    { title: "Coinbase Debit", description: "Spend crypto fee-free",            icon: "card" },
  ],
};

// ---------------------------------------------------------------------------
// Transactions section
// ---------------------------------------------------------------------------

export interface OpenOrder {
  /** Symbol used by CryptoIcon, e.g. "btc" */
  cryptoSymbol: string;
  title: string;
  description: string;
  detail: string;
  subdetail: string;
}

export interface HistoryItem {
  /** Symbol used by CryptoIcon, e.g. "eth" */
  cryptoSymbol: string;
  title: string;
  /** Formatted date string, e.g. "Mar 1, 2026" */
  date: string;
  /** Display string when no amountGBP (e.g. "0.002 BTC"); when amountGBP is set, detail is built from it by region */
  detail: string;
  /** Relative time label, e.g. "2 days ago" */
  relativeTime: string;
  /** When set, detail is formatted as currency (+/- amount) using current region */
  amountGBP?: number;
  /** When amountGBP is set: true = credit (+), false = debit (-) */
  isCredit?: boolean;
}

export interface TransactionsData {
  openOrders: OpenOrder[];
  /** Listed most-recent first */
  history: HistoryItem[];
}

export const defaultTransactionsData: TransactionsData = {
  openOrders: [
    {
      cryptoSymbol: "btc",
      title: "Buy BTC",
      description: "Every day",
      detail: "Next buy",
      subdetail: "Mar 2, 2026",
    },
  ],
  history: [
    {
      cryptoSymbol: "btc",
      title: "Received BTC",
      date: "Mar 2, 2026",
      detail: "0.002 BTC",
      relativeTime: "Today",
    },
    {
      cryptoSymbol: "eth",
      title: "Sold ETH",
      date: "Mar 1, 2026",
      detail: "+£120.00",
      relativeTime: "2 days ago",
      amountGBP: 120,
      isCredit: true,
    },
    {
      cryptoSymbol: "usdc",
      title: "Bought USDC",
      date: "Feb 28, 2026",
      detail: "-£50.00",
      relativeTime: "1 week ago",
      amountGBP: 50,
      isCredit: false,
    },
  ],
};
