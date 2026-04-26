import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ErrorBoundary from "./components/ErrorBoundary";

const Home = lazy(() => import("./pages/Home"));
const Portfolio = lazy(() => import("./pages/Portfolio"));
const CoinDetail = lazy(() => import("./pages/CoinDetail"));
const Transactions = lazy(() => import("./pages/Transactions"));

function PageLoader() {
  return (
    <div className="flex flex-col justify-center items-center h-96 gap-3">
      <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent 
      rounded-full animate-spin"></div>
      <p className="text-gray-500 dark:text-gray-400 text-lg">Loading...</p>
    </div>
  );
}

function App() {
  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen">
      <Navbar />
      <ErrorBoundary>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/coin/:id" element={<CoinDetail />} />
            <Route path="/transactions" element={<Transactions />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}

export default App;