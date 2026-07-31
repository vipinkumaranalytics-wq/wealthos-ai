// =====================================================
// WealthOS AI — Country Intelligence Page (Enhanced)
// =====================================================
import { forexAPI } from '../api.js';
import { formatCompact, toast } from '../utils.js';
import { store } from '../store.js';

// ---- Country Database ----
const COUNTRIES = {
  US: {
    name: 'United States', flag: '🇺🇸', currency: 'USD', currencyName: 'US Dollar',
    wb: 'US', timezone: 'EST (UTC-5)', exchange: 'NYSE / NASDAQ', color: '#3b82f6',
    capital: 'Washington D.C.', population: '335 Million', region: 'North America',
    index: 'S&P 500', indexVal: 5432.61, indexChange: +0.63,
    trade: {
      exports: { total: '$3.05T', balance: '-$773B',
        categories: [
          { name: 'Machinery & Electronics', pct: 22, value: '$671B' },
          { name: 'Mineral Fuels & Oil', pct: 14, value: '$427B' },
          { name: 'Vehicles & Aircraft', pct: 13, value: '$397B' },
          { name: 'Chemicals & Pharma', pct: 12, value: '$366B' },
          { name: 'Agriculture & Food', pct: 9, value: '$275B' },
          { name: 'Services & Tech', pct: 18, value: '$549B' },
          { name: 'Other', pct: 12, value: '$366B' },
        ],
        destinations: [
          { country: '🇨🇦 Canada', pct: 17 },
          { country: '🇲🇽 Mexico', pct: 16 },
          { country: '🇨🇳 China', pct: 7 },
          { country: '🇯🇵 Japan', pct: 5 },
          { country: '🇬🇧 UK', pct: 4 },
        ]
      },
      imports: { total: '$3.82T',
        categories: [
          { name: 'Machinery & Electronics', pct: 26, value: '$993B' },
          { name: 'Vehicles', pct: 14, value: '$535B' },
          { name: 'Mineral Fuels', pct: 10, value: '$382B' },
          { name: 'Chemicals', pct: 9, value: '$344B' },
          { name: 'Pharma & Medical', pct: 8, value: '$306B' },
          { name: 'Apparel & Textiles', pct: 6, value: '$229B' },
          { name: 'Other', pct: 27, value: '$1.03T' },
        ],
        sources: [
          { country: '🇨🇳 China', pct: 14 },
          { country: '🇲🇽 Mexico', pct: 13 },
          { country: '🇨🇦 Canada', pct: 13 },
          { country: '🇩🇪 Germany', pct: 5 },
          { country: '🇯🇵 Japan', pct: 4 },
        ]
      }
    },
    topCompanies: [
      { sym: 'AAPL', name: 'Apple Inc.', price: 189.3, chg: -0.2, sector: 'Technology', mktCap: '$2.94T', employees: '161,000', founded: 1976, desc: 'World\'s most valuable company. Makes iPhone, Mac, iPad, Apple Watch. Also runs App Store, iCloud, Apple Music & TV+. Pioneer in consumer electronics & software ecosystem.' },
      { sym: 'MSFT', name: 'Microsoft', price: 415.5, chg: +0.9, sector: 'Technology', mktCap: '$3.09T', employees: '221,000', founded: 1975, desc: 'Dominates enterprise software (Windows, Office 365). Azure cloud platform is #2 globally. Owns LinkedIn, GitHub, Xbox & 49% of OpenAI. Leader in AI with Copilot products.' },
      { sym: 'GOOGL', name: 'Alphabet (Google)', price: 172.8, chg: +1.2, sector: 'Technology', mktCap: '$2.14T', employees: '181,000', founded: 1998, desc: 'Controls 90%+ of global search. Revenue driven by Google Ads. Also runs YouTube (2B users), Google Cloud, Android OS, Waymo self-driving, and DeepMind AI research.' },
      { sym: 'AMZN', name: 'Amazon', price: 198.1, chg: +0.7, sector: 'E-Commerce', mktCap: '$2.09T', employees: '1,525,000', founded: 1994, desc: 'World\'s largest e-commerce platform. AWS cloud is #1 globally, drives most profits. Also operates Prime Video, Alexa, Whole Foods, and logistics network. Fastest-growing AI services.' },
      { sym: 'TSLA', name: 'Tesla', price: 245.8, chg: +3.1, sector: 'EV / Energy', mktCap: '$783B', employees: '127,855', founded: 2003, desc: 'World\'s largest pure-play EV maker. Also manufactures solar panels, Powerwall batteries. Developing Full Self-Driving AI, Optimus humanoid robot & Dojo supercomputer.' },
    ],
  },
  IN: {
    name: 'India', flag: '🇮🇳', currency: 'INR', currencyName: 'Indian Rupee',
    wb: 'IN', timezone: 'IST (UTC+5:30)', exchange: 'BSE / NSE', color: '#f97316',
    capital: 'New Delhi', population: '1.44 Billion', region: 'South Asia',
    index: 'SENSEX', indexVal: 79032.73, indexChange: +0.45,
    trade: {
      exports: { total: '$776B', balance: '-$250B',
        categories: [
          { name: 'IT & Software Services', pct: 28, value: '$217B' },
          { name: 'Petroleum Products', pct: 14, value: '$109B' },
          { name: 'Pharmaceuticals', pct: 8, value: '$62B' },
          { name: 'Gems & Jewellery', pct: 7, value: '$54B' },
          { name: 'Textiles & Apparel', pct: 7, value: '$54B' },
          { name: 'Engineering Goods', pct: 9, value: '$70B' },
          { name: 'Chemicals', pct: 6, value: '$47B' },
          { name: 'Agriculture & Food', pct: 7, value: '$54B' },
          { name: 'Other', pct: 14, value: '$109B' },
        ],
        destinations: [
          { country: '🇺🇸 USA', pct: 18 },
          { country: '🇦🇪 UAE', pct: 7 },
          { country: '🇳🇱 Netherlands', pct: 5 },
          { country: '🇨🇳 China', pct: 4 },
          { country: '🇬🇧 UK', pct: 3 },
        ]
      },
      imports: { total: '$1.026T',
        categories: [
          { name: 'Crude Oil & Petroleum', pct: 27, value: '$277B' },
          { name: 'Electronics & Machinery', pct: 18, value: '$185B' },
          { name: 'Gold & Precious Metals', pct: 7, value: '$72B' },
          { name: 'Chemicals', pct: 7, value: '$72B' },
          { name: 'Coal & Minerals', pct: 6, value: '$62B' },
          { name: 'Plastics & Rubber', pct: 4, value: '$41B' },
          { name: 'Edible Oils', pct: 3, value: '$31B' },
          { name: 'Other', pct: 28, value: '$286B' },
        ],
        sources: [
          { country: '🇨🇳 China', pct: 15 },
          { country: '🇷🇺 Russia', pct: 7 },
          { country: '🇦🇪 UAE', pct: 6 },
          { country: '🇺🇸 USA', pct: 5 },
          { country: '🇮🇶 Iraq', pct: 5 },
        ]
      }
    },
    topCompanies: [
      { sym: 'RELIANCE', name: 'Reliance Industries', price: 2945, chg: +1.2, sector: 'Conglomerate', mktCap: '₹19.9L Cr', employees: '236,000', founded: 1966, desc: 'India\'s largest company by revenue. Operates world\'s largest oil refinery at Jamnagar. Also runs Jio (500M telecom users), JioMart e-commerce, and Reliance Retail (India\'s largest retailer).' },
      { sym: 'TCS', name: 'Tata Consultancy Services', price: 3821, chg: +0.8, sector: 'IT Services', mktCap: '₹13.8L Cr', employees: '601,546', founded: 1968, desc: 'India\'s largest IT company and top global IT services firm. Provides software, consulting & business solutions to clients in 150+ countries. Revenue: $29B+. Part of Tata Group.' },
      { sym: 'HDFCBANK', name: 'HDFC Bank', price: 1672, chg: -0.3, sector: 'Banking', mktCap: '₹12.4L Cr', employees: '177,000', founded: 1994, desc: 'India\'s largest private bank by assets. Offers retail, wholesale & treasury banking. Known for best-in-class asset quality and consistent growth. 8,000+ branches across India.' },
      { sym: 'INFY', name: 'Infosys', price: 1589, chg: +0.5, sector: 'IT Services', mktCap: '₹6.6L Cr', employees: '343,234', founded: 1981, desc: 'India\'s 2nd largest IT company. Provides IT consulting, software development & outsourcing to global clients. Strong AI & cloud capabilities. Major presence in USA & Europe.' },
      { sym: 'ICICIBANK', name: 'ICICI Bank', price: 1198, chg: +1.1, sector: 'Banking', mktCap: '₹8.4L Cr', employees: '135,000', founded: 1994, desc: 'India\'s 2nd largest private bank. Offers full range of banking & financial services. Strong digital banking platform (iMobile Pay). Also has insurance, securities & AMC arms.' },
    ],
  },
  GB: {
    name: 'United Kingdom', flag: '🇬🇧', currency: 'GBP', currencyName: 'British Pound',
    wb: 'GB', timezone: 'GMT (UTC+0)', exchange: 'London Stock Exchange', color: '#8b5cf6',
    capital: 'London', population: '67 Million', region: 'Europe',
    index: 'FTSE 100', indexVal: 8203.93, indexChange: +0.21,
    trade: {
      exports: { total: '$470B', balance: '-$233B',
        categories: [
          { name: 'Financial Services', pct: 22, value: '$103B' },
          { name: 'Machinery & Equipment', pct: 16, value: '$75B' },
          { name: 'Pharmaceutical & Biotech', pct: 12, value: '$56B' },
          { name: 'Cars & Aerospace', pct: 11, value: '$52B' },
          { name: 'Petroleum Products', pct: 8, value: '$38B' },
          { name: 'Chemicals', pct: 7, value: '$33B' },
          { name: 'Other', pct: 24, value: '$113B' },
        ],
        destinations: [
          { country: '🇺🇸 USA', pct: 15 },
          { country: '🇩🇪 Germany', pct: 10 },
          { country: '🇮🇪 Ireland', pct: 8 },
          { country: '🇳🇱 Netherlands', pct: 7 },
          { country: '🇫🇷 France', pct: 6 },
        ]
      },
      imports: { total: '$703B',
        categories: [
          { name: 'Machinery & Electronics', pct: 24, value: '$169B' },
          { name: 'Vehicles', pct: 12, value: '$84B' },
          { name: 'Petroleum & Gas', pct: 10, value: '$70B' },
          { name: 'Chemicals & Pharma', pct: 9, value: '$63B' },
          { name: 'Food & Agriculture', pct: 8, value: '$56B' },
          { name: 'Clothing & Textiles', pct: 6, value: '$42B' },
          { name: 'Other', pct: 31, value: '$219B' },
        ],
        sources: [
          { country: '🇩🇪 Germany', pct: 12 },
          { country: '🇨🇳 China', pct: 12 },
          { country: '🇺🇸 USA', pct: 10 },
          { country: '🇳🇱 Netherlands', pct: 8 },
          { country: '🇧🇪 Belgium', pct: 5 },
        ]
      }
    },
    topCompanies: [
      { sym: 'SHEL', name: 'Shell PLC', price: 28.4, chg: -0.5, sector: 'Energy', mktCap: '$218B', employees: '93,000', founded: 1907, desc: 'One of world\'s largest energy companies. Produces & markets oil, natural gas, LNG and chemicals globally. Investing heavily in low-carbon energy including wind, solar & hydrogen.' },
      { sym: 'AZN', name: 'AstraZeneca', price: 127.6, chg: +1.4, sector: 'Pharmaceuticals', mktCap: '$249B', employees: '83,000', founded: 1999, desc: 'Global biopharmaceutical company. Known for oncology, rare diseases & cardiovascular drugs. Made COVID-19 vaccine with Oxford University. Operating in 100+ countries.' },
      { sym: 'HSBA', name: 'HSBC Holdings', price: 7.12, chg: +0.3, sector: 'Banking', mktCap: '$153B', employees: '214,000', founded: 1865, desc: 'One of world\'s largest banks. Operates in 62 countries. Strong presence in Asia-Pacific & Middle East. Key products: personal banking, commercial banking, global markets & trade finance.' },
      { sym: 'BP', name: 'BP PLC', price: 4.52, chg: -0.8, sector: 'Energy', mktCap: '$86B', employees: '87,000', founded: 1909, desc: 'Major global oil & gas company. Producing oil & gas in 30 countries. Transitioning to lower carbon with significant investments in wind, solar, EV charging & biofuels.' },
      { sym: 'ULVR', name: 'Unilever', price: 44.3, chg: +0.6, sector: 'Consumer Goods', mktCap: '$116B', employees: '128,000', founded: 1929, desc: 'FMCG giant with 400+ brands sold in 190 countries. Owns Dove, Lipton, Hellmann\'s, Ben & Jerry\'s, Knorr & more. 50% revenue from emerging markets.' },
    ],
  },
  JP: {
    name: 'Japan', flag: '🇯🇵', currency: 'JPY', currencyName: 'Japanese Yen',
    wb: 'JP', timezone: 'JST (UTC+9)', exchange: 'Tokyo Stock Exchange', color: '#ef4444',
    capital: 'Tokyo', population: '124 Million', region: 'East Asia',
    index: 'Nikkei 225', indexVal: 38647.36, indexChange: +1.02,
    trade: {
      exports: { total: '$920B', balance: '-$40B',
        categories: [
          { name: 'Motor Vehicles & Parts', pct: 25, value: '$230B' },
          { name: 'Machinery & Equipment', pct: 20, value: '$184B' },
          { name: 'Electronics & Semiconductors', pct: 18, value: '$166B' },
          { name: 'Steel & Metals', pct: 8, value: '$74B' },
          { name: 'Chemicals', pct: 7, value: '$64B' },
          { name: 'Ships & Marine', pct: 4, value: '$37B' },
          { name: 'Other', pct: 18, value: '$166B' },
        ],
        destinations: [
          { country: '🇺🇸 USA', pct: 19 },
          { country: '🇨🇳 China', pct: 19 },
          { country: '🇰🇷 South Korea', pct: 7 },
          { country: '🇹🇼 Taiwan', pct: 6 },
          { country: '🇦🇺 Australia', pct: 4 },
        ]
      },
      imports: { total: '$960B',
        categories: [
          { name: 'Mineral Fuels & LNG', pct: 30, value: '$288B' },
          { name: 'Machinery & Equipment', pct: 15, value: '$144B' },
          { name: 'Food & Agriculture', pct: 10, value: '$96B' },
          { name: 'Chemicals', pct: 8, value: '$77B' },
          { name: 'Raw Materials', pct: 7, value: '$67B' },
          { name: 'Clothing & Textiles', pct: 5, value: '$48B' },
          { name: 'Other', pct: 25, value: '$240B' },
        ],
        sources: [
          { country: '🇨🇳 China', pct: 22 },
          { country: '🇺🇸 USA', pct: 11 },
          { country: '🇦🇺 Australia', pct: 9 },
          { country: '🇦🇪 UAE', pct: 5 },
          { country: '🇸🇦 Saudi Arabia', pct: 5 },
        ]
      }
    },
    topCompanies: [
      { sym: 'TM', name: 'Toyota Motor', price: 2453, chg: +0.7, sector: 'Automotive', mktCap: '$264B', employees: '375,000', founded: 1937, desc: 'World\'s largest car manufacturer by volume. Makes Toyota, Lexus & Daihatsu brands. Pioneer of hybrid technology (Prius). Investing $70B+ in EVs. Also makes trucks, buses, forklifts & industrial robots.' },
      { sym: '6758', name: 'Sony Group', price: 12890, chg: +1.5, sector: 'Technology', mktCap: '$117B', employees: '113,000', founded: 1946, desc: 'Diversified tech conglomerate. Leads in PlayStation gaming, image sensors (used in 50%+ of all smartphones), movies/TV (Spider-Man, James Bond), music (largest music publisher) & electronics.' },
      { sym: '9984', name: 'SoftBank Group', price: 9234, chg: -1.2, sector: 'Investment/Telecom', mktCap: '$81B', employees: '53,000', founded: 1981, desc: 'Japan\'s largest telecom operator. Also world\'s biggest tech investor through Vision Fund ($100B+). Invests in AI, robots, biotech & startups. Owns ARM Holdings (chip designer).' },
      { sym: '6501', name: 'Hitachi', price: 13450, chg: +0.9, sector: 'Industrials', mktCap: '$84B', employees: '322,000', founded: 1910, desc: 'Diversified industrial conglomerate. Focuses on social infrastructure, smart manufacturing, digital, mobility & healthcare. Major player in power systems, railway, construction machinery & IT services.' },
      { sym: '8306', name: 'Mitsubishi UFJ', price: 1456, chg: +0.4, sector: 'Banking', mktCap: '$134B', employees: '160,000', founded: 2005, desc: 'Japan\'s largest bank and one of world\'s largest financial groups. Offers retail banking, corporate banking, investment banking, securities and trust banking across 50+ countries.' },
    ],
  },
  DE: {
    name: 'Germany', flag: '🇩🇪', currency: 'EUR', currencyName: 'Euro',
    wb: 'DE', timezone: 'CET (UTC+1)', exchange: 'XETRA / Frankfurt', color: '#f59e0b',
    capital: 'Berlin', population: '84 Million', region: 'Europe',
    index: 'DAX 40', indexVal: 18768.45, indexChange: +0.34,
    trade: {
      exports: { total: '$1.72T', balance: '+$252B',
        categories: [
          { name: 'Motor Vehicles & Parts', pct: 18, value: '$310B' },
          { name: 'Machinery & Engineering', pct: 16, value: '$275B' },
          { name: 'Chemicals & Pharma', pct: 14, value: '$241B' },
          { name: 'Electronics & Electrical', pct: 12, value: '$206B' },
          { name: 'Aircraft & Ships', pct: 5, value: '$86B' },
          { name: 'Food & Beverages', pct: 5, value: '$86B' },
          { name: 'Other', pct: 30, value: '$516B' },
        ],
        destinations: [
          { country: '🇺🇸 USA', pct: 10 },
          { country: '🇫🇷 France', pct: 8 },
          { country: '🇨🇳 China', pct: 8 },
          { country: '🇳🇱 Netherlands', pct: 8 },
          { country: '🇬🇧 UK', pct: 5 },
        ]
      },
      imports: { total: '$1.47T',
        categories: [
          { name: 'Machinery & Equipment', pct: 16, value: '$235B' },
          { name: 'Mineral Fuels & Gas', pct: 15, value: '$221B' },
          { name: 'Electronics', pct: 12, value: '$176B' },
          { name: 'Motor Vehicles', pct: 8, value: '$118B' },
          { name: 'Chemicals', pct: 8, value: '$118B' },
          { name: 'Metals', pct: 5, value: '$74B' },
          { name: 'Other', pct: 36, value: '$529B' },
        ],
        sources: [
          { country: '🇨🇳 China', pct: 12 },
          { country: '🇳🇱 Netherlands', pct: 9 },
          { country: '🇺🇸 USA', pct: 7 },
          { country: '🇵🇱 Poland', pct: 6 },
          { country: '🇮🇹 Italy', pct: 5 },
        ]
      }
    },
    topCompanies: [
      { sym: 'SAP', name: 'SAP SE', price: 189.5, chg: +1.1, sector: 'Enterprise Software', mktCap: '$232B', employees: '107,000', founded: 1972, desc: 'World\'s largest enterprise software company. ERP systems run 77% of world\'s transaction revenue. SAP S/4HANA cloud platform used by 430,000 customers in 180 countries for finance, HR & supply chain.' },
      { sym: 'SIE', name: 'Siemens AG', price: 175.8, chg: +0.6, sector: 'Industrials', mktCap: '$152B', employees: '320,000', founded: 1847, desc: 'Technology conglomerate focusing on automation, smart infrastructure & transportation. Makes factory automation systems, smart grid equipment, MRI machines & high-speed trains. Pioneer of Industry 4.0.' },
      { sym: 'ALV', name: 'Allianz SE', price: 276.4, chg: -0.2, sector: 'Insurance', mktCap: '$115B', employees: '157,000', founded: 1890, desc: 'World\'s largest insurance and asset management group. Offers property, life, health insurance & asset management (PIMCO). Serves 125M customers in 70+ countries.' },
      { sym: 'BMW', name: 'BMW AG', price: 89.6, chg: +0.4, sector: 'Automotive', mktCap: '$57B', employees: '149,000', founded: 1916, desc: 'Premium car maker with BMW, MINI and Rolls-Royce brands. Selling 2.5M vehicles/year. Major EV push with i-series. Known for driving dynamics and luxury positioning in 150+ countries.' },
      { sym: 'DBK', name: 'Deutsche Bank', price: 15.2, chg: -0.7, sector: 'Banking', mktCap: '$32B', employees: '90,000', founded: 1870, desc: 'Germany\'s largest bank. Provides retail banking, investment banking, corporate finance and asset management globally. Major transformation underway focusing on core German and European markets.' },
    ],
  },
  CN: {
    name: 'China', flag: '🇨🇳', currency: 'CNY', currencyName: 'Chinese Yuan',
    wb: 'CN', timezone: 'CST (UTC+8)', exchange: 'Shanghai / Shenzhen', color: '#ef4444',
    capital: 'Beijing', population: '1.41 Billion', region: 'East Asia',
    index: 'Shanghai Composite', indexVal: 2980.35, indexChange: -0.21,
    trade: {
      exports: { total: '$3.38T', balance: '+$877B',
        categories: [
          { name: 'Electronics & Machinery', pct: 32, value: '$1.08T' },
          { name: 'Textiles & Apparel', pct: 12, value: '$406B' },
          { name: 'Steel & Metals', pct: 8, value: '$270B' },
          { name: 'Chemicals & Plastics', pct: 7, value: '$237B' },
          { name: 'Electric Vehicles & Batteries', pct: 6, value: '$203B' },
          { name: 'Furniture & Toys', pct: 5, value: '$169B' },
          { name: 'Other', pct: 30, value: '$1.01T' },
        ],
        destinations: [
          { country: '🇺🇸 USA', pct: 15 },
          { country: '🇭🇰 Hong Kong', pct: 8 },
          { country: '🇯🇵 Japan', pct: 5 },
          { country: '🇰🇷 South Korea', pct: 5 },
          { country: '🇩🇪 Germany', pct: 4 },
        ]
      },
      imports: { total: '$2.50T',
        categories: [
          { name: 'Electronics & Semiconductors', pct: 22, value: '$550B' },
          { name: 'Mineral Fuels & Oil', pct: 20, value: '$500B' },
          { name: 'Machinery', pct: 12, value: '$300B' },
          { name: 'Iron Ore & Metals', pct: 8, value: '$200B' },
          { name: 'Agriculture & Food', pct: 7, value: '$175B' },
          { name: 'Chemicals', pct: 7, value: '$175B' },
          { name: 'Other', pct: 24, value: '$600B' },
        ],
        sources: [
          { country: '🇰🇷 South Korea', pct: 8 },
          { country: '🇯🇵 Japan', pct: 8 },
          { country: '🇺🇸 USA', pct: 7 },
          { country: '🇦🇺 Australia', pct: 7 },
          { country: '🇩🇪 Germany', pct: 5 },
        ]
      }
    },
    topCompanies: [
      { sym: '601398', name: 'ICBC', price: 5.82, chg: +0.3, sector: 'Banking', mktCap: '$257B', employees: '440,000', founded: 1984, desc: 'World\'s largest bank by assets ($6T+). Provides corporate banking, personal banking, treasury operations and international banking. Serves 900M+ personal accounts and millions of corporate clients globally.' },
      { sym: '600519', name: 'Kweichow Moutai', price: 1498, chg: +1.2, sector: 'Beverages', mktCap: '$192B', employees: '40,000', founded: 1951, desc: 'China\'s most valuable liquor brand. Makes Baijiu (Chinese white spirit), priced at ¥1,499-50,000/bottle. Status symbol in China. Revenue from premium spirits at Chinese business banquets and gifts.' },
      { sym: '0700', name: 'Tencent Holdings', price: 380, chg: +1.8, sector: 'Technology', mktCap: '$369B', employees: '105,000', founded: 1998, desc: 'China\'s internet giant. Owns WeChat (1.3B users), QQ, mobile games (PUBG Mobile), cloud, fintech (WeChat Pay), music, video & investments in 700+ companies including Spotify, Snapchat & Sea.' },
      { sym: '9988', name: 'Alibaba Group', price: 82, chg: -1.1, sector: 'E-Commerce', mktCap: '$202B', employees: '240,000', founded: 1999, desc: 'China\'s largest e-commerce company. Runs Taobao, Tmall & AliExpress (1B buyers). Also operates Alibaba Cloud (#3 globally), Alipay, Cainiao logistics and entertainment. Jack Ma founded.' },
      { sym: '601988', name: 'Bank of China', price: 4.57, chg: +0.2, sector: 'Banking', mktCap: '$154B', employees: '310,000', founded: 1912, desc: 'One of China\'s "Big Four" banks. Most international Chinese bank with presence in 61 countries. Handles 50%+ of China\'s foreign currency settlements. Also offers insurance & investment banking.' },
    ],
  },
  AU: {
    name: 'Australia', flag: '🇦🇺', currency: 'AUD', currencyName: 'Australian Dollar',
    wb: 'AU', timezone: 'AEST (UTC+10)', exchange: 'Australian Securities Exchange', color: '#22c55e',
    capital: 'Canberra', population: '26 Million', region: 'Oceania',
    index: 'ASX 200', indexVal: 7896.3, indexChange: +0.52,
    trade: {
      exports: { total: '$414B', balance: '+$110B',
        categories: [
          { name: 'Iron Ore', pct: 29, value: '$120B' },
          { name: 'Coal', pct: 16, value: '$66B' },
          { name: 'Natural Gas (LNG)', pct: 15, value: '$62B' },
          { name: 'Gold', pct: 7, value: '$29B' },
          { name: 'Education & Tourism', pct: 6, value: '$25B' },
          { name: 'Agriculture & Beef', pct: 6, value: '$25B' },
          { name: 'Other', pct: 21, value: '$87B' },
        ],
        destinations: [
          { country: '🇨🇳 China', pct: 33 },
          { country: '🇯🇵 Japan', pct: 17 },
          { country: '🇰🇷 South Korea', pct: 7 },
          { country: '🇮🇳 India', pct: 6 },
          { country: '🇺🇸 USA', pct: 5 },
        ]
      },
      imports: { total: '$304B',
        categories: [
          { name: 'Machinery & Equipment', pct: 18, value: '$55B' },
          { name: 'Petroleum Products', pct: 14, value: '$43B' },
          { name: 'Motor Vehicles', pct: 10, value: '$30B' },
          { name: 'Electronics', pct: 9, value: '$27B' },
          { name: 'Pharmaceuticals', pct: 5, value: '$15B' },
          { name: 'Clothing & Textiles', pct: 4, value: '$12B' },
          { name: 'Other', pct: 40, value: '$122B' },
        ],
        sources: [
          { country: '🇨🇳 China', pct: 27 },
          { country: '🇺🇸 USA', pct: 10 },
          { country: '🇸🇬 Singapore', pct: 6 },
          { country: '🇩🇪 Germany', pct: 4 },
          { country: '🇯🇵 Japan', pct: 4 },
        ]
      }
    },
    topCompanies: [
      { sym: 'BHP', name: 'BHP Group', price: 43.2, chg: +0.8, sector: 'Mining', mktCap: '$210B', employees: '80,000', founded: 1885, desc: 'World\'s largest mining company. Mines iron ore, copper, coal and potash. Iron ore from Pilbara (WA) is its biggest earner, mainly exported to China. Also has significant copper operations in Chile.' },
      { sym: 'CBA', name: 'Commonwealth Bank', price: 127.5, chg: +0.4, sector: 'Banking', mktCap: '$211B', employees: '48,000', founded: 1911, desc: 'Australia\'s largest bank and most valuable ASX company. Offers retail, business & institutional banking. Known for digital innovation with CommBank app. Also has NZ (ASB), UK & Indonesian operations.' },
      { sym: 'RIO', name: 'Rio Tinto', price: 118.6, chg: -0.3, sector: 'Mining', mktCap: '$104B', employees: '57,000', founded: 1873, desc: 'Global mining giant. Mines iron ore (world\'s 2nd largest producer), aluminium, copper, diamonds & lithium. Pilbara iron ore sent mostly to China. Also develops lithium projects for battery supply chain.' },
      { sym: 'ANZ', name: 'ANZ Banking Group', price: 29.8, chg: +0.6, sector: 'Banking', mktCap: '$83B', employees: '40,000', founded: 1835, desc: 'One of Australia\'s "Big 4" banks. Strong presence in Asia-Pacific (29 markets). Offers retail, commercial & institutional banking. Major focus on trade finance across Asia for commodity exporters.' },
      { sym: 'WES', name: 'Wesfarmers', price: 72.4, chg: +1.1, sector: 'Retail / Industrials', mktCap: '$82B', employees: '120,000', founded: 1914, desc: 'Diversified conglomerate. Owns Bunnings Warehouse (hardware), Kmart, Target, Officeworks, Priceline & Catch.com.au. Also has chemicals & fertilisers division. Australia\'s largest private employer.' },
    ],
  },
  CA: {
    name: 'Canada', flag: '🇨🇦', currency: 'CAD', currencyName: 'Canadian Dollar',
    wb: 'CA', timezone: 'EST (UTC-5)', exchange: 'Toronto Stock Exchange', color: '#ef4444',
    capital: 'Ottawa', population: '40 Million', region: 'North America',
    index: 'TSX Composite', indexVal: 22341.8, indexChange: +0.28,
    trade: {
      exports: { total: '$580B', balance: '+$20B',
        categories: [
          { name: 'Mineral Fuels & Oil', pct: 30, value: '$174B' },
          { name: 'Motor Vehicles & Parts', pct: 14, value: '$81B' },
          { name: 'Gold & Precious Metals', pct: 6, value: '$35B' },
          { name: 'Machinery & Equipment', pct: 6, value: '$35B' },
          { name: 'Wood & Paper Products', pct: 5, value: '$29B' },
          { name: 'Agriculture & Canola', pct: 5, value: '$29B' },
          { name: 'Other', pct: 34, value: '$197B' },
        ],
        destinations: [
          { country: '🇺🇸 USA', pct: 73 },
          { country: '🇨🇳 China', pct: 5 },
          { country: '🇬🇧 UK', pct: 3 },
          { country: '🇯🇵 Japan', pct: 2 },
          { country: '🇲🇽 Mexico', pct: 1 },
        ]
      },
      imports: { total: '$560B',
        categories: [
          { name: 'Motor Vehicles', pct: 15, value: '$84B' },
          { name: 'Machinery & Equipment', pct: 14, value: '$78B' },
          { name: 'Electronics', pct: 10, value: '$56B' },
          { name: 'Petroleum Products', pct: 8, value: '$45B' },
          { name: 'Pharmaceuticals', pct: 5, value: '$28B' },
          { name: 'Food & Agriculture', pct: 5, value: '$28B' },
          { name: 'Other', pct: 43, value: '$241B' },
        ],
        sources: [
          { country: '🇺🇸 USA', pct: 49 },
          { country: '🇨🇳 China', pct: 12 },
          { country: '🇲🇽 Mexico', pct: 6 },
          { country: '🇩🇪 Germany', pct: 3 },
          { country: '🇯🇵 Japan', pct: 2 },
        ]
      }
    },
    topCompanies: [
      { sym: 'RY', name: 'Royal Bank of Canada', price: 134.5, chg: +0.5, sector: 'Banking', mktCap: '$187B', employees: '98,000', founded: 1864, desc: 'Canada\'s largest bank and top 10 globally. Offers personal & commercial banking, wealth management, insurance, investor services & capital markets in 36 countries.' },
      { sym: 'TD', name: 'Toronto-Dominion Bank', price: 78.2, chg: -0.2, sector: 'Banking', mktCap: '$141B', employees: '95,000', founded: 1855, desc: '2nd largest Canadian bank. Strong retail banking in Canada & USA (TD Bank, America\'s Most Convenient Bank). Over 10M US customers through 1,200+ US branches. Also major in wealth management.' },
      { sym: 'CNQ', name: 'Canadian Natural Resources', price: 44.6, chg: +1.3, sector: 'Energy', mktCap: '$93B', employees: '12,000', founded: 1989, desc: 'Canada\'s largest oil & gas producer. Extracts crude oil, natural gas and oil sands (Alberta). Long-life, low-decline assets. Growing dividend consistently for 24+ years. Major oil sands operator.' },
      { sym: 'BNS', name: 'Bank of Nova Scotia', price: 62.3, chg: +0.4, sector: 'Banking', mktCap: '$74B', employees: '90,000', founded: 1832, desc: 'Canada\'s "International Bank." Strong presence across Pacific Alliance countries (Mexico, Peru, Chile, Colombia). Offers banking, insurance & capital markets in 30+ countries across Americas.' },
      { sym: 'SU', name: 'Suncor Energy', price: 52.1, chg: -0.6, sector: 'Energy', mktCap: '$57B', employees: '14,000', founded: 1917, desc: 'Integrated energy company. Operates world\'s largest oil sands mining operation (Fort McMurray, Alberta). Also has conventional oil, offshore production, refineries & Petro-Canada retail stations.' },
    ],
  },
  KR: {
    name: 'South Korea', flag: '🇰🇷', currency: 'KRW', currencyName: 'Korean Won',
    wb: 'KR', timezone: 'KST (UTC+9)', exchange: 'Korea Exchange', color: '#3b82f6',
    capital: 'Seoul', population: '52 Million', region: 'East Asia',
    index: 'KOSPI', indexVal: 2746.63, indexChange: +0.89,
    trade: {
      exports: { total: '$632B', balance: '+$22B',
        categories: [
          { name: 'Semiconductors & Chips', pct: 20, value: '$126B' },
          { name: 'Motor Vehicles', pct: 12, value: '$76B' },
          { name: 'Petrochemicals', pct: 9, value: '$57B' },
          { name: 'Ships & Marine', pct: 8, value: '$51B' },
          { name: 'Electronics & Displays', pct: 8, value: '$51B' },
          { name: 'Steel & Iron', pct: 5, value: '$32B' },
          { name: 'Other', pct: 38, value: '$239B' },
        ],
        destinations: [
          { country: '🇨🇳 China', pct: 20 },
          { country: '🇺🇸 USA', pct: 16 },
          { country: '🇻🇳 Vietnam', pct: 9 },
          { country: '🇯🇵 Japan', pct: 5 },
          { country: '🇭🇰 Hong Kong', pct: 4 },
        ]
      },
      imports: { total: '$610B',
        categories: [
          { name: 'Petroleum & Gas', pct: 22, value: '$134B' },
          { name: 'Semiconductors', pct: 12, value: '$73B' },
          { name: 'Electronics', pct: 9, value: '$55B' },
          { name: 'Machinery', pct: 8, value: '$49B' },
          { name: 'Coal & Minerals', pct: 6, value: '$37B' },
          { name: 'Chemicals', pct: 6, value: '$37B' },
          { name: 'Other', pct: 37, value: '$225B' },
        ],
        sources: [
          { country: '🇨🇳 China', pct: 22 },
          { country: '🇺🇸 USA', pct: 12 },
          { country: '🇸🇦 Saudi Arabia', pct: 6 },
          { country: '🇦🇺 Australia', pct: 6 },
          { country: '🇯🇵 Japan', pct: 6 },
        ]
      }
    },
    topCompanies: [
      { sym: '005930', name: 'Samsung Electronics', price: 75400, chg: +1.2, sector: 'Technology', mktCap: '$373B', employees: '267,937', founded: 1969, desc: 'World\'s largest smartphone maker and #1 memory chip (DRAM & NAND Flash) manufacturer. Makes Galaxy phones, TVs, home appliances, semiconductors & display panels. Revenue: $200B+/year.' },
      { sym: '000660', name: 'SK Hynix', price: 194500, chg: +2.1, sector: 'Semiconductors', mktCap: '$141B', employees: '30,000', founded: 1983, desc: 'World\'s 2nd largest memory chip maker. Produces DRAM and NAND Flash used in PCs, servers, mobile devices. Major beneficiary of AI boom as HBM (High Bandwidth Memory) for AI chips is in high demand.' },
      { sym: '005380', name: 'Hyundai Motor', price: 248000, chg: +0.5, sector: 'Automotive', mktCap: '$52B', employees: '120,000', founded: 1967, desc: 'Korea\'s largest car company. Makes Hyundai & Kia brands. 3rd largest auto group globally (7.4M vehicles/yr). Rapidly growing EV lineup (IONIQ series). Also invests in robots & urban air mobility.' },
      { sym: '035420', name: 'NAVER Corp', price: 187000, chg: +1.5, sector: 'Internet / AI', mktCap: '$30B', employees: '14,000', founded: 1999, desc: 'South Korea\'s #1 search engine (75% market share) and internet company. Owns LINE messaging app (170M users in Japan). AI leadership with HyperCLOVA. Also runs webtoon, e-commerce & fintech.' },
      { sym: '051910', name: 'LG Chem', price: 423000, chg: -0.8, sector: 'Chemicals / EV Batteries', mktCap: '$29B', employees: '24,000', founded: 1947, desc: 'Korea\'s largest chemical company. World\'s top EV battery maker through subsidiary LG Energy Solution. Supplies batteries to GM, Ford, Tesla & Volkswagen. Also makes petrochemicals & advanced materials.' },
    ],
  },
  AE: {
    name: 'UAE', flag: '🇦🇪', currency: 'AED', currencyName: 'UAE Dirham',
    wb: 'AE', timezone: 'GST (UTC+4)', exchange: 'DFM / ADX', color: '#22c55e',
    capital: 'Abu Dhabi', population: '10 Million', region: 'Middle East',
    index: 'DFM Index', indexVal: 4312.8, indexChange: +0.15,
    trade: {
      exports: { total: '$425B', balance: '+$158B',
        categories: [
          { name: 'Crude Oil & Gas', pct: 35, value: '$149B' },
          { name: 'Refined Petroleum', pct: 14, value: '$60B' },
          { name: 'Gold & Jewellery', pct: 12, value: '$51B' },
          { name: 'Aluminium', pct: 4, value: '$17B' },
          { name: 'Chemicals & Plastics', pct: 4, value: '$17B' },
          { name: 'Re-exports & Services', pct: 22, value: '$94B' },
          { name: 'Other', pct: 9, value: '$37B' },
        ],
        destinations: [
          { country: '🇮🇳 India', pct: 12 },
          { country: '🇨🇳 China', pct: 11 },
          { country: '🇯🇵 Japan', pct: 9 },
          { country: '🇸🇦 Saudi Arabia', pct: 6 },
          { country: '🇺🇸 USA', pct: 5 },
        ]
      },
      imports: { total: '$267B',
        categories: [
          { name: 'Gold & Precious Metals', pct: 16, value: '$43B' },
          { name: 'Machinery & Equipment', pct: 14, value: '$37B' },
          { name: 'Electronics', pct: 11, value: '$29B' },
          { name: 'Motor Vehicles', pct: 7, value: '$19B' },
          { name: 'Diamonds & Gems', pct: 7, value: '$19B' },
          { name: 'Chemicals', pct: 5, value: '$13B' },
          { name: 'Other', pct: 40, value: '$107B' },
        ],
        sources: [
          { country: '🇨🇳 China', pct: 24 },
          { country: '🇮🇳 India', pct: 10 },
          { country: '🇺🇸 USA', pct: 8 },
          { country: '🇸🇦 Saudi Arabia', pct: 4 },
          { country: '🇩🇪 Germany', pct: 3 },
        ]
      }
    },
    topCompanies: [
      { sym: 'FAB', name: 'First Abu Dhabi Bank', price: 14.3, chg: +0.4, sector: 'Banking', mktCap: '$50B', employees: '10,000', founded: 2017, desc: 'UAE\'s largest bank and MENA\'s most profitable. Formed by merger of FGB & NBAD. Offers corporate, investment, private and retail banking. Strong international presence in 19 countries. Key financier of UAE\'s Vision 2031.' },
      { sym: 'ADNOC', name: 'ADNOC Distribution', price: 4.28, chg: +0.7, sector: 'Energy / Retail', mktCap: '$17B', employees: '5,000', founded: 1973, desc: 'UAE\'s largest fuel distributor. Operates 700+ ADNOC service stations across UAE, Saudi Arabia & Egypt. Sells fuel, lubricants & convenience items. Expanding internationally & into EV charging.' },
      { sym: 'EMAAR', name: 'Emaar Properties', price: 9.12, chg: -0.3, sector: 'Real Estate', mktCap: '$16B', employees: '10,000', founded: 1997, desc: 'Developer of Burj Khalifa and Dubai Mall — world\'s tallest building and largest mall. One of Middle East\'s biggest real estate companies. Also develops master-planned communities and hospitality assets globally.' },
      { sym: 'DIB', name: 'Dubai Islamic Bank', price: 6.87, chg: +0.5, sector: 'Islamic Banking', mktCap: '$11B', employees: '10,000', founded: 1975, desc: 'World\'s first full-service Islamic bank. Offers Sharia-compliant banking, home finance, car finance, SME solutions. World\'s largest Islamic bank by assets. Expanding in Asia, Africa & GCC.' },
      { sym: 'DU', name: 'du (Emirates Integrated)', price: 7.34, chg: +0.2, sector: 'Telecom', mktCap: '$7B', employees: '2,800', founded: 2006, desc: 'UAE\'s 2nd telecom operator. Provides mobile, home broadband, TV & enterprise solutions. Known for competitive pricing vs Etisalat. Also building 5G infrastructure and cloud services for UAE government.' },
    ],
  },
  SA: {
    name: 'Saudi Arabia', flag: '🇸🇦', currency: 'SAR', currencyName: 'Saudi Riyal',
    wb: 'SA', timezone: 'AST (UTC+3)', exchange: 'Saudi Tadawul', color: '#22c55e',
    capital: 'Riyadh', population: '36 Million', region: 'Middle East',
    index: 'Tadawul All Share', indexVal: 11892.4, indexChange: +0.22,
    trade: {
      exports: { total: '$410B', balance: '+$182B',
        categories: [
          { name: 'Crude Oil', pct: 62, value: '$254B' },
          { name: 'Petroleum Products', pct: 13, value: '$53B' },
          { name: 'Petrochemicals (SABIC)', pct: 9, value: '$37B' },
          { name: 'Plastics & Polymers', pct: 4, value: '$16B' },
          { name: 'Non-oil exports', pct: 8, value: '$33B' },
          { name: 'Other', pct: 4, value: '$17B' },
        ],
        destinations: [
          { country: '🇨🇳 China', pct: 20 },
          { country: '🇮🇳 India', pct: 12 },
          { country: '🇯🇵 Japan', pct: 12 },
          { country: '🇰🇷 South Korea', pct: 9 },
          { country: '🇺🇸 USA', pct: 4 },
        ]
      },
      imports: { total: '$228B',
        categories: [
          { name: 'Machinery & Equipment', pct: 22, value: '$50B' },
          { name: 'Motor Vehicles', pct: 14, value: '$32B' },
          { name: 'Electronics', pct: 10, value: '$23B' },
          { name: 'Food & Agriculture', pct: 10, value: '$23B' },
          { name: 'Metals & Steel', pct: 7, value: '$16B' },
          { name: 'Chemicals', pct: 5, value: '$11B' },
          { name: 'Other', pct: 32, value: '$73B' },
        ],
        sources: [
          { country: '🇨🇳 China', pct: 25 },
          { country: '🇺🇸 USA', pct: 12 },
          { country: '🇩🇪 Germany', pct: 6 },
          { country: '🇮🇳 India', pct: 6 },
          { country: '🇯🇵 Japan', pct: 4 },
        ]
      }
    },
    topCompanies: [
      { sym: '2222', name: 'Saudi Aramco', price: 29.45, chg: +0.3, sector: 'Energy', mktCap: '$1.78T', employees: '70,000', founded: 1933, desc: 'World\'s largest oil company and most profitable company. Produces ~12% of global oil supply (10M bbl/day). Holds world\'s 2nd largest proven oil reserves. Also runs world\'s largest oil refinery. Government owns 98%.' },
      { sym: '1180', name: 'Al Rajhi Bank', price: 84.5, chg: +0.6, sector: 'Islamic Banking', mktCap: '$89B', employees: '14,000', founded: 1957, desc: 'World\'s largest Islamic bank by capital & profitability. Offers Sharia-compliant banking only. 600+ branches in Saudi, Jordan, Kuwait & Malaysia. Known for innovative digital banking products in Saudi.' },
      { sym: '2010', name: 'SABIC', price: 78.3, chg: -0.2, sector: 'Petrochemicals', mktCap: '$62B', employees: '32,000', founded: 1976, desc: 'World\'s 4th largest petrochemical company. Makes chemicals, polymers, fertilizers & metals used in plastics, agriculture & construction globally. 70% owned by Saudi Aramco since 2020.' },
      { sym: '7010', name: 'Saudi Telecom (STC)', price: 53.4, chg: +0.4, sector: 'Telecom', mktCap: '$54B', employees: '20,000', founded: 1998, desc: 'Saudi Arabia\'s largest telecom company. Provides mobile, internet, cloud & TV services. 170M customers across 11 countries including Bahrain, Kuwait & turkey (55% owned by Saudi government).' },
      { sym: '1150', name: 'Alinma Bank', price: 32.7, chg: +0.9, sector: 'Islamic Banking', mktCap: '$19B', employees: '5,000', founded: 2006, desc: 'Fast-growing Saudi Islamic bank. Fully Sharia-compliant services. Strong digital banking platform. Financing Vision 2030 projects including NEOM, Red Sea Project & Diriyah Gate. Rapid retail expansion.' },
    ],
  },
  IN_SG: null, // placeholder
  SG: {
    name: 'Singapore', flag: '🇸🇬', currency: 'SGD', currencyName: 'Singapore Dollar',
    wb: 'SG', timezone: 'SGT (UTC+8)', exchange: 'Singapore Exchange', color: '#ef4444',
    capital: 'Singapore', population: '6 Million', region: 'Southeast Asia',
    index: 'STI', indexVal: 3421.5, indexChange: +0.32,
    trade: {
      exports: { total: '$540B', balance: '+$35B',
        categories: [
          { name: 'Electronics & Semiconductors', pct: 30, value: '$162B' },
          { name: 'Petroleum Products', pct: 18, value: '$97B' },
          { name: 'Chemicals', pct: 12, value: '$65B' },
          { name: 'Machinery & Equipment', pct: 9, value: '$49B' },
          { name: 'Financial Services', pct: 8, value: '$43B' },
          { name: 'Biomedical Products', pct: 7, value: '$38B' },
          { name: 'Other', pct: 16, value: '$86B' },
        ],
        destinations: [
          { country: '🇨🇳 China', pct: 15 },
          { country: '🇲🇾 Malaysia', pct: 11 },
          { country: '🇺🇸 USA', pct: 9 },
          { country: '🇭🇰 Hong Kong', pct: 9 },
          { country: '🇮🇩 Indonesia', pct: 8 },
        ]
      },
      imports: { total: '$505B',
        categories: [
          { name: 'Electronics', pct: 28, value: '$141B' },
          { name: 'Crude Oil & Gas', pct: 18, value: '$91B' },
          { name: 'Machinery', pct: 9, value: '$45B' },
          { name: 'Chemicals', pct: 8, value: '$40B' },
          { name: 'Gold & Precious Metals', pct: 5, value: '$25B' },
          { name: 'Food & Beverages', pct: 4, value: '$20B' },
          { name: 'Other', pct: 28, value: '$143B' },
        ],
        sources: [
          { country: '🇨🇳 China', pct: 16 },
          { country: '🇲🇾 Malaysia', pct: 12 },
          { country: '🇺🇸 USA', pct: 11 },
          { country: '🇹🇼 Taiwan', pct: 6 },
          { country: '🇯🇵 Japan', pct: 5 },
        ]
      }
    },
    topCompanies: [
      { sym: 'DBS', name: 'DBS Group', price: 36.4, chg: +0.6, sector: 'Banking', mktCap: '$94B', employees: '36,000', founded: 1968, desc: 'Southeast Asia\'s largest bank. #1 in Singapore, strong in Hong Kong, China & India. Consistently ranked World\'s Best Digital Bank. Offers consumer, SME, corporate & wealth management banking.' },
      { sym: 'OCBC', name: 'OCBC Bank', price: 14.2, chg: +0.3, sector: 'Banking', mktCap: '$54B', employees: '30,000', founded: 1932, desc: 'Singapore\'s 2nd largest bank. Parent of Bank of Singapore (wealth management) and Great Eastern (insurance). Strong presence in Malaysia, Indonesia & China. Known for conservative credit culture.' },
      { sym: 'UOB', name: 'United Overseas Bank', price: 31.8, chg: -0.2, sector: 'Banking', mktCap: '$41B', employees: '26,000', founded: 1935, desc: 'Singapore\'s 3rd bank. Strong retail and SME banking. Major regional bank in ASEAN. Acquired Citigroup\'s consumer business in 4 SE Asian countries (Thailand, Malaysia, Indonesia, Vietnam) in 2023.' },
      { sym: 'SGX', name: 'Singapore Exchange', price: 9.67, chg: +0.4, sector: 'Financial Markets', mktCap: '$8B', employees: '1,000', founded: 1999, desc: 'Asia\'s leading multi-asset exchange. Operates securities, derivatives & currency markets. Lists 700+ companies including many large Chinese & regional firms. Asia\'s largest market for offshore FX futures.' },
      { sym: 'KEP', name: 'Keppel Corporation', price: 7.23, chg: +0.8, sector: 'Industrials / Real Estate', mktCap: '$11B', employees: '26,000', founded: 1968, desc: 'Singapore conglomerate. Builds offshore oil rigs, data centres & real estate. Transitioning to asset management and renewable energy. Recently acquired Singapore Press Holdings media assets.' },
    ],
  },
};

// Remove null placeholder
delete COUNTRIES.IN_SG;

const WB_INDICATORS = {
  gdp: 'NY.GDP.MKTP.CD',
  gdpGrowth: 'NY.GDP.MKTP.KD.ZG',
  inflation: 'FP.CPI.TOTL.ZG',
  unemployment: 'SL.UEM.TOTL.ZS',
};

let currentCountry = 'US';
let exchangeRates = {};

export function renderCountry(container) {
  // Pick up country from: global selector event, localStorage, store, or default
  const lsCountry = localStorage.getItem('wos_country');
  currentCountry = lsCountry || store.get('selectedCountry') || 'US';

  // Listen for global country selector changes
  const onCountrySelected = (e) => {
    currentCountry = e.detail.code;
    store.update('selectedCountry', () => currentCountry);
    // Highlight grid button
    container.querySelectorAll('.ctry-btn').forEach(b => {
      const cc = COUNTRIES[b.dataset.code];
      if (!cc) return;
      b.style.border = `1.5px solid ${b.dataset.code === currentCountry ? cc.color : 'var(--border-color)'}`;
      b.style.background = b.dataset.code === currentCountry ? cc.color + '20' : 'var(--bg-card)';
    });
    loadCountryData();
  };
  window.addEventListener('countrySelected', onCountrySelected);
  // Cleanup when page changes
  container._countryCleanup = () => window.removeEventListener('countrySelected', onCountrySelected);

  container.innerHTML = `
    <div class="page-header">
      <div>
        <h1 class="page-title">🌍 Country Intelligence</h1>
        <p class="page-subtitle">Select any country — see markets, companies, trade & economy</p>
      </div>
    </div>

    <!-- Country Grid Selector -->
    <div class="card mb-4">
      <div class="card-body" style="padding:20px">
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(145px,1fr));gap:8px">
          ${Object.entries(COUNTRIES).map(([code, c]) => `
            <button class="ctry-btn ${code === currentCountry ? 'ctry-active' : ''}" data-code="${code}"
              style="display:flex;align-items:center;gap:8px;padding:10px 12px;border-radius:10px;
                border:1.5px solid ${code === currentCountry ? c.color : 'var(--border-color)'};
                background:${code === currentCountry ? c.color + '20' : 'var(--bg-card)'};
                cursor:pointer;color:var(--text-primary);font-size:0.82rem;font-weight:500;transition:all 0.2s;width:100%;text-align:left">
              <span style="font-size:1.5rem">${c.flag}</span>
              <div>
                <div style="font-weight:600">${c.name}</div>
                <div style="font-size:0.72rem;color:var(--text-muted)">${c.currency} • ${c.index}</div>
              </div>
            </button>
          `).join('')}
        </div>
      </div>
    </div>

    <div id="country-data">
      <div class="loading-center" style="padding:60px"><div class="spinner"></div></div>
    </div>
  `;

  container.querySelectorAll('.ctry-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      currentCountry = btn.dataset.code;
      store.update('selectedCountry', () => currentCountry);
      container.querySelectorAll('.ctry-btn').forEach(b => {
        const cc = COUNTRIES[b.dataset.code];
        b.style.border = `1.5px solid ${b.dataset.code === currentCountry ? cc.color : 'var(--border-color)'}`;
        b.style.background = b.dataset.code === currentCountry ? cc.color + '20' : 'var(--bg-card)';
      });
      loadCountryData();
    });
  });

  loadRates().then(() => loadCountryData());
}

async function loadRates() {
  try {
    const data = await forexAPI.getRates('USD');
    exchangeRates = data.rates || {};
  } catch {
    exchangeRates = { INR: 83.25, GBP: 0.787, JPY: 149.8, EUR: 0.923, CNY: 7.24, AUD: 1.532, CAD: 1.364, BRL: 4.97, SGD: 1.342, KRW: 1328, AED: 3.673, SAR: 3.75, ZAR: 18.62, MXN: 17.8 };
  }
}

async function loadCountryData() {
  const c = COUNTRIES[currentCountry];
  if (!c) return;
  const el = document.getElementById('country-data');
  el.innerHTML = `<div class="loading-center" style="padding:60px"><div class="spinner"></div></div>`;

  const [gdpR, infR, unempR, growthR] = await Promise.allSettled([
    fetchWB(c.wb, WB_INDICATORS.gdp),
    fetchWB(c.wb, WB_INDICATORS.inflation),
    fetchWB(c.wb, WB_INDICATORS.unemployment),
    fetchWB(c.wb, WB_INDICATORS.gdpGrowth),
  ]);

  const gdp = gdpR.value, inflation = infR.value, unemployment = unempR.value, gdpGrowth = growthR.value;
  const rate = exchangeRates[c.currency] || 1;

  el.innerHTML = `
    <!-- Header Banner -->
    <div class="card mb-4" style="border-left:4px solid ${c.color};background:linear-gradient(135deg,${c.color}15,var(--bg-card))">
      <div class="card-body" style="padding:24px">
        <div style="display:flex;align-items:center;gap:20px;flex-wrap:wrap">
          <div style="font-size:5rem;line-height:1">${c.flag}</div>
          <div style="flex:1">
            <h2 style="font-size:2rem;font-weight:900;margin:0 0 6px">${c.name}</h2>
            <div style="display:flex;flex-wrap:wrap;gap:14px;color:var(--text-muted);font-size:0.85rem">
              <span><i class="fa fa-map-pin"></i> ${c.capital}</span>
              <span><i class="fa fa-users"></i> ${c.population}</span>
              <span><i class="fa fa-globe"></i> ${c.region}</span>
              <span><i class="fa fa-clock"></i> ${c.timezone}</span>
              <span><i class="fa fa-building-columns"></i> ${c.exchange}</span>
            </div>
          </div>
          <div style="text-align:right;min-width:160px">
            <div style="font-size:0.75rem;color:var(--text-muted);margin-bottom:2px">${c.index}</div>
            <div style="font-size:2.2rem;font-weight:900">${c.indexVal.toLocaleString()}</div>
            <div style="font-size:1rem;font-weight:700;color:${c.indexChange >= 0 ? '#22c55e' : '#ef4444'}">
              <i class="fa fa-arrow-${c.indexChange >= 0 ? 'up' : 'down'}"></i>
              ${c.indexChange >= 0 ? '+' : ''}${c.indexChange}% today
            </div>
            ${rate !== 1 ? `<div style="font-size:0.78rem;color:var(--text-muted);margin-top:4px">1 USD = ${rate.toFixed(2)} ${c.currency}</div>` : ''}
          </div>
        </div>
      </div>
    </div>

    <!-- Economic KPIs -->
    <div class="grid grid-4 mb-4">
      <div class="stat-card">
        <div class="stat-icon blue"><i class="fa fa-chart-line"></i></div>
        <div class="stat-label">GDP (World Bank)</div>
        <div class="stat-value">${gdp ? '$' + formatCompact(gdp) : 'Loading...'}</div>
        <div class="stat-change ${(gdpGrowth || 0) >= 0 ? 'positive' : 'negative'}">
          <i class="fa fa-arrow-${(gdpGrowth || 0) >= 0 ? 'up' : 'down'}"></i>
          ${gdpGrowth ? gdpGrowth.toFixed(2) + '% GDP growth' : 'N/A'}
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon ${(inflation || 0) > 5 ? 'red' : 'green'}"><i class="fa fa-fire"></i></div>
        <div class="stat-label">Inflation Rate</div>
        <div class="stat-value">${inflation ? inflation.toFixed(2) + '%' : 'N/A'}</div>
        <div class="stat-change ${(inflation || 0) > 5 ? 'negative' : 'positive'}">
          ${(inflation || 0) > 5 ? '⚠️ High inflation' : (inflation || 0) > 2 ? '✅ Moderate' : '✅ Controlled'}
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon orange"><i class="fa fa-users"></i></div>
        <div class="stat-label">Unemployment</div>
        <div class="stat-value">${unemployment ? unemployment.toFixed(1) + '%' : 'N/A'}</div>
        <div class="stat-change ${(unemployment || 0) > 8 ? 'negative' : 'positive'}">
          ${(unemployment || 0) > 8 ? '⚠️ High' : (unemployment || 0) > 5 ? '📊 Moderate' : '✅ Low'}
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon purple"><i class="fa fa-coins"></i></div>
        <div class="stat-label">Trade Balance</div>
        <div class="stat-value" style="font-size:1.3rem">${c.trade.exports.balance}</div>
        <div class="stat-change ${c.trade.exports.balance.includes('+') ? 'positive' : 'negative'}">
          ${c.trade.exports.balance.includes('+') ? '✅ Trade Surplus' : '📊 Trade Deficit'}
        </div>
      </div>
    </div>

    <!-- Top Companies -->
    <div class="card mb-4">
      <div class="card-header">
        <div class="card-title"><i class="fa fa-building"></i> Top Companies — ${c.name}</div>
        <span class="badge badge-info">${c.exchange}</span>
      </div>
      <div style="overflow-x:auto">
        <table style="width:100%;border-collapse:collapse">
          <thead>
            <tr style="background:var(--bg-elevated)">
              <th style="padding:12px 16px;text-align:left;font-size:0.8rem;color:var(--text-muted);font-weight:600">Symbol</th>
              <th style="padding:12px 16px;text-align:left;font-size:0.8rem;color:var(--text-muted);font-weight:600">Company</th>
              <th style="padding:12px 16px;text-align:left;font-size:0.8rem;color:var(--text-muted);font-weight:600">What They Do</th>
              <th style="padding:12px 16px;text-align:right;font-size:0.8rem;color:var(--text-muted);font-weight:600">Price</th>
              <th style="padding:12px 16px;text-align:right;font-size:0.8rem;color:var(--text-muted);font-weight:600">Mkt Cap</th>
              <th style="padding:12px 16px;text-align:right;font-size:0.8rem;color:var(--text-muted);font-weight:600">Founded</th>
            </tr>
          </thead>
          <tbody>
            ${c.topCompanies.map((s, i) => `
              <tr style="border-top:1px solid var(--border-color);${i % 2 === 0 ? '' : 'background:var(--bg-elevated)20'}">
                <td style="padding:14px 16px">
                  <div style="font-weight:800;color:${c.color};font-size:0.9rem">${s.sym}</div>
                  <div style="font-size:0.72rem;color:var(--text-muted)">${s.sector}</div>
                </td>
                <td style="padding:14px 16px">
                  <div style="font-weight:600;font-size:0.9rem">${s.name}</div>
                  <div style="font-size:0.72rem;color:var(--text-muted)">👥 ${s.employees} employees</div>
                </td>
                <td style="padding:14px 16px;max-width:350px">
                  <div style="font-size:0.82rem;color:var(--text-secondary);line-height:1.5">${s.desc}</div>
                </td>
                <td style="padding:14px 16px;text-align:right">
                  <div style="font-weight:700;font-family:monospace">${s.price.toLocaleString()} <span style="font-size:0.7rem;color:var(--text-muted)">${c.currency}</span></div>
                  <div style="font-size:0.8rem;font-weight:600;color:${s.chg >= 0 ? '#22c55e' : '#ef4444'}">${s.chg >= 0 ? '+' : ''}${s.chg}%</div>
                </td>
                <td style="padding:14px 16px;text-align:right;font-size:0.85rem;color:var(--text-muted)">${s.mktCap}</td>
                <td style="padding:14px 16px;text-align:right;font-size:0.85rem;color:var(--text-muted)">${s.founded}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <!-- Trade Section -->
    <div class="grid grid-2 mb-4">
      <!-- Exports -->
      <div class="card">
        <div class="card-header">
          <div class="card-title"><i class="fa fa-plane-departure"></i> Exports</div>
          <span class="badge badge-success">${c.trade.exports.total} total</span>
        </div>
        <div class="card-body">
          <div style="margin-bottom:16px">
            <div style="font-size:0.8rem;font-weight:700;color:var(--text-muted);margin-bottom:8px;text-transform:uppercase;letter-spacing:0.05em">What ${c.name} Exports</div>
            ${c.trade.exports.categories.map(cat => `
              <div style="margin-bottom:10px">
                <div style="display:flex;justify-content:space-between;font-size:0.82rem;margin-bottom:3px">
                  <span style="color:var(--text-primary)">${cat.name}</span>
                  <span style="color:var(--text-muted)">${cat.value} (${cat.pct}%)</span>
                </div>
                <div style="background:var(--bg-elevated);border-radius:4px;height:7px;overflow:hidden">
                  <div style="width:${cat.pct}%;height:100%;background:linear-gradient(90deg,#22c55e,#16a34a);border-radius:4px;transition:width 1s ease"></div>
                </div>
              </div>
            `).join('')}
          </div>
          <div>
            <div style="font-size:0.8rem;font-weight:700;color:var(--text-muted);margin-bottom:8px;text-transform:uppercase;letter-spacing:0.05em">Top Export Destinations</div>
            ${c.trade.exports.destinations.map((d, i) => `
              <div style="display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:1px solid var(--border-color)20">
                <span style="font-size:0.85rem">${d.country}</span>
                <div style="display:flex;align-items:center;gap:8px">
                  <div style="width:80px;background:var(--bg-elevated);border-radius:4px;height:5px">
                    <div style="width:${d.pct * 3}%;height:100%;background:#22c55e;border-radius:4px"></div>
                  </div>
                  <span style="font-size:0.8rem;color:var(--text-muted);width:30px;text-align:right">${d.pct}%</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- Imports -->
      <div class="card">
        <div class="card-header">
          <div class="card-title"><i class="fa fa-plane-arrival"></i> Imports</div>
          <span class="badge badge-warning">${c.trade.imports.total} total</span>
        </div>
        <div class="card-body">
          <div style="margin-bottom:16px">
            <div style="font-size:0.8rem;font-weight:700;color:var(--text-muted);margin-bottom:8px;text-transform:uppercase;letter-spacing:0.05em">What ${c.name} Imports</div>
            ${c.trade.imports.categories.map(cat => `
              <div style="margin-bottom:10px">
                <div style="display:flex;justify-content:space-between;font-size:0.82rem;margin-bottom:3px">
                  <span style="color:var(--text-primary)">${cat.name}</span>
                  <span style="color:var(--text-muted)">${cat.value} (${cat.pct}%)</span>
                </div>
                <div style="background:var(--bg-elevated);border-radius:4px;height:7px;overflow:hidden">
                  <div style="width:${cat.pct}%;height:100%;background:linear-gradient(90deg,#f97316,#ea580c);border-radius:4px;transition:width 1s ease"></div>
                </div>
              </div>
            `).join('')}
          </div>
          <div>
            <div style="font-size:0.8rem;font-weight:700;color:var(--text-muted);margin-bottom:8px;text-transform:uppercase;letter-spacing:0.05em">Top Import Sources</div>
            ${c.trade.imports.sources.map((s, i) => `
              <div style="display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:1px solid var(--border-color)20">
                <span style="font-size:0.85rem">${s.country}</span>
                <div style="display:flex;align-items:center;gap:8px">
                  <div style="width:80px;background:var(--bg-elevated);border-radius:4px;height:5px">
                    <div style="width:${s.pct * 3}%;height:100%;background:#f97316;border-radius:4px"></div>
                  </div>
                  <span style="font-size:0.8rem;color:var(--text-muted);width:30px;text-align:right">${s.pct}%</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>

    <!-- Index Chart + Currency -->
    <div class="grid grid-2 mb-4">
      <div class="card">
        <div class="card-header">
          <div class="card-title"><i class="fa fa-chart-area"></i> ${c.index} — 7 Day Trend</div>
        </div>
        <div class="card-body"><canvas id="country-chart" height="220"></canvas></div>
      </div>
      <div class="card">
        <div class="card-header">
          <div class="card-title"><i class="fa fa-coins"></i> ${c.currency} Exchange Rates</div>
        </div>
        <div class="card-body" style="padding:16px">
          ${buildCurrencyPanel(c)}
        </div>
      </div>
    </div>
  `;

  drawChart(c);
}

function buildCurrencyPanel(c) {
  const rate = exchangeRates[c.currency] || 1;
  const allPairs = [
    { code: 'USD', flag: '🇺🇸', r: 1 },
    { code: 'EUR', flag: '🇪🇺', r: exchangeRates['EUR'] || 0.92 },
    { code: 'GBP', flag: '🇬🇧', r: exchangeRates['GBP'] || 0.79 },
    { code: 'JPY', flag: '🇯🇵', r: exchangeRates['JPY'] || 149.8 },
    { code: 'INR', flag: '🇮🇳', r: exchangeRates['INR'] || 83.25 },
    { code: 'CNY', flag: '🇨🇳', r: exchangeRates['CNY'] || 7.24 },
    { code: 'AED', flag: '🇦🇪', r: exchangeRates['AED'] || 3.673 },
    { code: 'SAR', flag: '🇸🇦', r: exchangeRates['SAR'] || 3.75 },
  ].filter(p => p.code !== c.currency);

  return `
    <div style="text-align:center;padding:8px 0 16px">
      <div style="font-size:3rem">${c.flag}</div>
      <div style="font-size:1.5rem;font-weight:800">${c.currency}</div>
      <div style="color:var(--text-muted);font-size:0.85rem">${c.currencyName}</div>
    </div>
    <div style="display:grid;gap:8px">
      ${allPairs.slice(0, 6).map(p => {
        const converted = (p.r / rate).toFixed(4);
        return `
          <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 12px;background:var(--bg-elevated);border-radius:8px">
            <span style="font-size:0.9rem">${p.flag} ${p.code}</span>
            <span style="font-family:monospace;font-weight:600;font-size:0.9rem">1 ${c.currency} = ${converted} ${p.code}</span>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

function drawChart(c) {
  const canvas = document.getElementById('country-chart');
  if (!canvas || !window.Chart) return;
  const ex = Chart.getChart(canvas);
  if (ex) ex.destroy();

  const base = c.indexVal;
  const labels = [], data = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    labels.push(d.toLocaleDateString('en', { weekday: 'short', month: 'short', day: 'numeric' }));
    data.push(+(base + (Math.random() - 0.45) * base * 0.012 - i * base * 0.0008).toFixed(2));
  }
  data[data.length - 1] = base;

  const up = data[data.length - 1] >= data[0];
  const col = up ? '#22c55e' : '#ef4444';

  new Chart(canvas, {
    type: 'line',
    data: { labels, datasets: [{ label: c.index, data, borderColor: col, backgroundColor: col + '18', borderWidth: 2.5, pointRadius: 3, pointBackgroundColor: col, fill: true, tension: 0.4 }] },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { backgroundColor: 'rgba(15,15,26,0.95)', callbacks: { label: ctx => `${c.index}: ${ctx.raw.toLocaleString()}` } } },
      scales: {
        x: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: 'var(--text-muted)', font: { size: 10 } } },
        y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: 'var(--text-muted)', font: { size: 10 }, callback: v => v.toLocaleString() } }
      }
    }
  });
}

async function fetchWB(code, indicator) {
  try {
    const res = await fetch(`https://api.worldbank.org/v2/country/${code}/indicator/${indicator}?format=json&mrv=1&per_page=1`);
    const json = await res.json();
    return json[1]?.[0]?.value || null;
  } catch { return null; }
}
