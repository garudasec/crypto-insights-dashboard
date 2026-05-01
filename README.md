# Crypto Insights Dashboard

## Project Overview

Crypto Insights Dashboard is a React-based frontend application built with Vite. It provides a unique finance domain solution using real-time cryptocurrency market data from Binance public APIs.

This project is strictly frontend-only and does not use backend services or machine learning. It is designed to align with the capstone guidelines for React, Context API, routing, API integration, performance optimization, error handling, and documentation.

## Domain & Problem Statement

- Domain: Finance / Cryptocurrency Analytics
- Unique problem statement: Provide a lightweight dashboard for users to explore live crypto market data, manage a virtual portfolio, and track buy/sell transactions using only frontend state and public API data.

## Tech Stack

- Frontend: React (Vite)
- State management: Context API
- Routing: React Router v7
- API integration: Axios with Binance public REST APIs
- Styling: Tailwind CSS
- Performance: Lazy loading, client-side pagination, debounced search
- Error handling: React Error Boundary
- Deployment-ready: Vercel / Netlify

## Key Features

- Live market data from Binance API
- Search, filter, and sort coin listings
- Pagination for large coin lists
- Lazy-loaded page routes
- Dark mode toggle
- Portfolio management (buy/sell simulation)
- Transaction history with filter options
- Interactive coin detail chart using Recharts
- Error boundary for runtime safety
- Local storage persistence for portfolio, balance, and transactions

## Project Structure

- `src/App.jsx` - main application routes and lazy loading
- `src/context/*` - shared Context API state management
- `src/pages/*` - page components for Market, Portfolio, Coin details, and Transactions
- `src/components/*` - reusable UI components

## Capstone Guidelines Alignment

1. Problem Definition: unique finance dashboard problem using real-time crypto data.
2. User Interface: fully React-based UI with Tailwind CSS styling.
3. State Management: Context API used in `src/context/CryptoContext.jsx`.
4. API/Data Integration: Axios integration with Binance REST APIs for live coin and kline data.
5. CRUD Operations: virtual buy/sell operations update portfolio and transaction records in local storage.
6. Performance Optimization: lazy routes, pagination, and search debouncing.
7. Error Handling: React Error Boundary implementation and safe API error handling.
8. Deployment & Documentation: repository is ready for deployment and this README documents the project.

## No Backend / No ML

- This app uses only frontend technologies.
- No ML, no backend servers, no server-side logic.

## Run Locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Notes

- The project uses the Binance public API and is therefore unique in domain and data source.
- This repository is structured to satisfy strict teacher requirements for frontend-only capstone projects.
