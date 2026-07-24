import { formatNumber } from "../../../utils/currency";
import CurrencyPicker from "./CurrencyPicker";
import { useState } from "react";
import type { EnrichedCurrency } from "../types/types";

type CurrencyInputProps = {
  label: string;
  value: number | null;
  onValueChange: (value: number | null) => void;
  currency: EnrichedCurrency | null;
  onCurrencyChange: (currency: EnrichedCurrency) => void;
};

export default function CurrencyInputCard({
  label,
  value,
  onValueChange,
  currency,
  onCurrencyChange,
}: CurrencyInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  // what shows in the input
  const displayValue = (() => {
    if (value === null) return "";
    return isFocused ? String(value) : formatNumber(value);
  })();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleaned = e.target.value.replace(/[^0-9.]/g, "");

    if (cleaned === "") {
      onValueChange(null);
      return;
    }

    const num = parseFloat(cleaned);
    onValueChange(Number.isNaN(num) ? null : num);
  };
  return (
    <div className="bg-neutral-500 border border-neutral-400 p-3 rounded-xl flex-1 min-w-0">
      <h2 className="uppercase text-white mb-4 text-sm">{label}</h2>
      <div className="flex gap-2 justify-between items-center">
        <input
          type="text"
          inputMode="decimal"
          size={10}
          className={`border border-neutral-300 px-3 py-2 md:py-3 text-lg md:text-2xl lg:text-3xl focus:outline-2 focus:outline-lime-500 focus:outline-offset-2 rounded-md ${label == "receive" ? "text-lime-500" : "text-neutral-50"}`}
          value={displayValue}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="0"
        />
        <CurrencyPicker selected={currency} onSelect={onCurrencyChange} />
      </div>
    </div>
  );
}
