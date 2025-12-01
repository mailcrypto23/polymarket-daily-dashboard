# 📊 Polymarket Daily Dashboard — Open-Source Analytics (MVP Build)

A modern, lightweight analytics dashboard designed to make Polymarket markets easier to explore, understand, and trade.  
Built with a focus on **orderbook clarity**, **spread detection**, **mock API data**, and **AI-ready architecture**.

<p align="center">
  <img src="dashboard-preview.png" width="90%" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Status-MVP%20Ready-blue?style=for-the-badge" />
  <img src="https://img.shields.io/badge/API-Whitelist-Pending-orange?style=for-the-badge" />
  <img src="https://img.shields.io/badge/License-MIT-success?style=for-the-badge" />
</p>

---

# 🚀 Key Features (MVP)

### 📈 Spread Scanner (0.1–0.8)
Quick insight across high-volume Polymarket markets.

### 📊 Market Digest  
Biggest movers, new markets, key events — all in one glance.

### 🤖 AI Explainer Panel *(Coming Soon)*  
Explains market moves using price action and orderbook behavior.

### 📉 Orderbook Depth  
Mock CLOB-style visualization for real UX preview.

### 📱 Mobile UI  
Fully responsive interface for mobile-first use.

### 📦 Mock Data Layer  
Build and test UI **without API access / whitelist**.

---

# 🖼️ Dashboard Previews

**All assets in `/assets/` are generated UI previews (mock UI, not real Polymarket data).**

## 🔥 1. Main Dashboard Overview  
<p align="center">
  <img src="assets/1.png" width="90%">
</p>

---

## ⚡ 2. Spread & Liquidity Heatmap  
<p align="center">
  <img src="assets/2.png" width="90%">
</p>

---

## 📱 3. Mobile UI & Price Stats  
<p align="center">
  <img src="assets/3.png" width="90%">
</p>

---

## 🟢 4. Signals + Orderbook Depth  
<p align="center">
  <img src="assets/4.png" width="90%">
</p>

---

# 📁 Project Structure

```
polymarket-daily-dashboard/
│── assets/
│   ├── 1.png
│   ├── 2.png
│   ├── 3.png
│   ├── 4.png
│   └── .gitkeep
│
│── mock-data/
│   ├── mock_orderbook.json
│   ├── mock_trades.json
│   ├── mock_spread_history.json
│   └── .gitkeep
│
│── public/
│── src/
│── dashboard-preview.png
│── README.md
│── LICENSE
```

---

# 📦 Included Mock Datasets

### 🟦 `mock_orderbook.json`
Simulated Polymarket CLOB-style orderbook with:
- Bids & Asks  
- Multi-level depth (L1–L5)  
- Spread  
- Liquidity imbalance  

---

### 🟧 `mock_trades.json`
Synthetic trade feed including:
- timestamps  
- size  
- price  
- buy/sell side  
- impact score  

---

### 🟥 `mock_spread_history.json`
Used for heatmaps + alerts:
- spread history  
- microtrends  
- volatility patterns  

> These datasets allow **full development without API restrictions**.

---

# 🛠️ Tech Stack

- **React (Vite)**
- **Tailwind CSS**
- **Recharts**
- **Mock REST layer**
- **Planned:** CLOB REST + WebSocket streaming

---

# 🧠 Architecture

```
Frontend (React)
│
├── UI Components
│   ├── Dashboard
│   ├── Spread Scanner
│   ├── Orderbook Depth
│   ├── AI Explainer (coming soon)
│
├── Mock Data Layer
│   ├── mock_orderbook.json
│   ├── mock_trades.json
│   └── mock_spread_history.json
│
└── API Layer (Soon)
    ├── CLOB REST Integration
    ├── WebSocket Streaming
```

---

# 🔐 API Whitelist Request

📌 **Status:**  
- API Whitelist request submitted  
- Customer Support ticket open  
- Awaiting approval from the Polymarket Team  

📌 **Readiness:**  
This dashboard is now fully structured for API integration:
- Orderbook endpoint  
- Markets feed  
- Trades feed  
- WebSocket real-time updates  

---

# 🛠️ Local Development

### Clone the repo
```bash
git clone https://github.com/mailcrypto23/polymarket-daily-dashboard
cd polymarket-daily-dashboard
```

### Install dependencies
```bash
npm install
```

### Run locally
```bash
npm run dev
```

---

# 🔮 Roadmap (Dec 2025)

### Phase 1 — UI Complete  
✔ Dashboard  
✔ Mobile UI  
✔ Spread Scanner  
✔ Mock Data  
✔ All previews uploaded  

### Phase 2 — API Integration  
▢ CLOB REST  
▢ WebSocket streaming  
▢ User positions analysis  

### Phase 3 — AI Assist Features  
▢ AI Explainer  
▢ AI Chat  
▢ Reason Engine for markets  

### Phase 4 — Alerts System  
▢ Spread alerts  
▢ Liquidity shocks  
▢ Volume spikes  

---

# 🤝 Contributing
Contributions, improvements, UI ideas, or new modules are welcome.

---

# 📜 License  
MIT License — free to use, modify, and distribute.

---
