import { useCrypto } from "../context/CryptoContext";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, Cell
} from "recharts";

const COLORS = ["#3b82f6","#10b981","#f59e0b","#ef4444","#8b5cf6",
  "#06b6d4","#f97316","#84cc16","#e11d48","#6366f1"];

function Portfolio() {
  const { portfolio, balance, sellCoin, setPortfolio, setBalance } = useCrypto();

  const totalInvested = portfolio.reduce(
    (sum, coin) => sum + coin.buyPrice * coin.quantity, 0
  );

  const chartData = portfolio.map((coin) => ({
    name: coin.symbol.toUpperCase(),
    value: parseFloat((coin.buyPrice * coin.quantity).toFixed(2)),
  }));

  const handleSell = (coin) => {
    const result = sellCoin(coin.id, coin.quantity, coin.buyPrice);
    alert(result.message);
  };

  const handleReset = () => {
    if (window.confirm("Reset karein? Saara portfolio clear ho jayega aur balance $10,000 ho jayega!")) {
      setPortfolio([]);
      setBalance(10000);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">

      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          💼 My Portfolio
        </h1>
        <button
          onClick={handleReset}
          className="bg-red-500 hover:bg-red-600 text-white 
          px-4 py-2 rounded-lg text-sm font-semibold transition-all"
        >
          🔄 Reset Portfolio
        </button>
      </div>
      <p className="text-gray-500 dark:text-gray-400 mb-6">
        Track your virtual investments
      </p>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow">
          <p className="text-gray-400 text-sm mb-1">Available Balance</p>
          <p className="text-2xl font-bold text-green-500">
            ${balance.toFixed(2)}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow">
          <p className="text-gray-400 text-sm mb-1">Total Invested</p>
          <p className="text-2xl font-bold text-blue-500">
            ${totalInvested.toFixed(2)}
          </p>
        </div>
      </div>

      {portfolio.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 shadow text-center">
          <p className="text-4xl mb-4">📭</p>
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            No coins yet! Go to Market and buy some coins.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-6">

          {/* LEFT — Coin Holdings */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow overflow-hidden">
            <div className="px-6 py-4 bg-gray-100 dark:bg-gray-700">
              <h2 className="font-semibold text-gray-700 dark:text-white">
                🪙 Your Holdings
              </h2>
            </div>
            <div className="overflow-y-auto max-h-96">
              {portfolio.map((coin) => (
                <div
                  key={coin.id}
                  className="flex items-center justify-between px-6 py-4 
                  border-b border-gray-100 dark:border-gray-700"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={coin.image}
                      alt={coin.name}
                      className="w-10 h-10"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/40";
                      }}
                    />
                    <div>
                      <p className="font-semibold text-gray-800 dark:text-white">
                        {coin.name}
                      </p>
                      <p className="text-xs text-gray-400">
                        {coin.quantity} × ${coin.buyPrice.toLocaleString(undefined, {
                          minimumFractionDigits: 2, maximumFractionDigits: 2
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-800 dark:text-white">
                      ${(coin.buyPrice * coin.quantity).toLocaleString(undefined, {
                        minimumFractionDigits: 2, maximumFractionDigits: 2
                      })}
                    </p>
                    <button
                      onClick={() => handleSell(coin)}
                      className="text-xs bg-red-500 hover:bg-red-600 text-white 
                      px-3 py-1 rounded-lg mt-1 transition-all"
                    >
                      Sell All
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — Bar Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow">
            <h2 className="font-semibold text-gray-700 dark:text-white mb-4">
              📊 Portfolio Distribution
            </h2>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart
                data={chartData}
                margin={{ top: 10, right: 10, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12, fill: "#9ca3af" }}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#9ca3af" }}
                  tickFormatter={(v) => `$${v.toLocaleString()}`}
                />
                <Tooltip
                  formatter={(value) => [`$${value.toLocaleString()}`, "Invested"]}
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "none",
                    borderRadius: "8px",
                    color: "#fff"
                  }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {chartData.map((_, index) => (
                    <Cell
                      key={index}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

        </div>
      )}
    </div>
  );
}

export default Portfolio;