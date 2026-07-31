// =====================================================
// WealthOS AI — Financial Statements & Company Analysis
// =====================================================
import { formatCurrency, formatNumber, formatPct, colorClass, toast } from '../utils.js';
import { stockAPI, demoData } from '../api.js';

const DEMO_COMPANIES = {
  AAPL: { name: 'Apple Inc.', sector: 'Technology', exchange: 'NASDAQ', price: 189.30, mktCap: 2970000, pe: 30.2, ps: 7.4, eps: 6.27, div: 0.96, beta: 1.24, week52H: 199.62, week52L: 124.17, employees: 164000, description: 'Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide.' },
  MSFT: { name: 'Microsoft Corp.', sector: 'Technology', exchange: 'NASDAQ', price: 415.50, mktCap: 3090000, pe: 35.8, ps: 12.1, eps: 11.60, div: 3.00, beta: 0.90, week52H: 430.82, week52L: 309.45, employees: 221000, description: 'Microsoft Corporation develops, licenses, and supports software, services, devices, and solutions worldwide.' },
  GOOGL: { name: 'Alphabet Inc.', sector: 'Technology', exchange: 'NASDAQ', price: 175.80, mktCap: 2200000, pe: 27.4, ps: 6.2, eps: 6.41, div: 0, beta: 1.06, week52H: 193.31, week52L: 115.83, employees: 182000, description: 'Alphabet Inc. provides various products and platforms in the United States, Europe, and internationally.' },
  AMZN: { name: 'Amazon.com Inc.', sector: 'Consumer Discretionary', exchange: 'NASDAQ', price: 190.45, mktCap: 2010000, pe: 60.1, ps: 3.1, eps: 3.17, div: 0, beta: 1.16, week52H: 201.20, week52L: 118.35, employees: 1535000, description: 'Amazon.com, Inc. engages in the retail sale of consumer products, advertising, and subscriptions through online and physical stores.' },
  TSLA: { name: 'Tesla Inc.', sector: 'Automotive', exchange: 'NASDAQ', price: 245.80, mktCap: 784000, pe: 62.4, ps: 7.8, eps: 3.94, div: 0, beta: 2.31, week52H: 299.29, week52L: 138.80, employees: 140473, description: 'Tesla, Inc. designs, develops, manufactures, leases, and sells electric vehicles, and energy generation and storage systems.' },
};

export async function renderFinancialStatements(container) {
  let activeSymbol = 'AAPL';
  let activeTab = 'overview';

  function render() {
    const co = DEMO_COMPANIES[activeSymbol];
    const change = (Math.random()-0.3)*5;
    const changePct = (change/co.price*100);

    container.innerHTML = `
      <div class="page-header">
        <div><h1 class="page-title"><i class="fa fa-building-columns text-purple"></i> Financial Statements</h1>
        <p class="page-subtitle">Detailed company financials and analysis</p></div>
        <div class="page-actions">
          <select id="company-selector" class="form-select">
            ${Object.entries(DEMO_COMPANIES).map(([sym,co])=>`<option value="${sym}" ${sym===activeSymbol?'selected':''}>${sym} — ${co.name}</option>`).join('')}
          </select>
          <input type="text" id="symbol-search" class="form-control" placeholder="Enter symbol..." style="width:120px"/>
        </div>
      </div>

      <!-- Company Card -->
      <div class="card mb-4" style="background:linear-gradient(135deg,rgba(99,102,241,0.1),rgba(34,197,94,0.06))">
        <div class="card-body">
          <div style="display:flex;gap:20px;flex-wrap:wrap;align-items:flex-start">
            <div style="width:60px;height:60px;border-radius:12px;background:var(--bg-card);border:2px solid var(--border-color);display:flex;align-items:center;justify-content:center;font-size:1.2rem;font-weight:900;color:var(--brand-primary)">${activeSymbol.slice(0,2)}</div>
            <div style="flex:1;min-width:200px">
              <div class="flex items-center gap-3 flex-wrap mb-1">
                <h2 class="font-bold text-xl">${co.name}</h2>
                <span class="mono text-muted">${activeSymbol}</span>
                <span class="badge badge-info">${co.exchange}</span>
                <span class="badge badge-secondary">${co.sector}</span>
              </div>
              <p class="text-sm text-muted mb-2">${co.description}</p>
              <div class="flex gap-3 text-xs text-muted flex-wrap">
                <span><i class="fa fa-users"></i> ${formatNumber(co.employees)} employees</span>
              </div>
            </div>
            <div style="text-align:right;min-width:140px">
              <div class="text-3xl font-bold">${formatCurrency(co.price)}</div>
              <div class="${colorClass(change)} font-semibold">${change>=0?'+':''}${change.toFixed(2)} (${changePct>=0?'+':''}${changePct.toFixed(2)}%)</div>
              <div class="text-xs text-muted mt-1">Market Cap: ${formatNumber(co.mktCap)}M</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="tabs mb-4">
        ${['overview','income','balance','cashflow','ratios'].map(t=>`
          <button class="tab-btn ${t===activeTab?'active':''}" data-tab="${t}">
            <i class="fa fa-${t==='overview'?'gauge-high':t==='income'?'chart-line':t==='balance'?'scale-balanced':t==='cashflow'?'arrows-rotate':'percent'}"></i>
            ${t.charAt(0).toUpperCase()+t.slice(1).replace('cashflow','Cash Flow')}
          </button>
        `).join('')}
      </div>

      <div id="stmt-content"></div>
    `;

    document.getElementById('company-selector').onchange = e => { activeSymbol = e.target.value; render(); };
    document.getElementById('symbol-search').onkeypress = e => {
      if (e.key === 'Enter') {
        const sym = e.target.value.toUpperCase();
        if (DEMO_COMPANIES[sym]) { activeSymbol = sym; render(); }
        else toast('Symbol not in demo database. Showing ' + activeSymbol, 'info');
      }
    };

    container.querySelectorAll('.tab-btn').forEach(btn => {
      btn.onclick = () => { activeTab = btn.dataset.tab; render(); };
    });

    renderTab(activeSymbol, activeTab);
  }

  function renderTab(symbol, tab) {
    const co = DEMO_COMPANIES[symbol];
    const content = document.getElementById('stmt-content');
    if (!content) return;

    if (tab === 'overview') {
      content.innerHTML = `
        <div class="grid grid-4 mb-4">
          ${[
            { label: 'P/E Ratio', value: co.pe, info: 'Price-to-Earnings' },
            { label: 'P/S Ratio', value: co.ps + 'x', info: 'Price-to-Sales' },
            { label: 'EPS', value: formatCurrency(co.eps), info: 'Earnings Per Share' },
            { label: 'Annual Dividend', value: co.div ? formatCurrency(co.div) : 'N/A', info: 'Dividend Per Share' },
          ].map(m=>`
            <div class="stat-card">
              <div class="stat-label">${m.label}</div>
              <div class="stat-value">${m.value}</div>
              <div class="stat-change neutral">${m.info}</div>
            </div>
          `).join('')}
        </div>
        <div class="grid grid-2 mb-4">
          <div class="card">
            <div class="card-header"><div class="card-title"><i class="fa fa-info-circle"></i> Key Metrics</div></div>
            <div class="card-body">
              ${[
                ['Market Cap', '$' + formatNumber(co.mktCap) + 'M'],
                ['52W High', formatCurrency(co.week52H)],
                ['52W Low', formatCurrency(co.week52L)],
                ['Beta', co.beta.toFixed(2)],
                ['Employees', formatNumber(co.employees)],
                ['P/E Ratio', co.pe],
                ['P/S Ratio', co.ps + 'x'],
                ['Dividend Yield', co.div ? ((co.div/co.price)*100).toFixed(2)+'%' : 'N/A'],
              ].map(([k,v])=>`
                <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border-color)">
                  <span class="text-muted text-sm">${k}</span>
                  <span class="font-semibold text-sm">${v}</span>
                </div>
              `).join('')}
            </div>
          </div>
          <div class="card">
            <div class="card-header"><div class="card-title"><i class="fa fa-chart-line"></i> Price Chart</div></div>
            <div class="card-body"><canvas id="price-chart" height="220"></canvas></div>
          </div>
        </div>
        <div class="card">
          <div class="card-header"><div class="card-title"><i class="fa fa-chart-bar"></i> Revenue vs Net Income (Annual)</div></div>
          <div class="card-body"><canvas id="rev-chart" height="200"></canvas></div>
        </div>
      `;
      setTimeout(() => {
        const pc = document.getElementById('price-chart');
        if (pc) {
          const months = Array.from({length:12},(_,i)=>{const d=new Date();d.setMonth(d.getMonth()-11+i);return d.toLocaleDateString('en',{month:'short'});});
          let p = co.price * 0.85;
          const data = months.map(()=>{ p+=(Math.random()-0.4)*p*0.03; return parseFloat(p.toFixed(2)); });
          new Chart(pc, { type:'line', data:{ labels:months, datasets:[{ label:symbol, data, borderColor:'#6366f1', backgroundColor:'rgba(99,102,241,0.08)', borderWidth:2.5, fill:true, tension:0.4, pointRadius:0 }] }, options:{ responsive:true, maintainAspectRatio:false, plugins:{legend:{display:false}}, scales:{x:{ticks:{color:'#64748b',font:{size:9}},grid:{display:false}},y:{ticks:{color:'#64748b',font:{size:9},callback:v=>'$'+v},grid:{color:'rgba(255,255,255,0.04)'}}} } });
        }
        const rc = document.getElementById('rev-chart');
        if (rc) {
          const years = ['2020','2021','2022','2023','2024'];
          const baseRev = co.mktCap * 0.09;
          const revs = years.map((_,i)=>(baseRev*(0.7+i*0.08)).toFixed(0));
          const nInc = revs.map(r=>(parseFloat(r)*0.24).toFixed(0));
          new Chart(rc, { type:'bar', data:{ labels:years, datasets:[{ label:'Revenue', data:revs, backgroundColor:'rgba(99,102,241,0.7)', borderRadius:4 },{ label:'Net Income', data:nInc, backgroundColor:'rgba(34,197,94,0.7)', borderRadius:4 }] }, options:{ responsive:true, maintainAspectRatio:false, plugins:{legend:{labels:{color:'#94a3b8',boxWidth:10,font:{size:11}}},tooltip:{callbacks:{label:c=>` ${c.dataset.label}: $${formatNumber(c.raw)}M`}}}, scales:{x:{ticks:{color:'#64748b',font:{size:10}},grid:{display:false}},y:{ticks:{color:'#64748b',font:{size:9},callback:v=>'$'+formatNumber(v)+'M'},grid:{color:'rgba(255,255,255,0.04)'}}} } });
        }
      }, 100);
    }

    if (tab === 'income') {
      const years = ['FY2020','FY2021','FY2022','FY2023','FY2024'];
      const baseRev = co.mktCap * 0.09;
      const rows = [
        { label: 'Revenue', values: years.map((_,i)=>(baseRev*(0.7+i*0.08)).toFixed(0)), bold: true },
        { label: 'Cost of Goods Sold', values: years.map((_,i)=>(baseRev*(0.7+i*0.08)*0.58).toFixed(0)) },
        { label: 'Gross Profit', values: years.map((_,i)=>(baseRev*(0.7+i*0.08)*0.42).toFixed(0)), bold: true, highlight: 'success' },
        { label: 'Operating Expenses', values: years.map((_,i)=>(baseRev*(0.7+i*0.08)*0.18).toFixed(0)) },
        { label: 'R&D Expense', values: years.map((_,i)=>(baseRev*(0.7+i*0.08)*0.06).toFixed(0)) },
        { label: 'EBITDA', values: years.map((_,i)=>(baseRev*(0.7+i*0.08)*0.30).toFixed(0)), bold: true },
        { label: 'Depreciation & Amortization', values: years.map((_,i)=>(baseRev*(0.7+i*0.08)*0.04).toFixed(0)) },
        { label: 'Operating Income (EBIT)', values: years.map((_,i)=>(baseRev*(0.7+i*0.08)*0.26).toFixed(0)), bold: true },
        { label: 'Interest Expense', values: years.map((_,i)=>(baseRev*(0.7+i*0.08)*0.01).toFixed(0)) },
        { label: 'Pre-Tax Income', values: years.map((_,i)=>(baseRev*(0.7+i*0.08)*0.25).toFixed(0)) },
        { label: 'Income Tax', values: years.map((_,i)=>(baseRev*(0.7+i*0.08)*0.05).toFixed(0)) },
        { label: 'Net Income', values: years.map((_,i)=>(baseRev*(0.7+i*0.08)*0.24).toFixed(0)), bold: true, highlight: 'success' },
        { label: 'EPS (Diluted)', values: years.map((_,i)=>(baseRev*(0.7+i*0.08)*0.24/1600).toFixed(2)), prefix: '$' },
      ];
      content.innerHTML = `
        <div class="card">
          <div class="card-header"><div class="card-title"><i class="fa fa-chart-line"></i> Income Statement (USD Millions)</div></div>
          <div class="table-wrap">
            <table>
              <thead><tr><th>Item</th>${years.map(y=>`<th>${y}</th>`).join('')}<th>YoY Growth</th></tr></thead>
              <tbody>
                ${rows.map(row=>`<tr style="background:${row.highlight?`rgba(34,197,94,0.04)`:''}">
                  <td class="${row.bold?'font-bold':''} text-sm">${row.label}</td>
                  ${row.values.map((v,i)=>`<td class="mono ${row.bold?'font-bold':''}" style="color:${row.highlight?'var(--brand-accent)':''}">${row.prefix||'$'}${parseFloat(v).toLocaleString()}</td>`).join('')}
                  <td><span class="pill pill-up">+${(5+Math.random()*8).toFixed(1)}%</span></td>
                </tr>`).join('')}
              </tbody>
            </table>
          </div>
        </div>
      `;
    }

    if (tab === 'balance') {
      const baseAssets = co.mktCap * 0.85;
      content.innerHTML = `
        <div class="grid grid-2">
          <div class="card">
            <div class="card-header"><div class="card-title text-success"><i class="fa fa-plus-circle"></i> Assets</div></div>
            <div class="table-wrap">
              <table>
                <thead><tr><th>Item</th><th>FY2024</th><th>FY2023</th></tr></thead>
                <tbody>
                  ${[
                    ['Current Assets','','','',true],
                    ['Cash & Equivalents',(baseAssets*0.14).toFixed(0),(baseAssets*0.12).toFixed(0)],
                    ['Short-term Investments',(baseAssets*0.11).toFixed(0),(baseAssets*0.10).toFixed(0)],
                    ['Accounts Receivable',(baseAssets*0.08).toFixed(0),(baseAssets*0.07).toFixed(0)],
                    ['Inventories',(baseAssets*0.02).toFixed(0),(baseAssets*0.02).toFixed(0)],
                    ['Total Current Assets',(baseAssets*0.35).toFixed(0),(baseAssets*0.31).toFixed(0),'',true],
                    ['Non-Current Assets','','','',true],
                    ['Long-term Investments',(baseAssets*0.30).toFixed(0),(baseAssets*0.32).toFixed(0)],
                    ['Property & Equipment',(baseAssets*0.11).toFixed(0),(baseAssets*0.10).toFixed(0)],
                    ['Goodwill & Intangibles',(baseAssets*0.12).toFixed(0),(baseAssets*0.13).toFixed(0)],
                    ['Other Assets',(baseAssets*0.12).toFixed(0),(baseAssets*0.14).toFixed(0)],
                    ['Total Assets',(baseAssets).toFixed(0),(baseAssets*0.92).toFixed(0),'',true,'success'],
                  ].map(([label,v1,v2,_,bold,color])=>`<tr style="background:${color?'rgba(34,197,94,0.04)':''}">
                    <td class="${bold?'font-bold':''} text-sm ${!v1?'text-muted':''}">${label}</td>
                    <td class="mono ${bold?'font-bold':''}" style="color:${color?'var(--brand-accent)':''}">${v1?'$'+parseFloat(v1).toLocaleString():''}</td>
                    <td class="mono text-muted text-sm">${v2?'$'+parseFloat(v2).toLocaleString():''}</td>
                  </tr>`).join('')}
                </tbody>
              </table>
            </div>
          </div>
          <div class="card">
            <div class="card-header"><div class="card-title text-danger"><i class="fa fa-minus-circle"></i> Liabilities & Equity</div></div>
            <div class="table-wrap">
              <table>
                <thead><tr><th>Item</th><th>FY2024</th><th>FY2023</th></tr></thead>
                <tbody>
                  ${[
                    ['Current Liabilities','','',true],
                    ['Accounts Payable',(baseAssets*0.07).toFixed(0),(baseAssets*0.06).toFixed(0)],
                    ['Short-term Debt',(baseAssets*0.04).toFixed(0),(baseAssets*0.04).toFixed(0)],
                    ['Total Current Liabilities',(baseAssets*0.30).toFixed(0),(baseAssets*0.28).toFixed(0),'',true,'danger'],
                    ['Long-term Debt',(baseAssets*0.25).toFixed(0),(baseAssets*0.27).toFixed(0)],
                    ['Other Liabilities',(baseAssets*0.05).toFixed(0),(baseAssets*0.05).toFixed(0)],
                    ['Total Liabilities',(baseAssets*0.60).toFixed(0),(baseAssets*0.60).toFixed(0),'',true,'danger'],
                    ['Stockholders Equity','','',true],
                    ['Common Stock',(baseAssets*0.06).toFixed(0),(baseAssets*0.06).toFixed(0)],
                    ['Retained Earnings',(baseAssets*0.34).toFixed(0),(baseAssets*0.32).toFixed(0)],
                    ['Total Equity',(baseAssets*0.40).toFixed(0),(baseAssets*0.40).toFixed(0),'',true,'success'],
                    ['Total Liabilities + Equity',(baseAssets).toFixed(0),(baseAssets*0.92).toFixed(0),'',true],
                  ].map(([label,v1,v2,bold,color])=>`<tr>
                    <td class="${bold?'font-bold':''} text-sm ${!v1?'text-muted':''}">${label}</td>
                    <td class="mono ${bold?'font-bold':''}" style="color:${color==='danger'?'var(--brand-danger)':color==='success'?'var(--brand-accent)':''}">${v1?'$'+parseFloat(v1).toLocaleString():''}</td>
                    <td class="mono text-muted text-sm">${v2?'$'+parseFloat(v2).toLocaleString():''}</td>
                  </tr>`).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      `;
    }

    if (tab === 'ratios') {
      content.innerHTML = `
        <div class="grid grid-2">
          ${[
            {
              title: 'Valuation Ratios', icon: 'fa-tag',
              metrics: [
                ['P/E Ratio', co.pe, 'Price/Earnings — how much you pay per $1 of earnings'],
                ['P/S Ratio', co.ps + 'x', 'Price/Sales — market cap divided by annual revenue'],
                ['P/B Ratio', (2.5 + Math.random()*3).toFixed(1)+'x', 'Price/Book — market cap vs book value'],
                ['EV/EBITDA', (18 + Math.random()*10).toFixed(1)+'x', 'Enterprise value relative to EBITDA'],
                ['PEG Ratio', (1.2 + Math.random()).toFixed(2), 'P/E divided by earnings growth rate (< 1 = undervalued)'],
              ]
            },
            {
              title: 'Profitability Ratios', icon: 'fa-chart-line',
              metrics: [
                ['Gross Margin', '42.5%', 'Gross profit as % of revenue'],
                ['Operating Margin', '28.7%', 'Operating income as % of revenue'],
                ['Net Profit Margin', '24.2%', 'Net income as % of revenue'],
                ['Return on Equity (ROE)', '147.5%', 'Net income / Shareholders equity'],
                ['Return on Assets (ROA)', '28.3%', 'Net income / Total assets'],
              ]
            },
            {
              title: 'Liquidity & Solvency', icon: 'fa-water',
              metrics: [
                ['Current Ratio', (1.1 + Math.random()*0.5).toFixed(2), 'Current assets / Current liabilities (>1 is good)'],
                ['Quick Ratio', (0.8 + Math.random()*0.4).toFixed(2), 'Liquid assets / Current liabilities'],
                ['Debt-to-Equity', (0.5 + Math.random()*1.5).toFixed(2), 'Total debt / Shareholders equity'],
                ['Interest Coverage', (15 + Math.random()*20).toFixed(1)+'x', 'EBIT / Interest expense (higher = safer)'],
                ['Debt-to-Assets', (0.3 + Math.random()*0.3).toFixed(2), 'Total liabilities / Total assets'],
              ]
            },
            {
              title: 'Efficiency Ratios', icon: 'fa-gauge-high',
              metrics: [
                ['Asset Turnover', (0.8 + Math.random()*0.5).toFixed(2), 'Revenue / Total assets'],
                ['Inventory Turnover', (40 + Math.random()*30).toFixed(1)+'x', 'COGS / Average inventory'],
                ['Days Sales Outstanding', (28 + Math.random()*15).toFixed(0)+' days', 'Average days to collect payment'],
                ['Free Cash Flow Yield', (co.div/co.price*100+1.5).toFixed(1)+'%', 'Free cash flow / Market cap'],
                ['Revenue Growth (YoY)', '+' + (8 + Math.random()*12).toFixed(1)+'%', 'Annual revenue growth rate'],
              ]
            },
          ].map(section=>`
            <div class="card">
              <div class="card-header"><div class="card-title"><i class="fa ${section.icon}"></i> ${section.title}</div></div>
              <div class="card-body">
                ${section.metrics.map(([label,value,desc])=>`
                  <div style="padding:10px 0;border-bottom:1px solid var(--border-color)">
                    <div style="display:flex;justify-content:space-between;align-items:center">
                      <span class="font-semibold text-sm">${label}</span>
                      <span class="font-bold mono" style="color:var(--brand-primary)">${value}</span>
                    </div>
                    <div class="text-xs text-muted mt-1">${desc}</div>
                  </div>
                `).join('')}
              </div>
            </div>
          `).join('')}
        </div>
      `;
    }

    if (tab === 'cashflow') {
      const baseRev = co.mktCap * 0.09;
      const years = ['FY2020','FY2021','FY2022','FY2023','FY2024'];
      const rows = [
        { label: 'Operating Activities', bold: true, section: true },
        { label: 'Net Income', values: years.map((_,i)=>(baseRev*(0.7+i*0.08)*0.24).toFixed(0)) },
        { label: 'Depreciation & Amortization', values: years.map((_,i)=>(baseRev*(0.7+i*0.08)*0.04).toFixed(0)) },
        { label: 'Changes in Working Capital', values: years.map(()=>((Math.random()-0.5)*baseRev*0.02).toFixed(0)) },
        { label: 'Cash from Operations', values: years.map((_,i)=>(baseRev*(0.7+i*0.08)*0.28).toFixed(0)), bold: true, highlight: 'success' },
        { label: 'Investing Activities', bold: true, section: true },
        { label: 'Capital Expenditure', values: years.map((_,i)=>'-'+(baseRev*(0.7+i*0.08)*0.06).toFixed(0)) },
        { label: 'Acquisitions', values: years.map(()=>'-'+(Math.random()*baseRev*0.02).toFixed(0)) },
        { label: 'Cash from Investing', values: years.map((_,i)=>'-'+(baseRev*(0.7+i*0.08)*0.08).toFixed(0)), bold: true, highlight: 'danger' },
        { label: 'Financing Activities', bold: true, section: true },
        { label: 'Share Buybacks', values: years.map((_,i)=>'-'+(baseRev*(0.7+i*0.08)*0.07).toFixed(0)) },
        { label: 'Dividends Paid', values: years.map(()=>co.div?'-'+(co.div*15000).toFixed(0):'0') },
        { label: 'Cash from Financing', values: years.map((_,i)=>'-'+(baseRev*(0.7+i*0.08)*0.09).toFixed(0)), bold: true, highlight: 'danger' },
        { label: 'Free Cash Flow', values: years.map((_,i)=>(baseRev*(0.7+i*0.08)*0.22).toFixed(0)), bold: true, highlight: 'success' },
      ];
      content.innerHTML = `
        <div class="card">
          <div class="card-header"><div class="card-title"><i class="fa fa-arrows-rotate"></i> Cash Flow Statement (USD Millions)</div></div>
          <div class="table-wrap">
            <table>
              <thead><tr><th>Item</th>${years.map(y=>`<th>${y}</th>`).join('')}</tr></thead>
              <tbody>
                ${rows.map(row=>row.section ? `<tr style="background:rgba(99,102,241,0.08)"><td colspan="${years.length+1}" class="font-bold text-sm" style="color:var(--brand-primary)">${row.label}</td></tr>` :
                  `<tr style="background:${row.highlight==='success'?'rgba(34,197,94,0.04)':row.highlight==='danger'?'rgba(239,68,68,0.04)':''}">
                    <td class="${row.bold?'font-bold':''} text-sm">${row.label}</td>
                    ${row.values.map(v=>`<td class="mono ${row.bold?'font-bold':''}" style="color:${row.highlight==='success'?'var(--brand-accent)':row.highlight==='danger'?'var(--brand-danger)':''}">$${parseFloat(v).toLocaleString()}</td>`).join('')}
                  </tr>`
                ).join('')}
              </tbody>
            </table>
          </div>
        </div>
      `;
    }
  }

  render();
}
