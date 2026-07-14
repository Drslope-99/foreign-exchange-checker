import type { Currency } from "../types/types";

const baseUrl = import.meta.env.VITE_BASE_URL;

export async function getCurrencies(): Promise<Currency[]> {
  try {
    const response = await fetch(`${baseUrl}/currencies`);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch currencies (${response.status} ${response.statusText})`,
      );
    }

    const data: Currency[] = await response.json();

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Unable to fetch currencies: ${error.message}`);
    }

    throw new Error("An unknown error occurred while fetching currencies.");
  }
}
