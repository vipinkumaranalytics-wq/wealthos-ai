// =====================================================
// WealthOS AI — Crypto Page
// =====================================================
import { cryptoAPI } from '../api.js';
import { formatCurrency, formatPct, formatCompact, colorClass, pillClass, svgSparkline, generateSparkline, toast } from '../utils.js';
import { store } from '../store.js';

let _cleanups = [];

export function renderCrypto(container) {
  container.innerHTML = `
    <div class="page-header">
      <div><h1 class="page-title"><i class="fab fa-bitcoin text-warning"></i> Cryptocurrency</h1>
      <p class="page-subtitle">Live prices, market data, and trends for 100+ cryptocurrencies</p></div>
      <div class="page-actions">
        <button class="btn btn-secondary btn-sm" id="crypto-refresh"><i class="fa fa-rotate"></i> Refresh</button>
      </div>
    </div>

    <!-- Global Stats -->
    <div class="grid grid-4 mb-4" id="crypto-global-stats">
      ${[...Array(4)].map(()=>`<div class="skeleton skeleton-card" style="height:100px"></div>`).join('')}
    </div>

    <!-- Tabs -->
    <div class="tabs mb-4">
      <button class="tab-btn active" data-ctab="all">All Coins</button>
      <button class="tab-btn" data-ctab="defi">DeFi</button>
      <button class="tab-btn" data-ctab="trending">Trending</button>
      <button class="tab-btn" data-ctab="categories">Categories</button>
    </div>

    <!-- Filter Bar -->
    <div class="card mb-4">
      <div class="card-body" style="display:flex;gap:10px;flex-wrap:wrap;align-items:center">
        <input type="text" id="crypto-search" class="form-control" placeholder="🔍 Search coins..." style="flex:1;min-width:160px"/>
        <select id="crypto-sort" class="form-select" style="width:160px">
          <option value="market_cap_desc">Market Cap ↓</option>
          <option value="volume_desc">Volume ↓</option>
          <option value="price_change_desc">Gainers First</option>
          <option value="price_change_asc">Losers First</option>
        </select>
        <select id="crypto-per-page" class="form-select" style="width:100px">
          <option value="25">25</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
      </div>
    </div>

    <!-- Main Table -->
    <div class="card" id="crypto-table-card">
      <div class="card-header">
        <div class="card-title"><i class="fab fa-bitcoin"></i> Cryptocurrency Markets</div>
        <span class="badge badge-warning" id="crypto-updated">Updating...</span>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>#</th><th>Coin</th><th>Price</th><th>1h</th><th>24h</th><th>7d</th>
              <th>Market Cap</th><th>Volume (24h)</th><th>Circulating Supply</th><th>7D Chart</th><th>Action</th>
            </tr>
          </thead>
          <tbody id="crypto-tbody">
            ${[...Array(10)].map(()=>`<tr>${[...Array(11)].map(()=>`<td><div class="skeleton skeleton-text" style="height:12px;width:80%"></div></td>`).join('')}</tr>`).join('')}
          </tbody>
        </table>
      </div>
      <div class="card-footer flex justify-between items-center">
        <span class="text-sm text-muted" id="crypto-count">Loading...</span>
        <div style="display:flex;gap:8px">
          <button class="btn btn-secondary btn-sm" id="crypto-prev" disabled><i class="fa fa-chevron-left"></i></button>
          <span class="text-sm" id="crypto-page">Page 1</span>
          <button class="btn btn-secondary btn-sm" id="crypto-next"><i class="fa fa-chevron-right"></i></button>
        </div>
      </div>
    </div>

    <!-- Defi / Trending / Categories placeholders -->
    <div id="crypto-extra"></div>
  `;

  let currentPage = 1;
  let perPage = 25;
  let allCoins = [];
  let displayCoins = [];
  let activeTab = 'all';
  let searchQ = '';

  async function loadGlobal() {
    try {
      const g = await cryptoAPI.getGlobal();
      const d = g.data;
      document.getElementById('crypto-global-stats').innerHTML = `
        <div class="stat-card"><div class="stat-icon blue"><i class="fa fa-globe"></i></div>
          <div class="stat-label">Total Market Cap</div>
          <div class="stat-value" style="font-size:1.2rem">$${formatCompact(d.total_market_cap?.usd||0)}</div>
          <div class="stat-change ${(d.market_cap_change_percentage_24h_usd||0)>=0?'positive':'negative'}">
            <i class="fa fa-arrow-${(d.market_cap_change_percentage_24h_usd||0)>=0?'up':'down'}"></i>
            ${formatPct(d.market_cap_change_percentage_24h_usd||0)}
          </div>
        </div>
        <div class="stat-card"><div class="stat-icon green"><i class="fa fa-chart-bar"></i></div>
          <div class="stat-label">24h Volume</div>
          <div class="stat-value" style="font-size:1.2rem">$${formatCompact(d.total_volume?.usd||0)}</div>
          <div class="stat-change positive">Across all markets</div>
        </div>
        <div class="stat-card"><div class="stat-icon orange"><i class="fab fa-bitcoin"></i></div>
          <div class="stat-label">BTC Dominance</div>
          <div class="stat-value" style="font-size:1.2rem">${(d.market_cap_percentage?.btc||0).toFixed(1)}%</div>
          <div class="stat-change positive">ETH: ${(d.market_cap_percentage?.eth||0).toFixed(1)}%</div>
        </div>
        <div class="stat-card"><div class="stat-icon purple"><i class="fa fa-coins"></i></div>
          <div class="stat-label">Active Cryptos</div>
          <div class="stat-value" style="font-size:1.2rem">${(d.active_cryptocurrencies||0).toLocaleString()}</div>
          <div class="stat-change positive">${(d.markets||0)} exchanges</div>
        </div>
      `;
    } catch {
      document.getElementById('crypto-global-stats').innerHTML = `
        <div class="stat-card"><div class="stat-label">Total Market Cap</div><div class="stat-value" style="font-size:1.2rem">$2.31T</div><div class="stat-change positive">+1.8% (24h)</div></div>
        <div class="stat-card"><div class="stat-label">24h Volume</div><div class="stat-value" style="font-size:1.2rem">$84.5B</div><div class="stat-change positive">High activity</div></div>
        <div class="stat-card"><div class="stat-label">BTC Dominance</div><div class="stat-value" style="font-size:1.2rem">54.2%</div><div class="stat-change positive">ETH: 17.8%</div></div>
        <div class="stat-card"><div class="stat-label">Active Cryptos</div><div class="stat-value" style="font-size:1.2rem">15,841</div><div class="stat-change positive">702 exchanges</div></div>
      `;
    }
  }

  async function loadCoins() {
    try {
      const coins = await cryptoAPI.getTopCoins(100);
      allCoins = coins;
      filterAndRender();
      const updated = document.getElementById('crypto-updated');
      if (updated) updated.textContent = `Updated ${new Date().toLocaleTimeString()}`;
    } catch {
      // Demo coins
      allCoins = Array.from({length:20},(_,i) => ({
        market_cap_rank: i+1,
        id: ['bitcoin','ethereum','solana','cardano','ripple','dogecoin','polkadot','shiba-inu','bnb','avalanche-2'][i%10],
        name: ['Bitcoin','Ethereum','Solana','Cardano','XRP','Dogecoin','Polkadot','Shiba Inu','BNB','Avalanche'][i%10],
        symbol: ['btc','eth','sol','ada','xrp','doge','dot','shib','bnb','avax'][i%10],
        image: `https://assets.coingecko.com/coins/images/${i+1}/small/coin.png`,
        current_price: [65842,3502,182,0.42,0.55,0.12,6.85,0.000021,412,38][i%10] * (1+Math.random()*0.1-0.05),
        price_change_percentage_1h_in_currency: (Math.random()*4-2),
        price_change_percentage_24h: (Math.random()*10-4),
        price_change_percentage_7d_in_currency: (Math.random()*20-8),
        market_cap: [1.27e12,4.21e11,7.8e10,1.4e10,2.9e10,1.6e10,8.6e9,1.3e10,6.0e10,1.5e10][i%10],
        total_volume: [3.2e10,1.5e10,3.8e9,4.2e8,1.2e9,8.5e8,2.1e8,5.6e8,1.4e9,6.8e8][i%10],
        circulating_supply: [1.97e7,1.2e8,4.48e8,3.54e10,5.45e10,1.41e11,1.38e9,5.89e14,1.54e8,3.88e8][i%10],
        sparkline_in_7d: { price: generateSparkline(100,[65000,3500,180,0.42,0.55,0.12,6.85,0.000021,412,38][i%10],0.02) },
      }));
      filterAndRender();
    }
  }

  function filterAndRender() {
    let coins = [...allCoins];
    if (searchQ) {
      coins = coins.filter(c =>
        c.name.toLowerCase().includes(searchQ) ||
        c.symbol.toLowerCase().includes(searchQ)
      );
    }
    const sort = document.getElementById('crypto-sort')?.value || 'market_cap_desc';
    if (sort === 'volume_desc') coins.sort((a,b)=>b.total_volume-a.total_volume);
    else if (sort === 'price_change_desc') coins.sort((a,b)=>(b.price_change_percentage_24h||0)-(a.price_change_percentage_24h||0));
    else if (sort === 'price_change_asc') coins.sort((a,b)=>(a.price_change_percentage_24h||0)-(b.price_change_percentage_24h||0));
    displayCoins = coins;
    renderPage();
  }

  function renderPage() {
    const tbody = document.getElementById('crypto-tbody');
    const total = displayCoins.length;
    const start = (currentPage-1)*perPage;
    const pageCoins = displayCoins.slice(start, start+perPage);

    const count = document.getElementById('crypto-count');
    if (count) count.textContent = `${total} coins · Page ${currentPage} of ${Math.ceil(total/perPage)}`;
    const pageEl = document.getElementById('crypto-page');
    if (pageEl) pageEl.textContent = `Page ${currentPage}`;
    const prev = document.getElementById('crypto-prev');
    const next = document.getElementById('crypto-next');
    if (prev) prev.disabled = currentPage === 1;
    if (next) next.disabled = currentPage >= Math.ceil(total/perPage);

    if (!tbody) return;
    tbody.innerHTML = pageCoins.map(c => {
      const c1h = c.price_change_percentage_1h_in_currency || 0;
      const c24h = c.price_change_percentage_24h || 0;
      const c7d = c.price_change_percentage_7d_in_currency || 0;
      const spark = c.sparkline_in_7d?.price || generateSparkline(14, c.current_price, 0.02);
      return `<tr>
        <td class="text-muted text-xs">${c.market_cap_rank || '—'}</td>
        <td>
          <div class="flex items-center gap-2">
            <img src="${c.image}" alt="${c.symbol}" width="24" height="24" style="border-radius:50%" loading="lazy" onerror="this.style.display='none'"/>
            <div>
              <div class="font-semibold text-sm">${c.name}</div>
              <div class="text-xs text-muted uppercase">${c.symbol}</div>
            </div>
          </div>
        </td>
        <td class="mono font-bold">${formatCurrency(c.current_price)}</td>
        <td><span class="data-pill ${pillClass(c1h)}">${formatPct(c1h)}</span></td>
        <td><span class="data-pill ${pillClass(c24h)}">${formatPct(c24h)}</span></td>
        <td><span class="data-pill ${pillClass(c7d)}">${formatPct(c7d)}</span></td>
        <td class="mono text-sm">$${formatCompact(c.market_cap)}</td>
        <td class="mono text-sm">$${formatCompact(c.total_volume)}</td>
        <td class="text-sm text-muted">${formatCompact(c.circulating_supply)} ${c.symbol.toUpperCase()}</td>
        <td>${svgSparkline(spark.slice(-14))}</td>
        <td>
          <button class="btn btn-sm btn-outline" title="Add to watchlist" onclick="cryptoWatch('${c.id}','${c.name}','${c.symbol.toUpperCase()}')">
            <i class="fa fa-star"></i>
          </button>
        </td>
      </tr>`;
    }).join('');
  }

  window.cryptoWatch = (id, name, symbol) => {
    const added = store.addToWatchlist({ id, type: 'crypto', name, symbol });
    toast(added ? `${name} added to watchlist!` : `${name} already in watchlist`, added ? 'success' : 'info');
  };

  // Tab switching
  container.querySelectorAll('[data-ctab]').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('[data-ctab]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeTab = btn.dataset.ctab;
      const extra = document.getElementById('crypto-extra');
      if (activeTab === 'trending') loadTrending(extra);
      else if (activeTab === 'categories') loadCategories(extra);
      else if (activeTab === 'defi') loadDefi(extra);
      else { if (extra) extra.innerHTML = ''; }
    });
  });

  async function loadTrending(el) {
    if (!el) return;
    el.innerHTML = `<div class="loading-center mt-4"><div class="spinner"></div></div>`;
    try {
      const data = await cryptoAPI.getTrending();
      const coins = data.coins || [];
      el.innerHTML = `
        <div class="mt-4">
          <h3 class="section-title"><i class="fa fa-fire text-warning"></i> Trending Now (CoinGecko)</h3>
          <div class="grid grid-3">
            ${coins.map((item,i) => {
              const c = item.item;
              return `<div class="stat-card card-hover">
                <div class="flex items-center gap-2 mb-2">
                  <img src="${c.small}" width="32" height="32" style="border-radius:50%" loading="lazy" onerror="this.style.display='none'"/>
                  <div>
                    <div class="font-bold">#${i+1} ${c.name}</div>
                    <div class="text-xs text-muted uppercase">${c.symbol}</div>
                  </div>
                  <div class="ml-auto"><span class="badge badge-warning">Trending</span></div>
                </div>
                <div class="text-xs text-muted">Market Cap Rank: #${c.market_cap_rank}</div>
                <div class="mt-2">${svgSparkline(generateSparkline(14,100,0.03))}</div>
              </div>`;
            }).join('')}
          </div>
        </div>
      `;
    } catch {
      el.innerHTML = `<div class="error-box mt-4"><i class="fa fa-exclamation-circle"></i> Could not load trending data.</div>`;
    }
  }

  async function loadCategories(el) {
    if (!el) return;
    el.innerHTML = `<div class="loading-center mt-4"><div class="spinner"></div></div>`;
    try {
      const cats = await cryptoAPI.getCategories();
      el.innerHTML = `
        <div class="mt-4">
          <h3 class="section-title"><i class="fa fa-tags"></i> Crypto Categories by Market Cap</h3>
          <div class="card">
            <div class="table-wrap">
              <table>
                <thead><tr><th>#</th><th>Category</th><th>Market Cap</th><th>24h Change</th><th>Vol (24h)</th></tr></thead>
                <tbody>
                  ${cats.slice(0,20).map((c,i) => `<tr>
                    <td class="text-muted">${i+1}</td>
                    <td class="font-semibold">${c.name}</td>
                    <td class="mono">$${formatCompact(c.market_cap||0)}</td>
                    <td><span class="data-pill ${pillClass(c.market_cap_change_24h||0)}">${formatPct(c.market_cap_change_24h||0)}</span></td>
                    <td class="mono text-sm">$${formatCompact(c.volume_24h||0)}</td>
                  </tr>`).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      `;
    } catch {
      el.innerHTML = `<div class="error-box mt-4"><i class="fa fa-exclamation-circle"></i> Could not load categories.</div>`;
    }
  }

  async function loadDefi(el) {
    if (!el) return;
    try {
      const data = await cryptoAPI.getDefi();
      const d = data.data;
      el.innerHTML = `
        <div class="mt-4">
          <h3 class="section-title"><i class="fa fa-link"></i> DeFi Market Overview</h3>
          <div class="grid grid-4">
            <div class="stat-card"><div class="stat-label">DeFi Market Cap</div><div class="stat-value" style="font-size:1.1rem">$${formatCompact(parseFloat(d.defi_market_cap)||0)}</div></div>
            <div class="stat-card"><div class="stat-label">ETH Market Cap</div><div class="stat-value" style="font-size:1.1rem">$${formatCompact(parseFloat(d.eth_market_cap)||0)}</div></div>
            <div class="stat-card"><div class="stat-label">DeFi to ETH Ratio</div><div class="stat-value" style="font-size:1.1rem">${parseFloat(d.defi_to_eth_ratio||0).toFixed(2)}%</div></div>
            <div class="stat-card"><div class="stat-label">Top DeFi Dominance</div><div class="stat-value" style="font-size:1.1rem">${d.top_coin_name || 'Uniswap'}</div></div>
          </div>
        </div>
      `;
    } catch {
      el.innerHTML = `<div class="error-box mt-4"><i class="fa fa-exclamation-circle"></i> Could not load DeFi data.</div>`;
    }
  }

  // Events
  document.getElementById('crypto-search').addEventListener('input', e => { searchQ = e.target.value.toLowerCase(); currentPage = 1; filterAndRender(); });
  document.getElementById('crypto-sort').addEventListener('change', () => { currentPage = 1; filterAndRender(); });
  document.getElementById('crypto-per-page').addEventListener('change', e => { perPage = parseInt(e.target.value); currentPage = 1; renderPage(); });
  document.getElementById('crypto-prev').addEventListener('click', () => { if (currentPage > 1) { currentPage--; renderPage(); } });
  document.getElementById('crypto-next').addEventListener('click', () => { currentPage++; renderPage(); });
  document.getElementById('crypto-refresh').addEventListener('click', () => { loadCoins(); toast('Refreshing crypto data...', 'info', 2000); });

  // Initial load
  loadGlobal();
  loadCoins();

  // Auto refresh
  const interval = setInterval(loadCoins, 60000);
  return () => clearInterval(interval);
}
