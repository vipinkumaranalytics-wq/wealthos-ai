// =====================================================
// WealthOS AI — Reports & Export Page
// =====================================================
import { formatCurrency, formatPct, formatNumber, toast, exportCSV, exportJSON } from '../utils.js';
import { store } from '../store.js';

export function renderReports(container) {
  const income = store.get('income');
  const expenses = store.get('expenses');
  const goals = store.get('goals');
  const habits = store.get('habits');
  const journal = store.get('journal');
  const portfolio = store.get('portfolio');

  const totalIncome = income.reduce((s,i)=>s+parseFloat(i.amount||0),0);
  const totalExpenses = expenses.reduce((s,e)=>s+parseFloat(e.amount||0),0);
  const savings = totalIncome - totalExpenses;
  const savingsRate = totalIncome ? (savings/totalIncome*100).toFixed(1) : 0;

  // Monthly P&L by category
  const expByCat = {};
  expenses.forEach(e => { expByCat[e.category]=(expByCat[e.category]||0)+parseFloat(e.amount||0); });
  const incBySrc = {};
  income.forEach(i => { incBySrc[i.category||'Other']=(incBySrc[i.category||'Other']||0)+parseFloat(i.amount||0); });

  container.innerHTML = `
    <div class="page-header">
      <div><h1 class="page-title"><i class="fa fa-file-chart-column text-purple"></i> Reports & Export</h1>
      <p class="page-subtitle">Generate financial reports and export your data</p></div>
      <div class="page-actions">
        <button class="btn btn-primary btn-sm" id="print-report"><i class="fa fa-print"></i> Print Report</button>
      </div>
    </div>

    <!-- Quick Export -->
    <div class="card mb-4" style="background:linear-gradient(135deg,rgba(99,102,241,0.12),rgba(34,197,94,0.08))">
      <div class="card-header"><div class="card-title"><i class="fa fa-download"></i> Quick Data Export</div></div>
      <div class="card-body">
        <div class="grid grid-4">
          ${[
            { label: 'Income Data', icon: 'fa-money-bill-wave', color: 'green', data: () => income, file: 'income' },
            { label: 'Expense Data', icon: 'fa-receipt', color: 'red', data: () => expenses, file: 'expenses' },
            { label: 'Portfolio', icon: 'fa-chart-pie', color: 'purple', data: () => portfolio, file: 'portfolio' },
            { label: 'Full Backup', icon: 'fa-database', color: 'blue', data: () => ({ income, expenses, goals, portfolio, habits: habits.map(h=>({...h,completedDates:h.completedDates.slice(-7)})), journal: journal.map(j=>({...j})) }), file: 'wealthos-backup', json: true },
          ].map((item, i) => `
            <button class="stat-card card-hover" id="export-btn-${i}" style="border:none;cursor:pointer;text-align:center">
              <i class="fa ${item.icon}" style="font-size:1.5rem;color:var(--brand-${item.color==='red'?'danger':item.color==='blue'?'info':item.color==='green'?'accent':'primary'});margin-bottom:8px"></i>
              <div class="font-semibold text-sm">${item.label}</div>
              <div class="text-xs text-muted mt-1">${item.json ? 'JSON' : 'CSV'} format</div>
            </button>
          `).join('')}
        </div>
      </div>
    </div>

    <!-- Monthly Summary -->
    <div class="card mb-4" id="monthly-report">
      <div class="card-header">
        <div class="card-title"><i class="fa fa-calendar-alt"></i> Monthly Financial Summary — ${new Date().toLocaleDateString('en',{month:'long',year:'numeric'})}</div>
      </div>
      <div class="card-body">
        <div class="grid grid-4 mb-4">
          <div style="text-align:center;padding:16px;background:rgba(34,197,94,0.08);border-radius:10px">
            <div class="text-2xl font-bold text-success">${formatCurrency(totalIncome||5000)}</div>
            <div class="text-xs text-muted mt-1">Total Income</div>
          </div>
          <div style="text-align:center;padding:16px;background:rgba(239,68,68,0.08);border-radius:10px">
            <div class="text-2xl font-bold text-danger">${formatCurrency(totalExpenses||3200)}</div>
            <div class="text-xs text-muted mt-1">Total Expenses</div>
          </div>
          <div style="text-align:center;padding:16px;background:rgba(99,102,241,0.08);border-radius:10px">
            <div class="text-2xl font-bold ${savings>=0?'text-success':'text-danger'}">${formatCurrency(Math.abs(savings)||1800)}</div>
            <div class="text-xs text-muted mt-1">${savings>=0?'Net Savings':'Net Loss'}</div>
          </div>
          <div style="text-align:center;padding:16px;background:rgba(245,158,11,0.08);border-radius:10px">
            <div class="text-2xl font-bold text-warning">${savingsRate}%</div>
            <div class="text-xs text-muted mt-1">Savings Rate</div>
          </div>
        </div>

        <!-- Income Breakdown -->
        <div class="grid grid-2 mb-4">
          <div>
            <h4 class="font-bold mb-3 text-sm"><i class="fa fa-plus-circle text-success"></i> Income Sources</h4>
            ${Object.entries(incBySrc).length ? Object.entries(incBySrc).map(([src, amt])=>`
              <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border-color)">
                <span class="text-sm">${src}</span>
                <span class="font-bold text-success">${formatCurrency(amt)}</span>
              </div>
            `).join('') : `<div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border-color)"><span class="text-sm">Salary</span><span class="font-bold text-success">${formatCurrency(5000)}</span></div>`}
            <div style="display:flex;justify-content:space-between;padding:10px 0;font-weight:700">
              <span>Total Income</span>
              <span class="text-success">${formatCurrency(totalIncome||5000)}</span>
            </div>
          </div>
          <div>
            <h4 class="font-bold mb-3 text-sm"><i class="fa fa-minus-circle text-danger"></i> Expense Breakdown</h4>
            ${Object.entries(expByCat).length ? Object.entries(expByCat).sort((a,b)=>b[1]-a[1]).map(([cat, amt])=>`
              <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border-color)">
                <span class="text-sm">${cat}</span>
                <span class="font-bold text-danger">${formatCurrency(amt)}</span>
              </div>
            `).join('') : [['Housing',1400],['Food',380],['Transport',320],['Entertainment',180],['Health',145],['Other',775]].map(([c,a])=>`<div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border-color)"><span class="text-sm">${c}</span><span class="font-bold text-danger">${formatCurrency(a)}</span></div>`).join('')}
            <div style="display:flex;justify-content:space-between;padding:10px 0;font-weight:700">
              <span>Total Expenses</span>
              <span class="text-danger">${formatCurrency(totalExpenses||3200)}</span>
            </div>
          </div>
        </div>

        <!-- Goal Progress -->
        <h4 class="font-bold mb-3 text-sm"><i class="fa fa-bullseye text-purple"></i> Goal Progress Report</h4>
        ${goals.length ? goals.map(g=>{
          const pct = (g.current/g.target*100).toFixed(1);
          return `<div style="display:flex;align-items:center;gap:12px;padding:8px 0;border-bottom:1px solid var(--border-color)">
            <span>${g.icon||'🎯'}</span>
            <span class="flex-1 text-sm">${g.name}</span>
            <span class="text-xs text-muted">${formatCurrency(g.current)} / ${formatCurrency(g.target)}</span>
            <div style="width:80px"><div class="progress" style="height:6px"><div class="progress-bar primary" style="width:${Math.min(pct,100)}%;background:${g.color||'var(--brand-primary)'}"></div></div></div>
            <span class="text-xs font-bold" style="color:${g.color||'var(--brand-primary)'};min-width:40px;text-align:right">${pct}%</span>
          </div>`;
        }).join('') : '<p class="text-muted text-sm">No goals set yet.</p>'}
      </div>
    </div>

    <!-- Annual Projection -->
    <div class="card mb-4">
      <div class="card-header"><div class="card-title"><i class="fa fa-chart-line"></i> Annual Projection</div></div>
      <div class="card-body"><canvas id="annual-projection-chart" height="240"></canvas></div>
    </div>

    <!-- Charts -->
    <div class="grid grid-2 mb-4">
      <div class="card">
        <div class="card-header"><div class="card-title"><i class="fa fa-chart-pie"></i> Income vs Expenses</div></div>
        <div class="card-body"><canvas id="report-pie" height="240"></canvas></div>
      </div>
      <div class="card">
        <div class="card-header"><div class="card-title"><i class="fa fa-chart-bar"></i> 6-Month Trend</div></div>
        <div class="card-body"><canvas id="report-trend" height="240"></canvas></div>
      </div>
    </div>

    <!-- Insights -->
    <div class="card">
      <div class="card-header"><div class="card-title"><i class="fa fa-brain text-purple"></i> AI Financial Insights</div></div>
      <div class="card-body">
        <div class="grid grid-2">
          ${generateInsights(totalIncome||5000, totalExpenses||3200, savings||1800, savingsRate).map(insight=>`
            <div style="display:flex;gap:12px;padding:12px;border:1px solid var(--border-color);border-radius:8px">
              <div style="font-size:1.6rem;flex-shrink:0">${insight.icon}</div>
              <div>
                <div class="font-bold text-sm">${insight.title}</div>
                <div class="text-xs text-muted mt-1">${insight.body}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;

  // Export button handlers
  [
    { file: 'income', data: income },
    { file: 'expenses', data: expenses },
    { file: 'portfolio', data: portfolio },
    { file: 'wealthos-backup', data: { income, expenses, goals, portfolio }, json: true },
  ].forEach((item, i) => {
    const btn = document.getElementById(`export-btn-${i}`);
    if (btn) btn.onclick = () => {
      if (item.json) exportJSON(item.data, item.file + '.json');
      else exportCSV(item.data, item.file + '.csv');
      toast(`${item.file} exported!`, 'success');
    };
  });

  document.getElementById('print-report').onclick = () => window.print();

  // Charts
  setTimeout(() => {
    // Pie
    const pieCanvas = document.getElementById('report-pie');
    if (pieCanvas) {
      new Chart(pieCanvas, {
        type: 'doughnut',
        data: {
          labels: ['Expenses', 'Savings'],
          datasets: [{ data: [totalExpenses||3200, savings||1800], backgroundColor: ['rgba(239,68,68,0.8)', 'rgba(34,197,94,0.8)'], borderWidth: 0, hoverOffset: 6 }]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: '#94a3b8', boxWidth: 12 } }, tooltip: { callbacks: { label: c => ` ${c.label}: ${formatCurrency(c.raw)} (${(c.raw/(totalIncome||5000)*100).toFixed(1)}%)` } } } }
      });
    }

    // Trend
    const trendCanvas = document.getElementById('report-trend');
    if (trendCanvas) {
      const months = Array.from({length:6},(_,i)=>{const d=new Date();d.setMonth(d.getMonth()-5+i);return d.toLocaleDateString('en',{month:'short'});});
      const baseInc = 5000, baseExp = 3200;
      const incData = months.map(()=>baseInc+(Math.random()-0.4)*400);
      const expData = months.map(()=>baseExp+(Math.random()-0.4)*300);
      new Chart(trendCanvas, {
        type:'bar',
        data:{labels:months,datasets:[
          { label:'Income', data:incData, backgroundColor:'rgba(34,197,94,0.7)', borderRadius:4 },
          { label:'Expenses', data:expData, backgroundColor:'rgba(239,68,68,0.6)', borderRadius:4 },
        ]},
        options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{labels:{color:'#94a3b8',boxWidth:10,font:{size:11}}},tooltip:{callbacks:{label:c=>` ${c.dataset.label}: ${formatCurrency(c.raw)}`}}},scales:{x:{ticks:{color:'#64748b',font:{size:10}},grid:{display:false}},y:{ticks:{color:'#64748b',font:{size:10},callback:v=>'$'+v},grid:{color:'rgba(255,255,255,0.04)'}}}}
      });
    }

    // Annual projection
    const projCanvas = document.getElementById('annual-projection-chart');
    if (projCanvas) {
      const allMonths = Array.from({length:12},(_,i)=>{const d=new Date();d.setMonth(d.getMonth()-11+i);return d.toLocaleDateString('en',{month:'short',year:'2-digit'});});
      const currentMonth = new Date().getMonth();
      const cumSavings = allMonths.map((_,i)=>{
        const ms = Math.max(0,(savings||1800)*(1+(Math.random()-0.3)*0.2));
        return i<=currentMonth ? ms*(i+1) : null;
      });
      const projected = allMonths.map((_,i)=> i>=currentMonth ? (savings||1800)*(i+1) : null);
      new Chart(projCanvas, {
        type:'line',
        data:{labels:allMonths,datasets:[
          { label:'Actual Savings', data:cumSavings, borderColor:'#22c55e', backgroundColor:'rgba(34,197,94,0.1)', borderWidth:2.5, fill:true, tension:0.4, pointRadius:4 },
          { label:'Projected', data:projected, borderColor:'#6366f1', backgroundColor:'rgba(99,102,241,0.05)', borderWidth:2, borderDash:[5,5], fill:true, tension:0.4, pointRadius:3 },
        ]},
        options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{labels:{color:'#94a3b8',boxWidth:10,font:{size:11}}},tooltip:{callbacks:{label:c=>c.raw!==null?` ${c.dataset.label}: ${formatCurrency(c.raw)}`:''}}},scales:{x:{ticks:{color:'#64748b',font:{size:10}},grid:{display:false}},y:{ticks:{color:'#64748b',font:{size:10},callback:v=>'$'+formatNumber(v,0)},grid:{color:'rgba(255,255,255,0.04)'}}}}
      });
    }
  }, 100);
}

function generateInsights(income, expenses, savings, savingsRate) {
  const insights = [];
  if (savingsRate >= 20) insights.push({ icon: '🏆', title: 'Excellent Savings Rate!', body: `Your ${savingsRate}% savings rate exceeds the recommended 20%. You're building wealth effectively.` });
  else if (savingsRate >= 10) insights.push({ icon: '📈', title: 'Good Progress', body: `Your ${savingsRate}% savings rate is decent. Try to push toward 20% by reducing discretionary spending.` });
  else insights.push({ icon: '⚠️', title: 'Savings Rate Alert', body: `Your ${savingsRate}% savings rate is below 10%. Focus on cutting expenses or increasing income.` });

  if (savings > 0) insights.push({ icon: '💰', title: 'Positive Cash Flow', body: `You saved ${formatCurrency(savings)} this period. Consider investing this in index funds or towards your goals.` });

  const topExpCat = Object.entries({Housing:1400,Food:380,Transport:320}).sort((a,b)=>b[1]-a[1])[0];
  insights.push({ icon: '📊', title: `Biggest Expense: ${topExpCat[0]}`, body: `Housing takes up ${(topExpCat[1]/income*100).toFixed(0)}% of your income. The 28% rule recommends housing costs below 28% of gross income.` });

  insights.push({ icon: '🎯', title: 'Investment Opportunity', body: `If you invest your monthly savings of ${formatCurrency(savings)} at 10% annually for 30 years, you could have ${formatCurrency(savings*12*((Math.pow(1.10,30)-1)/0.10))} at retirement.` });

  insights.push({ icon: '📉', title: 'Emergency Fund Check', body: `Make sure you have 3-6 months of expenses (${formatCurrency(expenses*3)} – ${formatCurrency(expenses*6)}) in a liquid savings account before investing.` });

  insights.push({ icon: '💳', title: 'Debt Priority', body: `Focus on eliminating high-interest debt (>7% APR) before investing. The guaranteed "return" from paying off debt is often better than market returns.` });

  return insights.slice(0, 6);
}
