// =====================================================
// WealthOS AI — Configuration
// All free API endpoints and settings
// =====================================================

export const CONFIG = {
  APP_NAME: 'WealthOS AI',
  APP_VERSION: '1.0.0',

  // Free APIs (no key required or free tier with key)
  API: {
    // CoinGecko — crypto, no key needed
    COINGECKO: 'https://api.coingecko.com/api/v3',

    // ExchangeRate — forex, free tier
    EXCHANGERATE: 'https://open.er-api.com/v6/latest',

    // Alternative.me — fear & greed index
    FEAR_GREED: 'https://api.alternative.me/fng/',

    // FRED — economic data (get free key at fred.stlouisfed.org)
    FRED: 'https://api.stlouisfed.org/fred/series/observations',
    FRED_KEY: 'YOUR_FRED_KEY', // Free key from fred.stlouisfed.org

    // Alpha Vantage — stocks (free tier 25 req/day)
    ALPHA_VANTAGE: 'https://www.alphavantage.co/query',
    ALPHA_KEY: 'demo', // Replace with your free key from alphavantage.co

    // World Bank — economic indicators, no key
    WORLD_BANK: 'https://api.worldbank.org/v2',

    // Open-Meteo — weather/climate, no key
    OPEN_METEO: 'https://api.open-meteo.com/v1/forecast',

    // Finnhub — stocks/news (free tier)
    FINNHUB: 'https://finnhub.io/api/v1',
    FINNHUB_KEY: 'YOUR_FINNHUB_KEY', // Free key from finnhub.io

    // NewsAPI free (replace with your key from newsapi.org)
    NEWSAPI: 'https://newsapi.org/v2',
    NEWS_KEY: 'YOUR_NEWS_KEY',

    // RSS to JSON (free proxy for RSS feeds)
    RSS2JSON: 'https://api.rss2json.com/v1/api.json',
    RSS2JSON_KEY: '', // optional, free without key (limited)

    // GDELT news (free, no key)
    GDELT: 'https://api.gdeltproject.org/api/v2/doc/doc',

    // Hugging Face Inference API (free tier)
    HF_API: 'https://api-inference.huggingface.co/models',
    HF_KEY: '', // Free key from huggingface.co (optional)
  },

  // Cache TTL in seconds
  CACHE: {
    CRYPTO: 60,        // 1 min
    FOREX: 300,        // 5 min
    STOCKS: 300,       // 5 min
    NEWS: 600,         // 10 min
    ECONOMIC: 3600,    // 1 hour
    FEAR_GREED: 3600,  // 1 hour
    WORLD_BANK: 86400, // 1 day
  },

  // Default currencies
  BASE_CURRENCY: 'USD',
  SUPPORTED_CURRENCIES: ['USD', 'EUR', 'GBP', 'JPY', 'INR', 'AUD', 'CAD', 'CHF', 'CNY'],

  // Default crypto watchlist
  DEFAULT_CRYPTO: ['bitcoin', 'ethereum', 'solana', 'cardano', 'ripple', 'dogecoin', 'polkadot', 'chainlink', 'avalanche-2', 'polygon'],

  // Default stock symbols (for demo data)
  DEFAULT_STOCKS: ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'META', 'NVDA', 'TSLA', 'BRK.B', 'JPM', 'V'],

  // NSE/BSE Indian stocks
  INDIAN_STOCKS: ['RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'ICICIBANK', 'HINDUNILVR', 'WIPRO', 'BAJFINANCE', 'SBIN', 'ADANIENT'],

  // Chart defaults
  CHART: {
    ANIMATION_DURATION: 750,
    RESPONSIVE: true,
  },

  // PWA
  PWA: {
    CACHE_NAME: 'wealthos-v1',
  },
};

export default CONFIG;
