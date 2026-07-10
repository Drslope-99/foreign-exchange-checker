import type { Rate, ComparedRate } from "../types/types";

const baseUrl = import.meta.env.VITE_BASE_URL;

function getPreviousDate(days = 1) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().split("T")[0];
}

export async function getLatestRates(): Promise<Rate[]> {
  try {
    const res = await fetch(baseUrl);

    if (!res.ok) {
      throw new Error(`failed to fetch: ${res.status}`);
    }
    const data: Rate[] = await res.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getPreviousRates(): Promise<Rate[]> {
  const date = getPreviousDate();
  try {
    const res = await fetch(`${baseUrl}&date=${date}`);

    if (!res.ok) {
      throw new Error(`failed to fetch: ${res.status}`);
    }
    const data: Rate[] = await res.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function fetchRates(): Promise<ComparedRate[]> {
  try {
    const [currentRates, previousRates] = await Promise.all([
      getLatestRates(),
      getPreviousRates(),
    ]);

    const comparedRates: ComparedRate[] = currentRates.map((currentRate) => {
      const previousRate = previousRates.find(
        (rate) => rate.quote === currentRate.quote,
      );

      if (!previousRate) {
        return {
          ...currentRate,
          previousRate: null,
          difference: null,
          percentageChange: null,
          direction: "same",
        };
      }

      const difference = currentRate.rate - previousRate.rate;

      const percentageChange = (difference / previousRate.rate) * 100;

      return {
        ...currentRate,
        previousRate: previousRate.rate,
        difference,
        percentageChange,
        direction: difference > 0 ? "up" : difference < 0 ? "down" : "same",
      };
    });

    return comparedRates;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
