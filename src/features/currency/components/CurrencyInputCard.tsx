import { formatNumber } from "../../../utils/currency";

type CurrencyInputProps = {
  label: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function CurrencyInputCard({
  label,
  value,
  onChange,
}: CurrencyInputProps) {
  return (
    <div className="bg-neutral-500 border border-neutral-400 p-3 rounded-xl flex-1 min-w-0">
      <h2 className="uppercase text-white mb-4 text-sm">{label}</h2>
      <div className="flex gap-2 justify-between items-center">
        <input
          type="text"
          inputMode="numeric"
          size={10}
          className="text-white px-3 py-2 md:py-3 text-lg md:text-2xl lg:text-3xl focus:outline-2 focus:outline-lime-500 focus:outline-offset-2 rounded-md"
          value={typeof value === "number" ? formatNumber(value) : value}
          onChange={onChange}
        />
        <p>dropdown</p>
      </div>
    </div>
  );
}
