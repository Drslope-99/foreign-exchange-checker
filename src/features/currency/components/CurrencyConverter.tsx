import CurrencyInputCard from "./CurrencyInputCard";
import SwapButton from "../../../components/UI/SwapButton";
import { FaStar } from "react-icons/fa";

import { useCurrencyConverter } from "../../../context/currencyContext";
import { formatNumber } from "../../../utils/currency";

export default function CurrencyConverter() {
  const {
    send,
    setSendAmount,
    setSendCurrency,
    receive,
    setReceiveAmount,
    setReceiveCurrency,
    swapCurrencies,
  } = useCurrencyConverter();

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="bg-neutral-700 rounded-2xl"
    >
      <div className="px-2 md:px-4 py-4 flex flex-col sm:flex-row items-center gap-4 md:gap-6">
        <CurrencyInputCard
          label="send"
          value={send.amount}
          onValueChange={setSendAmount}
          currency={send.currency}
          onCurrencyChange={setSendCurrency}
        />
        <SwapButton onClick={swapCurrencies} />
        <CurrencyInputCard
          label="receive"
          value={receive.amount}
          onValueChange={setReceiveAmount}
          currency={receive.currency}
          onCurrencyChange={setReceiveCurrency}
        />
      </div>
      <hr className="border-0 border-t border-dashed border-neutral-300 mt-3" />
      <div className="py-3 flex flex-col sm:flex-row gap-2 justify-between items-center px-4">
        <p className="text-white text-sm">
          {send.amount !== null ? formatNumber(send.amount) : "0"}{" "}
          {send.currency?.iso_code} ={" "}
          {receive.amount !== null ? formatNumber(receive.amount) : "0"}{" "}
          {receive.currency?.iso_code}
        </p>
        <div className="flex gap-3">
          <button className="bg-lime-500 py-1 px-2 text-sm uppercase inline-flex gap-1 items-center rounded-sm cursor-pointer">
            <FaStar />
            favourited
          </button>
          <button className="text-white uppercase text-sm py-1 px-2 border border-lime-500 p-1 rounded-sm cursor-pointer">
            log conversion
          </button>
        </div>
      </div>
    </form>
  );
}
