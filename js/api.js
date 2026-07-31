// =====================================================
// WealthOS AI — API Layer (All free endpoints)
// =====================================================
import { CONFIG } from './config.js';
import { cache } from './utils.js';

// Generic fetch with error handling
async function apiFetch(url, opts = {}, ttl = 60) {
  const key = url;
  const cached = cache.get(key);
  if (cached) return cached;
  try {
    const resp = await fetch(url, { ...opts, signal: AbortSignal.timeout(10000) });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const data = await resp.json();
    cache.set(key, data, ttl);
    return data;
  } catch (err) {
    console.warn(`API Error [${url}]:`, err.message);
    throw err;
  }
}

// ============================================
// CRYPTO — CoinGecko (100% free, no key)
// ============================================
export const cryptoAPI = {
  /** Top N coins by market cap */
  async getTopCoins(n = 50, currency = 'usd') {
    const url = `${CONFIG.API.COINGECKO}/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=${n}&page=1&sparkline=true&price_change_percentage=1h,24h,7d`;
    return apiFetch(url, {}, CONFIG.CACHE.CRYPTO);
  },

  /** Single coin detail */
  async getCoin(id) {
    const url = `${CONFIG.API.COINGECKO}/coins/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false`;
    return apiFetch(url, {}, CONFIG.CACHE.CRYPTO);
  },

  /** OHLC chart data */
  async getOHLC(id, currency = 'usd', days = 30) {
    const url = `${CONFIG.API.COINGECKO}/coins/${id}/ohlc?vs_currency=${currency}&days=${days}`;
    return apiFetch(url, {}, CONFIG.CACHE.CRYPTO);
  },

  /** Price history */
  async getHistory(id, currency = 'usd', days = 30) {
    const url = `${CONFIG.API.COINGECKO}/coins/${id}/market_chart?vs_currency=${currency}&days=${days}`;
    return apiFetch(url, {}, CONFIG.CACHE.CRYPTO);
  },

  /** Simple price for multiple coins */
  async getPrices(ids, currency = 'usd') {
    const url = `${CONFIG.API.COINGECKO}/simple/price?ids=${ids.join(',')}&vs_currencies=${currency}&include_24hr_change=true&include_market_cap=true`;
    return apiFetch(url, {}, CONFIG.CACHE.CRYPTO);
  },

  /** Global market stats */
  async getGlobal() {
    return apiFetch(`${CONFIG.API.COINGECKO}/global`, {}, CONFIG.CACHE.CRYPTO);
  },

  /** Trending coins */
  async getTrending() {
    return apiFetch(`${CONFIG.API.COINGECKO}/search/trending`, {}, CONFIG.CACHE.CRYPTO);
  },

  /** DeFi market stats */
  async getDefi() {
    return apiFetch(`${CONFIG.API.COINGECKO}/global/decentralized_finance_defi`, {}, CONFIG.CACHE.CRYPTO);
  },

  /** Coin categories */
  async getCategories() {
    return apiFetch(`${CONFIG.API.COINGECKO}/coins/categories?order=market_cap_desc`, {}, 300);
  },
};

// ============================================
// FOREX — ExchangeRate API (free)
// ============================================
export const forexAPI = {
  /** Get all rates for a base currency */
  async getRates(base = 'USD') {
    const url = `${CONFIG.API.EXCHANGERATE}/${base}`;
    return apiFetch(url, {}, CONFIG.CACHE.FOREX);
  },

  /** Convert amount */
  async convert(amount, from, to) {
    const data = await this.getRates(from);
    const rate = data.rates[to];
    return rate ? amount * rate : null;
  },
};

// ============================================
// FEAR & GREED INDEX — alternative.me (free)
// ============================================
export const fearGreedAPI = {
  async get(limit = 7) {
    return apiFetch(`${CONFIG.API.FEAR_GREED}?limit=${limit}&format=json`, {}, CONFIG.CACHE.FEAR_GREED);
  },
};

// ============================================
// STOCKS — Alpha Vantage (free tier)
// ============================================
export const stockAPI = {
  async getQuote(symbol) {
    const url = `${CONFIG.API.ALPHA_VANTAGE}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${CONFIG.API.ALPHA_KEY}`;
    return apiFetch(url, {}, CONFIG.CACHE.STOCKS);
  },

  async search(keywords) {
    const url = `${CONFIG.API.ALPHA_VANTAGE}?function=SYMBOL_SEARCH&keywords=${encodeURIComponent(keywords)}&apikey=${CONFIG.API.ALPHA_KEY}`;
    return apiFetch(url, {}, 300);
  },

  async getOverview(symbol) {
    const url = `${CONFIG.API.ALPHA_VANTAGE}?function=OVERVIEW&symbol=${symbol}&apikey=${CONFIG.API.ALPHA_KEY}`;
    return apiFetch(url, {}, 3600);
  },

  async getDailyAdjusted(symbol) {
    const url = `${CONFIG.API.ALPHA_VANTAGE}?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${symbol}&outputsize=compact&apikey=${CONFIG.API.ALPHA_KEY}`;
    return apiFetch(url, {}, CONFIG.CACHE.STOCKS);
  },

  async getTopGainersLosers() {
    const url = `${CONFIG.API.ALPHA_VANTAGE}?function=TOP_GAINERS_LOSERS&apikey=${CONFIG.API.ALPHA_KEY}`;
    return apiFetch(url, {}, CONFIG.CACHE.STOCKS);
  },

  async getMarketStatus() {
    const url = `${CONFIG.API.ALPHA_VANTAGE}?function=MARKET_STATUS&apikey=${CONFIG.API.ALPHA_KEY}`;
    return apiFetch(url, {}, 300);
  },

  async getNewsSentiment(tickers = '', topics = 'financial_markets') {
    const t = tickers ? `&tickers=${tickers}` : '';
    const url = `${CONFIG.API.ALPHA_VANTAGE}?function=NEWS_SENTIMENT${t}&topics=${topics}&apikey=${CONFIG.API.ALPHA_KEY}`;
    return apiFetch(url, {}, CONFIG.CACHE.NEWS);
  },
};

// ============================================
// WORLD BANK — Economic indicators (free)
// ============================================
export const worldBankAPI = {
  async getIndicator(countryCode, indicator, date = '2018:2024') {
    const url = `${CONFIG.API.WORLD_BANK}/country/${countryCode}/indicator/${indicator}?date=${date}&format=json&mrv=7`;
    return apiFetch(url, {}, CONFIG.CACHE.WORLD_BANK);
  },

  async getGDPGrowth(country = 'WLD') {
    return this.getIndicator(country, 'NY.GDP.MKTP.KD.ZG');
  },

  async getInflation(country = 'WLD') {
    return this.getIndicator(country, 'FP.CPI.TOTL.ZG');
  },

  async getUnemployment(country = 'WLD') {
    return this.getIndicator(country, 'SL.UEM.TOTL.ZS');
  },
};

// ============================================
// NEWS — RSS feeds + GDELT (free)
// ============================================
export const newsAPI = {
  // Financial news RSS feeds (all free)
  RSS_FEEDS: {
    'Yahoo Finance': 'https://finance.yahoo.com/rss/topfinstories',
    'Reuters Business': 'https://feeds.reuters.com/reuters/businessNews',
    'CNBC Top News': 'https://search.cnbc.com/rs/search/combinedcgi?id=100003114&format=rss',
    'Seeking Alpha': 'https://seekingalpha.com/feed.xml',
    'Crypto (CoinDesk)': 'https://www.coindesk.com/arc/outboundfeeds/rss/',
    'MarketWatch': 'https://feeds.content.dowjones.io/public/rss/mw_realtimeheadlines',
  },

  /** Fetch via rss2json proxy */
  async getFeed(feedUrl) {
    const url = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feedUrl)}&count=20`;
    return apiFetch(url, {}, CONFIG.CACHE.NEWS);
  },

  /** GDELT news search */
  async gdeltSearch(query, mode = 'artlist', maxrecords = 20) {
    const url = `${CONFIG.API.GDELT}?query=${encodeURIComponent(query)}&mode=${mode}&maxrecords=${maxrecords}&format=json`;
    return apiFetch(url, {}, CONFIG.CACHE.NEWS);
  },

  /** Alpha Vantage news sentiment */
  async getNewsSentiment(topic = 'financial_markets') {
    return stockAPI.getNewsSentiment('', topic);
  },
};

// ============================================
// ECONOMIC DATA (demo/static for free tier)
// ============================================
export const economicAPI = {
  /** Economic calendar events — static curated data */
  getCalendar() {
    const today = new Date();
    const events = [];
    // Generate upcoming events
    const eventTypes = [
      { name: 'US CPI Data', country: 'US', impact: 'high', description: 'Consumer Price Index MoM' },
      { name: 'Fed Interest Rate Decision', country: 'US', impact: 'high', description: 'Federal Reserve FOMC Meeting' },
      { name: 'US Jobs Report (NFP)', country: 'US', impact: 'high', description: 'Non-Farm Payrolls' },
      { name: 'GDP Growth Rate QoQ', country: 'US', impact: 'high', description: 'Quarterly GDP growth' },
      { name: 'ECB Rate Decision', country: 'EU', impact: 'high', description: 'European Central Bank rate' },
      { name: 'UK Inflation Rate', country: 'UK', impact: 'medium', description: 'UK CPI Year-over-Year' },
      { name: 'China Trade Balance', country: 'CN', impact: 'medium', description: 'Monthly trade surplus/deficit' },
      { name: 'RBI Policy Meeting', country: 'IN', impact: 'high', description: 'Reserve Bank of India rate decision' },
      { name: 'Japan BoJ Rate', country: 'JP', impact: 'high', description: 'Bank of Japan interest rate' },
      { name: 'US Retail Sales', country: 'US', impact: 'medium', description: 'Monthly retail sales MoM' },
      { name: 'PMI Manufacturing', country: 'US', impact: 'medium', description: 'ISM Manufacturing PMI' },
      { name: 'Initial Jobless Claims', country: 'US', impact: 'medium', description: 'Weekly unemployment claims' },
      { name: 'Consumer Confidence', country: 'US', impact: 'medium', description: 'Conference Board Consumer Confidence' },
      { name: 'Durable Goods Orders', country: 'US', impact: 'medium', description: 'Monthly durable goods orders' },
      { name: 'Housing Starts', country: 'US', impact: 'low', description: 'New residential construction starts' },
    ];
    for (let i = 0; i < 20; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() + Math.floor(i / 2));
      const evt = eventTypes[i % eventTypes.length];
      events.push({
        id: `evt-${i}`,
        date: d.toISOString().split('T')[0],
        time: `${8 + Math.floor(Math.random() * 8)}:${Math.random() > 0.5 ? '30' : '00'} ET`,
        ...evt,
        previous: (Math.random() * 5 - 1).toFixed(1) + '%',
        forecast: (Math.random() * 5 - 1).toFixed(1) + '%',
        actual: i < 5 ? (Math.random() * 5 - 1).toFixed(1) + '%' : null,
      });
    }
    return events;
  },

  /** IPO calendar — static demo data */
  getIPOs() {
    return [
      { name: 'TechVision Inc.', symbol: 'TVIZ', exchange: 'NASDAQ', date: '2025-02-14', priceRange: '$18-$22', shares: '15M', sector: 'Technology', lead: 'Goldman Sachs', status: 'upcoming' },
      { name: 'GreenEnergy Corp', symbol: 'GRNE', exchange: 'NYSE', date: '2025-02-20', priceRange: '$24-$28', shares: '20M', sector: 'Energy', lead: 'Morgan Stanley', status: 'upcoming' },
      { name: 'HealthAI Systems', symbol: 'HLAI', exchange: 'NASDAQ', date: '2025-02-28', priceRange: '$30-$35', shares: '12M', sector: 'Healthcare', lead: 'JP Morgan', status: 'upcoming' },
      { name: 'SpaceLogistics', symbol: 'SPLG', exchange: 'NYSE', date: '2025-03-05', priceRange: '$45-$52', shares: '8M', sector: 'Aerospace', lead: 'Bank of America', status: 'upcoming' },
      { name: 'FinTech Innovations', symbol: 'FINI', exchange: 'NASDAQ', date: '2025-01-30', priceRange: '$12-$15', shares: '25M', sector: 'Finance', lead: 'Citi', status: 'priced', ipoPrice: '$14', currentPrice: '$17.50', change: '+25%' },
      { name: 'CloudSafe Security', symbol: 'CSEC', exchange: 'NASDAQ', date: '2025-01-22', priceRange: '$20-$24', shares: '18M', sector: 'Cybersecurity', lead: 'UBS', status: 'priced', ipoPrice: '$22', currentPrice: '$31.20', change: '+41.8%' },
      { name: 'AutoDrive Motors', symbol: 'ADMO', exchange: 'NYSE', date: '2025-01-15', priceRange: '$35-$40', shares: '22M', sector: 'Automotive', lead: 'Deutsche Bank', status: 'priced', ipoPrice: '$38', currentPrice: '$34.10', change: '-10.3%' },
    ];
  },
};

// ============================================
// COMMODITY PRICES (Static/estimated)
// ============================================
export const commodityAPI = {
  getCommodities() {
    // Static commodity data with realistic prices (updated manually or via free sources)
    return [
      { id: 'gold', name: 'Gold', symbol: 'XAU/USD', price: 2648.50, change: 12.30, changePct: 0.47, unit: 'oz', category: 'Precious Metals', icon: '🥇' },
      { id: 'silver', name: 'Silver', symbol: 'XAG/USD', price: 29.85, change: -0.22, changePct: -0.73, unit: 'oz', category: 'Precious Metals', icon: '🥈' },
      { id: 'platinum', name: 'Platinum', symbol: 'XPT/USD', price: 998.40, change: 5.20, changePct: 0.52, unit: 'oz', category: 'Precious Metals', icon: '💍' },
      { id: 'palladium', name: 'Palladium', symbol: 'XPD/USD', price: 1105.00, change: -8.50, changePct: -0.76, unit: 'oz', category: 'Precious Metals', icon: '⚙️' },
      { id: 'oil-wti', name: 'Crude Oil (WTI)', symbol: 'CL1', price: 78.45, change: 1.23, changePct: 1.59, unit: 'bbl', category: 'Energy', icon: '🛢️' },
      { id: 'oil-brent', name: 'Brent Crude', symbol: 'BZ1', price: 82.10, change: 0.95, changePct: 1.17, unit: 'bbl', category: 'Energy', icon: '⛽' },
      { id: 'natural-gas', name: 'Natural Gas', symbol: 'NG1', price: 2.87, change: -0.04, changePct: -1.37, unit: 'MMBtu', category: 'Energy', icon: '🔥' },
      { id: 'copper', name: 'Copper', symbol: 'HG1', price: 4.12, change: 0.08, changePct: 1.98, unit: 'lb', category: 'Base Metals', icon: '🔩' },
      { id: 'wheat', name: 'Wheat', symbol: 'W1', price: 545.25, change: -3.50, changePct: -0.64, unit: 'bu', category: 'Agriculture', icon: '🌾' },
      { id: 'corn', name: 'Corn', symbol: 'C1', price: 437.00, change: 2.75, changePct: 0.63, unit: 'bu', category: 'Agriculture', icon: '🌽' },
      { id: 'soybean', name: 'Soybeans', symbol: 'S1', price: 968.50, change: -5.25, changePct: -0.54, unit: 'bu', category: 'Agriculture', icon: '🫘' },
      { id: 'coffee', name: 'Coffee', symbol: 'KC1', price: 182.35, change: 3.10, changePct: 1.73, unit: 'lb', category: 'Agriculture', icon: '☕' },
    ];
  },
};

// ============================================
// DEMO MARKET DATA (for when APIs fail)
// ============================================
export const demoData = {
  stocks: [
    { symbol: 'AAPL', name: 'Apple Inc.', price: 185.92, change: 2.34, changePct: 1.27, volume: '62.3M', mktCap: '2.87T', sector: 'Technology' },
    { symbol: 'MSFT', name: 'Microsoft Corp.', price: 412.58, change: 5.82, changePct: 1.43, volume: '22.1M', mktCap: '3.07T', sector: 'Technology' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 178.35, change: -1.22, changePct: -0.68, volume: '25.4M', mktCap: '2.19T', sector: 'Communication' },
    { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 202.15, change: 3.45, changePct: 1.74, volume: '35.7M', mktCap: '2.12T', sector: 'Consumer Disc.' },
    { symbol: 'META', name: 'Meta Platforms', price: 548.20, change: 8.90, changePct: 1.65, volume: '18.3M', mktCap: '1.39T', sector: 'Communication' },
    { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 875.40, change: 22.10, changePct: 2.59, volume: '41.2M', mktCap: '2.15T', sector: 'Technology' },
    { symbol: 'TSLA', name: 'Tesla Inc.', price: 248.50, change: -6.20, changePct: -2.43, volume: '98.5M', mktCap: '793B', sector: 'Consumer Disc.' },
    { symbol: 'JPM', name: 'JPMorgan Chase', price: 198.45, change: 1.85, changePct: 0.94, volume: '11.2M', mktCap: '573B', sector: 'Finance' },
    { symbol: 'V', name: 'Visa Inc.', price: 278.60, change: -0.45, changePct: -0.16, volume: '8.9M', mktCap: '572B', sector: 'Finance' },
    { symbol: 'WMT', name: 'Walmart Inc.', price: 186.30, change: 1.10, changePct: 0.59, volume: '14.6M', mktCap: '500B', sector: 'Consumer Stapl.' },
    { symbol: 'NFLX', name: 'Netflix Inc.', price: 698.45, change: 12.30, changePct: 1.79, volume: '6.2M', mktCap: '303B', sector: 'Communication' },
    { symbol: 'AMD', name: 'Advanced Micro', price: 168.20, change: -2.80, changePct: -1.64, volume: '44.1M', mktCap: '272B', sector: 'Technology' },
    { symbol: 'DIS', name: 'Walt Disney Co.', price: 112.40, change: 0.85, changePct: 0.76, volume: '9.8M', mktCap: '205B', sector: 'Communication' },
    { symbol: 'BABA', name: 'Alibaba Group', price: 77.20, change: -1.50, changePct: -1.91, volume: '18.4M', mktCap: '197B', sector: 'Consumer Disc.' },
    { symbol: 'PYPL', name: 'PayPal Holdings', price: 68.90, change: 1.20, changePct: 1.77, volume: '12.3M', mktCap: '74B', sector: 'Finance' },
  ],

  indices: [
    { name: 'S&P 500', symbol: 'SPX', value: 5187.70, change: 24.85, changePct: 0.48, country: 'US', flag: '🇺🇸' },
    { name: 'Dow Jones', symbol: 'DJIA', value: 38996.39, change: 125.08, changePct: 0.32, country: 'US', flag: '🇺🇸' },
    { name: 'NASDAQ', symbol: 'IXIC', value: 16384.47, change: 84.53, changePct: 0.52, country: 'US', flag: '🇺🇸' },
    { name: 'Russell 2000', symbol: 'RUT', value: 2054.83, change: -12.44, changePct: -0.60, country: 'US', flag: '🇺🇸' },
    { name: 'FTSE 100', symbol: 'UKX', value: 8012.79, change: 32.15, changePct: 0.40, country: 'UK', flag: '🇬🇧' },
    { name: 'DAX', symbol: 'DAX', value: 17892.40, change: -45.30, changePct: -0.25, country: 'DE', flag: '🇩🇪' },
    { name: 'CAC 40', symbol: 'PX1', value: 7854.60, change: 18.90, changePct: 0.24, country: 'FR', flag: '🇫🇷' },
    { name: 'Nikkei 225', symbol: 'N225', value: 38487.24, change: 284.96, changePct: 0.75, country: 'JP', flag: '🇯🇵' },
    { name: 'Hang Seng', symbol: 'HSI', value: 16985.83, change: -142.30, changePct: -0.83, country: 'HK', flag: '🇭🇰' },
    { name: 'NIFTY 50', symbol: 'NSEI', value: 22212.70, change: 168.60, changePct: 0.76, country: 'IN', flag: '🇮🇳' },
    { name: 'SENSEX', symbol: 'BSESN', value: 73095.22, change: 492.10, changePct: 0.68, country: 'IN', flag: '🇮🇳' },
    { name: 'ASX 200', symbol: 'AS51', value: 7719.22, change: 25.44, changePct: 0.33, country: 'AU', flag: '🇦🇺' },
  ],

  sectors: [
    { name: 'Technology', change: 1.82, ytd: 8.4, icon: '💻', color: '#6366f1' },
    { name: 'Healthcare', change: 0.54, ytd: 3.2, icon: '🏥', color: '#22c55e' },
    { name: 'Finance', change: 0.38, ytd: 5.1, icon: '🏦', color: '#3b82f6' },
    { name: 'Consumer Disc.', change: -0.82, ytd: 1.8, icon: '🛍️', color: '#f59e0b' },
    { name: 'Energy', change: 1.24, ytd: 6.3, icon: '⚡', color: '#ef4444' },
    { name: 'Industrials', change: 0.62, ytd: 4.7, icon: '🏭', color: '#8b5cf6' },
    { name: 'Real Estate', change: -0.45, ytd: -2.1, icon: '🏘️', color: '#14b8a6' },
    { name: 'Utilities', change: 0.18, ytd: -1.4, icon: '💡', color: '#f97316' },
    { name: 'Materials', change: 0.93, ytd: 2.9, icon: '⛏️', color: '#06b6d4' },
    { name: 'Communication', change: 1.15, ytd: 7.2, icon: '📡', color: '#ec4899' },
    { name: 'Consumer Stapl.', change: 0.22, ytd: 0.8, icon: '🛒', color: '#84cc16' },
  ],

  mutualFunds: [
    { name: 'Vanguard 500 Index Fund', symbol: 'VFIAX', nav: 487.32, oneDay: 0.48, oneYear: 18.2, threeYear: 12.4, fiveYear: 15.8, expRatio: 0.04, category: 'Large Blend', rating: 5 },
    { name: 'Fidelity Contrafund', symbol: 'FCNTX', nav: 18.92, oneDay: 0.72, oneYear: 24.1, threeYear: 10.8, fiveYear: 16.2, expRatio: 0.83, category: 'Large Growth', rating: 4 },
    { name: 'T. Rowe Price Growth Stock', symbol: 'PRGFX', nav: 92.15, oneDay: 1.12, oneYear: 28.4, threeYear: 8.9, fiveYear: 17.1, expRatio: 0.65, category: 'Large Growth', rating: 4 },
    { name: 'American Funds Growth Fund', symbol: 'AGTHX', nav: 72.40, oneDay: 0.55, oneYear: 22.7, threeYear: 11.2, fiveYear: 15.6, expRatio: 0.63, category: 'Large Growth', rating: 3 },
    { name: 'Dodge & Cox Stock Fund', symbol: 'DODGX', nav: 259.80, oneDay: 0.31, oneYear: 15.4, threeYear: 13.8, fiveYear: 13.9, expRatio: 0.52, category: 'Large Value', rating: 5 },
    { name: 'HDFC Top 100 Fund', symbol: 'HDFC100', nav: 1008.45, oneDay: 0.82, oneYear: 32.4, threeYear: 18.6, fiveYear: 22.1, expRatio: 1.72, category: 'Large Cap India', rating: 4 },
    { name: 'Mirae Asset Large Cap', symbol: 'MIALC', nav: 98.32, oneDay: 0.76, oneYear: 28.9, threeYear: 16.4, fiveYear: 20.8, expRatio: 1.56, category: 'Large Cap India', rating: 5 },
  ],
};

export default { cryptoAPI, forexAPI, fearGreedAPI, stockAPI, worldBankAPI, newsAPI, economicAPI, commodityAPI, demoData };
