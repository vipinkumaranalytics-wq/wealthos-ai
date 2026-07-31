// =====================================================
// WealthOS AI — Service Worker (PWA)
// =====================================================
const CACHE_NAME = 'wealthos-ai-v1.0.0';
const STATIC_ASSETS = [
  './',
  './index.html',
  './css/main.css',
  './js/app.js',
  './js/router.js',
  './js/store.js',
  './js/utils.js',
  './js/config.js',
  './js/api.js',
  './js/pages/dashboard.js',
  './js/pages/markets.js',
  './js/pages/crypto.js',
  './js/pages/portfolio.js',
  './js/pages/forex.js',
  './js/pages/economic.js',
  './js/pages/news.js',
  './js/pages/ai-chat.js',
  './js/pages/personal.js',
  './js/pages/reports.js',
  './js/pages/learning.js',
  './js/pages/settings.js',
  './js/pages/financial-statements.js',
  './manifest.json',
];

const CDN_ASSETS = [
  'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/apexcharts/3.44.0/apexcharts.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css',
];

// ---- INSTALL ----
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async cache => {
      console.log('[SW] Caching static assets...');
      // Cache local assets (don't fail if some missing)
      const results = await Promise.allSettled(
        STATIC_ASSETS.map(url => cache.add(url).catch(e => console.warn('[SW] Failed to cache:', url, e)))
      );
      // Cache CDN assets separately
      await Promise.allSettled(
        CDN_ASSETS.map(url => cache.add(url).catch(e => console.warn('[SW] Failed to cache CDN:', url)))
      );
      console.log('[SW] Install complete.');
    })
  );
  self.skipWaiting();
});

// ---- ACTIVATE ----
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(key => key !== CACHE_NAME).map(key => {
        console.log('[SW] Deleting old cache:', key);
        return caches.delete(key);
      })
    ))
  );
  self.clients.claim();
});

// ---- FETCH (Network First for API, Cache First for assets) ----
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip browser extensions and devtools
  if (url.protocol === 'chrome-extension:' || url.protocol === 'moz-extension:') return;

  // API calls: Network First with short timeout, fallback to cache
  if (isApiCall(url)) {
    event.respondWith(networkFirstWithTimeout(request, 5000));
    return;
  }

  // Static assets: Cache First, fallback to network
  if (isStaticAsset(url)) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // HTML pages: Network First
  if (request.mode === 'navigate' || request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(networkFirst(request));
    return;
  }

  // Default: Stale While Revalidate
  event.respondWith(staleWhileRevalidate(request));
});

// ---- STRATEGIES ----
async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok) {
    const cache = await caches.open(CACHE_NAME);
    cache.put(request, response.clone());
  }
  return response;
}

async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return caches.match(request) || offlineFallback();
  }
}

async function networkFirstWithTimeout(request, timeout) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(request, { signal: controller.signal });
    clearTimeout(timer);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request.url, response.clone());
    }
    return response;
  } catch {
    clearTimeout(timer);
    const cached = await caches.match(request);
    return cached || new Response(JSON.stringify({ error: 'offline', cached: false }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  const fetchPromise = fetch(request).then(response => {
    if (response.ok) cache.put(request, response.clone());
    return response;
  }).catch(() => null);
  return cached || fetchPromise || offlineFallback();
}

// ---- HELPERS ----
function isApiCall(url) {
  const apiHosts = [
    'api.coingecko.com', 'open.er-api.com', 'api.alternative.me',
    'api.stlouisfed.org', 'www.alphavantage.co', 'api.worldbank.org',
    'rss2json.com', 'api.gdeltproject.org',
  ];
  return apiHosts.some(host => url.hostname.includes(host));
}

function isStaticAsset(url) {
  return url.origin === self.location.origin && (
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.css') ||
    url.pathname.endsWith('.json') ||
    url.pathname.endsWith('.svg') ||
    url.pathname.endsWith('.png') ||
    url.pathname.endsWith('.jpg') ||
    url.pathname.endsWith('.webp') ||
    url.pathname.endsWith('.woff2')
  );
}

function offlineFallback() {
  return new Response(`
    <!DOCTYPE html>
    <html>
    <head><title>WealthOS AI — Offline</title>
    <style>
      * { margin:0; padding:0; box-sizing:border-box; }
      body { background:#0f172a; color:#94a3b8; font-family:Inter,sans-serif; display:flex; align-items:center; justify-content:center; min-height:100vh; text-align:center; }
      .icon { font-size:4rem; margin-bottom:16px; }
      h1 { color:#f8fafc; margin-bottom:8px; }
      p { color:#64748b; margin-bottom:24px; }
      button { background:#6366f1; color:white; border:none; padding:12px 24px; border-radius:8px; cursor:pointer; font-size:1rem; }
    </style>
    </head>
    <body>
      <div>
        <div class="icon">📡</div>
        <h1>You're offline</h1>
        <p>WealthOS AI needs an internet connection for live market data.<br/>Your saved data is still available.</p>
        <button onclick="location.reload()">Try Again</button>
      </div>
    </body>
    </html>
  `, { headers: { 'Content-Type': 'text/html' } });
}

// ---- BACKGROUND SYNC ----
self.addEventListener('sync', event => {
  if (event.tag === 'sync-portfolio') {
    console.log('[SW] Background sync: portfolio');
  }
});

// ---- PUSH NOTIFICATIONS ----
self.addEventListener('push', event => {
  if (!event.data) return;
  const data = event.data.json();
  event.waitUntil(
    self.registration.showNotification(data.title || 'WealthOS AI', {
      body: data.body || 'Market update available',
      icon: './assets/icons/icon-192.png',
      badge: './assets/icons/icon-72.png',
      data: { url: data.url || './' },
      actions: [{ action: 'view', title: 'View' }, { action: 'dismiss', title: 'Dismiss' }],
    })
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  if (event.action === 'view' || !event.action) {
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then(windows => {
        const url = event.notification.data?.url || './';
        const found = windows.find(w => w.url === url);
        if (found) return found.focus();
        return clients.openWindow(url);
      })
    );
  }
});

console.log('[WealthOS AI] Service Worker loaded — v1.0.0');
