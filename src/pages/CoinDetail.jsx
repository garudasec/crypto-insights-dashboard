import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useCrypto } from "../context/CryptoContext";
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid,
} from "recharts";

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

function CoinDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { buyCoin, sellCoin, portfolio, balance } = useCrypto();

  const [coin, setCoin] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [toast, setToast] = useState(null);

  const showToast = (message, success) => {
    setToast({ message, success });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const fetchCoin = async () => {
      try {
        const coinInfo = TOP_COINS.find((c) => c.id === id);
        if (!coinInfo) { setLoading(false); return; }

        const statsRes = await axios.get(
          `/binance/api/v3/ticker/24hr?symbol=${coinInfo.symbol}`
        );

        setCoin({
          id: coinInfo.id,
          name: coinInfo.name,
          symbol: coinInfo.abbr,
          image: `https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons/128/color/${coinInfo.abbr.toLowerCase()}.png`,
          current_price: parseFloat(statsRes.data.lastPrice),
          price_change_percentage_24h: parseFloat(statsRes.data.priceChangePercent),
          high_24h: parseFloat(statsRes.data.highPrice),
          low_24h: parseFloat(statsRes.data.lowPrice),
          total_volume: parseFloat(statsRes.data.quoteVolume),
        });

        const chartRes = await axios.get(
          `/binance/api/v3/klines?symbol=${coinInfo.symbol}&interval=1d&limit=7`
        );

        const formatted = chartRes.data.map((item) => ({
          date: new Date(item[0]).toLocaleDateString(),
          price: parseFloat(parseFloat(item[4]).toFixed(2)),
        }));

        setChartData(formatted);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchCoin();
  }, [id]);

  const handleBuy = () => {
    if (!coin) return;
    const result = buyCoin(
      {
        id: coin.id,
        name: coin.name,
        symbol: coin.symbol,
        image: coin.image,
        current_price: coin.current_price,
      },
      Number(quantity)
    );
    showToast(result.message, result.success);
  };

  const handleSell = () => {
    if (!coin) return;
    const result = sellCoin(coin.id, Number(quantity), coin.current_price);
    showToast(result.message, result.success);
  };

  const ownedCoin = portfolio.find((item) => item.id === id);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-96 gap-3">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent 
        rounded-full animate-spin"></div>
        <p className="text-gray-500 dark:text-gray-400 text-lg">
          Loading coin data...
        </p>
      </div>
    );
  }

  if (!coin) {
    return (
      <div className="flex justify-center items-center h-96">
        <p className="text-red-500 text-xl">Coin not found!</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">

      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 
        rounded-xl shadow-lg text-white font-semibold text-sm 
        flex items-center gap-2 whitespace-nowrap
        ${toast.success ? "bg-green-500" : "bg-red-500"}`}>
          {toast.success ? "✅" : "❌"} {toast.message}
        </div>
      )}

      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-blue-500 hover:underline flex items-center gap-1"
      >
        ← Back to Market
      </button>

      <div className="flex items-center gap-4 mb-6">
        <img
          src={coin.image}
          alt={coin.name}
          className="w-16 h-16"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://via.placeholder.com/64";
          }}
        />
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            {coin.name}
            <span className="text-gray-400 text-lg ml-2 uppercase">
              ({coin.symbol})
            </span>
          </h1>
          <p className="text-2xl font-semibold text-blue-500">
            ${coin.current_price.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
          <p className="text-gray-400 text-sm">24h Change</p>
          <p className={`text-xl font-bold ${
            coin.price_change_percentage_24h >= 0
              ? "text-green-500" : "text-red-500"}`}>
            {coin.price_change_percentage_24h.toFixed(2)}%
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
          <p className="text-gray-400 text-sm">24h High</p>
          <p className="text-xl font-bold text-gray-800 dark:text-white">
            ${coin.high_24h.toLocaleString(undefined, {
              minimumFractionDigits: 2, maximumFractionDigits: 2
            })}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
          <p className="text-gray-400 text-sm">24h Low</p>
          <p className="text-xl font-bold text-gray-800 dark:text-white">
            ${coin.low_24h.toLocaleString(undefined, {
              minimumFractionDigits: 2, maximumFractionDigits: 2
            })}
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow mb-6">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          📈 7 Day Price Chart
        </h2>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10, fill: "#9ca3af" }}
              interval={1}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "#9ca3af" }}
              domain={["auto", "auto"]}
              tickFormatter={(v) => `$${v.toLocaleString()}`}
            />
            <Tooltip
              formatter={(value) => [`$${value.toLocaleString()}`, "Price"]}
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          💰 Trade {coin.name}
        </h2>

        <div className="flex gap-6 mb-4">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Available Balance:{" "}
            <span className="text-green-500 font-bold">
              ${balance.toFixed(2)}
            </span>
          </p>
          {ownedCoin && (
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              You Own:{" "}
              <span className="text-blue-500 font-bold">
                {ownedCoin.quantity} {coin.symbol.toUpperCase()}
              </span>
            </p>
          )}
        </div>

        <div className="flex items-center gap-4 mb-4">
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-32 p-2 rounded-lg border border-gray-300 
            dark:border-gray-600 bg-gray-50 dark:bg-gray-700 
            text-gray-800 dark:text-white focus:outline-none 
            focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Total Cost:{" "}
            <span className="font-bold text-gray-800 dark:text-white">
              ${(coin.current_price * quantity).toLocaleString(undefined, {
                minimumFractionDigits: 2, maximumFractionDigits: 2
              })}
            </span>
          </p>
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleBuy}
            className="bg-green-500 hover:bg-green-600 text-white 
            px-6 py-2 rounded-lg font-semibold transition-all"
          >
            ✅ Buy
          </button>
          <button
            onClick={handleSell}
            className="bg-red-500 hover:bg-red-600 text-white 
            px-6 py-2 rounded-lg font-semibold transition-all"
          >
            ❌ Sell
          </button>
        </div>
      </div>
    </div>
  );
}

export default CoinDetail;