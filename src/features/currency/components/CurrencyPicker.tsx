//

import { getCurrencies } from "../services/getCurrencies";
import type { ApiCurrency, EnrichedCurrency } from "../types/types"; // moved EnrichedCurrency here, see note below
import { useState, useEffect, useMemo } from "react";
import { getCurrencyFlag } from "../../../utils/getCurrencyFlag";
import { Search } from "lucide-react";
import { FaCaretUp, FaCaretDown } from "react-icons/fa";
import { Check } from "lucide-react";

function enrichCurrencies(data: ApiCurrency[]): EnrichedCurrency[] {
  return data.map((currency) => ({
    ...currency,
    flag: getCurrencyFlag(currency.iso_code),
  }));
}

const POPULAR_CODES = ["USD", "EUR", "GBP"];

// CHANGED: accept selected + onSelect as props instead of owning them
type CurrencyPickerProps = {
  selected: EnrichedCurrency | null;
  onSelect: (currency: EnrichedCurrency) => void;
};

export default function CurrencyPicker({
  selected,
  onSelect,
}: CurrencyPickerProps) {
  const [currencies, setCurrencies] = useState<EnrichedCurrency[]>([]);
  const [loading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  // REMOVED: const [selected, setSelected] = useState<EnrichedCurrency | null>(null);

  useEffect(() => {
    async function fetchCurrencies() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getCurrencies();
        const enriched = enrichCurrencies(data);
        const withFlags = enriched.filter((c) => c.flag !== undefined);
        setCurrencies(withFlags);
      } catch (err) {
        setError("Failed to load currencies");
      } finally {
        setIsLoading(false);
      }
    }
    fetchCurrencies();
  }, []);

  // CHANGED: default-selection effect now calls the parent's onSelect
  // instead of a local setSelected
  useEffect(() => {
    if (!selected && currencies.length > 0) {
      const currencyMap = new Map(currencies.map((c) => [c.iso_code, c]));
      const defaultCurrency =
        POPULAR_CODES.map((code) => currencyMap.get(code)).find(Boolean) ??
        currencies[0];
      if (defaultCurrency) onSelect(defaultCurrency);
    }
  }, [currencies, selected, onSelect]);

  // CHANGED: calls onSelect (from parent/context) instead of local setSelected
  const handleSelectedCurrency = (currency: EnrichedCurrency) => {
    onSelect(currency);
    setIsOpen(false);
  };

  const { popular, others } = useMemo(() => {
    const q = query.trim().toLowerCase();

    const matchesQuery = (c: EnrichedCurrency) =>
      c.iso_code.toLowerCase().includes(q) || c.name.toLowerCase().includes(q);

    const filtered = q ? currencies.filter(matchesQuery) : currencies;

    const currencyMap = new Map(filtered.map((c) => [c.iso_code, c]));

    const popular: EnrichedCurrency[] = [];
    POPULAR_CODES.forEach((code) => {
      const match = currencyMap.get(code);
      if (match) popular.push(match);
    });

    const others = filtered.filter((c) => !POPULAR_CODES.includes(c.iso_code));

    return { popular, others };
  }, [currencies, query]);

  if (loading) return <div>Loading currencies…</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="relative max-w-xs md:max-w-md text-white flex flex-col">
      <button
        className="self-end inline-flex gap-2 items-center bg-neutral-500 border border-neutral-400 text-sm p-2 md:p-3 mb-2 rounded-md cursor-pointer"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <img className="w-6 h-6 rounded-full" src={selected?.flag} />
        <span>{selected?.iso_code}</span>
        {isOpen ? <FaCaretUp /> : <FaCaretDown />}
      </button>
      {isOpen && (
        <article className="flex flex-col gap-3 absolute top-full right-0 z-10 max-h-96 bg-neutral-600 border border-neutral-400 max-w-xs md:max-w-md rounded-md p-3 overflow-y-auto custom-scrollbar">
          <div className="border border-neutral-400 flex mb-2 rounded-md ">
            <label className="inline-flex items-center px-2">
              <Search size={16} />
            </label>
            <input
              className="border-none focus:outline-none px-3 py-2 flex-grow"
              type="text"
              name="search"
              placeholder="search currencies..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <>
            {!query && (
              <p className="flex justify-between items-center text-sm uppercase font-thin text-neutral-200 my-2 py-1 border-b border-neutral-400">
                popular <span>{popular.length}</span>
              </p>
            )}

            <ul className="flex flex-col gap-4">
              {popular.map((currency) => (
                <li
                  className="text-white flex gap-3 items-center cursor-pointer"
                  key={currency.iso_numeric}
                  onClick={() => handleSelectedCurrency(currency)}
                >
                  <img
                    className="w-6 h-6 rounded-full"
                    src={currency.flag}
                    alt={currency.iso_code}
                  />
                  <p className="text-sm text-neutral-50">{currency.iso_code}</p>
                  <p className="text-xs font-thin text-neutral-200">
                    {currency.name}
                  </p>
                  {selected?.iso_code === currency.iso_code ? (
                    <Check className="w-4 h-4 text-neutral-200 ml-auto shrink-0" />
                  ) : null}
                </li>
              ))}
            </ul>
          </>

          <>
            {!query && (
              <p className="flex justify-between items-center text-sm uppercase font-thin text-neutral-200 my-2 py-1 border-b border-neutral-400">
                other currencies <span>{others.length}</span>
              </p>
            )}

            <ul className="flex flex-col gap-4">
              {others.map((currency) => (
                <li
                  className="text-white flex gap-3 items-center cursor-pointer"
                  key={currency.iso_numeric}
                  onClick={() => handleSelectedCurrency(currency)}
                >
                  <img
                    className="w-6 h-6 rounded-full"
                    src={currency.flag}
                    alt={currency.iso_code}
                  />
                  <p className="text-sm text-neutral-50">{currency.iso_code}</p>
                  <p className="text-xs font-thin text-neutral-200">
                    {currency.name}
                  </p>
                  {selected?.iso_code === currency.iso_code ? (
                    <Check className="w-4 h-4 text-neutral-200 ml-auto shrink-0" />
                  ) : null}
                </li>
              ))}
            </ul>
          </>
        </article>
      )}
    </div>
  );
}
