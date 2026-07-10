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
