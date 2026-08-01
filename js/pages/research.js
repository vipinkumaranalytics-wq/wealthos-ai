// =====================================================
// WealthOS AI — Global Research Intelligence (Country-Aware + Drill-Down)
// =====================================================

// ---- Country-specific research data ----
const COUNTRY_RESEARCH = {

  IN: {
    label: '🇮🇳 India', color: '#f97316',
    summary: {
      gdp: '$3.9T', growth: '+6.8%', inflation: '4.9%', rank: 1, score: 9.2,
      headline: 'India is the world\'s fastest-growing major economy. Young demographics (avg age 28), booming IT exports ($217B), manufacturing push via PLI schemes, and UPI digital revolution make it the top emerging market bet for 2025–2035.',
      bestFor: 'IT Services, Pharma, Manufacturing, Renewables, FMCG, Banking',
      avoid: 'Pure exporters exposed to INR depreciation, overleveraged PSU companies',
      topRec: [
        { type: '🏆 Best Stock', pick: 'Reliance Industries (RELIANCE)', why: 'Jio+Retail+Green Energy triad. India\'s largest company. Mukesh Ambani vision. $220B mkt cap.', score: '9.0/10' },
        { type: '🏭 Best Industry', pick: 'IT Services + AI', why: 'TCS, Infosys, Wipro benefiting from AI transformation projects. $217B annual exports. Growing.', score: '9.2/10' },
        { type: '📦 Best Product', pick: 'Pharma Generics + API', why: 'India = world\'s pharmacy. 20% of global generic exports. US patent cliffs = $200B opportunity.', score: '8.8/10' },
        { type: '💎 Long-term (10yr)', pick: 'India IT + Infra + Renewables', why: 'India becomes $10T economy by 2035. Infrastructure investment of $1.4T. 500GW renewable target.', score: '9.5/10' },
      ]
    },
    companies: [
      { sym: 'RELIANCE', name: 'Reliance Industries', sector: 'Conglomerate', rating: 'STRONG BUY', score: 9.0,
        rev: '₹9.74L Cr', profit: '₹69,621 Cr', margin: '7.2%', mktCap: '₹19.9L Cr', growth: '+12%',
        moat: 'India\'s largest company. Jio (500M telecom users = India\'s largest). Reliance Retail (India\'s #1 retailer). Jamnagar = world\'s largest single-site refinery. Chairman Mukesh Ambani = vision & execution.',
        risks: 'Succession planning, green energy capex delays, oil price volatility, FMCG competition',
        future: 'Jio Financial Services (NBFC + insurance), Green Hydrogen (₹75,000 Cr investment), New Energy (solar cells, batteries), Global retail expansion',
        financials: { pe: '28x', pb: '2.1x', roe: '9%', debt: 'Medium', dividend: '0.3%', eps: '₹98', target: '₹3,500' },
        desc: 'India\'s most valuable conglomerate. Founded by Dhirubhai Ambani in 1966. Revenue spans petrochemicals (O2C), retail (Reliance Retail), telecom (Jio) and new energy. Mukesh Ambani is India\'s richest person ($120B net worth).'
      },
      { sym: 'TCS', name: 'Tata Consultancy Services', sector: 'IT Services', rating: 'BUY', score: 8.8,
        rev: '₹2.41L Cr', profit: '₹46,099 Cr', margin: '19.1%', mktCap: '₹13.8L Cr', growth: '+8%',
        moat: 'India\'s largest IT company. 600K+ employees. Serves Fortune 500 globally. Part of TATA Group (most trusted brand in India). Long-term multi-year contracts. Revenue visibility excellent.',
        risks: 'US recession risk (cuts IT budgets), immigration policy (US H1-B visa), wage inflation, AI automation replacing some IT work',
        future: 'AI-led IT services (TCS AI Cloud), Generative AI projects for clients, Hiring freeze lifting as AI demand grows, US + Europe expansion',
        financials: { pe: '30x', pb: '13x', roe: '52%', debt: 'Zero', dividend: '2.1%', eps: '₹127', target: '₹4,500' },
        desc: 'India\'s IT flagship. Founded 1968, went public 2004. Provides software development, testing, consulting & BPO to 150+ countries. Revenue: $29B+. Clients: Apple, Google, Walmart, Airbus, ABN AMRO. Part of TATA Group.'
      },
      { sym: 'HDFCBANK', name: 'HDFC Bank', sector: 'Private Banking', rating: 'BUY', score: 8.7,
        rev: '₹1.66L Cr (NII)', profit: '₹60,812 Cr', margin: '37%', mktCap: '₹12.4L Cr', growth: '+18%',
        moat: 'India\'s largest private bank. Known for ZERO bad loans culture. Best NPA ratios in industry. 8,738 branches. Digital leadership (HDFC Bank app = India\'s most used banking app).',
        risks: 'Integration of HDFC merger (complete), margin pressure from rate cycle, rising credit costs, competition from fintechs',
        future: 'Rural banking expansion, Home loan growth (HDFC Ltd merged), MSME lending push, 3000+ new branches planned',
        financials: { pe: '18x', pb: '2.8x', roe: '17%', debt: 'N/A (bank)', dividend: '1.4%', eps: '₹92', target: '₹2,100' },
        desc: 'India\'s most trusted private bank. Founded 1994. Consistently voted India\'s best bank. 8,738 branches, 21,163 ATMs. Completed merger with HDFC Ltd (India\'s largest housing finance company) in 2023. Credit card leader.'
      },
      { sym: 'INFY', name: 'Infosys', sector: 'IT Services', rating: 'BUY', score: 8.5,
        rev: '₹1.53L Cr', profit: '₹26,248 Cr', margin: '17.1%', mktCap: '₹6.6L Cr', growth: '+5%',
        moat: 'India\'s 2nd largest IT. Strong AI + cloud expertise. Cobalt cloud platform. 100+ Fortune 500 clients. Narayana Murthy legacy — gold standard governance.',
        risks: 'Slower deal ramp-up, US macro sensitivity, CEO transitions, competition from TCS/Wipro/Accenture',
        future: 'Generative AI: Infosys Topaz platform, US government contracts, European expansion, AI-led cost optimization for global clients',
        financials: { pe: '26x', pb: '7x', roe: '32%', debt: 'Zero', dividend: '2.8%', eps: '₹61', target: '₹1,900' },
        desc: 'Founded 1981 by Narayana Murthy with ₹10,000. India\'s IT success story. Provides consulting, technology, and outsourcing to 50+ countries. Revenue: $18.5B. Known for world-class campus, ethical governance, and consistent growth.'
      },
      { sym: 'ICICIBANK', name: 'ICICI Bank', sector: 'Private Banking', rating: 'STRONG BUY', score: 8.9,
        rev: '₹1.32L Cr (NII)', profit: '₹44,869 Cr', margin: '34%', mktCap: '₹8.4L Cr', growth: '+28%',
        moat: 'India\'s fastest-growing large private bank. Sandeep Bakhshi\'s transformation — from distressed PSU-like bank to India\'s best-run lender. iMobile Pay = India\'s best banking app. Technology-first culture.',
        risks: 'Retail credit cycle risks, competition from HDFC Bank, international operations (UK, Canada, US)',
        future: 'MSME lending ($50B opportunity), Merchant acquiring, Embedded finance, API banking ecosystem',
        financials: { pe: '19x', pb: '3.5x', roe: '18%', debt: 'N/A', dividend: '1.0%', eps: '₹63', target: '₹1,500' },
        desc: 'India\'s 2nd largest private bank by assets. Founded 1994. Completely transformed under CEO Sandeep Bakhshi (2018–present) — clean balance sheet, digital-first, consistent ROE improvement. Ranked India\'s most admired bank 2024.'
      },
      { sym: 'BAJFINANCE', name: 'Bajaj Finance', sector: 'NBFC / Consumer Finance', rating: 'BUY', score: 8.6,
        rev: '₹55,127 Cr', profit: '₹14,451 Cr', margin: '26%', mktCap: '₹4.3L Cr', growth: '+28%',
        moat: 'India\'s most valuable NBFC. Consumer durables financing (zero-cost EMI). 88M customers. 3700 products offered on Bajaj EMI cards. Fastest customer acquisition in India\'s financial services.',
        risks: 'Consumer credit stress in unsecured loans, RBI regulatory scrutiny, rising NPA in microfinance',
        future: 'Bajaj Housing Finance IPO, International expansion, Insurance distribution, 150M customer target by 2027',
        financials: { pe: '29x', pb: '5.2x', roe: '22%', debt: 'High (by nature)', dividend: '0.5%', eps: '₹233', target: '₹8,500' },
        desc: 'India\'s most profitable NBFC. Started as consumer durable financier at Bajaj showrooms. Now: consumer loans, SME loans, home loans, insurance. Raj Vikash Verma (Sanjiv Bajaj group). India\'s leading FinTech-NBFC hybrid.'
      },
      { sym: 'LT', name: 'Larsen & Toubro (L&T)', sector: 'Engineering & Infrastructure', rating: 'STRONG BUY', score: 8.8,
        rev: '₹2.21L Cr', profit: '₹13,059 Cr', margin: '5.9%', mktCap: '₹4.9L Cr', growth: '+22%',
        moat: 'India\'s premier engineering company. Executes India\'s biggest infrastructure projects (metros, defense, power, nuclear). ₹5L Cr order book = 3 years of revenue visibility. Defense contracts (Arjun tank, INS Vikrant).',
        risks: 'Execution delays, raw material cost, government payment delays, high working capital',
        future: 'Middle East infra boom ($500B projects in UAE/Saudi), India infra (NIP = ₹111L Cr), Green hydrogen EPC, Defense exports',
        financials: { pe: '35x', pb: '4.8x', roe: '14%', debt: 'Medium', dividend: '1.2%', eps: '₹102', target: '₹4,200' },
        desc: 'India\'s engineering giant. Founded 1938 by Danish engineers in Mumbai. Built India\'s first reactor, metro systems, airports, ISRO launchpads, aircraft carriers. CEO SN Subrahmanyan. 50,000+ projects delivered. Global presence in 30+ countries.'
      },
      { sym: 'SUNPHARMA', name: 'Sun Pharmaceutical', sector: 'Pharmaceuticals', rating: 'BUY', score: 8.4,
        rev: '₹50,100 Cr', profit: '₹10,127 Cr', margin: '20.2%', mktCap: '₹4.2L Cr', growth: '+11%',
        moat: 'India\'s largest pharma company. #1 in specialty pharma. USA = 30% revenue (USFDA-approved). Dermatology specialty brand (Ilumya, Cequa). 45 manufacturing plants globally. 1800+ product registrations in US alone.',
        risks: 'USFDA inspection risks, pricing pressure in generics USA, Dilip Shanghvi succession',
        future: 'Specialty pharma growth (derma, ophthalmology), India chronic disease market, Biosimilars, Japan expansion',
        financials: { pe: '38x', pb: '6.8x', roe: '19%', debt: 'Low', dividend: '0.7%', eps: '₹42', target: '₹2,100' },
        desc: 'India\'s most valuable pharma company. Founded 1983 by Dilip Shanghvi (net worth $24B) with ₹10,000. World\'s 4th largest specialty generic pharma company. 40% revenue from branded generics in India. Present in 100+ countries.'
      },
    ],
    industries: [
      { icon:'💻', name:'IT & Software Services', size:'$254B (2024)', size2030:'$500B', cagr:'15%', score:9.5,
        drivers:'AI transformation projects globally, cloud migration, digital banking, US + Europe client growth. India has 60% of world\'s ISO-certified software companies.',
        risks:'US recession cuts IT budgets, AI automation replacing junior developers, visa restrictions (H1-B)',
        govSupport:'India IT exports exempted from GST. SEZ benefits. National AI Mission $1.25B. DigiLocker, UPI driving domestic IT demand.',
        topCos:'TCS, Infosys, Wipro, HCLTech, Tech Mahindra, LTIMindtree, Mphasis, Persistent',
        invest:'Large-cap IT (TCS, Infosys) for stability; Mid-cap (Persistent, Mphasis) for growth; AI-native IT services companies'
      },
      { icon:'💊', name:'Pharmaceuticals & Generics', size:'$55B domestic + $28B exports', size2030:'$130B', cagr:'13%', score:9.0,
        drivers:'India = world\'s pharmacy (20% global generic exports). US patent cliff ($200B+ drugs going off-patent). China API alternative demand. Domestic chronic disease burden growing.',
        risks:'USFDA 483 observations/import alerts, pricing pressure in USA, API supply chain from China, currency risk',
        govSupport:'PLI scheme ₹15,000 Cr for pharma. Bulk drug parks. DPCO (price control) risk. Pharma Vision 2047 target $300B.',
        topCos:'Sun Pharma, Cipla, Dr. Reddy\'s, Zydus, Aurobindo, Divi\'s Laboratories, Biocon',
        invest:'API manufacturers (Divi\'s, Laurus), Specialty pharma (Sun, Cipla), Biosimilars (Biocon)'
      },
      { icon:'⚡', name:'Renewable Energy', size:'$20B investments/yr', size2030:'$80B+', cagr:'22%', score:9.2,
        drivers:'India 500GW renewable target by 2030. Solar = cheapest power. Modi government massive push. 100GW+ solar, 60GW wind needed. Green hydrogen export ambition.',
        risks:'Land acquisition delays, grid integration, module import dependency on China, financing costs',
        govSupport:'PLI for solar modules ₹24,000 Cr. PM-Kusum (farm solar). ISTS waiver. National Green Hydrogen Mission $2.3B.',
        topCos:'Adani Green, NTPC Renewables, Torrent Power, Tata Power, JSW Energy, Azure Power, ReNew Power',
        invest:'Adani Green (scale), NTPC Renewables (PSU safety), Green hydrogen pure-plays, Solar equipment makers'
      },
      { icon:'🏦', name:'Banking & Financial Services (BFSI)', size:'$2.7T total assets', size2030:'$6T+', cagr:'16%', score:9.0,
        drivers:'India\'s credit-to-GDP ratio only 54% (vs 190% China). 500M unbanked/under-banked. UPI revolution. Home loan demand from urbanization. MSME credit gap $530B.',
        risks:'Consumer credit stress (unsecured loans), NBFC sector risks, RBI regulations, deposit growth lagging',
        govSupport:'RBI reforms. Jan Dhan Yojana (500M bank accounts). MUDRA loans for MSMEs. Digital banking push.',
        topCos:'HDFC Bank, ICICI Bank, SBI, Axis Bank, Kotak Mahindra, Bajaj Finance, Chola Finance',
        invest:'ICICI Bank (best growth), Bajaj Finance (consumer finance king), Small Finance Banks (SFB)'
      },
      { icon:'🏗️', name:'Infrastructure & Construction', size:'₹111L Cr NIP (Nat\'l Infra Pipeline)', size2030:'₹150L Cr', cagr:'18%', score:8.8,
        drivers:'PM Gati Shakti (national infra master plan), 25 new metro projects, 100 smart cities, highway construction (50km/day), airports (100 new/upgraded), defense indigenization.',
        risks:'Land acquisition, delayed payments from government, raw material cost (steel, cement), skilled labor',
        govSupport:'Capex ₹11L Cr (FY25 budget), NIP pipeline, Make in India, defense PLI. National Logistics Policy.',
        topCos:'L&T, Adani Ports, IRB Infrastructure, PNC Infratech, HG Infra, Kalpataru, NCC Limited',
        invest:'L&T (blue chip), Adani Ports (monopoly), Mid-cap road BOT companies'
      },
      { icon:'🚗', name:'Automobile & EV', size:'$220B (2024)', size2030:'$500B', cagr:'17%', score:8.5,
        drivers:'India = 3rd largest auto market. Two-wheeler EV revolution (Ola, TVS, Hero). Passenger EV (Tata Nexon EV #1). PLI for EV components. Youth income rising.',
        risks:'EV charging infra lag, battery import cost, Maruti\'s late EV entry, competition from China OEMs',
        govSupport:'FAME-II scheme. PLI ₹25,938 Cr for auto + EV. Production subsidy for electric 2-wheelers. GST reduction on EVs (5%).',
        topCos:'Tata Motors, Maruti Suzuki, M&M, Bajaj Auto, TVS Motor, Ola Electric, Hero MotoCorp',
        invest:'Tata Motors (EV + JLR turnaround), M&M (tractor + EV), Ola Electric (pure EV play)'
      },
    ],
    trade: {
      exports: { total: '$776B', topItems: [
        { name: '💻 IT & Software Services', value: '$217B', pct: 28, trend: '+12% YoY', note: 'India\'s biggest forex earner. TCS, Infosys, Wipro, HCL exports to USA/Europe' },
        { name: '⛽ Petroleum Products', value: '$109B', pct: 14, trend: '+5%', note: 'Refined oil re-exported. Reliance Jamnagar refinery is world\'s largest' },
        { name: '💊 Pharmaceuticals', value: '$62B', pct: 8, trend: '+9%', note: 'Generic drugs, APIs. India = pharmacy of the world. 200+ countries supplied' },
        { name: '💎 Gems & Jewellery', value: '$54B', pct: 7, trend: '-3%', note: 'Surat diamond cutting & polishing, Mumbai gold jewellery. Demand soft in 2024' },
        { name: '👗 Textiles & Apparel', value: '$54B', pct: 7, trend: '+6%', note: 'Cotton, synthetic yarn, ready-made garments. Tirupur, Surat, Ludhiana clusters' },
        { name: '⚙️ Engineering Goods', value: '$70B', pct: 9, trend: '+11%', note: 'Machinery, auto components, steel, capital goods. Fastest growing export' },
        { name: '🌾 Agriculture & Food', value: '$54B', pct: 7, trend: '+4%', note: 'Rice (world\'s #1 exporter), spices, sugar, buffalo meat, seafood' },
      ], topDest: [
        { country: '🇺🇸 USA', pct: 18, value: '$140B', trend: '⬆️ Growing' },
        { country: '🇦🇪 UAE', pct: 7, value: '$54B', trend: '⬆️ Growing' },
        { country: '🇳🇱 Netherlands', pct: 5, value: '$39B', trend: '→ Stable' },
        { country: '🇨🇳 China', pct: 4, value: '$31B', trend: '⬇️ Declining' },
        { country: '🇬🇧 UK', pct: 3, value: '$23B', trend: '⬆️ FTA boost' },
      ]},
      imports: { total: '$1.026T', topItems: [
        { name: '🛢️ Crude Oil & Petroleum', value: '$277B', pct: 27, trend: '+18% (Russia oil cheap)', note: 'India imports 85% of oil needs. Iraq, Saudi, Russia = top sources. Price sensitive.' },
        { name: '📱 Electronics & Components', value: '$185B', pct: 18, trend: '+15%', note: 'Smartphones, telecom equipment, computers, semiconductors — mainly from China' },
        { name: '🥇 Gold & Precious Metals', value: '$72B', pct: 7, trend: '+30%', note: 'India = world\'s 2nd largest gold consumer. Festivals, weddings, investment demand' },
        { name: '🧪 Chemicals', value: '$72B', pct: 7, trend: '+8%', note: 'Organic chemicals, APIs from China, plastics, fertilizers' },
        { name: '⚫ Coal & Minerals', value: '$62B', pct: 6, trend: '+5%', note: 'Power plants need coal. India trying to reduce but still dependent' },
        { name: '🌱 Edible Oils', value: '$31B', pct: 3, trend: '-5%', note: 'Palm oil from Indonesia/Malaysia. Sunflower from Ukraine (disrupted by war)' },
      ], topSrc: [
        { country: '🇨🇳 China', pct: 15, value: '$154B', trend: '⚠️ Dependency risk' },
        { country: '🇷🇺 Russia', pct: 7, value: '$72B', trend: '⬆️ Oil imports surge post-2022' },
        { country: '🇦🇪 UAE', pct: 6, value: '$62B', trend: '→ Stable' },
        { country: '🇺🇸 USA', pct: 5, value: '$51B', trend: '⬆️ Growing' },
        { country: '🇮🇶 Iraq', pct: 5, value: '$51B', trend: '→ Oil supplier' },
      ]},
      balance: '-$250B', note: 'Trade deficit mainly due to oil & electronics. Manageable given strong FX reserves ($650B+) and IT services income.'
    },
  },

  US: {
    label: '🇺🇸 United States', color: '#3b82f6',
    summary: {
      gdp: '$28.8T', growth: '+2.5%', inflation: '3.1%', rank: 2, score: 9.0,
      headline: 'World\'s largest economy and unrivaled AI/tech leader. Dollar dominance, deepest capital markets, and AI supercycle make USA the best developed market for 1–5 year investments.',
      bestFor: 'AI, Cloud, Defense, Biotech, Finance, Consumer Tech',
      avoid: 'Interest rate sensitive sectors (REITs, utilities) until rate cuts complete',
      topRec: [
        { type: '🏆 Best Stock', pick: 'NVIDIA (NVDA)', why: '80%+ AI chip market. Blackwell GPU supercycle. $83B revenue, 55% margin. AI\'s most essential company.', score: '9.9/10' },
        { type: '🏭 Best Industry', pick: 'Artificial Intelligence', why: 'NVDA, MSFT, GOOGL, AMZN spending $200B+ on AI capex in 2025. Every company is an AI buyer.', score: '9.8/10' },
        { type: '📦 Best Product', pick: 'AI Software & APIs', why: 'OpenAI, Anthropic, Mistral. Every enterprise buying AI. SaaS + AI = highest margins.', score: '9.5/10' },
        { type: '💎 Long-term (10yr)', pick: 'US Tech + AI + Biotech', why: 'Innovation hub. First-mover in AI. Dollar-denominated assets. GLP-1 drugs = healthcare revolution.', score: '9.2/10' },
      ]
    },
    companies: [
      { sym: 'NVDA', name: 'NVIDIA Corp', sector: 'AI Chips', rating: 'STRONG BUY', score: 9.9, rev: '$83B', profit: '$46B', margin: '55%', mktCap: '$3.3T', growth: '+122%', moat: '80%+ AI GPU market share. CUDA ecosystem has 15M developers — impossible to switch. H100/H200/Blackwell GPUs used by every major AI lab.', risks: 'AMD/Intel competition, China export restrictions, customer concentration (top 5 = 40% revenue)', future: 'Blackwell GPU (2024–2025 supercycle), AI inference market, robotics (Isaac platform), sovereign AI (governments buying own GPUs)', financials: { pe: '35x', pb: '30x', roe: '91%', debt: 'Very Low', dividend: '0.03%', eps: '$1.92', target: '$165' }, desc: 'Founded 1993 by Jensen Huang. Pivoted from gaming GPUs to AI chips. H100 GPU = $30,000 each, 12-month waitlist. Data center revenue grew 427% YoY. Called "most important company in the world" by analysts. Jensen Huang = visionary CEO.' },
      { sym: 'MSFT', name: 'Microsoft', sector: 'Cloud / AI', rating: 'STRONG BUY', score: 9.5, rev: '$245B', profit: '$88B', margin: '36%', mktCap: '$3.1T', growth: '+16%', moat: 'Azure cloud (#2 globally, fastest growing). Office 365 (400M enterprise users). GitHub Copilot. Teams. LinkedIn (1B users). 49% of OpenAI. Enterprise switching cost = near zero.', risks: 'Antitrust (DOJ scrutiny on OpenAI deal), AI competition from Google, cloud market maturation', future: 'Copilot monetization across all products ($30/month/user), Azure AI revenue ($20B+ run rate), AI agents (autonomous software agents)', financials: { pe: '33x', pb: '12x', roe: '36%', debt: 'Low', dividend: '0.7%', eps: '$11.8', target: '$500' }, desc: 'Founded 1975 by Bill Gates & Paul Allen. CEO Satya Nadella transformed from Windows-centric to cloud-first (2014). Azure is now 43% of revenue. OpenAI partnership (ChatGPT/Copilot) = biggest strategic bet. Most cash-generative software company.' },
      { sym: 'AAPL', name: 'Apple Inc', sector: 'Consumer Tech', rating: 'BUY', score: 8.8, rev: '$391B', profit: '$97B', margin: '24%', mktCap: '$2.9T', growth: '+2%', moat: '1.4B active devices. App Store ($100B+ revenue/yr). Ecosystem lock-in (iPhone+Mac+Watch+AirPods). Services growing 14%/yr.', risks: 'China revenue 20% (geopolitical), AI late vs Google/MS, iPhone upgrade cycle slowing, App Store antitrust', future: 'Apple Intelligence (AI features), Vision Pro (AR/VR), India manufacturing (30% by 2026), financial services', financials: { pe: '30x', pb: '50x', roe: '160%', debt: 'Low', dividend: '0.5%', eps: '$6.43', target: '$230' }, desc: 'Founded 1976 by Steve Jobs. World\'s most valuable company. Tim Cook era = supply chain mastery + services growth. India as next China (manufacturing + market). Most brand-loyal customers on Earth.' },
      { sym: 'AMZN', name: 'Amazon', sector: 'Cloud / E-commerce', rating: 'STRONG BUY', score: 9.2, rev: '$620B', profit: '$30B', margin: '5%', mktCap: '$2.1T', growth: '+13%', moat: 'AWS #1 cloud (34% market share, $100B run rate). Prime (200M members). Unmatched logistics network. Alexa.', risks: 'AWS competition (Azure/Google), thin retail margins, regulatory pressure, Bezos departure', future: 'AWS AI services (Bedrock, CodeWhisperer), Healthcare (One Medical), Robotics in warehouses, Kuiper satellite internet', financials: { pe: '35x', pb: '8x', roe: '24%', debt: 'Medium', dividend: 'None', eps: '$5.74', target: '$250' }, desc: 'Founded 1994 by Jeff Bezos as online bookstore. Now: world\'s largest e-commerce + cloud + AI + logistics. AWS profits subsidize retail. Andy Jassy (ex-AWS CEO) now leads. $1T in merchandise moves through Amazon\'s network.' },
    ],
    industries: [
      { icon:'🤖', name:'Artificial Intelligence', size:'$196B (2024)', size2030:'$1.8T', cagr:'37%', score:9.8, drivers:'Every company adopting AI. $200B+ hyperscaler capex. Enterprise AI tools (Copilot, Gemini). AI agents replacing knowledge workers.', risks:'Regulation (EU AI Act, US executive orders), copyright lawsuits, energy consumption', govSupport:'CHIPS Act $52B, National AI Initiative, DARPA AI programs', topCos:'NVIDIA, Microsoft, Google, OpenAI, Anthropic, Meta, Amazon, Palantir', invest:'GPU makers (NVDA), AI cloud (MSFT/AMZN/GOOGL), AI software companies, AI infrastructure (data centers, power)' },
      { icon:'⚡', name:'Semiconductors', size:'$611B (2024)', size2030:'$1.1T', cagr:'14%', score:9.5, drivers:'AI chips, EV, IoT, 5G, defense — chips power everything. NVDA H100 = most wanted product on Earth.', risks:'China trade war, Taiwan geopolitical risk, fab construction cost overruns', govSupport:'CHIPS Act $52B for fabs in USA. Intel Arizona, TSMC Arizona subsidies.', topCos:'NVIDIA, AMD, Intel, Qualcomm, Broadcom, TSMC (Taiwan), ASML (Netherlands)', invest:'NVDA (AI monopoly), TSMC (fab monopoly), ASML (EUV monopoly), AMD (gaining share)' },
    ],
    trade: {
      exports: { total: '$3.05T', topItems: [
        { name: '✈️ Aircraft & Aerospace', value: '$150B', pct: 5, trend: '+8%', note: 'Boeing (despite 737 Max issues), defense aircraft, Lockheed F-35, Raytheon missiles' },
        { name: '⚙️ Machinery & Equipment', value: '$290B', pct: 10, trend: '+6%', note: 'Industrial machines, pumps, turbines, semiconductors' },
        { name: '⛽ Petroleum & LNG', value: '$427B', pct: 14, trend: '+15%', note: 'USA = world\'s largest oil & gas producer. LNG to Europe replacing Russia' },
        { name: '💊 Pharma & Chemicals', value: '$366B', pct: 12, trend: '+9%', note: 'Pfizer, Moderna, Abbott. Including GLP-1 drugs now globally in demand' },
        { name: '💻 Tech Services & Software', value: '$549B', pct: 18, trend: '+14%', note: 'SaaS, cloud services, financial services — biggest export by far' },
      ], topDest: [
        { country: '🇨🇦 Canada', pct: 17, value: '$519B', trend: '→ Stable' },
        { country: '🇲🇽 Mexico', pct: 16, value: '$488B', trend: '⬆️ Nearshoring' },
        { country: '🇨🇳 China', pct: 7, value: '$214B', trend: '⬇️ Trade war' },
        { country: '🇯🇵 Japan', pct: 5, value: '$153B', trend: '→ Stable' },
        { country: '🇬🇧 UK', pct: 4, value: '$122B', trend: '→ Stable' },
      ]},
      imports: { total: '$3.82T', topItems: [
        { name: '📱 Electronics & Machinery', value: '$993B', pct: 26, trend: '+8%', note: 'iPhones (China), semiconductors (Taiwan), computers (China/Vietnam)' },
        { name: '🚗 Vehicles', value: '$535B', pct: 14, trend: '+5%', note: 'Toyota, BMW, Mercedes, Hyundai. Also EV imports from Korea/Germany' },
        { name: '⛽ Petroleum', value: '$382B', pct: 10, trend: '-5%', note: 'Despite being #1 producer, still imports heavy crude for refineries' },
        { name: '💊 Pharma & Medical', value: '$306B', pct: 8, trend: '+12%', note: 'Generics from India, branded from Europe, medical devices' },
      ], topSrc: [
        { country: '🇨🇳 China', pct: 14, value: '$535B', trend: '⬇️ Declining (tariffs)' },
        { country: '🇲🇽 Mexico', pct: 13, value: '$497B', trend: '⬆️ Nearshoring' },
        { country: '🇨🇦 Canada', pct: 13, value: '$497B', trend: '→ Stable' },
        { country: '🇩🇪 Germany', pct: 5, value: '$191B', trend: '→ Stable' },
        { country: '🇯🇵 Japan', pct: 4, value: '$153B', trend: '→ Stable' },
      ]},
      balance: '-$773B', note: 'Largest trade deficit in world history. Funded by dollar\'s reserve currency status and foreign investment in US assets.'
    },
  },

};

// ---- Default (Global) data when no country selected ----
const GLOBAL_TOP_COUNTRIES = [
  { rank:1,  name:'🇮🇳 India',        score:9.2, gdp:'$3.9T',  growth:'+6.8%', why:'Fastest growing G20 economy, young demographics, IT boom, PLI manufacturing', horizon:'5–10 yrs' },
  { rank:2,  name:'🇺🇸 USA',          score:9.0, gdp:'$28.8T', growth:'+2.5%', why:'AI leadership, dollar dominance, deepest capital markets', horizon:'1–5 yrs' },
  { rank:3,  name:'🇻🇳 Vietnam',      score:8.7, gdp:'$0.43T', growth:'+6.1%', why:'China+1 manufacturing hub, Samsung & Intel invested heavily', horizon:'5–10 yrs' },
  { rank:4,  name:'🇸🇦 Saudi Arabia', score:8.5, gdp:'$1.1T',  growth:'+4.2%', why:'Vision 2030 diversification, NEOM, PIF $700B+ investments', horizon:'3–7 yrs' },
  { rank:5,  name:'🇸🇬 Singapore',    score:8.4, gdp:'$0.52T', growth:'+3.1%', why:'Global financial hub, lowest taxes, best ease of doing business in Asia', horizon:'3–7 yrs' },
  { rank:6,  name:'🇦🇪 UAE',          score:8.1, gdp:'$0.50T', growth:'+4.5%', why:'Tax-free, Dubai finance hub, AI National Strategy, Golden Visa', horizon:'3–7 yrs' },
  { rank:7,  name:'🇮🇩 Indonesia',    score:8.0, gdp:'$1.47T', growth:'+5.1%', why:'4th largest population, nickel EV batteries, growing middle class', horizon:'5–10 yrs' },
  { rank:8,  name:'🇯🇵 Japan',        score:7.5, gdp:'$4.2T',  growth:'+1.3%', why:'Semiconductor revival, robotics, weak yen export boost', horizon:'3–5 yrs' },
  { rank:9,  name:'🇩🇪 Germany',      score:7.5, gdp:'$4.6T',  growth:'+0.8%', why:'Industrial powerhouse, green energy transition, EU\'s largest economy', horizon:'5–10 yrs' },
  { rank:10, name:'🇰🇷 South Korea', score:7.9, gdp:'$1.87T', growth:'+2.3%', why:'Semiconductor king (Samsung, SK Hynix), EV batteries, K-culture', horizon:'3–7 yrs' },
];


// ============================================================
// MAIN RENDER FUNCTION
// ============================================================
export function renderResearch(container) {
  const selCountry = localStorage.getItem('wos_country') || null;
  const cData = selCountry ? COUNTRY_RESEARCH[selCountry] : null;
  const label = cData ? cData.label : '🌍 Global';
  const color = cData ? cData.color : '#6366f1';

  const TABS = [
    { id:'summary',    label:'🏆 Rankings' },
    { id:'companies',  label:'🏢 Companies' },
    { id:'industries', label:'🏭 Industries' },
    { id:'trade',      label:'🚢 Trade' },
    { id:'investors',  label:'💼 Investors' },
    { id:'products',   label:'📦 Products' },
    { id:'markets',    label:'📈 Markets' },
  ];

  container.innerHTML = `
    <div class="page-header">
      <div>
        <h1 class="page-title">🔬 Global Research Intelligence</h1>
        <p class="page-subtitle">Institutional-grade research · IMF, World Bank, WTO data · 2024–2025
          <span style="margin-left:10px;padding:3px 12px;background:${color}22;border:1px solid ${color};border-radius:20px;font-size:0.78rem;font-weight:700;color:${color}">${label}</span>
        </p>
      </div>
    </div>

    <!-- Tabs -->
    <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:20px;padding-bottom:8px;border-bottom:1px solid var(--border-color)">
      ${TABS.map((t,i) => `
        <button class="res-tab" data-tab="${t.id}"
          style="padding:8px 16px;border-radius:20px;border:1.5px solid ${i===0?color:'var(--border-color)'};
          background:${i===0?color+'22':'var(--bg-card)'};color:${i===0?color:'var(--text-secondary)'};
          cursor:pointer;font-size:0.82rem;font-weight:600;white-space:nowrap;transition:all 0.2s">
          ${t.label}
        </button>
      `).join('')}
    </div>

    <div id="res-content"></div>
  `;

  let activeTab = 'summary';
  container.querySelectorAll('.res-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      activeTab = btn.dataset.tab;
      container.querySelectorAll('.res-tab').forEach(b => {
        b.style.background = 'var(--bg-card)'; b.style.borderColor = 'var(--border-color)'; b.style.color = 'var(--text-secondary)';
      });
      btn.style.background = color + '22'; btn.style.borderColor = color; btn.style.color = color;
      renderTab(activeTab, cData, color);
    });
  });

  renderTab('summary', cData, color);
}

function renderTab(id, cData, color) {
  const el = document.getElementById('res-content');
  if (id === 'summary')    el.innerHTML = renderSummary(cData, color);
  else if (id === 'companies')  el.innerHTML = renderCompanies(cData, color);
  else if (id === 'industries') el.innerHTML = renderIndustries(cData, color);
  else if (id === 'trade')      el.innerHTML = renderTrade(cData, color);
  else if (id === 'investors')  el.innerHTML = renderInvestors();
  else if (id === 'products')   el.innerHTML = renderProducts();
  else if (id === 'markets')    el.innerHTML = renderMarkets();
  // Wire drill-down toggles
  el.querySelectorAll('[data-expand]').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = document.getElementById(btn.dataset.expand);
      if (!target) return;
      const open = target.style.display !== 'none';
      target.style.display = open ? 'none' : 'block';
      btn.innerHTML = open ? '▶ Show Details' : '▼ Hide Details';
    });
  });
}

// ============================================================
// SUMMARY / RANKINGS TAB
// ============================================================
function renderSummary(cData, color) {
  if (cData) {
    const s = cData.summary;
    return `
      <!-- Country Banner -->
      <div class="card mb-4" style="border:1px solid ${color}55;background:linear-gradient(135deg,${color}10,var(--bg-card))">
        <div style="padding:20px">
          <div style="display:flex;align-items:flex-start;gap:16px;flex-wrap:wrap">
            <div style="flex:1;min-width:200px">
              <h2 style="font-size:1.6rem;font-weight:900;margin:0 0 6px">${cData.label} — Investment Overview</h2>
              <div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:12px">
                <span style="padding:3px 10px;background:${color}22;border:1px solid ${color};border-radius:20px;font-size:0.78rem;color:${color}">GDP: ${s.gdp}</span>
                <span style="padding:3px 10px;background:rgba(34,197,94,0.15);border:1px solid #22c55e;border-radius:20px;font-size:0.78rem;color:#22c55e">Growth: ${s.growth}</span>
                <span style="padding:3px 10px;background:rgba(245,158,11,0.15);border:1px solid #f59e0b;border-radius:20px;font-size:0.78rem;color:#f59e0b">Inflation: ${s.inflation}</span>
                <span style="padding:3px 10px;background:rgba(99,102,241,0.15);border:1px solid #6366f1;border-radius:20px;font-size:0.82rem;font-weight:700;color:#a5b4fc">Score: ${s.score}/10</span>
              </div>
              <p style="font-size:0.88rem;color:#94a3b8;line-height:1.7;margin:0 0 12px">${s.headline}</p>
              <div style="font-size:0.82rem;margin-bottom:6px"><span style="color:#22c55e;font-weight:700">✅ Best for: </span><span style="color:#94a3b8">${s.bestFor}</span></div>
              <div style="font-size:0.82rem"><span style="color:#f59e0b;font-weight:700">⚠️ Avoid: </span><span style="color:#94a3b8">${s.avoid}</span></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Top Recommendations -->
      <div class="card mb-4">
        <div class="card-header"><div class="card-title"><i class="fa fa-crown" style="color:#f59e0b"></i> Top Investment Recommendations</div></div>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:12px;padding:16px">
          ${cData.summary.topRec.map(r => `
            <div style="padding:14px 16px;background:rgba(255,255,255,0.04);border-radius:12px;border-left:3px solid ${color}">
              <div style="font-size:0.72rem;font-weight:700;color:${color};margin-bottom:4px">${r.type}</div>
              <div style="font-size:0.98rem;font-weight:800;color:#f8fafc;margin-bottom:6px">${r.pick}</div>
              <div style="font-size:0.78rem;color:#94a3b8;line-height:1.5;margin-bottom:8px">${r.why}</div>
              <span style="padding:2px 10px;background:rgba(34,197,94,0.15);border:1px solid #22c55e;border-radius:20px;font-size:0.72rem;font-weight:700;color:#22c55e">Score: ${r.score}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // Global rankings
  return `
    <div class="card mb-4" style="border:1px solid rgba(99,102,241,0.4)">
      <div class="card-header"><div class="card-title"><i class="fa fa-globe"></i> Top 10 Countries to Invest — 2025–2030</div></div>
      <div style="overflow-x:auto">
        <table style="width:100%;border-collapse:collapse">
          <thead><tr style="background:var(--bg-elevated)">
            <th style="padding:10px 14px;font-size:0.78rem;color:#94a3b8">#</th>
            <th style="padding:10px 14px;font-size:0.78rem;color:#94a3b8">Country</th>
            <th style="padding:10px 14px;text-align:right;font-size:0.78rem;color:#94a3b8">GDP</th>
            <th style="padding:10px 14px;text-align:right;font-size:0.78rem;color:#94a3b8">Growth</th>
            <th style="padding:10px 14px;font-size:0.78rem;color:#94a3b8">Why Invest</th>
            <th style="padding:10px 14px;text-align:center;font-size:0.78rem;color:#94a3b8">Horizon</th>
            <th style="padding:10px 14px;text-align:center;font-size:0.78rem;color:#94a3b8">Score</th>
          </tr></thead>
          <tbody>
            ${GLOBAL_TOP_COUNTRIES.map(c => `
              <tr style="border-top:1px solid var(--border-color)">
                <td style="padding:12px 14px;font-weight:900;color:#6366f1;font-size:1.1rem">${c.rank}</td>
                <td style="padding:12px 14px;font-weight:700">${c.name}</td>
                <td style="padding:12px 14px;text-align:right;font-family:monospace">${c.gdp}</td>
                <td style="padding:12px 14px;text-align:right;font-weight:700;color:#22c55e">${c.growth}</td>
                <td style="padding:12px 14px;font-size:0.78rem;color:#94a3b8;max-width:260px">${c.why}</td>
                <td style="padding:12px 14px;text-align:center;font-size:0.78rem;color:#a5b4fc">${c.horizon}</td>
                <td style="padding:12px 14px;text-align:center"><span style="padding:3px 10px;background:rgba(34,197,94,0.15);border:1px solid #22c55e;border-radius:20px;font-size:0.78rem;font-weight:700;color:#22c55e">${c.score}/10</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// ============================================================
// COMPANIES TAB (with DRILL-DOWN)
// ============================================================
function renderCompanies(cData, color) {
  const companies = cData?.companies || [
    { sym:'NVDA', name:'NVIDIA', sector:'AI Chips', rating:'STRONG BUY', score:9.9, rev:'$83B', profit:'$46B', margin:'55%', mktCap:'$3.3T', growth:'+122%', moat:'80%+ AI GPU market share. CUDA ecosystem = 15M developers.', risks:'AMD competition, China restrictions', future:'Blackwell GPUs, AI inference, robotics', financials:{pe:'35x',pb:'30x',roe:'91%',debt:'Very Low',dividend:'0.03%',eps:'$1.92',target:'$165'}, desc:'AI\'s most essential company. Founded 1993 by Jensen Huang.' },
    { sym:'MSFT', name:'Microsoft', sector:'Cloud/AI', rating:'STRONG BUY', score:9.5, rev:'$245B', profit:'$88B', margin:'36%', mktCap:'$3.1T', growth:'+16%', moat:'Azure AI, Office365 400M users, GitHub, LinkedIn, 49% OpenAI', risks:'Antitrust, AI competition', future:'Copilot monetization, AI agents', financials:{pe:'33x',pb:'12x',roe:'36%',debt:'Low',dividend:'0.7%',eps:'$11.8',target:'$500'}, desc:'Satya Nadella transformed Microsoft into AI/cloud giant.' },
    { sym:'AAPL', name:'Apple Inc', sector:'Consumer Tech', rating:'BUY', score:8.8, rev:'$391B', profit:'$97B', margin:'24%', mktCap:'$2.9T', growth:'+2%', moat:'1.4B devices, App Store, ecosystem lock-in', risks:'China risk, AI late entry', future:'Apple Intelligence, Vision Pro, India mfg', financials:{pe:'30x',pb:'50x',roe:'160%',debt:'Low',dividend:'0.5%',eps:'$6.43',target:'$230'}, desc:'World\'s most valuable brand. 1.4B loyal device users.' },
    { sym:'TSMC', name:'Taiwan Semi', sector:'Semiconductors', rating:'STRONG BUY', score:9.4, rev:'$87B', profit:'$31B', margin:'36%', mktCap:'$900B', growth:'+25%', moat:'Only 2nm chip maker. NVIDIA/Apple/AMD all MUST use TSMC.', risks:'Taiwan geopolitical risk (China)', future:'Arizona fabs, AI chip demand', financials:{pe:'26x',pb:'7x',roe:'28%',debt:'Low',dividend:'1.8%',eps:'$5.91',target:'$220'}, desc:'World\'s most critical manufacturer — every AI chip made here.' },
  ];

  return `
    <div style="display:grid;gap:14px">
      ${companies.map((c, i) => `
        <div class="card">
          <div style="padding:16px 20px">
            <!-- Header row -->
            <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin-bottom:12px">
              <span style="font-family:monospace;font-weight:900;color:#22c55e;font-size:1rem">${c.sym}</span>
              <strong style="font-size:1.05rem">${c.name}</strong>
              <span style="padding:2px 8px;background:rgba(99,102,241,0.15);border-radius:6px;font-size:0.72rem;color:#a5b4fc">${c.sector}</span>
              <span style="padding:3px 10px;border-radius:20px;font-size:0.78rem;font-weight:700;
                background:${c.rating.includes('STRONG')?'rgba(34,197,94,0.2)':'rgba(59,130,246,0.2)'};
                border:1px solid ${c.rating.includes('STRONG')?'#22c55e':'#3b82f6'};
                color:${c.rating.includes('STRONG')?'#22c55e':'#3b82f6'}">${c.rating}</span>
              <span style="padding:3px 10px;background:rgba(245,158,11,0.15);border:1px solid #f59e0b;border-radius:20px;font-size:0.78rem;font-weight:700;color:#f59e0b">${c.score}/10</span>
              <button data-expand="detail-${i}" style="margin-left:auto;padding:5px 14px;background:${color}22;border:1px solid ${color};border-radius:8px;color:${color};cursor:pointer;font-size:0.78rem;font-weight:600">▶ Show Details</button>
            </div>

            <!-- Quick stats -->
            <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(110px,1fr));gap:8px;margin-bottom:12px">
              ${[['Revenue',c.rev,'#3b82f6'],['Net Profit',c.profit,'#22c55e'],['Net Margin',c.margin,'#22c55e'],['Market Cap',c.mktCap,'#8b5cf6'],['YoY Growth',c.growth,'#f59e0b']].map(([l,v,col])=>`
                <div style="padding:8px 10px;background:rgba(255,255,255,0.04);border-radius:8px">
                  <div style="font-size:0.65rem;color:#94a3b8">${l}</div>
                  <div style="font-size:0.88rem;font-weight:700;color:${col}">${v}</div>
                </div>
              `).join('')}
            </div>

            <!-- Moat / Risks / Future - always visible -->
            <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:8px">
              <div style="padding:8px 10px;background:rgba(34,197,94,0.06);border-radius:8px;border-left:2px solid #22c55e">
                <div style="font-size:0.65rem;font-weight:700;color:#22c55e;margin-bottom:3px">🏰 COMPETITIVE MOAT</div>
                <div style="font-size:0.76rem;color:#94a3b8;line-height:1.5">${c.moat}</div>
              </div>
              <div style="padding:8px 10px;background:rgba(239,68,68,0.06);border-radius:8px;border-left:2px solid #ef4444">
                <div style="font-size:0.65rem;font-weight:700;color:#ef4444;margin-bottom:3px">⚠️ KEY RISKS</div>
                <div style="font-size:0.76rem;color:#94a3b8;line-height:1.5">${c.risks}</div>
              </div>
              <div style="padding:8px 10px;background:rgba(99,102,241,0.06);border-radius:8px;border-left:2px solid #6366f1">
                <div style="font-size:0.65rem;font-weight:700;color:#6366f1;margin-bottom:3px">🔮 FUTURE CATALYSTS</div>
                <div style="font-size:0.76rem;color:#94a3b8;line-height:1.5">${c.future}</div>
              </div>
            </div>

            <!-- DRILL DOWN — hidden by default -->
            <div id="detail-${i}" style="display:none;margin-top:14px;padding:16px;background:rgba(255,255,255,0.02);border-radius:12px;border:1px solid var(--border-color)">
              <div style="font-size:0.88rem;font-weight:700;color:#f8fafc;margin-bottom:12px">📊 Deep Dive — ${c.name}</div>

              <!-- About -->
              <div style="padding:10px 12px;background:rgba(255,255,255,0.03);border-radius:8px;margin-bottom:12px">
                <div style="font-size:0.68rem;font-weight:700;color:#a5b4fc;margin-bottom:4px">📖 ABOUT THE COMPANY</div>
                <div style="font-size:0.82rem;color:#94a3b8;line-height:1.7">${c.desc || 'Detailed description available in full report.'}</div>
              </div>

              <!-- Valuation metrics -->
              ${c.financials ? `
              <div style="margin-bottom:12px">
                <div style="font-size:0.68rem;font-weight:700;color:#a5b4fc;margin-bottom:8px">💹 VALUATION METRICS</div>
                <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(110px,1fr));gap:8px">
                  ${Object.entries(c.financials).map(([k,v]) => `
                    <div style="padding:8px 10px;background:rgba(99,102,241,0.08);border-radius:8px;border:1px solid rgba(99,102,241,0.2)">
                      <div style="font-size:0.65rem;color:#94a3b8;text-transform:uppercase">${k}</div>
                      <div style="font-size:0.9rem;font-weight:700;color:#a5b4fc">${v}</div>
                    </div>
                  `).join('')}
                </div>
              </div>` : ''}

              <!-- Investment verdict -->
              <div style="padding:12px 16px;background:${c.rating.includes('STRONG')?'rgba(34,197,94,0.08)':'rgba(59,130,246,0.08)'};border-radius:10px;border:1px solid ${c.rating.includes('STRONG')?'rgba(34,197,94,0.3)':'rgba(59,130,246,0.3)'}">
                <div style="font-size:0.7rem;font-weight:700;color:${c.rating.includes('STRONG')?'#22c55e':'#3b82f6'};margin-bottom:6px">⚖️ INVESTMENT VERDICT</div>
                <div style="font-size:0.85rem;font-weight:700;color:#f8fafc;margin-bottom:4px">${c.rating} — Score ${c.score}/10</div>
                <div style="font-size:0.78rem;color:#94a3b8">Strong moat, consistent execution, and structural tailwinds make ${c.name} a core holding for long-term investors. Monitor risks listed above.</div>
              </div>
            </div>

          </div>
        </div>
      `).join('')}
    </div>
    <div style="padding:10px 14px;background:rgba(245,158,11,0.06);border:1px solid rgba(245,158,11,0.2);border-radius:10px;margin-top:8px;font-size:0.75rem;color:#94a3b8">
      ⚠️ <strong style="color:#f59e0b">Not Financial Advice.</strong> Research only. Data: Bloomberg, company filings, Goldman Sachs, Morgan Stanley (2024–2025). Consult a SEBI/SEC registered advisor.
    </div>
  `;
}

// ============================================================
// INDUSTRIES TAB (country-aware + drill-down)
// ============================================================
function renderIndustries(cData, color) {
  const industries = cData?.industries || [
    { icon:'🤖', name:'Artificial Intelligence', size:'$196B', size2030:'$1.8T', cagr:'37%', score:9.8, drivers:'LLM adoption, enterprise AI, agentic AI, every sector transforming', risks:'EU AI Act, copyright, energy cost', govSupport:'US CHIPS Act, EU AI, India AI Mission', topCos:'NVIDIA, Microsoft, Google, OpenAI, Anthropic', invest:'GPU chips, AI cloud, AI-native SaaS' },
    { icon:'⚡', name:'Semiconductors', size:'$611B', size2030:'$1.1T', cagr:'14%', score:9.5, drivers:'AI chips, EVs, 5G, IoT — everything needs chips', risks:'China trade war, Taiwan risk', govSupport:'CHIPS Act $52B, EU Chips Act €43B', topCos:'NVIDIA, TSMC, Samsung, ASML, AMD', invest:'NVDA, TSMC, ASML (monopolies)' },
    { icon:'🔋', name:'EV & Batteries', size:'$388B', size2030:'$1.1T', cagr:'23%', score:9.2, drivers:'Government EV mandates, battery cost decline', risks:'Charging infra lag, lithium supply', govSupport:'US IRA $369B, EU Green Deal', topCos:'Tesla, BYD, CATL, LG Energy', invest:'Battery makers, charging networks, lithium miners' },
    { icon:'🛡️', name:'Cybersecurity', size:'$245B', size2030:'$562B', cagr:'13%', score:8.8, drivers:'AI-powered attacks, ransomware, cloud migration', risks:'Talent shortage, commoditization', govSupport:'US CISA, EU NIS2 directive', topCos:'CrowdStrike, Palo Alto, Zscaler, Microsoft', invest:'Zero-trust, AI security, cloud security' },
  ];

  return `
    <div style="display:grid;gap:14px">
      ${industries.map((ind, i) => `
        <div class="card">
          <div style="padding:16px 20px">
            <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin-bottom:12px">
              <span style="font-size:2rem">${ind.icon}</span>
              <div style="flex:1">
                <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
                  <strong style="font-size:1.05rem">${ind.name}</strong>
                  <span style="padding:3px 10px;background:rgba(34,197,94,0.15);border:1px solid #22c55e;border-radius:20px;font-size:0.78rem;font-weight:700;color:#22c55e">CAGR: ${ind.cagr}</span>
                  <span style="padding:3px 10px;background:rgba(99,102,241,0.15);border:1px solid #6366f1;border-radius:20px;font-size:0.78rem;font-weight:700;color:#a5b4fc">${ind.score}/10</span>
                </div>
              </div>
              <div style="text-align:right">
                <div style="font-size:0.7rem;color:#94a3b8">Market Size</div>
                <div style="font-size:1rem;font-weight:800">${ind.size}</div>
                <div style="font-size:0.75rem;color:#22c55e">→ ${ind.size2030} by 2030</div>
              </div>
              <button data-expand="ind-detail-${i}" style="padding:5px 14px;background:${color}22;border:1px solid ${color};border-radius:8px;color:${color};cursor:pointer;font-size:0.78rem;font-weight:600">▶ Show Details</button>
            </div>

            <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:8px">
              <div style="padding:8px 10px;background:rgba(34,197,94,0.06);border-radius:8px;border-left:2px solid #22c55e">
                <div style="font-size:0.65rem;font-weight:700;color:#22c55e;margin-bottom:3px">📈 GROWTH DRIVERS</div>
                <div style="font-size:0.76rem;color:#94a3b8;line-height:1.5">${ind.drivers}</div>
              </div>
              <div style="padding:8px 10px;background:rgba(239,68,68,0.06);border-radius:8px;border-left:2px solid #ef4444">
                <div style="font-size:0.65rem;font-weight:700;color:#ef4444;margin-bottom:3px">⚠️ RISKS</div>
                <div style="font-size:0.76rem;color:#94a3b8;line-height:1.5">${ind.risks}</div>
              </div>
            </div>

            <!-- DRILL DOWN -->
            <div id="ind-detail-${i}" style="display:none;margin-top:12px;padding:14px;background:rgba(255,255,255,0.02);border-radius:10px;border:1px solid var(--border-color)">
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px">
                <div style="padding:10px 12px;background:rgba(59,130,246,0.06);border-radius:8px;border-left:2px solid #3b82f6">
                  <div style="font-size:0.65rem;font-weight:700;color:#3b82f6;margin-bottom:3px">🏛️ GOVERNMENT SUPPORT</div>
                  <div style="font-size:0.76rem;color:#94a3b8;line-height:1.5">${ind.govSupport}</div>
                </div>
                <div style="padding:10px 12px;background:rgba(245,158,11,0.06);border-radius:8px;border-left:2px solid #f59e0b">
                  <div style="font-size:0.65rem;font-weight:700;color:#f59e0b;margin-bottom:3px">💡 INVESTMENT ANGLE</div>
                  <div style="font-size:0.76rem;color:#94a3b8;line-height:1.5">${ind.invest}</div>
                </div>
              </div>
              <div style="font-size:0.78rem"><span style="color:#94a3b8">🏢 Top Companies: </span><span style="color:#22c55e;font-weight:600">${ind.topCos}</span></div>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

// ============================================================
// TRADE TAB (country-aware + drill-down)
// ============================================================
function renderTrade(cData, color) {
  if (!cData?.trade) return `<div class="card"><div style="padding:40px;text-align:center;color:#94a3b8">Select a country to see trade data</div></div>`;
  const t = cData.trade;
  return `
    <!-- Export / Import summary cards -->
    <div class="grid grid-4 mb-4">
      <div class="stat-card"><div class="stat-icon green"><i class="fa fa-plane-departure"></i></div><div class="stat-label">Total Exports</div><div class="stat-value" style="font-size:1.3rem">${t.exports.total}</div><div class="stat-change positive">Outbound trade</div></div>
      <div class="stat-card"><div class="stat-icon orange"><i class="fa fa-plane-arrival"></i></div><div class="stat-label">Total Imports</div><div class="stat-value" style="font-size:1.3rem">${t.imports.total}</div><div class="stat-change negative">Inbound trade</div></div>
      <div class="stat-card"><div class="stat-icon ${t.balance.startsWith('+')?'blue':'red'}"><i class="fa fa-scale-balanced"></i></div><div class="stat-label">Trade Balance</div><div class="stat-value" style="font-size:1.3rem;color:${t.balance.startsWith('+')?'#22c55e':'#ef4444'}">${t.balance}</div><div class="stat-change ${t.balance.startsWith('+')?'positive':'negative'}">${t.balance.startsWith('+')?'Trade Surplus':'Trade Deficit'}</div></div>
      <div class="stat-card"><div class="stat-icon purple"><i class="fa fa-globe"></i></div><div class="stat-label">Trade Note</div><div class="stat-value" style="font-size:0.72rem;color:#94a3b8;font-weight:400;line-height:1.5;margin-top:4px">${t.note}</div></div>
    </div>

    <div class="grid grid-2 mb-4">
      <!-- Exports -->
      <div class="card">
        <div class="card-header"><div class="card-title"><i class="fa fa-plane-departure"></i> Export Categories</div><span style="font-size:0.78rem;color:#94a3b8">${t.exports.total} total</span></div>
        <div style="padding:16px">
          ${t.exports.topItems.map((item, i) => `
            <div style="margin-bottom:12px">
              <div style="display:flex;justify-content:space-between;font-size:0.82rem;margin-bottom:4px">
                <span style="font-weight:600">${item.name}</span>
                <span style="color:#22c55e;font-weight:700">${item.value} (${item.pct}%)</span>
              </div>
              <div style="background:var(--bg-elevated);border-radius:4px;height:8px;overflow:hidden;margin-bottom:4px">
                <div style="width:${item.pct}%;height:100%;background:linear-gradient(90deg,#22c55e,#16a34a);border-radius:4px"></div>
              </div>
              <div style="display:flex;justify-content:space-between;font-size:0.72rem;color:#94a3b8">
                <span>${item.note}</span>
                <span style="color:${item.trend.includes('⬆')?'#22c55e':item.trend.includes('⬇')?'#ef4444':'#94a3b8'}">${item.trend}</span>
              </div>
              ${i < t.exports.topItems.length-1 ? '<div style="border-bottom:1px solid var(--border-color);margin-top:8px"></div>' : ''}
            </div>
          `).join('')}

          <div style="margin-top:16px">
            <div style="font-size:0.75rem;font-weight:700;color:#94a3b8;margin-bottom:8px;text-transform:uppercase">Top Export Destinations</div>
            ${t.exports.topDest.map(d => `
              <div style="display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:1px solid var(--border-color)20">
                <span style="font-size:0.85rem">${d.country}</span>
                <div style="display:flex;align-items:center;gap:8px">
                  <div style="width:70px;background:var(--bg-elevated);border-radius:4px;height:5px">
                    <div style="width:${Math.min(d.pct*3,100)}%;height:100%;background:#22c55e;border-radius:4px"></div>
                  </div>
                  <span style="font-size:0.78rem;color:#22c55e;font-weight:600;width:28px">${d.pct}%</span>
                  <span style="font-size:0.72rem;color:#94a3b8">${d.value}</span>
                  <span style="font-size:0.72rem">${d.trend}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- Imports -->
      <div class="card">
        <div class="card-header"><div class="card-title"><i class="fa fa-plane-arrival"></i> Import Categories</div><span style="font-size:0.78rem;color:#94a3b8">${t.imports.total} total</span></div>
        <div style="padding:16px">
          ${t.imports.topItems.map((item, i) => `
            <div style="margin-bottom:12px">
              <div style="display:flex;justify-content:space-between;font-size:0.82rem;margin-bottom:4px">
                <span style="font-weight:600">${item.name}</span>
                <span style="color:#f97316;font-weight:700">${item.value} (${item.pct}%)</span>
              </div>
              <div style="background:var(--bg-elevated);border-radius:4px;height:8px;overflow:hidden;margin-bottom:4px">
                <div style="width:${item.pct}%;height:100%;background:linear-gradient(90deg,#f97316,#ea580c);border-radius:4px"></div>
              </div>
              <div style="display:flex;justify-content:space-between;font-size:0.72rem;color:#94a3b8">
                <span>${item.note}</span>
                <span style="color:${item.trend.includes('⬆')?'#f59e0b':'#94a3b8'}">${item.trend}</span>
              </div>
              ${i < t.imports.topItems.length-1 ? '<div style="border-bottom:1px solid var(--border-color);margin-top:8px"></div>' : ''}
            </div>
          `).join('')}

          <div style="margin-top:16px">
            <div style="font-size:0.75rem;font-weight:700;color:#94a3b8;margin-bottom:8px;text-transform:uppercase">Top Import Sources</div>
            ${t.imports.topSrc.map(s => `
              <div style="display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:1px solid var(--border-color)20">
                <span style="font-size:0.85rem">${s.country}</span>
                <div style="display:flex;align-items:center;gap:8px">
                  <div style="width:70px;background:var(--bg-elevated);border-radius:4px;height:5px">
                    <div style="width:${Math.min(s.pct*4,100)}%;height:100%;background:#f97316;border-radius:4px"></div>
                  </div>
                  <span style="font-size:0.78rem;color:#f97316;font-weight:600;width:28px">${s.pct}%</span>
                  <span style="font-size:0.72rem;color:#94a3b8">${s.value}</span>
                  <span style="font-size:0.72rem">${s.trend}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;
}

// ============================================================
// INVESTORS TAB (global — same always)
// ============================================================
function renderInvestors() {
  const investors = [
    { name:'Warren Buffett / Berkshire Hathaway', aum:'$900B+', top:'Apple (40%), Bank of America, Chevron, Coca-Cola', recent:'Trimmed Apple, added Occidental Petroleum', thesis:'Buy wonderful companies at fair price. Long-term hold. Cash-generative businesses.' },
    { name:'BlackRock (Larry Fink)', aum:'$10T', top:'Every S&P 500 via index. Active: AI infra, climate', recent:'Push into private credit & infrastructure, AI data centers', thesis:'ESG + indexing. Shifting to private markets. AI infrastructure opportunity.' },
    { name:'SoftBank Vision Fund (Masa Son)', aum:'$150B', top:'ARM Holdings, ByteDance, OpenAI, Coupang', recent:'ARM IPO success. Investing $1B+ rounds in AI startups', thesis:'AI is the biggest bet in human history. Back AI-first companies globally.' },
    { name:'Temasek (Singapore)', aum:'$300B', top:'DBS Bank, Singapore Airlines, Alibaba, India cos', recent:'Increased India, cut China (sold Alibaba), more SE Asia', thesis:'Long-term value, Asia focus. India = top growth opportunity.' },
    { name:'Saudi PIF (Crown Prince MBS)', aum:'$700B', top:'Aramco, NEOM, LIV Golf, Lucid Motors, Uber, Noon', recent:'$1.5B gaming (Nintendo, Activision), sports investments, AI push', thesis:'Vision 2030 diversification. Oil → tech, tourism, sports, entertainment.' },
    { name:'Sequoia Capital', aum:'$85B', top:'Apple, Google (early), WhatsApp, Stripe, Airbnb, Snowflake', recent:'Harvey AI, Mistral AI, Wayve. Separate US/India/China funds', thesis:'Partner with exceptional founders. AI-native companies = next wave.' },
    { name:'Bridgewater (Ray Dalio)', aum:'$124B', top:'Macro. Gold, TIPS, Emerging Markets, commodities', recent:'Warning on US debt. Reduced China. Growing India position.', thesis:'All Weather. Debt cycle. Big concern on US fiscal trajectory. Gold reserve.' },
    { name:'GIC Singapore', aum:'$770B', top:'Real estate, infra globally, public + private equities', recent:'India infra $3B+, US data centers, European logistics', thesis:'30-year horizon. Inflation-protected real assets. Private equity focus.' },
  ];
  return `<div style="display:grid;gap:12px">${investors.map(inv=>`
    <div class="card"><div style="padding:14px 18px">
      <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:10px;flex-wrap:wrap;margin-bottom:10px">
        <div><h3 style="font-size:0.98rem;font-weight:900;margin:0 0 4px">${inv.name}</h3>
        <span style="font-size:0.78rem;color:#94a3b8">AUM: <strong style="color:#22c55e">${inv.aum}</strong></span></div>
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:8px">
        <div style="padding:8px 10px;background:rgba(255,255,255,0.04);border-radius:8px"><div style="font-size:0.65rem;font-weight:700;color:#22c55e;margin-bottom:3px">📂 TOP HOLDINGS</div><div style="font-size:0.76rem;color:#94a3b8;line-height:1.5">${inv.top}</div></div>
        <div style="padding:8px 10px;background:rgba(255,255,255,0.04);border-radius:8px"><div style="font-size:0.65rem;font-weight:700;color:#3b82f6;margin-bottom:3px">🆕 RECENT MOVES</div><div style="font-size:0.76rem;color:#94a3b8;line-height:1.5">${inv.recent}</div></div>
        <div style="padding:8px 10px;background:rgba(255,255,255,0.04);border-radius:8px"><div style="font-size:0.65rem;font-weight:700;color:#f59e0b;margin-bottom:3px">🧠 THESIS</div><div style="font-size:0.76rem;color:#94a3b8;line-height:1.5">${inv.thesis}</div></div>
      </div>
    </div></div>
  `).join('')}</div>`;
}

// ============================================================
// PRODUCTS TAB
// ============================================================
function renderProducts() {
  const products = [
    { name:'🤖 AI Software & APIs', size:'$196B', growth:'+37%', margin:'60–80%', opp:'Every company buying AI. OpenAI, Anthropic, Mistral. Vertical AI apps. Highest margin software.' },
    { name:'⚡ AI Chips (GPUs)', size:'$50B chips', growth:'+122%', margin:'55%+', opp:'NVIDIA monopoly. H100 = $30K/chip, 12-month waitlist. $200B+ data center GPU spend in 2025.' },
    { name:'🔋 EV Batteries (LFP)', size:'$200B', growth:'+28%', margin:'10–20%', opp:'CATL, LG Energy. Every EV needs batteries. Lithium demand 5x by 2030.' },
    { name:'☀️ Solar Panels (Utility)', size:'$382B', growth:'+19%', margin:'15–25%', opp:'Cheapest electricity ever. 1.5TW annual market by 2030. India MENA SE Asia growth.' },
    { name:'💊 GLP-1 Drugs (Ozempic)', size:'$24B→$130B', growth:'+35%', margin:'70–80%', opp:'1B obese adults. Novo Nordisk & Eli Lilly racing. Also treats heart, kidney, liver disease.' },
    { name:'🌿 Green Hydrogen', size:'$2.7B→$350B', growth:'+54%', margin:'TBD', opp:'Decarbonise steel/cement/shipping. India + Middle East = lowest production cost.' },
    { name:'🛡️ Cybersecurity SaaS', size:'$245B', growth:'+13%', margin:'25–70%', opp:'AI threats increasing. Every company pays. CrowdStrike, Palo Alto, Zscaler.' },
    { name:'⛏️ Critical Minerals (Li, Co, Ni)', size:'$320B→$770B', growth:'+22%', margin:'Varies', opp:'EV + renewables = mineral demand surge. Massive supply deficit coming 2026–2030.' },
    { name:'🏗️ Data Centers', size:'$238B', growth:'+25%', margin:'20–35%', opp:'AI needs 100x compute. $400B+ being built globally. REITs + hyperscaler infra plays.' },
    { name:'🧬 Gene Therapy (CRISPR)', size:'$6B→$40B', growth:'+28%', margin:'High (post-approval)', opp:'First therapy approved (sickle cell $2.2M). Cure genetic diseases. AI drug discovery accelerates.' },
  ];
  return `<div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse">
    <thead><tr style="background:var(--bg-elevated)">
      <th style="padding:10px 14px;font-size:0.78rem;color:#94a3b8">Product</th>
      <th style="padding:10px 14px;text-align:right;font-size:0.78rem;color:#94a3b8">Market Size</th>
      <th style="padding:10px 14px;text-align:right;font-size:0.78rem;color:#94a3b8">CAGR</th>
      <th style="padding:10px 14px;text-align:right;font-size:0.78rem;color:#94a3b8">Margins</th>
      <th style="padding:10px 14px;font-size:0.78rem;color:#94a3b8">Investment Opportunity</th>
    </tr></thead>
    <tbody>${products.map(p=>`<tr style="border-top:1px solid var(--border-color)">
      <td style="padding:12px 14px;font-weight:700">${p.name}</td>
      <td style="padding:12px 14px;text-align:right;font-family:monospace;color:#f8fafc">${p.size}</td>
      <td style="padding:12px 14px;text-align:right;font-weight:800;color:#22c55e">${p.growth}</td>
      <td style="padding:12px 14px;text-align:right;color:#f59e0b">${p.margin}</td>
      <td style="padding:12px 14px;font-size:0.78rem;color:#94a3b8;max-width:280px">${p.opp}</td>
    </tr>`).join('')}</tbody>
  </table></div>`;
}

// ============================================================
// MARKETS TAB
// ============================================================
function renderMarkets() {
  const markets = [
    { flag:'🇺🇸', name:'S&P 500', sym:'SPX', val:'5,432', pe:'22x', ytd:'+16.8%', mktCap:'$46T', outlook:'AI earnings upgrades, Fed rate cuts. Target 5,800–6,000 (Goldman Sachs). Expensive but justified by growth.', score:8.0 },
    { flag:'🇺🇸', name:'NASDAQ 100', sym:'NDX', val:'19,341', pe:'28x', ytd:'+19.4%', mktCap:'$22T', outlook:'AI stocks driving outperformance. NVDA, MSFT, GOOGL mega-cap. Expensive vs history but AI growth justifies.', score:8.2 },
    { flag:'🇮🇳', name:'NIFTY 50', sym:'NSEI', val:'24,000', pe:'23x', ytd:'+12.6%', mktCap:'$4.5T', outlook:'Structural bull. Fastest-growing economy. SIP inflows $2.5B/month. FII flows strong. Target 30,000 by 2027.', score:9.0 },
    { flag:'🇯🇵', name:'Nikkei 225', sym:'N225', val:'38,647', pe:'18x', ytd:'+20.1%', mktCap:'$6.2T', outlook:'Best performing major market YTD. Weak yen + Buffett buying + semiconductor revival = sustained rally.', score:8.0 },
    { flag:'🇩🇪', name:'DAX 40', sym:'DAX', val:'18,768', pe:'14x', ytd:'+8.6%', mktCap:'$2.1T', outlook:'Cheap 14x PE vs 22x S&P. German industrial recovery + AI automation plays. Rate cut beneficiary.', score:7.5 },
    { flag:'🇨🇳', name:'Shanghai Comp.', sym:'SHCOMP', val:'2,980', pe:'12x', ytd:'-5.8%', mktCap:'$9.5T', outlook:'Property crisis, deflation, regulatory crackdowns. Cheap but risky. Contrarian opportunity only.', score:5.5 },
    { flag:'🇬🇧', name:'FTSE 100', sym:'UKX', val:'8,203', pe:'11x', ytd:'+6.8%', mktCap:'$2.4T', outlook:'Very cheap 11x PE. Attractive 3.8% dividend yield. Overlooked by global investors = opportunity.', score:7.2 },
    { flag:'🇰🇷', name:'KOSPI', sym:'KS11', val:'2,746', pe:'13x', ytd:'+3.2%', mktCap:'$1.7T', outlook:'Samsung + SK Hynix = AI memory boom. HBM supercycle. Corporate governance reforms (Korea Discount).', score:8.0 },
  ];
  return `<div class="card"><div class="card-header"><div class="card-title"><i class="fa fa-chart-line"></i> Global Stock Market Scorecard 2025</div></div>
    <div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse">
      <thead><tr style="background:var(--bg-elevated)">
        <th style="padding:10px 14px;font-size:0.78rem;color:#94a3b8">Market</th>
        <th style="padding:10px 14px;text-align:right;font-size:0.78rem;color:#94a3b8">Level</th>
        <th style="padding:10px 14px;text-align:right;font-size:0.78rem;color:#94a3b8">P/E</th>
        <th style="padding:10px 14px;text-align:right;font-size:0.78rem;color:#94a3b8">YTD</th>
        <th style="padding:10px 14px;font-size:0.78rem;color:#94a3b8">Outlook</th>
        <th style="padding:10px 14px;text-align:center;font-size:0.78rem;color:#94a3b8">Score</th>
      </tr></thead>
      <tbody>${markets.map(m=>`<tr style="border-top:1px solid var(--border-color)">
        <td style="padding:12px 14px"><div>${m.flag} <strong>${m.name}</strong></div><div style="font-size:0.72rem;color:#94a3b8;font-family:monospace">${m.sym} · ${m.mktCap}</div></td>
        <td style="padding:12px 14px;text-align:right;font-family:monospace;font-weight:700">${m.val}</td>
        <td style="padding:12px 14px;text-align:right;color:${parseInt(m.pe)>20?'#f59e0b':'#22c55e'}">${m.pe}</td>
        <td style="padding:12px 14px;text-align:right;font-weight:700;color:${m.ytd.startsWith('+')?'#22c55e':'#ef4444'}">${m.ytd}</td>
        <td style="padding:12px 14px;font-size:0.78rem;color:#94a3b8;max-width:280px;line-height:1.5">${m.outlook}</td>
        <td style="padding:12px 14px;text-align:center"><span style="padding:3px 10px;background:${m.score>=8.5?'rgba(34,197,94,0.15)':m.score>=7?'rgba(99,102,241,0.15)':'rgba(245,158,11,0.15)'};border:1px solid ${m.score>=8.5?'#22c55e':m.score>=7?'#6366f1':'#f59e0b'};border-radius:20px;font-size:0.78rem;font-weight:700;color:${m.score>=8.5?'#22c55e':m.score>=7?'#a5b4fc':'#f59e0b'}">${m.score}/10</span></td>
      </tr>`).join('')}</tbody>
    </table></div>
    <div style="padding:10px 14px;background:rgba(245,158,11,0.06);border-top:1px solid rgba(245,158,11,0.2);font-size:0.75rem;color:#94a3b8">⚠️ <strong style="color:#f59e0b">Not Financial Advice.</strong> Bloomberg, Goldman Sachs 2025, IMF data. Consult registered advisor.</div>
  </div>`;
}
