import { useState, useEffect } from "react";
import { Dot } from "lucide-react";
import { fetchRates } from "../services/getCurrencyRates";
import type { ComparedRate } from "../types/types";
import { FaCaretDown } from "react-icons/fa";
import { FaCaretUp } from "react-icons/fa";

export default function LiveMarkets() {
  const [currencyRates, setCurrencyRates] = useState<ComparedRate[]>([]);
  const [loading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchCurrentRates() {
      try {
        setIsLoading(true);
        const currentRates = await fetchRates();
        setCurrencyRates(currentRates);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCurrentRates();
  }, []);

  if (loading) {
    return <p>loading...</p>;
  }

  return (
    <section className="w-full flex">
      <button className="inline-flex max-content bg-lime-500 py-2 px-3 uppercase text-sm items-center">
        <Dot />
        live markets
      </button>
      {/* the currency pairs container goes here*/}
      <div className="bg-neutral-700 flex flex-1 items-center text-white overflow-hidden">
        <ul className="ticker flex whitespace-nowrap">
          {currencyRates.map((rates) => (
            <li
              key={rates.quote}
              className="text-white text-sm px-3 py-1 border-r border-neutral-300"
            >
              <div className="flex gap-2 items-center">
                <p className="font-thin">
                  <span>{rates.base}</span>/<span>{rates.quote}</span>
                </p>

                <p>{rates.rate}</p>
                {(rates.percentageChange ?? 0) >= 0 ? (
                  <FaCaretUp className="text-green" />
                ) : (
                  <FaCaretDown className="text-red" />
                )}
                <p
                  className={
                    (rates.percentageChange ?? 0) >= 0
                      ? "text-green"
                      : "text-red"
                  }
                >
                  {rates.percentageChange?.toFixed(3)}%
                </p>
              </div>
            </li>
          ))}
          {/* second list to simulate the stock exchange moving */}
          {currencyRates.map((rates) => (
            <li
              key={`${rates.quote}-copy`}
              className="text-white text-sm px-3 py-1 border-r border-neutral-300"
            >
              <div className="flex gap-2 items-center">
                <p className="font-thin">
                  <span>{rates.base}</span>/<span>{rates.quote}</span>
                </p>

                <p>{rates.rate}</p>
                {rates.direction === "up" ? (
                  <FaCaretUp className="text-green" />
                ) : (
                  <FaCaretDown className="text-red" />
                )}
                <p
                  className={
                    (rates.percentageChange ?? 0) >= 0
                      ? "text-green"
                      : "text-red"
                  }
                >
                  {rates.percentageChange?.toFixed(3)}%
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
