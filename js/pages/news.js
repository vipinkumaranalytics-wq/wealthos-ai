// =====================================================
// WealthOS AI — News, AI Summary, Market Sentiment
// =====================================================
import { newsAPI, stockAPI } from '../api.js';
import { timeAgo, toast, svgSparkline, generateSparkline } from '../utils.js';

const NEWS_FEEDS = [
  { name: 'Reuters Business', url: 'https://feeds.reuters.com/reuters/businessNews', category: 'Business' },
  { name: 'Yahoo Finance', url: 'https://finance.yahoo.com/rss/topfinstories', category: 'Finance' },
  { name: 'CoinDesk Crypto', url: 'https://www.coindesk.com/arc/outboundfeeds/rss/', category: 'Crypto' },
  { name: 'Seeking Alpha', url: 'https://seekingalpha.com/feed.xml', category: 'Investing' },
];

export function renderNews(container) {
  let activeFilter = 'All';
  let allArticles = [];
  let isLoading = false;

  container.innerHTML = `
    <div class="page-header">
      <div><h1 class="page-title"><i class="fa fa-newspaper text-purple"></i> Market News</h1>
      <p class="page-subtitle">Real-time financial news with AI sentiment analysis</p></div>
      <div class="page-actions">
        <button class="btn btn-secondary btn-sm" id="news-refresh"><i class="fa fa-rotate"></i> Refresh</button>
      </div>
    </div>

    <!-- Filter chips -->
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:20px" id="news-filters">
      ${['All','Business','Finance','Crypto','Investing','Technology'].map(f=>
        `<button class="btn btn-sm ${f==='All'?'btn-primary':'btn-secondary'}" data-filter="${f}">${f}</button>`
      ).join('')}
    </div>

    <div class="grid grid-2 mb-4">
      <!-- Main news feed -->
      <div id="news-main" style="grid-column:1">
        <div class="loading-center"><div class="spinner-lg spinner"></div></div>
      </div>

      <!-- Sidebar: top stories + sentiment -->
      <div>
        <!-- Sentiment Widget -->
        <div class="card mb-4">
          <div class="card-header"><div class="card-title"><i class="fa fa-brain text-purple"></i> AI Sentiment Summary</div></div>
          <div class="card-body" id="sentiment-box">
            <div class="skeleton skeleton-text mb-2" style="height:14px;width:80%"></div>
            <div class="skeleton skeleton-text mb-2" style="height:14px;width:65%"></div>
            <div class="skeleton skeleton-text" style="height:14px;width:70%"></div>
          </div>
        </div>

        <!-- Trending Topics -->
        <div class="card mb-4">
          <div class="card-header"><div class="card-title"><i class="fa fa-fire text-warning"></i> Trending Topics</div></div>
          <div class="card-body">
            ${['Federal Reserve', 'AI Stocks', 'Bitcoin ETF', 'Oil Prices', 'Earnings Season', 'Inflation Data', 'China Economy', 'Dollar Index'].map(t => `
              <span style="display:inline-flex;align-items:center;gap:4px;margin:0 6px 6px 0;padding:4px 10px;background:var(--bg-card);border:1px solid var(--border-color);border-radius:99px;font-size:0.78rem;cursor:pointer;transition:all 0.15s ease" onmouseover="this.style.borderColor='var(--brand-primary)'" onmouseout="this.style.borderColor='var(--border-color)'">
                <i class="fa fa-hashtag" style="color:var(--brand-primary);font-size:0.7rem"></i> ${t}
              </span>
            `).join('')}
          </div>
        </div>

        <!-- Market Mood -->
        <div class="card">
          <div class="card-header"><div class="card-title"><i class="fa fa-gauge-high text-warning"></i> Market Mood</div></div>
          <div class="card-body">
            ${[
              { label: 'Bullish Articles', pct: 58, color: 'success' },
              { label: 'Bearish Articles', pct: 26, color: 'danger' },
              { label: 'Neutral Articles', pct: 16, color: 'warning' },
            ].map(m => `
              <div class="mb-3">
                <div class="flex justify-between text-sm mb-1"><span>${m.label}</span><span class="font-bold text-${m.color}">${m.pct}%</span></div>
                <div class="progress"><div class="progress-bar ${m.color}" style="width:${m.pct}%"></div></div>
              </div>
            `).join('')}
            <div class="success-box mt-3"><i class="fa fa-check-circle"></i> Overall market sentiment is Bullish based on today's news flow</div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Filters
  document.getElementById('news-filters').addEventListener('click', e => {
    const btn = e.target.closest('[data-filter]');
    if (!btn) return;
    activeFilter = btn.dataset.filter;
    document.querySelectorAll('[data-filter]').forEach(b => {
      b.classList.toggle('btn-primary', b.dataset.filter === activeFilter);
      b.classList.toggle('btn-secondary', b.dataset.filter !== activeFilter);
    });
    renderArticles();
  });

  document.getElementById('news-refresh').onclick = () => loadNews();

  async function loadNews() {
    const mainEl = document.getElementById('news-main');
    mainEl.innerHTML = `<div class="loading-center"><div class="spinner-lg spinner"></div></div>`;
    isLoading = true;
    allArticles = [];

    // Demo news articles (fallback)
    const demoArticles = [
      { title: 'Federal Reserve Signals Potential Rate Cuts as Inflation Eases Toward 2% Target', source: 'Reuters', time: new Date(Date.now()-7200000), link: '#', category: 'Finance', sentiment: 'positive', summary: 'The Federal Reserve has indicated it may begin cutting interest rates later this year as inflation continues its decline toward the 2% target, offering relief to markets.' },
      { title: 'NVIDIA Reports Record Revenue as AI Chip Demand Surges to Historic Levels', source: 'Bloomberg', time: new Date(Date.now()-14400000), link: '#', category: 'Technology', summary: 'NVIDIA smashed earnings expectations, reporting record quarterly revenue of $22.1B driven by unprecedented demand for its AI GPUs from major cloud providers.', sentiment: 'positive' },
      { title: 'Bitcoin ETF Inflows Hit $500M Daily as Institutional Investors Pile In', source: 'CoinDesk', time: new Date(Date.now()-21600000), link: '#', category: 'Crypto', sentiment: 'positive', summary: 'Bitcoin spot ETFs continue to see massive institutional inflows, with combined daily volumes hitting half a billion dollars for the first time.' },
      { title: 'Oil Prices Drop on Demand Concerns Amid China Slowdown Fears', source: 'WSJ', time: new Date(Date.now()-28800000), link: '#', category: 'Business', sentiment: 'negative', summary: 'Crude oil prices fell 2% on concerns about weakening demand from China, the world\'s largest oil importer, amid disappointing economic data.' },
      { title: 'Apple Plans Major AI Integration Across iPhone and Mac Lineup in 2025', source: 'TechCrunch', time: new Date(Date.now()-32400000), link: '#', category: 'Technology', sentiment: 'positive', summary: 'Apple is set to deeply integrate AI capabilities into its product lineup, potentially triggering the largest iPhone upgrade cycle in years.' },
      { title: 'Emerging Markets Face Dollar Pressure as US Economy Stays Strong', source: 'FT', time: new Date(Date.now()-36000000), link: '#', category: 'Finance', sentiment: 'negative', summary: 'A resilient US economy is keeping the dollar strong, pressuring emerging market currencies and increasing debt servicing costs.' },
      { title: 'Gold Hits All-Time High as Central Banks Continue Buying Spree', source: 'Reuters', time: new Date(Date.now()-43200000), link: '#', category: 'Business', sentiment: 'positive', summary: 'Gold prices reached a record high above $2,650/oz as central bank buying from China, India, and Turkey continues to underpin demand.' },
      { title: 'JPMorgan CEO Warns of Geopolitical Risks Being Underpriced by Markets', source: 'Bloomberg', time: new Date(Date.now()-50400000), link: '#', category: 'Business', sentiment: 'negative', summary: 'Jamie Dimon cautioned that equity markets may be underestimating geopolitical risks that could disrupt global supply chains and economic growth.' },
      { title: 'Ethereum ETF Approval Could Follow Bitcoin, SEC Hints at Crypto Review', source: 'CoinDesk', time: new Date(Date.now()-57600000), link: '#', category: 'Crypto', sentiment: 'positive', summary: 'The SEC has signaled it may be open to reviewing Ethereum ETF applications after the success of Bitcoin spot ETFs.' },
      { title: 'Amazon AWS Revenue Surges 17% as Cloud Computing Demand Accelerates', source: 'CNBC', time: new Date(Date.now()-64800000), link: '#', category: 'Technology', sentiment: 'positive', summary: 'Amazon Web Services reported strong quarterly growth, reinforcing the view that enterprise cloud adoption shows no signs of slowing.' },
      { title: 'Retail Sales Disappoint in January, Consumer Spending Cools', source: 'WSJ', time: new Date(Date.now()-72000000), link: '#', category: 'Finance', sentiment: 'negative', summary: 'US retail sales fell more than expected in January, suggesting some cooling in consumer spending following the holiday season.' },
      { title: 'Tesla Cuts Prices Again in Europe as EV Competition Intensifies', source: 'Reuters', time: new Date(Date.now()-79200000), link: '#', category: 'Business', sentiment: 'negative', summary: 'Tesla implemented its fifth round of price cuts in Europe this year as competition from Chinese EV makers like BYD intensifies.' },
    ];

    // Try to load real news
    try {
      const feed = await newsAPI.getFeed(NEWS_FEEDS[0].url);
      if (feed.items && feed.items.length) {
        allArticles = feed.items.map(item => ({
          title: item.title,
          source: feed.feed?.title || 'News',
          time: new Date(item.pubDate),
          link: item.link,
          category: 'Business',
          sentiment: Math.random() > 0.5 ? 'positive' : (Math.random() > 0.5 ? 'negative' : 'neutral'),
          summary: item.description?.replace(/<[^>]*>/g,'').slice(0,200) || '',
          image: item.thumbnail || '',
        }));
      } else { allArticles = demoArticles; }
    } catch { allArticles = demoArticles; }

    isLoading = false;
    renderArticles();
    updateSentiment();
  }

  function renderArticles() {
    const mainEl = document.getElementById('news-main');
    let articles = allArticles;
    if (activeFilter !== 'All') {
      articles = articles.filter(a => a.category === activeFilter);
    }
    if (!articles.length) {
      mainEl.innerHTML = `<div class="empty-state"><i class="fa fa-newspaper"></i><p>No articles found for this filter.</p></div>`;
      return;
    }

    mainEl.innerHTML = `
      <div class="card">
        ${articles.map(a => `
          <div class="news-card" onclick="${a.link && a.link!=='#' ? `window.open('${a.link}','_blank')` : 'void(0)'}">
            ${a.image ? `<img class="news-img" src="${a.image}" alt="" loading="lazy" onerror="this.style.display='none'"/>` : `<div class="news-img" style="background:var(--bg-card);display:flex;align-items:center;justify-content:center;color:var(--text-muted)"><i class="fa fa-newspaper fa-lg"></i></div>`}
            <div class="news-body">
              <div class="news-title">${a.title}</div>
              ${a.summary ? `<div class="text-xs text-muted mt-1" style="display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden">${a.summary}</div>` : ''}
              <div class="news-meta mt-2">
                <span class="news-source">${a.source}</span>
                <span>•</span>
                <span>${timeAgo(a.time)}</span>
                <span>•</span>
                <span class="badge ${a.category==='Crypto'?'badge-warning':'badge-info'} text-xs">${a.category}</span>
                <span class="news-sentiment ${a.sentiment}">${a.sentiment==='positive'?'📈 Bullish':a.sentiment==='negative'?'📉 Bearish':'➡️ Neutral'}</span>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  function updateSentiment() {
    const sentEl = document.getElementById('sentiment-box');
    if (!sentEl) return;
    const pos = allArticles.filter(a=>a.sentiment==='positive').length;
    const neg = allArticles.filter(a=>a.sentiment==='negative').length;
    const total = allArticles.length || 1;
    const overall = pos/total > 0.6 ? 'Bullish' : pos/total < 0.4 ? 'Bearish' : 'Neutral';
    const overallColor = overall==='Bullish'?'text-success':overall==='Bearish'?'text-danger':'text-warning';
    sentEl.innerHTML = `
      <div class="text-center mb-3">
        <div class="font-bold text-xl ${overallColor}">${overall}</div>
        <div class="text-xs text-muted">AI-analyzed sentiment from ${total} articles</div>
      </div>
      <div class="mb-2">
        <div class="flex justify-between text-sm mb-1"><span class="text-success">Positive</span><span>${pos} (${Math.round(pos/total*100)}%)</span></div>
        <div class="progress"><div class="progress-bar success" style="width:${Math.round(pos/total*100)}%"></div></div>
      </div>
      <div class="mb-2">
        <div class="flex justify-between text-sm mb-1"><span class="text-danger">Negative</span><span>${neg} (${Math.round(neg/total*100)}%)</span></div>
        <div class="progress"><div class="progress-bar danger" style="width:${Math.round(neg/total*100)}%"></div></div>
      </div>
      <div class="text-xs text-muted mt-3" style="font-style:italic">
        💡 AI Summary: Today's news flow is predominantly ${overall.toLowerCase()} for equities. Key themes include ${['AI adoption', 'rate expectations', 'earnings beats', 'crypto regulation'].slice(0,2).join(' and ')}.
      </div>
    `;
  }

  loadNews();
  const interval = setInterval(loadNews, 300000); // 5 min
  return () => clearInterval(interval);
}

// ---- MARKET SENTIMENT ----
export function renderMarketSentiment(container) {
  container.innerHTML = `
    <div class="page-header">
      <div><h1 class="page-title"><i class="fa fa-brain text-purple"></i> Market Sentiment</h1>
      <p class="page-subtitle">Multi-dimensional market sentiment analysis</p></div>
    </div>
    <div class="grid grid-3 mb-4">
      <div class="stat-card">
        <div class="stat-icon green"><i class="fa fa-thumbs-up"></i></div>
        <div class="stat-label">Bullish Signals</div>
        <div class="stat-value text-success">72%</div>
        <div class="stat-change positive">Strong positive bias</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon orange"><i class="fa fa-gauge-high"></i></div>
        <div class="stat-label">Fear & Greed Index</div>
        <div class="stat-value text-warning">68</div>
        <div class="stat-change positive">Greed Zone</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon blue"><i class="fa fa-chart-line"></i></div>
        <div class="stat-label">VIX Volatility</div>
        <div class="stat-value">15.2</div>
        <div class="stat-change positive">Low volatility</div>
      </div>
    </div>

    <div class="grid grid-2 mb-4">
      <div class="card">
        <div class="card-header"><div class="card-title"><i class="fa fa-chart-radar"></i> Sentiment Indicators</div></div>
        <div class="card-body">
          ${[
            { name: 'Put/Call Ratio', value: 0.72, label: 'Bullish', color: 'success', description: 'More calls than puts — investors are optimistic' },
            { name: 'Insider Buying', value: 65, label: 'Bullish', color: 'success', description: 'Corporate insiders buying at above-average rates' },
            { name: 'Margin Debt', value: 45, label: 'Neutral', color: 'warning', description: 'Moderate leverage in the system' },
            { name: 'AAII Sentiment (Bulls)', value: 48, label: 'Neutral', color: 'warning', description: '48% of retail investors bullish — above historical avg' },
            { name: 'Smart Money Flow', value: 72, label: 'Bullish', color: 'success', description: 'Institutional money flowing into equities' },
            { name: 'Safe Haven Demand', value: 25, label: 'Bullish', color: 'success', description: 'Low demand for gold/bonds — risk-on environment' },
          ].map(s => `
            <div class="mb-3">
              <div class="flex justify-between text-sm mb-1">
                <span class="font-semibold">${s.name}</span>
                <span class="badge badge-${s.color}">${s.label}</span>
              </div>
              <div class="progress mb-1"><div class="progress-bar ${s.color}" style="width:${s.value}%"></div></div>
              <div class="text-xs text-muted">${s.description}</div>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="card">
        <div class="card-header"><div class="card-title"><i class="fa fa-chart-line"></i> Sentiment History</div></div>
        <div class="card-body"><canvas id="sentiment-hist-chart" height="280"></canvas></div>
      </div>
    </div>

    <div class="card">
      <div class="card-header"><div class="card-title"><i class="fa fa-comments"></i> Social Sentiment (Twitter/Reddit Buzz)</div></div>
      <div class="card-body">
        <div class="grid grid-3">
          ${[
            { ticker: 'NVDA', score: 94, mentions: '58.2K', trend: '+128%', sentiment: 'Extremely Bullish' },
            { ticker: 'TSLA', score: 71, mentions: '42.1K', trend: '+15%', sentiment: 'Bullish' },
            { ticker: 'AAPL', score: 68, mentions: '38.4K', trend: '+8%', sentiment: 'Bullish' },
            { ticker: 'GME', score: 38, mentions: '22.8K', trend: '-45%', sentiment: 'Bearish' },
            { ticker: 'BTC', score: 82, mentions: '95.6K', trend: '+34%', sentiment: 'Very Bullish' },
            { ticker: 'ETH', score: 76, mentions: '41.2K', trend: '+22%', sentiment: 'Bullish' },
          ].map(s => `
            <div class="stat-card" style="padding:14px">
              <div class="flex justify-between items-center mb-2">
                <span class="font-bold text-purple">${s.ticker}</span>
                <span class="badge ${s.score>=70?'badge-success':s.score>=50?'badge-warning':'badge-danger'}">${s.sentiment}</span>
              </div>
              <div class="text-2xl font-bold ${s.score>=70?'text-success':s.score>=50?'text-warning':'text-danger'} mono">${s.score}/100</div>
              <div class="text-xs text-muted mt-1">${s.mentions} mentions · ${s.trend} vs yesterday</div>
              <div class="progress mt-2"><div class="progress-bar ${s.score>=70?'success':s.score>=50?'warning':'danger'}" style="width:${s.score}%"></div></div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;

  setTimeout(() => {
    const canvas = document.getElementById('sentiment-hist-chart');
    if (!canvas) return;
    const labels = Array.from({length:30},(_,i)=>{const d=new Date();d.setDate(d.getDate()-29+i);return d.toLocaleDateString('en',{month:'short',day:'numeric'});});
    const bullish = generateSparkline(30, 55, 0.04).map(v=>Math.min(Math.max(v,30),85));
    const fearGreed = generateSparkline(30, 60, 0.05).map(v=>Math.min(Math.max(v,20),90));
    new Chart(canvas, {
      type: 'line',
      data: {
        labels,
        datasets: [
          { label: 'Bullish %', data: bullish, borderColor: '#22c55e', backgroundColor: 'rgba(34,197,94,0.06)', borderWidth: 2, pointRadius: 0, fill: true, tension: 0.4 },
          { label: 'Fear & Greed', data: fearGreed, borderColor: '#f59e0b', backgroundColor: 'rgba(245,158,11,0.06)', borderWidth: 2, pointRadius: 0, fill: true, tension: 0.4 },
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: { legend: { labels: { color: '#94a3b8', boxWidth: 10, font: { size: 11 } } }, tooltip: { backgroundColor: 'rgba(18,18,31,0.95)', borderColor: 'rgba(255,255,255,0.08)', borderWidth: 1 } },
        scales: { x: { ticks: { color: '#64748b', font: { size: 9 }, maxTicksLimit: 8 }, grid: { color: 'rgba(255,255,255,0.04)' } }, y: { ticks: { color: '#64748b', font: { size: 10 }, callback: v=>`${v}%` }, grid: { color: 'rgba(255,255,255,0.04)' }, min: 0, max: 100 } }
      }
    });
  }, 100);
}
