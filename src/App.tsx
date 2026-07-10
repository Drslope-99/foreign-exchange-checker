import Header from "./components/layout/Header";
import MainContent from "./components/layout/MainContent";
import CurrencyConverter from "./features/currency/components/CurrencyConverter";

export default function App() {
  return (
    <div>
      <Header />
      <MainContent>
        <h1 className="uppercase text-white mb-4">check the rate</h1>
        <CurrencyConverter />
      </MainContent>
    </div>
  );
}
