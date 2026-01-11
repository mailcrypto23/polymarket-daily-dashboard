import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./layouts/Layout";

import Dashboard from "./pages/Dashboard";
import Market from "./pages/Market";
import OrderbookPage from "./pages/OrderbookPage";
import Portfolio from "./pages/Portfolio";
import Settings from "./pages/Settings";

// 🔁 Engine runner
import { startBackgroundRunner } from "./services/backgroundRunner";

// 🧠 Analytics seed
import { seedResolvedSignals } from "./engine/signalPersistence";
import { SEED_SIGNALS } from "./engine/seedSignals";

export default function App() {
  // ✅ START ENGINE LOOP + SEED ANALYTICS ONCE
  useEffect(() => {
    startBackgroundRunner();
    seedResolvedSignals(SEED_SIGNALS);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <Dashboard />
            </Layout>
          }
        />
        <Route
          path="/market"
          element={
            <Layout>
              <Market />
            </Layout>
          }
        />
        <Route
          path="/orderbook"
          element={
            <Layout>
              <OrderbookPage />
            </Layout>
          }
        />
        <Route
          path="/portfolio"
          element={
            <Layout>
              <Portfolio />
            </Layout>
          }
        />
        <Route
          path="/settings"
          element={
            <Layout>
              <Settings />
            </Layout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
