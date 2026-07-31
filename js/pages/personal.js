// =====================================================
// WealthOS AI — Personal Wealth Management Pages
// =====================================================
import { formatCurrency, formatPct, formatNumber, colorClass, toast, uid, exportCSV, generateSparkline } from '../utils.js';
import { store } from '../store.js';

// ---- PERSONAL DASHBOARD ----
export function renderPersonalDashboard(container) {
  const today = new Date().toISOString().split('T')[0];
  const thisMonth = today.slice(0, 7);
  const income = store.getTotalIncome(thisMonth);
  const expenses = store.getTotalExpenses(thisMonth);
  const savings = income - expenses;
  const { netWorth, investmentValue, totalDebt } = store.getNetWorth();
  const expByCat = store.getExpensesByCategory(thisMonth);

  container.innerHTML = `
    <div class="page-header">
      <div><h1 class="page-title"><i class="fa fa-wallet text-purple"></i> Personal Wealth Dashboard</h1>
      <p class="page-subtitle">Your complete financial health overview</p></div>
      <div class="page-actions">
        <button class="btn btn-secondary btn-sm" onclick="location.hash='#income-tracker'"><i class="fa fa-plus"></i> Add Income</button>
        <button class="btn btn-primary btn-sm" onclick="location.hash='#expense-tracker'"><i class="fa fa-minus"></i> Add Expense</button>
      </div>
    </div>

    <!-- Financial Health Score -->
    <div class="card mb-4" style="background:linear-gradient(135deg,rgba(99,102,241,0.15),rgba(34,197,94,0.1))">
      <div class="card-body">
        <div class="flex items-center gap-4 flex-wrap">
          <div style="text-align:center;min-width:80px">
            <div style="font-size:2.5rem;font-weight:900;color:var(--brand-accent)">82</div>
            <div style="font-size:0.75rem;color:var(--text-muted)">Financial Health Score</div>
          </div>
          <div style="flex:1">
            <div class="text-lg font-bold mb-1">💪 Your finances are on track!</div>
            <div class="text-sm text-muted mb-2">Based on your income, expenses, savings rate, and investments</div>
            <div class="flex gap-3 flex-wrap">
              ${[{l:'Savings Rate',v:'Good',c:'success'},{l:'Debt Load',v:'Low',c:'success'},{l:'Emergency Fund',v:'Building',c:'warning'},{l:'Investments',v:'Active',c:'success'}].map(x=>
                `<span class="badge badge-${x.c}">${x.l}: ${x.v}</span>`
              ).join('')}
            </div>
          </div>
          <div style="text-align:right">
            <div class="text-sm text-muted">Savings Rate</div>
            <div class="text-2xl font-bold text-success">${income ? (savings/income*100).toFixed(1) : 0}%</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Key Stats -->
    <div class="grid grid-4 mb-4">
      <div class="stat-card">
        <div class="stat-icon green"><i class="fa fa-money-bill-wave"></i></div>
        <div class="stat-label">Monthly Income</div>
        <div class="stat-value">${formatCurrency(income || 5000)}</div>
        <div class="stat-change positive"><i class="fa fa-calendar"></i> This month</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon red"><i class="fa fa-receipt"></i></div>
        <div class="stat-label">Monthly Expenses</div>
        <div class="stat-value">${formatCurrency(expenses || 3200)}</div>
        <div class="stat-change ${(expenses/income)>0.7?'negative':'positive'}">
          <i class="fa fa-${(expenses/income)>0.7?'exclamation':'check'}"></i>
          ${income ? ((expenses/income)*100).toFixed(0) : 64}% of income
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon ${savings>=0?'green':'red'}"><i class="fa fa-piggy-bank"></i></div>
        <div class="stat-label">Monthly Savings</div>
        <div class="stat-value ${colorClass(savings)}">${formatCurrency(savings || 1800)}</div>
        <div class="stat-change ${savings>=0?'positive':'negative'}">
          <i class="fa fa-arrow-${savings>=0?'up':'down'}"></i> Net this month
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon purple"><i class="fa fa-chart-area"></i></div>
        <div class="stat-label">Net Worth</div>
        <div class="stat-value">${formatCurrency(netWorth || 185000)}</div>
        <div class="stat-change positive"><i class="fa fa-arrow-up"></i> +2.4% this month</div>
      </div>
    </div>

    <!-- Charts Row -->
    <div class="grid grid-2 mb-4">
      <div class="card">
        <div class="card-header"><div class="card-title"><i class="fa fa-chart-pie"></i> Expense Breakdown</div></div>
        <div class="card-body"><canvas id="expense-pie" height="220"></canvas></div>
      </div>
      <div class="card">
        <div class="card-header"><div class="card-title"><i class="fa fa-chart-line"></i> Income vs Expenses (6 Months)</div></div>
        <div class="card-body"><canvas id="income-expense-chart" height="220"></canvas></div>
      </div>
    </div>

    <!-- Goals + Budget -->
    <div class="grid grid-2 mb-4">
      <div class="card">
        <div class="card-header">
          <div class="card-title"><i class="fa fa-bullseye"></i> Financial Goals</div>
          <a href="#goal-planner" class="btn-text btn">Manage</a>
        </div>
        <div class="card-body">
          ${store.get('goals').map(g => {
            const pct = Math.min((g.current/g.target)*100, 100).toFixed(0);
            return `
              <div class="goal-card mb-3">
                <div class="goal-header">
                  <span>${g.icon || '🎯'} <strong>${g.name}</strong></span>
                  <span class="goal-pct">${pct}%</span>
                </div>
                <div class="progress mb-2"><div class="progress-bar primary" style="width:${pct}%;background:${g.color||'var(--brand-primary)'}"></div></div>
                <div class="flex justify-between text-xs text-muted">
                  <span>${formatCurrency(g.current)} saved</span>
                  <span>Goal: ${formatCurrency(g.target)}</span>
                  <span>By ${g.deadline}</span>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
      <div class="card">
        <div class="card-header">
          <div class="card-title"><i class="fa fa-scale-balanced"></i> Budget Status</div>
          <a href="#budget-planner" class="btn-text btn">Edit</a>
        </div>
        <div class="card-body">
          ${[
            { cat: '🏠 Housing', budget: 1500, spent: 1400, color: '#6366f1' },
            { cat: '🍔 Food & Dining', budget: 600, spent: 720, color: '#ef4444' },
            { cat: '🚗 Transport', budget: 400, spent: 320, color: '#22c55e' },
            { cat: '🎮 Entertainment', budget: 200, spent: 180, color: '#f59e0b' },
            { cat: '💊 Health', budget: 300, spent: 145, color: '#3b82f6' },
            { cat: '🛍️ Shopping', budget: 500, spent: 430, color: '#8b5cf6' },
          ].map(b => {
            const pct = Math.min((b.spent/b.budget)*100, 100);
            const over = b.spent > b.budget;
            return `<div class="budget-bar">
              <div class="budget-bar-meta">
                <span class="budget-bar-label">${b.cat}</span>
                <span class="budget-bar-value ${over?'text-danger':'text-primary'}">${formatCurrency(b.spent)} / ${formatCurrency(b.budget)}</span>
              </div>
              <div class="progress"><div class="progress-bar ${over?'danger':'primary'}" style="width:${pct}%;background:${over?'var(--brand-danger)':b.color}"></div></div>
            </div>`;
          }).join('')}
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="card">
      <div class="card-header"><div class="card-title"><i class="fa fa-bolt"></i> Quick Actions</div></div>
      <div class="card-body">
        <div class="grid grid-4">
          ${[
            { label: 'Add Income', icon: 'fa-plus-circle', color: 'green', href: '#income-tracker' },
            { label: 'Log Expense', icon: 'fa-minus-circle', color: 'red', href: '#expense-tracker' },
            { label: 'Set Goal', icon: 'fa-bullseye', color: 'purple', href: '#goal-planner' },
            { label: 'View Report', icon: 'fa-file-chart-column', color: 'blue', href: '#reports' },
          ].map(a => `
            <a href="${a.href}" class="stat-card card-hover" style="text-align:center;border-top:none;text-decoration:none">
              <i class="fa ${a.icon}" style="font-size:1.8rem;color:var(--brand-${a.color==='red'?'danger':a.color==='blue'?'info':a.color==='green'?'accent':'primary'});margin-bottom:8px"></i>
              <div class="font-semibold text-sm">${a.label}</div>
            </a>
          `).join('')}
        </div>
      </div>
    </div>
  `;

  // Render charts
  setTimeout(() => {
    // Expense pie
    const catData = Object.keys(expByCat).length ? expByCat : {
      Housing: 1400, Food: 720, Transport: 320, Entertainment: 180, Health: 145, Shopping: 430, Other: 200
    };
    const pieCanvas = document.getElementById('expense-pie');
    if (pieCanvas) {
      const colors = ['#6366f1','#22c55e','#f59e0b','#ef4444','#3b82f6','#8b5cf6','#14b8a6','#ec4899'];
      new Chart(pieCanvas, {
        type: 'doughnut',
        data: {
          labels: Object.keys(catData),
          datasets: [{ data: Object.values(catData), backgroundColor: Object.keys(catData).map((_,i)=>colors[i%colors.length]+'cc'), borderWidth: 0, hoverOffset: 6 }]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'right', labels: { color: '#94a3b8', boxWidth: 10, font: { size: 10 } } }, tooltip: { callbacks: { label: c => ` ${c.label}: ${formatCurrency(c.raw)}` } } } }
      });
    }

    // Income vs Expense chart
    const ieCanvas = document.getElementById('income-expense-chart');
    if (ieCanvas) {
      const months = ['Aug','Sep','Oct','Nov','Dec','Jan'];
      const incData = [4800,5100,4950,5200,5500,5000];
      const expData = [3800,4100,3600,3900,4200,3200];
      new Chart(ieCanvas, {
        type: 'bar',
        data: {
          labels: months,
          datasets: [
            { label: 'Income', data: incData, backgroundColor: 'rgba(34,197,94,0.7)', borderRadius: 6 },
            { label: 'Expenses', data: expData, backgroundColor: 'rgba(239,68,68,0.6)', borderRadius: 6 },
          ]
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: { legend: { labels: { color: '#94a3b8', boxWidth: 10, font: { size: 11 } } }, tooltip: { callbacks: { label: c => ` ${c.dataset.label}: ${formatCurrency(c.raw)}` } } },
          scales: { x: { ticks: { color: '#64748b', font: { size: 10 } }, grid: { display: false } }, y: { ticks: { color: '#64748b', font: { size: 10 }, callback: v => '$'+formatNumber(v,0) }, grid: { color: 'rgba(255,255,255,0.04)' } } }
        }
      });
    }
  }, 100);
}

// ---- INCOME TRACKER ----
export function renderIncomeTracker(container) {
  let income = store.get('income');

  // Add demo data if empty
  if (!income.length) {
    income = [
      { id: uid('i'), source: 'Salary', amount: 5000, category: 'Employment', date: new Date().toISOString().split('T')[0], note: 'Monthly salary' },
      { id: uid('i'), source: 'Freelance', amount: 800, category: 'Freelance', date: new Date().toISOString().split('T')[0], note: 'Web development project' },
      { id: uid('i'), source: 'Dividends', amount: 125, category: 'Investment', date: new Date().toISOString().split('T')[0], note: 'Stock dividends' },
    ];
    store.set('income', income);
  }

  const totalIncome = income.reduce((s,i)=>s+parseFloat(i.amount),0);

  container.innerHTML = `
    <div class="page-header">
      <div><h1 class="page-title"><i class="fa fa-money-bill-wave text-success"></i> Income Tracker</h1>
      <p class="page-subtitle">Track all your income sources</p></div>
      <div class="page-actions">
        <button class="btn btn-primary btn-sm" id="add-income-btn"><i class="fa fa-plus"></i> Add Income</button>
        <button class="btn btn-secondary btn-sm" id="export-income-btn"><i class="fa fa-download"></i> Export</button>
      </div>
    </div>
    <div class="grid grid-3 mb-4">
      <div class="stat-card"><div class="stat-icon green"><i class="fa fa-coins"></i></div><div class="stat-label">Total Income</div><div class="stat-value text-success">${formatCurrency(totalIncome)}</div><div class="stat-change positive">All time</div></div>
      <div class="stat-card"><div class="stat-icon blue"><i class="fa fa-list"></i></div><div class="stat-label">Income Sources</div><div class="stat-value">${[...new Set(income.map(i=>i.category))].length}</div><div class="stat-change positive">Categories</div></div>
      <div class="stat-card"><div class="stat-icon orange"><i class="fa fa-calendar"></i></div><div class="stat-label">This Month</div><div class="stat-value">${formatCurrency(store.getTotalIncome(new Date().toISOString().slice(0,7)))}</div><div class="stat-change positive">Monthly total</div></div>
    </div>
    <div class="card">
      <div class="card-header"><div class="card-title"><i class="fa fa-money-bill-wave"></i> Income History</div></div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Date</th><th>Source</th><th>Category</th><th>Amount</th><th>Note</th><th>Action</th></tr></thead>
          <tbody id="income-tbody">
            ${income.map(i=>`<tr>
              <td class="text-sm text-muted">${i.date}</td>
              <td class="font-semibold">${i.source}</td>
              <td><span class="badge badge-success">${i.category}</span></td>
              <td class="mono font-bold text-success">+${formatCurrency(parseFloat(i.amount))}</td>
              <td class="text-muted text-sm">${i.note||'—'}</td>
              <td><button class="btn btn-sm text-danger" onclick="deleteIncome('${i.id}')"><i class="fa fa-trash"></i></button></td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;

  window.deleteIncome = (id) => {
    store.update('income', list => list.filter(i => i.id !== id));
    toast('Income record deleted', 'info');
    renderIncomeTracker(container);
  };

  document.getElementById('add-income-btn').onclick = () => showAddModal(container);
  document.getElementById('export-income-btn').onclick = () => {
    exportCSV(store.get('income'), 'income.csv');
    toast('Income exported!', 'success');
  };

  function showAddModal(container) {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
      <div class="modal">
        <div class="modal-header"><h3 class="modal-title"><i class="fa fa-plus text-success"></i> Add Income</h3>
          <button class="modal-close btn" id="close-income-modal"><i class="fa fa-times"></i></button>
        </div>
        <div class="modal-body">
          <div class="form-row">
            <div class="form-group"><label class="form-label">Source</label><input type="text" id="inc-source" class="form-control" placeholder="e.g. Salary, Freelance"/></div>
            <div class="form-group"><label class="form-label">Amount ($)</label><input type="number" id="inc-amount" class="form-control" placeholder="0.00"/></div>
          </div>
          <div class="form-row">
            <div class="form-group"><label class="form-label">Category</label>
              <select id="inc-category" class="form-select">
                ${['Employment','Freelance','Investment','Business','Rental','Other'].map(c=>`<option>${c}</option>`).join('')}
              </select>
            </div>
            <div class="form-group"><label class="form-label">Date</label><input type="date" id="inc-date" class="form-control" value="${new Date().toISOString().split('T')[0]}"/></div>
          </div>
          <div class="form-group"><label class="form-label">Note (optional)</label><input type="text" id="inc-note" class="form-control" placeholder="Additional notes..."/></div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="this.closest('.modal-overlay').remove()">Cancel</button>
          <button class="btn btn-primary" id="save-income"><i class="fa fa-check"></i> Save Income</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    document.getElementById('close-income-modal').onclick = () => overlay.remove();
    document.getElementById('save-income').onclick = () => {
      const source = document.getElementById('inc-source').value.trim();
      const amount = parseFloat(document.getElementById('inc-amount').value);
      const category = document.getElementById('inc-category').value;
      const date = document.getElementById('inc-date').value;
      const note = document.getElementById('inc-note').value;
      if (!source || !amount) { toast('Please fill required fields', 'warning'); return; }
      store.addIncome({ id: uid('i'), source, amount, category, date, note });
      overlay.remove();
      toast('Income added!', 'success');
      renderIncomeTracker(container);
    };
  }
}

// ---- EXPENSE TRACKER ----
export function renderExpenseTracker(container) {
  let expenses = store.get('expenses');

  if (!expenses.length) {
    expenses = [
      { id: uid('e'), merchant: 'Whole Foods', amount: 145.32, category: 'Groceries', date: new Date().toISOString().split('T')[0], paymentMethod: 'Credit Card' },
      { id: uid('e'), merchant: 'Netflix', amount: 15.99, category: 'Entertainment', date: new Date().toISOString().split('T')[0], paymentMethod: 'Credit Card' },
      { id: uid('e'), merchant: 'Shell Gas Station', amount: 58.00, category: 'Transport', date: new Date().toISOString().split('T')[0], paymentMethod: 'Debit Card' },
      { id: uid('e'), merchant: 'Chipotle', amount: 12.50, category: 'Dining', date: new Date().toISOString().split('T')[0], paymentMethod: 'Cash' },
    ];
    store.set('expenses', expenses);
  }

  const totalExp = expenses.reduce((s,e)=>s+parseFloat(e.amount),0);
  const catTotals = {};
  expenses.forEach(e => { catTotals[e.category]=(catTotals[e.category]||0)+parseFloat(e.amount); });
  const topCat = Object.entries(catTotals).sort((a,b)=>b[1]-a[1])[0];

  container.innerHTML = `
    <div class="page-header">
      <div><h1 class="page-title"><i class="fa fa-receipt text-danger"></i> Expense Tracker</h1>
      <p class="page-subtitle">Monitor and categorize all your spending</p></div>
      <div class="page-actions">
        <button class="btn btn-primary btn-sm" id="add-exp-btn"><i class="fa fa-plus"></i> Add Expense</button>
        <button class="btn btn-secondary btn-sm" id="export-exp-btn"><i class="fa fa-download"></i> Export</button>
      </div>
    </div>
    <div class="grid grid-4 mb-4">
      <div class="stat-card"><div class="stat-icon red"><i class="fa fa-receipt"></i></div><div class="stat-label">Total Expenses</div><div class="stat-value text-danger">${formatCurrency(totalExp)}</div><div class="stat-change negative">All time</div></div>
      <div class="stat-card"><div class="stat-icon orange"><i class="fa fa-calendar"></i></div><div class="stat-label">This Month</div><div class="stat-value">${formatCurrency(store.getTotalExpenses(new Date().toISOString().slice(0,7)))}</div><div class="stat-change negative">Monthly</div></div>
      <div class="stat-card"><div class="stat-icon blue"><i class="fa fa-tag"></i></div><div class="stat-label">Top Category</div><div class="stat-value text-sm">${topCat?.[0]||'—'}</div><div class="stat-change negative">${formatCurrency(topCat?.[1]||0)}</div></div>
      <div class="stat-card"><div class="stat-icon purple"><i class="fa fa-list"></i></div><div class="stat-label">Transactions</div><div class="stat-value">${expenses.length}</div><div class="stat-change positive">Logged</div></div>
    </div>
    <div class="grid grid-2 mb-4">
      <div class="card">
        <div class="card-header"><div class="card-title"><i class="fa fa-chart-pie"></i> By Category</div></div>
        <div class="card-body"><canvas id="exp-cat-chart" height="220"></canvas></div>
      </div>
      <div class="card">
        <div class="card-header"><div class="card-title"><i class="fa fa-list"></i> Category Breakdown</div></div>
        <div class="card-body">
          ${Object.entries(catTotals).sort((a,b)=>b[1]-a[1]).map(([cat,amt]) => `
            <div class="budget-bar">
              <div class="budget-bar-meta">
                <span class="budget-bar-label">${cat}</span>
                <span class="budget-bar-value">${formatCurrency(amt)} <span class="text-muted">(${(amt/totalExp*100).toFixed(0)}%)</span></span>
              </div>
              <div class="progress"><div class="progress-bar danger" style="width:${(amt/totalExp*100).toFixed(0)}%"></div></div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
    <div class="card">
      <div class="card-header">
        <div class="card-title"><i class="fa fa-receipt"></i> All Transactions</div>
        <input type="text" id="exp-search" class="form-control" placeholder="Search..." style="width:180px"/>
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Date</th><th>Merchant</th><th>Category</th><th>Amount</th><th>Payment</th><th>Action</th></tr></thead>
          <tbody id="expense-tbody">
            ${expenses.map(e=>`<tr>
              <td class="text-xs text-muted">${e.date}</td>
              <td class="font-semibold">${e.merchant}</td>
              <td><span class="badge badge-danger">${e.category}</span></td>
              <td class="mono font-bold text-danger">-${formatCurrency(parseFloat(e.amount))}</td>
              <td class="text-sm text-muted">${e.paymentMethod||'—'}</td>
              <td><button class="btn btn-sm text-danger" onclick="deleteExpense('${e.id}')"><i class="fa fa-trash"></i></button></td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;

  window.deleteExpense = (id) => {
    store.update('expenses', list => list.filter(e => e.id !== id));
    toast('Expense deleted', 'info');
    renderExpenseTracker(container);
  };

  setTimeout(() => {
    const canvas = document.getElementById('exp-cat-chart');
    if (!canvas || !Object.keys(catTotals).length) return;
    const colors = ['#ef4444','#f97316','#f59e0b','#84cc16','#22c55e','#14b8a6','#3b82f6','#8b5cf6','#ec4899','#64748b'];
    new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels: Object.keys(catTotals),
        datasets: [{ data: Object.values(catTotals), backgroundColor: Object.keys(catTotals).map((_,i)=>colors[i%colors.length]+'cc'), borderWidth: 0, hoverOffset: 6 }]
      },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'right', labels: { color: '#94a3b8', boxWidth: 10, font: { size: 10 } } }, tooltip: { callbacks: { label: c => ` ${c.label}: ${formatCurrency(c.raw)} (${(c.raw/totalExp*100).toFixed(1)}%)` } } } }
    });
  }, 100);

  document.getElementById('add-exp-btn').onclick = () => showAddExpModal(container);
  document.getElementById('export-exp-btn').onclick = () => { exportCSV(expenses, 'expenses.csv'); toast('Exported!', 'success'); };
  document.getElementById('exp-search').addEventListener('input', e => {
    const q = e.target.value.toLowerCase();
    document.querySelectorAll('#expense-tbody tr').forEach(tr => { tr.style.display = tr.textContent.toLowerCase().includes(q) ? '' : 'none'; });
  });

  function showAddExpModal() {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
      <div class="modal">
        <div class="modal-header"><h3 class="modal-title"><i class="fa fa-minus text-danger"></i> Add Expense</h3>
          <button class="modal-close btn" onclick="this.closest('.modal-overlay').remove()"><i class="fa fa-times"></i></button>
        </div>
        <div class="modal-body">
          <div class="form-row">
            <div class="form-group"><label class="form-label">Merchant / Description</label><input type="text" id="exp-merchant" class="form-control" placeholder="e.g. Starbucks"/></div>
            <div class="form-group"><label class="form-label">Amount ($)</label><input type="number" id="exp-amount" class="form-control" placeholder="0.00" step="0.01"/></div>
          </div>
          <div class="form-row">
            <div class="form-group"><label class="form-label">Category</label>
              <select id="exp-category" class="form-select">
                ${['Housing','Food','Groceries','Dining','Transport','Entertainment','Health','Shopping','Utilities','Education','Travel','Other'].map(c=>`<option>${c}</option>`).join('')}
              </select>
            </div>
            <div class="form-group"><label class="form-label">Payment Method</label>
              <select id="exp-payment" class="form-select">
                ${['Credit Card','Debit Card','Cash','UPI','Net Banking'].map(p=>`<option>${p}</option>`).join('')}
              </select>
            </div>
          </div>
          <div class="form-group"><label class="form-label">Date</label><input type="date" id="exp-date" class="form-control" value="${new Date().toISOString().split('T')[0]}"/></div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="this.closest('.modal-overlay').remove()">Cancel</button>
          <button class="btn btn-primary" id="save-exp"><i class="fa fa-check"></i> Save Expense</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    document.getElementById('save-exp').onclick = () => {
      const merchant = document.getElementById('exp-merchant').value.trim();
      const amount = parseFloat(document.getElementById('exp-amount').value);
      const category = document.getElementById('exp-category').value;
      const paymentMethod = document.getElementById('exp-payment').value;
      const date = document.getElementById('exp-date').value;
      if (!merchant || !amount) { toast('Please fill required fields', 'warning'); return; }
      store.addExpense({ id: uid('e'), merchant, amount, category, date, paymentMethod });
      overlay.remove();
      toast('Expense logged!', 'success');
      renderExpenseTracker(container);
    };
  }
}

// ---- NET WORTH ----
export function renderNetWorth(container) {
  const assets = [
    { name: 'Stock Portfolio', value: 45000, type: 'Investment', color: '#6366f1' },
    { name: 'Crypto Holdings', value: 18000, type: 'Investment', color: '#f59e0b' },
    { name: 'Savings Account', value: 25000, type: 'Cash', color: '#22c55e' },
    { name: 'Emergency Fund', value: 15000, type: 'Cash', color: '#3b82f6' },
    { name: 'Real Estate', value: 0, type: 'Property', color: '#14b8a6' },
    { name: 'Retirement Account', value: 32000, type: 'Retirement', color: '#8b5cf6' },
  ];
  const liabilities = [
    { name: 'Student Loan', value: 12000, type: 'Education Debt', color: '#ef4444' },
    { name: 'Credit Card', value: 1800, type: 'Consumer Debt', color: '#f97316' },
    { name: 'Car Loan', value: 8500, type: 'Auto Loan', color: '#eab308' },
  ];
  const totalAssets = assets.reduce((s,a)=>s+a.value,0);
  const totalLiabilities = liabilities.reduce((s,l)=>s+l.value,0);
  const netWorth = totalAssets - totalLiabilities;

  container.innerHTML = `
    <div class="page-header">
      <div><h1 class="page-title"><i class="fa fa-chart-area text-purple"></i> Net Worth Tracker</h1>
      <p class="page-subtitle">Total assets minus total liabilities</p></div>
    </div>
    <div class="grid grid-3 mb-4">
      <div class="stat-card"><div class="stat-icon green"><i class="fa fa-plus-circle"></i></div><div class="stat-label">Total Assets</div><div class="stat-value text-success">${formatCurrency(totalAssets)}</div><div class="stat-change positive">What you own</div></div>
      <div class="stat-card"><div class="stat-icon red"><i class="fa fa-minus-circle"></i></div><div class="stat-label">Total Liabilities</div><div class="stat-value text-danger">${formatCurrency(totalLiabilities)}</div><div class="stat-change negative">What you owe</div></div>
      <div class="stat-card" style="border-top-color:var(--brand-primary)"><div class="stat-icon purple"><i class="fa fa-chart-area"></i></div><div class="stat-label">Net Worth</div><div class="stat-value text-purple">${formatCurrency(netWorth)}</div><div class="stat-change positive"><i class="fa fa-arrow-up"></i> +12.4% YTD</div></div>
    </div>
    <div class="grid grid-2 mb-4">
      <div class="card">
        <div class="card-header"><div class="card-title"><i class="fa fa-chart-line"></i> Net Worth Growth</div></div>
        <div class="card-body"><canvas id="nw-history-chart" height="220"></canvas></div>
      </div>
      <div class="card">
        <div class="card-header"><div class="card-title"><i class="fa fa-chart-pie"></i> Asset vs Liability</div></div>
        <div class="card-body"><canvas id="nw-pie-chart" height="220"></canvas></div>
      </div>
    </div>
    <div class="grid grid-2">
      <div class="card">
        <div class="card-header"><div class="card-title text-success"><i class="fa fa-plus-circle"></i> Assets</div>
          <button class="btn btn-sm btn-success"><i class="fa fa-plus"></i> Add</button>
        </div>
        <div class="card-body">
          ${assets.map(a=>`
            <div style="display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid var(--border-color)">
              <div style="width:10px;height:10px;border-radius:50%;background:${a.color};flex-shrink:0"></div>
              <div style="flex:1">
                <div class="font-semibold text-sm">${a.name}</div>
                <div class="text-xs text-muted">${a.type}</div>
              </div>
              <div class="font-bold text-success">${formatCurrency(a.value)}</div>
              <div class="text-xs text-muted">${(a.value/totalAssets*100).toFixed(1)}%</div>
            </div>
          `).join('')}
          <div style="display:flex;justify-content:space-between;padding-top:12px;font-weight:700">
            <span>Total Assets</span><span class="text-success">${formatCurrency(totalAssets)}</span>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="card-header"><div class="card-title text-danger"><i class="fa fa-minus-circle"></i> Liabilities</div>
          <button class="btn btn-sm btn-danger"><i class="fa fa-plus"></i> Add</button>
        </div>
        <div class="card-body">
          ${liabilities.map(l=>`
            <div style="display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid var(--border-color)">
              <div style="width:10px;height:10px;border-radius:50%;background:${l.color};flex-shrink:0"></div>
              <div style="flex:1">
                <div class="font-semibold text-sm">${l.name}</div>
                <div class="text-xs text-muted">${l.type}</div>
              </div>
              <div class="font-bold text-danger">${formatCurrency(l.value)}</div>
              <div class="text-xs text-muted">${(l.value/totalLiabilities*100).toFixed(1)}%</div>
            </div>
          `).join('')}
          <div style="display:flex;justify-content:space-between;padding-top:12px;font-weight:700">
            <span>Total Liabilities</span><span class="text-danger">${formatCurrency(totalLiabilities)}</span>
          </div>
        </div>
      </div>
    </div>
  `;

  setTimeout(() => {
    const histCanvas = document.getElementById('nw-history-chart');
    if (histCanvas) {
      const months = Array.from({length:12},(_,i)=>{const d=new Date();d.setMonth(d.getMonth()-11+i);return d.toLocaleDateString('en',{month:'short'});});
      const nwData = generateSparkline(12, netWorth * 0.7, 0.04).map((v,i)=>v*(1+i*0.008));
      new Chart(histCanvas, {
        type: 'line',
        data: {
          labels: months,
          datasets: [{ label: 'Net Worth', data: nwData, borderColor: '#6366f1', backgroundColor: 'rgba(99,102,241,0.1)', borderWidth: 2.5, pointRadius: 3, fill: true, tension: 0.4 }]
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: { legend: { display: false }, tooltip: { callbacks: { label: c => ` Net Worth: ${formatCurrency(c.raw)}` } } },
          scales: { x: { ticks: { color: '#64748b', font: { size: 10 } }, grid: { display: false } }, y: { ticks: { color: '#64748b', font: { size: 10 }, callback: v => '$'+formatNumber(v,0) }, grid: { color: 'rgba(255,255,255,0.04)' } } }
        }
      });
    }
    const pieCanvas = document.getElementById('nw-pie-chart');
    if (pieCanvas) {
      new Chart(pieCanvas, {
        type: 'doughnut',
        data: {
          labels: ['Assets', 'Liabilities'],
          datasets: [{ data: [totalAssets, totalLiabilities], backgroundColor: ['rgba(34,197,94,0.8)', 'rgba(239,68,68,0.7)'], borderWidth: 0, hoverOffset: 8 }]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: '#94a3b8', boxWidth: 12 } }, tooltip: { callbacks: { label: c => ` ${c.label}: ${formatCurrency(c.raw)}` } } } }
      });
    }
  }, 100);
}

// ---- GOAL PLANNER ----
export function renderGoalPlanner(container) {
  let goals = store.get('goals');

  function render() {
    const totalSaved = goals.reduce((s,g)=>s+g.current,0);
    const totalTarget = goals.reduce((s,g)=>s+g.target,0);
    container.innerHTML = `
      <div class="page-header">
        <div><h1 class="page-title"><i class="fa fa-bullseye text-purple"></i> Goal Planner</h1>
        <p class="page-subtitle">Set and track your financial goals</p></div>
        <div class="page-actions">
          <button class="btn btn-primary btn-sm" id="add-goal-btn"><i class="fa fa-plus"></i> Add Goal</button>
        </div>
      </div>
      <div class="grid grid-3 mb-4">
        <div class="stat-card"><div class="stat-icon purple"><i class="fa fa-bullseye"></i></div><div class="stat-label">Total Goals</div><div class="stat-value">${goals.length}</div><div class="stat-change positive">Active goals</div></div>
        <div class="stat-card"><div class="stat-icon green"><i class="fa fa-piggy-bank"></i></div><div class="stat-label">Total Saved</div><div class="stat-value">${formatCurrency(totalSaved)}</div><div class="stat-change positive">Across all goals</div></div>
        <div class="stat-card"><div class="stat-icon orange"><i class="fa fa-percent"></i></div><div class="stat-label">Overall Progress</div><div class="stat-value">${totalTarget?(totalSaved/totalTarget*100).toFixed(0):0}%</div><div class="stat-change positive">To all targets</div></div>
      </div>
      <div class="grid grid-auto">
        ${goals.map(g => {
          const pct = Math.min((g.current/g.target)*100,100);
          const remaining = g.target - g.current;
          const daysLeft = Math.ceil((new Date(g.deadline)-new Date())/86400000);
          const monthlyNeeded = daysLeft > 0 ? remaining/(daysLeft/30) : 0;
          return `
            <div class="card card-hover">
              <div class="card-body">
                <div class="flex justify-between mb-3">
                  <div class="flex items-center gap-2">
                    <span style="font-size:1.8rem">${g.icon||'🎯'}</span>
                    <div>
                      <div class="font-bold">${g.name}</div>
                      <div class="text-xs text-muted">Due: ${g.deadline}</div>
                    </div>
                  </div>
                  <div style="display:flex;gap:4px">
                    <button class="btn btn-sm btn-outline" onclick="addToGoal('${g.id}')"><i class="fa fa-plus"></i></button>
                    <button class="btn btn-sm text-danger" onclick="deleteGoalFn('${g.id}')"><i class="fa fa-trash"></i></button>
                  </div>
                </div>
                <div class="progress mb-2" style="height:8px"><div class="progress-bar" style="width:${pct}%;background:${g.color||'var(--brand-primary)'};border-radius:99px"></div></div>
                <div class="flex justify-between text-sm mb-2">
                  <span class="text-muted">Saved</span>
                  <span class="font-bold" style="color:${g.color||'var(--brand-primary)'}">${pct.toFixed(0)}%</span>
                </div>
                <div class="grid grid-2" style="gap:8px">
                  <div style="background:var(--bg-card);border-radius:8px;padding:8px;text-align:center">
                    <div class="text-sm font-bold text-success">${formatCurrency(g.current)}</div>
                    <div class="text-xs text-muted">Saved</div>
                  </div>
                  <div style="background:var(--bg-card);border-radius:8px;padding:8px;text-align:center">
                    <div class="text-sm font-bold">${formatCurrency(g.target)}</div>
                    <div class="text-xs text-muted">Target</div>
                  </div>
                </div>
                ${remaining > 0 ? `<div class="text-xs text-muted mt-3 text-center">Need ${formatCurrency(monthlyNeeded)}/month for ${daysLeft} days remaining</div>` : `<div class="success-box mt-3 text-sm"><i class="fa fa-check-circle"></i> Goal achieved! 🎉</div>`}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;

    document.getElementById('add-goal-btn').onclick = showAddGoalModal;
  }

  window.addToGoal = (id) => {
    const amt = parseFloat(prompt('How much to add to this goal? ($)') || '0');
    if (amt > 0) {
      const goal = goals.find(g => g.id === id);
      store.updateGoal(id, { current: Math.min(goal.current + amt, goal.target) });
      goals = store.get('goals');
      toast(`${formatCurrency(amt)} added to goal!`, 'success');
      render();
    }
  };

  window.deleteGoalFn = (id) => {
    if (confirm('Delete this goal?')) {
      store.deleteGoal(id);
      goals = store.get('goals');
      render();
      toast('Goal deleted', 'info');
    }
  };

  function showAddGoalModal() {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
      <div class="modal">
        <div class="modal-header"><h3 class="modal-title"><i class="fa fa-bullseye text-purple"></i> New Financial Goal</h3>
          <button class="modal-close btn" onclick="this.closest('.modal-overlay').remove()"><i class="fa fa-times"></i></button>
        </div>
        <div class="modal-body">
          <div class="form-group"><label class="form-label">Goal Name</label><input type="text" id="goal-name" class="form-control" placeholder="e.g. Buy a Car, Emergency Fund"/></div>
          <div class="form-row">
            <div class="form-group"><label class="form-label">Target Amount ($)</label><input type="number" id="goal-target" class="form-control" placeholder="50000"/></div>
            <div class="form-group"><label class="form-label">Already Saved ($)</label><input type="number" id="goal-current" class="form-control" placeholder="0" value="0"/></div>
          </div>
          <div class="form-row">
            <div class="form-group"><label class="form-label">Target Date</label><input type="date" id="goal-deadline" class="form-control"/></div>
            <div class="form-group"><label class="form-label">Icon (emoji)</label><input type="text" id="goal-icon" class="form-control" placeholder="🎯" maxlength="2"/></div>
          </div>
          <div class="form-group"><label class="form-label">Color</label>
            <div style="display:flex;gap:8px">
              ${['#6366f1','#22c55e','#f59e0b','#ef4444','#3b82f6','#8b5cf6','#14b8a6','#ec4899'].map(c=>`<div onclick="this.parentNode.querySelectorAll('div').forEach(d=>d.style.boxShadow='');this.style.boxShadow='0 0 0 3px white'" style="width:24px;height:24px;border-radius:50%;background:${c};cursor:pointer;data-color='${c}'" data-color="${c}"></div>`).join('')}
            </div>
            <input type="hidden" id="goal-color" value="#6366f1"/>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="this.closest('.modal-overlay').remove()">Cancel</button>
          <button class="btn btn-primary" id="save-goal-btn"><i class="fa fa-bullseye"></i> Create Goal</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    overlay.querySelectorAll('[data-color]').forEach(el => {
      el.onclick = () => { document.getElementById('goal-color').value = el.dataset.color; };
    });
    document.getElementById('save-goal-btn').onclick = () => {
      const name = document.getElementById('goal-name').value.trim();
      const target = parseFloat(document.getElementById('goal-target').value);
      const current = parseFloat(document.getElementById('goal-current').value) || 0;
      const deadline = document.getElementById('goal-deadline').value;
      const icon = document.getElementById('goal-icon').value || '🎯';
      const color = document.getElementById('goal-color').value;
      if (!name || !target || !deadline) { toast('Fill all required fields', 'warning'); return; }
      store.addGoal({ id: uid('g'), name, target, current, deadline, icon, color });
      goals = store.get('goals');
      overlay.remove();
      toast('Goal created!', 'success');
      render();
    };
  }

  render();
}

// ---- DEBT TRACKER ----
export function renderDebtTracker(container) {
  let debts = store.get('debts');
  if (!debts.length) {
    debts = [
      { id: uid('d'), name: 'Student Loan', balance: 12000, originalAmount: 25000, interestRate: 5.5, minPayment: 280, dueDate: 15, type: 'Student Loan' },
      { id: uid('d'), name: 'Car Loan', balance: 8500, originalAmount: 15000, interestRate: 7.2, minPayment: 285, dueDate: 5, type: 'Auto Loan' },
      { id: uid('d'), name: 'Credit Card (Chase)', balance: 1800, originalAmount: 1800, interestRate: 22.9, minPayment: 45, dueDate: 20, type: 'Credit Card' },
    ];
    store.set('debts', debts);
  }
  const totalDebt = debts.reduce((s,d)=>s+d.balance,0);
  const totalMinPayment = debts.reduce((s,d)=>s+d.minPayment,0);

  container.innerHTML = `
    <div class="page-header">
      <div><h1 class="page-title"><i class="fa fa-credit-card text-danger"></i> Debt Tracker</h1>
      <p class="page-subtitle">Track and eliminate your debts with proven strategies</p></div>
      <div class="page-actions">
        <button class="btn btn-primary btn-sm" id="add-debt-btn"><i class="fa fa-plus"></i> Add Debt</button>
      </div>
    </div>
    <div class="grid grid-4 mb-4">
      <div class="stat-card"><div class="stat-icon red"><i class="fa fa-credit-card"></i></div><div class="stat-label">Total Debt</div><div class="stat-value text-danger">${formatCurrency(totalDebt)}</div><div class="stat-change negative">${debts.length} accounts</div></div>
      <div class="stat-card"><div class="stat-icon orange"><i class="fa fa-calendar-check"></i></div><div class="stat-label">Min. Monthly Payment</div><div class="stat-value">${formatCurrency(totalMinPayment)}</div><div class="stat-change negative">Required</div></div>
      <div class="stat-card"><div class="stat-icon blue"><i class="fa fa-percent"></i></div><div class="stat-label">Avg Interest Rate</div><div class="stat-value">${(debts.reduce((s,d)=>s+d.interestRate,0)/debts.length).toFixed(1)}%</div><div class="stat-change negative">Weighted avg</div></div>
      <div class="stat-card"><div class="stat-icon green"><i class="fa fa-calculator"></i></div><div class="stat-label">Monthly Interest Cost</div><div class="stat-value text-danger">${formatCurrency(debts.reduce((s,d)=>s+(d.balance*(d.interestRate/100/12)),0))}</div><div class="stat-change negative">Cost of debt</div></div>
    </div>

    <!-- Debt payoff strategies -->
    <div class="grid grid-2 mb-4">
      <div class="card">
        <div class="card-header"><div class="card-title"><i class="fa fa-snowball-effect text-blue"></i> Debt Avalanche (Recommended)</div><span class="badge badge-info">Saves Most Interest</span></div>
        <div class="card-body">
          <p class="text-sm text-muted mb-3">Pay minimums on all debts. Put extra money toward the <strong>highest interest rate</strong> first. Mathematically optimal.</p>
          ${[...debts].sort((a,b)=>b.interestRate-a.interestRate).map((d,i)=>`
            <div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid var(--border-color)">
              <div class="badge badge-${i===0?'danger':'info'}">#${i+1}</div>
              <div style="flex:1"><div class="font-semibold text-sm">${d.name}</div><div class="text-xs text-muted">${d.interestRate}% APR</div></div>
              <div class="text-sm font-bold text-danger">${formatCurrency(d.balance)}</div>
            </div>
          `).join('')}
        </div>
      </div>
      <div class="card">
        <div class="card-header"><div class="card-title"><i class="fa fa-snowflake text-success"></i> Debt Snowball</div><span class="badge badge-success">Best Motivation</span></div>
        <div class="card-body">
          <p class="text-sm text-muted mb-3">Pay minimums on all debts. Put extra money toward the <strong>smallest balance</strong> first. Builds momentum.</p>
          ${[...debts].sort((a,b)=>a.balance-b.balance).map((d,i)=>`
            <div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid var(--border-color)">
              <div class="badge badge-${i===0?'success':'warning'}">#${i+1}</div>
              <div style="flex:1"><div class="font-semibold text-sm">${d.name}</div><div class="text-xs text-muted">${d.balance > 0 ? '~'+ Math.ceil(d.balance/d.minPayment) + ' months' : 'Paid off'}</div></div>
              <div class="text-sm font-bold">${formatCurrency(d.balance)}</div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-header"><div class="card-title"><i class="fa fa-credit-card"></i> All Debts</div></div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Debt Name</th><th>Type</th><th>Balance</th><th>Interest Rate</th><th>Min Payment</th><th>Progress</th><th>Action</th></tr></thead>
          <tbody>
            ${debts.map(d=>{
              const pct = ((d.originalAmount-d.balance)/d.originalAmount*100).toFixed(0);
              return `<tr>
                <td class="font-semibold">${d.name}</td>
                <td><span class="badge badge-danger">${d.type}</span></td>
                <td class="mono font-bold text-danger">${formatCurrency(d.balance)}</td>
                <td class="text-warning font-semibold">${d.interestRate}%</td>
                <td class="mono">${formatCurrency(d.minPayment)}/mo</td>
                <td>
                  <div class="text-xs mb-1">${pct}% paid off</div>
                  <div class="progress" style="width:80px"><div class="progress-bar success" style="width:${pct}%"></div></div>
                </td>
                <td><button class="btn btn-sm text-danger" onclick="deleteDebtFn('${d.id}')"><i class="fa fa-trash"></i></button></td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;

  window.deleteDebtFn = (id) => {
    store.deleteDebt(id);
    debts = store.get('debts');
    renderDebtTracker(container);
    toast('Debt removed', 'info');
  };

  document.getElementById('add-debt-btn').onclick = () => {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
      <div class="modal">
        <div class="modal-header"><h3 class="modal-title"><i class="fa fa-credit-card text-danger"></i> Add Debt</h3>
          <button class="modal-close btn" onclick="this.closest('.modal-overlay').remove()"><i class="fa fa-times"></i></button>
        </div>
        <div class="modal-body">
          <div class="form-row">
            <div class="form-group"><label class="form-label">Debt Name</label><input id="d-name" type="text" class="form-control" placeholder="e.g. Student Loan"/></div>
            <div class="form-group"><label class="form-label">Type</label>
              <select id="d-type" class="form-select">${['Credit Card','Student Loan','Auto Loan','Mortgage','Personal Loan','Medical','Other'].map(t=>`<option>${t}</option>`).join('')}</select>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group"><label class="form-label">Current Balance ($)</label><input id="d-balance" type="number" class="form-control" placeholder="0"/></div>
            <div class="form-group"><label class="form-label">Interest Rate (APR %)</label><input id="d-rate" type="number" class="form-control" placeholder="5.5" step="0.1"/></div>
          </div>
          <div class="form-group"><label class="form-label">Minimum Monthly Payment ($)</label><input id="d-min" type="number" class="form-control" placeholder="100"/></div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="this.closest('.modal-overlay').remove()">Cancel</button>
          <button class="btn btn-primary" id="save-debt-btn">Add Debt</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    document.getElementById('save-debt-btn').onclick = () => {
      const name = document.getElementById('d-name').value.trim();
      const balance = parseFloat(document.getElementById('d-balance').value);
      const interestRate = parseFloat(document.getElementById('d-rate').value);
      const minPayment = parseFloat(document.getElementById('d-min').value);
      const type = document.getElementById('d-type').value;
      if (!name || !balance) { toast('Fill required fields', 'warning'); return; }
      store.addDebt({ id: uid('d'), name, balance, originalAmount: balance, interestRate, minPayment, type });
      debts = store.get('debts');
      overlay.remove();
      toast('Debt added', 'success');
      renderDebtTracker(container);
    };
  };
}

// ---- RETIREMENT PLANNER ----
export function renderRetirementPlanner(container) {
  const settings = store.get('settings');

  container.innerHTML = `
    <div class="page-header">
      <div><h1 class="page-title"><i class="fa fa-umbrella-beach text-purple"></i> Retirement Planner</h1>
      <p class="page-subtitle">Plan your path to financial independence</p></div>
    </div>
    <div class="grid grid-2 mb-4">
      <div class="card">
        <div class="card-header"><div class="card-title"><i class="fa fa-calculator"></i> Retirement Calculator</div></div>
        <div class="card-body">
          <div class="form-group"><label class="form-label">Current Age</label><input type="number" id="ret-age" class="form-control" value="30"/></div>
          <div class="form-group"><label class="form-label">Retirement Age</label><input type="number" id="ret-retire-age" class="form-control" value="60"/></div>
          <div class="form-group"><label class="form-label">Current Savings ($)</label><input type="number" id="ret-savings" class="form-control" value="32000"/></div>
          <div class="form-group"><label class="form-label">Monthly Contribution ($)</label><input type="number" id="ret-monthly" class="form-control" value="500"/></div>
          <div class="form-group"><label class="form-label">Expected Annual Return (%)</label><input type="number" id="ret-return" class="form-control" value="10" step="0.5"/></div>
          <div class="form-group"><label class="form-label">Monthly Expenses in Retirement ($)</label><input type="number" id="ret-expenses" class="form-control" value="4000"/></div>
          <button class="btn btn-primary w-full mt-2" id="calc-retire-btn"><i class="fa fa-calculator"></i> Calculate</button>
        </div>
      </div>
      <div class="card" id="retire-results">
        <div class="card-header"><div class="card-title"><i class="fa fa-chart-line"></i> Retirement Projection</div></div>
        <div class="card-body">
          <div class="empty-state"><i class="fa fa-calculator"></i><p>Fill in your details and click Calculate</p></div>
        </div>
      </div>
    </div>
    <div class="card mb-4">
      <div class="card-header"><div class="card-title"><i class="fa fa-chart-area"></i> Retirement Corpus Growth</div></div>
      <div class="card-body"><canvas id="retire-chart" height="240"></canvas></div>
    </div>
    <div class="grid grid-3">
      ${[
        { title: 'NPS (India)', icon: '🇮🇳', desc: 'National Pension System — tax benefits under 80C & 80CCD', yield: '9-12%', benefit: 'Tax deduction up to ₹2L' },
        { title: '401(k) (US)', icon: '🇺🇸', desc: 'Employer-sponsored plan with tax advantages and employer match', yield: '7-10%', benefit: 'Employer match (free money!)' },
        { title: 'PPF (India)', icon: '🏛️', desc: 'Public Provident Fund — guaranteed government-backed returns', yield: '7.1%', benefit: 'EEE tax status (triple exempt)' },
      ].map(p=>`
        <div class="card card-hover">
          <div class="card-body">
            <div style="font-size:2rem;margin-bottom:8px">${p.icon}</div>
            <div class="font-bold mb-1">${p.title}</div>
            <div class="text-xs text-muted mb-3">${p.desc}</div>
            <div class="flex justify-between text-sm mb-1"><span class="text-muted">Expected Return</span><span class="text-success font-bold">${p.yield}</span></div>
            <div class="text-xs text-info mt-2">${p.benefit}</div>
          </div>
        </div>
      `).join('')}
    </div>
  `;

  document.getElementById('calc-retire-btn').onclick = () => {
    const age = parseInt(document.getElementById('ret-age').value);
    const retireAge = parseInt(document.getElementById('ret-retire-age').value);
    const savings = parseFloat(document.getElementById('ret-savings').value);
    const monthly = parseFloat(document.getElementById('ret-monthly').value);
    const annualReturn = parseFloat(document.getElementById('ret-return').value)/100;
    const monthlyExpenses = parseFloat(document.getElementById('ret-expenses').value);
    const years = retireAge - age;
    const monthlyReturn = annualReturn/12;
    const months = years * 12;

    // FV of current savings + FV of contributions
    const fvSavings = savings * Math.pow(1 + annualReturn, years);
    const fvContribs = monthly * ((Math.pow(1 + monthlyReturn, months) - 1) / monthlyReturn);
    const totalCorpus = fvSavings + fvContribs;
    const annualWithdrawal = monthlyExpenses * 12;
    const yearsLastWith4Pct = totalCorpus / annualWithdrawal;
    const safeWithdrawal = totalCorpus * 0.04;

    document.getElementById('retire-results').innerHTML = `
      <div class="card-header"><div class="card-title"><i class="fa fa-chart-line"></i> Your Retirement Outlook</div></div>
      <div class="card-body">
        <div class="stat-card mb-3" style="border-top-color:var(--brand-accent)">
          <div class="stat-label">Retirement Corpus at Age ${retireAge}</div>
          <div class="stat-value text-success">${formatCurrency(totalCorpus)}</div>
          <div class="stat-change positive"><i class="fa fa-check-circle"></i> Based on ${annualReturn*100}% annual returns</div>
        </div>
        <div class="grid grid-2 gap-2">
          <div style="background:var(--bg-card);border-radius:8px;padding:10px">
            <div class="text-xs text-muted">4% Safe Withdrawal</div>
            <div class="font-bold text-success">${formatCurrency(safeWithdrawal)}/year</div>
            <div class="text-xs text-muted">${formatCurrency(safeWithdrawal/12)}/month</div>
          </div>
          <div style="background:var(--bg-card);border-radius:8px;padding:10px">
            <div class="text-xs text-muted">Estimated Corpus Lasts</div>
            <div class="font-bold text-${yearsLastWith4Pct>30?'success':'warning'}">${yearsLastWith4Pct>50?'50+':yearsLastWith4Pct.toFixed(0)} years</div>
            <div class="text-xs text-muted">${yearsLastWith4Pct>30?'Excellent!':'Consider increasing contributions'}</div>
          </div>
        </div>
        <div class="mt-3">
          ${safeWithdrawal >= monthlyExpenses*12
            ? `<div class="success-box"><i class="fa fa-check-circle"></i> You're on track! Your savings will cover your retirement expenses.</div>`
            : `<div class="error-box"><i class="fa fa-exclamation-circle"></i> Shortfall! Save ${formatCurrency((monthlyExpenses*12 - safeWithdrawal)/12)} more per month.</div>`
          }
        </div>
        <div class="text-xs text-muted mt-3" style="font-style:italic">
          Total invested: ${formatCurrency(savings + monthly*months)} | Returns: ${formatCurrency(totalCorpus - savings - monthly*months)}
        </div>
      </div>
    `;

    // Draw chart
    const canvas = document.getElementById('retire-chart');
    if (canvas) {
      const existing = Chart.getChart(canvas);
      if (existing) existing.destroy();
      const labels = Array.from({length:years+1},(_,i)=>age+i);
      const corpusData = labels.map(a => {
        const y = a - age;
        const m = y * 12;
        return savings * Math.pow(1+annualReturn,y) + monthly * ((Math.pow(1+monthlyReturn,m)-1)/monthlyReturn);
      });
      const contribData = labels.map(a => savings + monthly * (a - age) * 12);
      new Chart(canvas, {
        type: 'line',
        data: {
          labels,
          datasets: [
            { label: 'Projected Corpus', data: corpusData, borderColor: '#6366f1', backgroundColor: 'rgba(99,102,241,0.1)', fill: true, tension: 0.4, borderWidth: 2.5, pointRadius: 0 },
            { label: 'Total Contributed', data: contribData, borderColor: '#94a3b8', borderDash: [5,5], borderWidth: 1.5, fill: false, tension: 0, pointRadius: 0 },
          ]
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          interaction: { mode: 'index', intersect: false },
          plugins: { legend: { labels: { color: '#94a3b8', boxWidth: 10, font: { size: 11 } } }, tooltip: { callbacks: { label: c => ` ${c.dataset.label}: ${formatCurrency(c.raw)}` } } },
          scales: { x: { ticks: { color: '#64748b', font: { size: 10 } }, grid: { display: false }, title: { display: true, text: 'Age', color: '#64748b' } }, y: { ticks: { color: '#64748b', font: { size: 10 }, callback: v => '$'+formatCompact(v) }, grid: { color: 'rgba(255,255,255,0.04)' } } }
        }
      });
    }
  };
}

// ---- TAX PLANNER ----
export function renderTaxPlanner(container) {
  container.innerHTML = `
    <div class="page-header">
      <div><h1 class="page-title"><i class="fa fa-file-contract text-purple"></i> Tax Planner</h1>
      <p class="page-subtitle">Estimate taxes and find deduction opportunities</p></div>
    </div>
    <div class="grid grid-2 mb-4">
      <div class="card">
        <div class="card-header"><div class="card-title"><i class="fa fa-calculator"></i> US Tax Estimator 2024</div></div>
        <div class="card-body">
          <div class="form-group"><label class="form-label">Annual Gross Income ($)</label><input type="number" id="tax-income" class="form-control" placeholder="75000" value="75000"/></div>
          <div class="form-group"><label class="form-label">Filing Status</label>
            <select id="tax-status" class="form-select">
              <option>Single</option>
              <option>Married Filing Jointly</option>
              <option>Married Filing Separately</option>
              <option>Head of Household</option>
            </select>
          </div>
          <div class="form-group"><label class="form-label">401(k) Contributions ($)</label><input type="number" id="tax-401k" class="form-control" placeholder="0" value="6000"/></div>
          <div class="form-group"><label class="form-label">Other Deductions ($)</label><input type="number" id="tax-deductions" class="form-control" placeholder="0"/></div>
          <div class="form-group"><label class="form-label">Investment Gains ($)</label><input type="number" id="tax-gains" class="form-control" placeholder="0"/></div>
          <button class="btn btn-primary w-full" id="calc-tax-btn"><i class="fa fa-calculator"></i> Calculate Tax</button>
        </div>
      </div>
      <div class="card" id="tax-results">
        <div class="card-header"><div class="card-title"><i class="fa fa-file-invoice-dollar"></i> Tax Estimate</div></div>
        <div class="card-body"><div class="empty-state"><i class="fa fa-calculator"></i><p>Fill in your details to see your tax estimate</p></div></div>
      </div>
    </div>
    <div class="grid grid-2">
      <div class="card">
        <div class="card-header"><div class="card-title"><i class="fa fa-lightbulb text-warning"></i> Tax Saving Strategies</div></div>
        <div class="card-body">
          ${[
            { title: 'Maximize 401(k)', save: 'Up to $4,428 tax savings', desc: 'Contribute up to $23,000 in 2024 (pre-tax)' },
            { title: 'Health Savings Account (HSA)', save: 'Triple tax advantage', desc: 'Contribute up to $4,150 (single) pre-tax, grow tax-free, withdraw tax-free for medical' },
            { title: 'Tax-Loss Harvesting', save: 'Offset capital gains', desc: 'Sell losing investments to offset gains and reduce taxable income' },
            { title: 'Qualified Business Income', save: 'Up to 20% deduction', desc: 'Self-employed? Deduct up to 20% of QBI from federal taxes' },
            { title: 'Charitable Donations', save: 'Itemize deductions', desc: 'Donate appreciated assets to avoid capital gains and get a full deduction' },
            { title: 'Home Office Deduction', save: '$5/sq ft (simplified)', desc: 'Self-employed or hybrid worker with dedicated home office' },
          ].map(s=>`
            <div style="display:flex;gap:10px;padding:10px 0;border-bottom:1px solid var(--border-color)">
              <div style="width:32px;height:32px;border-radius:50%;background:rgba(245,158,11,0.15);color:var(--brand-warning);display:flex;align-items:center;justify-content:center;flex-shrink:0"><i class="fa fa-lightbulb"></i></div>
              <div>
                <div class="font-semibold text-sm">${s.title}</div>
                <div class="text-xs text-success font-semibold">${s.save}</div>
                <div class="text-xs text-muted mt-1">${s.desc}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
      <div class="card">
        <div class="card-header"><div class="card-title"><i class="fa fa-calendar-check text-blue"></i> Important Tax Dates 2024</div></div>
        <div class="card-body">
          ${[
            { date: 'Jan 15', event: 'Q4 Estimated Tax Payment Due', type: 'danger' },
            { date: 'Jan 31', event: 'W-2 & 1099 forms must be sent', type: 'warning' },
            { date: 'Apr 15', event: 'Tax Return Filing Deadline', type: 'danger' },
            { date: 'Apr 15', event: 'IRA Contribution Deadline', type: 'info' },
            { date: 'Apr 15', event: 'Q1 Estimated Tax Payment', type: 'warning' },
            { date: 'Jun 17', event: 'Q2 Estimated Tax Payment', type: 'warning' },
            { date: 'Sep 16', event: 'Q3 Estimated Tax Payment', type: 'warning' },
            { date: 'Oct 15', event: 'Extended Return Deadline', type: 'info' },
            { date: 'Dec 31', event: 'Last day for tax-loss harvesting', type: 'danger' },
          ].map(t=>`
            <div style="display:flex;gap:10px;align-items:center;padding:8px 0;border-bottom:1px solid var(--border-color)">
              <span class="badge badge-${t.type}" style="flex-shrink:0;width:55px;text-align:center">${t.date}</span>
              <span class="text-sm">${t.event}</span>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;

  document.getElementById('calc-tax-btn').onclick = () => {
    const income = parseFloat(document.getElementById('tax-income').value) || 0;
    const k401 = parseFloat(document.getElementById('tax-401k').value) || 0;
    const deductions = parseFloat(document.getElementById('tax-deductions').value) || 0;
    const gains = parseFloat(document.getElementById('tax-gains').value) || 0;
    const status = document.getElementById('tax-status').value;

    const standardDeduction = status === 'Married Filing Jointly' ? 29200 : (status === 'Head of Household' ? 21900 : 14600);
    const agi = Math.max(income - k401, 0);
    const taxableIncome = Math.max(agi - Math.max(standardDeduction, deductions), 0);

    // 2024 Tax Brackets (Single simplified)
    const brackets = [
      { rate: 0.10, upto: 11600 },
      { rate: 0.12, upto: 47150 },
      { rate: 0.22, upto: 100525 },
      { rate: 0.24, upto: 191950 },
      { rate: 0.32, upto: 243725 },
      { rate: 0.35, upto: 609350 },
      { rate: 0.37, upto: Infinity },
    ];
    let tax = 0, prev = 0;
    for (const b of brackets) {
      if (taxableIncome <= prev) break;
      const taxable = Math.min(taxableIncome, b.upto) - prev;
      tax += taxable * b.rate;
      prev = b.upto;
    }

    // FICA
    const fica = Math.min(income, 168600) * 0.062 + income * 0.0145;
    const totalTax = tax + fica;
    const effectiveRate = (tax/income*100);
    const afterTax = income - totalTax;

    document.getElementById('tax-results').innerHTML = `
      <div class="card-header"><div class="card-title"><i class="fa fa-file-invoice-dollar"></i> Tax Estimate 2024</div></div>
      <div class="card-body">
        <div class="grid grid-2 gap-2 mb-4">
          <div style="background:var(--bg-card);border-radius:8px;padding:12px;text-align:center">
            <div class="text-xs text-muted">Federal Income Tax</div>
            <div class="font-bold text-xl text-danger">${formatCurrency(tax)}</div>
          </div>
          <div style="background:var(--bg-card);border-radius:8px;padding:12px;text-align:center">
            <div class="text-xs text-muted">FICA (Social Security + Medicare)</div>
            <div class="font-bold text-xl text-warning">${formatCurrency(fica)}</div>
          </div>
          <div style="background:var(--bg-card);border-radius:8px;padding:12px;text-align:center">
            <div class="text-xs text-muted">Effective Tax Rate</div>
            <div class="font-bold text-xl">${effectiveRate.toFixed(1)}%</div>
          </div>
          <div style="background:var(--bg-card);border-radius:8px;padding:12px;text-align:center">
            <div class="text-xs text-muted">Take-Home (Est.)</div>
            <div class="font-bold text-xl text-success">${formatCurrency(afterTax)}</div>
          </div>
        </div>
        <div class="text-xs text-muted mb-2">Deduction used: ${formatCurrency(Math.max(standardDeduction, deductions))} (${deductions > standardDeduction ? 'Itemized' : 'Standard'})</div>
        <div class="text-xs text-muted mb-2">AGI: ${formatCurrency(agi)} | Taxable Income: ${formatCurrency(taxableIncome)}</div>
        <div class="text-xs text-muted" style="font-style:italic">⚠️ This is an estimate. Consult a tax professional for accurate advice.</div>
      </div>
    `;
  };
}

// ---- BUDGET PLANNER ----
export function renderBudgetPlanner(container) {
  const monthlyIncome = store.getTotalIncome(new Date().toISOString().slice(0,7)) || 5000;
  const categories = [
    { cat: 'Housing (Rent/Mortgage)', icon: '🏠', rule50: 1500, current: 1400, color: '#6366f1' },
    { cat: 'Food & Groceries', icon: '🛒', rule50: 400, current: 380, color: '#22c55e' },
    { cat: 'Transport', icon: '🚗', rule50: 400, current: 320, color: '#f59e0b' },
    { cat: 'Utilities', icon: '💡', rule50: 200, current: 180, color: '#3b82f6' },
    { cat: 'Dining & Entertainment', icon: '🍽️', rule30: 300, current: 420, color: '#ef4444' },
    { cat: 'Shopping & Clothing', icon: '🛍️', rule30: 200, current: 150, color: '#8b5cf6' },
    { cat: 'Subscriptions', icon: '📺', rule30: 100, current: 85, color: '#ec4899' },
    { cat: 'Savings (Goal)', icon: '💰', rule20: 500, current: 500, color: '#22c55e' },
    { cat: 'Investments', icon: '📈', rule20: 500, current: 500, color: '#6366f1' },
  ];
  const needs = monthlyIncome * 0.5, wants = monthlyIncome * 0.3, savings = monthlyIncome * 0.2;
  container.innerHTML = `
    <div class="page-header">
      <div><h1 class="page-title"><i class="fa fa-scale-balanced text-purple"></i> Budget Planner</h1>
      <p class="page-subtitle">Build and track your monthly budget using the 50/30/20 rule</p></div>
    </div>
    <div class="card mb-4" style="background:linear-gradient(135deg,rgba(99,102,241,0.12),rgba(34,197,94,0.08))">
      <div class="card-body">
        <div class="grid grid-3">
          <div style="text-align:center">
            <div style="font-size:2rem;font-weight:900;color:var(--brand-primary)">50%</div>
            <div class="font-bold">Needs</div>
            <div class="text-success mono font-bold">${formatCurrency(needs)}</div>
            <div class="text-xs text-muted">Housing, Food, Transport</div>
          </div>
          <div style="text-align:center;border-left:1px solid var(--border-color);border-right:1px solid var(--border-color)">
            <div style="font-size:2rem;font-weight:900;color:var(--brand-warning)">30%</div>
            <div class="font-bold">Wants</div>
            <div class="text-warning mono font-bold">${formatCurrency(wants)}</div>
            <div class="text-xs text-muted">Entertainment, Shopping</div>
          </div>
          <div style="text-align:center">
            <div style="font-size:2rem;font-weight:900;color:var(--brand-accent)">20%</div>
            <div class="font-bold">Save & Invest</div>
            <div class="text-success mono font-bold">${formatCurrency(savings)}</div>
            <div class="text-xs text-muted">Goals, Investments, Emergency</div>
          </div>
        </div>
      </div>
    </div>
    <div class="grid grid-2">
      <div class="card">
        <div class="card-header"><div class="card-title"><i class="fa fa-scale-balanced"></i> Budget Breakdown</div></div>
        <div class="card-body">
          ${categories.map(c => {
            const budget = c.rule50 || c.rule30 || c.rule20 || 0;
            const pct = budget ? Math.min((c.current/budget)*100, 100) : 0;
            const over = c.current > budget;
            return `
              <div class="budget-bar">
                <div class="budget-bar-meta">
                  <span class="budget-bar-label">${c.icon} ${c.cat}</span>
                  <span class="budget-bar-value ${over?'text-danger':''}">
                    ${formatCurrency(c.current)} / ${formatCurrency(budget)}
                    ${over ? ' ⚠️' : ''}
                  </span>
                </div>
                <div class="progress"><div class="progress-bar" style="width:${pct}%;background:${over?'var(--brand-danger)':c.color};border-radius:99px"></div></div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
      <div class="card">
        <div class="card-header"><div class="card-title"><i class="fa fa-chart-pie"></i> Budget vs Actual</div></div>
        <div class="card-body"><canvas id="budget-chart" height="280"></canvas></div>
      </div>
    </div>
  `;

  setTimeout(() => {
    const canvas = document.getElementById('budget-chart');
    if (!canvas) return;
    const budgets = categories.map(c => c.rule50||c.rule30||c.rule20||0);
    const actuals = categories.map(c => c.current);
    new Chart(canvas, {
      type: 'bar',
      data: {
        labels: categories.map(c => c.cat.split('(')[0].trim()),
        datasets: [
          { label: 'Budget', data: budgets, backgroundColor: 'rgba(99,102,241,0.6)', borderRadius: 4 },
          { label: 'Actual', data: actuals, backgroundColor: actuals.map((a,i)=>a>budgets[i]?'rgba(239,68,68,0.7)':'rgba(34,197,94,0.7)'), borderRadius: 4 },
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false, indexAxis: 'y',
        plugins: { legend: { labels: { color: '#94a3b8', boxWidth: 10, font: { size: 11 } } }, tooltip: { callbacks: { label: c => ` ${c.dataset.label}: ${formatCurrency(c.raw)}` } } },
        scales: { x: { ticks: { color: '#64748b', font: { size: 9 }, callback: v => '$'+v }, grid: { color: 'rgba(255,255,255,0.04)' } }, y: { ticks: { color: '#94a3b8', font: { size: 9 } }, grid: { display: false } } }
      }
    });
  }, 100);
}
