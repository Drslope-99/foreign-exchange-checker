import { ArrowRightLeft } from "lucide-react";
type ButtonProps = {
  onClick: () => void;
};

export default function SwapButton({ onClick }: ButtonProps) {
  return (
    <button
      className="text-neutral-50 bg-neutral-500 p-3 rounded-md border border-neutral-400 transition-transform duration-150 active:scale-90 cursor-pointer"
      onClick={onClick}
    >
      <ArrowRightLeft />
    </button>
  );
}
