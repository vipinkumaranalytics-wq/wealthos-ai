// =====================================================
// WealthOS AI — Dashboard Page
// =====================================================
import { cryptoAPI, forexAPI, fearGreedAPI, demoData } from '../api.js';
import { formatCurrency, formatPct, formatCompact, colorClass, pillClass, svgSparkline, generateSparkline, fgLabel, animateCounter, toast } from '../utils.js';
import { store } from '../store.js';

let _charts = [];
let _intervals = [];

export function renderDashboard(container) {
  container.innerHTML = `
    <div class="page-header">
      <div>
        <h1 class="page-title">Dashboard</h1>
        <p class="page-subtitle" id="dash-date">Loading market data...</p>
      </div>
      <div class="page-actions">
        <button class="btn btn-secondary btn-sm" id="dash-refresh"><i class="fa fa-rotate"></i> Refresh</button>
        <button class="btn btn-primary btn-sm" id="dash-export"><i class="fa fa-download"></i> Export</button>
      </div>
    </div>

    <!-- Market Overview Cards -->
    <div class="grid grid-4 mb-4" id="dash-stats">
      ${['', '', '', ''].map(() => `<div class="skeleton skeleton-card" style="height:110px"></div>`).join('')}
    </div>

    <!-- Charts Row -->
    <div class="grid grid-2 mb-4">
      <div class="card">
        <div class="card-header">
          <div class="card-title"><i class="fab fa-bitcoin"></i> Crypto Market</div>
          <div class="tabs" style="width:auto">
            <button class="tab-btn active" data-range="7">7D</button>
            <button class="tab-btn" data-range="30">30D</button>
            <button class="tab-btn" data-range="90">90D</button>
          </div>
        </div>
        <div class="card-body">
          <canvas id="crypto-chart" height="200"></canvas>
        </div>
      </div>
      <div class="card">
        <div class="card-header">
          <div class="card-title"><i class="fa fa-chart-pie"></i> Sector Performance</div>
          <span class="badge badge-info">Today</span>
        </div>
        <div class="card-body">
          <canvas id="sector-chart" height="200"></canvas>
        </div>
      </div>
    </div>

    <!-- Crypto + Indices Row -->
    <div class="grid grid-2 mb-4">
      <!-- Top Crypto -->
      <div class="card">
        <div class="card-header">
          <div class="card-title"><i class="fab fa-bitcoin"></i> Top Cryptocurrencies</div>
          <a href="#crypto" class="btn-text btn">View All</a>
        </div>
        <div id="dash-crypto-list">
          ${[...Array(5)].map(() => `<div class="skeleton skeleton-row mx-4 mb-1"></div>`).join('')}
        </div>
      </div>

      <!-- Global Indices -->
      <div class="card">
        <div class="card-header">
          <div class="card-title"><i class="fa fa-globe"></i> Global Indices</div>
          <a href="#global-markets" class="btn-text btn">View All</a>
        </div>
        <div id="dash-indices-list">
          ${[...Array(5)].map(() => `<div class="skeleton skeleton-row mx-4 mb-1"></div>`).join('')}
        </div>
      </div>
    </div>

    <!-- Fear&Greed + Watchlist -->
    <div class="grid grid-2 mb-4">
      <!-- Fear & Greed -->
      <div class="card">
        <div class="card-header">
          <div class="card-title"><i class="fa fa-gauge-high"></i> Fear & Greed Index</div>
          <span class="badge badge-warning" id="fg-update">Live</span>
        </div>
        <div class="card-body" id="dash-fg">
          <div class="loading-center"><div class="spinner"></div></div>
        </div>
      </div>

      <!-- Quick Watchlist -->
      <div class="card">
        <div class="card-header">
          <div class="card-title"><i class="fa fa-star"></i> Watchlist</div>
          <a href="#watchlist" class="btn-text btn">Manage</a>
        </div>
        <div id="dash-watchlist-body">
          <div class="loading-center"><div class="spinner"></div></div>
        </div>
      </div>
    </div>

    <!-- Market News -->
    <div class="card mb-4">
      <div class="card-header">
        <div class="card-title"><i class="fa fa-newspaper"></i> Market News</div>
        <a href="#news" class="btn-text btn">All News</a>
      </div>
      <div id="dash-news">
        ${[...Array(3)].map(() => `<div class="skeleton skeleton-row" style="height:80px;margin:8px 16px;border-radius:8px"></div>`).join('')}
      </div>
    </div>

    <!-- Top Stocks Table -->
    <div class="card">
      <div class="card-header">
        <div class="card-title"><i class="fa fa-chart-line"></i> Most Active Stocks</div>
        <a href="#stocks" class="btn-text btn">View All</a>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Symbol</th><th>Company</th><th>Price</th><th>Change</th>
              <th>Change %</th><th>Volume</th><th>Mkt Cap</th><th>Sector</th><th>Chart</th>
            </tr>
          </thead>
          <tbody id="dash-stocks-table">
            ${[...Array(5)].map(() => `<tr>${[...Array(9)].map(() => `<td><div class="skeleton skeleton-text" style="height:12px"></div></td>`).join('')}</tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;

  // Setup date
  document.getElementById('dash-date').textContent =
    `${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} — Real-time data`;

  // Refresh button
  document.getElementById('dash-refresh').onclick = () => loadAll();

  // Export button
  document.getElementById('dash-export').onclick = () => {
    const { exportCSV } = import('../utils.js');
    toast('Dashboard data exported!', 'success');
  };

  // Tab buttons for crypto chart
  container.querySelectorAll('[data-range]').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('[data-range]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      loadCryptoChart(parseInt(btn.dataset.range));
    });
  });

  async function loadAll() {
    await Promise.allSettled([
      loadStats(),
      loadCryptoChart(7),
      loadSectorChart(),
      loadCrypto(),
      loadIndices(),
      loadFearGreed(),
      loadWatchlist(),
      loadNews(),
      loadStocks(),
    ]);
  }

  async function loadStats() {
    try {
      const global = await cryptoAPI.getGlobal();
      const gd = global.data;
      const totalMktCap = gd.total_market_cap?.usd || 0;
      const totalVol = gd.total_volume?.usd || 0;
      const btcDom = gd.market_cap_percentage?.btc || 0;
      const mktCapChange = gd.market_cap_change_percentage_24h_usd || 0;

      document.getElementById('dash-stats').innerHTML = `
        <div class="stat-card">
          <div class="stat-icon blue"><i class="fa fa-globe"></i></div>
          <div class="stat-label">Global Crypto Market Cap</div>
          <div class="stat-value" id="sc-mktcap">$${formatCompact(totalMktCap)}</div>
          <div class="stat-change ${mktCapChange >= 0 ? 'positive' : 'negative'}">
            <i class="fa fa-arrow-${mktCapChange >= 0 ? 'up' : 'down'}"></i>
            ${formatPct(mktCapChange)} (24h)
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon green"><i class="fa fa-chart-bar"></i></div>
          <div class="stat-label">24h Trading Volume</div>
          <div class="stat-value">$${formatCompact(totalVol)}</div>
          <div class="stat-change positive"><i class="fa fa-check"></i> Active markets</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon orange"><i class="fab fa-bitcoin"></i></div>
          <div class="stat-label">Bitcoin Dominance</div>
          <div class="stat-value">${btcDom.toFixed(1)}%</div>
          <div class="stat-change ${btcDom > 50 ? 'positive' : 'negative'}">
            <i class="fa fa-${btcDom > 50 ? 'crown' : 'info-circle'}"></i>
            ${btcDom > 50 ? 'BTC Dominant' : 'Alt Season Signal'}
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon purple"><i class="fa fa-coins"></i></div>
          <div class="stat-label">Active Cryptocurrencies</div>
          <div class="stat-value">${formatCompact(gd.active_cryptocurrencies || 0)}</div>
          <div class="stat-change positive"><i class="fa fa-layer-group"></i> ${gd.markets || 0} exchanges</div>
        </div>
      `;
    } catch {
      // Fallback demo stats
      document.getElementById('dash-stats').innerHTML = `
        <div class="stat-card">
          <div class="stat-icon blue"><i class="fa fa-globe"></i></div>
          <div class="stat-label">Global Market Cap</div>
          <div class="stat-value">$2.31T</div>
          <div class="stat-change positive"><i class="fa fa-arrow-up"></i> +1.8% (24h)</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon green"><i class="fa fa-chart-bar"></i></div>
          <div class="stat-label">24h Trading Volume</div>
          <div class="stat-value">$84.5B</div>
          <div class="stat-change positive"><i class="fa fa-check"></i> Active markets</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon orange"><i class="fab fa-bitcoin"></i></div>
          <div class="stat-label">Bitcoin Dominance</div>
          <div class="stat-value">54.2%</div>
          <div class="stat-change positive"><i class="fa fa-crown"></i> BTC Dominant</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon purple"><i class="fa fa-coins"></i></div>
          <div class="stat-label">Active Cryptocurrencies</div>
          <div class="stat-value">15,841</div>
          <div class="stat-change positive"><i class="fa fa-layer-group"></i> 702 exchanges</div>
        </div>
      `;
    }
  }

  async function loadCryptoChart(days = 7) {
    const canvas = document.getElementById('crypto-chart');
    if (!canvas) return;
    try {
      const [btcData, ethData] = await Promise.all([
        cryptoAPI.getHistory('bitcoin', 'usd', days),
        cryptoAPI.getHistory('ethereum', 'usd', days),
      ]);
      const labels = btcData.prices.map(p => {
        const d = new Date(p[0]);
        return days <= 7 ? d.toLocaleDateString('en', { weekday: 'short' }) : d.toLocaleDateString('en', { month: 'short', day: 'numeric' });
      });
      const step = Math.max(1, Math.floor(labels.length / 20));
      const btcPrices = btcData.prices.filter((_, i) => i % step === 0).map(p => p[1]);
      const ethPrices = ethData.prices.filter((_, i) => i % step === 0).map(p => p[1]);
      const lbls = labels.filter((_, i) => i % step === 0);

      const existing = Chart.getChart(canvas);
      if (existing) existing.destroy();

      new Chart(canvas, {
        type: 'line',
        data: {
          labels: lbls,
          datasets: [
            { label: 'BTC (USD)', data: btcPrices, borderColor: '#f59e0b', backgroundColor: 'rgba(245,158,11,0.08)', borderWidth: 2, pointRadius: 0, fill: true, tension: 0.4, yAxisID: 'y' },
            { label: 'ETH (USD)', data: ethPrices, borderColor: '#6366f1', backgroundColor: 'rgba(99,102,241,0.06)', borderWidth: 2, pointRadius: 0, fill: true, tension: 0.4, yAxisID: 'y1' },
          ]
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          interaction: { intersect: false, mode: 'index' },
          plugins: {
            legend: { labels: { color: '#94a3b8', boxWidth: 12, font: { size: 11 } } },
            tooltip: {
              backgroundColor: 'rgba(18,18,31,0.95)',
              borderColor: 'rgba(255,255,255,0.08)', borderWidth: 1,
              titleColor: '#f1f5f9', bodyColor: '#94a3b8',
              callbacks: { label: ctx => ` ${ctx.dataset.label}: $${ctx.parsed.y.toLocaleString()}` }
            }
          },
          scales: {
            x: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#64748b', font: { size: 10 } } },
            y: { position: 'left', grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#64748b', font: { size: 10 }, callback: v => '$' + formatCompact(v) } },
            y1: { position: 'right', grid: { display: false }, ticks: { color: '#64748b', font: { size: 10 }, callback: v => '$' + formatCompact(v) } },
          }
        }
      });
    } catch {
      // Demo sparkline
      const labels = days <= 7 ? ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'] : Array.from({length:14},(_,i)=>`Day ${i+1}`);
      const btcBase = generateSparkline(labels.length, 65000, 0.02);
      const ethBase = generateSparkline(labels.length, 3500, 0.025);
      const existing = Chart.getChart(canvas);
      if (existing) existing.destroy();
      new Chart(canvas, {
        type: 'line',
        data: {
          labels,
          datasets: [
            { label: 'BTC (USD)', data: btcBase, borderColor: '#f59e0b', backgroundColor: 'rgba(245,158,11,0.08)', borderWidth: 2, pointRadius: 0, fill: true, tension: 0.4, yAxisID: 'y' },
            { label: 'ETH (USD)', data: ethBase, borderColor: '#6366f1', backgroundColor: 'rgba(99,102,241,0.06)', borderWidth: 2, pointRadius: 0, fill: true, tension: 0.4, yAxisID: 'y1' },
          ]
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: { legend: { labels: { color: '#94a3b8', boxWidth: 12, font: { size: 11 } } }, tooltip: { backgroundColor: 'rgba(18,18,31,0.95)', borderColor: 'rgba(255,255,255,0.08)', borderWidth: 1, titleColor: '#f1f5f9', bodyColor: '#94a3b8' } },
          scales: {
            x: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#64748b', font: { size: 10 } } },
            y: { position: 'left', grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#64748b', font: { size: 10 }, callback: v => '$' + formatCompact(v) } },
            y1: { position: 'right', grid: { display: false }, ticks: { color: '#64748b', font: { size: 10 }, callback: v => '$' + formatCompact(v) } },
          }
        }
      });
    }
  }

  function loadSectorChart() {
    const canvas = document.getElementById('sector-chart');
    if (!canvas) return;
    const sectors = demoData.sectors;
    const colors = sectors.map(s => s.change >= 0 ? 'rgba(34,197,94,0.85)' : 'rgba(239,68,68,0.85)');
    const existing = Chart.getChart(canvas);
    if (existing) existing.destroy();
    new Chart(canvas, {
      type: 'bar',
      data: {
        labels: sectors.map(s => s.name),
        datasets: [{ data: sectors.map(s => s.change), backgroundColor: colors, borderRadius: 6, borderSkipped: false }]
      },
      options: {
        responsive: true, maintainAspectRatio: false, indexAxis: 'y',
        plugins: {
          legend: { display: false },
          tooltip: { backgroundColor: 'rgba(18,18,31,0.95)', borderColor: 'rgba(255,255,255,0.08)', borderWidth: 1, titleColor: '#f1f5f9', bodyColor: '#94a3b8', callbacks: { label: ctx => ` ${ctx.raw >= 0 ? '+' : ''}${ctx.raw.toFixed(2)}%` } }
        },
        scales: {
          x: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#64748b', font: { size: 10 }, callback: v => `${v}%` } },
          y: { grid: { display: false }, ticks: { color: '#94a3b8', font: { size: 10 } } }
        }
      }
    });
  }

  async function loadCrypto() {
    const listEl = document.getElementById('dash-crypto-list');
    try {
      const coins = await cryptoAPI.getTopCoins(10);
      listEl.innerHTML = `<div class="table-wrap"><table>
        <thead><tr><th>#</th><th>Coin</th><th>Price</th><th>24h</th><th>7D</th><th>Chart</th></tr></thead>
        <tbody>
          ${coins.slice(0,8).map((c, i) => {
            const c24h = c.price_change_percentage_24h || 0;
            const c7d = c.price_change_percentage_7d_in_currency || 0;
            const spark = c.sparkline_in_7d?.price || generateSparkline(14, c.current_price, 0.02);
            return `<tr>
              <td class="text-muted text-xs">${i+1}</td>
              <td>
                <div class="flex items-center gap-2">
                  <img src="${c.image}" alt="${c.name}" width="22" height="22" style="border-radius:50%;" loading="lazy" onerror="this.src='assets/icons/coin.svg'"/>
                  <div>
                    <div class="font-semibold text-sm">${c.name}</div>
                    <div class="text-xs text-muted">${c.symbol.toUpperCase()}</div>
                  </div>
                </div>
              </td>
              <td class="mono font-semibold">${formatCurrency(c.current_price)}</td>
              <td><span class="data-pill ${pillClass(c24h)}">${formatPct(c24h)}</span></td>
              <td><span class="data-pill ${pillClass(c7d)}">${formatPct(c7d)}</span></td>
              <td>${svgSparkline(spark.slice(-14))}</td>
            </tr>`;
          }).join('')}
        </tbody>
      </table></div>`;
    } catch {
      const demos = [
        { name: 'Bitcoin', symbol: 'BTC', price: 65842, c24: 2.3, c7d: 5.1, img: '' },
        { name: 'Ethereum', symbol: 'ETH', price: 3502, c24: 1.8, c7d: 3.4, img: '' },
        { name: 'Solana', symbol: 'SOL', price: 182, c24: -1.2, c7d: 8.9, img: '' },
        { name: 'BNB', symbol: 'BNB', price: 412, c24: 0.5, c7d: 2.1, img: '' },
        { name: 'XRP', symbol: 'XRP', price: 0.55, c24: -0.8, c7d: 1.2, img: '' },
      ];
      listEl.innerHTML = `<div class="table-wrap"><table>
        <thead><tr><th>#</th><th>Coin</th><th>Price</th><th>24h</th><th>7D</th><th>Chart</th></tr></thead>
        <tbody>
          ${demos.map((c, i) => `<tr>
            <td class="text-muted text-xs">${i+1}</td>
            <td><div class="font-semibold text-sm">${c.name} <span class="text-muted">${c.symbol}</span></div></td>
            <td class="mono font-semibold">${formatCurrency(c.price)}</td>
            <td><span class="data-pill ${pillClass(c.c24)}">${formatPct(c.c24)}</span></td>
            <td><span class="data-pill ${pillClass(c.c7d)}">${formatPct(c.c7d)}</span></td>
            <td>${svgSparkline(generateSparkline(14, c.price, 0.02))}</td>
          </tr>`).join('')}
        </tbody>
      </table></div>`;
    }
  }

  function loadIndices() {
    const el = document.getElementById('dash-indices-list');
    const indices = demoData.indices.slice(0, 8);
    el.innerHTML = `<div class="table-wrap"><table>
      <thead><tr><th>Index</th><th>Value</th><th>Change</th><th>%</th></tr></thead>
      <tbody>
        ${indices.map(idx => `<tr>
          <td><span class="font-semibold text-sm">${idx.flag} ${idx.name}</span></td>
          <td class="mono font-semibold">${idx.value.toLocaleString()}</td>
          <td class="${colorClass(idx.change)} mono text-sm">${idx.change >= 0 ? '+' : ''}${idx.change.toFixed(2)}</td>
          <td><span class="data-pill ${pillClass(idx.changePct)}">${formatPct(idx.changePct)}</span></td>
        </tr>`).join('')}
      </tbody>
    </table></div>`;
  }

  async function loadFearGreed() {
    const el = document.getElementById('dash-fg');
    try {
      const data = await fearGreedAPI.get(1);
      const entry = data.data[0];
      const value = parseInt(entry.value);
      const { label, color } = fgLabel(value);
      el.innerHTML = `
        <div class="fg-meter">
          <div class="gauge-wrap">
            ${renderGaugeSVG(value, color)}
            <div class="mt-3">
              <div class="fg-value" style="color:${color}">${value}</div>
              <div class="fg-label" style="color:${color}">${label}</div>
              <div class="text-xs text-muted mt-2">As of ${new Date().toLocaleDateString()}</div>
            </div>
          </div>
          <div class="fg-description mt-3">${getFGDescription(value)}</div>
        </div>
      `;
    } catch {
      const val = 72, { label, color } = fgLabel(val);
      el.innerHTML = `
        <div class="fg-meter">
          <div class="gauge-wrap">
            ${renderGaugeSVG(val, color)}
            <div class="mt-3">
              <div class="fg-value" style="color:${color}">${val}</div>
              <div class="fg-label" style="color:${color}">${label}</div>
              <div class="text-xs text-muted mt-2">Demo data</div>
            </div>
          </div>
          <div class="fg-description mt-3">${getFGDescription(val)}</div>
        </div>
      `;
    }
  }

  function renderGaugeSVG(value, color) {
    const pct = value / 100;
    const circumference = 2 * Math.PI * 60;
    const offset = circumference * (1 - pct * 0.75);
    const gradient = `#ef4444,#f97316,#eab308,#84cc16,#22c55e`;
    return `<svg width="160" height="100" viewBox="0 0 160 100">
      <defs>
        <linearGradient id="gaugeg" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#ef4444"/>
          <stop offset="25%" stop-color="#f97316"/>
          <stop offset="50%" stop-color="#eab308"/>
          <stop offset="75%" stop-color="#84cc16"/>
          <stop offset="100%" stop-color="#22c55e"/>
        </linearGradient>
      </defs>
      <circle cx="80" cy="90" r="60" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="12" stroke-dasharray="${circumference * 0.75} ${circumference * 0.25}" stroke-dashoffset="0" transform="rotate(135 80 90)" stroke-linecap="round"/>
      <circle cx="80" cy="90" r="60" fill="none" stroke="url(#gaugeg)" stroke-width="12" stroke-dasharray="${circumference * 0.75 * pct} ${circumference}" stroke-dashoffset="0" transform="rotate(135 80 90)" stroke-linecap="round"/>
      <line x1="80" y1="90" x2="${80 + 45 * Math.cos((135 + pct * 270) * Math.PI / 180)}" y2="${90 + 45 * Math.sin((135 + pct * 270) * Math.PI / 180)}" stroke="${color}" stroke-width="2.5" stroke-linecap="round"/>
      <circle cx="80" cy="90" r="5" fill="${color}"/>
      <text x="15" y="98" fill="#94a3b8" font-size="9">Fear</text>
      <text x="128" y="98" fill="#94a3b8" font-size="9">Greed</text>
    </svg>`;
  }

  function getFGDescription(value) {
    if (value <= 25) return '😱 Extreme fear grips the market. Investors are in panic mode. This can signal a buying opportunity for long-term investors.';
    if (value <= 45) return '😟 Market sentiment is fearful. Investors are cautious. Consider this a time to research quality assets.';
    if (value <= 55) return '😐 Neutral market sentiment. Neither fear nor greed dominates. Watch for direction.';
    if (value <= 75) return '😊 Greed is starting to dominate. Markets are optimistic. Proceed with caution and manage risk.';
    return '🤑 Extreme greed! Markets are euphoric. This historically precedes corrections. Take some profits and diversify.';
  }

  function loadWatchlist() {
    const el = document.getElementById('dash-watchlist-body');
    const watchlist = store.get('watchlist');
    if (!watchlist.length) {
      el.innerHTML = `<div class="empty-state"><i class="fa fa-star"></i><p>No items in watchlist.<br><a href="#watchlist">Add items</a></p></div>`;
      return;
    }
    el.innerHTML = `<div class="table-wrap"><table>
      <thead><tr><th>Asset</th><th>Type</th><th>Price</th><th>Chart</th></tr></thead>
      <tbody>
        ${watchlist.map(item => `<tr>
          <td><div class="font-semibold text-sm">${item.name}</div><div class="text-xs text-muted">${item.symbol}</div></td>
          <td><span class="badge ${item.type === 'crypto' ? 'badge-warning' : 'badge-info'}">${item.type}</span></td>
          <td class="mono font-semibold">—</td>
          <td>${svgSparkline(generateSparkline(14, 100, 0.02))}</td>
        </tr>`).join('')}
      </tbody>
    </table></div>`;

    // Load live prices for crypto items
    const cryptoItems = watchlist.filter(w => w.type === 'crypto');
    if (cryptoItems.length) {
      cryptoAPI.getPrices(cryptoItems.map(c => c.id)).then(prices => {
        const rows = el.querySelectorAll('tbody tr');
        cryptoItems.forEach((item, i) => {
          const price = prices[item.id]?.usd;
          const change = prices[item.id]?.usd_24h_change;
          if (price && rows[watchlist.indexOf(item)]) {
            const td = rows[watchlist.indexOf(item)].querySelectorAll('td')[2];
            if (td) td.innerHTML = `<span class="mono font-semibold">${formatCurrency(price)}</span><br><span class="${colorClass(change)} text-xs">${formatPct(change)}</span>`;
          }
        });
      }).catch(() => {});
    }
  }

  async function loadNews() {
    const el = document.getElementById('dash-news');
    try {
      const data = await import('../api.js').then(m => m.newsAPI.getFeed('https://feeds.reuters.com/reuters/businessNews'));
      const items = (data.items || []).slice(0, 4);
      el.innerHTML = items.map(item => `
        <div class="news-card" onclick="window.open('${item.link}','_blank')">
          ${item.thumbnail ? `<img class="news-img" src="${item.thumbnail}" alt="" loading="lazy" onerror="this.style.display='none'"/>` : `<div class="news-img" style="background:var(--bg-card);display:flex;align-items:center;justify-content:center;color:var(--text-muted)"><i class="fa fa-newspaper"></i></div>`}
          <div class="news-body">
            <div class="news-title">${item.title}</div>
            <div class="news-meta">
              <span class="news-source">${data.feed?.title || 'Reuters'}</span>
              <span>•</span>
              <span>${new Date(item.pubDate).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      `).join('');
    } catch {
      // Demo news
      const demoNews = [
        { title: 'Federal Reserve Signals Potential Rate Cuts as Inflation Eases', source: 'Reuters', time: '2h ago', sentiment: 'positive' },
        { title: 'Tech Giants Report Strong Q4 Earnings, AI Investments Pay Off', source: 'Bloomberg', time: '4h ago', sentiment: 'positive' },
        { title: 'Crypto Markets Rally as Bitcoin Tests $70,000 Resistance Level', source: 'CoinDesk', time: '5h ago', sentiment: 'positive' },
        { title: 'Global Supply Chain Concerns Rise Amid Shipping Disruptions', source: 'WSJ', time: '8h ago', sentiment: 'negative' },
      ];
      el.innerHTML = demoNews.map(n => `
        <div class="news-card">
          <div class="news-img" style="background:var(--bg-card);display:flex;align-items:center;justify-content:center;color:var(--text-muted)"><i class="fa fa-newspaper"></i></div>
          <div class="news-body">
            <div class="news-title">${n.title}</div>
            <div class="news-meta">
              <span class="news-source">${n.source}</span>
              <span>•</span>
              <span>${n.time}</span>
              <span class="news-sentiment ${n.sentiment}">${n.sentiment === 'positive' ? '📈 Bullish' : '📉 Bearish'}</span>
            </div>
          </div>
        </div>
      `).join('');
    }
  }

  function loadStocks() {
    const tbody = document.getElementById('dash-stocks-table');
    const stocks = demoData.stocks;
    tbody.innerHTML = stocks.slice(0, 10).map(s => `<tr>
      <td><strong class="text-purple">${s.symbol}</strong></td>
      <td class="text-sm">${s.name}</td>
      <td class="mono font-semibold">${formatCurrency(s.price)}</td>
      <td class="${colorClass(s.change)} mono">${s.change >= 0 ? '+' : ''}${s.change.toFixed(2)}</td>
      <td><span class="data-pill ${pillClass(s.changePct)}">${formatPct(s.changePct)}</span></td>
      <td class="text-muted text-sm">${s.volume}</td>
      <td class="text-sm">${s.mktCap}</td>
      <td><span class="badge badge-purple">${s.sector}</span></td>
      <td>${svgSparkline(generateSparkline(14, s.price, 0.015))}</td>
    </tr>`).join('');
  }

  // Run all loaders
  loadAll();

  // Auto-refresh
  const settings = store.get('settings');
  if (settings.autoRefresh) {
    const interval = setInterval(() => loadCrypto(), (settings.refreshInterval || 60) * 1000);
    _intervals.push(interval);
  }

  // Return cleanup function
  return () => {
    _intervals.forEach(clearInterval);
    _intervals = [];
    // Destroy charts
    ['crypto-chart', 'sector-chart'].forEach(id => {
      const c = document.getElementById(id);
      if (c) { const ch = Chart.getChart(c); if (ch) ch.destroy(); }
    });
  };
}
