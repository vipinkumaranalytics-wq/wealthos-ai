// =====================================================
// WealthOS AI — AI Financial Advisor Chat
// =====================================================
import { toast, uid } from '../utils.js';

// Knowledge base for local AI responses
const KNOWLEDGE = {
  greetings: ['hello','hi','hey','good morning','good evening','start','help'],
  topics: {
    'stock market': `📈 **Stock Market Overview**\n\nThe stock market is where buyers and sellers trade shares of publicly listed companies.\n\n**Key Indices:**\n• S&P 500 — 500 largest US companies\n• Dow Jones (DJIA) — 30 blue-chip stocks\n• NASDAQ — tech-heavy index\n• NIFTY 50 — India's top 50 companies\n\n**Tips for beginners:**\n1. Start with index funds (low cost, diversified)\n2. Dollar-cost average — invest consistently\n3. Think long-term (5-10+ years)\n4. Never invest money you can't afford to lose`,

    'how to invest': `💰 **Getting Started with Investing**\n\n**Step-by-step guide:**\n\n1️⃣ **Emergency Fund First** — Save 3-6 months of expenses\n2️⃣ **Pay off high-interest debt** — Credit cards (15-25% APR) first\n3️⃣ **Open a brokerage account** — Zerodha, Groww, or Fidelity\n4️⃣ **Start with index funds** — Low cost, diversified exposure\n5️⃣ **Invest regularly** — Even ₹500 or $50 per month matters\n6️⃣ **Stay invested** — Time in the market beats timing the market\n\n**Rule of 72:** Divide 72 by your expected return rate to see how long it takes to double your money. At 12% returns: 72/12 = 6 years to double!`,

    'bitcoin': `₿ **Bitcoin Guide**\n\n**What is Bitcoin?**\nBitcoin (BTC) is the world's first and largest cryptocurrency by market cap. It's a decentralized digital currency with a fixed supply of 21 million coins.\n\n**Key Facts:**\n• Created in 2009 by Satoshi Nakamoto\n• Halving every ~4 years reduces supply\n• Store of value ("digital gold")\n• Highly volatile — 50%+ drawdowns are normal\n\n**Should you buy Bitcoin?**\n• Only invest what you can afford to lose\n• Consider 1-5% of portfolio allocation\n• Use dollar-cost averaging\n• Hold in a secure wallet if buying significant amounts\n\n⚠️ Bitcoin can drop 70-80% in bear markets. Be prepared.`,

    'portfolio': `📊 **Portfolio Building**\n\n**Diversified Portfolio by Risk Profile:**\n\n🟢 **Conservative (Low Risk)**\n• 60% Bonds/Fixed Income\n• 30% Blue-chip stocks\n• 10% Cash/Gold\n\n🟡 **Moderate (Medium Risk)**\n• 60% Stocks (index funds)\n• 30% Bonds\n• 10% Alternative assets\n\n🔴 **Aggressive (High Risk)**\n• 80% Stocks (growth + value)\n• 10% Crypto\n• 10% Alternative investments\n\n**Golden Rules:**\n• Diversify across sectors and geographies\n• Rebalance annually\n• Don't put all eggs in one basket`,

    'mutual fund': `🏦 **Mutual Funds Guide**\n\n**What are they?**\nA mutual fund pools money from many investors to invest in stocks, bonds, or other securities managed by professional fund managers.\n\n**Types:**\n• **Equity Funds** — Invest in stocks (higher risk, higher return)\n• **Debt Funds** — Invest in bonds (lower risk, stable)\n• **Hybrid Funds** — Mix of equity and debt\n• **Index Funds** — Track an index like NIFTY or S&P 500\n• **ELSS Funds** — Tax-saving equity funds (India)\n\n**SIP (Systematic Investment Plan):**\nInvest fixed amount monthly. Benefit from rupee-cost averaging and compounding.`,

    'tax': `📋 **Investment Tax Planning**\n\n**India:**\n• LTCG (>1 year stocks): 10% above ₹1L gain\n• STCG (<1 year stocks): 15%\n• ELSS: Deduction up to ₹1.5L under 80C\n• Debt funds held >3 years: 20% with indexation\n\n**US:**\n• Long-term capital gains (<20%): <1 year at income tax rate\n• Short-term gains: Taxed as ordinary income\n• 401(k)/IRA: Tax-advantaged retirement accounts\n\n**Tax-loss harvesting:**\nSell losing positions to offset gains and reduce your tax bill.\n\n⚠️ Consult a qualified tax professional for personalized advice.`,

    'etf': `📦 **ETF Explained**\n\n**What is an ETF?**\nAn Exchange-Traded Fund is like a basket of securities that trades on a stock exchange like a single stock.\n\n**Why ETFs are popular:**\n✅ Low cost (expense ratios as low as 0.03%)\n✅ Diversification in one trade\n✅ Tax efficient\n✅ Transparent holdings\n✅ Trade like stocks (buy/sell anytime)\n\n**Top ETFs by category:**\n• **S&P 500:** SPY, VOO, IVV\n• **Tech:** QQQ, XLK\n• **Bonds:** BND, AGG\n• **International:** VEU, EFA\n• **Gold:** GLD, IAU\n\n**vs Mutual Funds:** ETFs trade intraday, usually cheaper, no minimums.`,

    'recession': `⚠️ **Recession & Bear Market Guide**\n\nA recession is two consecutive quarters of negative GDP growth.\n\n**Signs of a coming recession:**\n• Inverted yield curve (2yr > 10yr Treasury)\n• Rising unemployment\n• Declining consumer confidence\n• Falling PMI below 50\n\n**How to protect your portfolio:**\n1. Hold more cash\n2. Shift to defensive sectors (utilities, healthcare, consumer staples)\n3. Consider gold and Treasury bonds\n4. Avoid excessive leverage\n5. Rebalance to your target allocation\n\n**Opportunity:** Recessions create buying opportunities. "Be greedy when others are fearful." — Warren Buffett`,

    'compound interest': `💎 **The Magic of Compound Interest**\n\nCompound interest is earning returns on your returns — the most powerful force in investing.\n\n**Formula:** A = P(1 + r)^t\n\n**Example: ₹10,000 invested at 12% annually:**\n• After 10 years: ₹31,058\n• After 20 years: ₹96,463\n• After 30 years: ₹2,99,599\n• After 40 years: ₹9,30,510\n\n🔑 **Key insight:** The LONGER you invest, the more explosive the growth. Starting at age 25 vs 35 can make a 3x difference by retirement.\n\n**Rule of 72:** At 12% returns, money doubles every 6 years.`,

    'budget': `💸 **Personal Budgeting Guide**\n\n**50/30/20 Rule:**\n• 50% Needs (rent, food, utilities)\n• 30% Wants (entertainment, dining out)\n• 20% Savings & Investments\n\n**Steps to build a budget:**\n1. Track all income sources\n2. List all monthly expenses\n3. Categorize (needs vs wants)\n4. Find areas to cut\n5. Automate savings\n\n**Practical Tips:**\n• Use apps like YNAB or Walnut\n• Review spending weekly\n• Set up auto-transfer to savings on payday\n• Use the "pay yourself first" principle`,

    'gold': `🥇 **Gold as an Investment**\n\nGold is a traditional safe haven asset that has preserved wealth for thousands of years.\n\n**Why investors hold gold:**\n• Hedge against inflation\n• Safe haven during market crashes\n• Portfolio diversification\n• Store of value\n\n**Ways to invest in gold:**\n• Physical gold (coins, bars)\n• Gold ETFs (GLD, SGB in India)\n• Gold mining stocks\n• Gold futures (advanced)\n\n**How much to hold?**\nFinancial advisors typically recommend 5-10% of portfolio in gold as a hedge.\n\n⚡ Gold doesn't generate income (no dividends) but protects against purchasing power erosion.`,

    'ipo': `🚀 **IPO Investing Guide**\n\nAn Initial Public Offering (IPO) is when a private company first offers shares to the public.\n\n**How to invest in IPOs:**\n1. Open a Demat account (India) or brokerage (US)\n2. Apply through ASBA (India) or brokerage\n3. Read the prospectus (DRHP) carefully\n4. Assess the company fundamentals\n5. Apply for only what you need\n\n**IPO Red Flags:**\n❌ No clear path to profitability\n❌ Promoters selling all their shares\n❌ Extremely high valuation vs peers\n❌ Complex business model\n❌ Short operating history\n\n**Statistics:** Only ~30-40% of IPOs outperform the market over 5 years. Be selective!`,
  }
};

function findResponse(userMsg) {
  const msg = userMsg.toLowerCase();

  // Greetings
  if (KNOWLEDGE.greetings.some(g => msg.includes(g))) {
    return `👋 **Hello! I'm your WealthOS AI Financial Advisor!**\n\nI can help you with:\n• 📈 Stock market analysis\n• ₿ Crypto education\n• 💰 Investment strategies\n• 📊 Portfolio building\n• 💸 Personal finance\n• 📋 Tax planning\n• 🏦 Mutual funds & ETFs\n\nWhat would you like to learn about today?`;
  }

  // Topic matching
  for (const [key, response] of Object.entries(KNOWLEDGE.topics)) {
    if (msg.includes(key)) return response;
  }

  // Context-based responses
  if (msg.includes('sip') || msg.includes('systematic')) {
    return `📅 **SIP (Systematic Investment Plan)**\n\nA SIP allows you to invest a fixed amount regularly (monthly/weekly) in mutual funds.\n\n**Benefits:**\n✅ Reduces timing risk (rupee-cost averaging)\n✅ Start with as little as ₹500/month\n✅ Automates investing discipline\n✅ Compounding over long term\n\n**SIP Calculator Example:**\nInvesting ₹5,000/month at 12% CAGR for 20 years = **₹49.96 lakhs**\n(Total invested: ₹12 lakhs | Returns: ₹37.96 lakhs)\n\nPlatforms: Zerodha Coin, Groww, Paytm Money, Kuvera`;
  }

  if (msg.includes('dividend')) {
    return `💰 **Dividend Investing**\n\nDividend investing focuses on stocks that pay regular cash dividends to shareholders.\n\n**Key metrics:**\n• **Dividend Yield** = Annual Dividend / Stock Price\n• **Payout Ratio** = Dividends / Earnings (keep below 70%)\n• **Dividend Growth Rate** = How fast dividends increase\n\n**Top dividend sectors:**\n• Utilities (stable, high yield)\n• Consumer staples (Procter & Gamble, Hindustan Unilever)\n• REITs (real estate investment trusts)\n• Financial sector\n\n**Strategy:** Focus on "Dividend Aristocrats" — companies that have increased dividends for 25+ consecutive years.`;
  }

  if (msg.includes('nifty') || msg.includes('sensex') || msg.includes('india')) {
    return `🇮🇳 **Indian Stock Market**\n\n**Key Indices:**\n• NIFTY 50 — NSE's top 50 companies\n• SENSEX — BSE's 30 blue-chip stocks\n• NIFTY Next 50 — The next tier\n• NIFTY Midcap 100 — Mid-cap stocks\n\n**How to invest:**\n1. Open Demat + Trading account (Zerodha, Groww, Angel One)\n2. Complete KYC with Aadhaar + PAN\n3. Start with NIFTY 50 index funds\n4. Consider ELSS for tax benefits\n\n**Key sectors in India:**\nIT, Banking, FMCG, Pharma, Energy, Telecom\n\n**Long-term thesis:** India is one of the fastest-growing major economies. The demographic dividend and rising middle class make it attractive for long-term investors.`;
  }

  if (msg.includes('risk') || msg.includes('safe')) {
    return `🛡️ **Risk Management in Investing**\n\n**Types of Investment Risk:**\n• **Market Risk** — Overall market decline\n• **Company Risk** — Single stock implosion\n• **Inflation Risk** — Purchasing power erosion\n• **Liquidity Risk** — Can't sell when needed\n• **Currency Risk** — For international investments\n\n**How to manage risk:**\n1. **Diversify** — Across assets, sectors, geographies\n2. **Asset Allocation** — Match to your risk tolerance\n3. **Emergency Fund** — 3-6 months expenses in cash\n4. **Stop-Loss Orders** — Limit downside on individual stocks\n5. **Regular Rebalancing** — Maintain target allocation\n6. **Never invest borrowed money** in volatile assets\n\n**Time heals most risk:** The S&P 500 has never had a negative 20-year rolling return.`;
  }

  if (msg.includes('retire') || msg.includes('retirement') || msg.includes('pension')) {
    return `🏖️ **Retirement Planning Guide**\n\n**The 4% Rule:**\nYou can safely withdraw 4% of your portfolio annually in retirement. To retire on $50,000/year, you need $1.25M.\n\n**Retirement Vehicles:**\n\n🇮🇳 **India:**\n• NPS (National Pension System) — tax benefits\n• PPF (Public Provident Fund) — guaranteed 7.1%\n• EPF (Employee Provident Fund) — employer match\n• ELSS mutual funds\n\n🇺🇸 **US:**\n• 401(k) — Employer match is free money!\n• IRA/Roth IRA — Tax-advantaged\n• Social Security — Factor in but don't rely on\n\n**Retirement Number Formula:**\nAnnual expenses × 25 = Target retirement corpus\n\n**Start NOW:** Every 10-year delay roughly halves your retirement corpus.`;
  }

  if (msg.includes('crypto') || msg.includes('cryptocurrency') || msg.includes('blockchain')) {
    return `🔗 **Cryptocurrency Guide**\n\n**What is Crypto?**\nDigital currencies secured by cryptography on blockchain networks.\n\n**Top Cryptocurrencies:**\n• **Bitcoin (BTC)** — Store of value, digital gold\n• **Ethereum (ETH)** — Smart contracts platform\n• **Solana (SOL)** — High-speed blockchain\n• **BNB** — Binance ecosystem\n• **XRP** — Cross-border payments\n\n**Risk Warning:**\n• Crypto is extremely volatile\n• Regulatory risk is real\n• Never invest more than you can afford to lose\n• Use cold wallets for large holdings\n\n**Recommended allocation:** 1-10% of portfolio for most investors\n\n**Platforms:** Coinbase, Binance, WazirX (India)`;
  }

  if (msg.includes('pe ratio') || msg.includes('p/e') || msg.includes('valuation')) {
    return `📊 **Stock Valuation Metrics**\n\n**P/E Ratio (Price-to-Earnings):**\nHow much you pay for $1 of earnings. Lower = cheaper.\n• Under 15: Potentially cheap\n• 15-25: Fair value\n• Over 30: Growth premium (or expensive)\n\n**Other Key Ratios:**\n• **P/B** (Price-to-Book): Compare to assets\n• **EV/EBITDA**: Enterprise value vs operating profit\n• **PEG Ratio**: P/E adjusted for growth\n• **ROE**: Return on Equity (higher is better)\n• **Debt/Equity**: How leveraged is the company\n• **Free Cash Flow Yield**: Cash generation vs market cap\n\n**Warren Buffett's approach:** Find great companies at fair prices. Focus on sustainable competitive advantages (moats).`;
  }

  // Default intelligent response
  const defaultResponses = [
    `🤔 Great question! Let me help with that.\n\nI'm your WealthOS AI advisor. I can explain concepts like:\n• Stock investing & analysis\n• Crypto markets\n• Portfolio strategies\n• Mutual funds & ETFs\n• Tax planning\n• Personal budgeting\n• Retirement planning\n\nTry asking: "How do I start investing?" or "Explain P/E ratio" or "What is Bitcoin?"`,
    `💡 I'd be happy to help with that!\n\nAs your AI financial advisor, I can provide educational guidance on:\n• **Markets**: Stocks, crypto, forex, commodities\n• **Analysis**: Fundamental & technical analysis basics\n• **Planning**: Budget, goals, retirement\n• **Products**: Mutual funds, ETFs, bonds\n\nRemember: This is educational content only. For personalized advice, consult a SEBI-registered financial advisor.\n\nWhat specific topic would you like to explore?`,
  ];

  return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
}

// Format markdown-like text to HTML
function formatMessage(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code style="background:rgba(99,102,241,0.15);padding:1px 5px;border-radius:3px;font-family:monospace">$1</code>')
    .replace(/^• /gm, '<span style="color:var(--brand-primary)">•</span> ')
    .replace(/^(\d+️⃣|✅|❌|⚠️|💡|🔑|🔴|🟡|🟢|📈|📉|💰|₿|📊|💸|📋|🏦|🚀|🛡️|🏖️|🇮🇳|🇺🇸|🔗|🤔)/gm, '<span style="font-size:1.1em">$1</span>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br/>');
}

export function renderAIChat(container) {
  const SUGGESTIONS = [
    'How do I start investing?', 'Explain Bitcoin', 'Build me a portfolio',
    'What is a mutual fund?', 'Tax saving tips', 'Explain compound interest',
    'What is a P/E ratio?', 'How to retire early?', 'Crypto vs stocks',
  ];

  let messages = [
    {
      id: 'welcome', role: 'ai',
      content: `👋 **Welcome to WealthOS AI Advisor!**\n\nI'm your personal AI financial mentor powered by a comprehensive financial knowledge base.\n\nI can help you:\n• 📈 Understand markets and investing\n• 💰 Build wealth strategies\n• 📊 Analyze your portfolio\n• 🏦 Explore financial products\n• 📋 Plan for retirement & taxes\n\nAsk me anything about finance, investing, or personal wealth management!\n\n*Disclaimer: Educational content only. Not personalized financial advice. Consult a licensed advisor for personal recommendations.*`
    }
  ];

  container.innerHTML = `
    <div class="page-header">
      <div><h1 class="page-title"><i class="fa fa-robot text-purple"></i> AI Financial Advisor</h1>
      <p class="page-subtitle">Your intelligent financial mentor — powered by AI</p></div>
      <div class="page-actions">
        <button class="btn btn-secondary btn-sm" id="ai-clear"><i class="fa fa-trash"></i> Clear Chat</button>
        <button class="btn btn-secondary btn-sm" id="ai-export"><i class="fa fa-download"></i> Export</button>
      </div>
    </div>
    <div class="chat-container" style="height:calc(100vh - 220px)">
      <div class="chat-messages" id="chat-messages"></div>
      <div class="chat-suggestions" id="chat-suggestions">
        ${SUGGESTIONS.map(s=>`<button class="chat-suggestion">${s}</button>`).join('')}
      </div>
      <div class="chat-input-row">
        <div class="chat-input-wrap">
          <textarea id="chat-input" class="chat-input" placeholder="Ask anything about investing, markets, crypto..." rows="1"></textarea>
        </div>
        <button class="chat-send-btn" id="chat-send" title="Send"><i class="fa fa-paper-plane"></i></button>
        <button class="icon-btn" id="chat-voice" title="Voice Input"><i class="fa fa-microphone"></i></button>
      </div>
    </div>
  `;

  const messagesEl = document.getElementById('chat-messages');
  const inputEl = document.getElementById('chat-input');
  const sendBtn = document.getElementById('chat-send');

  function renderMessages() {
    messagesEl.innerHTML = messages.map(m => `
      <div class="chat-msg ${m.role}">
        <div class="msg-avatar ${m.role}">
          ${m.role === 'ai' ? '<i class="fa fa-robot"></i>' : store_getUserInitial()}
        </div>
        <div class="msg-bubble">
          <p>${formatMessage(m.content)}</p>
        </div>
      </div>
    `).join('');
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function store_getUserInitial() {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{"initials":"R"}');
      return user.initials || 'R';
    } catch { return 'R'; }
  }

  async function sendMessage() {
    const text = inputEl.value.trim();
    if (!text) return;

    messages.push({ id: uid('m'), role: 'user', content: text });
    inputEl.value = '';
    inputEl.style.height = 'auto';
    renderMessages();

    // Add typing indicator
    const typingId = uid('t');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'chat-msg ai';
    typingDiv.id = typingId;
    typingDiv.innerHTML = `
      <div class="msg-avatar ai"><i class="fa fa-robot"></i></div>
      <div class="msg-bubble">
        <div class="typing-indicator">
          <div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>
        </div>
      </div>
    `;
    messagesEl.appendChild(typingDiv);
    messagesEl.scrollTop = messagesEl.scrollHeight;

    // Simulate thinking delay
    await new Promise(r => setTimeout(r, 800 + Math.random() * 1200));

    // Generate response
    const response = findResponse(text);
    typingDiv.remove();
    messages.push({ id: uid('m'), role: 'ai', content: response });
    renderMessages();

    // Hide suggestions after first user message
    const suggs = document.getElementById('chat-suggestions');
    if (suggs && messages.filter(m=>m.role==='user').length >= 1) {
      suggs.style.display = 'none';
    }
  }

  // Send on button click
  sendBtn.addEventListener('click', sendMessage);

  // Send on Enter (Shift+Enter = newline)
  inputEl.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  });

  // Auto-resize textarea
  inputEl.addEventListener('input', () => {
    inputEl.style.height = 'auto';
    inputEl.style.height = Math.min(inputEl.scrollHeight, 120) + 'px';
  });

  // Suggestions
  document.querySelectorAll('.chat-suggestion').forEach(btn => {
    btn.addEventListener('click', () => {
      inputEl.value = btn.textContent;
      sendMessage();
    });
  });

  // Clear chat
  document.getElementById('ai-clear').onclick = () => {
    messages = [messages[0]]; // Keep welcome message
    renderMessages();
    document.getElementById('chat-suggestions').style.display = '';
    toast('Chat cleared', 'info');
  };

  // Export chat
  document.getElementById('ai-export').onclick = () => {
    const text = messages.map(m => `[${m.role.toUpperCase()}]: ${m.content}`).join('\n\n---\n\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'wealthos-ai-chat.txt';
    a.click(); URL.revokeObjectURL(url);
    toast('Chat exported!', 'success');
  };

  // Voice input
  document.getElementById('chat-voice').onclick = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast('Voice not supported in this browser', 'warning'); return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.onresult = e => { inputEl.value = e.results[0][0].transcript; };
    recognition.onerror = () => toast('Voice recognition error', 'error');
    recognition.start();
    toast('Listening... Speak now!', 'info', 3000);
  };

  renderMessages();
}
