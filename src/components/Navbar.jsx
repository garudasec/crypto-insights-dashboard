import { Link, NavLink } from "react-router-dom";
import { useCrypto } from "../context/useCrypto";
import { FaSun, FaMoon, FaCoins } from "react-icons/fa";

function Navbar() {
  const { darkMode, setDarkMode, balance } = useCrypto();

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md px-6 py-4 flex 
    justify-between items-center sticky top-0 z-50">

      {/* Logo */}
      <Link to="/" className="flex items-center gap-2">
        <FaCoins className="text-yellow-500 text-2xl" />
        <span className="text-xl font-bold text-gray-800 dark:text-white">
          CryptoInsight
        </span>
      </Link>

      {/* Nav Links */}
      <div className="flex items-center gap-6">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive
              ? "text-blue-500 font-semibold"
              : "text-gray-600 dark:text-gray-300 hover:text-blue-500"
          }
        >
          Market
        </NavLink>
        <NavLink
          to="/portfolio"
          className={({ isActive }) =>
            isActive
              ? "text-blue-500 font-semibold"
              : "text-gray-600 dark:text-gray-300 hover:text-blue-500"
          }
        >
          Portfolio
        </NavLink>
        <NavLink
          to="/transactions"
          className={({ isActive }) =>
            isActive
              ? "text-blue-500 font-semibold"
              : "text-gray-600 dark:text-gray-300 hover:text-blue-500"
          }
        >
          Transactions
        </NavLink>
      </div>

      {/* Balance + Dark Mode */}
      <div className="flex items-center gap-4">
        <span className="text-green-500 font-bold text-sm">
          💰 ${balance.toFixed(2)}
        </span>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="text-xl text-gray-600 dark:text-yellow-400"
        >
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>
      </div>

    </nav>
  );
}

export default Navbar;