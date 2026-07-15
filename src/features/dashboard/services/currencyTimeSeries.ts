import { getDateBefore, sample } from "../helpers/helpers";

import type { ChartPoint, CurrencyTimeSeries, TimeFrame } from "../types/types";

interface TimeframeConfig {
  daysBack: number;
  group?: "week" | "month";
}

export const TIMEFRAMES: Record<TimeFrame, TimeframeConfig> = {
  "1D": { daysBack: 7 },
  "1W": { daysBack: 14 },
  "1M": { daysBack: 35 },
  "3M": { daysBack: 120 },
  "1Y": { daysBack: 365, group: "week" },
  "5Y": { daysBack: 365 * 5, group: "month" },
};

interface FrankfurterRate {
  date: string;
  base: string;
  quote: string;
  rate: number;
}

export async function fetchCurrencyTimeSeries(
  base: string,
  quote: string,
  timeframe: TimeFrame,
  pointCount = 20,
): Promise<CurrencyTimeSeries> {
  const config = TIMEFRAMES[timeframe];

  const params = new URLSearchParams({
    base,
    quotes: quote,
    from: getDateBefore(config.daysBack),
  });

  if (config.group) {
    params.set("group", config.group);
  }

  const url = `https://api.frankfurter.dev/v2/rates?${params}`;

  console.log(url);

  const response = await fetch(url);

  if (!response.ok) {
    const error = await response.json();

    throw new Error(error.message);
  }

  const history: FrankfurterRate[] = await response.json();

  const points: ChartPoint[] = history
    .map((item) => ({
      date: item.date,
      timestamp: Date.parse(item.date),
      value: item.rate,
    }))
    .sort((a, b) => a.timestamp - b.timestamp);

  const chartPoints = sample(points, pointCount);

  const values = chartPoints.map((p) => p.value);

  const open = values[0];
  const close = values[values.length - 1];

  const high = Math.max(...values);
  const low = Math.min(...values);

  const change = close - open;

  const changePercent = (change / open) * 100;

  return {
    pair: `${base}/${quote}`,

    base,
    quote,

    timeframe,

    points: chartPoints,

    open,
    close,

    high,
    low,

    change,
    changePercent,
  };
}
