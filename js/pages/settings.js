// =====================================================
// WealthOS AI — Settings Page
// =====================================================
import { toast, storage } from '../utils.js';
import { store } from '../store.js';

export function renderSettings(container) {
  const settings = store.get('settings');
  const user = store.get('user');

  container.innerHTML = `
    <div class="page-header">
      <div><h1 class="page-title"><i class="fa fa-gear text-purple"></i> Settings</h1>
      <p class="page-subtitle">Customize your WealthOS AI experience</p></div>
    </div>

    <div class="grid grid-3">
      <!-- Left: Nav -->
      <div class="card" style="height:fit-content">
        <div class="card-body" style="padding:8px">
          ${[
            { id: 'profile', label: 'Profile', icon: 'fa-user' },
            { id: 'appearance', label: 'Appearance', icon: 'fa-paint-brush' },
            { id: 'preferences', label: 'Preferences', icon: 'fa-sliders' },
            { id: 'notifications', label: 'Notifications', icon: 'fa-bell' },
            { id: 'privacy', label: 'Privacy & Data', icon: 'fa-shield' },
            { id: 'danger', label: 'Reset / Clear Data', icon: 'fa-trash', danger: true },
          ].map(s=>`
            <button class="settings-nav-btn ${s.id==='profile'?'active':''}" data-tab="${s.id}" style="width:100%;text-align:left;display:flex;align-items:center;gap:10px;padding:10px 12px;border:none;background:${s.id==='profile'?'rgba(99,102,241,0.15)':'transparent'};border-radius:8px;margin-bottom:2px;cursor:pointer;color:${s.danger?'var(--brand-danger)':'var(--text-primary)'}">
              <i class="fa ${s.icon}" style="width:16px"></i>
              <span class="text-sm font-semibold">${s.label}</span>
            </button>
          `).join('')}
        </div>
      </div>

      <!-- Right: Content -->
      <div style="grid-column:2/4">
        <!-- Profile Tab -->
        <div id="tab-profile" class="settings-tab">
          <div class="card mb-4">
            <div class="card-header"><div class="card-title"><i class="fa fa-user"></i> Profile Settings</div></div>
            <div class="card-body">
              <div style="display:flex;gap:20px;align-items:flex-start;flex-wrap:wrap;margin-bottom:20px">
                <div style="position:relative">
                  <div style="width:80px;height:80px;border-radius:50%;background:var(--brand-primary);display:flex;align-items:center;justify-content:center;font-size:2rem;color:white;font-weight:700">
                    ${(user.name || 'U').charAt(0).toUpperCase()}
                  </div>
                  <button class="btn btn-sm btn-secondary" style="position:absolute;bottom:0;right:0;width:24px;height:24px;padding:0;border-radius:50%;font-size:0.65rem">
                    <i class="fa fa-pencil"></i>
                  </button>
                </div>
                <div style="flex:1">
                  <div class="font-bold text-lg">${user.name || 'Anonymous User'}</div>
                  <div class="text-muted text-sm">${user.email || 'No email set'}</div>
                  <div class="flex gap-2 mt-2">
                    <span class="badge badge-success">Free Plan</span>
                    <span class="badge badge-info">Local Storage</span>
                  </div>
                </div>
              </div>
              <div class="form-row">
                <div class="form-group"><label class="form-label">Display Name</label><input type="text" id="user-name" class="form-control" value="${user.name||''}"/></div>
                <div class="form-group"><label class="form-label">Email</label><input type="email" id="user-email" class="form-control" value="${user.email||''}" placeholder="your@email.com"/></div>
              </div>
              <div class="form-row">
                <div class="form-group"><label class="form-label">Primary Currency</label>
                  <select id="pref-currency" class="form-select">
                    ${['USD','EUR','GBP','JPY','INR','CAD','AUD','SGD','CHF','CNY'].map(c=>`<option ${c===(settings.currency||'USD')?'selected':''}>${c}</option>`).join('')}
                  </select>
                </div>
                <div class="form-group"><label class="form-label">Country</label>
                  <select id="user-country" class="form-select">
                    ${['United States','India','United Kingdom','Canada','Australia','Germany','Singapore','UAE','Other'].map(c=>`<option ${c===(user.country||'United States')?'selected':''}>${c}</option>`).join('')}
                  </select>
                </div>
              </div>
              <div class="form-group"><label class="form-label">Investment Experience</label>
                <select id="user-experience" class="form-select">
                  ${['Beginner','Intermediate','Advanced','Professional'].map(e=>`<option ${e===(user.experience||'Beginner')?'selected':''}>${e}</option>`).join('')}
                </select>
              </div>
              <button class="btn btn-primary" id="save-profile"><i class="fa fa-save"></i> Save Profile</button>
            </div>
          </div>
        </div>

        <!-- Appearance Tab -->
        <div id="tab-appearance" class="settings-tab" style="display:none">
          <div class="card mb-4">
            <div class="card-header"><div class="card-title"><i class="fa fa-paint-brush"></i> Appearance</div></div>
            <div class="card-body">
              <div class="form-group">
                <label class="form-label">Theme</label>
                <div style="display:flex;gap:12px">
                  ${['dark','light','auto'].map(t=>`
                    <label style="cursor:pointer;flex:1;text-align:center">
                      <div style="padding:16px;border:2px solid ${(settings.theme||'dark')===t?'var(--brand-primary)':'var(--border-color)'};border-radius:10px;background:${t==='dark'?'#0f172a':t==='light'?'#f8fafc':'linear-gradient(135deg,#0f172a,#f8fafc)'};margin-bottom:8px;transition:all 0.2s">
                        <i class="fa fa-${t==='dark'?'moon':t==='light'?'sun':'circle-half-stroke'}" style="color:${t==='dark'?'#94a3b8':'#64748b'};font-size:1.5rem"></i>
                      </div>
                      <input type="radio" name="theme" value="${t}" ${(settings.theme||'dark')===t?'checked':''} style="margin-right:4px"/>${t.charAt(0).toUpperCase()+t.slice(1)}
                    </label>
                  `).join('')}
                </div>
              </div>
              <div class="form-group">
                <label class="form-label">Accent Color</label>
                <div style="display:flex;gap:10px;flex-wrap:wrap">
                  ${[
                    { name:'Purple (Default)', value:'#6366f1' },
                    { name:'Blue', value:'#3b82f6' },
                    { name:'Green', value:'#22c55e' },
                    { name:'Orange', value:'#f97316' },
                    { name:'Pink', value:'#ec4899' },
                    { name:'Cyan', value:'#06b6d4' },
                  ].map(c=>`
                    <button onclick="setAccentColor('${c.value}')" title="${c.name}" style="width:32px;height:32px;border-radius:50%;background:${c.value};border:3px solid ${ (settings.accentColor||'#6366f1')===c.value?'white':'transparent'};cursor:pointer;transition:all 0.2s"></button>
                  `).join('')}
                </div>
              </div>
              <div class="form-group">
                <label class="form-label">Font Size</label>
                <input type="range" id="font-size" min="12" max="18" step="1" value="${settings.fontSize||14}" class="w-full" oninput="document.getElementById('font-size-val').textContent=this.value+'px'"/>
                <div class="text-sm text-muted mt-1">Size: <span id="font-size-val">${settings.fontSize||14}px</span></div>
              </div>
              <div class="form-group">
                <label class="form-label">Sidebar</label>
                <div class="toggle-row">
                  <div>
                    <div class="font-semibold text-sm">Compact Sidebar</div>
                    <div class="text-xs text-muted">Show only icons in the sidebar</div>
                  </div>
                  <label class="toggle-switch">
                    <input type="checkbox" id="compact-sidebar" ${settings.compactSidebar?'checked':''}/>
                    <span class="toggle-slider"></span>
                  </label>
                </div>
              </div>
              <button class="btn btn-primary" id="save-appearance"><i class="fa fa-save"></i> Save Appearance</button>
            </div>
          </div>
        </div>

        <!-- Preferences Tab -->
        <div id="tab-preferences" class="settings-tab" style="display:none">
          <div class="card mb-4">
            <div class="card-header"><div class="card-title"><i class="fa fa-sliders"></i> App Preferences</div></div>
            <div class="card-body">
              ${[
                { id: 'auto-refresh', label: 'Auto-Refresh Market Data', desc: 'Automatically refresh crypto and stock prices every 60 seconds', default: true },
                { id: 'show-sparklines', label: 'Show Sparkline Charts', desc: 'Display mini charts in tables for quick visual trend overview', default: true },
                { id: 'animations', label: 'Enable Animations', desc: 'Smooth transitions and loading animations throughout the app', default: true },
                { id: 'show-tooltips', label: 'Show Chart Tooltips', desc: 'Display detailed tooltips when hovering over charts', default: true },
                { id: 'compact-numbers', label: 'Compact Number Format', desc: 'Show $1.2M instead of $1,200,000 for large numbers', default: false },
                { id: 'demo-data', label: 'Show Demo Data', desc: 'Show sample data when no real data is available', default: true },
              ].map(pref=>`
                <div class="toggle-row">
                  <div>
                    <div class="font-semibold text-sm">${pref.label}</div>
                    <div class="text-xs text-muted">${pref.desc}</div>
                  </div>
                  <label class="toggle-switch">
                    <input type="checkbox" id="pref-${pref.id}" ${settings[pref.id]!==false&&(settings[pref.id]||pref.default)?'checked':''}/>
                    <span class="toggle-slider"></span>
                  </label>
                </div>
              `).join('')}
              <div class="form-group mt-4">
                <label class="form-label">Default Market View</label>
                <select id="pref-default-market" class="form-select">
                  ${['Dashboard','Crypto','Stocks','Forex','Commodities'].map(m=>`<option ${m===(settings.defaultMarket||'Dashboard')?'selected':''}>${m}</option>`).join('')}
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Date Format</label>
                <select id="pref-date-format" class="form-select">
                  <option value="MM/DD/YYYY">MM/DD/YYYY (US)</option>
                  <option value="DD/MM/YYYY">DD/MM/YYYY (International)</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD (ISO)</option>
                </select>
              </div>
              <button class="btn btn-primary" id="save-preferences"><i class="fa fa-save"></i> Save Preferences</button>
            </div>
          </div>
        </div>

        <!-- Notifications Tab -->
        <div id="tab-notifications" class="settings-tab" style="display:none">
          <div class="card mb-4">
            <div class="card-header"><div class="card-title"><i class="fa fa-bell"></i> Notification Settings</div></div>
            <div class="card-body">
              ${[
                { id: 'notif-price-alerts', label: 'Price Alerts', desc: 'Get notified when an asset hits your target price', default: true },
                { id: 'notif-market-open', label: 'Market Open/Close', desc: 'Daily reminders when major markets open and close', default: false },
                { id: 'notif-news', label: 'Breaking Financial News', desc: 'Real-time notifications for major market-moving news', default: true },
                { id: 'notif-portfolio', label: 'Portfolio Moves', desc: 'Alert when portfolio changes by more than 2% in a day', default: true },
                { id: 'notif-goals', label: 'Goal Milestones', desc: 'Celebrate when you hit 25%, 50%, 75%, 100% of your goals', default: true },
                { id: 'notif-budget', label: 'Budget Warnings', desc: 'Alert when you\'re approaching your budget limits', default: true },
                { id: 'notif-weekly', label: 'Weekly Summary', desc: 'Get a weekly email-style summary every Sunday', default: false },
              ].map(n=>`
                <div class="toggle-row">
                  <div>
                    <div class="font-semibold text-sm">${n.label}</div>
                    <div class="text-xs text-muted">${n.desc}</div>
                  </div>
                  <label class="toggle-switch">
                    <input type="checkbox" id="${n.id}" ${settings[n.id]!==false&&(settings[n.id]||n.default)?'checked':''}/>
                    <span class="toggle-slider"></span>
                  </label>
                </div>
              `).join('')}
              <button class="btn btn-primary mt-2" id="save-notifications"><i class="fa fa-save"></i> Save Notifications</button>
            </div>
          </div>
        </div>

        <!-- Privacy Tab -->
        <div id="tab-privacy" class="settings-tab" style="display:none">
          <div class="card mb-4">
            <div class="card-header"><div class="card-title"><i class="fa fa-shield"></i> Privacy & Data</div></div>
            <div class="card-body">
              <div class="info-box mb-4">
                <i class="fa fa-lock text-success"></i>
                <div>
                  <div class="font-bold">100% Local Storage</div>
                  <div class="text-xs text-muted">All your financial data is stored exclusively on your device. No data is sent to any server. WealthOS AI has no backend — your privacy is guaranteed by design.</div>
                </div>
              </div>
              <div style="display:flex;gap:12px;flex-wrap:wrap;margin-bottom:20px">
                ${[
                  { icon: '🔐', title: 'End-to-End Private', desc: 'Data never leaves your browser' },
                  { icon: '☁️', title: 'No Cloud Sync', desc: 'No account required, no data sync' },
                  { icon: '🚫', title: 'No Tracking', desc: 'No analytics, no user tracking' },
                  { icon: '📖', title: 'Open Source', desc: 'Auditable code on GitHub' },
                ].map(p=>`
                  <div style="flex:1;min-width:120px;padding:12px;background:rgba(34,197,94,0.08);border-radius:8px;text-align:center">
                    <div style="font-size:1.5rem;margin-bottom:4px">${p.icon}</div>
                    <div class="text-sm font-bold">${p.title}</div>
                    <div class="text-xs text-muted">${p.desc}</div>
                  </div>
                `).join('')}
              </div>
              <h4 class="font-bold text-sm mb-3">Data Management</h4>
              <div class="flex gap-3 flex-wrap">
                <button class="btn btn-secondary" id="export-all-data">
                  <i class="fa fa-download"></i> Export All Data (JSON)
                </button>
                <button class="btn btn-secondary" id="import-data">
                  <i class="fa fa-upload"></i> Import Backup
                </button>
              </div>
              <div style="margin-top:20px;padding:12px;background:rgba(99,102,241,0.06);border-radius:8px">
                <div class="font-semibold text-sm mb-1">Storage Used</div>
                <div class="text-xs text-muted mb-2">Estimated localStorage usage</div>
                <div class="progress"><div class="progress-bar primary" style="width:${Math.min(calculateStorageUsage(),100)}%"></div></div>
                <div class="text-xs text-muted mt-1">${calculateStorageUsage().toFixed(1)}% used (~${getStorageSizeKB()}KB)</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Danger Tab -->
        <div id="tab-danger" class="settings-tab" style="display:none">
          <div class="card mb-4" style="border-top-color:var(--brand-danger)">
            <div class="card-header"><div class="card-title text-danger"><i class="fa fa-triangle-exclamation"></i> Danger Zone</div></div>
            <div class="card-body">
              <div class="error-box mb-4">
                <i class="fa fa-exclamation-circle"></i>
                <div>
                  <div class="font-bold">Warning: Irreversible Actions</div>
                  <div class="text-xs mt-1">These actions permanently delete data. Export your data first!</div>
                </div>
              </div>
              ${[
                { id: 'clear-income', label: 'Clear Income Records', desc: 'Delete all income entries', color: 'warning' },
                { id: 'clear-expenses', label: 'Clear Expense Records', desc: 'Delete all expense entries', color: 'warning' },
                { id: 'clear-portfolio', label: 'Clear Portfolio', desc: 'Delete all portfolio positions', color: 'warning' },
                { id: 'clear-goals', label: 'Clear All Goals', desc: 'Delete all financial goals', color: 'warning' },
                { id: 'clear-habits', label: 'Clear Habits', desc: 'Delete all habits and streaks', color: 'warning' },
                { id: 'clear-journal', label: 'Clear Journal', desc: 'Delete all journal entries', color: 'warning' },
                { id: 'reset-all', label: 'Reset Everything', desc: 'Wipe ALL data and restore to factory defaults', color: 'danger' },
              ].map(action=>`
                <div style="display:flex;justify-content:space-between;align-items:center;padding:12px 0;border-bottom:1px solid var(--border-color)">
                  <div>
                    <div class="font-semibold text-sm">${action.label}</div>
                    <div class="text-xs text-muted">${action.desc}</div>
                  </div>
                  <button class="btn btn-sm btn-${action.color}" id="btn-${action.id}">
                    <i class="fa fa-trash"></i> Clear
                  </button>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Add settings styles
  if (!document.getElementById('settings-styles')) {
    const style = document.createElement('style');
    style.id = 'settings-styles';
    style.textContent = `
      .toggle-row { display:flex; justify-content:space-between; align-items:center; padding:12px 0; border-bottom:1px solid var(--border-color); }
      .toggle-switch { position:relative; display:inline-block; width:44px; height:24px; flex-shrink:0; }
      .toggle-switch input { opacity:0; width:0; height:0; }
      .toggle-slider { position:absolute; cursor:pointer; top:0;left:0;right:0;bottom:0; background:var(--border-color); border-radius:24px; transition:0.3s; }
      .toggle-slider:before { position:absolute; content:""; height:18px; width:18px; left:3px; bottom:3px; background:white; border-radius:50%; transition:0.3s; }
      .toggle-switch input:checked + .toggle-slider { background:var(--brand-primary); }
      .toggle-switch input:checked + .toggle-slider:before { transform:translateX(20px); }
      .info-box { display:flex; gap:12px; padding:12px; background:rgba(34,197,94,0.1); border-radius:8px; border:1px solid rgba(34,197,94,0.3); }
      .error-box { display:flex; gap:12px; padding:12px; background:rgba(239,68,68,0.1); border-radius:8px; border:1px solid rgba(239,68,68,0.3); color:var(--brand-danger); }
      .settings-nav-btn:hover { background:rgba(99,102,241,0.1) !important; }
      .settings-nav-btn.active { background:rgba(99,102,241,0.15) !important; color:var(--brand-primary); }
    `;
    document.head.appendChild(style);
  }

  // Tab switching
  container.querySelectorAll('.settings-nav-btn').forEach(btn => {
    btn.onclick = () => {
      container.querySelectorAll('.settings-nav-btn').forEach(b => { b.classList.remove('active'); b.style.background = 'transparent'; });
      btn.classList.add('active'); btn.style.background = 'rgba(99,102,241,0.15)';
      container.querySelectorAll('.settings-tab').forEach(t => t.style.display = 'none');
      const tab = document.getElementById(`tab-${btn.dataset.tab}`);
      if (tab) tab.style.display = 'block';
    };
  });

  // Save handlers
  document.getElementById('save-profile').onclick = () => {
    const name = document.getElementById('user-name').value;
    const email = document.getElementById('user-email').value;
    const country = document.getElementById('user-country').value;
    const experience = document.getElementById('user-experience').value;
    const currency = document.getElementById('pref-currency').value;
    store.set('user', { ...user, name, email, country, experience });
    store.update('settings', s => ({ ...s, currency }));
    toast('Profile saved!', 'success');
    // Update topnav avatar
    const avatar = document.querySelector('.user-avatar');
    if (avatar) avatar.textContent = name.charAt(0).toUpperCase();
  };

  document.getElementById('save-appearance').onclick = () => {
    const theme = document.querySelector('input[name="theme"]:checked')?.value || 'dark';
    const fontSize = document.getElementById('font-size').value;
    const compactSidebar = document.getElementById('compact-sidebar').checked;
    store.update('settings', s => ({ ...s, theme, fontSize: parseInt(fontSize), compactSidebar }));
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.style.fontSize = fontSize + 'px';
    toast('Appearance updated!', 'success');
  };

  document.getElementById('save-preferences').onclick = () => {
    const prefs = {};
    ['auto-refresh','show-sparklines','animations','show-tooltips','compact-numbers','demo-data'].forEach(id => {
      prefs[id] = document.getElementById(`pref-${id}`)?.checked || false;
    });
    prefs.defaultMarket = document.getElementById('pref-default-market')?.value;
    store.update('settings', s => ({ ...s, ...prefs }));
    toast('Preferences saved!', 'success');
  };

  document.getElementById('save-notifications').onclick = () => {
    const notifs = {};
    ['notif-price-alerts','notif-market-open','notif-news','notif-portfolio','notif-goals','notif-budget','notif-weekly'].forEach(id => {
      notifs[id] = document.getElementById(id)?.checked || false;
    });
    store.update('settings', s => ({ ...s, ...notifs }));
    toast('Notification settings saved!', 'success');
  };

  // Accent color
  window.setAccentColor = (color) => {
    document.documentElement.style.setProperty('--brand-primary', color);
    store.update('settings', s => ({ ...s, accentColor: color }));
    toast('Accent color updated!', 'success');
    container.querySelectorAll('[onclick*="setAccentColor"]').forEach(btn => {
      btn.style.border = `3px solid ${btn.getAttribute('onclick').includes(color) ? 'white' : 'transparent'}`;
    });
  };

  // Data export/import
  document.getElementById('export-all-data').onclick = () => {
    const data = {
      version: '1.0', exported: new Date().toISOString(),
      income: store.get('income'), expenses: store.get('expenses'),
      portfolio: store.get('portfolio'), goals: store.get('goals'),
      debts: store.get('debts'), habits: store.get('habits'),
      journal: store.get('journal'), settings: store.get('settings'),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `wealthos-backup-${new Date().toISOString().split('T')[0]}.json`; a.click();
    toast('Full data exported!', 'success');
  };

  document.getElementById('import-data').onclick = () => {
    const input = document.createElement('input'); input.type = 'file'; input.accept = '.json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const data = JSON.parse(ev.target.result);
          if (data.income) store.set('income', data.income);
          if (data.expenses) store.set('expenses', data.expenses);
          if (data.goals) store.set('goals', data.goals);
          if (data.portfolio) store.set('portfolio', data.portfolio);
          toast('Backup restored successfully!', 'success');
        } catch { toast('Invalid backup file', 'error'); }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  // Danger zone buttons
  const dangerActions = {
    'clear-income': () => { if (confirm('Delete all income records?')) { store.set('income', []); toast('Income records cleared', 'info'); } },
    'clear-expenses': () => { if (confirm('Delete all expense records?')) { store.set('expenses', []); toast('Expense records cleared', 'info'); } },
    'clear-portfolio': () => { if (confirm('Delete all portfolio positions?')) { store.set('portfolio', []); toast('Portfolio cleared', 'info'); } },
    'clear-goals': () => { if (confirm('Delete all goals?')) { store.set('goals', []); toast('Goals cleared', 'info'); } },
    'clear-habits': () => { if (confirm('Delete all habits?')) { store.set('habits', []); toast('Habits cleared', 'info'); } },
    'clear-journal': () => { if (confirm('Delete all journal entries?')) { store.set('journal', []); toast('Journal cleared', 'info'); } },
    'reset-all': () => {
      if (confirm('⚠️ This will DELETE ALL YOUR DATA! Are you absolutely sure?')) {
        if (confirm('Last warning! This cannot be undone. Reset everything?')) {
          ['income','expenses','portfolio','goals','debts','habits','journal','watchlist'].forEach(k => store.set(k, []));
          toast('App reset to factory defaults', 'info');
          setTimeout(() => location.reload(), 1500);
        }
      }
    },
  };
  Object.entries(dangerActions).forEach(([id, fn]) => {
    const btn = document.getElementById(`btn-${id}`);
    if (btn) btn.onclick = fn;
  });
}

function calculateStorageUsage() {
  let total = 0;
  try {
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) total += (localStorage[key].length + key.length) * 2;
    }
  } catch {}
  return Math.min((total / (5 * 1024 * 1024)) * 100, 100);
}

function getStorageSizeKB() {
  let total = 0;
  try {
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) total += (localStorage[key].length + key.length) * 2;
    }
  } catch {}
  return (total / 1024).toFixed(1);
}
