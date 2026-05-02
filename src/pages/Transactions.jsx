import { useState } from "react";
import { Link } from "react-router-dom";
import { useCrypto } from "../context/useCrypto";

function Transactions() {
  const { transactions, setTransactions } = useCrypto();
  const [filter, setFilter] = useState("all");

  const filtered = transactions.filter((t) => {
    if (filter === "all") return true;
    return t.type === filter;
  });

  const totalBought = transactions
    .filter((t) => t.type === "buy")
    .reduce((sum, t) => sum + t.total, 0);

  const totalSold = transactions
    .filter((t) => t.type === "sell")
    .reduce((sum, t) => sum + t.total, 0);

  const handleClear = () => {
    if (window.confirm("Clear all transaction history?")) {
      setTransactions([]);
    }
  };

  const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleString(undefined, {
      year: "numeric", month: "short", day: "2-digit",
      hour: "2-digit", minute: "2-digit",
    });
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">

      <div className="flex justify-between items-center mb-2">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          📜 Transaction History
        </h1>
        {transactions.length > 0 && (
          <button
            onClick={handleClear}
            className="bg-red-500 hover:bg-red-600 text-white 
            px-4 py-2 rounded-lg text-sm font-semibold transition-all"
          >
            🗑 Clear History
          </button>
        )}
      </div>
      <p className="text-gray-500 dark:text-gray-400 mb-6">
        All trade transactions
      </p>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
          <p className="text-gray-400 text-sm">Total Trades</p>
          <p className="text-2xl font-bold text-gray-800 dark:text-white">
            {transactions.length}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
          <p className="text-gray-400 text-sm">Total Bought</p>
          <p className="text-2xl font-bold text-green-500">
            ${totalBought.toLocaleString(undefined, {
              minimumFractionDigits: 2, maximumFractionDigits: 2
            })}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
          <p className="text-gray-400 text-sm">Total Sold</p>
          <p className="text-2xl font-bold text-red-500">
            ${totalSold.toLocaleString(undefined, {
              minimumFractionDigits: 2, maximumFractionDigits: 2
            })}
          </p>
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        {[
          { v: "all", l: "All" },
          { v: "buy", l: "Buys" },
          { v: "sell", l: "Sells" },
        ].map((opt) => (
          <button
            key={opt.v}
            onClick={() => setFilter(opt.v)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all
            ${filter === opt.v
              ? "bg-blue-500 text-white shadow"
              : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700"
            }`}
          >
            {opt.l}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 shadow text-center">
          <p className="text-4xl mb-4">📭</p>
          <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">
            {transactions.length === 0
              ? "Koi trade nahi hui abhi! Market pe jaao aur coins kharido."
              : "Is filter mein koi transaction nahi."}
          </p>
          {transactions.length === 0 && (
            <Link
              to="/"
              className="inline-block bg-blue-500 hover:bg-blue-600 text-white 
              px-5 py-2 rounded-lg font-semibold transition-all"
            >
              Market pe jao →
            </Link>
          )}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow overflow-hidden">
          <div className="grid grid-cols-6 px-6 py-3 bg-gray-100 dark:bg-gray-700 
          text-gray-500 dark:text-gray-300 text-sm font-semibold">
            <span>Type</span>
            <span>Coin</span>
            <span className="text-right">Qty</span>
            <span className="text-right">Price</span>
            <span className="text-right">Total</span>
            <span className="text-right">Date</span>
          </div>


          <div className="max-h-96 overflow-y-auto">
            {filtered.map((t) => (
              <div
                key={t.id}
                className="grid grid-cols-6 px-6 py-4 border-b border-gray-100 
                dark:border-gray-700 items-center text-sm"
              >
                <span className={`font-semibold ${
                  t.type === "buy" ? "text-green-500" : "text-red-500"
                }`}>
                  {t.type === "buy" ? "▲ BUY" : "▼ SELL"}
                </span>

                <div className="flex items-center gap-2">
                  <img
                    src={t.image}
                    alt={t.name}
                    className="w-7 h-7"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/28";
                    }}
                  />
                  <div>
                    <p className="font-semibold text-gray-800 dark:text-white">
                      {t.name}
                    </p>
                    <p className="text-xs text-gray-400 uppercase">{t.symbol}</p>
                  </div>
                </div>

                <span className="text-right text-gray-800 dark:text-white">
                  {t.quantity}
                </span>

                <span className="text-right text-gray-800 dark:text-white">
                  ${t.price.toLocaleString(undefined, {
                    minimumFractionDigits: 2, maximumFractionDigits: 2
                  })}
                </span>

                <span className="text-right font-semibold text-gray-800 dark:text-white">
                  ${t.total.toLocaleString(undefined, {
                    minimumFractionDigits: 2, maximumFractionDigits: 2
                  })}
                </span>

                <span className="text-right text-gray-400 text-xs">
                  {formatDate(t.date)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Transactions;