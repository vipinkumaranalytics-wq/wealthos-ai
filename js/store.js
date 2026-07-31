// =====================================================
// WealthOS AI — State Store (Observer Pattern)
// =====================================================
import { storage, idb } from './utils.js';

class Store {
  constructor() {
    this._state = {
      theme: storage.get('theme', 'dark'),
      currency: storage.get('currency', 'USD'),
      user: storage.get('user', { name: 'Ravi', initials: 'R', email: '' }),
      watchlist: storage.get('watchlist', [
        { id: 'bitcoin', type: 'crypto', name: 'Bitcoin', symbol: 'BTC' },
        { id: 'ethereum', type: 'crypto', name: 'Ethereum', symbol: 'ETH' },
        { id: 'AAPL', type: 'stock', name: 'Apple Inc.', symbol: 'AAPL' },
      ]),
      portfolio: storage.get('portfolio', []),
      transactions: storage.get('transactions', []),
      income: storage.get('income', []),
      expenses: storage.get('expenses', []),
      goals: storage.get('goals', [
        { id: 'goal-1', name: 'Emergency Fund', target: 50000, current: 23000, deadline: '2025-12-31', icon: '🛡️', color: '#6366f1' },
        { id: 'goal-2', name: 'Retirement Fund', target: 1000000, current: 85000, deadline: '2045-01-01', icon: '🏖️', color: '#22c55e' },
        { id: 'goal-3', name: 'Dream Home Down Payment', target: 200000, current: 42000, deadline: '2028-06-01', icon: '🏠', color: '#f59e0b' },
      ]),
      debts: storage.get('debts', []),
      habits: storage.get('habits', []),
      journalEntries: storage.get('journalEntries', []),
      notifications: storage.get('notifications', [
        { id: 'n1', title: 'BTC crossed $65,000', body: 'Bitcoin has reached your price alert target.', type: 'success', time: Date.now() - 600000, read: false },
        { id: 'n2', title: 'Portfolio up 2.4% today', body: 'Your portfolio is outperforming the market.', type: 'info', time: Date.now() - 3600000, read: false },
        { id: 'n3', title: 'Budget alert: Dining', body: 'You have used 90% of your dining budget.', type: 'warning', time: Date.now() - 7200000, read: false },
      ]),
      settings: storage.get('settings', {
        notifications: true,
        autoRefresh: true,
        refreshInterval: 60,
        defaultPage: 'dashboard',
        compactMode: false,
        showMiniCharts: true,
        riskProfile: 'moderate',
        taxRate: 30,
        monthlyBudget: 5000,
      }),
      cryptoPrices: {},
      forexRates: {},
      fearGreed: null,
      marketData: {},
    };

    this._listeners = {};
  }

  // Get state value
  get(key) {
    return this._state[key];
  }

  // Set state and notify listeners
  set(key, value) {
    const prev = this._state[key];
    this._state[key] = value;
    this._persist(key, value);
    this._emit(key, value, prev);
  }

  // Update nested state
  update(key, updater) {
    const current = this._state[key];
    const next = updater(current);
    this.set(key, next);
  }

  // Subscribe to state changes
  on(key, listener) {
    if (!this._listeners[key]) this._listeners[key] = [];
    this._listeners[key].push(listener);
    return () => this.off(key, listener);
  }

  // Unsubscribe
  off(key, listener) {
    if (this._listeners[key]) {
      this._listeners[key] = this._listeners[key].filter(l => l !== listener);
    }
  }

  _emit(key, value, prev) {
    const listeners = this._listeners[key] || [];
    listeners.forEach(l => l(value, prev));
    // Also emit wildcard listeners
    const wildcards = this._listeners['*'] || [];
    wildcards.forEach(l => l(key, value, prev));
  }

  // Persist certain keys to localStorage
  _persist(key, value) {
    const persistKeys = ['theme','currency','user','watchlist','portfolio','transactions','income','expenses','goals','debts','habits','journalEntries','notifications','settings'];
    if (persistKeys.includes(key)) {
      storage.set(key, value);
    }
  }

  // ---- Watchlist methods ----
  addToWatchlist(item) {
    const wl = [...this.get('watchlist')];
    if (!wl.find(x => x.id === item.id)) {
      wl.push(item);
      this.set('watchlist', wl);
      return true;
    }
    return false;
  }

  removeFromWatchlist(id) {
    this.update('watchlist', wl => wl.filter(x => x.id !== id));
  }

  inWatchlist(id) {
    return !!this.get('watchlist').find(x => x.id === id);
  }

  // ---- Portfolio methods ----
  addPosition(position) {
    const p = [...this.get('portfolio')];
    const existing = p.findIndex(x => x.symbol === position.symbol && x.type === position.type);
    if (existing >= 0) {
      const e = p[existing];
      const totalQty = e.qty + position.qty;
      const totalCost = (e.avgPrice * e.qty) + (position.avgPrice * position.qty);
      p[existing] = { ...e, qty: totalQty, avgPrice: totalCost / totalQty };
    } else {
      p.push(position);
    }
    this.set('portfolio', p);
  }

  removePosition(id) {
    this.update('portfolio', p => p.filter(x => x.id !== id));
  }

  // ---- Transaction methods ----
  addTransaction(tx) {
    this.update('transactions', txs => [tx, ...txs]);
  }

  // ---- Income methods ----
  addIncome(item) {
    this.update('income', list => [item, ...list]);
  }

  // ---- Expense methods ----
  addExpense(item) {
    this.update('expenses', list => [item, ...list]);
  }

  // ---- Goal methods ----
  addGoal(goal) {
    this.update('goals', list => [...list, goal]);
  }

  updateGoal(id, updates) {
    this.update('goals', list => list.map(g => g.id === id ? { ...g, ...updates } : g));
  }

  deleteGoal(id) {
    this.update('goals', list => list.filter(g => g.id !== id));
  }

  // ---- Debt methods ----
  addDebt(debt) {
    this.update('debts', list => [...list, debt]);
  }
  updateDebt(id, updates) {
    this.update('debts', list => list.map(d => d.id === id ? { ...d, ...updates } : d));
  }
  deleteDebt(id) {
    this.update('debts', list => list.filter(d => d.id !== id));
  }

  // ---- Habit methods ----
  addHabit(habit) {
    this.update('habits', list => [...list, habit]);
  }
  updateHabit(id, updates) {
    this.update('habits', list => list.map(h => h.id === id ? { ...h, ...updates } : h));
  }
  deleteHabit(id) {
    this.update('habits', list => list.filter(h => h.id !== id));
  }

  // ---- Journal ----
  addJournalEntry(entry) {
    this.update('journalEntries', list => [entry, ...list]);
  }
  deleteJournalEntry(id) {
    this.update('journalEntries', list => list.filter(e => e.id !== id));
  }

  // ---- Notifications ----
  addNotification(notif) {
    this.update('notifications', list => [notif, ...list].slice(0, 50));
    this._updateNotifBadge();
  }
  markNotifRead(id) {
    this.update('notifications', list => list.map(n => n.id === id ? { ...n, read: true } : n));
    this._updateNotifBadge();
  }
  clearNotifications() {
    this.set('notifications', []);
    this._updateNotifBadge();
  }
  _updateNotifBadge() {
    const unread = this.get('notifications').filter(n => !n.read).length;
    const badge = document.getElementById('notif-badge');
    if (badge) {
      badge.textContent = unread;
      badge.style.display = unread ? 'flex' : 'none';
    }
  }

  // ---- Aggregate helpers ----
  getTotalIncome(month = null) {
    let income = this.get('income');
    if (month) income = income.filter(i => i.date && i.date.startsWith(month));
    return income.reduce((s, i) => s + (parseFloat(i.amount) || 0), 0);
  }

  getTotalExpenses(month = null) {
    let expenses = this.get('expenses');
    if (month) expenses = expenses.filter(e => e.date && e.date.startsWith(month));
    return expenses.reduce((s, e) => s + (parseFloat(e.amount) || 0), 0);
  }

  getNetWorth(prices = {}) {
    const portfolio = this.get('portfolio');
    let investmentValue = 0;
    portfolio.forEach(p => {
      const price = prices[p.symbol] || p.avgPrice;
      investmentValue += price * p.qty;
    });
    const debts = this.get('debts');
    const totalDebt = debts.reduce((s, d) => s + (parseFloat(d.balance) || 0), 0);
    const savings = parseFloat(storage.get('savings', 0)) || 0;
    return { investmentValue, totalDebt, savings, netWorth: investmentValue + savings - totalDebt };
  }

  getExpensesByCategory(month = null) {
    let expenses = this.get('expenses');
    if (month) expenses = expenses.filter(e => e.date && e.date.startsWith(month));
    const cats = {};
    expenses.forEach(e => {
      const c = e.category || 'Other';
      cats[c] = (cats[c] || 0) + (parseFloat(e.amount) || 0);
    });
    return cats;
  }
}

export const store = new Store();
export default store;
