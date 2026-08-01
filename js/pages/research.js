// =====================================================
// WealthOS AI — Global Research Intelligence Page
// Institutional-grade investment research
// =====================================================

export function renderResearch(container) {
  const TABS = [
    { id: 'summary',   label: '🏆 Rankings',       icon: 'fa-star' },
    { id: 'countries', label: '🌍 Economies',       icon: 'fa-globe' },
    { id: 'industries',label: '🏭 Industries',      icon: 'fa-industry' },
    { id: 'companies', label: '🏢 Companies',       icon: 'fa-building' },
    { id: 'trade',     label: '🚢 Trade',           icon: 'fa-ship' },
    { id: 'investors', label: '💼 Investors',       icon: 'fa-briefcase' },
    { id: 'products',  label: '📦 Products',        icon: 'fa-box' },
    { id: 'stocks',    label: '📈 Markets',         icon: 'fa-chart-line' },
  ];

  container.innerHTML = `
    <div class="page-header">
      <div>
        <h1 class="page-title">🔬 Global Research Intelligence</h1>
        <p class="page-subtitle">Institutional-grade investment research · IMF, World Bank, WTO, OECD data · Updated 2024–2025</p>
      </div>
    </div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:20px;padding-bottom:8px;border-bottom:1px solid var(--border-color)">
      ${TABS.map((t,i) => `
        <button class="res-tab ${i===0?'res-tab-active':''}" data-tab="${t.id}"
          style="padding:8px 16px;border-radius:20px;border:1.5px solid ${i===0?'#6366f1':'var(--border-color)'};
          background:${i===0?'rgba(99,102,241,0.2)':'var(--bg-card)'};color:${i===0?'#a5b4fc':'var(--text-secondary)'};
          cursor:pointer;font-size:0.82rem;font-weight:600;white-space:nowrap;transition:all 0.2s">
          ${t.label}
        </button>
      `).join('')}
    </div>
    <div id="res-content"></div>
  `;

  container.querySelectorAll('.res-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.res-tab').forEach(b => {
        b.style.background = 'var(--bg-card)'; b.style.borderColor = 'var(--border-color)'; b.style.color = 'var(--text-secondary)';
      });
      btn.style.background = 'rgba(99,102,241,0.2)'; btn.style.borderColor = '#6366f1'; btn.style.color = '#a5b4fc';
      renderTab(btn.dataset.tab);
    });
  });

  renderTab('summary');

  function renderTab(id) {
    const el = document.getElementById('res-content');
    if (id === 'summary')    el.innerHTML = renderSummary();
    else if (id === 'countries')  el.innerHTML = renderCountries();
    else if (id === 'industries') el.innerHTML = renderIndustries();
    else if (id === 'companies')  el.innerHTML = renderCompanies();
    else if (id === 'trade')      el.innerHTML = renderTrade();
    else if (id === 'investors')  el.innerHTML = renderInvestors();
    else if (id === 'products')   el.innerHTML = renderProducts();
    else if (id === 'stocks')     el.innerHTML = renderMarkets();
  }
}

// ============================================================
// TAB 1: RANKINGS & RECOMMENDATIONS
// ============================================================
function renderSummary() {
  const topCountries = [
    { rank:1, name:'🇮🇳 India',         score:9.2, gdp:'$3.9T', growth:'+6.8%', why:'Fastest growing G20 economy, young demographics, tech boom, PLI schemes', horizon:'5–10 yrs', conf:9 },
    { rank:2, name:'🇺🇸 USA',           score:8.9, gdp:'$28.8T', growth:'+2.5%', why:'World\'s largest economy, AI leadership, dollar dominance, deep capital markets', horizon:'1–5 yrs', conf:9 },
    { rank:3, name:'🇻🇳 Vietnam',       score:8.7, gdp:'$0.43T', growth:'+6.1%', why:'China+1 manufacturing hub, FDI surge, Samsung, Intel invested heavily', horizon:'5–10 yrs', conf:8 },
    { rank:4, name:'🇸🇦 Saudi Arabia',  score:8.5, gdp:'$1.1T', growth:'+4.2%', why:'Vision 2030, NEOM, diversification, $600B+ PIF investments', horizon:'3–7 yrs', conf:8 },
    { rank:5, name:'🇸🇬 Singapore',     score:8.4, gdp:'$0.52T', growth:'+3.1%', why:'Global financial hub, lowest taxes, best ease of doing business in Asia', horizon:'3–7 yrs', conf:9 },
    { rank:6, name:'🇩🇪 Germany',       score:7.8, gdp:'$4.6T', growth:'+0.8%', why:'Industrial powerhouse, green energy transition, engineering strength', horizon:'5–10 yrs', conf:7 },
    { rank:7, name:'🇦🇪 UAE',           score:8.1, gdp:'$0.50T', growth:'+4.5%', why:'Tax-free, global hub, Dubai finance center, AI National Strategy', horizon:'3–7 yrs', conf:8 },
    { rank:8, name:'🇯🇵 Japan',         score:7.5, gdp:'$4.2T', growth:'+1.3%', why:'Semiconductor revival, robotics, corporate governance reform, weak yen boost', horizon:'3–5 yrs', conf:7 },
    { rank:9, name:'🇮🇩 Indonesia',     score:8.0, gdp:'$1.47T', growth:'+5.1%', why:'World\'s 4th largest population, nickel for EV batteries, growing middle class', horizon:'5–10 yrs', conf:8 },
    { rank:10, name:'🇰🇷 South Korea', score:7.9, gdp:'$1.87T', growth:'+2.3%', why:'Semiconductor king (Samsung, SK Hynix), K-culture exports, EV batteries', horizon:'3–7 yrs', conf:8 },
  ];

  const topIndustries = [
    { rank:1, name:'🤖 Artificial Intelligence', size:'$196B', cagr:'37%', score:9.8, why:'GPT revolution, enterprise AI adoption, every sector transformation' },
    { rank:2, name:'⚡ Semiconductors', size:'$611B', cagr:'14%', score:9.5, why:'AI chips (NVDA), data centers, EV, IoT — everything needs chips' },
    { rank:3, name:'🔋 EV & Batteries', size:'$388B', cagr:'23%', score:9.2, why:'Global EV mandates, carbon neutrality goals, battery innovation' },
    { rank:4, name:'☀️ Renewable Energy', size:'$928B', cagr:'17%', score:9.0, why:'Energy transition, solar/wind boom, government subsidies globally' },
    { rank:5, name:'🛡️ Cybersecurity', size:'$245B', cagr:'13%', score:8.8, why:'AI-driven threats, data protection laws, ransomware surge' },
    { rank:6, name:'🧬 Biotechnology', size:'$512B', cagr:'14%', score:8.7, why:'mRNA vaccines, gene editing, personalized medicine, aging population' },
    { rank:7, name:'🤖 Robotics & Automation', size:'$78B', cagr:'25%', score:8.8, why:'Labor shortage, Industry 4.0, humanoid robots (Tesla, Figure)' },
    { rank:8, name:'☁️ Cloud Computing', size:'$677B', cagr:'21%', score:8.6, why:'Digital transformation, AI workloads, SaaS growth' },
    { rank:9, name:'🛩️ Defense & Aerospace', size:'$2.4T', cagr:'8%', score:8.4, why:'Geopolitical tensions, NATO spending increase, hypersonic tech' },
    { rank:10, name:'💊 Pharmaceuticals', size:'$1.6T', cagr:'6%', score:8.2, why:'GLP-1 weight-loss drugs, biosimilars, emerging market healthcare' },
  ];

  const topStocks = [
    { rank:1, sym:'NVDA',  name:'NVIDIA',          exch:'NASDAQ', why:'AI chip monopoly, 80%+ data center GPU market share', potential:'+40–60%', horizon:'1–2 yrs', score:9.8 },
    { rank:2, sym:'MSFT',  name:'Microsoft',       exch:'NASDAQ', why:'Azure AI growth, Copilot monetization, enterprise dominance', potential:'+25–35%', horizon:'2–3 yrs', score:9.5 },
    { rank:3, sym:'TSMC',  name:'Taiwan Semi',     exch:'NYSE',   why:'Only fab making 2nm chips, AI chip demand, no substitute', potential:'+30–50%', horizon:'2–3 yrs', score:9.4 },
    { rank:4, sym:'AMZN',  name:'Amazon',          exch:'NASDAQ', why:'AWS #1 cloud, AI services, e-commerce recovery, logistics', potential:'+25–40%', horizon:'2–3 yrs', score:9.2 },
    { rank:5, sym:'RELIANCE', name:'Reliance Ind.', exch:'BSE',  why:'Jio + Retail + Green Energy triad, India growth story', potential:'+30–40%', horizon:'3–5 yrs', score:9.0 },
    { rank:6, sym:'META',  name:'Meta Platforms',  exch:'NASDAQ', why:'AI ad targeting, WhatsApp monetization, AR/VR long term', potential:'+20–30%', horizon:'2–3 yrs', score:8.8 },
    { rank:7, sym:'2222.SR', name:'Saudi Aramco',  exch:'Tadawul', why:'World\'s most profitable company, 10M bbl/day, 5.8% dividend', potential:'+15–25%', horizon:'2–5 yrs', score:8.7 },
    { rank:8, sym:'005930', name:'Samsung Elec.',  exch:'KRX',   why:'HBM memory AI boom, semiconductor cycle recovery', potential:'+25–35%', horizon:'2–3 yrs', score:8.6 },
    { rank:9, sym:'TCS',   name:'TCS',             exch:'BSE',   why:'IT services leader, AI transformation projects, India premium', potential:'+20–30%', horizon:'3–5 yrs', score:8.5 },
    { rank:10, sym:'ASML', name:'ASML',            exch:'NASDAQ', why:'Only maker of EUV machines — monopoly on chip manufacturing', potential:'+25–35%', horizon:'2–3 yrs', score:8.8 },
  ];

  const recommendations = [
    { type:'🏆 Best Country (10 yr)', pick:'🇮🇳 India', reason:'6.8% GDP growth, 1.4B population, tech services, manufacturing shift from China, PLI schemes driving $26B investment', score:'9.2/10' },
    { type:'🏭 Best Industry (5 yr)', pick:'🤖 Artificial Intelligence', reason:'$196B → $1.8T by 2030 (37% CAGR). Every sector being transformed. Microsoft, Google, Meta spending $200B+ on AI capex in 2025', score:'9.8/10' },
    { type:'📦 Best Product', pick:'AI Chips / GPUs', reason:'NVIDIA H100 selling at $30,000 each, 6–12 month waitlist. Data center GPU demand growing 5x by 2027', score:'9.9/10' },
    { type:'🏢 Best Company', pick:'NVIDIA (NVDA)', reason:'$83B revenue, 55% net margin, 80%+ AI chip market share. Called "most important company in the world" by analysts', score:'9.8/10' },
    { type:'📈 Best Stock (1–2 yr)', pick:'NVDA / TSMC / MSFT', reason:'AI capex supercycle beneficiaries. NVDA data center revenue grew 427% YoY. Structural not cyclical demand', score:'9.5/10' },
    { type:'🚀 Best Startup Sector', pick:'AI + HealthTech', reason:'$50B+ VC funding in AI in 2024. Drug discovery AI (Isomorphic/DeepMind), AI agents, robotics startups attracting record rounds', score:'9.3/10' },
    { type:'💎 Best Long-term (10 yr)', pick:'India + Renewable Energy', reason:'India becomes $10T economy by 2035. Green energy $2T investment needed globally. Combination = generational opportunity', score:'9.0/10' },
    { type:'⚡ Best Short-term (1 yr)', pick:'US Tech Stocks', reason:'AI monetization kicking in, rate cuts boost valuations, earnings upgrades across Big Tech', score:'8.8/10' },
  ];

  return `
    <!-- Final Recommendations -->
    <div class="card mb-4" style="border:1px solid rgba(99,102,241,0.4);background:linear-gradient(135deg,rgba(99,102,241,0.08),var(--bg-card))">
      <div class="card-header">
        <div class="card-title" style="font-size:1.1rem"><i class="fa fa-crown" style="color:#f59e0b"></i> Final Investment Recommendations — 2025</div>
        <span style="font-size:0.75rem;color:#94a3b8">Sources: IMF WEO, World Bank, Bloomberg, McKinsey, Goldman Sachs research</span>
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:12px;padding:16px">
        ${recommendations.map(r => `
          <div style="padding:14px 16px;background:rgba(255,255,255,0.04);border-radius:12px;border-left:3px solid #6366f1">
            <div style="font-size:0.75rem;font-weight:700;color:#6366f1;margin-bottom:4px">${r.type}</div>
            <div style="font-size:1rem;font-weight:800;color:#f8fafc;margin-bottom:6px">${r.pick}</div>
            <div style="font-size:0.78rem;color:#94a3b8;line-height:1.5;margin-bottom:8px">${r.reason}</div>
            <div style="display:inline-block;padding:2px 10px;background:rgba(34,197,94,0.15);border:1px solid #22c55e;border-radius:20px;font-size:0.72rem;font-weight:700;color:#22c55e">Score: ${r.score}</div>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Top 10 Countries -->
    <div class="card mb-4">
      <div class="card-header"><div class="card-title"><i class="fa fa-globe"></i> Top 10 Countries to Invest In — 2025–2030</div></div>
      <div style="overflow-x:auto">
        <table style="width:100%;border-collapse:collapse">
          <thead><tr style="background:var(--bg-elevated)">
            <th style="padding:10px 14px;text-align:left;font-size:0.78rem;color:#94a3b8">#</th>
            <th style="padding:10px 14px;text-align:left;font-size:0.78rem;color:#94a3b8">Country</th>
            <th style="padding:10px 14px;text-align:right;font-size:0.78rem;color:#94a3b8">GDP</th>
            <th style="padding:10px 14px;text-align:right;font-size:0.78rem;color:#94a3b8">Growth</th>
            <th style="padding:10px 14px;text-align:left;font-size:0.78rem;color:#94a3b8">Why Invest</th>
            <th style="padding:10px 14px;text-align:center;font-size:0.78rem;color:#94a3b8">Horizon</th>
            <th style="padding:10px 14px;text-align:center;font-size:0.78rem;color:#94a3b8">Score</th>
          </tr></thead>
          <tbody>
            ${topCountries.map(c => `
              <tr style="border-top:1px solid var(--border-color)">
                <td style="padding:12px 14px;font-weight:900;color:#6366f1;font-size:1.1rem">${c.rank}</td>
                <td style="padding:12px 14px;font-weight:700;font-size:0.95rem">${c.name}</td>
                <td style="padding:12px 14px;text-align:right;font-family:monospace;color:#f8fafc">${c.gdp}</td>
                <td style="padding:12px 14px;text-align:right;font-weight:700;color:#22c55e">${c.growth}</td>
                <td style="padding:12px 14px;font-size:0.78rem;color:#94a3b8;max-width:280px">${c.why}</td>
                <td style="padding:12px 14px;text-align:center;font-size:0.78rem;color:#a5b4fc">${c.horizon}</td>
                <td style="padding:12px 14px;text-align:center">
                  <span style="padding:3px 10px;background:rgba(34,197,94,0.15);border:1px solid #22c55e;border-radius:20px;font-size:0.78rem;font-weight:700;color:#22c55e">${c.score}/10</span>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <!-- Top 10 Industries -->
    <div class="card mb-4">
      <div class="card-header"><div class="card-title"><i class="fa fa-industry"></i> Top 10 Industries — Highest Growth Potential</div></div>
      <div style="overflow-x:auto">
        <table style="width:100%;border-collapse:collapse">
          <thead><tr style="background:var(--bg-elevated)">
            <th style="padding:10px 14px;text-align:left;font-size:0.78rem;color:#94a3b8">#</th>
            <th style="padding:10px 14px;text-align:left;font-size:0.78rem;color:#94a3b8">Industry</th>
            <th style="padding:10px 14px;text-align:right;font-size:0.78rem;color:#94a3b8">Market Size</th>
            <th style="padding:10px 14px;text-align:right;font-size:0.78rem;color:#94a3b8">CAGR</th>
            <th style="padding:10px 14px;text-align:left;font-size:0.78rem;color:#94a3b8">Why</th>
            <th style="padding:10px 14px;text-align:center;font-size:0.78rem;color:#94a3b8">Score</th>
          </tr></thead>
          <tbody>
            ${topIndustries.map(i => `
              <tr style="border-top:1px solid var(--border-color)">
                <td style="padding:12px 14px;font-weight:900;color:#6366f1;font-size:1.1rem">${i.rank}</td>
                <td style="padding:12px 14px;font-weight:700">${i.name}</td>
                <td style="padding:12px 14px;text-align:right;font-family:monospace;color:#f8fafc">${i.size}</td>
                <td style="padding:12px 14px;text-align:right;font-weight:800;color:#22c55e">${i.cagr}</td>
                <td style="padding:12px 14px;font-size:0.78rem;color:#94a3b8;max-width:280px">${i.why}</td>
                <td style="padding:12px 14px;text-align:center">
                  <span style="padding:3px 10px;background:rgba(99,102,241,0.15);border:1px solid #6366f1;border-radius:20px;font-size:0.78rem;font-weight:700;color:#a5b4fc">${i.score}/10</span>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <!-- Top 10 Stocks -->
    <div class="card mb-4">
      <div class="card-header"><div class="card-title"><i class="fa fa-chart-line"></i> Top 10 Stocks — Global Best Investment Opportunities</div></div>
      <div style="overflow-x:auto">
        <table style="width:100%;border-collapse:collapse">
          <thead><tr style="background:var(--bg-elevated)">
            <th style="padding:10px 14px;font-size:0.78rem;color:#94a3b8">#</th>
            <th style="padding:10px 14px;font-size:0.78rem;color:#94a3b8">Symbol</th>
            <th style="padding:10px 14px;font-size:0.78rem;color:#94a3b8">Company</th>
            <th style="padding:10px 14px;font-size:0.78rem;color:#94a3b8">Exchange</th>
            <th style="padding:10px 14px;font-size:0.78rem;color:#94a3b8">Why Buy</th>
            <th style="padding:10px 14px;font-size:0.78rem;color:#94a3b8">Potential</th>
            <th style="padding:10px 14px;font-size:0.78rem;color:#94a3b8">Score</th>
          </tr></thead>
          <tbody>
            ${topStocks.map(s => `
              <tr style="border-top:1px solid var(--border-color)">
                <td style="padding:12px 14px;font-weight:900;color:#6366f1">${s.rank}</td>
                <td style="padding:12px 14px;font-weight:800;color:#22c55e;font-family:monospace">${s.sym}</td>
                <td style="padding:12px 14px;font-weight:600">${s.name}</td>
                <td style="padding:12px 14px;font-size:0.78rem;color:#94a3b8">${s.exch}</td>
                <td style="padding:12px 14px;font-size:0.78rem;color:#94a3b8;max-width:260px">${s.why}</td>
                <td style="padding:12px 14px;font-weight:700;color:#22c55e">${s.potential}</td>
                <td style="padding:12px 14px;text-align:center">
                  <span style="padding:3px 10px;background:rgba(34,197,94,0.15);border:1px solid #22c55e;border-radius:20px;font-size:0.78rem;font-weight:700;color:#22c55e">${s.score}/10</span>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
      <div style="padding:12px 16px;background:rgba(245,158,11,0.08);border-top:1px solid rgba(245,158,11,0.2)">
        <span style="font-size:0.75rem;color:#94a3b8">⚠️ <strong style="color:#f59e0b">Disclaimer:</strong> This is for research purposes only. Past performance ≠ future results. Consult a SEBI/SEC registered advisor before investing. Sources: Bloomberg, Goldman Sachs, Morgan Stanley, IMF (2024–2025).</span>
      </div>
    </div>
  `;
}

// ============================================================
// TAB 2: COUNTRY ANALYSIS
// ============================================================
function renderCountries() {
  const countries = [
    {
      flag:'🇺🇸', name:'United States', gdp:'$28.8T', gdpGrowth:'+2.5%', inflation:'3.1%', rates:'5.25%',
      unemployment:'3.7%', fdi:'$349B', ease:'#55', currency:'Dominant (reserve)', stability:'Very High',
      strengths:'AI leadership, tech innovation, dollar dominance, deep capital markets, entrepreneurship culture',
      risks:'High debt ($35T), political polarization, trade deficits, aging demographics',
      outlook3yr:'+2.8%', outlook5yr:'+2.5%', outlook10yr:'+2.2%',
      bestSectors:'AI, Cloud, Defense, Biotech, Finance', score:9.0,
      source:'IMF WEO Oct 2024, Federal Reserve, BLS'
    },
    {
      flag:'🇨🇳', name:'China', gdp:'$18.5T', gdpGrowth:'+4.9%', inflation:'0.3%', rates:'3.45%',
      unemployment:'5.0%', fdi:'$163B', ease:'#31', currency:'CNY (controlled)', stability:'High',
      strengths:'Manufacturing scale, EV leadership, BRI investments, world\'s largest exports, space program',
      risks:'Property crisis (Evergrande), aging population, US tech restrictions, Taiwan tensions, debt',
      outlook3yr:'+4.5%', outlook5yr:'+4.0%', outlook10yr:'+3.5%',
      bestSectors:'EV, Solar, Robotics, Infrastructure, Chemicals', score:7.8,
      source:'NBS China, IMF, World Bank 2024'
    },
    {
      flag:'🇮🇳', name:'India', gdp:'$3.9T', gdpGrowth:'+6.8%', inflation:'4.9%', rates:'6.5%',
      unemployment:'7.8%', fdi:'$70.9B', ease:'#63', currency:'INR (stable)', stability:'High',
      strengths:'Fastest growing G20, young workforce (avg age 28), IT services, PLI manufacturing push, digital payments UPI',
      risks:'Infrastructure gaps, income inequality, monsoon dependency, geopolitical neighbors',
      outlook3yr:'+6.5%', outlook5yr:'+6.8%', outlook10yr:'+6.5%',
      bestSectors:'IT, Pharma, Manufacturing, Renewables, FMCG', score:9.2,
      source:'RBI, MoSPI India, IMF, World Bank Oct 2024'
    },
    {
      flag:'🇩🇪', name:'Germany', gdp:'$4.6T', gdpGrowth:'+0.2%', inflation:'2.3%', rates:'4.50%',
      unemployment:'5.5%', fdi:'$31B', ease:'#22', currency:'EUR (strong)', stability:'Very High',
      strengths:'Engineering excellence, auto/industrial exports, EU\'s largest economy, green energy transition',
      risks:'Energy dependency, deindustrialization risk, high energy costs post-Russia war, demographic decline',
      outlook3yr:'+1.2%', outlook5yr:'+1.5%', outlook10yr:'+1.8%',
      bestSectors:'Hydrogen, EV supply chain, Industrial AI, Defense', score:7.5,
      source:'Bundesbank, IMF, ECB, Destatis 2024'
    },
    {
      flag:'🇯🇵', name:'Japan', gdp:'$4.2T', gdpGrowth:'+1.3%', inflation:'2.8%', rates:'0.10%',
      unemployment:'2.4%', fdi:'$30B', ease:'#29', currency:'JPY (weak — export boost)', stability:'Very High',
      strengths:'Robotics, semiconductors (revival), auto, ultra-low unemployment, stable governance',
      risks:'Aging/shrinking population, massive debt (260% GDP), deflation history',
      outlook3yr:'+1.5%', outlook5yr:'+1.2%', outlook10yr:'+1.0%',
      bestSectors:'Semiconductors, Robotics, Tourism, Defense', score:7.5,
      source:'BoJ, Cabinet Office Japan, IMF 2024'
    },
    {
      flag:'🇸🇦', name:'Saudi Arabia', gdp:'$1.1T', gdpGrowth:'+4.2%', inflation:'1.6%', rates:'6.0%',
      unemployment:'3.5%', fdi:'$36B', ease:'#62', currency:'SAR (pegged to USD)', stability:'High',
      strengths:'Vision 2030, NEOM megacity, PIF $700B fund, oil revenues funding diversification',
      risks:'Oil price dependency, regional instability, diversification timeline, human rights concerns',
      outlook3yr:'+4.0%', outlook5yr:'+3.8%', outlook10yr:'+3.5%',
      bestSectors:'Tourism, Mining, Tech, Green Energy, Entertainment', score:8.5,
      source:'Saudi SAMA, IMF, PIF reports 2024'
    },
    {
      flag:'🇦🇪', name:'UAE', gdp:'$504B', gdpGrowth:'+4.5%', inflation:'2.3%', rates:'5.40%',
      unemployment:'2.7%', fdi:'$30.7B', ease:'#16', currency:'AED (USD pegged)', stability:'Very High',
      strengths:'Tax-free, strategic location, DIFC financial hub, AI National Strategy, Golden Visa',
      risks:'Oil dependency, limited domestic market, geopolitical region risks',
      outlook3yr:'+4.2%', outlook5yr:'+4.0%', outlook10yr:'+3.8%',
      bestSectors:'AI, FinTech, Tourism, Real Estate, Renewables', score:8.1,
      source:'CBUAE, IMF, World Bank 2024'
    },
    {
      flag:'🇸🇬', name:'Singapore', gdp:'$517B', gdpGrowth:'+2.6%', inflation:'2.7%', rates:'3.74%',
      unemployment:'1.9%', fdi:'$92B', ease:'#2', currency:'SGD (managed float)', stability:'Excellent',
      strengths:'World #2 ease of doing business, global financial hub, no capital gains tax, AI/biotech clusters',
      risks:'Small domestic market, aging population, housing costs, dependence on global trade',
      outlook3yr:'+3.0%', outlook5yr:'+2.8%', outlook10yr:'+2.5%',
      bestSectors:'FinTech, Biotech, AI, Logistics, Private Equity', score:8.4,
      source:'MAS, MTI Singapore, World Bank 2024'
    },
    {
      flag:'🇰🇷', name:'South Korea', gdp:'$1.87T', gdpGrowth:'+2.3%', inflation:'2.4%', rates:'3.5%',
      unemployment:'2.7%', fdi:'$17.4B', ease:'#19', currency:'KRW (volatile)', stability:'High',
      strengths:'Semiconductor powerhouse (Samsung, SK Hynix), K-culture global reach, EV batteries (LG, Samsung SDI)',
      risks:'North Korea risk, aging population, chaebol concentration, semiconductor cycle',
      outlook3yr:'+2.5%', outlook5yr:'+2.3%', outlook10yr:'+2.0%',
      bestSectors:'Semiconductors, EV Batteries, K-pop/Culture, Defense', score:7.9,
      source:'Bank of Korea, IMF, MSCI 2024'
    },
    {
      flag:'🇻🇳', name:'Vietnam', gdp:'$430B', gdpGrowth:'+6.1%', inflation:'4.5%', rates:'6.0%',
      unemployment:'2.3%', fdi:'$36.6B', ease:'#70', currency:'VND (managed)', stability:'High',
      strengths:'China+1 manufacturing winner, Samsung/Intel biggest investors, young population (avg 31), export boom',
      risks:'Infrastructure, legal system, skilled labor shortage, environmental concerns',
      outlook3yr:'+6.5%', outlook5yr:'+6.2%', outlook10yr:'+5.8%',
      bestSectors:'Electronics Manufacturing, Textiles, Tourism, Tech', score:8.7,
      source:'GSO Vietnam, World Bank, IMF 2024'
    },
  ];

  return `
    <div style="display:grid;gap:16px">
      ${countries.map(c => `
        <div class="card" style="border-left:3px solid #6366f1">
          <div style="padding:16px 20px">
            <div style="display:flex;align-items:flex-start;gap:16px;flex-wrap:wrap">
              <div style="font-size:3.5rem;line-height:1">${c.flag}</div>
              <div style="flex:1;min-width:200px">
                <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:8px">
                  <h3 style="font-size:1.3rem;font-weight:900;margin:0">${c.name}</h3>
                  <span style="padding:3px 10px;background:rgba(34,197,94,0.15);border:1px solid #22c55e;border-radius:20px;font-size:0.8rem;font-weight:700;color:#22c55e">Score: ${c.score}/10</span>
                </div>
                <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:8px;margin-bottom:12px">
                  ${[
                    ['GDP', c.gdp, '#3b82f6'],
                    ['GDP Growth', c.gdpGrowth, '#22c55e'],
                    ['Inflation', c.inflation, '#f59e0b'],
                    ['Interest Rate', c.rates, '#8b5cf6'],
                    ['Unemployment', c.unemployment, '#f97316'],
                    ['FDI Inflow', c.fdi, '#22c55e'],
                  ].map(([label, val, color]) => `
                    <div style="padding:8px 10px;background:rgba(255,255,255,0.04);border-radius:8px">
                      <div style="font-size:0.68rem;color:#94a3b8;margin-bottom:2px">${label}</div>
                      <div style="font-size:0.9rem;font-weight:700;color:${color}">${val}</div>
                    </div>
                  `).join('')}
                </div>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px">
                  <div style="padding:10px 12px;background:rgba(34,197,94,0.06);border-radius:8px;border-left:2px solid #22c55e">
                    <div style="font-size:0.7rem;font-weight:700;color:#22c55e;margin-bottom:4px">✅ STRENGTHS</div>
                    <div style="font-size:0.78rem;color:#94a3b8;line-height:1.5">${c.strengths}</div>
                  </div>
                  <div style="padding:10px 12px;background:rgba(239,68,68,0.06);border-radius:8px;border-left:2px solid #ef4444">
                    <div style="font-size:0.7rem;font-weight:700;color:#ef4444;margin-bottom:4px">⚠️ RISKS</div>
                    <div style="font-size:0.78rem;color:#94a3b8;line-height:1.5">${c.risks}</div>
                  </div>
                </div>
                <div style="display:flex;gap:12px;flex-wrap:wrap;align-items:center">
                  <div style="font-size:0.78rem;color:#94a3b8">GDP Forecast: <span style="color:#22c55e;font-weight:700">${c.outlook3yr} (3yr)</span> · <span style="color:#22c55e;font-weight:700">${c.outlook5yr} (5yr)</span> · <span style="color:#22c55e;font-weight:700">${c.outlook10yr} (10yr)</span></div>
                </div>
                <div style="margin-top:8px;font-size:0.75rem">
                  <span style="color:#94a3b8">Best Sectors: </span>
                  <span style="color:#a5b4fc;font-weight:600">${c.bestSectors}</span>
                </div>
                <div style="margin-top:4px;font-size:0.68rem;color:#4b5563">📊 Source: ${c.source}</div>
              </div>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

// ============================================================
// TAB 3: INDUSTRY ANALYSIS
// ============================================================
function renderIndustries() {
  const industries = [
    { icon:'🤖', name:'Artificial Intelligence', size:'$196B (2024)', size2030:'$1.8T', cagr:'37%', drivers:'LLM adoption, enterprise AI tools, autonomous systems, AI agents', risks:'Regulation (EU AI Act), copyright issues, energy consumption, concentration risk', govSupport:'US CHIPS Act, EU AI investments, India AI Mission $1.25B, China AI development plan', topCountries:'USA, China, UK, Canada, France', topCos:'NVIDIA, Microsoft, Google, Anthropic, OpenAI, Baidu, Mistral', invest:'AI chips, AI software (SaaS), data infrastructure, AI-native companies', score:9.8 },
    { icon:'⚡', name:'Semiconductors', size:'$611B (2024)', size2030:'$1.1T', cagr:'14%', drivers:'AI chips, IoT, EVs, 5G, military electronics — everything needs chips', risks:'Geopolitical (US-China chip war), Taiwan risk (TSMC), fab construction delays', govSupport:'US CHIPS Act $52B, EU Chips Act €43B, India Semiconductor Mission $10B', topCountries:'Taiwan, South Korea, USA, Netherlands, Japan', topCos:'NVIDIA, TSMC, Samsung, ASML, Intel, Qualcomm, AMD, SK Hynix', invest:'ASML (only EUV maker), TSMC, NVDA, memory chip revival plays', score:9.5 },
    { icon:'🔋', name:'EV & Battery Technology', size:'$388B (2024)', size2030:'$1.1T', cagr:'23%', drivers:'Government EV mandates (EU 2035 ICE ban), charging infrastructure, falling battery costs', risks:'Lithium/cobalt supply chain, charging infrastructure lag, consumer adoption pace', govSupport:'US IRA $369B, EU Green Deal, India FAME scheme, China NEV subsidies', topCountries:'China, USA, Germany, South Korea, India', topCos:'Tesla, BYD, CATL, LG Energy, Panasonic, Volkswagen, Hyundai', invest:'Battery manufacturers, EV charging networks, lithium miners', score:9.2 },
    { icon:'☀️', name:'Renewable Energy', size:'$928B (2024)', size2030:'$2.1T', cagr:'17%', drivers:'Net zero commitments (195 countries), solar cost -90% in 10 years, energy security post-Russia war', risks:'Grid stability, land use, critical minerals, intermittency, policy reversal risk', govSupport:'US IRA, EU Green Deal, India 500GW target, Saudi NEOM 100% renewables', topCountries:'China, USA, Germany, India, Spain, Australia', topCos:'NextEra, Ørsted, Vestas, First Solar, Adani Green, NTPC Renewables, BYD', invest:'Solar manufacturers, wind farms, green hydrogen, grid storage', score:9.0 },
    { icon:'🛡️', name:'Cybersecurity', size:'$245B (2024)', size2030:'$562B', cagr:'13%', drivers:'AI-powered attacks, ransomware surge (cost $8T in 2023), data protection laws (GDPR), cloud migration', risks:'Talent shortage, commoditization of basic security, point solution fatigue', govSupport:'US CISA investments, EU NIS2 directive, India CERT budget increase', topCountries:'USA, Israel, UK, Australia, Singapore', topCos:'Palo Alto Networks, CrowdStrike, Microsoft, Fortinet, Zscaler, Check Point', invest:'Cloud security, AI security, endpoint protection, zero-trust platforms', score:8.8 },
    { icon:'🧬', name:'Biotechnology & Gene Therapy', size:'$512B (2024)', size2030:'$937B', cagr:'14%', drivers:'mRNA technology (post-COVID), CRISPR gene editing, personalized medicine, aging populations', risks:'FDA approval risk, long development timelines (10+ years), patent cliffs', govSupport:'NIH $47B funding (USA), EU Horizon program, India biotech policy', topCountries:'USA, UK, Germany, Switzerland, Denmark', topCos:'Moderna, BioNTech, Genentech, Regeneron, AstraZeneca, Novo Nordisk (GLP-1)', invest:'GLP-1 weight loss drugs (Ozempic category), gene therapy, AI drug discovery', score:8.7 },
    { icon:'🤖', name:'Robotics & Automation', size:'$78B (2024)', size2030:'$218B', cagr:'25%', drivers:'Labor shortages globally, Industry 4.0, humanoid robots (Tesla Optimus, Figure AI, Boston Dynamics)', risks:'High upfront costs, technical limitations of humanoids, worker resistance', govSupport:'Japan Robot Strategy, Germany Industry 4.0, Made in China 2025', topCountries:'Japan, China, USA, Germany, South Korea', topCos:'ABB, FANUC, Kuka, Boston Dynamics, Tesla (Optimus), Figure AI, Keyence', invest:'Industrial automation, humanoid robot startups, robotic surgery (Intuitive Surgical)', score:8.8 },
    { icon:'☁️', name:'Cloud Computing & SaaS', size:'$677B (2024)', size2030:'$1.6T', cagr:'21%', drivers:'AI workloads driving cloud spend, digital transformation, remote work permanence, sovereign cloud', risks:'Hyperscaler concentration (AWS/Azure/GCP = 65%), cost optimization pressure, margin compression', govSupport:'India Digital Public Infrastructure, EU sovereign cloud initiatives, US DOD cloud', topCountries:'USA, India, China, Germany, UK', topCos:'AWS (Amazon), Azure (Microsoft), Google Cloud, Salesforce, ServiceNow, Snowflake', invest:'AI cloud infrastructure, vertical SaaS, data platforms', score:8.6 },
    { icon:'💊', name:'Pharmaceuticals & GLP-1', size:'$1.6T (2024)', size2030:'$2.2T', cagr:'6%', drivers:'Obesity epidemic (1B people by 2030), GLP-1 drugs (Ozempic, Wegovy), biosimilars, emerging markets', risks:'Patent cliffs, generic competition, pricing pressure (US drug reform), clinical trial failures', govSupport:'NIH funding, India PLI pharma scheme, EU pharma strategy', topCountries:'USA, Germany, Switzerland, UK, India (generics)', topCos:'Novo Nordisk, Eli Lilly, AstraZeneca, Pfizer, Roche, Sun Pharma, Dr. Reddy\'s', invest:'GLP-1 manufacturer supply chain, Indian generic pharma, weight loss market', score:8.2 },
    { icon:'🛩️', name:'Defense & Aerospace', size:'$2.4T (2024)', size2030:'$3.2T', cagr:'8%', drivers:'Russia-Ukraine war, NATO spending pledges (2% GDP), hypersonic missiles, drone warfare, space race', risks:'Budget cuts risk, geopolitical peace (reduces demand), supply chain for titanium', govSupport:'US defense budget $886B (2024), NATO countries ramping up, India defense self-reliance ($25B)', topCountries:'USA, Russia, France, UK, Germany, India, Israel', topCos:'Lockheed Martin, RTX (Raytheon), BAE Systems, L3Harris, Safran, HAL (India)', invest:'Drone technology, hypersonics, satellite defense, India defense (HAL, BEL)', score:8.4 },
  ];

  return `
    <div style="display:grid;gap:16px">
      ${industries.map(ind => `
        <div class="card">
          <div style="padding:16px 20px">
            <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;flex-wrap:wrap">
              <span style="font-size:2.2rem">${ind.icon}</span>
              <div style="flex:1">
                <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
                  <h3 style="font-size:1.1rem;font-weight:900;margin:0">${ind.name}</h3>
                  <span style="padding:3px 10px;background:rgba(99,102,241,0.15);border:1px solid #6366f1;border-radius:20px;font-size:0.78rem;font-weight:700;color:#a5b4fc">Score: ${ind.score}/10</span>
                  <span style="padding:3px 10px;background:rgba(34,197,94,0.15);border:1px solid #22c55e;border-radius:20px;font-size:0.78rem;font-weight:700;color:#22c55e">CAGR: ${ind.cagr}</span>
                </div>
              </div>
              <div style="text-align:right">
                <div style="font-size:0.7rem;color:#94a3b8">2024 Size</div>
                <div style="font-size:1.1rem;font-weight:800;color:#f8fafc">${ind.size}</div>
                <div style="font-size:0.75rem;color:#22c55e">→ ${ind.size2030} by 2030</div>
              </div>
            </div>
            <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:10px;margin-bottom:10px">
              <div style="padding:10px 12px;background:rgba(34,197,94,0.06);border-radius:8px;border-left:2px solid #22c55e">
                <div style="font-size:0.68rem;font-weight:700;color:#22c55e;margin-bottom:4px">📈 GROWTH DRIVERS</div>
                <div style="font-size:0.78rem;color:#94a3b8;line-height:1.5">${ind.drivers}</div>
              </div>
              <div style="padding:10px 12px;background:rgba(239,68,68,0.06);border-radius:8px;border-left:2px solid #ef4444">
                <div style="font-size:0.68rem;font-weight:700;color:#ef4444;margin-bottom:4px">⚠️ RISKS</div>
                <div style="font-size:0.78rem;color:#94a3b8;line-height:1.5">${ind.risks}</div>
              </div>
              <div style="padding:10px 12px;background:rgba(59,130,246,0.06);border-radius:8px;border-left:2px solid #3b82f6">
                <div style="font-size:0.68rem;font-weight:700;color:#3b82f6;margin-bottom:4px">🏛️ GOVT SUPPORT</div>
                <div style="font-size:0.78rem;color:#94a3b8;line-height:1.5">${ind.govSupport}</div>
              </div>
              <div style="padding:10px 12px;background:rgba(245,158,11,0.06);border-radius:8px;border-left:2px solid #f59e0b">
                <div style="font-size:0.68rem;font-weight:700;color:#f59e0b;margin-bottom:4px">💡 INVESTMENT ANGLE</div>
                <div style="font-size:0.78rem;color:#94a3b8;line-height:1.5">${ind.invest}</div>
              </div>
            </div>
            <div style="display:flex;gap:16px;flex-wrap:wrap;font-size:0.78rem">
              <span><span style="color:#94a3b8">Top Countries: </span><span style="color:#a5b4fc;font-weight:600">${ind.topCountries}</span></span>
            </div>
            <div style="margin-top:6px;font-size:0.78rem">
              <span style="color:#94a3b8">Top Companies: </span><span style="color:#22c55e;font-weight:600">${ind.topCos}</span>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

// ============================================================
// TAB 4: COMPANY ANALYSIS
// ============================================================
function renderCompanies() {
  const companies = [
    { flag:'🇺🇸', sym:'NVDA',  name:'NVIDIA Corp',        sector:'AI Chips',    rev:'$83B', profit:'$46B', margin:'55%', mktCap:'$3.3T', growth:'+122%', moat:'80%+ AI GPU market, CUDA ecosystem lock-in (15M developers)', risks:'AMD/Intel competition, China restrictions, customer concentration (top 5 = 40% revenue)', future:'Blackwell GPU generation, AI inference market, robotics (Isaac)', invest:'STRONG BUY', score:9.9 },
    { flag:'🇺🇸', sym:'MSFT',  name:'Microsoft',           sector:'Cloud/AI',    rev:'$245B', profit:'$88B', margin:'36%', mktCap:'$3.1T', growth:'+16%', moat:'Azure AI leadership, Office365 (400M users), GitHub Copilot, Teams, LinkedIn', risks:'Antitrust (OpenAI deal), AI competition from Google, cloud market maturation', future:'Copilot monetization across all products, AI agents, Azure AI revenue', invest:'STRONG BUY', score:9.5 },
    { flag:'🇺🇸', sym:'AAPL',  name:'Apple Inc',           sector:'Consumer Tech',rev:'$391B', profit:'$97B', margin:'24%', mktCap:'$2.9T', growth:'+2%', moat:'1.4B devices, App Store ($100B revenue), switching costs, brand premium, services growth', risks:'China revenue (20%), AI late entry vs Google/MSFT, iPhone upgrade cycle slowdown', future:'Apple Intelligence (AI), Vision Pro, India manufacturing scale-up', invest:'BUY', score:8.8 },
    { flag:'🇺🇸', sym:'AMZN',  name:'Amazon',              sector:'Cloud/E-com', rev:'$620B', profit:'$30B', margin:'5%', mktCap:'$2.1T', growth:'+13%', moat:'AWS ($100B run rate), Prime loyalty (200M members), logistics network, Alexa AI', risks:'AWS competition, regulatory pressure, thin retail margins', future:'AI services (Amazon Bedrock), logistics robotics, healthcare expansion', invest:'STRONG BUY', score:9.2 },
    { flag:'🇹🇼', sym:'TSM',   name:'TSMC',                sector:'Semiconductors',rev:'$87B', profit:'$31B', margin:'36%', mktCap:'$900B', growth:'+25%', moat:'Only company making 2nm/3nm chips. NVIDIA/Apple/AMD all depend on TSMC. No real alternative', risks:'Taiwan geopolitical risk (China invasion threat), concentration risk', future:'Arizona fabs, 2nm volume production, AI chip demand surge', invest:'STRONG BUY', score:9.4 },
    { flag:'🇺🇸', sym:'GOOGL', name:'Alphabet (Google)',   sector:'AI/Ads',      rev:'$350B', profit:'$74B', margin:'21%', mktCap:'$2.1T', growth:'+14%', moat:'90%+ search market share, YouTube (2B users), DeepMind AI, Android, Waymo', risks:'AI search disruption (ChatGPT), antitrust (DOJ case), ad market cyclicality', future:'Gemini AI, Google Cloud AI services, Waymo robotaxi', invest:'BUY', score:8.7 },
    { flag:'🇩🇰', sym:'NVO',   name:'Novo Nordisk',        sector:'Pharma/GLP-1',rev:'$36B', profit:'$11B', margin:'31%', mktCap:'$550B', growth:'+25%', moat:'Ozempic/Wegovy monopoly in GLP-1 — treating obesity, diabetes. 1B+ potential patients', risks:'Eli Lilly competition (Mounjaro), manufacturing capacity, pricing pressure', future:'Oral semaglutide, heart/kidney disease expansion, supply scale-up', invest:'STRONG BUY', score:9.0 },
    { flag:'🇳🇱', sym:'ASML',  name:'ASML Holding',        sector:'Semiconductors',rev:'$28B', profit:'$7.9B', margin:'28%', mktCap:'$310B', growth:'+15%', moat:'ONLY maker of EUV lithography machines. Every advanced chip needs ASML equipment. True monopoly', risks:'China export restrictions (40% of revenue), fab construction delays', future:'High-NA EUV (next gen), 2025-2030 EUV installed base doubling', invest:'STRONG BUY', score:9.3 },
    { flag:'🇮🇳', sym:'RELIANCE',name:'Reliance Industries',sector:'Conglomerate', rev:'$111B', profit:'$8.6B', margin:'8%', mktCap:'$220B', growth:'+12%', moat:'India\'s largest company. Jio (500M users), Reliance Retail (#1 Indian retailer), Jamnagar refinery (world\'s largest)', risks:'Regulatory, succession planning (after Mukesh Ambani), green energy execution risk', future:'Green hydrogen, Jio financial services, global retail expansion', invest:'BUY', score:9.0 },
    { flag:'🇸🇦', sym:'2222',  name:'Saudi Aramco',        sector:'Energy',      rev:'$440B', profit:'$121B', margin:'28%', mktCap:'$1.8T', growth:'-4%', moat:'World\'s largest oil reserves, lowest production cost ($3/barrel), 10M bbl/day production', risks:'Energy transition (long-term oil demand decline), Saudi Arabia politics', future:'Blue hydrogen, petrochemicals expansion, $70B annual capex', invest:'HOLD/DIVIDEND', score:8.2 },
  ];

  return `
    <div style="display:grid;gap:16px">
      ${companies.map(c => `
        <div class="card">
          <div style="padding:16px 20px">
            <div style="display:flex;align-items:flex-start;gap:16px;flex-wrap:wrap">
              <div style="font-size:2rem">${c.flag}</div>
              <div style="flex:1">
                <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:10px">
                  <span style="font-family:monospace;font-weight:900;color:#22c55e;font-size:1rem">${c.sym}</span>
                  <h3 style="font-size:1.1rem;font-weight:900;margin:0">${c.name}</h3>
                  <span style="padding:2px 8px;background:rgba(99,102,241,0.15);border-radius:6px;font-size:0.72rem;color:#a5b4fc">${c.sector}</span>
                  <span style="padding:3px 10px;border-radius:20px;font-size:0.78rem;font-weight:700;
                    background:${c.invest.includes('STRONG')?'rgba(34,197,94,0.2)':'rgba(59,130,246,0.2)'};
                    border:1px solid ${c.invest.includes('STRONG')?'#22c55e':'#3b82f6'};
                    color:${c.invest.includes('STRONG')?'#22c55e':'#3b82f6'}">${c.invest}</span>
                  <span style="padding:3px 10px;background:rgba(245,158,11,0.15);border:1px solid #f59e0b;border-radius:20px;font-size:0.78rem;font-weight:700;color:#f59e0b">Score: ${c.score}/10</span>
                </div>
                <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:8px;margin-bottom:10px">
                  ${[['Revenue', c.rev,'#3b82f6'],['Net Profit', c.profit,'#22c55e'],['Net Margin', c.margin,'#22c55e'],['Market Cap', c.mktCap,'#8b5cf6'],['YoY Growth', c.growth,'#f59e0b']].map(([l,v,col])=>`
                    <div style="padding:8px 10px;background:rgba(255,255,255,0.04);border-radius:8px">
                      <div style="font-size:0.65rem;color:#94a3b8">${l}</div>
                      <div style="font-size:0.88rem;font-weight:700;color:${col}">${v}</div>
                    </div>
                  `).join('')}
                </div>
                <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:8px">
                  <div style="padding:8px 10px;background:rgba(34,197,94,0.06);border-radius:8px;border-left:2px solid #22c55e;grid-column:1">
                    <div style="font-size:0.65rem;font-weight:700;color:#22c55e;margin-bottom:3px">🏰 MOAT</div>
                    <div style="font-size:0.76rem;color:#94a3b8;line-height:1.5">${c.moat}</div>
                  </div>
                  <div style="padding:8px 10px;background:rgba(239,68,68,0.06);border-radius:8px;border-left:2px solid #ef4444">
                    <div style="font-size:0.65rem;font-weight:700;color:#ef4444;margin-bottom:3px">⚠️ RISKS</div>
                    <div style="font-size:0.76rem;color:#94a3b8;line-height:1.5">${c.risks}</div>
                  </div>
                  <div style="padding:8px 10px;background:rgba(99,102,241,0.06);border-radius:8px;border-left:2px solid #6366f1">
                    <div style="font-size:0.65rem;font-weight:700;color:#6366f1;margin-bottom:3px">🔮 FUTURE</div>
                    <div style="font-size:0.76rem;color:#94a3b8;line-height:1.5">${c.future}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
    <div style="padding:12px 16px;background:rgba(245,158,11,0.08);border:1px solid rgba(245,158,11,0.2);border-radius:10px;margin-top:8px">
      <span style="font-size:0.75rem;color:#94a3b8">⚠️ <strong style="color:#f59e0b">Not Financial Advice.</strong> Data from Bloomberg, company filings, Goldman Sachs, Morgan Stanley research (2024–2025). DYOR before investing.</span>
    </div>
  `;
}

// ============================================================
// TAB 5: TRADE ANALYSIS
// ============================================================
function renderTrade() {
  const tradeData = [
    { flag:'🇺🇸', country:'USA', exports:'$3.05T', imports:'$3.82T', balance:'-$770B', topExports:'Aircraft, Machinery, Petroleum, Pharma, Semiconductors, Services', topImports:'Electronics, Vehicles, Clothing, Oil, Pharma, Consumer Goods', topPartners:'Canada (17%), Mexico (16%), China (7%), Japan (5%), UK (4%)', future:'AI/software services exports growing, nearshoring to Mexico, LNG export expansion' },
    { flag:'🇨🇳', country:'China', exports:'$3.38T', imports:'$2.50T', balance:'+$877B', topExports:'Electronics, Machinery, Textiles, EVs, Steel, Chemicals, Furniture', topImports:'Semiconductors, Oil, Iron Ore, Soybeans, LNG, Machinery', topPartners:'USA (15%), EU (14%), ASEAN (13%), Japan (5%), South Korea (5%)', future:'EV exports surge (BYD), Belt & Road trade expansion, Southeast Asia trade growth' },
    { flag:'🇮🇳', country:'India', exports:'$776B', imports:'$1.026T', balance:'-$250B', topExports:'IT Services ($217B), Petroleum products, Pharma, Gems, Textiles, Engineering', topImports:'Crude Oil (27%), Electronics, Gold, Chemicals, Coal', topPartners:'USA (18%), UAE (7%), Netherlands (5%), China (4%), UK (3%)', future:'Electronics exports (PLI), Defense exports target $5B, Green hydrogen exports' },
    { flag:'🇩🇪', country:'Germany', exports:'$1.72T', imports:'$1.47T', balance:'+$252B', topExports:'Vehicles, Machinery, Chemicals, Aircraft, Pharma, Electronics', topImports:'Gas (post-Russia alternative sources), Electronics, Vehicles, Chemicals, Food', topPartners:'USA (10%), France (8%), China (8%), Netherlands (8%), UK (5%)', future:'Green tech exports, hydrogen economy, defense exports (post-NATO pledges)' },
    { flag:'🇯🇵', country:'Japan', exports:'$920B', imports:'$960B', balance:'-$40B', topExports:'Vehicles (25%), Machinery, Electronics, Chemicals, Steel, Ships', topImports:'LNG (30%), Electronics, Food, Chemicals, Oil', topPartners:'USA (19%), China (19%), South Korea (7%), Taiwan (6%)', future:'EV transition (Japan auto risk), semiconductor equipment exports, green tech' },
    { flag:'🇸🇦', country:'Saudi Arabia', exports:'$410B', imports:'$228B', balance:'+$182B', topExports:'Crude Oil (62%), Petroleum products, Petrochemicals (SABIC), Plastics', topImports:'Machinery, Vehicles, Electronics, Food, Metals', topPartners:'China (20%), India (12%), Japan (12%), South Korea (9%), USA (4%)', future:'Non-oil exports target (Vision 2030), mining (NEOM minerals), defense' },
    { flag:'🇻🇳', country:'Vietnam', exports:'$370B', imports:'$328B', balance:'+$42B', topExports:'Electronics (Samsung phones 20% of exports), Textiles, Footwear, Seafood, Wood', topImports:'Electronics components, Machinery, Fabric, Steel, Petroleum', topPartners:'USA (30%), China (15%), South Korea (7%), Japan (7%), EU (10%)', future:'China+1 manufacturing hub, semiconductor packaging, green energy exports' },
  ];

  const futureProducts = [
    { rank:1, product:'AI Chips (GPUs)', demand2030:'$500B+', cagr:'42%', leaders:'NVIDIA, AMD, Intel, Google TPU', why:'Every AI model needs chips. NVDA H100 = $30K, waitlist 12 months', entry:'HIGH — capital intensive' },
    { rank:2, product:'EV Batteries (LFP, NMC)', demand2030:'$400B+', cagr:'28%', leaders:'CATL, LG Energy, Panasonic, Samsung SDI', why:'Every EV needs batteries. Demand 5x by 2030', entry:'HIGH — gigafactory scale' },
    { rank:3, product:'Solar Panels', demand2030:'$380B+', cagr:'19%', leaders:'LONGi Solar, JinkoSolar, First Solar', why:'Cheapest electricity ever. 1TW+ annual additions by 2030', entry:'MEDIUM-HIGH (China dominates)' },
    { rank:4, product:'GLP-1 Drugs (Obesity)', demand2030:'$130B+', cagr:'35%', leaders:'Novo Nordisk, Eli Lilly', why:'1B obese adults globally, insurance now covering. Ozempic shortage', entry:'VERY HIGH (drug patents, FDA)' },
    { rank:5, product:'Green Hydrogen', demand2030:'$350B+', cagr:'54%', leaders:'Air Products, Plug Power, Nel ASA', why:'Decarbonizing steel/cement/shipping. Zero carbon fuel of the future', entry:'HIGH (electrolyzer scale)' },
    { rank:6, product:'Defence Drones', demand2030:'$80B+', cagr:'15%', leaders:'AeroVironment, Shield AI, Israeli startups', why:'Ukraine war proved drone importance. NATO countries all buying', entry:'MEDIUM (specialized)' },
    { rank:7, product:'Critical Minerals (Lithium, Cobalt, Nickel)', demand2030:'$500B+', cagr:'22%', leaders:'Albemarle, SQM, Glencore', why:'EV + batteries + renewable energy all need critical minerals', entry:'HIGH (mining investment)' },
    { rank:8, product:'Cybersecurity Software', demand2030:'$350B+', cagr:'13%', leaders:'Palo Alto, CrowdStrike, Zscaler', why:'Every company needs cyber. AI threats increasing', entry:'MEDIUM (software)' },
  ];

  return `
    <div class="card mb-4">
      <div class="card-header"><div class="card-title"><i class="fa fa-ship"></i> Major Countries — Trade Analysis 2024</div></div>
      <div style="display:grid;gap:12px;padding:16px">
        ${tradeData.map(t => `
          <div style="padding:14px 16px;background:rgba(255,255,255,0.03);border-radius:12px;border:1px solid var(--border-color)">
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;flex-wrap:wrap">
              <span style="font-size:1.8rem">${t.flag}</span>
              <strong style="font-size:1rem">${t.country}</strong>
              <div style="display:flex;gap:8px;flex-wrap:wrap">
                <span style="font-size:0.8rem;padding:3px 10px;background:rgba(34,197,94,0.1);border-radius:20px;color:#22c55e">Exports: ${t.exports}</span>
                <span style="font-size:0.8rem;padding:3px 10px;background:rgba(239,68,68,0.1);border-radius:20px;color:#f87171">Imports: ${t.imports}</span>
                <span style="font-size:0.8rem;padding:3px 10px;background:${t.balance.startsWith('+') ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)'};border-radius:20px;color:${t.balance.startsWith('+') ? '#22c55e' : '#f87171'}">Balance: ${t.balance}</span>
              </div>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:8px">
              <div><span style="font-size:0.7rem;color:#22c55e;font-weight:700">TOP EXPORTS: </span><span style="font-size:0.78rem;color:#94a3b8">${t.topExports}</span></div>
              <div><span style="font-size:0.7rem;color:#f87171;font-weight:700">TOP IMPORTS: </span><span style="font-size:0.78rem;color:#94a3b8">${t.topImports}</span></div>
            </div>
            <div style="font-size:0.76rem;color:#94a3b8"><strong style="color:#a5b4fc">Partners:</strong> ${t.topPartners}</div>
            <div style="margin-top:6px;font-size:0.76rem;color:#94a3b8"><strong style="color:#f59e0b">Future:</strong> ${t.future}</div>
          </div>
        `).join('')}
      </div>
    </div>

    <div class="card">
      <div class="card-header"><div class="card-title"><i class="fa fa-box"></i> Highest Demand Products — Next 5–10 Years</div></div>
      <div style="overflow-x:auto">
        <table style="width:100%;border-collapse:collapse">
          <thead><tr style="background:var(--bg-elevated)">
            <th style="padding:10px 14px;font-size:0.78rem;color:#94a3b8">#</th>
            <th style="padding:10px 14px;font-size:0.78rem;color:#94a3b8">Product</th>
            <th style="padding:10px 14px;text-align:right;font-size:0.78rem;color:#94a3b8">Market 2030</th>
            <th style="padding:10px 14px;text-align:right;font-size:0.78rem;color:#94a3b8">CAGR</th>
            <th style="padding:10px 14px;font-size:0.78rem;color:#94a3b8">Top Makers</th>
            <th style="padding:10px 14px;font-size:0.78rem;color:#94a3b8">Why High Demand</th>
            <th style="padding:10px 14px;font-size:0.78rem;color:#94a3b8">Entry Barrier</th>
          </tr></thead>
          <tbody>
            ${futureProducts.map(p => `
              <tr style="border-top:1px solid var(--border-color)">
                <td style="padding:12px 14px;font-weight:900;color:#6366f1">${p.rank}</td>
                <td style="padding:12px 14px;font-weight:700">${p.product}</td>
                <td style="padding:12px 14px;text-align:right;font-family:monospace;color:#22c55e;font-weight:700">${p.demand2030}</td>
                <td style="padding:12px 14px;text-align:right;font-weight:800;color:#22c55e">${p.cagr}</td>
                <td style="padding:12px 14px;font-size:0.78rem;color:#94a3b8">${p.leaders}</td>
                <td style="padding:12px 14px;font-size:0.78rem;color:#94a3b8;max-width:220px">${p.why}</td>
                <td style="padding:12px 14px;font-size:0.75rem;color:${p.entry.includes('VERY')?'#ef4444':p.entry.includes('HIGH')?'#f59e0b':'#22c55e'}">${p.entry}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// ============================================================
// TAB 6: INVESTOR ANALYSIS
// ============================================================
function renderInvestors() {
  const investors = [
    { name:'Warren Buffett / Berkshire Hathaway', aum:'$900B+', top:'Apple (40%), Bank of America, Chevron, Coca-Cola, Kraft Heinz', recent:'Trimmed Apple, added Occidental Petroleum, Ulta Beauty exit', thesis:'Value investing: buy wonderful companies at fair price. Long-term hold. Avoid tech speculation. Dividend focus.', style:'Value/Long-term' },
    { name:'BlackRock (Larry Fink)', aum:'$10T', top:'Every S&P 500 company via index funds. Active bets: AI infrastructure, climate transition', recent:'Big push into private credit, infrastructure, AI data centers', thesis:'ESG integration + index investing. Shifting to private markets. AI infrastructure opportunity', style:'Index + Active' },
    { name:'SoftBank Vision Fund (Masa Son)', aum:'$150B', top:'ARM Holdings (90B), ByteDance, OpenAI, Coupang, DoorDash', recent:'ARM IPO success. Back to investing in AI startups aggressively ($1B+ rounds)', thesis:'AI is the biggest bet in human history. Investing in companies that will be powered by artificial intelligence', style:'Mega-bets/VC' },
    { name:'Temasek (Singapore)', aum:'$300B', top:'DBS Bank, Singapore Airlines, Alibaba, ByteDance, India companies', recent:'Increased India allocation, cut China (Alibaba sold), more Southeast Asia', thesis:'Long-term value, focus on Asia. India seen as major growth opportunity. Sustainability focus.', style:'Sovereign/Long-term' },
    { name:'Saudi PIF (Crown Prince MBS)', aum:'$700B', top:'Saudi Aramco, NEOM, LIV Golf, Newcastle FC, Lucid Motors, Uber, Noon', recent:'$1.5B gaming push (Nintendo, Nintendo, Activision), sports washing, AI investments', thesis:'Vision 2030 diversification. Move from oil to tech, tourism, entertainment, sports. Build global brand.', style:'Strategic/Diversify' },
    { name:'Sequoia Capital', aum:'$85B', top:'Apple, Google, Oracle (early), WhatsApp, Stripe, Unity, Snowflake, Airbnb', recent:'Investing in AI: Harvey AI, Mistral, Wayve. Separate US/China/India funds', thesis:'Partner with exceptional founders. AI-native companies are the next wave. India office growing fast.', style:'VC/Growth' },
    { name:'Bridgewater Associates (Ray Dalio)', aum:'$124B', top:'Macro bets. Gold, TIPS, emerging markets, diversified commodities', recent:'Warning on US debt, China allocation reduced, India growing position', thesis:'All Weather portfolio. Debt cycle analysis. Big concern on US fiscal sustainability. Gold as reserve', style:'Global Macro' },
    { name:'GIC (Singapore)', aum:'$770B', top:'Real estate globally, infrastructure, public + private equities', recent:'India infra investments ($3B+), US data centers, European logistics', thesis:'30-year investment horizon. Inflation-protected assets. Real assets + private equity focus.', style:'Sovereign/Infrastructure' },
  ];

  return `
    <div style="display:grid;gap:16px">
      ${investors.map(inv => `
        <div class="card">
          <div style="padding:14px 18px">
            <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:10px;flex-wrap:wrap;margin-bottom:10px">
              <div>
                <h3 style="font-size:1rem;font-weight:900;margin:0 0 4px">${inv.name}</h3>
                <span style="font-size:0.78rem;color:#94a3b8">AUM: <strong style="color:#22c55e">${inv.aum}</strong></span>
                &nbsp;&nbsp;
                <span style="padding:2px 8px;background:rgba(99,102,241,0.15);border-radius:6px;font-size:0.72rem;color:#a5b4fc">${inv.style}</span>
              </div>
            </div>
            <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:8px">
              <div style="padding:8px 10px;background:rgba(255,255,255,0.04);border-radius:8px">
                <div style="font-size:0.65rem;font-weight:700;color:#22c55e;margin-bottom:3px">📂 TOP HOLDINGS</div>
                <div style="font-size:0.76rem;color:#94a3b8;line-height:1.5">${inv.top}</div>
              </div>
              <div style="padding:8px 10px;background:rgba(255,255,255,0.04);border-radius:8px">
                <div style="font-size:0.65rem;font-weight:700;color:#3b82f6;margin-bottom:3px">🆕 RECENT MOVES</div>
                <div style="font-size:0.76rem;color:#94a3b8;line-height:1.5">${inv.recent}</div>
              </div>
              <div style="padding:8px 10px;background:rgba(255,255,255,0.04);border-radius:8px">
                <div style="font-size:0.65rem;font-weight:700;color:#f59e0b;margin-bottom:3px">🧠 INVESTMENT THESIS</div>
                <div style="font-size:0.76rem;color:#94a3b8;line-height:1.5">${inv.thesis}</div>
              </div>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

// ============================================================
// TAB 7: PRODUCTS
// ============================================================
function renderProducts() {
  const products = [
    { cat:'🤖 Technology', items:[
      { name:'AI Software & APIs', size:'$196B', growth:'+37%', margin:'60–80%', opp:'SaaS companies embedding AI, AI API providers (OpenAI, Anthropic), vertical AI apps' },
      { name:'GPU / AI Chips', size:'$50B chip', growth:'+122%', margin:'55%+', opp:'NVIDIA monopoly. Every data center upgrading. $200B+ capex plans by hyperscalers' },
      { name:'Cloud Services (IaaS/PaaS)', size:'$677B', growth:'+21%', margin:'35–45%', opp:'AWS, Azure, GCP duopoly + AI workloads driving expansion. Multi-cloud management tools' },
      { name:'Cybersecurity Software', size:'$245B', growth:'+13%', margin:'25–70%', opp:'Zero-trust, AI security, cloud security. CrowdStrike, Palo Alto, Zscaler' },
    ]},
    { cat:'⚡ Energy & Clean Tech', items:[
      { name:'Solar Panels (Utility)', size:'$382B', growth:'+19%', margin:'15–25%', opp:'Cheapest electricity ever. 1.5TW annual market by 2030. India, MENA, Southeast Asia' },
      { name:'EV Batteries (LFP)', size:'$200B', growth:'+28%', margin:'10–20%', opp:'CATL, LG Energy, Northvolt. Gigafactory investments needed in every region' },
      { name:'Green Hydrogen', size:'$2.7B → $350B', growth:'+54%', margin:'TBD', opp:'Decarbonizing steel, cement, shipping. India + Middle East largest production potential' },
      { name:'Heat Pumps', size:'$80B', growth:'+14%', margin:'20–30%', opp:'Replace gas heating in Europe/North America. Post-Russia war urgency' },
    ]},
    { cat:'💊 Healthcare & Pharma', items:[
      { name:'GLP-1 Weight Loss Drugs', size:'$24B → $130B+', growth:'+35%', margin:'70–80%', opp:'Ozempic/Wegovy/Mounjaro. 1B obese adults. Cardiovascular, kidney, liver benefits emerging' },
      { name:'Gene Therapy (CRISPR)', size:'$6B → $40B', growth:'+28%', margin:'N/A (early)', opp:'Cure genetic diseases. First CRISPR therapy approved (sickle cell). Casgevy = $2.2M/patient' },
      { name:'AI Drug Discovery', size:'$1.4B → $26B', growth:'+45%', margin:'High (when approved)', opp:'Isomorphic Labs (DeepMind), Insilico Medicine, Recursion. Cuts drug discovery from 12yr to 3yr' },
    ]},
    { cat:'🏗️ Infrastructure & Materials', items:[
      { name:'Critical Minerals (Li, Co, Ni)', size:'$320B → $770B', growth:'+22%', margin:'Varies', opp:'Everything electrification needs critical minerals. Massive supply deficit coming' },
      { name:'Data Centers', size:'$238B', growth:'+25%', margin:'20–35%', opp:'AI needs 100x more compute. $400B+ being built. REITs like Equinix, Digital Realty' },
      { name:'Semiconductors Equipment', size:'$109B', growth:'+15%', margin:'28%+', opp:'ASML (monopoly), Applied Materials, Lam Research. Every fab expansion needs equipment' },
    ]},
  ];

  return `
    <div style="display:grid;gap:20px">
      ${products.map(cat => `
        <div class="card">
          <div class="card-header"><div class="card-title">${cat.cat}</div></div>
          <div style="overflow-x:auto">
            <table style="width:100%;border-collapse:collapse">
              <thead><tr style="background:var(--bg-elevated)">
                <th style="padding:10px 14px;font-size:0.78rem;color:#94a3b8">Product</th>
                <th style="padding:10px 14px;text-align:right;font-size:0.78rem;color:#94a3b8">Market Size</th>
                <th style="padding:10px 14px;text-align:right;font-size:0.78rem;color:#94a3b8">CAGR</th>
                <th style="padding:10px 14px;text-align:right;font-size:0.78rem;color:#94a3b8">Margins</th>
                <th style="padding:10px 14px;font-size:0.78rem;color:#94a3b8">Investment Opportunity</th>
              </tr></thead>
              <tbody>
                ${cat.items.map(p => `
                  <tr style="border-top:1px solid var(--border-color)">
                    <td style="padding:12px 14px;font-weight:700">${p.name}</td>
                    <td style="padding:12px 14px;text-align:right;font-family:monospace;font-size:0.85rem;color:#f8fafc">${p.size}</td>
                    <td style="padding:12px 14px;text-align:right;font-weight:800;color:#22c55e">${p.growth}</td>
                    <td style="padding:12px 14px;text-align:right;font-size:0.85rem;color:#f59e0b">${p.margin}</td>
                    <td style="padding:12px 14px;font-size:0.78rem;color:#94a3b8;max-width:280px">${p.opp}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

// ============================================================
// TAB 8: MARKETS ANALYSIS
// ============================================================
function renderMarkets() {
  const markets = [
    { flag:'🇺🇸', name:'S&P 500', sym:'SPX', val:'5,432', pe:'22x', ytd:'+16.8%', mktCap:'$46T', outlook:'Bullish. AI earnings upgrades, Fed rate cuts cycle. Risk: high valuations, election uncertainty. Target: 5,800–6,000 by end 2025 (Goldman Sachs)', score:8.0 },
    { flag:'🇺🇸', name:'NASDAQ 100', sym:'NDX', val:'19,341', pe:'28x', ytd:'+19.4%', mktCap:'$22T', outlook:'AI stocks driving outperformance. NVDA, MSFT, GOOGL mega-cap. Expensive but growth justifies. Rate-sensitive.', score:8.2 },
    { flag:'🇮🇳', name:'NIFTY 50', sym:'NSEI', val:'24,000', pe:'23x', ytd:'+12.6%', mktCap:'$4.5T', outlook:'Structural bull market. India fastest-growing economy. FII flows strong. SIP inflows $2.5B/month. Target 30,000 by 2027 (analysts)', score:9.0 },
    { flag:'🇮🇳', name:'SENSEX', sym:'BSE', val:'79,032', pe:'23x', ytd:'+11.4%', mktCap:'$4.5T', outlook:'Same as NIFTY — India growth story. Large-cap Indian stocks. Premium to EM peers justified by growth outlook.', score:8.8 },
    { flag:'🇯🇵', name:'Nikkei 225', sym:'N225', val:'38,647', pe:'18x', ytd:'+20.1%', mktCap:'$6.2T', outlook:'Best performing major market YTD. Weak yen boosts exporters. Warren Buffett buying Japanese trading houses. Semiconductor revival.', score:8.0 },
    { flag:'🇩🇪', name:'DAX 40', sym:'DAX', val:'18,768', pe:'14x', ytd:'+8.6%', mktCap:'$2.1T', outlook:'Cheap valuations (14x PE vs 22x S&P). Energy concerns resolved. German industrial recovery ongoing. AI/automation plays.', score:7.5 },
    { flag:'🇨🇳', name:'Shanghai Comp.', sym:'SHCOMP', val:'2,980', pe:'12x', ytd:'-5.8%', mktCap:'$9.5T', outlook:'Underperforming due to property crisis, deflation, regulatory crackdowns. Stimulus announced but weak implementation. High risk, contrarian opportunity.', score:5.5 },
    { flag:'🇬🇧', name:'FTSE 100', sym:'UKX', val:'8,203', pe:'11x', ytd:'+6.8%', mktCap:'$2.4T', outlook:'Very cheap (11x PE). Large commodity/energy weights. Post-Brexit reform agenda. Attractive dividend yields (3.8%). Overlooked by global investors.', score:7.2 },
    { flag:'🇰🇷', name:'KOSPI', sym:'KS11', val:'2,746', pe:'13x', ytd:'+3.2%', mktCap:'$1.7T', outlook:'Samsung + SK Hynix = AI memory boom. Cheap vs peers. Corporate governance reforms ongoing (Korea Discount elimination). HBM memory supercycle.', score:8.0 },
    { flag:'🌍', name:'MSCI World', sym:'URTH', val:'3,240', pe:'19x', ytd:'+12.5%', mktCap:'$72T', outlook:'Diversified global exposure. US = 65% weight (US dominance). Best risk-adjusted for long-term passive investors.', score:8.0 },
  ];

  return `
    <div class="card mb-4">
      <div class="card-header">
        <div class="card-title"><i class="fa fa-chart-line"></i> Global Stock Market Analysis — 2025</div>
        <span style="font-size:0.75rem;color:#94a3b8">Source: Bloomberg, Goldman Sachs, Morgan Stanley (2025)</span>
      </div>
      <div style="overflow-x:auto">
        <table style="width:100%;border-collapse:collapse">
          <thead><tr style="background:var(--bg-elevated)">
            <th style="padding:10px 14px;font-size:0.78rem;color:#94a3b8">Market</th>
            <th style="padding:10px 14px;text-align:right;font-size:0.78rem;color:#94a3b8">Level</th>
            <th style="padding:10px 14px;text-align:right;font-size:0.78rem;color:#94a3b8">P/E</th>
            <th style="padding:10px 14px;text-align:right;font-size:0.78rem;color:#94a3b8">YTD</th>
            <th style="padding:10px 14px;text-align:right;font-size:0.78rem;color:#94a3b8">Mkt Cap</th>
            <th style="padding:10px 14px;font-size:0.78rem;color:#94a3b8">Outlook & Analysis</th>
            <th style="padding:10px 14px;text-align:center;font-size:0.78rem;color:#94a3b8">Score</th>
          </tr></thead>
          <tbody>
            ${markets.map(m => `
              <tr style="border-top:1px solid var(--border-color)">
                <td style="padding:12px 14px">
                  <div style="font-size:1.1rem">${m.flag}</div>
                  <div style="font-weight:700;font-size:0.88rem">${m.name}</div>
                  <div style="font-size:0.72rem;color:#94a3b8;font-family:monospace">${m.sym}</div>
                </td>
                <td style="padding:12px 14px;text-align:right;font-family:monospace;font-weight:700">${m.val}</td>
                <td style="padding:12px 14px;text-align:right;font-size:0.85rem;color:${parseInt(m.pe)>20?'#f59e0b':'#22c55e'}">${m.pe}</td>
                <td style="padding:12px 14px;text-align:right;font-weight:700;color:${m.ytd.startsWith('+')?'#22c55e':'#ef4444'}">${m.ytd}</td>
                <td style="padding:12px 14px;text-align:right;font-size:0.85rem;color:#94a3b8">${m.mktCap}</td>
                <td style="padding:12px 14px;font-size:0.78rem;color:#94a3b8;max-width:300px;line-height:1.5">${m.outlook}</td>
                <td style="padding:12px 14px;text-align:center">
                  <span style="padding:3px 10px;background:${m.score>=8.5?'rgba(34,197,94,0.15)':m.score>=7?'rgba(99,102,241,0.15)':'rgba(245,158,11,0.15)'};
                    border:1px solid ${m.score>=8.5?'#22c55e':m.score>=7?'#6366f1':'#f59e0b'};
                    border-radius:20px;font-size:0.78rem;font-weight:700;
                    color:${m.score>=8.5?'#22c55e':m.score>=7?'#a5b4fc':'#f59e0b'}">${m.score}/10</span>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
      <div style="padding:12px 16px;background:rgba(245,158,11,0.08);border-top:1px solid rgba(245,158,11,0.2)">
        <span style="font-size:0.75rem;color:#94a3b8">⚠️ <strong style="color:#f59e0b">Not Financial Advice.</strong> Research only. Data: Bloomberg, Goldman Sachs 2025 outlook, IMF, company filings. Consult a registered advisor before investing. Past performance ≠ future results.</span>
      </div>
    </div>
  `;
}
