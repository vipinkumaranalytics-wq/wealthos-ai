// =====================================================
// WealthOS AI — Economic Calendar, IPO Tracker, Fear & Greed
// =====================================================
import { formatCurrency, formatNumber, formatPct, colorClass, toast, generateSparkline } from '../utils.js';
import { economicAPI, fearGreedAPI } from '../api.js';

// ---- ECONOMIC CALENDAR ----
export function renderEconomicCalendar(container) {
  const events = [
    { date: '2026-08-01', time: '08:30', event: 'US Nonfarm Payrolls', country: '🇺🇸', impact: 'high', forecast: '185K', actual: null, previous: '177K' },
    { date: '2026-08-01', time: '08:30', event: 'US Unemployment Rate', country: '🇺🇸', impact: 'high', forecast: '3.9%', actual: null, previous: '4.0%' },
    { date: '2026-08-02', time: '10:00', event: 'US ISM Services PMI', country: '🇺🇸', impact: 'medium', forecast: '51.2', actual: null, previous: '50.9' },
    { date: '2026-08-05', time: '09:45', event: 'US S&P Global Services PMI', country: '🇺🇸', impact: 'low', forecast: '55.1', actual: null, previous: '55.3' },
    { date: '2026-08-07', time: '08:30', event: 'US Initial Jobless Claims', country: '🇺🇸', impact: 'medium', forecast: '218K', actual: null, previous: '222K' },
    { date: '2026-08-12', time: '08:30', event: 'US CPI (YoY)', country: '🇺🇸', impact: 'high', forecast: '3.1%', actual: null, previous: '3.0%' },
    { date: '2026-08-12', time: '08:30', event: 'US Core CPI (YoY)', country: '🇺🇸', impact: 'high', forecast: '3.3%', actual: null, previous: '3.4%' },
    { date: '2026-08-13', time: '08:30', event: 'US PPI (MoM)', country: '🇺🇸', impact: 'medium', forecast: '0.2%', actual: null, previous: '0.1%' },
    { date: '2026-08-15', time: '08:30', event: 'US Retail Sales (MoM)', country: '🇺🇸', impact: 'high', forecast: '0.3%', actual: null, previous: '-0.1%' },
    { date: '2026-08-20', time: '18:00', event: 'FOMC Minutes', country: '🇺🇸', impact: 'high', forecast: null, actual: null, previous: null },
    { date: '2026-08-22', time: '08:30', event: 'US GDP (QoQ)', country: '🇺🇸', impact: 'high', forecast: '1.8%', actual: null, previous: '1.4%' },
    { date: '2026-08-26', time: '10:00 AM', event: 'Jackson Hole Symposium', country: '🇺🇸', impact: 'high', forecast: null, actual: null, previous: null },
    { date: '2026-08-01', time: '09:30', event: 'UK Manufacturing PMI', country: '🇬🇧', impact: 'medium', forecast: '51.0', actual: null, previous: '50.2' },
    { date: '2026-08-06', time: '07:00', event: 'UK Bank Rate Decision', country: '🇬🇧', impact: 'high', forecast: '5.0%', actual: null, previous: '5.25%' },
    { date: '2026-08-05', time: '03:00', event: 'China Caixin Services PMI', country: '🇨🇳', impact: 'medium', forecast: '52.1', actual: null, previous: '51.2' },
    { date: '2026-08-09', time: '20:30', event: 'China CPI (YoY)', country: '🇨🇳', impact: 'medium', forecast: '0.4%', actual: null, previous: '0.2%' },
    { date: '2026-08-07', time: '11:30', event: 'India RBI Rate Decision', country: '🇮🇳', impact: 'high', forecast: '6.50%', actual: null, previous: '6.50%' },
    { date: '2026-08-14', time: '12:00', event: 'India CPI (YoY)', country: '🇮🇳', impact: 'medium', forecast: '4.8%', actual: null, previous: '4.9%' },
    { date: '2026-08-01', time: '04:00', event: 'Eurozone GDP (QoQ)', country: '🇪🇺', impact: 'high', forecast: '0.3%', actual: null, previous: '0.3%' },
    { date: '2026-08-13', time: '05:00', event: 'Eurozone Industrial Production', country: '🇪🇺', impact: 'medium', forecast: '-0.2%', actual: null, previous: '-0.4%' },
  ];

  const today = new Date().toISOString().split('T')[0];
  let activeFilter = 'all';

  function renderTable(filter) {
    const filtered = events.filter(e => filter === 'all' || e.impact === filter);
    const byDate = {};
    filtered.forEach(e => { if (!byDate[e.date]) byDate[e.date] = []; byDate[e.date].push(e); });
    return Object.entries(byDate).sort(([a],[b])=>a.localeCompare(b)).map(([date, evts]) => {
      const d = new Date(date);
      const isToday = date === today;
      const label = isToday ? '📅 Today' : d.toLocaleDateString('en', { weekday: 'long', month: 'long', day: 'numeric' });
      return `
        <div class="economic-date-group mb-4">
          <div class="economic-date-header ${isToday?'today':''}">
            <h3 class="text-sm font-bold">${label}</h3>
            <span class="badge badge-info">${evts.length} events</span>
          </div>
          ${evts.map(e => {
            const impactClass = { high: 'danger', medium: 'warning', low: 'success' }[e.impact] || 'info';
            const impactBulls = { high: '🔴🔴🔴', medium: '🟡🟡', low: '🟢' }[e.impact];
            return `
              <div class="economic-event ${isToday?'is-today':''}">
                <div class="economic-event-time"><span class="text-xs text-muted">${e.time}</span></div>
                <div class="economic-event-country">${e.country}</div>
                <div class="economic-event-name">
                  <div class="font-semibold">${e.event}</div>
                  <div class="text-xs text-muted mt-1">${impactBulls} <span class="badge badge-${impactClass} badge-xs">${e.impact} impact</span></div>
                </div>
                <div class="economic-event-stats">
                  <div class="economic-stat"><span class="text-xs text-muted">Forecast</span><span class="text-sm font-bold">${e.forecast||'—'}</span></div>
                  <div class="economic-stat"><span class="text-xs text-muted">Previous</span><span class="text-sm">${e.previous||'—'}</span></div>
                  <div class="economic-stat"><span class="text-xs text-muted">Actual</span><span class="text-sm ${e.actual?colorClass(parseFloat(e.actual)-parseFloat(e.forecast)):''}">${e.actual||'Pending'}</span></div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `;
    }).join('');
  }

  container.innerHTML = `
    <div class="page-header">
      <div><h1 class="page-title"><i class="fa fa-calendar-days text-blue"></i> Economic Calendar</h1>
      <p class="page-subtitle">Track global economic events and their market impact</p></div>
    </div>

    <!-- Impact Stats -->
    <div class="grid grid-3 mb-4">
      <div class="stat-card"><div class="stat-icon red"><i class="fa fa-exclamation-triangle"></i></div><div class="stat-label">High Impact</div><div class="stat-value">${events.filter(e=>e.impact==='high').length}</div><div class="stat-change negative">Market movers</div></div>
      <div class="stat-card"><div class="stat-icon orange"><i class="fa fa-chart-bar"></i></div><div class="stat-label">Medium Impact</div><div class="stat-value">${events.filter(e=>e.impact==='medium').length}</div><div class="stat-change neutral">Worth watching</div></div>
      <div class="stat-card"><div class="stat-icon green"><i class="fa fa-calendar-check"></i></div><div class="stat-label">Total Events</div><div class="stat-value">${events.length}</div><div class="stat-change positive">This month</div></div>
    </div>

    <!-- Filters -->
    <div class="card mb-4">
      <div class="card-body" style="padding:12px">
        <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
          <span class="text-sm font-semibold text-muted">Filter:</span>
          ${['all','high','medium','low'].map(f=>`<button class="btn btn-sm ${f==='all'?'btn-primary':'btn-outline'} filter-btn" data-filter="${f}">${f==='all'?'All Events':f.charAt(0).toUpperCase()+f.slice(1)+' Impact'}</button>`).join('')}
          <input type="text" id="cal-search" class="form-control btn-sm" placeholder="Search events..." style="width:180px;margin-left:auto"/>
        </div>
      </div>
    </div>

    <div id="calendar-events">
      ${renderTable('all')}
    </div>
  `;

  // Add CSS for economic calendar layout
  if (!document.getElementById('eco-cal-styles')) {
    const style = document.createElement('style');
    style.id = 'eco-cal-styles';
    style.textContent = `
      .economic-date-header { display:flex; align-items:center; justify-content:space-between; padding:8px 12px; background:rgba(99,102,241,0.08); border-radius:8px; margin-bottom:8px; border-left:3px solid var(--brand-primary); }
      .economic-date-header.today { background:rgba(34,197,94,0.1); border-left-color:var(--brand-accent); }
      .economic-event { display:flex; gap:12px; align-items:flex-start; padding:12px 16px; border:1px solid var(--border-color); border-radius:8px; margin-bottom:6px; background:var(--bg-card); transition:all 0.2s; }
      .economic-event:hover { border-color:var(--brand-primary); background:rgba(99,102,241,0.04); }
      .economic-event.is-today { border-left:2px solid var(--brand-accent); }
      .economic-event-time { min-width:60px; padding-top:2px; }
      .economic-event-country { font-size:1.3rem; min-width:30px; }
      .economic-event-name { flex:1; }
      .economic-event-stats { display:flex; gap:16px; }
      .economic-stat { display:flex; flex-direction:column; align-items:center; min-width:60px; }
      .badge-xs { font-size:0.6rem; padding:2px 6px; }
      @media(max-width:600px) { .economic-event { flex-wrap:wrap; } .economic-event-stats { width:100%; } }
    `;
    document.head.appendChild(style);
  }

  container.querySelectorAll('.filter-btn').forEach(btn => {
    btn.onclick = () => {
      container.querySelectorAll('.filter-btn').forEach(b => { b.classList.remove('btn-primary'); b.classList.add('btn-outline'); });
      btn.classList.add('btn-primary'); btn.classList.remove('btn-outline');
      document.getElementById('calendar-events').innerHTML = renderTable(btn.dataset.filter);
    };
  });

  document.getElementById('cal-search').addEventListener('input', e => {
    const q = e.target.value.toLowerCase();
    document.querySelectorAll('.economic-event').forEach(el => {
      el.style.display = el.textContent.toLowerCase().includes(q) ? '' : 'none';
    });
  });
}

// ---- IPO TRACKER ----
export function renderIPOTracker(container) {
  const ipos = [
    { company: 'Stripe', symbol: 'STRP', sector: 'Fintech', date: 'Aug 15, 2026', price: '$32-$36', valuation: '$65B', shares: '45M', lead: 'Goldman Sachs, JPMorgan', status: 'upcoming', region: 'US' },
    { company: 'Reddit', symbol: 'RDDT', sector: 'Social Media', date: 'Aug 8, 2026', price: '$34', valuation: '$6.4B', shares: '22M', lead: 'Morgan Stanley', status: 'upcoming', region: 'US' },
    { company: 'Anthropic', symbol: 'ANTHR', sector: 'AI', date: 'Sep 2026', price: 'TBD', valuation: '$160B', shares: 'TBD', lead: 'TBD', status: 'rumored', region: 'US' },
    { company: 'HDFC AMC', symbol: 'HDFCAMC', sector: 'Finance', date: 'Aug 18, 2026', price: '₹1,250', valuation: '₹28,000Cr', shares: '2.4Cr', lead: 'Kotak, Axis', status: 'upcoming', region: 'IN' },
    { company: 'Swiggy', symbol: 'SWIGGY', sector: 'Food Tech', date: 'Launched', price: '₹390', valuation: '₹87,000Cr', shares: '6.2Cr', lead: 'ICICI, Kotak', status: 'recent', region: 'IN' },
    { company: 'BYJU\'S (via SPAC)', symbol: 'BYJ', sector: 'EdTech', date: 'Q4 2026', price: 'TBD', valuation: 'TBD', shares: 'TBD', lead: 'TBD', status: 'rumored', region: 'US' },
    { company: 'Databricks', symbol: 'DBRK', sector: 'Cloud/AI', date: 'Sep 2026', price: '$62-$68', valuation: '$82B', shares: '40M', lead: 'Goldman, MS', status: 'upcoming', region: 'US' },
    { company: 'OpenAI', symbol: 'OAI', sector: 'AI', date: '2027', price: 'TBD', valuation: '$300B+', shares: 'TBD', lead: 'TBD', status: 'rumored', region: 'US' },
  ];

  const statusColors = { upcoming: 'info', recent: 'success', rumored: 'warning', withdrawn: 'danger' };

  container.innerHTML = `
    <div class="page-header">
      <div><h1 class="page-title"><i class="fa fa-rocket text-purple"></i> IPO Tracker</h1>
      <p class="page-subtitle">Upcoming and recent IPOs and public listings</p></div>
    </div>
    <div class="grid grid-3 mb-4">
      <div class="stat-card"><div class="stat-icon blue"><i class="fa fa-hourglass-half"></i></div><div class="stat-label">Upcoming IPOs</div><div class="stat-value">${ipos.filter(i=>i.status==='upcoming').length}</div><div class="stat-change positive">Scheduled</div></div>
      <div class="stat-card"><div class="stat-icon green"><i class="fa fa-check-circle"></i></div><div class="stat-label">Recent IPOs</div><div class="stat-value">${ipos.filter(i=>i.status==='recent').length}</div><div class="stat-change positive">Launched</div></div>
      <div class="stat-card"><div class="stat-icon orange"><i class="fa fa-question-circle"></i></div><div class="stat-label">Rumored</div><div class="stat-value">${ipos.filter(i=>i.status==='rumored').length}</div><div class="stat-change neutral">Unconfirmed</div></div>
    </div>
    <div class="card mb-4">
      <div class="card-header">
        <div class="card-title"><i class="fa fa-rocket"></i> All IPOs</div>
        <div style="display:flex;gap:6px">
          ${['All','US','IN'].map((r,i)=>`<button class="btn btn-sm ${i===0?'btn-primary':'btn-outline'}" data-region="${r}">${r === 'All' ? 'All Markets' : r === 'US' ? '🇺🇸 US' : '🇮🇳 India'}</button>`).join('')}
        </div>
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Company</th><th>Ticker</th><th>Sector</th><th>Date</th><th>Price Range</th><th>Valuation</th><th>Lead Underwriter</th><th>Status</th></tr></thead>
          <tbody id="ipo-tbody">
            ${ipos.map(ipo=>`<tr data-region="${ipo.region}">
              <td class="font-bold">${ipo.company}</td>
              <td class="mono text-muted">${ipo.symbol}</td>
              <td><span class="badge badge-info">${ipo.sector}</span></td>
              <td class="text-sm">${ipo.date}</td>
              <td class="mono font-semibold">${ipo.price}</td>
              <td class="mono font-bold text-purple">${ipo.valuation}</td>
              <td class="text-sm text-muted">${ipo.lead}</td>
              <td><span class="badge badge-${statusColors[ipo.status]}">${ipo.status}</span></td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>
    <div class="grid grid-2">
      <div class="card">
        <div class="card-header"><div class="card-title"><i class="fa fa-chart-pie"></i> IPOs by Sector</div></div>
        <div class="card-body"><canvas id="ipo-sector-chart" height="220"></canvas></div>
      </div>
      <div class="card">
        <div class="card-header"><div class="card-title"><i class="fa fa-lightbulb text-warning"></i> IPO Investment Tips</div></div>
        <div class="card-body">
          ${[
            { icon: '📋', tip: 'Read the Prospectus (S-1)', desc: 'Understand the business model, risk factors, and use of proceeds before investing.' },
            { icon: '⚖️', tip: 'Check the Valuation', desc: 'Compare EV/Revenue or P/E ratios with similar public companies in the same sector.' },
            { icon: '🔒', tip: 'Note Lock-up Periods', desc: 'Insiders typically can\'t sell for 90-180 days. Watch for selling pressure post lock-up.' },
            { icon: '🌊', tip: 'Don\'t Chase Pop', desc: 'Many IPOs drop after initial pop. Consider waiting 1-3 months for price to stabilize.' },
            { icon: '📊', tip: 'Revenue Growth Matters', desc: 'For high-growth IPOs, prioritize revenue acceleration over profitability in early stages.' },
          ].map(t=>`
            <div style="display:flex;gap:10px;padding:10px 0;border-bottom:1px solid var(--border-color)">
              <span style="font-size:1.4rem">${t.icon}</span>
              <div>
                <div class="font-semibold text-sm">${t.tip}</div>
                <div class="text-xs text-muted mt-1">${t.desc}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;

  // Region filter
  container.querySelectorAll('[data-region]').forEach(btn => {
    btn.onclick = () => {
      container.querySelectorAll('[data-region]').forEach(b => { b.classList.remove('btn-primary'); b.classList.add('btn-outline'); });
      btn.classList.add('btn-primary'); btn.classList.remove('btn-outline');
      const region = btn.dataset.region;
      document.querySelectorAll('#ipo-tbody tr').forEach(tr => {
        tr.style.display = (region === 'All' || tr.dataset.region === region) ? '' : 'none';
      });
    };
  });

  setTimeout(() => {
    const canvas = document.getElementById('ipo-sector-chart');
    if (!canvas) return;
    const sectors = {}; ipos.forEach(i => { sectors[i.sector]=(sectors[i.sector]||0)+1; });
    const colors = ['#6366f1','#22c55e','#f59e0b','#ef4444','#3b82f6','#8b5cf6','#14b8a6','#ec4899'];
    new Chart(canvas, {
      type: 'doughnut',
      data: { labels: Object.keys(sectors), datasets: [{ data: Object.values(sectors), backgroundColor: Object.keys(sectors).map((_,i)=>colors[i%colors.length]+'cc'), borderWidth: 0 }] },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'right', labels: { color: '#94a3b8', boxWidth: 10, font: { size: 11 } } } } }
    });
  }, 100);
}

// ---- FEAR & GREED INDEX (Full Page) ----
export async function renderFearGreed(container) {
  container.innerHTML = `
    <div class="page-header">
      <div><h1 class="page-title"><i class="fa fa-face-grimace text-warning"></i> Fear & Greed Index</h1>
      <p class="page-subtitle">Market sentiment indicator — what emotion is driving the market?</p></div>
    </div>

    <!-- Main Gauge -->
    <div class="card mb-4" style="text-align:center">
      <div class="card-body">
        <div id="fg-gauge" style="display:flex;flex-direction:column;align-items:center;gap:16px">
          <div class="loading-dots"><span></span><span></span><span></span></div>
          <p class="text-muted">Loading Fear & Greed data...</p>
        </div>
      </div>
    </div>

    <!-- Historical -->
    <div class="card mb-4">
      <div class="card-header"><div class="card-title"><i class="fa fa-chart-line"></i> Fear & Greed History (30 Days)</div></div>
      <div class="card-body"><canvas id="fg-history-chart" height="240"></canvas></div>
    </div>

    <!-- Components -->
    <div class="card mb-4">
      <div class="card-header"><div class="card-title"><i class="fa fa-layer-group"></i> Index Components</div></div>
      <div class="card-body">
        <div id="fg-components">
          <div class="loading-dots"><span></span><span></span><span></span></div>
        </div>
      </div>
    </div>

    <!-- Explanation -->
    <div class="grid grid-2">
      <div class="card">
        <div class="card-header"><div class="card-title"><i class="fa fa-info-circle text-blue"></i> How to Use This Index</div></div>
        <div class="card-body">
          ${[
            { zone: '0-25 Extreme Fear', color: '#ef4444', advice: 'Historically strong buying opportunity. Market is likely oversold.' },
            { zone: '25-45 Fear', color: '#f97316', advice: 'Consider adding quality positions. Sentiment is bearish.' },
            { zone: '45-55 Neutral', color: '#94a3b8', advice: 'Market is balanced. Follow your investment strategy.' },
            { zone: '55-75 Greed', color: '#84cc16', advice: 'Exercise caution. Consider taking partial profits.' },
            { zone: '75-100 Extreme Greed', color: '#22c55e', advice: 'Danger zone. Market may be overvalued. Consider reducing risk.' },
          ].map(z=>`
            <div style="display:flex;gap:10px;padding:10px 0;border-bottom:1px solid var(--border-color)">
              <div style="width:4px;border-radius:2px;background:${z.color};flex-shrink:0"></div>
              <div>
                <div class="font-bold text-sm" style="color:${z.color}">${z.zone}</div>
                <div class="text-xs text-muted mt-1">${z.advice}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
      <div class="card">
        <div class="card-header"><div class="card-title"><i class="fa fa-quote-left text-purple"></i> Buffett's Wisdom</div></div>
        <div class="card-body">
          <blockquote style="border-left:4px solid var(--brand-primary);padding-left:16px;font-style:italic;color:var(--text-muted);font-size:1.1rem">
            "Be fearful when others are greedy, and be greedy when others are fearful."
          </blockquote>
          <p class="text-sm text-muted mt-3">— Warren Buffett, 1986 Berkshire Hathaway Letter</p>
          <div class="mt-4 p-3" style="background:rgba(99,102,241,0.1);border-radius:8px">
            <div class="font-bold text-sm mb-2">Key Insight</div>
            <p class="text-xs text-muted">The Fear & Greed Index is a contrarian indicator. When it shows extreme fear, many investors panic-sell — creating opportunities. When it shows extreme greed, euphoria may have priced in too much perfection.</p>
          </div>
          ${[
            { event: 'COVID Crash (Mar 2020)', reading: '6 (Extreme Fear)', result: 'S&P 500 doubled in 12 months', type: 'success' },
            { event: 'Nov 2021 ATH', reading: '82 (Extreme Greed)', result: 'S&P 500 fell -28% over next year', type: 'danger' },
            { event: 'Oct 2022 Bottom', reading: '12 (Extreme Fear)', result: 'Market rallied +28% in 12 months', type: 'success' },
          ].map(e=>`
            <div class="mt-2 p-2" style="background:var(--bg-card);border-radius:6px">
              <div class="text-xs font-bold">${e.event}</div>
              <div class="text-xs text-muted">Reading: ${e.reading} → <span class="text-${e.type}">${e.result}</span></div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;

  // Load Fear & Greed data
  try {
    const data = await fearGreedAPI.get(30);
    const current = data[0] || { value: 72, value_classification: 'Greed' };
    const value = parseInt(current.value);
    const classification = current.value_classification;
    const colors = { 'Extreme Fear': '#ef4444', Fear: '#f97316', Neutral: '#94a3b8', Greed: '#84cc16', 'Extreme Greed': '#22c55e' };
    const color = colors[classification] || '#6366f1';
    const rotation = (value / 100) * 180 - 90; // degrees

    document.getElementById('fg-gauge').innerHTML = `
      <div style="position:relative;width:280px;height:160px;margin:0 auto">
        <svg viewBox="0 0 280 160" width="280" height="160">
          <!-- Background arc segments -->
          ${[
            { pct:0.25, color:'rgba(239,68,68,0.8)' }, { pct:0.25, color:'rgba(249,115,22,0.8)' },
            { pct:0.10, color:'rgba(148,163,184,0.6)' }, { pct:0.20, color:'rgba(132,204,22,0.8)' }, { pct:0.20, color:'rgba(34,197,94,0.8)' },
          ].reduce((acc, seg, i) => {
            const prev = acc.offset;
            const start = prev * Math.PI;
            const end = (prev + seg.pct) * Math.PI;
            const cx = 140, cy = 140, r = 110;
            const x1 = cx + r * Math.cos(Math.PI + start), y1 = cy + r * Math.sin(Math.PI + start);
            const x2 = cx + r * Math.cos(Math.PI + end), y2 = cy + r * Math.sin(Math.PI + end);
            const innerR = 65;
            const ix1 = cx + innerR * Math.cos(Math.PI + start), iy1 = cy + innerR * Math.sin(Math.PI + start);
            const ix2 = cx + innerR * Math.cos(Math.PI + end), iy2 = cy + innerR * Math.sin(Math.PI + end);
            acc.offset += seg.pct;
            acc.paths.push(`<path d="M${x1} ${y1} A${r} ${r} 0 0 1 ${x2} ${y2} L${ix2} ${iy2} A${innerR} ${innerR} 0 0 0 ${ix1} ${iy1} Z" fill="${seg.color}"/>`);
            return acc;
          }, { offset: 0, paths: [] }).paths.join('')}
          <!-- Needle -->
          <g transform="rotate(${rotation}, 140, 140)">
            <line x1="140" y1="140" x2="140" y2="40" stroke="${color}" stroke-width="3" stroke-linecap="round"/>
            <circle cx="140" cy="140" r="8" fill="${color}"/>
          </g>
          <circle cx="140" cy="140" r="6" fill="var(--bg-card)"/>
          <!-- Labels -->
          <text x="30" y="155" fill="#ef4444" font-size="10" font-weight="bold">Fear</text>
          <text x="225" y="155" fill="#22c55e" font-size="10" font-weight="bold">Greed</text>
          <text x="125" y="155" fill="#94a3b8" font-size="10">Neutral</text>
        </svg>
      </div>
      <div style="font-size:4rem;font-weight:900;color:${color};line-height:1">${value}</div>
      <div style="font-size:1.5rem;font-weight:700;color:${color}">${classification}</div>
      <div class="text-sm text-muted">Updated: ${new Date().toLocaleDateString()}</div>
      <div class="flex gap-3 mt-2">
        ${[
          { label: 'Yesterday', val: data[1]?.value || 68 },
          { label: 'Last Week', val: data[7]?.value || 61 },
          { label: 'Last Month', val: data[29]?.value || 55 },
        ].map(d => `
          <div style="text-align:center;padding:8px 12px;background:var(--bg-card);border-radius:8px">
            <div class="text-xs text-muted">${d.label}</div>
            <div class="font-bold" style="color:${colors[d.val >= 75 ? 'Extreme Greed' : d.val >= 55 ? 'Greed' : d.val >= 45 ? 'Neutral' : d.val >= 25 ? 'Fear' : 'Extreme Fear']}">${d.val}</div>
          </div>
        `).join('')}
      </div>
    `;

    // History chart
    const histCanvas = document.getElementById('fg-history-chart');
    if (histCanvas && data.length > 1) {
      const labels = data.slice(0, 30).reverse().map(d => {
        const dt = new Date(d.timestamp * 1000);
        return dt.toLocaleDateString('en', { month: 'short', day: 'numeric' });
      });
      const vals = data.slice(0, 30).reverse().map(d => parseInt(d.value));
      new Chart(histCanvas, {
        type: 'line',
        data: {
          labels,
          datasets: [{
            label: 'Fear & Greed', data: vals,
            borderColor: ctx => { const v = vals[ctx.dataIndex]; return v >= 75 ? '#22c55e' : v >= 55 ? '#84cc16' : v >= 45 ? '#94a3b8' : v >= 25 ? '#f97316' : '#ef4444'; },
            segment: { borderColor: ctx => { const v = vals[ctx.p1.parsed.y]; return v >= 75 ? '#22c55e' : v >= 55 ? '#84cc16' : v >= 45 ? '#94a3b8' : v >= 25 ? '#f97316' : '#ef4444'; } },
            backgroundColor: 'rgba(99,102,241,0.08)', borderWidth: 2.5, fill: true, tension: 0.4, pointRadius: 3,
            pointBackgroundColor: vals.map(v => v >= 75 ? '#22c55e' : v >= 55 ? '#84cc16' : v >= 45 ? '#94a3b8' : v >= 25 ? '#f97316' : '#ef4444'),
          }]
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: { legend: { display: false }, tooltip: { callbacks: { label: c => ` Fear & Greed: ${c.raw} (${c.raw >= 75 ? 'Extreme Greed' : c.raw >= 55 ? 'Greed' : c.raw >= 45 ? 'Neutral' : c.raw >= 25 ? 'Fear' : 'Extreme Fear'})` } } },
          scales: {
            x: { ticks: { color: '#64748b', font: { size: 9 }, maxTicksLimit: 10 }, grid: { display: false } },
            y: { min: 0, max: 100, ticks: { color: '#64748b', font: { size: 10 } }, grid: { color: 'rgba(255,255,255,0.04)' } }
          }
        }
      });
    }

    // Components
    document.getElementById('fg-components').innerHTML = `
      <div class="grid grid-3">
        ${[
          { name: 'Stock Price Strength', value: 68, desc: 'Stocks hitting 52-week highs vs lows on NYSE' },
          { name: 'Stock Price Breadth', value: 71, desc: 'McClellan Volume Summation Index' },
          { name: 'Put/Call Ratio', value: 65, desc: 'CRV put to call options ratio (inverse)' },
          { name: 'Market Momentum', value: 80, desc: 'S&P 500 vs 125-day moving average' },
          { name: 'Safe Haven Demand', value: 58, desc: 'Treasury vs stock bond return spread (inverse)' },
          { name: 'VIX (Volatility)', value: 62, desc: 'Market volatility 30-day average (inverse)' },
          { name: 'Junk Bond Demand', value: 75, desc: 'High yield vs investment grade spread (inverse)' },
        ].map(c => {
          const cColor = c.value >= 75 ? '#22c55e' : c.value >= 55 ? '#84cc16' : c.value >= 45 ? '#94a3b8' : c.value >= 25 ? '#f97316' : '#ef4444';
          const label = c.value >= 75 ? 'Extreme Greed' : c.value >= 55 ? 'Greed' : c.value >= 45 ? 'Neutral' : c.value >= 25 ? 'Fear' : 'Extreme Fear';
          return `
            <div class="stat-card" style="border-top-color:${cColor}">
              <div class="stat-label">${c.name}</div>
              <div class="stat-value" style="color:${cColor}">${c.value}</div>
              <div style="margin:6px 0"><div class="progress" style="height:4px"><div style="width:${c.value}%;height:4px;border-radius:2px;background:${cColor}"></div></div></div>
              <div style="font-size:0.7rem;font-weight:600;color:${cColor}">${label}</div>
              <div class="text-xs text-muted mt-1">${c.desc}</div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  } catch (e) {
    document.getElementById('fg-gauge').innerHTML = `<div class="empty-state"><i class="fa fa-exclamation-circle text-danger"></i><p>Could not load Fear & Greed data. Try again later.</p><button class="btn btn-primary" onclick="location.reload()"><i class="fa fa-refresh"></i> Retry</button></div>`;
  }
}
