# 📊 Polymarket Daily Dashboard — Open-Source Analytics (MVP Build)

A modern analytics dashboard designed to make Polymarket markets easier to explore, understand, and trade.  
Built with a focus on **orderbook clarity**, **spread detection**, **mock CLOB data**, and **AI-ready architecture**.

<p align="center">
  <img src="dashboard-preview.png" width="90%" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Status-MVP%20Ready-blue?style=for-the-badge" />
  <img src="https://img.shields.io/badge/API-Whitelist-Pending-orange?style=for-the-badge" />
  <img src="https://img.shields.io/badge/License-MIT-success?style=for-the-badge" />
</p>

---

## 📚 Table of Contents
- [Key Features](#-key-features-mvp)
- [Dashboard Previews](#-dashboard-previews)
- [Project Structure](#-project-structure)
- [Included Mock Datasets](#-included-mock-datasets)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [API Whitelist Request](#-api-whitelist-request)
- [Why This Dashboard Matters](#-why-this-dashboard-matters)
- [Local Development](#-local-development)
- [Roadmap](#-roadmap-dec-2025)
- [Contributing](#-contributing)
- [License](#-license)

---

# 🚀 Key Features (MVP)

### 📈 Spread Scanner (0.1–0.8)
Quick insights across high-volume Polymarket markets.

### 📊 Market Digest  
Biggest movers, new markets, and short-term volatility signals.

### 🤖 AI Explainer Panel *(Coming Soon)*  
Explains *why* a market moved using orderbook dynamics and trade flow.

### 📉 Orderbook Depth  
Mock CLOB-style visualization for real-world UX preview.

### 📱 Mobile UI  
Responsive design optimized for mobile users.

### 📦 Mock Data Layer  
Develop and preview dashboard features **without API access**.

---

# 🖼️ Dashboard Previews

> **Note:** All assets in `/assets/` are mock UI previews and do not display real Polymarket market data.

## 🔥 1. Main Dashboard Overview  
<p align="center"><img src="assets/1.png" width="90%"></p>

---

## ⚡ 2. Spread & Liquidity Heatmap  
<p align="center"><img src="assets/2.png" width="90%"></p>

---

## 📱 3. Mobile UI & Price Stats  
<p align="center"><img src="assets/3.png" width="90%"></p>

---

## 🟢 4. Signals + Orderbook Depth  
<p align="center"><img src="assets/4.png" width="90%"></p>

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
Simulated Polymarket-style orderbook:
- Bid/Ask levels (L1–L5)  
- Spread  
- Liquidity imbalance  
- Mid-price estimation  

---

### 🟧 `mock_trades.json`
Synthetic 24h trade feed:
- Timestamps  
- Price  
- Size  
- Side (buy/sell)  
- Trade impact score  

---

### 🟥 `mock_spread_history.json`
Compatible with charts + alerts:
- Spread movement  
- Microtrends  
- Volatility bands  

These datasets enable **full dashboard development** even before receiving API access.

---

# 🛠️ Tech Stack

- **React + Vite**
- **Tailwind CSS**
- **Recharts**
- **Mock REST data layer**
- *(Planned)* CLOB REST + WebSocket stream support

---

# 🧠 Architecture

```
Frontend (React)
│
├── UI Components
│   ├── Dashboard
│   ├── Spread Scanner
│   ├── Orderbook Depth
│   ├── AI Explainer (future)
│
├── Data Layer
│   ├── mock_orderbook.json
│   ├── mock_trades.json
│   └── mock_spread_history.json
│
└── Integration Layer (Soon)
    ├── CLOB REST API
    ├── WebSocket Streams
    └── Real-time depth + trades
```

---

# 🔐 API Whitelist Request

📌 **Status:**  
- Whitelist request submitted  
- Support ticket active  
- Awaiting approval from the Polymarket engineering team

📌 **API Readiness:**  
This dashboard already supports:

- Markets feed  
- Orderbook endpoint  
- Trades endpoint  
- Real-time streaming (planned)  

Once CLOB API access is granted, integration begins immediately.

---

# 🌟 Why This Dashboard Matters

Polymarket is rapidly expanding, and builders are essential for improving market discovery, analytics, and user experience.

This project contributes to the ecosystem by:

### ✔ Making market discovery easier  
### ✔ Offering clean spread & liquidity visualization  
### ✔ Providing UI-ready components for future tools  
### ✔ Enabling users to interpret orderflow intuitively  
### ✔ Preparing an AI-powered reasoning layer  

With official CLOB API access, this dashboard becomes a fully functional analytics suite built on top of Polymarket.

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

### **Phase 1 — UI Complete**  
✔ Dashboard layout  
✔ Mobile UI  
✔ Spread Scanner  
✔ Mock Data  
✔ All preview assets uploaded  

### **Phase 2 — API Integration**  
▢ CLOB REST integration  
▢ WebSocket updates  
▢ User positions view  

### **Phase 3 — AI Expansion**  
▢ AI Explainer  
▢ Market Chat Assistant  
▢ Reason Engine  

### **Phase 4 — Alerts & Automation**  
▢ Spread alerts  
▢ Volume shocks  
▢ Liquidity imbalance detection  

---

# 🤝 Contributing

Suggestions, UI ideas, and contributions are welcome.  
Feel free to open an issue or PR.

---

# 📜 License  
MIT License — free to use, modify, and distribute.

---
