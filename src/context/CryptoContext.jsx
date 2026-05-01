import { useState, useEffect } from "react";
import { CryptoContext } from "./CryptoContextValue";

export function CryptoProvider({ children }) {
  const [darkMode, setDarkMode] = useState(false);
  const [portfolio, setPortfolio] = useState(
    JSON.parse(localStorage.getItem("portfolio")) || []
  );
  const [balance, setBalance] = useState(
    JSON.parse(localStorage.getItem("balance")) ?? 10000
  );
  const [transactions, setTransactions] = useState(
    JSON.parse(localStorage.getItem("transactions")) || []
  );

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem("portfolio", JSON.stringify(portfolio));
  }, [portfolio]);

  useEffect(() => {
    localStorage.setItem("balance", JSON.stringify(balance));
  }, [balance]);

  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  const buyCoin = (coin, quantity) => {
    const totalCost = coin.current_price * quantity;
    if (totalCost > balance) {
      return { success: false, message: "Insufficient balance!" };
    }

    setBalance((prev) => prev - totalCost);

    setPortfolio((prev) => {
      const existing = prev.find((item) => item.id === coin.id);
      if (existing) {
        return prev.map((item) =>
          item.id === coin.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        ...prev,
        {
          id: coin.id,
          name: coin.name,
          symbol: coin.symbol,
          image: coin.image,
          buyPrice: coin.current_price,
          quantity: quantity,
        },
      ];
    });

    // Transaction record
    setTransactions((prev) => [
      {
        id: Date.now(),
        type: "buy",
        name: coin.name,
        symbol: coin.symbol,
        image: coin.image,
        quantity: quantity,
        price: coin.current_price,
        total: totalCost,
        date: new Date().toISOString(),
      },
      ...prev,
    ]);

    return { success: true, message: "Coin bought successfully!" };
  };

  const sellCoin = (coinId, quantity, currentPrice) => {
    const coin = portfolio.find((item) => item.id === coinId);
    if (!coin || coin.quantity < quantity) {
      return { success: false, message: "Not enough coins to sell!" };
    }

    setBalance((prev) => prev + currentPrice * quantity);

    setPortfolio((prev) =>
      prev
        .map((item) =>
          item.id === coinId
            ? { ...item, quantity: item.quantity - quantity }
            : item
        )
        .filter((item) => item.quantity > 0)
    );

    // Transaction record
    setTransactions((prev) => [
      {
        id: Date.now(),
        type: "sell",
        name: coin.name,
        symbol: coin.symbol,
        image: coin.image,
        quantity: quantity,
        price: currentPrice,
        total: currentPrice * quantity,
        date: new Date().toISOString(),
      },
      ...prev,
    ]);

    return { success: true, message: "Coin sold successfully!" };
  };

  return (
    <CryptoContext.Provider
      value={{
        darkMode, setDarkMode,
        portfolio, setPortfolio,
        balance, setBalance,
        transactions, setTransactions,
        buyCoin, sellCoin,
      }}
    >
      {children}
    </CryptoContext.Provider>
  );
}
