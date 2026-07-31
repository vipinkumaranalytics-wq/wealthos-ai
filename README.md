# WealthOS AI 💰 — Financial Intelligence Platform

> Your all-in-one AI-powered financial dashboard. 100% free. 100% private. Zero backend.

[![GitHub Pages](https://img.shields.io/badge/Deploy-GitHub%20Pages-blue?logo=github)](https://pages.github.com/)
[![PWA](https://img.shields.io/badge/PWA-Ready-brightgreen?logo=pwa)](https://web.dev/progressive-web-apps/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![No Backend](https://img.shields.io/badge/Backend-None-green)](.)
[![Free Forever](https://img.shields.io/badge/Cost-Free%20Forever-success)](.)

---

## 🚀 Live Demo

**[Launch WealthOS AI →](https://yourusername.github.io/wealthos-ai/)**

---

## ✨ Features

### 📊 Market Intelligence (30+ Modules)
| Module | Description |
|--------|-------------|
| 🏠 Dashboard | Portfolio overview, live market ticker, fear & greed |
| 🌍 Global Markets | World indices, commodities, sectors |
| 📈 Stocks | Real-time stock screener with Alpha Vantage |
| 🪙 Crypto | 250+ coins via CoinGecko, DeFi, trending |
| 💱 Forex | 25+ currency pairs, live converter |
| 🛢️ Commodities | Gold, Oil, Silver, Copper, Agricultural |
| 📅 Economic Calendar | Fed meetings, CPI, GDP, payrolls |
| 🚀 IPO Tracker | Upcoming and recent IPOs |
| 😱 Fear & Greed | Market sentiment gauge + history |
| 📰 Business News | Multi-source RSS with sentiment analysis |
| 🔥 Market Heatmap | Visual sector and stock heat map |
| 📊 Sector Performance | All 11 S&P sectors ranked |
| 🏆 Top Gainers/Losers | Daily market movers |
| 🏦 Financial Statements | Income, Balance Sheet, Cash Flow, Ratios |

### 💼 Personal Finance (10 Tools)
| Module | Description |
|--------|-------------|
| 💰 Personal Dashboard | Net worth, savings rate, health score |
| 💵 Income Tracker | Log all income sources |
| 🧾 Expense Tracker | Categorized spending with search/filter |
| 📊 Net Worth | Assets vs liabilities tracker |
| 🎯 Goal Planner | Financial goals with progress tracking |
| 💳 Debt Tracker | Snowball vs Avalanche strategies |
| 🌴 Retirement Planner | Corpus calculator with growth chart |
| 📋 Tax Planner | US tax estimator + India strategies |
| ⚖️ Budget Planner | 50/30/20 rule with live tracking |
| 💼 Portfolio | Holdings, P&L, allocation charts |

### 🤖 AI & Learning
| Module | Description |
|--------|-------------|
| 🤖 AI Financial Advisor | Local AI chat with finance knowledge base |
| 🎓 Learning Center | 6 structured courses, 36+ video lessons |
| 🔥 Habit Tracker | Financial habits with streak tracking |
| 📖 Financial Journal | Document your investment journey |
| 📑 Reports & Export | PDF-ready reports, CSV/JSON export |

---

## 🆓 Free APIs Used

| API | Data | Key Required |
|-----|------|-------------|
| [CoinGecko](https://www.coingecko.com/api/documentation) | Crypto prices, market data | No |
| [Alternative.me](https://alternative.me/crypto/fear-and-greed-index/) | Fear & Greed Index | No |
| [Open Exchange Rates](https://open.er-api.com) | Forex rates | No |
| [Alpha Vantage](https://www.alphavantage.co) | Stock data (25 req/day free) | Yes (free) |
| [World Bank](https://datahelpdesk.worldbank.org/knowledgebase/articles/889392) | Economic indicators | No |
| [rss2json](https://rss2json.com) | RSS news feeds | No |
| [GDELT](https://www.gdeltproject.org) | Global news sentiment | No |

---

## 🚀 Deploy to GitHub Pages (5 Minutes)

### Option 1: One-Click Deploy (Recommended)

1. **Fork this repository** → Click "Fork" button at top right
2. Go to **Settings → Pages**
3. Under **Source**, select `main` branch, `/ (root)` folder
4. Click **Save**
5. Your app is live at `https://yourusername.github.io/wealthos-ai/`

### Option 2: Upload Manually

1. Create a new GitHub repository named `wealthos-ai`
2. Upload all files from this ZIP
3. Enable GitHub Pages in Settings → Pages

### Option 3: Clone & Push

```bash
git clone https://github.com/yourusername/wealthos-ai.git
cd wealthos-ai
# Copy all files here
git add .
git commit -m "🚀 Initial WealthOS AI deployment"
git push origin main
```

---

## 💻 Run Locally

```bash
# Clone the repo
git clone https://github.com/yourusername/wealthos-ai.git
cd wealthos-ai

# Option A: Python (built-in)
python3 -m http.server 8000

# Option B: Node.js
npx serve .

# Option C: VS Code Live Server extension
# Right-click index.html → "Open with Live Server"

# Open browser
open http://localhost:8000
```

> ⚠️ Must use a local server (not file://) because of ES6 modules

---

## 📁 Project Structure

```
wealthos-ai/
├── index.html              # App shell, SPA container
├── manifest.json           # PWA manifest
├── service-worker.js       # Offline support
├── robots.txt
├── sitemap.xml
├── LICENSE
├── README.md
│
├── css/
│   └── main.css            # All styles (glassmorphism, dark/light, responsive)
│
├── js/
│   ├── app.js              # Main entry point, route registration
│   ├── router.js           # Hash-based SPA router
│   ├── store.js            # Observable state store (localStorage)
│   ├── utils.js            # Utilities (format, toast, cache, idb, export)
│   ├── config.js           # API endpoints, cache TTL, defaults
│   ├── api.js              # All API integrations
│   └── pages/
│       ├── dashboard.js    # Main dashboard
│       ├── markets.js      # Global markets, stocks, ETFs, heatmap
│       ├── crypto.js       # Cryptocurrency tracker
│       ├── portfolio.js    # Portfolio, watchlist, dividends
│       ├── forex.js        # Forex, commodities
│       ├── economic.js     # Economic calendar, IPO, fear & greed
│       ├── news.js         # Business news, sentiment
│       ├── ai-chat.js      # AI financial advisor
│       ├── personal.js     # Personal finance suite
│       ├── financial-statements.js  # Company financials
│       ├── learning.js     # Learning center, habits, journal
│       ├── reports.js      # Reports & export
│       └── settings.js     # App settings
│
└── assets/
    ├── icons/              # PWA icons (72px–512px)
    ├── images/             # Screenshots
    └── fonts/              # (optional) local fonts
```

---

## ⚙️ Customization

### Get a Free Alpha Vantage Key
1. Visit [alphavantage.co](https://www.alphavantage.co/support/#api-key)
2. Get your free API key (25 requests/day)
3. Edit `js/config.js`:
```js
ALPHA_KEY: 'YOUR_KEY_HERE',
```

### Change Default Stocks/Crypto
Edit `js/config.js`:
```js
DEFAULT_CRYPTO: ['bitcoin', 'ethereum', 'solana', 'cardano'],
DEFAULT_STOCKS: ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA'],
```

### Add Your Currency
Edit `js/config.js`:
```js
DEFAULT_CURRENCY: 'INR',  // Change to your local currency
```

---

## 🔒 Privacy

- **All data stored locally** in your browser (localStorage + IndexedDB)
- **No server, no database, no tracking**
- **No account required**
- Open source — audit the code yourself

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `D` | Dashboard |
| `C` | Crypto |
| `S` | Stocks |
| `P` | Portfolio |
| `N` | News |
| `A` | AI Chat |
| `W` | Watchlist |
| `F` | Forex |
| `/` | Focus search |
| `Ctrl+K` | Command palette |
| `T` | Toggle theme |

---

## 📱 Mobile App (PWA)

### Install on Android
1. Open the site in Chrome
2. Tap the ⋮ menu → "Add to Home screen"
3. Tap "Install"

### Install on iPhone
1. Open in Safari
2. Tap Share button → "Add to Home Screen"
3. Tap "Add"

---

## 🛠️ Tech Stack

- **Frontend**: Pure HTML5, CSS3, ES6 Modules (no framework, no bundler)
- **Charts**: Chart.js 4.4, ApexCharts 3.44
- **Icons**: Font Awesome 6.5
- **Fonts**: Google Fonts (Inter + JetBrains Mono)
- **Storage**: localStorage + IndexedDB
- **PWA**: Service Worker + Web App Manifest
- **Hosting**: GitHub Pages (free)

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit: `git commit -m 'Add amazing feature'`
4. Push: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

MIT License — free to use, modify, and distribute. See [LICENSE](LICENSE).

---

## 💡 Support

- ⭐ Star this repo if you find it useful
- 🐛 [Report bugs](https://github.com/yourusername/wealthos-ai/issues)
- 💬 [Request features](https://github.com/yourusername/wealthos-ai/issues/new)

---

*Built with ❤️ | WealthOS AI — Free Financial Intelligence for Everyone*
