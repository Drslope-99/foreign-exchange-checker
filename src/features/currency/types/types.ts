export type Rate = {
  date: string;
  base: string;
  quote: string;
  rate: number;
};

export type RateDirection = "up" | "down" | "same";

export type ComparedRate = Rate & {
  previousRate: number | null;
  difference: number | null;
  percentageChange: number | null;
  direction: RateDirection;
};

export interface ApiCurrency {
  iso_code: string;
  iso_numeric: string;
  name: string;
  symbol: string;
  start_date: string;
  end_date: string;
}

export interface EnrichedCurrency extends ApiCurrency {
  flag?: string;
}
