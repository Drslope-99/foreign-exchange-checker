import Header from "./components/layout/Header";
import MainContent from "./components/layout/MainContent";
import CurrencyConverter from "./features/currency/components/CurrencyConverter";
import { CurrencyConverterProvider } from "./context/currencyContext";
import ExChangeDashboard from "./features/dashboard/components/ExchangeDashboard";

export default function App() {
  return (
    <CurrencyConverterProvider>
      <div>
        <Header />
        <MainContent>
          <h1 className="uppercase text-white mb-4">check the rate</h1>
          <CurrencyConverter />
          <ExChangeDashboard />
        </MainContent>
      </div>
    </CurrencyConverterProvider>
  );
}
