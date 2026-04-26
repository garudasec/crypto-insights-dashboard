import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCrypto } from "../context/CryptoContext";

function CoinCard({ coin, index }) {
  const navigate = useNavigate();
  const { buyCoin } = useCrypto();
  const [toast, setToast] = useState(null);

  const showToast = (message, success) => {
    setToast({ message, success });
    setTimeout(() => setToast(null), 3000);
  };

  const handleQuickBuy = (e) => {
    e.stopPropagation();
    const result = buyCoin(coin, 1);
    showToast(result.message, result.success);
  };

  return (
    <div
      onClick={() => navigate(`/coin/${coin.id}`)}
      className="grid grid-cols-5 px-6 py-4 border-b border-gray-100 
      dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-gray-700 
      cursor-pointer transition-all items-center"
    >
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 
        rounded-xl shadow-lg text-white font-semibold text-sm 
        flex items-center gap-2 whitespace-nowrap
        ${toast.success ? "bg-green-500" : "bg-red-500"}`}>
          {toast.success ? "✅" : "❌"} {toast.message}
        </div>
      )}

      {/* Coin Name */}
      <div className="flex items-center gap-3">
        <span className="text-gray-400 text-sm w-5">{index + 1}</span>
        <img
          src={coin.image}
          alt={coin.name}
          className="w-8 h-8"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://via.placeholder.com/32";
          }}
        />
        <div>
          <p className="font-semibold text-gray-800 dark:text-white">
            {coin.name}
          </p>
          <p className="text-xs text-gray-400 uppercase">{coin.symbol}</p>
        </div>
      </div>

      {/* Price */}
      <p className="text-right font-semibold text-gray-800 dark:text-white">
        ${coin.current_price.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </p>

      {/* 24h Change */}
      <p className={`text-right font-semibold ${
        coin.price_change_percentage_24h >= 0
          ? "text-green-500" : "text-red-500"}`}>
        {coin.price_change_percentage_24h >= 0 ? "▲" : "▼"}{" "}
        {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
      </p>

      {/* Volume */}
      <p className="text-right text-gray-500 dark:text-gray-400 text-sm">
        ${(coin.market_cap / 1e9).toFixed(2)}B
      </p>

      {/* Buy Button */}
      <div className="text-right">
        <button
          onClick={handleQuickBuy}
          className="bg-blue-500 hover:bg-blue-600 text-white text-sm 
          px-4 py-1.5 rounded-lg transition-all"
        >
          Buy
        </button>
      </div>
    </div>
  );
}

export default CoinCard;