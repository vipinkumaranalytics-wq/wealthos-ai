// =====================================================
// WealthOS AI — Client-Side Router
// =====================================================
import { store } from './store.js';

class Router {
  constructor() {
    this.routes = new Map();
    this.currentPage = null;
    this.container = null;
    this._cleanups = [];
  }

  init(container) {
    this.container = container;
    window.addEventListener('hashchange', () => this._navigate());
    // Handle popstate too
    window.addEventListener('popstate', () => this._navigate());
  }

  register(page, renderer) {
    this.routes.set(page, renderer);
  }

  _navigate() {
    const hash = window.location.hash.slice(1) || 'dashboard';
    const page = hash.split('?')[0] || 'dashboard';
    this.goto(page);
  }

  goto(page) {
    const renderer = this.routes.get(page);
    if (!renderer) {
      // Try to find a close match or fall back to dashboard
      const fallback = this.routes.get('dashboard');
      if (fallback) { this.goto('dashboard'); return; }
      return;
    }

    // Run cleanups from previous page
    this._cleanups.forEach(fn => { try { fn(); } catch {} });
    this._cleanups = [];

    this.currentPage = page;

    // Update nav active states
    document.querySelectorAll('.nav-item').forEach(el => {
      el.classList.toggle('active', el.dataset.page === page);
    });

    // Update breadcrumb
    const activeNav = document.querySelector(`.nav-item[data-page="${page}"]`);
    const bc = document.getElementById('breadcrumb');
    if (bc && activeNav) {
      bc.textContent = activeNav.querySelector('span')?.textContent || page;
    }

    // Update URL without reload
    history.replaceState(null, '', `#${page}`);

    // Clear container and render
    if (this.container) {
      this.container.innerHTML = '';
      this.container.classList.add('animate-fade');
      setTimeout(() => this.container.classList.remove('animate-fade'), 400);
    }

    // Close sidebar on mobile BEFORE rendering (prevents tap-through issues)
    if (window.innerWidth < 900) {
      document.getElementById('sidebar')?.classList.remove('mobile-open');
      document.getElementById('sidebar-overlay')?.remove();
    }

    // Render the page — wrapped in try/catch so errors show instead of silently showing Dashboard
    try {
      const cleanup = renderer(this.container);
      if (typeof cleanup === 'function') {
        this._cleanups.push(cleanup);
      }
    } catch (err) {
      console.error(`[Router] Error rendering page "${page}":`, err);
      if (this.container) {
        this.container.innerHTML = `
          <div style="padding:60px 24px;text-align:center">
            <i class="fa fa-triangle-exclamation" style="font-size:3rem;color:#f59e0b;display:block;margin-bottom:16px"></i>
            <h2 style="color:#f8fafc;margin-bottom:8px">Could not load "${page}"</h2>
            <p style="color:#94a3b8;margin-bottom:20px">Error: ${err.message}</p>
            <a href="#dashboard" style="padding:10px 24px;background:#6366f1;color:#fff;border-radius:8px;text-decoration:none;font-weight:600">
              <i class="fa fa-house"></i> Go to Dashboard
            </a>
          </div>`;
      }
    }

    // Scroll to top
    if (this.container) this.container.scrollTop = 0;
  }

  registerCleanup(fn) {
    this._cleanups.push(fn);
  }

  start() {
    this._navigate();
  }
}

export const router = new Router();
export default router;
