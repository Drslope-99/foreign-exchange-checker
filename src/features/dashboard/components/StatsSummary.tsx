import { FaCaretUp, FaCaretDown } from "react-icons/fa";
import type { CurrencyTimeSeries } from "../types/types";

interface StatsSummaryProps {
  stats: CurrencyTimeSeries | null;
}

export default function StatsSummary({ stats }: StatsSummaryProps) {
  return (
    <div className="flex gap-2 flex-wrap">
      <article className="flex flex-col gap-3 bg-neutral-700 border border-neutral-500 text-neutral-50 px-3 py-2 rounded-xl">
        <p className="uppercase text-sm text-neutral-200">open</p>
        <span>{stats?.open}</span>
      </article>
      <article className="flex flex-col gap-3 bg-neutral-700 border border-neutral-500 text-neutral-50 px-3 py-2 rounded-xl">
        <p className="uppercase text-sm text-neutral-200">Last</p>
        <span>{stats?.close}</span>
      </article>
      <article className="flex flex-col gap-3 bg-neutral-700 border border-neutral-500 text-neutral-50 px-3 py-2 rounded-xl">
        <p className="uppercase text-sm text-neutral-200">change</p>
        <span
          className={` ${
            (stats?.change ?? 0) >= 0 ? "text-green" : "text-red"
          }`}
        >
          {(stats?.change ?? 0) >= 0 ? "+" : ""}
          {stats?.change.toFixed(6)}
        </span>
      </article>
      <article className="flex flex-col gap-3 bg-neutral-700 border border-neutral-500 text-neutral-50 px-3 py-2 rounded-xl">
        <p className="uppercase text-sm text-neutral-200">% change</p>
        <span
          className={` flex items-center ${
            (stats?.change ?? 0) >= 0 ? "text-green" : "text-red"
          }`}
        >
          {(stats?.change ?? 0) >= 0 ? <FaCaretUp /> : <FaCaretDown />}
          {(stats?.change ?? 0) >= 0 ? "+" : ""}
          {stats?.changePercent.toFixed(2)}
        </span>
      </article>
    </div>
  );
}
