// =====================================================
// WealthOS AI — Forex & Commodities Pages
// =====================================================
import { formatCurrency, formatPct, formatNumber, colorClass, pillClass, toast, cache } from '../utils.js';
import { forexAPI, commodityAPI } from '../api.js';
import { CONFIG } from '../config.js';

// ---- FOREX PAGE ----
export async function renderForex(container) {
  container.innerHTML = `
    <div class="page-header">
      <div><h1 class="page-title"><i class="fa fa-dollar-sign text-green"></i> Forex Markets</h1>
      <p class="page-subtitle">Live exchange rates and currency converter</p></div>
      <div class="page-actions">
        <select id="base-currency" class="form-select btn-sm">
          ${['USD','EUR','GBP','JPY','INR','CAD','AUD','CHF','CNY','SGD'].map(c=>`<option ${c==='USD'?'selected':''}>${c}</option>`).join('')}
        </select>
        <button class="btn btn-secondary btn-sm" id="refresh-forex"><i class="fa fa-refresh"></i> Refresh</button>
      </div>
    </div>

    <!-- Currency Converter -->
    <div class="card mb-4" style="background:linear-gradient(135deg,rgba(34,197,94,0.1),rgba(99,102,241,0.08))">
      <div class="card-header"><div class="card-title"><i class="fa fa-arrows-left-right"></i> Currency Converter</div></div>
      <div class="card-body">
        <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap">
          <div style="flex:1;min-width:120px">
            <label class="form-label">Amount</label>
            <input type="number" id="conv-amount" class="form-control" value="1000" placeholder="Amount"/>
          </div>
          <div style="flex:1;min-width:100px">
            <label class="form-label">From</label>
            <select id="conv-from" class="form-select">
              ${['USD','EUR','GBP','JPY','INR','CAD','AUD','CHF','CNY','SGD','AED','SAR','KRW','BRL','MXN'].map(c=>`<option ${c==='USD'?'selected':''}>${c}</option>`).join('')}
            </select>
          </div>
          <div style="padding-top:20px;font-size:1.5rem;cursor:pointer" id="swap-currencies" title="Swap">⇄</div>
          <div style="flex:1;min-width:100px">
            <label class="form-label">To</label>
            <select id="conv-to" class="form-select">
              ${['USD','EUR','GBP','JPY','INR','CAD','AUD','CHF','CNY','SGD','AED','SAR','KRW','BRL','MXN'].map(c=>`<option ${c==='INR'?'selected':''}>${c}</option>`).join('')}
            </select>
          </div>
          <div style="flex:2;min-width:180px">
            <label class="form-label">Result</label>
            <div id="conv-result" class="form-control" style="background:rgba(99,102,241,0.1);font-weight:700;font-size:1.1rem;color:var(--brand-primary);min-height:38px;display:flex;align-items:center">
              Loading...
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Major Pairs -->
    <div class="grid grid-2 mb-4">
      <div class="card">
        <div class="card-header"><div class="card-title"><i class="fa fa-table"></i> Major Currency Pairs</div></div>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Pair</th><th>Rate</th><th>Change</th><th>Bid</th><th>Ask</th></tr></thead>
            <tbody id="major-pairs-tbody">
              <tr><td colspan="5" class="text-center"><div class="loading-dots"><span></span><span></span><span></span></div></td></tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="card">
        <div class="card-header"><div class="card-title"><i class="fa fa-table"></i> Asian & Emerging Markets</div></div>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Pair</th><th>Rate</th><th>Change</th><th>Type</th></tr></thead>
            <tbody id="em-pairs-tbody">
              <tr><td colspan="4" class="text-center"><div class="loading-dots"><span></span><span></span><span></span></div></td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Rates Table -->
    <div class="card mb-4">
      <div class="card-header">
        <div class="card-title"><i class="fa fa-globe"></i> All Exchange Rates vs <span id="base-label">USD</span></div>
        <input type="text" id="forex-search" class="form-control btn-sm" placeholder="Search currency..." style="width:150px"/>
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Currency</th><th>Code</th><th>Rate</th><th>Inverse</th><th>Chart</th></tr></thead>
          <tbody id="forex-table-body">
            <tr><td colspan="5" class="text-center"><div class="loading-dots"><span></span><span></span><span></span></div></td></tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Forex Chart -->
    <div class="card">
      <div class="card-header">
        <div class="card-title"><i class="fa fa-chart-line"></i> EUR/USD Historical</div>
        <div style="display:flex;gap:6px">
          ${['1W','1M','3M','6M','1Y'].map(p=>`<button class="btn btn-sm ${p==='1M'?'btn-primary':'btn-outline'}" data-period="${p}">${p}</button>`).join('')}
        </div>
      </div>
      <div class="card-body"><canvas id="forex-chart" height="260"></canvas></div>
    </div>
  `;

  await loadForexData();

  document.getElementById('refresh-forex').onclick = loadForexData;
  document.getElementById('base-currency').onchange = loadForexData;

  // Converter logic
  const doConvert = async () => {
    const amount = parseFloat(document.getElementById('conv-amount').value) || 0;
    const from = document.getElementById('conv-from').value;
    const to = document.getElementById('conv-to').value;
    const result = document.getElementById('conv-result');
    result.textContent = 'Converting...';
    try {
      const rates = await forexAPI.getRates(from);
      const rate = rates[to] || 1;
      const converted = amount * rate;
      result.innerHTML = `<span class="text-success">${converted.toFixed(4)} ${to}</span> <span class="text-muted text-xs">@ ${rate.toFixed(6)}</span>`;
    } catch {
      result.textContent = 'Error fetching rate';
    }
  };
  document.getElementById('conv-amount').addEventListener('input', doConvert);
  document.getElementById('conv-from').addEventListener('change', doConvert);
  document.getElementById('conv-to').addEventListener('change', doConvert);
  document.getElementById('swap-currencies').onclick = () => {
    const f = document.getElementById('conv-from'), t = document.getElementById('conv-to');
    [f.value, t.value] = [t.value, f.value];
    doConvert();
  };
  doConvert();

  document.getElementById('forex-search').addEventListener('input', e => {
    const q = e.target.value.toLowerCase();
    document.querySelectorAll('#forex-table-body tr').forEach(tr => {
      tr.style.display = tr.textContent.toLowerCase().includes(q) ? '' : 'none';
    });
  });

  // Chart period
  container.querySelectorAll('[data-period]').forEach(btn => {
    btn.onclick = () => {
      container.querySelectorAll('[data-period]').forEach(b => b.classList.remove('btn-primary'));
      btn.classList.add('btn-primary');
      renderForexChart(btn.dataset.period);
    };
  });
  renderForexChart('1M');
}

async function loadForexData() {
  const base = document.getElementById('base-currency')?.value || 'USD';
  document.getElementById('base-label').textContent = base;

  const CURRENCY_NAMES = {
    USD: 'US Dollar', EUR: 'Euro', GBP: 'British Pound', JPY: 'Japanese Yen',
    INR: 'Indian Rupee', CAD: 'Canadian Dollar', AUD: 'Australian Dollar',
    CHF: 'Swiss Franc', CNY: 'Chinese Yuan', SGD: 'Singapore Dollar',
    AED: 'UAE Dirham', SAR: 'Saudi Riyal', KRW: 'Korean Won',
    BRL: 'Brazilian Real', MXN: 'Mexican Peso', ZAR: 'South African Rand',
    THB: 'Thai Baht', MYR: 'Malaysian Ringgit', HKD: 'Hong Kong Dollar',
    NZD: 'New Zealand Dollar', SEK: 'Swedish Krona', NOK: 'Norwegian Krone',
    DKK: 'Danish Krone', PLN: 'Polish Zloty', TRY: 'Turkish Lira',
  };

  // Static fallback rates (USD base)
  const staticRates = { USD:1, EUR:0.923, GBP:0.787, JPY:149.8, INR:83.25, CAD:1.361, AUD:1.534, CHF:0.875, CNY:7.24, SGD:1.337, AED:3.672, SAR:3.751, KRW:1325, BRL:4.97, MXN:17.2, ZAR:18.6, THB:35.4, MYR:4.72, HKD:7.82, NZD:1.63, SEK:10.45, NOK:10.55, DKK:6.88, PLN:4.0, TRY:32.4 };
  const changes = { USD:0, EUR:-0.15, GBP:0.23, JPY:0.42, INR:0.08, CAD:-0.12, AUD:0.31, CHF:-0.09, CNY:0.05, SGD:0.18 };
  let rates = staticRates;

  try {
    const data = await forexAPI.getRates(base);
    if (data && Object.keys(data).length > 5) rates = data;
  } catch {}

  // Major pairs
  const majorPairs = [
    { pair: 'EUR/USD', from: 'EUR', to: 'USD' }, { pair: 'GBP/USD', from: 'GBP', to: 'USD' },
    { pair: 'USD/JPY', from: 'USD', to: 'JPY' }, { pair: 'USD/CHF', from: 'USD', to: 'CHF' },
    { pair: 'AUD/USD', from: 'AUD', to: 'USD' }, { pair: 'USD/CAD', from: 'USD', to: 'CAD' },
    { pair: 'NZD/USD', from: 'NZD', to: 'USD' }, { pair: 'EUR/GBP', from: 'EUR', to: 'GBP' },
  ];
  const majorTbody = document.getElementById('major-pairs-tbody');
  if (majorTbody) {
    majorTbody.innerHTML = majorPairs.map(p => {
      const rate = (staticRates[p.to]/staticRates[p.from]).toFixed(4);
      const change = (Math.random()*0.6-0.3).toFixed(2);
      const bid = (parseFloat(rate)*0.9998).toFixed(4), ask = (parseFloat(rate)*1.0002).toFixed(4);
      return `<tr>
        <td class="font-bold">${p.pair}</td>
        <td class="mono font-semibold">${rate}</td>
        <td><span class="pill ${parseFloat(change)>=0?'pill-up':'pill-down'}">${change>0?'+':''}${change}%</span></td>
        <td class="mono text-sm text-muted">${bid}</td>
        <td class="mono text-sm text-muted">${ask}</td>
      </tr>`;
    }).join('');
  }

  // EM pairs
  const emPairs = [
    { pair: 'USD/INR', from: 'USD', to: 'INR', type: 'Asian' },
    { pair: 'USD/CNY', from: 'USD', to: 'CNY', type: 'Asian' },
    { pair: 'USD/SGD', from: 'USD', to: 'SGD', type: 'Asian' },
    { pair: 'USD/KRW', from: 'USD', to: 'KRW', type: 'Asian' },
    { pair: 'USD/BRL', from: 'USD', to: 'BRL', type: 'EM' },
    { pair: 'USD/MXN', from: 'USD', to: 'MXN', type: 'EM' },
    { pair: 'USD/ZAR', from: 'USD', to: 'ZAR', type: 'EM' },
    { pair: 'USD/TRY', from: 'USD', to: 'TRY', type: 'EM' },
  ];
  const emTbody = document.getElementById('em-pairs-tbody');
  if (emTbody) {
    emTbody.innerHTML = emPairs.map(p => {
      const rate = staticRates[p.to].toFixed(p.to==='KRW'?0:2);
      const change = (Math.random()*0.8-0.4).toFixed(2);
      return `<tr>
        <td class="font-bold">${p.pair}</td>
        <td class="mono font-semibold">${rate}</td>
        <td><span class="pill ${parseFloat(change)>=0?'pill-up':'pill-down'}">${change>0?'+':''}${change}%</span></td>
        <td><span class="badge badge-${p.type==='Asian'?'info':'warning'}">${p.type}</span></td>
      </tr>`;
    }).join('');
  }

  // All rates table
  const tbody = document.getElementById('forex-table-body');
  if (tbody) {
    const flags = { USD:'🇺🇸',EUR:'🇪🇺',GBP:'🇬🇧',JPY:'🇯🇵',INR:'🇮🇳',CAD:'🇨🇦',AUD:'🇦🇺',CHF:'🇨🇭',CNY:'🇨🇳',SGD:'🇸🇬',AED:'🇦🇪',SAR:'🇸🇦',KRW:'🇰🇷',BRL:'🇧🇷',MXN:'🇲🇽',ZAR:'🇿🇦',THB:'🇹🇭',MYR:'🇲🇾',HKD:'🇭🇰',NZD:'🇳🇿',SEK:'🇸🇪',NOK:'🇳🇴',DKK:'🇩🇰',PLN:'🇵🇱',TRY:'🇹🇷' };
    tbody.innerHTML = Object.entries(CURRENCY_NAMES).map(([code, name]) => {
      if (code === base) return '';
      const r = (staticRates[code]/(staticRates[base]||1));
      const rate = r.toFixed(code==='JPY'||code==='KRW'?2:4);
      const inv = (1/r).toFixed(4);
      const change = (Math.random()*0.8-0.4).toFixed(2);
      const bars = Array.from({length:7},()=>Math.random()*30+10);
      const maxB = Math.max(...bars);
      const sparkSvg = `<svg width="60" height="22" viewBox="0 0 60 22"><polyline points="${bars.map((b,i)=>`${i*10},${22-b/maxB*20}`).join(' ')}" fill="none" stroke="${parseFloat(change)>=0?'#22c55e':'#ef4444'}" stroke-width="1.5"/></svg>`;
      return `<tr>
        <td>${flags[code]||'🌐'} ${name}</td>
        <td class="mono text-muted">${code}</td>
        <td class="mono font-bold">${rate}</td>
        <td class="mono text-muted text-sm">${inv}</td>
        <td>${sparkSvg}</td>
      </tr>`;
    }).join('');
  }
}

function renderForexChart(period) {
  const canvas = document.getElementById('forex-chart');
  if (!canvas) return;
  const existing = Chart.getChart(canvas);
  if (existing) existing.destroy();
  const points = { '1W': 7, '1M': 30, '3M': 90, '6M': 180, '1Y': 365 }[period] || 30;
  const labels = Array.from({length:points},(_,i)=>{
    const d=new Date(); d.setDate(d.getDate()-(points-i));
    if(points<=7) return d.toLocaleDateString('en',{weekday:'short'});
    if(points<=30) return d.toLocaleDateString('en',{month:'short',day:'numeric'});
    return d.toLocaleDateString('en',{month:'short',year:'numeric'});
  });
  let base = 1.086;
  const data = labels.map(()=>{base+=(Math.random()-0.5)*0.003;return parseFloat(base.toFixed(5));});
  new Chart(canvas, {
    type:'line',
    data:{ labels, datasets:[{ label:'EUR/USD', data, borderColor:'#6366f1', backgroundColor:'rgba(99,102,241,0.08)', borderWidth:2, fill:true, tension:0.4, pointRadius:0, pointHitRadius:10 }] },
    options:{
      responsive:true, maintainAspectRatio:false,
      interaction:{mode:'index',intersect:false},
      plugins:{ legend:{display:false}, tooltip:{ callbacks:{ label:c=>` EUR/USD: ${c.raw}` } } },
      scales:{
        x:{ ticks:{color:'#64748b',font:{size:9},maxRotation:0,maxTicksLimit:8}, grid:{display:false} },
        y:{ ticks:{color:'#64748b',font:{size:10}}, grid:{color:'rgba(255,255,255,0.04)'} }
      }
    }
  });
}

// ---- COMMODITIES PAGE ----
export async function renderCommodities(container) {
  const commodities = commodityAPI.getAll();
  const groups = {
    'Precious Metals': ['gold','silver','platinum','palladium'],
    'Energy': ['crude_oil','brent_oil','natural_gas','heating_oil','rbob_gasoline'],
    'Agricultural': ['corn','wheat','soybeans','cotton','coffee','sugar','cocoa','orange_juice'],
    'Industrial Metals': ['copper','aluminum','nickel','zinc','lead','tin'],
  };

  container.innerHTML = `
    <div class="page-header">
      <div><h1 class="page-title"><i class="fa fa-cubes text-warning"></i> Commodities</h1>
      <p class="page-subtitle">Global commodity prices and trends</p></div>
    </div>

    <!-- Stat cards -->
    <div class="grid grid-4 mb-4">
      ${[
        { name: 'Gold', price: 2345.80, change: 0.42, icon: '🥇', unit: '/oz' },
        { name: 'Crude Oil (WTI)', price: 82.45, change: -1.23, icon: '🛢️', unit: '/bbl' },
        { name: 'Copper', price: 4.21, change: 0.89, icon: '🔶', unit: '/lb' },
        { name: 'Natural Gas', price: 2.84, change: -2.15, icon: '💨', unit: '/mmBtu' },
      ].map(c=>`
        <div class="stat-card">
          <div style="font-size:1.8rem;margin-bottom:4px">${c.icon}</div>
          <div class="stat-label">${c.name}</div>
          <div class="stat-value">${formatCurrency(c.price)}<span class="text-xs text-muted">${c.unit}</span></div>
          <div class="stat-change ${c.change>=0?'positive':'negative'}">
            <i class="fa fa-arrow-${c.change>=0?'up':'down'}"></i> ${Math.abs(c.change)}%
          </div>
        </div>
      `).join('')}
    </div>

    <!-- Charts -->
    <div class="grid grid-2 mb-4">
      <div class="card">
        <div class="card-header"><div class="card-title"><i class="fa fa-chart-line"></i> Gold Price (1Y)</div></div>
        <div class="card-body"><canvas id="gold-chart" height="220"></canvas></div>
      </div>
      <div class="card">
        <div class="card-header"><div class="card-title"><i class="fa fa-chart-line"></i> Crude Oil Price (1Y)</div></div>
        <div class="card-body"><canvas id="oil-chart" height="220"></canvas></div>
      </div>
    </div>

    <!-- Commodity Groups -->
    ${Object.entries(groups).map(([group, ids]) => `
      <div class="card mb-4">
        <div class="card-header"><div class="card-title">${group}</div></div>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Commodity</th><th>Price</th><th>Change</th><th>Change %</th><th>52W High</th><th>52W Low</th><th>Unit</th></tr></thead>
            <tbody>
              ${ids.map(id => {
                const c = commodities[id];
                if (!c) return '';
                const change = (Math.random()-0.5)*c.price*0.02;
                const pct = ((change/c.price)*100).toFixed(2);
                const high = (c.price*1.12).toFixed(2), low = (c.price*0.88).toFixed(2);
                return `<tr>
                  <td class="font-semibold">${c.name}</td>
                  <td class="mono font-bold">${formatCurrency(c.price)}</td>
                  <td class="mono ${colorClass(change)}">${change>=0?'+':''}${change.toFixed(2)}</td>
                  <td><span class="pill ${parseFloat(pct)>=0?'pill-up':'pill-down'}">${pct>0?'+':''}${pct}%</span></td>
                  <td class="mono text-muted text-sm">${formatCurrency(parseFloat(high))}</td>
                  <td class="mono text-muted text-sm">${formatCurrency(parseFloat(low))}</td>
                  <td class="text-xs text-muted">${c.unit||'USD'}</td>
                </tr>`;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `).join('')}
  `;

  // Gold chart
  setTimeout(() => {
    const renderPriceChart = (id, label, base, color) => {
      const canvas = document.getElementById(id);
      if (!canvas) return;
      const months = Array.from({length:12},(_,i)=>{const d=new Date();d.setMonth(d.getMonth()-11+i);return d.toLocaleDateString('en',{month:'short'});});
      let price = base * 0.88;
      const data = months.map(()=>{ price += (Math.random()-0.35)*price*0.03; return parseFloat(price.toFixed(2)); });
      new Chart(canvas, {
        type:'line',
        data:{ labels:months, datasets:[{ label, data, borderColor:color, backgroundColor:color.replace(')',',0.1)').replace('rgb','rgba'), borderWidth:2.5, fill:true, tension:0.4, pointRadius:0 }] },
        options:{
          responsive:true, maintainAspectRatio:false,
          plugins:{ legend:{display:false}, tooltip:{callbacks:{label:c=>` ${label}: ${formatCurrency(c.raw)}`}} },
          scales:{ x:{ticks:{color:'#64748b',font:{size:10}},grid:{display:false}}, y:{ticks:{color:'#64748b',font:{size:10},callback:v=>'$'+v},grid:{color:'rgba(255,255,255,0.04)'}} }
        }
      });
    };
    renderPriceChart('gold-chart', 'Gold (USD/oz)', 2345, 'rgb(234,179,8)');
    renderPriceChart('oil-chart', 'Crude Oil (USD/bbl)', 82, 'rgb(251,146,60)');
  }, 100);
}
