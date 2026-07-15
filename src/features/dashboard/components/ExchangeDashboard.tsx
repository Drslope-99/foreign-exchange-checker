import { useState, useEffect } from "react";
import { useCurrencyConverter } from "../../../context/currencyContext";
import CurrencyHistoryTab from "./CurrencyHistoryTab";
import { fetchCurrencyTimeSeries } from "../services/currencyTimeSeries";
import type { CurrencyTimeSeries, TimeFrame } from "../types/types";

const TABS = ["history", "compare", "favourites", "logs"] as const;
type Tab = (typeof TABS)[number];

const TAB_LABELS: Record<Tab, string> = {
  history: "History",
  compare: "Compare",
  favourites: "Favourites",
  logs: "Logs",
};

export default function ExchangeDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("history");
  const { send, receive } = useCurrencyConverter();
  const [timeframe, setTimeframe] = useState<TimeFrame>("1D");
  const [chart, setChart] = useState<CurrencyTimeSeries | null>(null);

  useEffect(() => {
    if (!send.currency || !receive.currency) {
      return;
    }

    async function load() {
      try {
        const data = await fetchCurrencyTimeSeries(
          send.currency?.iso_code ?? "USD",
          receive.currency?.iso_code ?? "EUR",
          timeframe,
        );

        setChart(data);
      } catch (error) {
        console.error(error);
      }
    }

    load();
  }, [send.currency, receive.currency, timeframe]);

  return (
    <div className="p-3 mt-4">
      {/* Tab bar */}
      <div className="flex gap-1 mb-4 border-b border-neutral-400">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`relative px-3 py-2 text-sm uppercase transition-colors cursor-pointer ${
              activeTab === tab
                ? "text-white"
                : "text-neutral-100 hover:text-neutral-50"
            }`}
          >
            {TAB_LABELS[tab]}
            {activeTab === tab && (
              <span className="absolute left-0 right-0 -bottom-px h-0.5 bg-lime-500 rounded-full" />
            )}
          </button>
        ))}
      </div>
      // CurrencyStatsPanel.tsx (inside, below the tabs)
      <div>
        {/* <StatsSummary
          open={openRate}
          last={lastRate}
          change={change}
          percentChange={percentChange}
        />
        <TimeFrameSelector active={timeframe} onChange={setTimeframe} /> */}
        <CurrencyHistoryTab
          timeframe={timeframe}
          setTimeframe={setTimeframe}
          stats={chart}
        />
      </div>
    </div>
  );
}
