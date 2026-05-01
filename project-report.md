# Project Report

## 1. Project Definition

**Title:** Crypto Insights Dashboard

**Domain:** Finance / Cryptocurrency Analytics

**Problem Statement:** Create a frontend-only dashboard that helps users explore live cryptocurrency market data, manage a virtual portfolio, and review transaction history with no backend or machine learning.

## 2. User Interface

- Built with React and Vite.
- Styled using Tailwind CSS.
- Uses React Router for navigation between pages.
- Pages include Market, Portfolio, Coin Detail, and Transactions.
- Lazy loading is implemented for route-based bundles.

## 3. State Management

- Uses Context API for global state.
- Shared state includes dark mode, portfolio, balance, and transactions.
- Local storage persistence keeps portfolio and transaction data across browser reloads.

## 4. API/Data Integration

- Fetches real-time coin data from Binance public API endpoints.
- Uses Axios for API calls.
- Coin detail page loads 7-day price history from Binance klines API.

## 5. CRUD Operations

- Create: buy coins adds portfolio entries and transaction records.
- Read: displays current portfolio, transaction history, and market listings.
- Update: portfolio quantities update when additional coins are purchased.
- Delete: transactions can be cleared and portfolio can be reset.

## 6. Performance Optimization

- Route-based code splitting with React lazy and Suspense.
- Pagination on the market coin list.
- Debounced search input to reduce repeated filtering operations.

## 7. Error Handling

- ErrorBoundary component catches runtime rendering errors.
- API errors are handled and logged to the console without crashing the app.

## 8. Deployment & Documentation

- Ready for deployment to Vercel or Netlify.
- Documentation updated to reflect capstone compliance.

## Advanced Features Implemented

- Search + sort + filter
- Dark mode toggle
- Error boundary implementation
- Dashboard with charts
- Pagination
- Lazy loading
- Local storage persistence

## Compliance Notes

- No backend used.
- No machine learning used.
- Project follows the mandatory stack: React, Context API, Router, Axios, Tailwind.
- The domain and API are unique compared to standard templates.
