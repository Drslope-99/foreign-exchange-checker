import { flags } from "../utils/flags";
import { currencyFlagMap } from "../constants/currencyFlagMap";

export function getCurrencyFlag(isoCode: string): string | undefined {
  const countryCode = currencyFlagMap[isoCode.toUpperCase()];
  if (!countryCode) return undefined; // no mapping known for this currency

  return flags[countryCode.toLowerCase()]; // may also be undefined if the .webp is missing
}
