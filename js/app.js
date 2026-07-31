// =====================================================
// WealthOS AI — Main Application Entry Point
// =====================================================
import { router } from './router.js';
import { store } from './store.js';
import { toast, storage } from './utils.js';

// Page Renderers
import { renderDashboard } from './pages/dashboard.js';
import {
  renderGlobalMarkets, renderStocks, renderETFs, renderMutualFunds,
  renderTopGainers, renderTopLosers, renderHeatmap, renderSectorPerformance
} from './pages/markets.js';
import { renderCrypto } from './pages/crypto.js';
import { renderForex, renderCommodities } from './pages/forex.js';
import {
  renderEconomicCalendar, renderIPOTracker, renderFearGreed
} from './pages/economic.js';
import {
  renderPortfolio, renderWatchlist, renderDividendTracker
} from './pages/portfolio.js';
import {
  renderPersonalDashboard, renderIncomeTracker, renderExpenseTracker,
  renderNetWorth, renderGoalPlanner, renderDebtTracker,
  renderRetirementPlanner, renderTaxPlanner, renderBudgetPlanner
} from './pages/personal.js';
import { renderNews, renderMarketSentiment } from './pages/news.js';
import { renderAIChat } from './pages/ai-chat.js';
import { renderFinancialStatements } from './pages/financial-statements.js';
import { renderLearningCenter, renderHabitTracker, renderJournal } from './pages/learning.js';
import { renderReports } from './pages/reports.js';
import { renderSettings } from './pages/settings.js';

// ---- REGISTER ALL ROUTES ----
function registerRoutes() {
  const c = document.getElementById('page-container');

  router.register('dashboard', () => renderDashboard(c));
  router.register('global-markets', () => renderGlobalMarkets(c));
  router.register('stocks', () => renderStocks(c));
  router.register('etfs', () => renderETFs(c));
  router.register('mutual-funds', () => renderMutualFunds(c));
  router.register('top-gainers', () => renderTopGainers(c));
  router.register('top-losers', () => renderTopLosers(c));
  router.register('heatmap', () => renderHeatmap(c));
  router.register('sector-performance', () => renderSectorPerformance(c));
  router.register('crypto', () => renderCrypto(c));
  router.register('forex', () => renderForex(c));
  router.register('commodities', () => renderCommodities(c));
  router.register('economic-calendar', () => renderEconomicCalendar(c));
  router.register('ipo-tracker', () => renderIPOTracker(c));
  router.register('fear-greed', () => renderFearGreed(c));
  router.register('portfolio', () => renderPortfolio(c));
  router.register('watchlist', () => renderWatchlist(c));
  router.register('dividend-tracker', () => renderDividendTracker(c));
  router.register('personal-dashboard', () => renderPersonalDashboard(c));
  router.register('income-tracker', () => renderIncomeTracker(c));
  router.register('expense-tracker', () => renderExpenseTracker(c));
  router.register('net-worth', () => renderNetWorth(c));
  router.register('goal-planner', () => renderGoalPlanner(c));
  router.register('debt-tracker', () => renderDebtTracker(c));
  router.register('retirement-planner', () => renderRetirementPlanner(c));
  router.register('tax-planner', () => renderTaxPlanner(c));
  router.register('budget-planner', () => renderBudgetPlanner(c));
  router.register('news', () => renderNews(c));
  router.register('market-sentiment', () => renderMarketSentiment(c));
  router.register('ai-chat', () => renderAIChat(c));
  router.register('financial-statements', () => renderFinancialStatements(c));
  router.register('learning', () => renderLearningCenter(c));
  router.register('habits', () => renderHabitTracker(c));
  router.register('journal', () => renderJournal(c));
  router.register('reports', () => renderReports(c));
  router.register('settings', () => renderSettings(c));

  // Fallback for unmatched hash
  router.register('404', () => {
    c.innerHTML = `
      <div class="empty-state" style="min-height:60vh;display:flex;flex-direction:column;align-items:center;justify-content:center">
        <i class="fa fa-compass" style="font-size:4rem;margin-bottom:16px;color:var(--text-muted)"></i>
        <h2>Page not found</h2>
        <p class="text-muted">This page doesn't exist yet or has been moved.</p>
        <a href="#dashboard" class="btn btn-primary mt-3"><i class="fa fa-house"></i> Go to Dashboard</a>
      </div>
    `;
  });
}

// ---- INIT LOADER ----
function hideLoader() {
  const loader = document.getElementById('app-loader');
  if (loader) {
    loader.style.opacity = '0';
    loader.style.transition = 'opacity 0.5s ease';
    setTimeout(() => loader.remove(), 500);
  }
}

function updateLoader(msg, pct) {
  const status = document.getElementById('loading-status');
  const bar = document.getElementById('loading-bar-fill');
  if (status) status.textContent = msg;
  if (bar) bar.style.width = pct + '%';
}

// ---- SIDEBAR TOGGLE ----
function initSidebar() {
  const toggle = document.getElementById('sidebar-toggle');
  const sidebar = document.querySelector('.sidebar');
  const mainWrapper = document.querySelector('.main-wrapper');

  if (toggle && sidebar) {
    toggle.onclick = () => {
      sidebar.classList.toggle('collapsed');
      mainWrapper?.classList.toggle('sidebar-collapsed');
      // Save preference
      store.update('settings', s => ({ ...s, sidebarCollapsed: sidebar.classList.contains('collapsed') }));
    };

    // Restore preference
    const settings = store.get('settings');
    if (settings.sidebarCollapsed) {
      sidebar.classList.add('collapsed');
      mainWrapper?.classList.add('sidebar-collapsed');
    }
  }

  // Mobile overlay
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  if (mobileToggle && sidebar) {
    mobileToggle.onclick = () => {
      sidebar.classList.toggle('mobile-open');
      if (sidebar.classList.contains('mobile-open')) {
        const overlay = document.createElement('div');
        overlay.id = 'sidebar-overlay';
        overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:99;backdrop-filter:blur(2px)';
        overlay.onclick = () => { sidebar.classList.remove('mobile-open'); overlay.remove(); };
        document.body.appendChild(overlay);
      } else {
        document.getElementById('sidebar-overlay')?.remove();
      }
    };
  }
}

// ---- THEME INIT ----
function initTheme() {
  const settings = store.get('settings');
  const theme = settings.theme || 'dark';
  document.documentElement.setAttribute('data-theme', theme);
  if (settings.accentColor) {
    document.documentElement.style.setProperty('--brand-primary', settings.accentColor);
  }
  if (settings.fontSize) {
    document.documentElement.style.fontSize = settings.fontSize + 'px';
  }

  // Theme toggle button
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    const updateIcon = () => {
      const current = document.documentElement.getAttribute('data-theme');
      themeToggle.innerHTML = `<i class="fa fa-${current === 'dark' ? 'sun' : 'moon'}"></i>`;
    };
    updateIcon();
    themeToggle.onclick = () => {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      store.update('settings', s => ({ ...s, theme: next }));
      updateIcon();
    };
  }
}

// ---- TICKER BAR ----
async function initTickerBar() {
  const ticker = document.getElementById('market-ticker');
  if (!ticker) return;

  const TICKER_DATA = [
    { sym: 'BTC', price: '$67,234', change: '+2.4%', up: true },
    { sym: 'ETH', price: '$3,521', change: '+1.8%', up: true },
    { sym: 'GOLD', price: '$2,345', change: '+0.4%', up: true },
    { sym: 'S&P 500', price: '5,432', change: '+0.6%', up: true },
    { sym: 'AAPL', price: '$189.3', change: '-0.2%', up: false },
    { sym: 'MSFT', price: '$415.5', change: '+0.9%', up: true },
    { sym: 'EUR/USD', price: '1.0865', change: '-0.1%', up: false },
    { sym: 'Crude Oil', price: '$82.45', change: '-1.2%', up: false },
    { sym: 'TSLA', price: '$245.8', change: '+3.1%', up: true },
    { sym: 'BNB', price: '$412', change: '+0.7%', up: true },
  ];

  const html = TICKER_DATA.map(t => `
    <span class="ticker-item">
      <span class="ticker-sym">${t.sym}</span>
      <span class="ticker-price">${t.price}</span>
      <span class="ticker-change ${t.up ? 'up' : 'down'}">${t.change}</span>
    </span>
  `).join('');
  ticker.innerHTML = html + html; // duplicate for infinite scroll
}

// ---- SEARCH ----
function initSearch() {
  const searchInput = document.getElementById('global-search');
  const resultsContainer = document.getElementById('search-results') || createSearchResults();

  const SEARCH_INDEX = [
    { term: 'dashboard', page: 'dashboard', label: '📊 Dashboard', desc: 'Overview of all your finances' },
    { term: 'crypto', page: 'crypto', label: '₿ Crypto Markets', desc: 'Bitcoin, Ethereum and altcoins' },
    { term: 'bitcoin ethereum', page: 'crypto', label: '₿ Crypto', desc: 'Cryptocurrency prices' },
    { term: 'stocks shares equity', page: 'stocks', label: '📈 Stocks', desc: 'Stock market tracker' },
    { term: 'forex currency exchange', page: 'forex', label: '💱 Forex', desc: 'Foreign exchange rates' },
    { term: 'portfolio investments holdings', page: 'portfolio', label: '💼 Portfolio', desc: 'Your investment portfolio' },
    { term: 'watchlist favorites', page: 'watchlist', label: '⭐ Watchlist', desc: 'Saved assets' },
    { term: 'news headlines', page: 'news', label: '📰 Business News', desc: 'Financial news and updates' },
    { term: 'chat ai assistant', page: 'ai-chat', label: '🤖 AI Advisor', desc: 'AI financial assistant' },
    { term: 'income salary', page: 'income-tracker', label: '💰 Income Tracker', desc: 'Track your income' },
    { term: 'expenses spending budget', page: 'expense-tracker', label: '🧾 Expense Tracker', desc: 'Log your expenses' },
    { term: 'goals targets savings', page: 'goal-planner', label: '🎯 Goal Planner', desc: 'Financial goals' },
    { term: 'net worth assets', page: 'net-worth', label: '📊 Net Worth', desc: 'Track your net worth' },
    { term: 'retirement pension', page: 'retirement-planner', label: '🌴 Retirement', desc: 'Retirement calculator' },
    { term: 'tax deductions', page: 'tax-planner', label: '📋 Tax Planner', desc: 'Tax planning tools' },
    { term: 'debt loan credit', page: 'debt-tracker', label: '💳 Debt Tracker', desc: 'Manage debts' },
    { term: 'learn education courses', page: 'learning', label: '🎓 Learning', desc: 'Financial education' },
    { term: 'habits routine', page: 'habits', label: '🔥 Habit Tracker', desc: 'Build financial habits' },
    { term: 'journal diary notes', page: 'journal', label: '📖 Journal', desc: 'Financial journal' },
    { term: 'reports export', page: 'reports', label: '📑 Reports', desc: 'Generate reports' },
    { term: 'settings preferences', page: 'settings', label: '⚙️ Settings', desc: 'App settings' },
    { term: 'fear greed index sentiment', page: 'fear-greed', label: '😱 Fear & Greed', desc: 'Market sentiment' },
    { term: 'ipo listing new stocks', page: 'ipo-tracker', label: '🚀 IPO Tracker', desc: 'New public offerings' },
    { term: 'economic calendar events', page: 'economic-calendar', label: '📅 Economic Calendar', desc: 'Economic events' },
    { term: 'commodities gold oil silver', page: 'commodities', label: '🥇 Commodities', desc: 'Commodity prices' },
    { term: 'dividends income passive', page: 'dividend-tracker', label: '💸 Dividend Tracker', desc: 'Track dividends' },
    { term: 'company financials balance sheet', page: 'financial-statements', label: '🏦 Financials', desc: 'Company statements' },
    { term: 'budget 50 30 20 rule', page: 'budget-planner', label: '⚖️ Budget Planner', desc: 'Budget planning' },
    { term: 'heatmap sectors', page: 'heatmap', label: '🟩 Market Heatmap', desc: 'Visual market view' },
    { term: 'gainers winners', page: 'top-gainers', label: '🚀 Top Gainers', desc: 'Best performing assets' },
    { term: 'losers decliners', page: 'top-losers', label: '📉 Top Losers', desc: 'Worst performers' },
  ];

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const q = e.target.value.trim().toLowerCase();
      if (!q) { hideSearch(); return; }
      const results = SEARCH_INDEX.filter(item => item.term.includes(q) || item.label.toLowerCase().includes(q) || item.desc.toLowerCase().includes(q)).slice(0, 6);
      showSearchResults(results, q);
    });
    searchInput.addEventListener('keydown', e => {
      if (e.key === 'Escape') hideSearch();
    });
    document.addEventListener('click', e => { if (!e.target.closest('.topnav-search')) hideSearch(); });
  }

  function createSearchResults() {
    const div = document.createElement('div');
    div.id = 'search-results';
    div.style.cssText = 'position:absolute;top:100%;left:0;right:0;background:var(--bg-card);border:1px solid var(--border-color);border-radius:10px;box-shadow:var(--shadow-lg);z-index:200;display:none;max-height:300px;overflow-y:auto';
    document.querySelector('.topnav-search')?.appendChild(div);
    return div;
  }

  function showSearchResults(results, q) {
    const cont = document.getElementById('search-results');
    if (!cont) return;
    if (!results.length) {
      cont.innerHTML = `<div style="padding:12px;color:var(--text-muted);text-align:center;font-size:0.875rem"><i class="fa fa-search"></i> No results for "${q}"</div>`;
    } else {
      cont.innerHTML = results.map(r => `
        <a href="#${r.page}" onclick="document.getElementById('global-search').value='';document.getElementById('search-results').style.display='none'" style="display:flex;align-items:center;gap:10px;padding:10px 14px;text-decoration:none;transition:background 0.15s;border-bottom:1px solid var(--border-color)" onmouseover="this.style.background='rgba(99,102,241,0.08)'" onmouseout="this.style.background=''">
          <div style="flex:1">
            <div style="font-weight:600;font-size:0.875rem;color:var(--text-primary)">${r.label}</div>
            <div style="font-size:0.75rem;color:var(--text-muted)">${r.desc}</div>
          </div>
          <i class="fa fa-arrow-right" style="color:var(--text-muted);font-size:0.75rem"></i>
        </a>
      `).join('');
    }
    cont.style.display = 'block';
  }

  function hideSearch() {
    const cont = document.getElementById('search-results');
    if (cont) cont.style.display = 'none';
  }
}

// ---- NOTIFICATIONS ----
function initNotifications() {
  const btn = document.getElementById('notifications-btn');
  const panel = document.getElementById('notifications-panel');
  const badge = document.getElementById('notif-badge');
  const list = document.getElementById('notif-list');

  const notifications = store.get('notifications');
  const unread = notifications.filter(n => !n.read).length;

  if (badge) {
    badge.textContent = unread > 0 ? unread : '';
    badge.style.display = unread > 0 ? 'flex' : 'none';
  }

  if (list && notifications.length) {
    list.innerHTML = notifications.slice(0, 8).map(n => `
      <div style="display:flex;gap:10px;padding:12px 14px;border-bottom:1px solid var(--border-color);${!n.read?'background:rgba(99,102,241,0.06)':''}">
        <div style="width:8px;height:8px;border-radius:50%;background:${n.read?'var(--border-color)':'var(--brand-primary)'};margin-top:6px;flex-shrink:0"></div>
        <div style="flex:1">
          <div style="font-weight:600;font-size:0.8rem">${n.title}</div>
          <div style="font-size:0.75rem;color:var(--text-muted)">${n.body}</div>
          <div style="font-size:0.7rem;color:var(--text-muted);margin-top:3px">${n.time || 'Just now'}</div>
        </div>
      </div>
    `).join('');
  }

  if (btn && panel) {
    btn.onclick = (e) => {
      e.stopPropagation();
      panel.classList.toggle('open');
      // Mark all read
      store.update('notifications', list => list.map(n => ({ ...n, read: true })));
      if (badge) { badge.style.display = 'none'; }
    };
    document.addEventListener('click', e => {
      if (!e.target.closest('#notifications-btn') && !e.target.closest('#notifications-panel')) {
        panel.classList.remove('open');
      }
    });
  }
}

// ---- VOICE SEARCH ----
function initVoiceSearch() {
  const voiceBtn = document.getElementById('voice-btn');
  if (!voiceBtn || !('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) return;

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
  recognition.interimResults = false;

  let listening = false;
  voiceBtn.onclick = () => {
    if (listening) { recognition.stop(); return; }
    recognition.start();
    listening = true;
    voiceBtn.innerHTML = '<i class="fa fa-microphone-slash" style="color:var(--brand-danger)"></i>';
    toast('Listening... Speak now', 'info');
  };

  recognition.onresult = (e) => {
    const transcript = e.results[0][0].transcript.toLowerCase();
    const searchInput = document.getElementById('global-search');
    if (searchInput) {
      searchInput.value = transcript;
      searchInput.dispatchEvent(new Event('input'));
    }

    // Auto-navigate based on voice command
    const navMap = {
      'dashboard': 'dashboard', 'bitcoin': 'crypto', 'crypto': 'crypto', 'stocks': 'stocks',
      'portfolio': 'portfolio', 'news': 'news', 'chat': 'ai-chat', 'settings': 'settings',
      'income': 'income-tracker', 'expenses': 'expense-tracker', 'goals': 'goal-planner',
      'forex': 'forex', 'gold': 'commodities', 'journal': 'journal', 'habits': 'habits',
    };
    for (const [keyword, page] of Object.entries(navMap)) {
      if (transcript.includes(keyword)) {
        location.hash = page;
        toast(`Navigating to ${page}...`, 'success');
        break;
      }
    }
  };

  recognition.onend = () => {
    listening = false;
    voiceBtn.innerHTML = '<i class="fa fa-microphone"></i>';
  };

  recognition.onerror = () => {
    listening = false;
    voiceBtn.innerHTML = '<i class="fa fa-microphone"></i>';
    toast('Voice recognition error. Try again.', 'error');
  };
}

// ---- COMMAND PALETTE ----
function initCommandPalette() {
  const palette = document.getElementById('command-palette');
  const input = palette?.querySelector('#command-input');

  // Open with Ctrl+K or Cmd+K
  document.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      palette?.classList.toggle('open');
      if (palette?.classList.contains('open')) input?.focus();
    }
    if (e.key === 'Escape') palette?.classList.remove('open');
  });

  palette?.addEventListener('click', e => {
    if (e.target === palette) palette.classList.remove('open');
  });
}

// ---- PWA SERVICE WORKER ----
function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./service-worker.js').then(reg => {
        console.log('[WealthOS] SW registered:', reg.scope);
      }).catch(err => {
        console.warn('[WealthOS] SW registration failed:', err);
      });
    });
  }
}

// ---- KEYBOARD SHORTCUTS ----
function initKeyboardShortcuts() {
  document.addEventListener('keydown', e => {
    // Skip if user is typing in an input
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) return;

    const shortcuts = {
      'd': 'dashboard', 'c': 'crypto', 's': 'stocks', 'p': 'portfolio',
      'n': 'news', 'a': 'ai-chat', 'w': 'watchlist', 'f': 'forex',
      'g': 'goal-planner', 'e': 'expense-tracker', 'i': 'income-tracker',
    };

    if (shortcuts[e.key]) location.hash = shortcuts[e.key];
    if (e.key === '/') { document.getElementById('global-search')?.focus(); e.preventDefault(); }
    if (e.key === 't') {
      const current = document.documentElement.getAttribute('data-theme');
      document.documentElement.setAttribute('data-theme', current === 'dark' ? 'light' : 'dark');
    }
  });
}

// ---- INIT APP ----
async function initApp() {
  try {
    updateLoader('Initializing store...', 10);
    await new Promise(r => setTimeout(r, 80));

    updateLoader('Loading theme...', 20);
    initTheme();

    updateLoader('Setting up routes...', 35);
    registerRoutes();
    router.init(document.getElementById('page-container'));

    updateLoader('Initializing sidebar...', 50);
    initSidebar();

    updateLoader('Starting market ticker...', 65);
    await initTickerBar();

    updateLoader('Setting up search...', 75);
    initSearch();

    updateLoader('Initializing notifications...', 85);
    initNotifications();

    updateLoader('Starting voice & keyboard...', 92);
    initVoiceSearch();
    initCommandPalette();
    initKeyboardShortcuts();

    updateLoader('Registering service worker...', 97);
    registerServiceWorker();

    updateLoader('Ready!', 100);
    await new Promise(r => setTimeout(r, 200));

    // Start router
    router.start();

    // Hide loader
    hideLoader();

    // Welcome toast
    const user = store.get('user');
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
    setTimeout(() => {
      toast(`${greeting}, ${user.name || 'Investor'}! 👋 Markets are open.`, 'success', 4000);
    }, 600);

    // Check for market open notification
    checkMarketStatus();

  } catch (err) {
    console.error('[WealthOS] Init error:', err);
    updateLoader('Error loading app. Retrying...', 100);
    setTimeout(() => location.reload(), 2000);
  }
}

function checkMarketStatus() {
  const now = new Date();
  const day = now.getDay(); // 0=Sun, 6=Sat
  const hour = now.getHours();
  const min = now.getMinutes();
  const totalMin = hour * 60 + min;
  const isWeekday = day > 0 && day < 6;
  const isMarketHours = totalMin >= 9 * 60 + 30 && totalMin < 16 * 60; // 9:30am - 4pm ET

  if (isWeekday && isMarketHours) {
    store.addNotification({
      id: 'mkt-' + Date.now(), title: '🟢 US Markets Open', body: 'NYSE & NASDAQ are currently open for trading.',
      type: 'success', read: false, time: 'Just now'
    });
  }
}

// ---- START ----
document.addEventListener('DOMContentLoaded', initApp);
