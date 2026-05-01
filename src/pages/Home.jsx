import { useState, useEffect, useRef } from "react";
import axios from "axios";
import CoinCard from "../components/CoinCard";

const TOP_COINS = [
  { id: "bitcoin", symbol: "BTCUSDT", name: "Bitcoin", abbr: "BTC" },
  { id: "ethereum", symbol: "ETHUSDT", name: "Ethereum", abbr: "ETH" },
  { id: "binancecoin", symbol: "BNBUSDT", name: "BNB", abbr: "BNB" },
  { id: "solana", symbol: "SOLUSDT", name: "Solana", abbr: "SOL" },
  { id: "ripple", symbol: "XRPUSDT", name: "XRP", abbr: "XRP" },
  { id: "dogecoin", symbol: "DOGEUSDT", name: "Dogecoin", abbr: "DOGE" },
  { id: "cardano", symbol: "ADAUSDT", name: "Cardano", abbr: "ADA" },
  { id: "avalanche", symbol: "AVAXUSDT", name: "Avalanche", abbr: "AVAX" },
  { id: "polkadot", symbol: "DOTUSDT", name: "Polkadot", abbr: "DOT" },
  { id: "tron", symbol: "TRXUSDT", name: "TRON", abbr: "TRX" },
  { id: "chainlink", symbol: "LINKUSDT", name: "Chainlink", abbr: "LINK" },
  { id: "litecoin", symbol: "LTCUSDT", name: "Litecoin", abbr: "LTC" },
  { id: "shiba-inu", symbol: "SHIBUSDT", name: "Shiba Inu", abbr: "SHIB" },
  { id: "uniswap", symbol: "UNIUSDT", name: "Uniswap", abbr: "UNI" },
  { id: "stellar", symbol: "XLMUSDT", name: "Stellar", abbr: "XLM" },
  { id: "cosmos", symbol: "ATOMUSDT", name: "Cosmos", abbr: "ATOM" },
  { id: "near", symbol: "NEARUSDT", name: "NEAR Protocol", abbr: "NEAR" },
  { id: "filecoin", symbol: "FILUSDT", name: "Filecoin", abbr: "FIL" },
  { id: "internet-computer", symbol: "ICPUSDT", name: "Internet Computer", abbr: "ICP" },
  { id: "aptos", symbol: "APTUSDT", name: "Aptos", abbr: "APT" },
  { id: "vechain", symbol: "VETUSDT", name: "VeChain", abbr: "VET" },
  { id: "algorand", symbol: "ALGOUSDT", name: "Algorand", abbr: "ALGO" },
  { id: "fantom", symbol: "FTMUSDT", name: "Fantom", abbr: "FTM" },
  { id: "sandbox", symbol: "SANDUSDT", name: "The Sandbox", abbr: "SAND" },
  { id: "decentraland", symbol: "MANAUSDT", name: "Decentraland", abbr: "MANA" },
  { id: "aave", symbol: "AAVEUSDT", name: "Aave", abbr: "AAVE" },
  { id: "theta", symbol: "THETAUSDT", name: "Theta Network", abbr: "THETA" },
  { id: "elrond", symbol: "EGLDUSDT", name: "MultiversX", abbr: "EGLD" },
  { id: "hedera", symbol: "HBARUSDT", name: "Hedera", abbr: "HBAR" },
  { id: "eos", symbol: "EOSUSDT", name: "EOS", abbr: "EOS" },
  { id: "monero", symbol: "XMRUSDT", name: "Monero", abbr: "XMR" },
  { id: "tezos", symbol: "XTZUSDT", name: "Tezos", abbr: "XTZ" },
  { id: "flow", symbol: "FLOWUSDT", name: "Flow", abbr: "FLOW" },
  { id: "iota", symbol: "IOTAUSDT", name: "IOTA", abbr: "IOTA" },
  { id: "neo", symbol: "NEOUSDT", name: "NEO", abbr: "NEO" },
  { id: "dash", symbol: "DASHUSDT", name: "Dash", abbr: "DASH" },
  { id: "zcash", symbol: "ZECUSDT", name: "Zcash", abbr: "ZEC" },
  { id: "chiliz", symbol: "CHZUSDT", name: "Chiliz", abbr: "CHZ" },
  { id: "gala", symbol: "GALAUSDT", name: "Gala", abbr: "GALA" },
  { id: "ankr", symbol: "ANKRUSDT", name: "Ankr", abbr: "ANKR" },
];

const COINS_PER_PAGE = 8;

const SORT_OPTIONS = [
  { value: "", label: "Default" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "change_desc", label: "24h Change: Best First" },
  { value: "change_asc", label: "24h Change: Worst First" },
  { value: "volume_desc", label: "Volume: High to Low" },
];

function Home() {
  const [coins, setCoins] = useState([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOption, setSortOption] = useState("");
  const debounceTimer = useRef(null);

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const promises = TOP_COINS.map((coin) =>
          axios.get(`/binance/api/v3/ticker/24hr?symbol=${coin.symbol}`)
        );
        const results = await Promise.all(promises);
        const formatted = results.map((res, index) => ({
          id: TOP_COINS[index].id,
          name: TOP_COINS[index].name,
          symbol: TOP_COINS[index].abbr,
          binanceSymbol: TOP_COINS[index].symbol,
          image: `https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons/128/color/${TOP_COINS[index].abbr.toLowerCase()}.png`,
          current_price: parseFloat(res.data.lastPrice),
          price_change_percentage_24h: parseFloat(res.data.priceChangePercent),
          market_cap: parseFloat(res.data.quoteVolume),
        }));
        setCoins(formatted);
        setLoading(false);
      } catch (err) {
        console.error("API Error:", err.message);
        setLoading(false);
      }
    };

    void fetchCoins();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    setCurrentPage(1);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      setDebouncedSearch(value);
    }, 500);
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
    setCurrentPage(1);
  };

  // Filter
  const filteredCoins = coins.filter(
    (coin) =>
      coin.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  // Sort
  const sortedCoins = [...filteredCoins].sort((a, b) => {
    switch (sortOption) {
      case "price_desc": return b.current_price - a.current_price;
      case "price_asc": return a.current_price - b.current_price;
      case "change_desc": return b.price_change_percentage_24h - a.price_change_percentage_24h;
      case "change_asc": return a.price_change_percentage_24h - b.price_change_percentage_24h;
      case "volume_desc": return b.market_cap - a.market_cap;
      default: return 0;
    }
  });

  // Pagination
  const totalPages = Math.ceil(sortedCoins.length / COINS_PER_PAGE);
  const paginatedCoins = sortedCoins.slice(
    (currentPage - 1) * COINS_PER_PAGE,
    currentPage * COINS_PER_PAGE
  );

  const getPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 || i === totalPages ||
        i === currentPage ||
        i === currentPage - 1 ||
        i === currentPage + 1
      ) {
        pages.push(i);
      }
    }
    return pages;
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-96 gap-3">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent
        rounded-full animate-spin"></div>
        <p className="text-gray-500 dark:text-gray-400 text-lg">
          Fetching live market data...
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
        🌍 Live Crypto Market
      </h1>
      <p className="text-gray-500 dark:text-gray-400 mb-6">
        Click on any coin to view details & trade
      </p>

      {/* Search + Sort */}
      <div className="flex items-center gap-3 mb-6">
        <input
          type="text"
          placeholder="🔍 Search coins... (e.g. Bitcoin, ETH)"
          value={search}
          onChange={handleSearch}
          className="flex-1 p-3 rounded-xl border border-gray-300 dark:border-gray-600
          bg-white dark:bg-gray-800 text-gray-800 dark:text-white
          focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={sortOption}
          onChange={handleSortChange}
          className="p-3 rounded-xl border border-gray-300 dark:border-gray-600
          bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300
          focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Coins Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow overflow-hidden">
        <div className="grid grid-cols-5 px-6 py-3 bg-gray-100 dark:bg-gray-700
        text-gray-500 dark:text-gray-300 text-sm font-semibold">
          <span># Coin</span>
          <span className="text-right">Price</span>
          <span className="text-right">24h Change</span>
          <span className="text-right">Volume</span>
          <span className="text-right">Action</span>
        </div>

        {paginatedCoins.map((coin, index) => (
          <CoinCard
            key={coin.id}
            coin={coin}
            index={(currentPage - 1) * COINS_PER_PAGE + index}
          />
        ))}
      </div>

      {/* Smart Pagination */}
      <div className="flex justify-center items-center gap-2 mt-6">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 rounded-lg bg-white dark:bg-gray-800
          text-gray-600 dark:text-gray-300 shadow disabled:opacity-40
          hover:bg-blue-50 dark:hover:bg-gray-700 transition-all font-medium"
        >
          ← Prev
        </button>

        {getPageNumbers().map((page, i, arr) => (
          <div key={page} className="flex items-center gap-2">
            {i > 0 && arr[i - 1] !== page - 1 && (
              <span className="text-gray-400 px-1">...</span>
            )}
            <button
              onClick={() => setCurrentPage(page)}
              className={`w-9 h-9 rounded-lg font-semibold transition-all
              ${currentPage === page
                ? "bg-blue-500 text-white shadow"
                : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700"
              }`}
            >
              {page}
            </button>
          </div>
        ))}

        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 rounded-lg bg-white dark:bg-gray-800
          text-gray-600 dark:text-gray-300 shadow disabled:opacity-40
          hover:bg-blue-50 dark:hover:bg-gray-700 transition-all font-medium"
        >
          Next →
        </button>
      </div>

      <p className="text-center text-gray-400 text-sm mt-2">
        Showing {(currentPage - 1) * COINS_PER_PAGE + 1}–{Math.min(
          currentPage * COINS_PER_PAGE, sortedCoins.length
        )} of {sortedCoins.length} coins
      </p>
    </div>
  );
}

export default Home;