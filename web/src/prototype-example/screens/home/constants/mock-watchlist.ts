export interface WatchlistItem {
  id: string;
  name: string;
  symbol: string;
  price: number;
  changePercent: number;
  apyLabel?: string;
  color: string;
  sparkline: number[];
}

function spark(points: number, trend: number, volatility: number): number[] {
  const data: number[] = [];
  let v = 50;
  for (let i = 0; i < points; i++) {
    v += trend + (Math.sin(i * 0.8) * volatility + Math.cos(i * 1.3) * volatility * 0.5);
    v = Math.max(10, Math.min(90, v));
    data.push(v);
  }
  return data;
}

export const WATCHLIST: WatchlistItem[] = [
  {
    id: "btc",
    name: "Bitcoin",
    symbol: "BTC",
    price: 50053.60,
    changePercent: 0.21,
    color: "#F7931A",
    sparkline: spark(30, 0.15, 3),
  },
  {
    id: "eth",
    name: "Ethereum",
    symbol: "ETH",
    price: 1468.48,
    changePercent: -0.67,
    apyLabel: "1.89% APY",
    color: "#627EEA",
    sparkline: spark(30, -0.2, 4),
  },
  {
    id: "sol",
    name: "Solana",
    symbol: "SOL",
    price: 63.56,
    changePercent: 0.49,
    apyLabel: "4.10% APY",
    color: "#9945FF",
    sparkline: spark(30, 0.1, 3.5),
  },
];
