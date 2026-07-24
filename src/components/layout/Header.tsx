import logo from "../../assets/images/logo.svg";
import LiveMarkets from "../../features/currency/components/LiveMarkets";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-neutral-900 flex flex-col gap-2 justify-center items-center">
      <nav className="w-full max-w-screen-2xl flex justify-between items-center py-3 px-1 md:px-0">
        <a href="/">
          <img src={logo} alt="nav logo" />
        </a>

        {/* the currency info */}
        {/* <div className="text-neutral-200 uppercase text-sm sm:text-base">
          55 CURRENCIES . EOD . ECB DATA
        </div> */}
        <div className="text-neutral-200 uppercase text-[8px] xs:text-[9px] sm:text-[10px] md:text-xs tracking-wide">
          55 CURRENCIES . EOD . ECB DATA
        </div>
      </nav>
      <LiveMarkets />
    </header>
  );
}

// h-16
