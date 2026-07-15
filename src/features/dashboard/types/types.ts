export type TimeFrame = "1D" | "1W" | "1M" | "3M" | "1Y" | "5Y";

export interface ChartPoint {
  date: string;
  timestamp: number;
  value: number;
}

export interface CurrencyTimeSeries {
  pair: string;
  base: string;
  quote: string;
  timeframe: TimeFrame;

  points: ChartPoint[];

  open: number;
  close: number;
  high: number;
  low: number;

  change: number;
  changePercent: number;
}
