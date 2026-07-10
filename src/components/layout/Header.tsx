import logo from "../../assets/images/logo.svg";
import LiveMarkets from "../../features/currency/components/LiveMarkets";

// type HeaderProps = {
//   children: ReactNode;
// };

export default function Header() {
  return (
    <header className="bg-neutral-900 flex flex-col gap-2 justify-center items-center">
      <nav className="w-full max-w-screen-2xl flex justify-between py-3">
        <a href="/">
          <img src={logo} alt="nav logo" />
        </a>

        {/* the currency info */}
        <div className="text-neutral-200 uppercase text-sm sm:text-base">
          55 CURRENCIES . EOD . ECB DATA
        </div>
      </nav>
      <LiveMarkets />
    </header>
  );
}

// h-16
