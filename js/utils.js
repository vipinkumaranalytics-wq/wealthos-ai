// =====================================================
// WealthOS AI — Utility Functions
// =====================================================

/** Format a number as currency */
export function formatCurrency(value, currency = 'USD', compact = false) {
  if (value === null || value === undefined || isNaN(value)) return '—';
  const absVal = Math.abs(value);
  if (compact) {
    if (absVal >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
    if (absVal >= 1e9)  return `$${(value / 1e9).toFixed(2)}B`;
    if (absVal >= 1e6)  return `$${(value / 1e6).toFixed(2)}M`;
    if (absVal >= 1e3)  return `$${(value / 1e3).toFixed(2)}K`;
  }
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency', currency,
      minimumFractionDigits: value < 1 ? 4 : 2,
      maximumFractionDigits: value < 1 ? 6 : 2,
    }).format(value);
  } catch {
    return `$${value.toFixed(2)}`;
  }
}

/** Format percentage */
export function formatPct(value, decimals = 2) {
  if (value === null || value === undefined || isNaN(value)) return '—';
  return `${value >= 0 ? '+' : ''}${value.toFixed(decimals)}%`;
}

/** Format large numbers (compact) */
export function formatCompact(value) {
  if (value === null || value === undefined || isNaN(value)) return '—';
  const abs = Math.abs(value);
  const sign = value < 0 ? '-' : '';
  if (abs >= 1e12) return `${sign}${(abs / 1e12).toFixed(2)}T`;
  if (abs >= 1e9)  return `${sign}${(abs / 1e9).toFixed(2)}B`;
  if (abs >= 1e6)  return `${sign}${(abs / 1e6).toFixed(2)}M`;
  if (abs >= 1e3)  return `${sign}${(abs / 1e3).toFixed(2)}K`;
  return `${sign}${abs.toFixed(2)}`;
}

/** Format number with commas */
export function formatNumber(value, decimals = 2) {
  if (value === null || value === undefined || isNaN(value)) return '—';
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/** Get CSS class for positive/negative values */
export function colorClass(value) {
  if (value > 0) return 'text-success';
  if (value < 0) return 'text-danger';
  return 'text-muted';
}

/** Get pill class for change values */
export function pillClass(value) {
  if (value > 0) return 'pill-up';
  if (value < 0) return 'pill-down';
  return 'pill-neutral';
}

/** Get badge class for change values */
export function badgeClass(value) {
  if (value > 0) return 'badge-success';
  if (value < 0) return 'badge-danger';
  return 'badge badge-warning';
}

/** Format date */
export function formatDate(date, opts = {}) {
  const d = date instanceof Date ? date : new Date(date);
  if (isNaN(d)) return '—';
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric', month: 'short', day: 'numeric', ...opts
  }).format(d);
}

/** Format relative time */
export function timeAgo(date) {
  const d = date instanceof Date ? date : new Date(date);
  const diff = Date.now() - d.getTime();
  const mins = Math.floor(diff / 60000);
  const hrs  = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1)  return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  if (hrs < 24)  return `${hrs}h ago`;
  if (days < 7)  return `${days}d ago`;
  return formatDate(d);
}

/** Debounce function */
export function debounce(fn, delay = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

/** Throttle function */
export function throttle(fn, limit = 200) {
  let last = 0;
  return (...args) => {
    const now = Date.now();
    if (now - last >= limit) { last = now; fn(...args); }
  };
}

/** Deep clone */
export function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

/** Generate unique ID */
export function uid(prefix = 'id') {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,7)}`;
}

/** Clamp value */
export function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max);
}

/** Linear interpolation for gauge colors */
export function lerpColor(a, b, t) {
  const ah = parseInt(a.slice(1), 16);
  const bh = parseInt(b.slice(1), 16);
  const ar = ah >> 16, ag = (ah >> 8) & 0xff, ab = ah & 0xff;
  const br = bh >> 16, bg = (bh >> 8) & 0xff, bb = bh & 0xff;
  const rr = Math.round(ar + (br - ar) * t);
  const rg = Math.round(ag + (bg - ag) * t);
  const rb = Math.round(ab + (bb - ab) * t);
  return `#${((rr << 16) | (rg << 8) | rb).toString(16).padStart(6, '0')}`;
}

/** Local storage helpers with JSON */
export const storage = {
  get(key, fallback = null) {
    try {
      const v = localStorage.getItem(key);
      return v !== null ? JSON.parse(v) : fallback;
    } catch { return fallback; }
  },
  set(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
  },
  remove(key) { localStorage.removeItem(key); },
  clear() { localStorage.clear(); },
};

/** Session cache (with TTL) */
const _cache = new Map();
export const cache = {
  get(key) {
    const entry = _cache.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expires) { _cache.delete(key); return null; }
    return entry.data;
  },
  set(key, data, ttl = 60) {
    _cache.set(key, { data, expires: Date.now() + ttl * 1000 });
  },
  has(key) { return !!this.get(key); },
  clear() { _cache.clear(); },
};

/** DOM helper: create element from HTML string */
export function html(str) {
  const t = document.createElement('template');
  t.innerHTML = str.trim();
  return t.content.firstElementChild;
}

/** Show toast notification */
export function toast(message, type = 'info', duration = 4000) {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const icons = { success: 'fa-check-circle', error: 'fa-exclamation-circle', warning: 'fa-exclamation-triangle', info: 'fa-info-circle' };
  const t = html(`
    <div class="toast ${type}">
      <i class="fa ${icons[type] || icons.info} toast-icon text-${type === 'error' ? 'danger' : type === 'success' ? 'success' : type}"></i>
      <span class="toast-msg">${message}</span>
      <button class="toast-close btn"><i class="fa fa-times text-muted"></i></button>
    </div>
  `);
  t.querySelector('.toast-close').onclick = () => removeToast(t);
  container.appendChild(t);
  if (duration > 0) setTimeout(() => removeToast(t), duration);
}
function removeToast(el) {
  el.classList.add('removing');
  setTimeout(() => el.remove(), 300);
}

/** Animate counter from 0 to target */
export function animateCounter(el, target, duration = 800, formatter = v => v.toFixed(0)) {
  const start = parseFloat(el.textContent) || 0;
  const startTime = performance.now();
  function update(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = start + (target - start) * eased;
    el.textContent = formatter(current);
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

/** Generate random sparkline data for demo */
export function generateSparkline(length = 14, base = 100, volatility = 0.03) {
  const data = [base];
  for (let i = 1; i < length; i++) {
    const change = (Math.random() - 0.48) * volatility;
    data.push(data[i-1] * (1 + change));
  }
  return data;
}

/** Create inline SVG sparkline */
export function svgSparkline(data, width = 80, height = 28, color = '#22c55e') {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const step = width / (data.length - 1);
  const pts = data.map((v, i) => `${i * step},${height - ((v - min) / range) * (height - 2) - 1}`).join(' ');
  const isUp = data[data.length-1] >= data[0];
  const c = isUp ? '#22c55e' : '#ef4444';
  return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" class="sparkline">
    <polyline points="${pts}" fill="none" stroke="${c}" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round"/>
  </svg>`;
}

/** Capitalize first letter */
export function capitalize(str) {
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
}

/** Calculate percentage change */
export function pctChange(current, previous) {
  if (!previous || previous === 0) return 0;
  return ((current - previous) / Math.abs(previous)) * 100;
}

/** Format fear & greed label */
export function fgLabel(value) {
  if (value <= 25) return { label: 'Extreme Fear', color: '#ef4444' };
  if (value <= 45) return { label: 'Fear', color: '#f97316' };
  if (value <= 55) return { label: 'Neutral', color: '#eab308' };
  if (value <= 75) return { label: 'Greed', color: '#84cc16' };
  return { label: 'Extreme Greed', color: '#22c55e' };
}

/** IndexedDB wrapper for large data */
export const idb = {
  db: null,
  async open() {
    if (this.db) return this.db;
    return new Promise((res, rej) => {
      const req = indexedDB.open('wealthos', 2);
      req.onupgradeneeded = e => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains('portfolio')) db.createObjectStore('portfolio', { keyPath: 'id' });
        if (!db.objectStoreNames.contains('transactions')) db.createObjectStore('transactions', { keyPath: 'id' });
        if (!db.objectStoreNames.contains('journal')) db.createObjectStore('journal', { keyPath: 'id' });
        if (!db.objectStoreNames.contains('goals')) db.createObjectStore('goals', { keyPath: 'id' });
        if (!db.objectStoreNames.contains('habits')) db.createObjectStore('habits', { keyPath: 'id' });
        if (!db.objectStoreNames.contains('watchlist')) db.createObjectStore('watchlist', { keyPath: 'id' });
      };
      req.onsuccess = e => { this.db = e.target.result; res(this.db); };
      req.onerror = e => rej(e);
    });
  },
  async getAll(store) {
    const db = await this.open();
    return new Promise((res, rej) => {
      const tx = db.transaction(store, 'readonly');
      const req = tx.objectStore(store).getAll();
      req.onsuccess = () => res(req.result);
      req.onerror = rej;
    });
  },
  async put(store, item) {
    const db = await this.open();
    return new Promise((res, rej) => {
      const tx = db.transaction(store, 'readwrite');
      const req = tx.objectStore(store).put(item);
      req.onsuccess = () => res(req.result);
      req.onerror = rej;
    });
  },
  async delete(store, id) {
    const db = await this.open();
    return new Promise((res, rej) => {
      const tx = db.transaction(store, 'readwrite');
      const req = tx.objectStore(store).delete(id);
      req.onsuccess = () => res();
      req.onerror = rej;
    });
  },
  async clear(store) {
    const db = await this.open();
    return new Promise((res, rej) => {
      const tx = db.transaction(store, 'readwrite');
      tx.objectStore(store).clear();
      tx.oncomplete = res;
      tx.onerror = rej;
    });
  },
};

/** Export data to CSV */
export function exportCSV(data, filename = 'wealthos-export.csv') {
  if (!data || !data.length) return;
  const headers = Object.keys(data[0]).join(',');
  const rows = data.map(row => Object.values(row).map(v => `"${v}"`).join(','));
  const csv = [headers, ...rows].join('\n');
  downloadBlob(new Blob([csv], { type: 'text/csv' }), filename);
}

/** Export to JSON */
export function exportJSON(data, filename = 'wealthos-export.json') {
  downloadBlob(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }), filename);
}

/** Download blob helper */
function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click();
  document.body.removeChild(a); URL.revokeObjectURL(url);
}

/** Render a simple mini chart using Chart.js */
export function createMiniChart(canvasId, data, color = '#6366f1') {
  const canvas = document.getElementById(canvasId);
  if (!canvas || !window.Chart) return null;
  const existing = Chart.getChart(canvas);
  if (existing) existing.destroy();
  return new Chart(canvas, {
    type: 'line',
    data: {
      labels: data.map((_, i) => i),
      datasets: [{ data, borderColor: color, borderWidth: 2, pointRadius: 0, fill: true, backgroundColor: color + '18', tension: 0.4 }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { enabled: false } },
      scales: { x: { display: false }, y: { display: false } },
      animation: { duration: 600 },
    }
  });
}

/** Get sentiment emoji */
export function sentimentEmoji(score) {
  if (score > 0.6) return '🚀';
  if (score > 0.2) return '📈';
  if (score > -0.2) return '➡️';
  if (score > -0.6) return '📉';
  return '💥';
}

/** Parse RSS feed via rss2json */
export async function fetchRSS(url, apiKey = '') {
  const endpoint = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(url)}${apiKey ? '&api_key=' + apiKey : ''}`;
  const resp = await fetch(endpoint);
  if (!resp.ok) throw new Error('RSS fetch failed');
  return resp.json();
}
