// =====================================================
// WealthOS AI — Portfolio & Watchlist Pages
// =====================================================
import { formatCurrency, formatPct, formatCompact, colorClass, pillClass, svgSparkline, generateSparkline, toast, uid, exportCSV } from '../utils.js';
import { store } from '../store.js';
import { cryptoAPI, demoData } from '../api.js';

// ---- PORTFOLIO ----
export function renderPortfolio(container) {
  let prices = {};

  container.innerHTML = `
    <div class="page-header">
      <div><h1 class="page-title"><i class="fa fa-briefcase text-purple"></i> Portfolio</h1>
      <p class="page-subtitle">Track your investments and total performance</p></div>
      <div class="page-actions">
        <button class="btn btn-secondary btn-sm" id="port-export"><i class="fa fa-download"></i> Export</button>
        <button class="btn btn-primary btn-sm" id="port-add"><i class="fa fa-plus"></i> Add Position</button>
      </div>
    </div>
    <div id="port-stats" class="grid grid-4 mb-4">
      <div class="skeleton skeleton-card" style="height:100px"></div>
      <div class="skeleton skeleton-card" style="height:100px"></div>
      <div class="skeleton skeleton-card" style="height:100px"></div>
      <div class="skeleton skeleton-card" style="height:100px"></div>
    </div>
    <div class="grid grid-2 mb-4">
      <div class="card">
        <div class="card-header"><div class="card-title"><i class="fa fa-chart-pie"></i> Asset Allocation</div></div>
        <div class="card-body"><canvas id="alloc-chart" height="220"></canvas></div>
      </div>
      <div class="card">
        <div class="card-header"><div class="card-title"><i class="fa fa-chart-line"></i> Performance Over Time</div></div>
        <div class="card-body"><canvas id="perf-chart" height="220"></canvas></div>
      </div>
    </div>
    <div class="card" id="port-table-card">
      <div class="card-header">
        <div class="card-title"><i class="fa fa-list"></i> Holdings</div>
        <div style="display:flex;gap:8px">
          <input type="text" id="port-search" class="form-control" placeholder="Search..." style="width:160px"/>
        </div>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr><th>Asset</th><th>Type</th><th>Qty</th><th>Avg Price</th><th>Current Price</th><th>P&L</th><th>P&L %</th><th>Value</th><th>Allocation</th><th>Action</th></tr>
          </thead>
          <tbody id="port-tbody"></tbody>
        </table>
      </div>
      <div id="port-empty" class="empty-state hidden">
        <i class="fa fa-briefcase"></i>
        <p>No positions yet.<br>Click "Add Position" to get started.</p>
        <button class="btn btn-primary mt-3" id="port-add-2"><i class="fa fa-plus"></i> Add Position</button>
      </div>
    </div>
  `;

  function getDemoPortfolio() {
    return [
      { id: uid('p'), symbol: 'BTC', name: 'Bitcoin', type: 'crypto', qty: 0.5, avgPrice: 42000, icon: '₿' },
      { id: uid('p'), symbol: 'ETH', name: 'Ethereum', type: 'crypto', qty: 3, avgPrice: 2800, icon: 'Ξ' },
      { id: uid('p'), symbol: 'AAPL', name: 'Apple Inc.', type: 'stock', qty: 10, avgPrice: 175, icon: '' },
      { id: uid('p'), symbol: 'NVDA', name: 'NVIDIA Corp.', type: 'stock', qty: 5, avgPrice: 650, icon: '' },
      { id: uid('p'), symbol: 'SOL', name: 'Solana', type: 'crypto', qty: 20, avgPrice: 120, icon: '◎' },
    ];
  }

  let portfolio = store.get('portfolio');
  if (!portfolio.length) {
    // Seed demo data
    portfolio = getDemoPortfolio();
    store.set('portfolio', portfolio);
  }

  async function loadPrices() {
    try {
      const cryptoItems = portfolio.filter(p => p.type === 'crypto').map(p => {
        const nameToId = { BTC: 'bitcoin', ETH: 'ethereum', SOL: 'solana', BNB: 'binancecoin', ADA: 'cardano', DOT: 'polkadot', DOGE: 'dogecoin', AVAX: 'avalanche-2' };
        return nameToId[p.symbol] || p.symbol.toLowerCase();
      });
      if (cryptoItems.length) {
        const cpData = await cryptoAPI.getPrices(cryptoItems);
        const nameToId = { BTC: 'bitcoin', ETH: 'ethereum', SOL: 'solana', BNB: 'binancecoin', ADA: 'cardano', DOT: 'polkadot', DOGE: 'dogecoin', AVAX: 'avalanche-2' };
        portfolio.filter(p=>p.type==='crypto').forEach(p => {
          const cid = nameToId[p.symbol] || p.symbol.toLowerCase();
          if (cpData[cid]) prices[p.symbol] = cpData[cid].usd;
        });
      }
    } catch {}

    // Stock prices from demo
    portfolio.filter(p=>p.type==='stock').forEach(p => {
      const s = demoData.stocks.find(s=>s.symbol===p.symbol);
      if (s) prices[p.symbol] = s.price;
      else prices[p.symbol] = p.avgPrice * (1 + (Math.random()*0.2-0.05));
    });

    render();
  }

  function render() {
    const totalCost = portfolio.reduce((s,p)=>s+p.avgPrice*p.qty, 0);
    const totalValue = portfolio.reduce((s,p)=>s+(prices[p.symbol]||p.avgPrice)*p.qty, 0);
    const totalPnl = totalValue - totalCost;
    const totalPnlPct = totalCost ? (totalPnl/totalCost*100) : 0;
    const dayChange = totalValue * 0.012; // approximation

    document.getElementById('port-stats').innerHTML = `
      <div class="stat-card"><div class="stat-icon green"><i class="fa fa-wallet"></i></div>
        <div class="stat-label">Total Portfolio Value</div>
        <div class="stat-value" style="font-size:1.3rem">${formatCurrency(totalValue)}</div>
        <div class="stat-change positive"><i class="fa fa-info-circle"></i> ${portfolio.length} positions</div>
      </div>
      <div class="stat-card"><div class="stat-icon ${totalPnl>=0?'green':'red'}"><i class="fa fa-chart-line"></i></div>
        <div class="stat-label">Total P&L</div>
        <div class="stat-value ${colorClass(totalPnl)}" style="font-size:1.3rem">${totalPnl>=0?'+':''}${formatCurrency(totalPnl)}</div>
        <div class="stat-change ${totalPnlPct>=0?'positive':'negative'}">
          <i class="fa fa-arrow-${totalPnlPct>=0?'up':'down'}"></i> ${formatPct(totalPnlPct)} overall
        </div>
      </div>
      <div class="stat-card"><div class="stat-icon blue"><i class="fa fa-calendar-day"></i></div>
        <div class="stat-label">Today's Change</div>
        <div class="stat-value ${colorClass(dayChange)}" style="font-size:1.3rem">+${formatCurrency(dayChange)}</div>
        <div class="stat-change positive"><i class="fa fa-arrow-up"></i> +1.2% today</div>
      </div>
      <div class="stat-card"><div class="stat-icon orange"><i class="fa fa-coins"></i></div>
        <div class="stat-label">Total Invested</div>
        <div class="stat-value" style="font-size:1.3rem">${formatCurrency(totalCost)}</div>
        <div class="stat-change positive"><i class="fa fa-layer-group"></i> Cost basis</div>
      </div>
    `;

    // Allocation chart
    const aCanvas = document.getElementById('alloc-chart');
    if (aCanvas) {
      const existing = Chart.getChart(aCanvas);
      if (existing) existing.destroy();
      const colors = ['#6366f1','#22c55e','#f59e0b','#ef4444','#3b82f6','#8b5cf6','#14b8a6','#ec4899'];
      new Chart(aCanvas, {
        type: 'doughnut',
        data: {
          labels: portfolio.map(p=>p.symbol),
          datasets: [{
            data: portfolio.map(p=>(prices[p.symbol]||p.avgPrice)*p.qty),
            backgroundColor: portfolio.map((_,i)=>colors[i%colors.length]+'cc'),
            borderWidth: 0, hoverOffset: 6
          }]
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: {
            legend: { position: 'right', labels: { color: '#94a3b8', boxWidth: 10, font: { size: 11 } } },
            tooltip: { callbacks: { label: c => ` ${c.label}: ${formatCurrency(c.parsed)} (${(c.parsed/totalValue*100).toFixed(1)}%)` } }
          }
        }
      });
    }

    // Performance chart
    const pCanvas = document.getElementById('perf-chart');
    if (pCanvas) {
      const existing = Chart.getChart(pCanvas);
      if (existing) existing.destroy();
      const days = 30;
      const perfData = generateSparkline(days, totalCost, 0.01);
      perfData[days-1] = totalValue;
      const labels = Array.from({length:days},(_,i) => {
        const d = new Date(); d.setDate(d.getDate()-days+i+1);
        return d.toLocaleDateString('en',{month:'short',day:'numeric'});
      });
      new Chart(pCanvas, {
        type: 'line',
        data: {
          labels,
          datasets: [
            { label: 'Portfolio Value', data: perfData, borderColor: '#6366f1', backgroundColor: 'rgba(99,102,241,0.08)', borderWidth: 2, pointRadius: 0, fill: true, tension: 0.4 },
            { label: 'Cost Basis', data: Array(days).fill(totalCost), borderColor: '#64748b', borderDash: [5,5], borderWidth: 1.5, pointRadius: 0, fill: false },
          ]
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          interaction: { mode: 'index', intersect: false },
          plugins: { legend: { labels: { color: '#94a3b8', boxWidth: 10, font: { size: 11 } } }, tooltip: { backgroundColor: 'rgba(18,18,31,0.95)', borderColor: 'rgba(255,255,255,0.08)', borderWidth: 1, callbacks: { label: c => ` ${c.dataset.label}: ${formatCurrency(c.raw)}` } } },
          scales: { x: { ticks: { color: '#64748b', font: { size: 9 }, maxTicksLimit: 8 }, grid: { color: 'rgba(255,255,255,0.04)' } }, y: { ticks: { color: '#64748b', font: { size: 10 }, callback: v => '$'+formatCompact(v) }, grid: { color: 'rgba(255,255,255,0.04)' } } }
        }
      });
    }

    // Table
    const tbody = document.getElementById('port-tbody');
    const emptyEl = document.getElementById('port-empty');
    if (!portfolio.length) {
      tbody.innerHTML = '';
      emptyEl?.classList.remove('hidden');
      return;
    }
    emptyEl?.classList.add('hidden');

    tbody.innerHTML = portfolio.map(p => {
      const cp = prices[p.symbol] || p.avgPrice;
      const value = cp * p.qty;
      const pnl = (cp - p.avgPrice) * p.qty;
      const pnlPct = ((cp - p.avgPrice) / p.avgPrice) * 100;
      const alloc = (value / totalValue * 100).toFixed(1);
      return `<tr>
        <td>
          <div class="flex items-center gap-2">
            <div style="width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,var(--brand-primary),var(--brand-secondary));display:flex;align-items:center;justify-content:center;font-size:0.8rem;font-weight:700;color:white;">${p.symbol.slice(0,2)}</div>
            <div><div class="font-bold">${p.symbol}</div><div class="text-xs text-muted">${p.name}</div></div>
          </div>
        </td>
        <td><span class="badge ${p.type==='crypto'?'badge-warning':'badge-info'}">${p.type}</span></td>
        <td class="mono">${p.qty}</td>
        <td class="mono">${formatCurrency(p.avgPrice)}</td>
        <td class="mono font-bold">${formatCurrency(cp)}</td>
        <td class="${colorClass(pnl)} mono font-bold">${pnl>=0?'+':''}${formatCurrency(pnl)}</td>
        <td><span class="data-pill ${pillClass(pnlPct)}">${formatPct(pnlPct)}</span></td>
        <td class="mono font-bold">${formatCurrency(value)}</td>
        <td>
          <div style="display:flex;flex-direction:column;gap:3px">
            <div class="text-sm">${alloc}%</div>
            <div class="progress" style="height:4px;width:60px"><div class="progress-bar primary" style="width:${alloc}%"></div></div>
          </div>
        </td>
        <td>
          <button class="btn btn-sm btn-outline text-danger" onclick="deletePosition('${p.id}')"><i class="fa fa-trash"></i></button>
        </td>
      </tr>`;
    }).join('');
  }

  window.deletePosition = (id) => {
    store.removePosition(id);
    portfolio = store.get('portfolio');
    render();
    toast('Position removed', 'info');
  };

  // Add position modal
  function showAddModal() {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
      <div class="modal">
        <div class="modal-header">
          <h3 class="modal-title"><i class="fa fa-plus text-purple"></i> Add Position</h3>
          <button class="modal-close btn" id="close-add-modal"><i class="fa fa-times"></i></button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label class="form-label">Asset Type</label>
            <select id="pos-type" class="form-select">
              <option value="stock">Stock</option>
              <option value="crypto">Cryptocurrency</option>
              <option value="etf">ETF</option>
              <option value="fund">Mutual Fund</option>
            </select>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Symbol</label>
              <input type="text" id="pos-symbol" class="form-control" placeholder="e.g. AAPL, BTC" />
            </div>
            <div class="form-group">
              <label class="form-label">Name</label>
              <input type="text" id="pos-name" class="form-control" placeholder="e.g. Apple Inc." />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Quantity</label>
              <input type="number" id="pos-qty" class="form-control" placeholder="0.00" step="any" min="0"/>
            </div>
            <div class="form-group">
              <label class="form-label">Avg. Buy Price ($)</label>
              <input type="number" id="pos-price" class="form-control" placeholder="0.00" step="any" min="0"/>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Purchase Date</label>
            <input type="date" id="pos-date" class="form-control" value="${new Date().toISOString().split('T')[0]}"/>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" id="cancel-add-modal">Cancel</button>
          <button class="btn btn-primary" id="confirm-add-modal"><i class="fa fa-plus"></i> Add Position</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    document.getElementById('close-add-modal').onclick = () => overlay.remove();
    document.getElementById('cancel-add-modal').onclick = () => overlay.remove();
    overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
    document.getElementById('confirm-add-modal').onclick = () => {
      const sym = document.getElementById('pos-symbol').value.trim().toUpperCase();
      const name = document.getElementById('pos-name').value.trim();
      const qty = parseFloat(document.getElementById('pos-qty').value);
      const price = parseFloat(document.getElementById('pos-price').value);
      const type = document.getElementById('pos-type').value;
      const date = document.getElementById('pos-date').value;
      if (!sym || !qty || !price) { toast('Please fill all required fields', 'warning'); return; }
      store.addPosition({ id: uid('p'), symbol: sym, name: name || sym, type, qty, avgPrice: price, purchaseDate: date });
      portfolio = store.get('portfolio');
      loadPrices();
      overlay.remove();
      toast(`${sym} added to portfolio!`, 'success');
    };
  }

  document.getElementById('port-add').onclick = showAddModal;
  document.getElementById('port-add-2')?.addEventListener('click', showAddModal);
  document.getElementById('port-export').onclick = () => {
    const portfolio = store.get('portfolio');
    exportCSV(portfolio.map(p=>({ Symbol: p.symbol, Name: p.name, Type: p.type, Qty: p.qty, 'Avg Price': p.avgPrice, 'Current Price': prices[p.symbol]||p.avgPrice })), 'portfolio.csv');
    toast('Portfolio exported!', 'success');
  };

  // Search
  document.getElementById('port-search')?.addEventListener('input', e => {
    const q = e.target.value.toLowerCase();
    document.querySelectorAll('#port-tbody tr').forEach(tr => {
      tr.style.display = tr.textContent.toLowerCase().includes(q) ? '' : 'none';
    });
  });

  loadPrices();
}

// ---- WATCHLIST ----
export function renderWatchlist(container) {
  let watchlist = store.get('watchlist');

  container.innerHTML = `
    <div class="page-header">
      <div><h1 class="page-title"><i class="fa fa-star text-warning"></i> Watchlist</h1>
      <p class="page-subtitle">Monitor your favorite assets</p></div>
      <div class="page-actions">
        <button class="btn btn-primary btn-sm" id="wl-add"><i class="fa fa-plus"></i> Add Asset</button>
      </div>
    </div>
    <div id="wl-content"></div>
  `;

  async function loadWatchlistPrices() {
    watchlist = store.get('watchlist');
    const el = document.getElementById('wl-content');
    if (!watchlist.length) {
      el.innerHTML = `
        <div class="card"><div class="empty-state">
          <i class="fa fa-star" style="color:var(--brand-warning)"></i>
          <p>Your watchlist is empty.</p>
          <p class="text-sm text-muted mt-2">Add stocks, crypto, or ETFs to track their performance.</p>
          <button class="btn btn-primary mt-4" id="wl-add-empty"><i class="fa fa-plus"></i> Add Your First Asset</button>
        </div></div>
      `;
      document.getElementById('wl-add-empty')?.addEventListener('click', showAddModal);
      return;
    }

    // Fetch live prices for crypto
    let liveData = {};
    try {
      const cryptoItems = watchlist.filter(w=>w.type==='crypto');
      if (cryptoItems.length) {
        const ids = cryptoItems.map(c=>c.id);
        const data = await cryptoAPI.getPrices(ids);
        liveData = data;
      }
    } catch {}

    // Mock prices for stocks
    watchlist.filter(w=>w.type==='stock').forEach(w => {
      const s = demoData.stocks.find(s=>s.symbol===w.symbol);
      if (s) liveData[w.id] = { usd: s.price, usd_24h_change: s.changePct };
    });

    el.innerHTML = `
      <div class="grid grid-auto mb-4">
        ${watchlist.map(item => {
          const price = item.type === 'crypto' ? liveData[item.id]?.usd : liveData[item.id]?.usd;
          const change24h = item.type === 'crypto' ? liveData[item.id]?.usd_24h_change : (liveData[item.id]?.usd_24h_change || (Math.random()*6-2));
          const sparkData = generateSparkline(14, price || 100, 0.02);
          return `
            <div class="card card-hover" style="position:relative;overflow:hidden">
              <div style="position:absolute;top:0;left:0;right:0;height:2px;background:${change24h>=0?'var(--brand-accent)':'var(--brand-danger)'}"></div>
              <div class="card-body">
                <div class="flex justify-between mb-2">
                  <div>
                    <div class="font-bold text-lg">${item.symbol}</div>
                    <div class="text-xs text-muted">${item.name}</div>
                  </div>
                  <div style="text-align:right">
                    <span class="badge ${item.type==='crypto'?'badge-warning':'badge-info'}">${item.type}</span>
                    <button class="btn btn-sm text-danger" style="padding:2px 6px" onclick="removeFromWL('${item.id}')"><i class="fa fa-trash"></i></button>
                  </div>
                </div>
                <div class="mb-2">${svgSparkline(sparkData, 120, 36)}</div>
                <div class="font-bold mono text-lg">${price ? formatCurrency(price) : '—'}</div>
                <div class="${colorClass(change24h||0)} text-sm font-semibold">
                  ${formatPct(change24h||0)} today
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
      <div class="card">
        <div class="card-header"><div class="card-title"><i class="fa fa-table"></i> Watchlist Table</div></div>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Asset</th><th>Type</th><th>Price</th><th>24h Change</th><th>7D Chart</th><th>Action</th></tr></thead>
            <tbody>
              ${watchlist.map(item => {
                const price = item.type === 'crypto' ? liveData[item.id]?.usd : liveData[item.id]?.usd;
                const change24h = item.type === 'crypto' ? liveData[item.id]?.usd_24h_change : (Math.random()*6-2);
                return `<tr>
                  <td><div class="font-bold">${item.symbol}</div><div class="text-xs text-muted">${item.name}</div></td>
                  <td><span class="badge ${item.type==='crypto'?'badge-warning':'badge-info'}">${item.type}</span></td>
                  <td class="mono font-bold">${price ? formatCurrency(price) : '—'}</td>
                  <td><span class="data-pill ${pillClass(change24h||0)}">${formatPct(change24h||0)}</span></td>
                  <td>${svgSparkline(generateSparkline(14, price||100, 0.02))}</td>
                  <td><button class="btn btn-sm btn-outline text-danger" onclick="removeFromWL('${item.id}')"><i class="fa fa-trash"></i> Remove</button></td>
                </tr>`;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  window.removeFromWL = (id) => {
    store.removeFromWatchlist(id);
    toast('Removed from watchlist', 'info');
    loadWatchlistPrices();
  };

  function showAddModal() {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
      <div class="modal">
        <div class="modal-header">
          <h3 class="modal-title"><i class="fa fa-star text-warning"></i> Add to Watchlist</h3>
          <button class="modal-close btn" id="close-wl-modal"><i class="fa fa-times"></i></button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label class="form-label">Type</label>
            <select id="wl-type" class="form-select">
              <option value="stock">Stock</option>
              <option value="crypto">Cryptocurrency</option>
              <option value="etf">ETF</option>
            </select>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Symbol</label>
              <input type="text" id="wl-symbol" class="form-control" placeholder="e.g. TSLA, ethereum"/>
            </div>
            <div class="form-group">
              <label class="form-label">Name</label>
              <input type="text" id="wl-name" class="form-control" placeholder="e.g. Tesla Inc."/>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">ID (for crypto, use CoinGecko ID)</label>
            <input type="text" id="wl-id" class="form-control" placeholder="e.g. bitcoin, ethereum, solana"/>
            <div class="form-hint">For stocks, ID = Symbol. For crypto, use the CoinGecko ID (lowercase).</div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" id="cancel-wl-modal">Cancel</button>
          <button class="btn btn-primary" id="confirm-wl-modal"><i class="fa fa-star"></i> Add to Watchlist</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    document.getElementById('close-wl-modal').onclick = () => overlay.remove();
    document.getElementById('cancel-wl-modal').onclick = () => overlay.remove();

    // Auto-fill ID from symbol
    document.getElementById('wl-symbol').addEventListener('input', e => {
      const type = document.getElementById('wl-type').value;
      const sym = e.target.value.trim().toLowerCase();
      if (type !== 'crypto') document.getElementById('wl-id').value = sym.toUpperCase();
      else document.getElementById('wl-id').value = sym;
    });

    document.getElementById('confirm-wl-modal').onclick = () => {
      const sym = document.getElementById('wl-symbol').value.trim().toUpperCase();
      const name = document.getElementById('wl-name').value.trim() || sym;
      const id = document.getElementById('wl-id').value.trim() || sym;
      const type = document.getElementById('wl-type').value;
      if (!sym) { toast('Please enter a symbol', 'warning'); return; }
      const added = store.addToWatchlist({ id, type, name, symbol: sym });
      toast(added ? `${sym} added to watchlist!` : `${sym} already in watchlist`, added ? 'success' : 'info');
      overlay.remove();
      loadWatchlistPrices();
    };
  }

  document.getElementById('wl-add').onclick = showAddModal;
  loadWatchlistPrices();

  const interval = setInterval(loadWatchlistPrices, 60000);
  return () => clearInterval(interval);
}

// ---- DIVIDEND TRACKER ----
export function renderDividendTracker(container) {
  const dividends = [
    { symbol: 'AAPL', name: 'Apple Inc.', shares: 50, lastDiv: 0.24, frequency: 'Quarterly', nextDate: '2025-02-15', annualYield: 0.52, nextAmount: 12.00 },
    { symbol: 'JNJ', name: 'Johnson & Johnson', shares: 20, lastDiv: 1.19, frequency: 'Quarterly', nextDate: '2025-03-04', annualYield: 3.12, nextAmount: 23.80 },
    { symbol: 'KO', name: 'Coca-Cola', shares: 100, lastDiv: 0.485, frequency: 'Quarterly', nextDate: '2025-03-01', annualYield: 3.20, nextAmount: 48.50 },
    { symbol: 'VZ', name: 'Verizon', shares: 30, lastDiv: 0.665, frequency: 'Quarterly', nextDate: '2025-02-01', annualYield: 6.85, nextAmount: 19.95 },
    { symbol: 'T', name: 'AT&T', shares: 200, lastDiv: 0.2775, frequency: 'Quarterly', nextDate: '2025-02-28', annualYield: 6.70, nextAmount: 55.50 },
  ];

  const totalAnnual = dividends.reduce((s,d) => s + d.lastDiv * 4 * d.shares, 0);

  container.innerHTML = `
    <div class="page-header">
      <div><h1 class="page-title"><i class="fa fa-coins text-warning"></i> Dividend Tracker</h1>
      <p class="page-subtitle">Track dividend income and upcoming payments</p></div>
    </div>
    <div class="grid grid-4 mb-4">
      <div class="stat-card"><div class="stat-icon green"><i class="fa fa-calendar-check"></i></div><div class="stat-label">Annual Dividend Income</div><div class="stat-value">${formatCurrency(totalAnnual)}</div><div class="stat-change positive">All holdings</div></div>
      <div class="stat-card"><div class="stat-icon blue"><i class="fa fa-calendar-day"></i></div><div class="stat-label">Monthly Average</div><div class="stat-value">${formatCurrency(totalAnnual/12)}</div><div class="stat-change positive">Passive income</div></div>
      <div class="stat-card"><div class="stat-icon orange"><i class="fa fa-percent"></i></div><div class="stat-label">Portfolio Yield</div><div class="stat-value">${(dividends.reduce((s,d)=>s+d.annualYield,0)/dividends.length).toFixed(2)}%</div><div class="stat-change positive">Avg. yield</div></div>
      <div class="stat-card"><div class="stat-icon purple"><i class="fa fa-list"></i></div><div class="stat-label">Dividend Stocks</div><div class="stat-value">${dividends.length}</div><div class="stat-change positive">Positions</div></div>
    </div>
    <div class="grid grid-2 mb-4">
      <div class="card">
        <div class="card-header"><div class="card-title"><i class="fa fa-chart-bar"></i> Monthly Income Projection</div></div>
        <div class="card-body"><canvas id="div-monthly-chart" height="200"></canvas></div>
      </div>
      <div class="card">
        <div class="card-header"><div class="card-title"><i class="fa fa-calendar"></i> Upcoming Payments</div></div>
        <div class="card-body">
          ${dividends.sort((a,b)=>new Date(a.nextDate)-new Date(b.nextDate)).map(d=>`
            <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid var(--border-color)">
              <div><div class="font-bold">${d.symbol}</div><div class="text-xs text-muted">${d.nextDate}</div></div>
              <div style="text-align:right"><div class="font-bold text-success">${formatCurrency(d.nextAmount)}</div><div class="text-xs text-muted">${d.frequency}</div></div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
    <div class="card">
      <div class="card-header"><div class="card-title"><i class="fa fa-coins"></i> Dividend Holdings</div></div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Symbol</th><th>Company</th><th>Shares</th><th>Last Div</th><th>Frequency</th><th>Annual Yield</th><th>Annual Income</th><th>Next Payment</th></tr></thead>
          <tbody>
            ${dividends.map(d=>`<tr>
              <td class="font-bold text-purple">${d.symbol}</td>
              <td class="text-sm">${d.name}</td>
              <td class="mono">${d.shares}</td>
              <td class="mono">${formatCurrency(d.lastDiv)}</td>
              <td class="text-sm">${d.frequency}</td>
              <td class="text-success font-semibold">${d.annualYield}%</td>
              <td class="mono font-bold text-success">${formatCurrency(d.lastDiv*4*d.shares)}</td>
              <td><span class="badge badge-warning">${d.nextDate}</span></td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;

  setTimeout(() => {
    const canvas = document.getElementById('div-monthly-chart');
    if (!canvas) return;
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const monthlyData = months.map(() => totalAnnual/12 + (Math.random()*50-25));
    new Chart(canvas, {
      type: 'bar',
      data: {
        labels: months,
        datasets: [{ label: 'Dividend Income ($)', data: monthlyData, backgroundColor: 'rgba(34,197,94,0.7)', borderRadius: 6, borderSkipped: false }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: c => ` $${c.raw.toFixed(2)}` } } },
        scales: { x: { ticks: { color: '#64748b', font: { size: 10 } }, grid: { display: false } }, y: { ticks: { color: '#64748b', font: { size: 10 }, callback: v => '$'+v }, grid: { color: 'rgba(255,255,255,0.04)' } } }
      }
    });
  }, 100);
}
