// CurrencyConverterContext.tsx
import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import type { EnrichedCurrency } from "../features/currency/types/types";
import { getExchangeRate } from "../features/currency/services/getCurrencyRates";

type Side = {
  currency: EnrichedCurrency | null;
  amount: number | null;
};

type ConverterContextValue = {
  send: Side;
  receive: Side;
  exchangeRate: number | null;
  setSendCurrency: (currency: EnrichedCurrency) => void;
  setReceiveCurrency: (currency: EnrichedCurrency) => void;
  setSendAmount: (amount: number | null) => void;
  setReceiveAmount: (amount: number | null) => void;
  swapCurrencies: () => void;
};

const CurrencyConverterContext = createContext<ConverterContextValue | null>(
  null,
);

export function CurrencyConverterProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [send, setSend] = useState<Side>({ currency: null, amount: null });
  const [receive, setReceive] = useState<Side>({
    currency: null,
    amount: null,
  });
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);
  const [lastEdited, setLastEdited] = useState<"send" | "receive">("send");

  // refetch rate whenever either currency changes
  useEffect(() => {
    if (!send.currency || !receive.currency) return;

    let cancelled = false;

    async function fetchRate() {
      const rate = await getExchangeRate(
        send.currency!.iso_code,
        receive.currency!.iso_code,
      );
      if (!cancelled) setExchangeRate(rate);
    }

    fetchRate();
    return () => {
      cancelled = true;
    };
  }, [send.currency, receive.currency]);

  // NEW — recalculates amounts whenever the rate itself changes
  useEffect(() => {
    if (exchangeRate === null) return;

    if (lastEdited === "send") {
      setReceive((prev) => ({
        ...prev,
        amount: send.amount !== null ? send.amount * exchangeRate : null,
      }));
    } else {
      setSend((prev) => ({
        ...prev,
        amount:
          receive.amount !== null && exchangeRate !== 0
            ? receive.amount / exchangeRate
            : null,
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exchangeRate]);

  const setSendAmount = useCallback(
    (amount: number | null) => {
      setLastEdited("send");
      setSend((prev) => ({ ...prev, amount }));
      if (amount !== null && exchangeRate !== null) {
        setReceive((prev) => ({ ...prev, amount: amount * exchangeRate }));
      } else {
        setReceive((prev) => ({ ...prev, amount: null }));
      }
    },
    [exchangeRate],
  );

  const setReceiveAmount = useCallback(
    (amount: number | null) => {
      setLastEdited("receive");
      setReceive((prev) => ({ ...prev, amount }));
      if (amount !== null && exchangeRate !== null && exchangeRate !== 0) {
        setSend((prev) => ({ ...prev, amount: amount / exchangeRate }));
      } else {
        setSend((prev) => ({ ...prev, amount: null }));
      }
    },
    [exchangeRate],
  );

  const setSendCurrency = useCallback((currency: EnrichedCurrency) => {
    setSend((prev) => ({ ...prev, currency }));
  }, []);

  const setReceiveCurrency = useCallback((currency: EnrichedCurrency) => {
    setReceive((prev) => ({ ...prev, currency }));
  }, []);

  // swap currencies only — keep amounts where the user typed them
  const swapCurrencies = useCallback(() => {
    setSend((prev) => ({ ...prev, currency: receive.currency }));
    setReceive((prev) => ({ ...prev, currency: prev.currency }));
    setReceive((prev) => ({ ...prev, currency: send.currency }));
  }, [send.currency, receive.currency]);

  return (
    <CurrencyConverterContext.Provider
      value={{
        send,
        receive,
        exchangeRate,
        setSendCurrency,
        setReceiveCurrency,
        setSendAmount,
        setReceiveAmount,
        swapCurrencies,
      }}
    >
      {children}
    </CurrencyConverterContext.Provider>
  );
}

export function useCurrencyConverter() {
  const ctx = useContext(CurrencyConverterContext);
  if (!ctx) {
    throw new Error(
      "useCurrencyConverter must be used within CurrencyConverterProvider",
    );
  }
  return ctx;
}
