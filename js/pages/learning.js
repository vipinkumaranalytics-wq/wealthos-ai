// =====================================================
// WealthOS AI — Learning Center, Habit Tracker, Journal
// =====================================================
import { formatNumber, toast, uid, exportCSV } from '../utils.js';
import { store } from '../store.js';

// ---- LEARNING CENTER ----
export function renderLearningCenter(container) {
  const modules = [
    {
      id: 'investing-basics', title: 'Investing Basics', icon: '📚', level: 'Beginner', duration: '45 min',
      lessons: [
        { title: 'What is the Stock Market?', dur: '8 min', completed: true },
        { title: 'How to Buy Your First Stock', dur: '10 min', completed: true },
        { title: 'Understanding P/E Ratio', dur: '7 min', completed: false },
        { title: 'Diversification & Risk', dur: '9 min', completed: false },
        { title: 'Bull vs Bear Markets', dur: '6 min', completed: false },
        { title: 'Dollar-Cost Averaging', dur: '5 min', completed: false },
      ],
      color: '#6366f1'
    },
    {
      id: 'mutual-funds', title: 'Mutual Funds & ETFs', icon: '🎯', level: 'Beginner', duration: '55 min',
      lessons: [
        { title: 'What is a Mutual Fund?', dur: '8 min', completed: true },
        { title: 'Active vs Passive Funds', dur: '10 min', completed: false },
        { title: 'Understanding Expense Ratios', dur: '6 min', completed: false },
        { title: 'Index Funds Explained', dur: '9 min', completed: false },
        { title: 'SIP vs Lump Sum', dur: '7 min', completed: false },
        { title: 'How to Read Fund Factsheet', dur: '8 min', completed: false },
      ],
      color: '#22c55e'
    },
    {
      id: 'crypto', title: 'Crypto & Blockchain', icon: '₿', level: 'Intermediate', duration: '60 min',
      lessons: [
        { title: 'What is Bitcoin?', dur: '9 min', completed: false },
        { title: 'Blockchain Technology Explained', dur: '12 min', completed: false },
        { title: 'DeFi & Smart Contracts', dur: '11 min', completed: false },
        { title: 'Wallets & Security', dur: '8 min', completed: false },
        { title: 'Crypto Tax Implications', dur: '7 min', completed: false },
        { title: 'Reading Crypto Charts', dur: '9 min', completed: false },
      ],
      color: '#f59e0b'
    },
    {
      id: 'options', title: 'Options Trading', icon: '📊', level: 'Advanced', duration: '90 min',
      lessons: [
        { title: 'Options 101: Calls & Puts', dur: '12 min', completed: false },
        { title: 'Understanding Greeks', dur: '15 min', completed: false },
        { title: 'Covered Calls Strategy', dur: '12 min', completed: false },
        { title: 'Protective Puts (Hedging)', dur: '10 min', completed: false },
        { title: 'Iron Condors & Spreads', dur: '18 min', completed: false },
        { title: 'Options Risk Management', dur: '11 min', completed: false },
      ],
      color: '#ef4444'
    },
    {
      id: 'tax-planning', title: 'Tax Planning', icon: '📋', level: 'Intermediate', duration: '50 min',
      lessons: [
        { title: 'Understanding Tax Brackets', dur: '8 min', completed: false },
        { title: 'Capital Gains Tax Explained', dur: '9 min', completed: false },
        { title: 'Tax-Loss Harvesting Strategy', dur: '8 min', completed: false },
        { title: 'IRA vs 401(k) vs HSA', dur: '11 min', completed: false },
        { title: 'Deductions vs Credits', dur: '7 min', completed: false },
        { title: 'Tax-Efficient Investing', dur: '7 min', completed: false },
      ],
      color: '#8b5cf6'
    },
    {
      id: 'real-estate', title: 'Real Estate Investing', icon: '🏠', level: 'Intermediate', duration: '75 min',
      lessons: [
        { title: 'REITs: Real Estate Without a Mortgage', dur: '10 min', completed: false },
        { title: 'Rental Property Analysis', dur: '14 min', completed: false },
        { title: 'How to Calculate Cap Rate', dur: '9 min', completed: false },
        { title: 'House Hacking Strategy', dur: '11 min', completed: false },
        { title: 'Real Estate Market Cycles', dur: '12 min', completed: false },
        { title: '1031 Exchange Basics', dur: '9 min', completed: false },
      ],
      color: '#14b8a6'
    },
  ];

  const levelColors = { Beginner: 'success', Intermediate: 'warning', Advanced: 'danger' };

  let activeModule = null;

  function renderMain() {
    const completed = modules.flatMap(m=>m.lessons).filter(l=>l.completed).length;
    const total = modules.flatMap(m=>m.lessons).length;

    container.innerHTML = `
      <div class="page-header">
        <div><h1 class="page-title"><i class="fa fa-graduation-cap text-purple"></i> Learning Center</h1>
        <p class="page-subtitle">Master personal finance and investing with structured courses</p></div>
        <div class="page-actions">
          <div style="text-align:right">
            <div class="text-sm font-bold text-purple">${completed}/${total} lessons complete</div>
            <div class="progress" style="width:120px;margin-top:4px"><div class="progress-bar primary" style="width:${(completed/total*100).toFixed(0)}%"></div></div>
          </div>
        </div>
      </div>

      <!-- Progress Stats -->
      <div class="grid grid-3 mb-4">
        <div class="stat-card"><div class="stat-icon purple"><i class="fa fa-book-open"></i></div><div class="stat-label">Courses Available</div><div class="stat-value">${modules.length}</div><div class="stat-change positive">All levels</div></div>
        <div class="stat-card"><div class="stat-icon green"><i class="fa fa-check-circle"></i></div><div class="stat-label">Lessons Completed</div><div class="stat-value">${completed}</div><div class="stat-change positive">Keep going!</div></div>
        <div class="stat-card"><div class="stat-icon orange"><i class="fa fa-clock"></i></div><div class="stat-label">Total Content</div><div class="stat-value">~8h</div><div class="stat-change positive">Video + Text</div></div>
      </div>

      <!-- Course Cards -->
      <div class="grid grid-3">
        ${modules.map(m => {
          const done = m.lessons.filter(l=>l.completed).length;
          const pct = (done/m.lessons.length*100).toFixed(0);
          return `
            <div class="card card-hover" style="cursor:pointer;border-top:3px solid ${m.color}" onclick="openModule('${m.id}')">
              <div class="card-body">
                <div style="font-size:2.5rem;margin-bottom:8px">${m.icon}</div>
                <div class="flex justify-between items-start mb-2">
                  <h3 class="font-bold">${m.title}</h3>
                  <span class="badge badge-${levelColors[m.level]}">${m.level}</span>
                </div>
                <div class="text-xs text-muted mb-3"><i class="fa fa-clock"></i> ${m.duration} · ${m.lessons.length} lessons</div>
                <div class="progress mb-1"><div class="progress-bar" style="width:${pct}%;background:${m.color}"></div></div>
                <div class="flex justify-between text-xs text-muted">
                  <span>${done}/${m.lessons.length} lessons</span>
                  <span style="color:${m.color};font-weight:600">${pct}%</span>
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>

      <!-- Quick Facts -->
      <div class="card mt-4">
        <div class="card-header"><div class="card-title"><i class="fa fa-lightbulb text-warning"></i> Finance Quick Facts</div></div>
        <div class="card-body">
          <div class="grid grid-3">
            ${[
              { emoji: '72', title: 'Rule of 72', desc: 'Divide 72 by your investment return to find how many years to double your money. At 8%, that\'s 9 years.' },
              { emoji: '4%', title: 'Safe Withdrawal Rate', desc: 'You can withdraw 4% of your portfolio annually in retirement and have a 95%+ chance of not running out of money.' },
              { emoji: '50/30/20', title: 'Budget Rule', desc: 'Spend 50% on needs, 30% on wants, and save/invest 20%. A simple guideline for financial health.' },
              { emoji: '6×', title: 'Emergency Fund', desc: 'Keep 3-6 months of living expenses in a high-yield savings account as a financial safety net.' },
              { emoji: '10×', title: 'Life Insurance', desc: 'A common rule of thumb is to have life insurance coverage of 10-15x your annual income.' },
              { emoji: '100-Age', title: 'Asset Allocation', desc: 'Traditional rule: put (100 - your age)% in stocks. At 30, that means 70% stocks, 30% bonds.' },
            ].map(f=>`
              <div style="padding:12px;background:rgba(99,102,241,0.06);border-radius:8px">
                <div style="font-size:1.8rem;font-weight:900;color:var(--brand-primary);margin-bottom:6px">${f.emoji}</div>
                <div class="font-bold text-sm mb-1">${f.title}</div>
                <div class="text-xs text-muted">${f.desc}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    window.openModule = (id) => {
      activeModule = modules.find(m => m.id === id);
      renderModule();
    };
  }

  function renderModule() {
    const m = activeModule;
    const done = m.lessons.filter(l=>l.completed).length;
    container.innerHTML = `
      <div class="page-header">
        <div><button class="btn btn-secondary btn-sm" id="back-courses"><i class="fa fa-arrow-left"></i> All Courses</button>
        <h1 class="page-title mt-2">${m.icon} ${m.title}</h1>
        <p class="page-subtitle"><span class="badge badge-${levelColors[m.level]}">${m.level}</span> · ${m.duration} · ${m.lessons.length} lessons</p></div>
      </div>
      <div class="grid grid-3">
        <div class="card" style="grid-column:1/3">
          <div class="card-header"><div class="card-title"><i class="fa fa-list-check"></i> Lessons</div></div>
          <div class="card-body">
            ${m.lessons.map((l, i) => `
              <div style="display:flex;align-items:center;gap:12px;padding:12px;border:1px solid var(--border-color);border-radius:8px;margin-bottom:8px;cursor:pointer;background:${l.completed?'rgba(34,197,94,0.06)':'var(--bg-card)'}" onclick="toggleLesson(${i})">
                <div style="width:28px;height:28px;border-radius:50%;border:2px solid ${l.completed?'var(--brand-accent)':'var(--border-color)'};display:flex;align-items:center;justify-content:center;flex-shrink:0;background:${l.completed?'var(--brand-accent)':'transparent'}">
                  ${l.completed ? '<i class="fa fa-check text-white" style="font-size:0.7rem"></i>' : `<span class="text-muted text-xs font-bold">${i+1}</span>`}
                </div>
                <div style="flex:1">
                  <div class="font-semibold text-sm ${l.completed?'text-muted':''}" style="text-decoration:${l.completed?'line-through':''}">${l.title}</div>
                  <div class="text-xs text-muted"><i class="fa fa-clock"></i> ${l.dur}</div>
                </div>
                ${l.completed ? '<span class="badge badge-success">Completed</span>' : '<span class="badge badge-info">Start</span>'}
              </div>
            `).join('')}
          </div>
        </div>
        <div class="card">
          <div class="card-header"><div class="card-title"><i class="fa fa-chart-pie"></i> Progress</div></div>
          <div class="card-body" style="text-align:center">
            <div style="font-size:3rem;font-weight:900;color:${m.color}">${(done/m.lessons.length*100).toFixed(0)}%</div>
            <div class="text-muted mb-3">${done} of ${m.lessons.length} done</div>
            <div class="progress mb-4"><div class="progress-bar" style="width:${(done/m.lessons.length*100).toFixed(0)}%;background:${m.color}"></div></div>
            ${done === m.lessons.length ? '<div class="success-box"><i class="fa fa-trophy text-warning"></i> Course Completed! 🎉</div>' : ''}
            <button class="btn btn-primary w-full mt-3" onclick="markAllDone()">Mark All Complete</button>
          </div>
        </div>
      </div>
    `;

    document.getElementById('back-courses').onclick = renderMain;
    window.toggleLesson = (i) => {
      m.lessons[i].completed = !m.lessons[i].completed;
      renderModule();
    };
    window.markAllDone = () => {
      m.lessons.forEach(l => l.completed = true);
      toast('Course completed! 🎉', 'success');
      renderModule();
    };
  }

  renderMain();
}

// ---- HABIT TRACKER ----
export function renderHabitTracker(container) {
  let habits = store.get('habits');
  if (!habits.length) {
    habits = [
      { id: uid('h'), name: 'Save $10 Today', icon: '💰', category: 'Finance', streak: 7, completedDates: [], color: '#22c55e' },
      { id: uid('h'), name: 'Review Portfolio', icon: '📊', category: 'Finance', streak: 3, completedDates: [], color: '#6366f1' },
      { id: uid('h'), name: 'Read Finance News', icon: '📰', category: 'Learning', streak: 12, completedDates: [], color: '#3b82f6' },
      { id: uid('h'), name: 'No Impulse Purchases', icon: '🛑', category: 'Discipline', streak: 5, completedDates: [], color: '#ef4444' },
      { id: uid('h'), name: 'Log All Expenses', icon: '✍️', category: 'Finance', streak: 14, completedDates: [], color: '#f59e0b' },
    ];
    store.set('habits', habits);
  }

  const today = new Date().toISOString().split('T')[0];
  const todayCompleted = habits.filter(h => h.completedDates.includes(today));

  container.innerHTML = `
    <div class="page-header">
      <div><h1 class="page-title"><i class="fa fa-fire text-orange"></i> Habit Tracker</h1>
      <p class="page-subtitle">Build financial habits that compound over time</p></div>
      <div class="page-actions">
        <button class="btn btn-primary btn-sm" id="add-habit-btn"><i class="fa fa-plus"></i> New Habit</button>
      </div>
    </div>

    <div class="grid grid-3 mb-4">
      <div class="stat-card"><div class="stat-icon orange"><i class="fa fa-fire"></i></div><div class="stat-label">Active Habits</div><div class="stat-value">${habits.length}</div><div class="stat-change positive">Being tracked</div></div>
      <div class="stat-card"><div class="stat-icon green"><i class="fa fa-check-circle"></i></div><div class="stat-label">Done Today</div><div class="stat-value">${todayCompleted.length}/${habits.length}</div><div class="stat-change ${todayCompleted.length===habits.length?'positive':'neutral'}">Today's progress</div></div>
      <div class="stat-card"><div class="stat-icon yellow"><i class="fa fa-bolt"></i></div><div class="stat-label">Best Streak</div><div class="stat-value">${Math.max(...habits.map(h=>h.streak))} days</div><div class="stat-change positive">Keep it up!</div></div>
    </div>

    <!-- Today's Habits -->
    <div class="card mb-4">
      <div class="card-header"><div class="card-title"><i class="fa fa-calendar-day"></i> Today's Habits</div>
        <span class="text-sm text-muted">${new Date().toLocaleDateString('en', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
      </div>
      <div class="card-body">
        <div id="today-habits">
          ${habits.map(h => {
            const done = h.completedDates.includes(today);
            return `
              <div class="habit-item ${done?'done':''}" id="habit-${h.id}" onclick="toggleHabit('${h.id}')">
                <div class="habit-icon" style="background:${h.color}22;color:${h.color}">${h.icon}</div>
                <div class="habit-info">
                  <div class="font-semibold ${done?'text-muted':''}" style="text-decoration:${done?'line-through':''}">${h.name}</div>
                  <div class="text-xs text-muted"><span class="badge badge-info" style="font-size:0.65rem">${h.category}</span> · 🔥 ${h.streak} day streak</div>
                </div>
                <div class="habit-check" style="width:32px;height:32px;border-radius:50%;border:2px solid ${done?h.color:'var(--border-color)'};display:flex;align-items:center;justify-content:center;transition:all 0.2s;background:${done?h.color:'transparent'}">
                  ${done ? '<i class="fa fa-check text-white" style="font-size:0.8rem"></i>' : ''}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    </div>

    <!-- Habit Grid (30-day view) -->
    <div class="card mb-4">
      <div class="card-header"><div class="card-title"><i class="fa fa-calendar-alt"></i> Habit History (Last 30 Days)</div></div>
      <div class="card-body">
        ${habits.map(h => {
          const days = Array.from({length:30},(_,i)=>{const d=new Date();d.setDate(d.getDate()-(29-i));return d.toISOString().split('T')[0];});
          return `
            <div class="habit-grid-row mb-3">
              <div style="display:flex;align-items:center;gap:10px;margin-bottom:6px">
                <span>${h.icon}</span>
                <span class="font-semibold text-sm">${h.name}</span>
                <span class="text-xs text-muted">🔥 ${h.streak} days</span>
              </div>
              <div style="display:flex;gap:3px;flex-wrap:wrap">
                ${days.map(d => {
                  const done = h.completedDates.includes(d) || (Math.random() > 0.35);
                  const isToday = d === today;
                  return `<div title="${d}" style="width:16px;height:16px;border-radius:3px;background:${done?h.color:'rgba(100,116,139,0.2)'};border:${isToday?'2px solid var(--brand-primary)':'none'};cursor:pointer"></div>`;
                }).join('')}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>

    <!-- Habit Tips -->
    <div class="card">
      <div class="card-header"><div class="card-title"><i class="fa fa-lightbulb text-warning"></i> Building Money Habits</div></div>
      <div class="card-body">
        <div class="grid grid-3">
          ${[
            { icon: '🔁', title: 'Automate Everything', tip: 'Set up automatic transfers to savings and investments. Automation removes the need for willpower.' },
            { icon: '📱', title: 'Track Daily', tip: 'Spend 5 minutes every evening logging expenses and reviewing your financial habits.' },
            { icon: '🎯', title: 'Start Small', tip: 'Start with habits you can do in under 2 minutes. Consistency matters more than size in the beginning.' },
            { icon: '🏆', title: 'Celebrate Milestones', tip: '30-day streak? Reward yourself modestly. Positive reinforcement builds lasting habits.' },
            { icon: '👥', title: 'Accountability Partner', tip: 'Share your financial goals with a trusted friend. Accountability increases success rates by 65%.' },
            { icon: '📊', title: 'Track Your Progress', tip: 'Review your habit completion rate weekly. Data helps you identify patterns and improvement areas.' },
          ].map(t=>`
            <div style="padding:12px;background:rgba(99,102,241,0.06);border-radius:8px">
              <div style="font-size:1.8rem;margin-bottom:6px">${t.icon}</div>
              <div class="font-bold text-sm mb-1">${t.title}</div>
              <div class="text-xs text-muted">${t.tip}</div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;

  // Add habit CSS
  if (!document.getElementById('habit-styles')) {
    const style = document.createElement('style');
    style.id = 'habit-styles';
    style.textContent = `
      .habit-item { display:flex; align-items:center; gap:12px; padding:14px; border:1px solid var(--border-color); border-radius:10px; margin-bottom:8px; cursor:pointer; transition:all 0.2s; }
      .habit-item:hover { border-color:var(--brand-primary); background:rgba(99,102,241,0.04); }
      .habit-item.done { opacity:0.7; }
      .habit-icon { width:40px; height:40px; border-radius:10px; display:flex; align-items:center; justify-content:center; font-size:1.3rem; flex-shrink:0; }
      .habit-info { flex:1; }
    `;
    document.head.appendChild(style);
  }

  window.toggleHabit = (id) => {
    const h = habits.find(h => h.id === id);
    if (h.completedDates.includes(today)) {
      h.completedDates = h.completedDates.filter(d => d !== today);
      h.streak = Math.max(0, h.streak - 1);
    } else {
      h.completedDates.push(today);
      h.streak++;
      toast(`${h.icon} "${h.name}" — ${h.streak} day streak! 🔥`, 'success');
    }
    store.update('habits', list => list.map(hh => hh.id === id ? h : hh));
    habits = store.get('habits');
    renderHabitTracker(container);
  };

  document.getElementById('add-habit-btn').onclick = () => {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
      <div class="modal">
        <div class="modal-header"><h3 class="modal-title"><i class="fa fa-fire text-orange"></i> New Habit</h3>
          <button class="modal-close btn" onclick="this.closest('.modal-overlay').remove()"><i class="fa fa-times"></i></button>
        </div>
        <div class="modal-body">
          <div class="form-row">
            <div class="form-group"><label class="form-label">Habit Name</label><input type="text" id="h-name" class="form-control" placeholder="e.g. Save $10 today"/></div>
            <div class="form-group"><label class="form-label">Icon (emoji)</label><input type="text" id="h-icon" class="form-control" placeholder="💰" maxlength="2"/></div>
          </div>
          <div class="form-row">
            <div class="form-group"><label class="form-label">Category</label>
              <select id="h-cat" class="form-select">${['Finance','Learning','Health','Discipline','Career','Social'].map(c=>`<option>${c}</option>`).join('')}</select>
            </div>
            <div class="form-group"><label class="form-label">Color</label>
              <select id="h-color" class="form-select">
                <option value="#22c55e">Green</option><option value="#6366f1">Purple</option>
                <option value="#ef4444">Red</option><option value="#f59e0b">Yellow</option>
                <option value="#3b82f6">Blue</option><option value="#ec4899">Pink</option>
              </select>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="this.closest('.modal-overlay').remove()">Cancel</button>
          <button class="btn btn-primary" id="save-habit-btn">Add Habit</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    document.getElementById('save-habit-btn').onclick = () => {
      const name = document.getElementById('h-name').value.trim();
      const icon = document.getElementById('h-icon').value || '💡';
      const category = document.getElementById('h-cat').value;
      const color = document.getElementById('h-color').value;
      if (!name) { toast('Enter a habit name', 'warning'); return; }
      store.addHabit({ id: uid('h'), name, icon, category, color, streak: 0, completedDates: [] });
      habits = store.get('habits');
      overlay.remove();
      toast('Habit created!', 'success');
      renderHabitTracker(container);
    };
  };
}

// ---- JOURNAL ----
export function renderJournal(container) {
  let entries = store.get('journal');
  if (!entries.length) {
    const now = new Date();
    entries = [
      {
        id: uid('j'), date: now.toISOString().split('T')[0],
        title: 'Started my investment journey',
        content: 'Today I made my first stock purchase. I bought 5 shares of AAPL. Feeling excited but also a bit nervous. Did my research and believe in the long-term prospects.',
        mood: 'excited', tags: ['investing', 'first-trade'], netWorth: 18500
      },
      {
        id: uid('j'), date: new Date(now.getTime() - 86400000 * 3).toISOString().split('T')[0],
        title: 'Market dipped — staying calm',
        content: 'The market dropped 2% today. My portfolio is down $340. Reminding myself this is long-term investing and short-term volatility is normal. Didn\'t sell anything.',
        mood: 'calm', tags: ['mindset', 'volatility'], netWorth: 18160
      },
    ];
    store.set('journal', entries);
  }

  const moods = { excited: '🚀', happy: '😊', calm: '😌', neutral: '😐', anxious: '😟', sad: '😞' };

  container.innerHTML = `
    <div class="page-header">
      <div><h1 class="page-title"><i class="fa fa-book text-green"></i> Financial Journal</h1>
      <p class="page-subtitle">Document your financial journey, decisions, and learnings</p></div>
      <div class="page-actions">
        <button class="btn btn-secondary btn-sm" id="export-journal-btn"><i class="fa fa-download"></i> Export</button>
        <button class="btn btn-primary btn-sm" id="new-entry-btn"><i class="fa fa-pencil"></i> New Entry</button>
      </div>
    </div>

    <div class="grid grid-2 mb-4">
      <div class="stat-card"><div class="stat-icon green"><i class="fa fa-book-open"></i></div><div class="stat-label">Total Entries</div><div class="stat-value">${entries.length}</div><div class="stat-change positive">Your journey</div></div>
      <div class="stat-card"><div class="stat-icon purple"><i class="fa fa-calendar"></i></div><div class="stat-label">This Month</div><div class="stat-value">${entries.filter(e=>e.date.startsWith(new Date().toISOString().slice(0,7))).length}</div><div class="stat-change positive">Entries logged</div></div>
    </div>

    <div class="grid grid-3">
      <div class="card" style="grid-column:1/3">
        <div class="card-header"><div class="card-title"><i class="fa fa-list"></i> Journal Entries</div>
          <input type="text" id="journal-search" class="form-control btn-sm" placeholder="Search entries..." style="width:150px"/>
        </div>
        <div class="card-body" id="journal-list">
          ${entries.length === 0 ? `<div class="empty-state"><i class="fa fa-book text-muted"></i><p>No journal entries yet. Write your first entry!</p></div>` :
            entries.sort((a,b)=>b.date.localeCompare(a.date)).map(e=>`
              <div class="journal-card" id="je-${e.id}" onclick="openEntry('${e.id}')">
                <div class="journal-header">
                  <div>
                    <div class="font-bold">${e.title}</div>
                    <div class="text-xs text-muted mt-1">
                      ${new Date(e.date).toLocaleDateString('en', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                      ${e.mood ? ` · ${moods[e.mood]} ${e.mood}` : ''}
                    </div>
                  </div>
                  <div style="display:flex;gap:6px">
                    <button class="btn btn-sm text-danger" onclick="event.stopPropagation();deleteEntry('${e.id}')"><i class="fa fa-trash"></i></button>
                  </div>
                </div>
                <div class="journal-preview text-sm text-muted">${e.content.substring(0, 120)}${e.content.length > 120 ? '...' : ''}</div>
                ${e.tags.length ? `<div class="journal-tags mt-2">${e.tags.map(t=>`<span class="badge badge-info">${t}</span>`).join(' ')}</div>` : ''}
              </div>
          `).join('')}
        </div>
      </div>
      <div class="card">
        <div class="card-header"><div class="card-title"><i class="fa fa-pen-nib"></i> Quick Write</div></div>
        <div class="card-body">
          <div class="form-group"><label class="form-label">Title</label><input type="text" id="quick-title" class="form-control" placeholder="Today's financial thought..."/></div>
          <div class="form-group"><label class="form-label">Note</label><textarea id="quick-content" class="form-control" rows="6" placeholder="What's on your mind? Document a trade, goal, lesson learned, or market observation..."></textarea></div>
          <div class="form-group"><label class="form-label">Mood</label>
            <div style="display:flex;gap:8px;flex-wrap:wrap">
              ${Object.entries(moods).map(([key,emoji])=>`
                <label style="cursor:pointer;display:flex;align-items:center;gap:4px;padding:6px 10px;border:1px solid var(--border-color);border-radius:20px;font-size:0.8rem;transition:all 0.15s" onclick="this.parentNode.querySelectorAll('label').forEach(l=>l.style.background='');this.style.background='rgba(99,102,241,0.2)'">
                  <input type="radio" name="journal-mood" value="${key}" style="display:none">${emoji} ${key.charAt(0).toUpperCase()+key.slice(1)}
                </label>
              `).join('')}
            </div>
          </div>
          <div class="form-group"><label class="form-label">Tags (comma separated)</label><input type="text" id="quick-tags" class="form-control" placeholder="investing, mindset, goals"/></div>
          <button class="btn btn-primary w-full" id="save-quick-entry"><i class="fa fa-save"></i> Save Entry</button>
        </div>
      </div>
    </div>
  `;

  // Styles
  if (!document.getElementById('journal-styles')) {
    const style = document.createElement('style');
    style.id = 'journal-styles';
    style.textContent = `
      .journal-card { padding:16px; border:1px solid var(--border-color); border-radius:10px; margin-bottom:10px; cursor:pointer; transition:all 0.2s; }
      .journal-card:hover { border-color:var(--brand-primary); background:rgba(99,102,241,0.04); }
      .journal-header { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px; }
      .journal-preview { overflow:hidden; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; }
      .journal-tags { display:flex; gap:4px; flex-wrap:wrap; }
    `;
    document.head.appendChild(style);
  }

  window.openEntry = (id) => {
    const e = entries.find(e => e.id === id);
    alert(`📖 ${e.title}\n\n${e.content}`);
  };

  window.deleteEntry = (id) => {
    if (confirm('Delete this journal entry?')) {
      store.update('journal', list => list.filter(e => e.id !== id));
      entries = store.get('journal');
      toast('Entry deleted', 'info');
      renderJournal(container);
    }
  };

  document.getElementById('save-quick-entry').onclick = () => {
    const title = document.getElementById('quick-title').value.trim();
    const content = document.getElementById('quick-content').value.trim();
    const moodEl = document.querySelector('input[name="journal-mood"]:checked');
    const mood = moodEl?.value || 'neutral';
    const tags = document.getElementById('quick-tags').value.split(',').map(t=>t.trim()).filter(Boolean);
    if (!title || !content) { toast('Please add a title and content', 'warning'); return; }
    store.addJournalEntry({ id: uid('j'), date: new Date().toISOString().split('T')[0], title, content, mood, tags });
    entries = store.get('journal');
    toast('Journal entry saved! 📖', 'success');
    renderJournal(container);
  };

  document.getElementById('export-journal-btn').onclick = () => {
    exportCSV(entries.map(e => ({ date: e.date, title: e.title, mood: e.mood, content: e.content, tags: e.tags.join(',') })), 'journal.csv');
    toast('Journal exported!', 'success');
  };

  document.getElementById('journal-search').addEventListener('input', e => {
    const q = e.target.value.toLowerCase();
    document.querySelectorAll('.journal-card').forEach(card => {
      card.style.display = card.textContent.toLowerCase().includes(q) ? '' : 'none';
    });
  });
}
