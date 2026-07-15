import type { TimeFrame } from "../types/types";

interface TimeFrameSelectorProps {
  value: TimeFrame;
  onChange: (timeframe: TimeFrame) => void;
}

const TIMEFRAMES: TimeFrame[] = ["1D", "1W", "1M", "3M", "1Y", "5Y"];

export default function TimeFrameSelector({
  value,
  onChange,
}: TimeFrameSelectorProps) {
  return (
    <div className="inline-flex items-center rounded-xl bg-neutral-700 dark:bg-neutral-900">
      {TIMEFRAMES.map((timeframe) => (
        <button
          key={timeframe}
          type="button"
          onClick={() => onChange(timeframe)}
          className={`
            rounded-lg px-4 py-3 text-sm font-medium text-neutral-50 transition-all duration-200 cursor-pointer
            ${
              value === timeframe
                ? "bg-neutral-500 text-white shadow"
                : "text-neutral-100 hover:bg-neutral-500 dark:text-neutral-300 dark:hover:bg-neutral-800"
            }
          `}
        >
          {timeframe}
        </button>
      ))}
    </div>
  );
}
