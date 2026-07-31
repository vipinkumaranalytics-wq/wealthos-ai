// =====================================================
// WealthOS AI — Global Markets, Stocks, ETFs, Mutual Funds
// =====================================================
import { demoData, cryptoAPI, stockAPI } from '../api.js';
import { formatCurrency, formatPct, formatCompact, colorClass, pillClass, svgSparkline, generateSparkline, toast, exportCSV } from '../utils.js';
import { store } from '../store.js';

// ---- GLOBAL MARKETS ----
export function renderGlobalMarkets(container) {
  container.innerHTML = `
    <div class="page-header">
      <div><h1 class="page-title">Global Markets</h1><p class="page-subtitle">Real-time global indices, commodities, and macroeconomic overview</p></div>
    </div>
    <div class="tabs mb-4" id="gm-tabs">
      <button class="tab-btn active" data-tab="indices">Indices</button>
      <button class="tab-btn" data-tab="currencies">Currencies</button>
      <button class="tab-btn" data-tab="commodities">Commodities</button>
      <button class="tab-btn" data-tab="sectors">Sectors</button>
    </div>
    <div id="gm-content"></div>
  `;

  function showTab(tab) {
    container.querySelectorAll('[data-tab]').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
    const content = document.getElementById('gm-content');
    if (tab === 'indices') renderIndices(content);
    else if (tab === 'currencies') renderCurrencies(content);
    else if (tab === 'commodities') renderCommoditiesTab(content);
    else if (tab === 'sectors') renderSectorsTab(content);
  }

  container.querySelectorAll('[data-tab]').forEach(btn =>
    btn.addEventListener('click', () => showTab(btn.dataset.tab))
  );

  showTab('indices');
}

function renderIndices(el) {
  const indices = demoData.indices;
  const byCountry = {};
  indices.forEach(i => {
    const c = i.country; if (!byCountry[c]) byCountry[c] = [];
    byCountry[c].push(i);
  });
  el.innerHTML = `
    <div class="grid grid-4 mb-4">
      ${indices.slice(0,4).map(idx => `
        <div class="stat-card card-hover">
          <div class="stat-label">${idx.flag} ${idx.name}</div>
          <div class="stat-value mono" style="font-size:1.3rem">${idx.value.toLocaleString()}</div>
          <div class="stat-change ${idx.change >= 0 ? 'positive' : 'negative'}">
            <i class="fa fa-arrow-${idx.change >= 0 ? 'up' : 'down'}"></i>
            ${idx.change >= 0 ? '+' : ''}${idx.change.toFixed(2)} (${formatPct(idx.changePct)})
          </div>
        </div>
      `).join('')}
    </div>
    <div class="card">
      <div class="card-header"><div class="card-title"><i class="fa fa-globe"></i> All Major Indices</div></div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Index</th><th>Symbol</th><th>Country</th><th>Last Price</th><th>Change</th><th>Change %</th><th>Trend</th></tr></thead>
          <tbody>
            ${indices.map(idx => `<tr>
              <td class="font-semibold">${idx.flag} ${idx.name}</td>
              <td class="mono text-muted text-sm">${idx.symbol}</td>
              <td class="text-sm text-muted">${idx.country}</td>
              <td class="mono font-bold">${idx.value.toLocaleString()}</td>
              <td class="${colorClass(idx.change)} mono">${idx.change >= 0 ? '+' : ''}${idx.change.toFixed(2)}</td>
              <td><span class="data-pill ${pillClass(idx.changePct)}">${formatPct(idx.changePct)}</span></td>
              <td>${svgSparkline(generateSparkline(14, idx.value, 0.008))}</td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

async function renderCurrencies(el) {
  el.innerHTML = `<div class="loading-center"><div class="spinner-lg spinner"></div></div>`;
  try {
    const { forexAPI } = await import('../api.js');
    const data = await forexAPI.getRates('USD');
    const rates = data.rates;
    const major = ['EUR','GBP','JPY','CHF','AUD','CAD','CNY','INR','SGD','MXN','BRL','KRW','HKD','NOK','SEK','NZD','ZAR','THB','TRY','RUB'];
    el.innerHTML = `
      <div class="grid grid-4 mb-4">
        ${['EUR','GBP','JPY','INR'].map(c => `
          <div class="stat-card card-hover">
            <div class="stat-label">USD / ${c}</div>
            <div class="stat-value mono" style="font-size:1.3rem">${(rates[c] || 0).toFixed(c==='JPY'?2:4)}</div>
            <div class="stat-change positive"><i class="fa fa-exchange-alt"></i> Live Rate</div>
          </div>
        `).join('')}
      </div>
      <div class="card">
        <div class="card-header">
          <div class="card-title"><i class="fa fa-exchange-alt"></i> Currency Rates (Base: USD)</div>
          <div style="display:flex;gap:8px;align-items:center">
            <input type="number" id="fx-amount" placeholder="Amount" value="1" class="form-control" style="width:100px"/>
            <select id="fx-from" class="form-select" style="width:100px">
              ${major.map(c => `<option value="${c}">${c}</option>`).join('')}
            </select>
            <span class="text-muted">→ USD</span>
          </div>
        </div>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Currency</th><th>Rate (per USD)</th><th>Inverse</th><th>Trend</th></tr></thead>
            <tbody>
              ${major.map(c => {
                const r = rates[c];
                if (!r) return '';
                return `<tr>
                  <td class="font-semibold">${c}</td>
                  <td class="mono font-bold">${r.toFixed(c==='JPY'?4:c==='KRW'?2:6)}</td>
                  <td class="mono text-muted text-sm">${(1/r).toFixed(6)}</td>
                  <td>${svgSparkline(generateSparkline(14, r, 0.003))}</td>
                </tr>`;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
    // FX converter
    document.getElementById('fx-amount').addEventListener('input', updateConvert);
    document.getElementById('fx-from').addEventListener('change', updateConvert);
    function updateConvert() {
      const amt = parseFloat(document.getElementById('fx-amount').value) || 1;
      const from = document.getElementById('fx-from').value;
      const r = rates[from];
      if (r) toast(`${amt} USD = ${(amt * r).toFixed(4)} ${from}`, 'info', 3000);
    }
  } catch {
    el.innerHTML = `<div class="error-box"><i class="fa fa-exclamation-circle"></i> Could not load live forex data. Please check your internet connection.</div>`;
  }
}

function renderCommoditiesTab(el) {
  import('../api.js').then(({ commodityAPI }) => {
    const commodities = commodityAPI.getCommodities();
    const cats = [...new Set(commodities.map(c => c.category))];
    el.innerHTML = cats.map(cat => `
      <div class="mb-4">
        <h3 class="section-title"><i class="fa fa-cube"></i> ${cat}</h3>
        <div class="grid grid-3">
          ${commodities.filter(c => c.category === cat).map(c => `
            <div class="stat-card card-hover">
              <div class="stat-icon" style="background:rgba(99,102,241,0.12);color:var(--brand-primary)">${c.icon}</div>
              <div class="stat-label">${c.name} <span class="text-xs text-muted">(${c.unit})</span></div>
              <div class="stat-value mono" style="font-size:1.2rem">${formatCurrency(c.price)}</div>
              <div class="stat-change ${c.change >= 0 ? 'positive' : 'negative'}">
                <i class="fa fa-arrow-${c.change >= 0 ? 'up' : 'down'}"></i>
                ${formatPct(c.changePct)}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `).join('');
  });
}

function renderSectorsTab(el) {
  const sectors = demoData.sectors;
  el.innerHTML = `
    <div class="grid grid-2 mb-4">
      <div class="card">
        <div class="card-header"><div class="card-title"><i class="fa fa-chart-bar"></i> Sector Performance Today</div></div>
        <div class="card-body"><canvas id="sectors-bar-chart" height="300"></canvas></div>
      </div>
      <div class="card">
        <div class="card-header"><div class="card-title"><i class="fa fa-pie-chart"></i> Sector Allocation</div></div>
        <div class="card-body"><canvas id="sectors-pie-chart" height="300"></canvas></div>
      </div>
    </div>
    <div class="sector-grid">
      ${sectors.map(s => {
        const isUp = s.change >= 0;
        const bg = isUp ? 'rgba(34,197,94,' : 'rgba(239,68,68,';
        const intensity = Math.min(Math.abs(s.change) / 3, 1);
        return `<div class="sector-cell" style="background:${bg}${0.08 + intensity*0.22})">
          <div style="font-size:1.5rem">${s.icon}</div>
          <div class="sector-name">${s.name}</div>
          <div class="sector-change ${colorClass(s.change)}">${formatPct(s.change)}</div>
          <div class="text-xs text-muted">YTD: ${formatPct(s.ytd)}</div>
        </div>`;
      }).join('')}
    </div>
  `;

  setTimeout(() => {
    const barCanvas = document.getElementById('sectors-bar-chart');
    if (barCanvas) {
      new Chart(barCanvas, {
        type: 'bar',
        data: {
          labels: sectors.map(s => s.name),
          datasets: [{
            data: sectors.map(s => s.change),
            backgroundColor: sectors.map(s => s.change >= 0 ? 'rgba(34,197,94,0.8)' : 'rgba(239,68,68,0.8)'),
            borderRadius: 6
          }]
        },
        options: {
          responsive: true, maintainAspectRatio: false, indexAxis: 'y',
          plugins: { legend: { display: false }, tooltip: { callbacks: { label: c => ` ${c.raw >= 0 ? '+' : ''}${c.raw.toFixed(2)}%` } } },
          scales: { x: { ticks: { color: '#64748b', callback: v => `${v}%` }, grid: { color: 'rgba(255,255,255,0.04)' } }, y: { ticks: { color: '#94a3b8' }, grid: { display: false } } }
        }
      });
    }
    const pieCanvas = document.getElementById('sectors-pie-chart');
    if (pieCanvas) {
      new Chart(pieCanvas, {
        type: 'doughnut',
        data: {
          labels: sectors.map(s => s.name),
          datasets: [{ data: sectors.map(() => Math.floor(Math.random() * 15) + 3), backgroundColor: sectors.map(s => s.color + 'cc'), borderWidth: 0, hoverOffset: 4 }]
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: { legend: { position: 'right', labels: { color: '#94a3b8', boxWidth: 10, font: { size: 10 } } } }
        }
      });
    }
  }, 100);
}

// ---- STOCKS ----
export function renderStocks(container) {
  const stocks = demoData.stocks;
  let filtered = [...stocks];
  let sortKey = 'mktCap';
  let sortDir = 1;
  let searchQuery = '';

  container.innerHTML = `
    <div class="page-header">
      <div><h1 class="page-title">Stocks</h1><p class="page-subtitle">Equity markets, stock screener, and company data</p></div>
      <div class="page-actions">
        <button class="btn btn-secondary btn-sm" id="stock-export"><i class="fa fa-download"></i> Export CSV</button>
      </div>
    </div>

    <!-- Quick Stats -->
    <div class="grid grid-4 mb-4">
      <div class="stat-card"><div class="stat-icon blue"><i class="fa fa-chart-line"></i></div><div class="stat-label">Gainers Today</div><div class="stat-value">${stocks.filter(s => s.change > 0).length}</div><div class="stat-change positive"><i class="fa fa-arrow-up"></i> Bullish breadth</div></div>
      <div class="stat-card"><div class="stat-icon red"><i class="fa fa-chart-line fa-flip-horizontal"></i></div><div class="stat-label">Losers Today</div><div class="stat-value">${stocks.filter(s => s.change < 0).length}</div><div class="stat-change negative"><i class="fa fa-arrow-down"></i> Bearish pressure</div></div>
      <div class="stat-card"><div class="stat-icon green"><i class="fa fa-crown"></i></div><div class="stat-label">Best Performer</div><div class="stat-value text-sm">${stocks.reduce((b,s)=>s.changePct>b.changePct?s:b,stocks[0]).symbol}</div><div class="stat-change positive"><i class="fa fa-arrow-up"></i> ${formatPct(Math.max(...stocks.map(s=>s.changePct)))}</div></div>
      <div class="stat-card"><div class="stat-icon orange"><i class="fa fa-fire"></i></div><div class="stat-label">Highest Volume</div><div class="stat-value text-sm">${stocks.reduce((b,s)=>parseFloat(s.volume)>parseFloat(b.volume)?s:b,stocks[0]).symbol}</div><div class="stat-change positive"><i class="fa fa-chart-bar"></i> Most active</div></div>
    </div>

    <!-- Screener Controls -->
    <div class="card mb-4">
      <div class="card-body" style="display:flex;gap:12px;flex-wrap:wrap;align-items:center;">
        <div style="flex:1;min-width:180px">
          <input type="text" id="stock-search" class="form-control" placeholder="🔍 Search symbol or company..."/>
        </div>
        <select id="stock-sector" class="form-select" style="width:160px">
          <option value="">All Sectors</option>
          ${[...new Set(stocks.map(s=>s.sector))].map(s=>`<option>${s}</option>`).join('')}
        </select>
        <select id="stock-change-filter" class="form-select" style="width:140px">
          <option value="">All Changes</option>
          <option value="gainers">Gainers Only</option>
          <option value="losers">Losers Only</option>
        </select>
        <button class="btn btn-secondary btn-sm" id="stock-reset"><i class="fa fa-rotate-left"></i> Reset</button>
      </div>
    </div>

    <!-- Stock Table -->
    <div class="card">
      <div class="card-header">
        <div class="card-title"><i class="fa fa-chart-line"></i> Stock Universe <span class="badge badge-purple ml-2" id="stock-count">${stocks.length} stocks</span></div>
      </div>
      <div class="table-wrap">
        <table id="stocks-table">
          <thead>
            <tr>
              <th class="sortable" data-sort="symbol">Symbol</th>
              <th class="sortable" data-sort="name">Company</th>
              <th class="sortable" data-sort="price">Price</th>
              <th class="sortable" data-sort="change">Change</th>
              <th class="sortable" data-sort="changePct">Change %</th>
              <th>Volume</th>
              <th class="sortable" data-sort="mktCap">Mkt Cap</th>
              <th>Sector</th>
              <th>7D Chart</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody id="stocks-tbody"></tbody>
        </table>
      </div>
    </div>
  `;

  function renderTable() {
    const tbody = document.getElementById('stocks-tbody');
    const count = document.getElementById('stock-count');
    if (count) count.textContent = `${filtered.length} stocks`;
    if (!tbody) return;
    tbody.innerHTML = filtered.map(s => `<tr>
      <td><strong class="text-purple">${s.symbol}</strong></td>
      <td class="text-sm">${s.name}</td>
      <td class="mono font-bold">${formatCurrency(s.price)}</td>
      <td class="${colorClass(s.change)} mono">${s.change >= 0 ? '+' : ''}${s.change.toFixed(2)}</td>
      <td><span class="data-pill ${pillClass(s.changePct)}">${formatPct(s.changePct)}</span></td>
      <td class="text-muted text-sm">${s.volume}</td>
      <td class="text-sm">${s.mktCap}</td>
      <td><span class="badge badge-purple">${s.sector}</span></td>
      <td>${svgSparkline(generateSparkline(14, s.price, 0.015))}</td>
      <td>
        <button class="btn btn-sm btn-outline" onclick="watchStock('${s.symbol}','${s.name}')">
          <i class="fa fa-star"></i>
        </button>
      </td>
    </tr>`).join('');
  }

  window.watchStock = (symbol, name) => {
    const added = store.addToWatchlist({ id: symbol, type: 'stock', name, symbol });
    toast(added ? `${symbol} added to watchlist` : `${symbol} already in watchlist`, added ? 'success' : 'info');
  };

  function applyFilters() {
    const q = searchQuery.toLowerCase();
    const sector = document.getElementById('stock-sector')?.value;
    const changeFilter = document.getElementById('stock-change-filter')?.value;
    filtered = stocks.filter(s => {
      if (q && !s.symbol.toLowerCase().includes(q) && !s.name.toLowerCase().includes(q)) return false;
      if (sector && s.sector !== sector) return false;
      if (changeFilter === 'gainers' && s.change <= 0) return false;
      if (changeFilter === 'losers' && s.change >= 0) return false;
      return true;
    });
    filtered.sort((a, b) => {
      const va = parseFloat(a[sortKey]) || 0, vb = parseFloat(b[sortKey]) || 0;
      return (va - vb) * sortDir;
    });
    renderTable();
  }

  document.getElementById('stock-search').addEventListener('input', e => { searchQuery = e.target.value; applyFilters(); });
  document.getElementById('stock-sector').addEventListener('change', applyFilters);
  document.getElementById('stock-change-filter').addEventListener('change', applyFilters);
  document.getElementById('stock-reset').addEventListener('click', () => {
    searchQuery = '';
    document.getElementById('stock-search').value = '';
    document.getElementById('stock-sector').value = '';
    document.getElementById('stock-change-filter').value = '';
    filtered = [...stocks];
    renderTable();
  });

  container.querySelectorAll('th.sortable').forEach(th => {
    th.style.cursor = 'pointer';
    th.addEventListener('click', () => {
      const key = th.dataset.sort;
      if (sortKey === key) sortDir *= -1;
      else { sortKey = key; sortDir = -1; }
      applyFilters();
    });
  });

  document.getElementById('stock-export').addEventListener('click', () => {
    exportCSV(filtered.map(s => ({ Symbol: s.symbol, Company: s.name, Price: s.price, Change: s.change, 'Change%': s.changePct, Volume: s.volume, 'Mkt Cap': s.mktCap, Sector: s.sector })), 'stocks.csv');
    toast('Stocks data exported!', 'success');
  });

  renderTable();
}

// ---- ETFs ----
export function renderETFs(container) {
  const etfs = [
    { symbol: 'SPY', name: 'SPDR S&P 500 ETF', category: 'Large Cap Blend', price: 514.28, change: 2.45, changePct: 0.48, aum: '512B', expRatio: 0.09, holdings: 503, ytd: 8.4, div: 1.35 },
    { symbol: 'QQQ', name: 'Invesco QQQ Trust', category: 'Technology', price: 435.20, change: 3.82, changePct: 0.88, aum: '228B', expRatio: 0.20, holdings: 102, ytd: 12.1, div: 0.52 },
    { symbol: 'VTI', name: 'Vanguard Total Stock Market', category: 'Total Market', price: 242.15, change: 1.20, changePct: 0.50, aum: '378B', expRatio: 0.03, holdings: 3943, ytd: 7.8, div: 1.42 },
    { symbol: 'IWM', name: 'iShares Russell 2000 ETF', category: 'Small Cap', price: 201.35, change: -1.44, changePct: -0.71, aum: '58B', expRatio: 0.19, holdings: 1977, ytd: 2.4, div: 1.21 },
    { symbol: 'GLD', name: 'SPDR Gold Trust', category: 'Commodities', price: 245.80, change: 1.15, changePct: 0.47, aum: '62B', expRatio: 0.40, holdings: 1, ytd: 6.8, div: 0 },
    { symbol: 'BND', name: 'Vanguard Total Bond Market', category: 'Bonds', price: 72.45, change: 0.08, changePct: 0.11, aum: '111B', expRatio: 0.03, holdings: 17628, ytd: -1.2, div: 3.72 },
    { symbol: 'VNQ', name: 'Vanguard Real Estate ETF', category: 'Real Estate', price: 82.30, change: -0.95, changePct: -1.14, aum: '32B', expRatio: 0.12, holdings: 162, ytd: -4.8, div: 4.28 },
    { symbol: 'ARKK', name: 'ARK Innovation ETF', category: 'Thematic', price: 48.20, change: 0.88, changePct: 1.86, aum: '7.2B', expRatio: 0.75, holdings: 29, ytd: 5.2, div: 0 },
    { symbol: 'XLK', name: 'Technology Select SPDR', category: 'Technology', price: 206.45, change: 3.10, changePct: 1.52, aum: '68B', expRatio: 0.10, holdings: 65, ytd: 15.3, div: 0.71 },
    { symbol: 'ICLN', name: 'iShares Global Clean Energy', category: 'Clean Energy', price: 14.82, change: 0.22, changePct: 1.50, aum: '3.1B', expRatio: 0.40, holdings: 100, ytd: -12.4, div: 0.82 },
  ];

  container.innerHTML = `
    <div class="page-header">
      <div><h1 class="page-title">Exchange Traded Funds</h1><p class="page-subtitle">ETFs across all asset classes and strategies</p></div>
    </div>
    <div class="grid grid-4 mb-4">
      <div class="stat-card"><div class="stat-icon blue"><i class="fa fa-layer-group"></i></div><div class="stat-label">Total ETFs Listed</div><div class="stat-value">${etfs.length}</div><div class="stat-change positive">Curated selection</div></div>
      <div class="stat-card"><div class="stat-icon green"><i class="fa fa-arrow-trend-up"></i></div><div class="stat-label">Gainers</div><div class="stat-value">${etfs.filter(e=>e.change>0).length}</div><div class="stat-change positive">Outperforming</div></div>
      <div class="stat-card"><div class="stat-icon orange"><i class="fa fa-percent"></i></div><div class="stat-label">Avg Expense Ratio</div><div class="stat-value">${(etfs.reduce((s,e)=>s+e.expRatio,0)/etfs.length).toFixed(2)}%</div><div class="stat-change positive">Low cost</div></div>
      <div class="stat-card"><div class="stat-icon purple"><i class="fa fa-building-columns"></i></div><div class="stat-label">Total AUM</div><div class="stat-value text-sm">$1.8T+</div><div class="stat-change positive">Major ETFs</div></div>
    </div>
    <div class="card">
      <div class="card-header"><div class="card-title"><i class="fa fa-layer-group"></i> ETF List</div>
        <select id="etf-cat" class="form-select" style="width:160px">
          <option value="">All Categories</option>
          ${[...new Set(etfs.map(e=>e.category))].map(c=>`<option>${c}</option>`).join('')}
        </select>
      </div>
      <div class="table-wrap">
        <table id="etf-table">
          <thead><tr><th>Symbol</th><th>Name</th><th>Category</th><th>Price</th><th>Change %</th><th>AUM</th><th>Exp Ratio</th><th>Holdings</th><th>YTD</th><th>Dividend</th><th>Chart</th></tr></thead>
          <tbody id="etf-tbody">
            ${etfs.map(e => `<tr>
              <td class="font-bold text-purple">${e.symbol}</td>
              <td class="text-sm">${e.name}</td>
              <td><span class="badge badge-info">${e.category}</span></td>
              <td class="mono font-bold">${formatCurrency(e.price)}</td>
              <td><span class="data-pill ${pillClass(e.changePct)}">${formatPct(e.changePct)}</span></td>
              <td class="text-sm">${e.aum}</td>
              <td class="text-sm">${e.expRatio}%</td>
              <td class="text-sm">${e.holdings.toLocaleString()}</td>
              <td><span class="data-pill ${pillClass(e.ytd)}">${formatPct(e.ytd)}</span></td>
              <td class="text-success text-sm">${e.div ? e.div + '%' : '—'}</td>
              <td>${svgSparkline(generateSparkline(14,e.price,0.01))}</td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
  document.getElementById('etf-cat').addEventListener('change', e => {
    const cat = e.target.value;
    document.querySelectorAll('#etf-tbody tr').forEach(tr => {
      tr.style.display = !cat || tr.querySelector('td:nth-child(3)')?.textContent.includes(cat) ? '' : 'none';
    });
  });
}

// ---- MUTUAL FUNDS ----
export function renderMutualFunds(container) {
  const funds = demoData.mutualFunds;
  container.innerHTML = `
    <div class="page-header">
      <div><h1 class="page-title">Mutual Funds</h1><p class="page-subtitle">Top performing mutual funds across global and Indian markets</p></div>
    </div>
    <div class="grid grid-3 mb-4">
      ${funds.slice(0,3).map(f => `
        <div class="card card-hover">
          <div class="card-body">
            <div class="section-title" style="margin-bottom:6px">${f.name}</div>
            <div class="text-xs text-muted mb-3">${f.symbol} · ${f.category}</div>
            <div class="flex justify-between mb-2">
              <span class="text-sm text-muted">NAV</span>
              <span class="mono font-bold">${formatCurrency(f.nav)}</span>
            </div>
            <div class="flex justify-between mb-2">
              <span class="text-sm text-muted">1Y Returns</span>
              <span class="data-pill pill-up">+${f.oneYear}%</span>
            </div>
            <div class="flex justify-between mb-2">
              <span class="text-sm text-muted">3Y Returns</span>
              <span class="data-pill pill-up">+${f.threeYear}%</span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm text-muted">Expense Ratio</span>
              <span class="text-sm text-warning">${f.expRatio}%</span>
            </div>
            <div class="progress mt-3" style="height:4px">
              <div class="progress-bar primary" style="width:${Math.min(f.oneYear/40*100,100)}%"></div>
            </div>
            <div class="mt-2 flex" style="gap:4px">
              ${[...Array(f.rating)].map(()=>'⭐').join('')}
            </div>
          </div>
        </div>
      `).join('')}
    </div>
    <div class="card">
      <div class="card-header"><div class="card-title"><i class="fa fa-building-columns"></i> All Mutual Funds</div></div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Fund</th><th>Category</th><th>NAV</th><th>1D</th><th>1Y Return</th><th>3Y Return</th><th>5Y Return</th><th>Exp Ratio</th><th>Rating</th></tr></thead>
          <tbody>
            ${funds.map(f => `<tr>
              <td><div class="font-semibold text-sm">${f.name}</div><div class="text-xs text-muted">${f.symbol}</div></td>
              <td><span class="badge badge-purple">${f.category}</span></td>
              <td class="mono font-bold">${formatCurrency(f.nav)}</td>
              <td><span class="data-pill ${pillClass(f.oneDay)}">${formatPct(f.oneDay)}</span></td>
              <td class="text-success font-semibold">+${f.oneYear}%</td>
              <td class="text-success font-semibold">+${f.threeYear}%</td>
              <td class="text-success font-semibold">+${f.fiveYear}%</td>
              <td class="text-warning text-sm">${f.expRatio}%</td>
              <td>${[...Array(f.rating)].map(()=>'⭐').join('')}</td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// ---- TOP GAINERS/LOSERS ----
export function renderTopGainers(container) {
  const stocks = demoData.stocks.sort((a,b) => b.changePct - a.changePct);
  renderGainersLosers(container, stocks.slice(0,10), 'Top Gainers', 'arrow-trend-up', true);
}

export function renderTopLosers(container) {
  const stocks = demoData.stocks.sort((a,b) => a.changePct - b.changePct);
  renderGainersLosers(container, stocks.slice(0,10), 'Top Losers', 'arrow-trend-down', false);
}

function renderGainersLosers(container, stocks, title, icon, isGainer) {
  container.innerHTML = `
    <div class="page-header">
      <div><h1 class="page-title"><i class="fa fa-${icon} ${isGainer ? 'text-success' : 'text-danger'}"></i> ${title}</h1><p class="page-subtitle">Today's biggest movers</p></div>
    </div>
    <div class="grid grid-3 mb-4">
      ${stocks.slice(0,3).map(s => `
        <div class="stat-card" style="border-top-color:${isGainer?'var(--brand-accent)':'var(--brand-danger)'}">
          <div class="stat-label">${s.symbol} — ${s.name}</div>
          <div class="stat-value mono">${formatCurrency(s.price)}</div>
          <div class="stat-change ${isGainer?'positive':'negative'}"><i class="fa fa-arrow-${isGainer?'up':'down'}"></i> ${formatPct(s.changePct)}</div>
          <div style="margin-top:8px">${svgSparkline(generateSparkline(14,s.price,0.02))}</div>
        </div>
      `).join('')}
    </div>
    <div class="card">
      <div class="table-wrap">
        <table>
          <thead><tr><th>Rank</th><th>Symbol</th><th>Company</th><th>Price</th><th>Change</th><th>Change %</th><th>Volume</th><th>Sector</th><th>Chart</th></tr></thead>
          <tbody>
            ${stocks.map((s,i) => `<tr>
              <td class="text-muted font-bold">#${i+1}</td>
              <td class="font-bold ${isGainer?'text-success':'text-danger'}">${s.symbol}</td>
              <td class="text-sm">${s.name}</td>
              <td class="mono font-bold">${formatCurrency(s.price)}</td>
              <td class="${colorClass(s.change)} mono">${s.change>=0?'+':''}${s.change.toFixed(2)}</td>
              <td><span class="data-pill ${pillClass(s.changePct)}">${formatPct(s.changePct)}</span></td>
              <td class="text-muted text-sm">${s.volume}</td>
              <td><span class="badge badge-purple">${s.sector}</span></td>
              <td>${svgSparkline(generateSparkline(14,s.price,0.02))}</td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// ---- HEATMAP ----
export function renderHeatmap(container) {
  const stocks = demoData.stocks;
  container.innerHTML = `
    <div class="page-header">
      <div><h1 class="page-title">Market Heatmap</h1><p class="page-subtitle">Visual representation of market performance by change %</p></div>
      <div class="page-actions">
        <select id="heatmap-by" class="form-select">
          <option value="day">1 Day</option>
          <option value="week">1 Week</option>
        </select>
      </div>
    </div>
    <div class="card mb-4">
      <div class="card-body">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px;font-size:0.8rem;color:var(--text-muted)">
          <span style="display:flex;align-items:center;gap:4px"><span style="width:16px;height:16px;background:rgba(34,197,94,0.5);border-radius:3px;display:inline-block"></span>+2%+</span>
          <span style="display:flex;align-items:center;gap:4px"><span style="width:16px;height:16px;background:rgba(34,197,94,0.2);border-radius:3px;display:inline-block"></span>0-2%</span>
          <span style="display:flex;align-items:center;gap:4px"><span style="width:16px;height:16px;background:rgba(148,163,184,0.12);border-radius:3px;display:inline-block"></span>~0%</span>
          <span style="display:flex;align-items:center;gap:4px"><span style="width:16px;height:16px;background:rgba(239,68,68,0.2);border-radius:3px;display:inline-block"></span>0 to -2%</span>
          <span style="display:flex;align-items:center;gap:4px"><span style="width:16px;height:16px;background:rgba(239,68,68,0.45);border-radius:3px;display:inline-block"></span>-2%+</span>
        </div>
        <div class="heatmap-grid" style="grid-template-columns:repeat(auto-fill,minmax(100px,1fr))">
          ${stocks.map(s => {
            const pct = s.changePct;
            let cls = 'heat-neutral';
            if (pct > 2) cls = 'heat-strong-up';
            else if (pct > 0) cls = 'heat-up';
            else if (pct < -2) cls = 'heat-strong-down';
            else if (pct < 0) cls = 'heat-down';
            return `<div class="heatmap-cell ${cls}" title="${s.name}: ${formatPct(pct)}">
              <div style="font-weight:800;font-size:0.85rem">${s.symbol}</div>
              <div style="font-size:0.75rem">${formatPct(pct)}</div>
              <div style="font-size:0.7rem;opacity:0.7">${formatCurrency(s.price)}</div>
            </div>`;
          }).join('')}
        </div>
      </div>
    </div>
    <div class="grid grid-2">
      <div class="card">
        <div class="card-header"><div class="card-title"><i class="fa fa-th"></i> Sector Heatmap</div></div>
        <div class="card-body">
          <div class="heatmap-grid" style="grid-template-columns:repeat(3,1fr)">
            ${demoData.sectors.map(s => {
              const pct = s.change;
              let cls = 'heat-neutral';
              if (pct > 1.5) cls = 'heat-strong-up';
              else if (pct > 0) cls = 'heat-up';
              else if (pct < -1.5) cls = 'heat-strong-down';
              else if (pct < 0) cls = 'heat-down';
              return `<div class="heatmap-cell ${cls}" style="padding:14px">
                <div style="font-size:1.2rem">${s.icon}</div>
                <div style="font-weight:700;font-size:0.78rem">${s.name}</div>
                <div style="font-weight:800;font-size:0.9rem">${formatPct(pct)}</div>
              </div>`;
            }).join('')}
          </div>
        </div>
      </div>
      <div class="card">
        <div class="card-header"><div class="card-title"><i class="fa fa-info-circle"></i> Market Breadth</div></div>
        <div class="card-body">
          ${(() => {
            const up = stocks.filter(s=>s.change>0).length;
            const dn = stocks.filter(s=>s.change<0).length;
            const flat = stocks.length - up - dn;
            const upPct = (up/stocks.length*100).toFixed(0);
            const dnPct = (dn/stocks.length*100).toFixed(0);
            return `
              <div class="mb-4">
                <div class="flex justify-between mb-1 text-sm"><span>Advancing</span><span class="text-success font-bold">${up} (${upPct}%)</span></div>
                <div class="progress"><div class="progress-bar success" style="width:${upPct}%"></div></div>
              </div>
              <div class="mb-4">
                <div class="flex justify-between mb-1 text-sm"><span>Declining</span><span class="text-danger font-bold">${dn} (${dnPct}%)</span></div>
                <div class="progress"><div class="progress-bar danger" style="width:${dnPct}%"></div></div>
              </div>
              <div class="mb-4">
                <div class="flex justify-between mb-1 text-sm"><span>Unchanged</span><span class="text-muted font-bold">${flat}</span></div>
                <div class="progress"><div class="progress-bar" style="width:${(flat/stocks.length*100).toFixed(0)}%;background:var(--text-muted)"></div></div>
              </div>
              <div class="stat-card mt-4" style="padding:12px">
                <div class="text-xs text-muted">Advance/Decline Ratio</div>
                <div class="stat-value mono" style="font-size:1.2rem">${(up/dn).toFixed(2)}</div>
                <div class="stat-change ${up>dn?'positive':'negative'}">${up>dn?'Bullish breadth':'Bearish breadth'}</div>
              </div>
            `;
          })()}
        </div>
      </div>
    </div>
  `;
}

// ---- SECTOR PERFORMANCE ----
export function renderSectorPerformance(container) {
  renderSectorsTab(container);
  // Override the container content with a page header first
  const pageHeader = `<div class="page-header">
    <div><h1 class="page-title">Sector Performance</h1><p class="page-subtitle">Performance breakdown by market sector</p></div>
  </div>`;
  container.innerHTML = pageHeader;
  const inner = document.createElement('div');
  container.appendChild(inner);
  renderSectorsTab(inner);
}
