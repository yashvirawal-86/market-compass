// Mock financial data for StockVerse AI. Marked as sample data.
export type Trend = "up" | "down";

export interface MarketIndex {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePct: number;
  spark: number[];
}

const spark = (base: number, n = 24, vol = 0.02) => {
  const arr: number[] = [];
  let v = base;
  for (let i = 0; i < n; i++) {
    v = v * (1 + (Math.random() - 0.5) * vol);
    arr.push(v);
  }
  return arr;
};

export const MARKET_INDICES: MarketIndex[] = [
  { symbol: "NIFTY", name: "NIFTY 50", price: 24856.3, change: 142.55, changePct: 0.58, spark: spark(24800) },
  { symbol: "SENSEX", name: "SENSEX", price: 81532.7, change: -218.4, changePct: -0.27, spark: spark(81500, 24, 0.015) },
  { symbol: "NDX", name: "NASDAQ", price: 20114.5, change: 187.32, changePct: 0.94, spark: spark(20000) },
  { symbol: "SPX", name: "S&P 500", price: 5824.2, change: 32.11, changePct: 0.55, spark: spark(5800) },
  { symbol: "DJI", name: "Dow Jones", price: 42563.1, change: -95.6, changePct: -0.22, spark: spark(42500, 24, 0.012) },
  { symbol: "BNF", name: "Bank Nifty", price: 52418.9, change: 312.7, changePct: 0.6, spark: spark(52300) },
  { symbol: "GOLD", name: "Gold (USD/oz)", price: 2687.4, change: 14.3, changePct: 0.54, spark: spark(2670) },
  { symbol: "SLV", name: "Silver (USD/oz)", price: 31.85, change: -0.42, changePct: -1.3, spark: spark(32, 24, 0.025) },
  { symbol: "OIL", name: "Crude Oil (WTI)", price: 71.32, change: 0.88, changePct: 1.25, spark: spark(70.5) },
  { symbol: "INR", name: "USD / INR", price: 84.28, change: 0.06, changePct: 0.07, spark: spark(84.2, 24, 0.005) },
];

export interface Company {
  ticker: string;
  name: string;
  sector: string;
  price: number;
  change: number;
  changePct: number;
  marketCap: string;
  pe: number;
  divYield: number;
  high52: number;
  low52: number;
  sentiment: "Bullish" | "Neutral" | "Bearish";
  recommendation: "Buy" | "Hold" | "Sell";
  logo: string;
  color: string;
  ceo: string;
  hq: string;
  founded: number;
  revenue: string;
  netProfit: string;
  employees: string;
  description: string;
  competitors: string[];
}

export const COMPANIES: Company[] = [
  {
    ticker: "AAPL", name: "Apple Inc.", sector: "Technology", price: 234.11, change: 2.42, changePct: 1.04,
    marketCap: "$3.55T", pe: 38.4, divYield: 0.44, high52: 237.49, low52: 164.08, sentiment: "Bullish", recommendation: "Buy",
    logo: "AA", color: "#a3a3a3",
    ceo: "Tim Cook", hq: "Cupertino, USA", founded: 1976, revenue: "$391B", netProfit: "$94B", employees: "164,000",
    description: "Designs and markets smartphones, personal computers, tablets, wearables, and services worldwide.",
    competitors: ["Samsung", "Google", "Microsoft"],
  },
  {
    ticker: "MSFT", name: "Microsoft Corp.", sector: "Technology", price: 428.92, change: 3.61, changePct: 0.85,
    marketCap: "$3.18T", pe: 36.1, divYield: 0.72, high52: 468.35, low52: 362.9, sentiment: "Bullish", recommendation: "Buy",
    logo: "MS", color: "#00a4ef",
    ceo: "Satya Nadella", hq: "Redmond, USA", founded: 1975, revenue: "$245B", netProfit: "$88B", employees: "228,000",
    description: "Develops software, cloud services (Azure), productivity tools (Office 365), and enterprise solutions.",
    competitors: ["Amazon AWS", "Google Cloud", "Oracle"],
  },
  {
    ticker: "NVDA", name: "NVIDIA Corp.", sector: "Semiconductors", price: 141.55, change: 4.12, changePct: 3.0,
    marketCap: "$3.47T", pe: 65.2, divYield: 0.03, high52: 152.89, low52: 47.32, sentiment: "Bullish", recommendation: "Buy",
    logo: "NV", color: "#76b900",
    ceo: "Jensen Huang", hq: "Santa Clara, USA", founded: 1993, revenue: "$96B", netProfit: "$53B", employees: "29,600",
    description: "Designs GPUs and AI compute platforms powering gaming, data centers, and generative AI workloads.",
    competitors: ["AMD", "Intel", "Broadcom"],
  },
  {
    ticker: "GOOGL", name: "Alphabet Inc.", sector: "Communication", price: 183.44, change: -0.89, changePct: -0.48,
    marketCap: "$2.25T", pe: 26.8, divYield: 0.42, high52: 201.42, low52: 130.67, sentiment: "Neutral", recommendation: "Hold",
    logo: "GO", color: "#4285f4",
    ceo: "Sundar Pichai", hq: "Mountain View, USA", founded: 1998, revenue: "$307B", netProfit: "$74B", employees: "182,502",
    description: "Parent of Google — search, advertising, YouTube, Android, and cloud infrastructure.",
    competitors: ["Microsoft", "Meta", "Amazon"],
  },
  {
    ticker: "AMZN", name: "Amazon.com", sector: "Consumer Cyclical", price: 213.03, change: 1.55, changePct: 0.73,
    marketCap: "$2.24T", pe: 44.6, divYield: 0, high52: 215.9, low52: 144.05, sentiment: "Bullish", recommendation: "Buy",
    logo: "AM", color: "#ff9900",
    ceo: "Andy Jassy", hq: "Seattle, USA", founded: 1994, revenue: "$574B", netProfit: "$30B", employees: "1,540,000",
    description: "Operates e-commerce marketplaces, AWS cloud services, Prime, advertising, and devices.",
    competitors: ["Walmart", "Microsoft", "Alibaba"],
  },
  {
    ticker: "TSLA", name: "Tesla Inc.", sector: "Automobile", price: 342.03, change: -6.71, changePct: -1.92,
    marketCap: "$1.09T", pe: 96.4, divYield: 0, high52: 358.64, low52: 138.8, sentiment: "Neutral", recommendation: "Hold",
    logo: "TS", color: "#e82127",
    ceo: "Elon Musk", hq: "Austin, USA", founded: 2003, revenue: "$97B", netProfit: "$7.9B", employees: "140,473",
    description: "Manufactures electric vehicles, energy storage, and solar products; develops autonomous driving software.",
    competitors: ["BYD", "Ford", "GM"],
  },
  {
    ticker: "RELIANCE", name: "Reliance Industries", sector: "Energy / Conglomerate", price: 1258.4, change: 12.6, changePct: 1.01,
    marketCap: "₹17.02L Cr", pe: 27.3, divYield: 0.79, high52: 1608.8, low52: 1201.5, sentiment: "Neutral", recommendation: "Hold",
    logo: "RI", color: "#0033a0",
    ceo: "Mukesh Ambani", hq: "Mumbai, India", founded: 1966, revenue: "₹9.0L Cr", netProfit: "₹79,000 Cr", employees: "347,000",
    description: "Diversified conglomerate across oil-to-chemicals, retail, digital services (Jio), and new energy.",
    competitors: ["ONGC", "IOC", "BPCL"],
  },
  {
    ticker: "TCS", name: "Tata Consultancy Services", sector: "IT Services", price: 4128.6, change: 34.2, changePct: 0.84,
    marketCap: "₹14.94L Cr", pe: 30.5, divYield: 1.9, high52: 4592.25, low52: 3423.05, sentiment: "Bullish", recommendation: "Buy",
    logo: "TC", color: "#1f4e79",
    ceo: "K. Krithivasan", hq: "Mumbai, India", founded: 1968, revenue: "₹2.4L Cr", netProfit: "₹46,000 Cr", employees: "607,979",
    description: "Global IT services, consulting, and business solutions across 46 countries.",
    competitors: ["Infosys", "Wipro", "Accenture"],
  },
  {
    ticker: "INFY", name: "Infosys Ltd.", sector: "IT Services", price: 1875.3, change: 18.7, changePct: 1.01,
    marketCap: "₹7.79L Cr", pe: 28.9, divYield: 2.3, high52: 1990.0, low52: 1358.35, sentiment: "Bullish", recommendation: "Buy",
    logo: "IN", color: "#007cc3",
    ceo: "Salil Parekh", hq: "Bengaluru, India", founded: 1981, revenue: "₹1.6L Cr", netProfit: "₹26,200 Cr", employees: "317,240",
    description: "Global consulting and IT services, with strengths in digital, cloud, and enterprise transformation.",
    competitors: ["TCS", "Wipro", "HCL Tech"],
  },
  {
    ticker: "HDFCBANK", name: "HDFC Bank", sector: "Banking", price: 1786.9, change: -8.2, changePct: -0.46,
    marketCap: "₹13.64L Cr", pe: 20.4, divYield: 1.1, high52: 1880.0, low52: 1363.55, sentiment: "Neutral", recommendation: "Hold",
    logo: "HD", color: "#ed232a",
    ceo: "Sashidhar Jagdishan", hq: "Mumbai, India", founded: 1994, revenue: "₹2.8L Cr", netProfit: "₹64,000 Cr", employees: "213,000",
    description: "India's largest private-sector bank by assets — retail, wholesale, treasury, and digital banking.",
    competitors: ["ICICI Bank", "SBI", "Axis Bank"],
  },
  {
    ticker: "ICICIBANK", name: "ICICI Bank", sector: "Banking", price: 1289.5, change: 9.8, changePct: 0.77,
    marketCap: "₹9.09L Cr", pe: 19.2, divYield: 0.78, high52: 1361.35, low52: 970.05, sentiment: "Bullish", recommendation: "Buy",
    logo: "IC", color: "#b02a30",
    ceo: "Sandeep Bakhshi", hq: "Mumbai, India", founded: 1994, revenue: "₹2.4L Cr", netProfit: "₹42,000 Cr", employees: "141,000",
    description: "Private-sector bank with wide retail, corporate, and international presence.",
    competitors: ["HDFC Bank", "SBI", "Axis Bank"],
  },
  {
    ticker: "SBIN", name: "State Bank of India", sector: "Banking", price: 812.3, change: 4.6, changePct: 0.57,
    marketCap: "₹7.25L Cr", pe: 10.8, divYield: 1.68, high52: 912.0, low52: 599.85, sentiment: "Neutral", recommendation: "Hold",
    logo: "SB", color: "#2b4b91",
    ceo: "C.S. Setty", hq: "Mumbai, India", founded: 1955, revenue: "₹6.6L Cr", netProfit: "₹67,000 Cr", employees: "232,296",
    description: "India's largest public-sector bank with 22,000+ branches and global operations.",
    competitors: ["HDFC Bank", "ICICI Bank", "PNB"],
  },
  {
    ticker: "LT", name: "Larsen & Toubro", sector: "Infrastructure", price: 3612.7, change: 21.3, changePct: 0.59,
    marketCap: "₹4.97L Cr", pe: 34.6, divYield: 0.75, high52: 3963.5, low52: 3175.05, sentiment: "Bullish", recommendation: "Buy",
    logo: "LT", color: "#0f4c81",
    ceo: "S.N. Subrahmanyan", hq: "Mumbai, India", founded: 1938, revenue: "₹2.2L Cr", netProfit: "₹13,000 Cr", employees: "51,000",
    description: "Engineering, construction, manufacturing, and technology conglomerate.",
    competitors: ["Siemens", "ABB", "BHEL"],
  },
  {
    ticker: "TATAMOTORS", name: "Tata Motors", sector: "Automobile", price: 784.5, change: -11.2, changePct: -1.41,
    marketCap: "₹2.89L Cr", pe: 10.1, divYield: 0.38, high52: 1179.05, low52: 743.4, sentiment: "Bearish", recommendation: "Hold",
    logo: "TM", color: "#004ea8",
    ceo: "Natarajan Chandrasekaran", hq: "Mumbai, India", founded: 1945, revenue: "₹4.4L Cr", netProfit: "₹31,800 Cr", employees: "82,032",
    description: "Automotive manufacturer of cars, EVs, commercial vehicles, and owner of Jaguar Land Rover.",
    competitors: ["Maruti Suzuki", "M&M", "Hyundai"],
  },
  {
    ticker: "ASIANPAINT", name: "Asian Paints", sector: "FMCG / Chemicals", price: 2412.3, change: -18.7, changePct: -0.77,
    marketCap: "₹2.31L Cr", pe: 46.7, divYield: 1.35, high52: 3422.9, low52: 2372.35, sentiment: "Bearish", recommendation: "Hold",
    logo: "AP", color: "#e30613",
    ceo: "Amit Syngle", hq: "Mumbai, India", founded: 1942, revenue: "₹35,500 Cr", netProfit: "₹5,460 Cr", employees: "8,300",
    description: "India's largest paint company; decorative and industrial coatings across South Asia.",
    competitors: ["Berger Paints", "Kansai Nerolac", "Akzo Nobel"],
  },
];

export interface NewsItem {
  title: string;
  summary: string;
  source: string;
  time: string;
  category: string;
  image: string;
}

export const NEWS: NewsItem[] = [
  {
    title: "Fed signals patience as inflation cools toward 2% target",
    summary: "FOMC minutes suggest a measured pace of rate cuts through 2026 as core PCE eases and labor markets normalize.",
    source: "Reuters", time: "12 min ago", category: "Macro",
    image: "linear-gradient(135deg,#0ea5e9,#22d3ee)",
  },
  {
    title: "NVIDIA guides above consensus on Blackwell demand",
    summary: "Data-center revenue climbs to record as hyperscalers extend AI infrastructure buildout into 2026.",
    source: "Bloomberg", time: "34 min ago", category: "Tech",
    image: "linear-gradient(135deg,#22c55e,#84cc16)",
  },
  {
    title: "RBI keeps repo rate steady, flags food inflation risks",
    summary: "MPC votes 5-1 to hold at 6.5%; retail inflation trajectory remains a key monitorable ahead of the next review.",
    source: "Mint", time: "1 hr ago", category: "India",
    image: "linear-gradient(135deg,#f59e0b,#f97316)",
  },
  {
    title: "Oil edges higher on OPEC+ production discipline",
    summary: "Brent trades near $74 as producers reaffirm voluntary cuts through Q1 2026.",
    source: "CNBC", time: "2 hr ago", category: "Commodities",
    image: "linear-gradient(135deg,#a855f7,#6366f1)",
  },
  {
    title: "Indian IT firms raise FY26 guidance on discretionary spend revival",
    summary: "TCS and Infosys point to stronger BFSI deal pipelines in North America and Europe.",
    source: "Economic Times", time: "3 hr ago", category: "India",
    image: "linear-gradient(135deg,#06b6d4,#3b82f6)",
  },
  {
    title: "Gold hits fresh highs as central banks add to reserves",
    summary: "Spot gold above $2,680/oz on sustained EM central-bank buying and softer real yields.",
    source: "Financial Times", time: "5 hr ago", category: "Commodities",
    image: "linear-gradient(135deg,#eab308,#f59e0b)",
  },
];

export interface EconomicEvent {
  date: string; time: string; region: "IN" | "US" | "EU" | "GLOBAL"; event: string; impact: "High" | "Medium" | "Low";
}
export const ECON_EVENTS: EconomicEvent[] = [
  { date: "Dec 04", time: "10:00", region: "IN", event: "RBI Monetary Policy Decision", impact: "High" },
  { date: "Dec 05", time: "19:00", region: "US", event: "US Non-Farm Payrolls", impact: "High" },
  { date: "Dec 10", time: "18:00", region: "US", event: "US CPI (Nov)", impact: "High" },
  { date: "Dec 12", time: "17:30", region: "IN", event: "India CPI Inflation", impact: "High" },
  { date: "Dec 18", time: "00:30", region: "US", event: "FOMC Rate Decision", impact: "High" },
  { date: "Dec 19", time: "18:30", region: "EU", event: "ECB Rate Decision", impact: "High" },
  { date: "Dec 20", time: "17:30", region: "IN", event: "India Q3 GDP Advance", impact: "Medium" },
  { date: "Dec 23", time: "—", region: "GLOBAL", event: "Q4 Earnings Season Kickoff", impact: "Medium" },
];

export interface IPO {
  name: string; status: "Upcoming" | "Open" | "Closed"; band: string; gmp: string; sub: string; date: string; color: string;
}
export const IPOS: IPO[] = [
  { name: "Vishal Mega Mart", status: "Upcoming", band: "₹74-78", gmp: "+₹18", sub: "—", date: "Dec 11-13", color: "#f97316" },
  { name: "Mobikwik", status: "Open", band: "₹265-279", gmp: "+₹135", sub: "12.4x", date: "Closes Dec 13", color: "#3b82f6" },
  { name: "InventurusKnowledge", status: "Open", band: "₹1265-1329", gmp: "+₹210", sub: "3.8x", date: "Closes Dec 13", color: "#22c55e" },
  { name: "Sai Life Sciences", status: "Closed", band: "₹522-549", gmp: "+₹32", sub: "10.3x", date: "Lists Dec 18", color: "#a855f7" },
  { name: "International Gemmological", status: "Closed", band: "₹397-417", gmp: "+₹165", sub: "35.5x", date: "Listed", color: "#eab308" },
];

export interface Fund {
  name: string; category: string; return1y: number; return3y: number; risk: "Low" | "Moderate" | "High"; expense: number; aum: string;
}
export const FUNDS: Fund[] = [
  { name: "Parag Parikh Flexi Cap", category: "Flexi Cap", return1y: 32.4, return3y: 22.1, risk: "Moderate", expense: 0.63, aum: "₹87,300 Cr" },
  { name: "Nippon India Small Cap", category: "Small Cap", return1y: 41.8, return3y: 31.4, risk: "High", expense: 0.71, aum: "₹63,700 Cr" },
  { name: "HDFC Mid-Cap Opportunities", category: "Mid Cap", return1y: 38.2, return3y: 27.8, risk: "High", expense: 0.85, aum: "₹78,500 Cr" },
  { name: "ICICI Pru Bluechip", category: "Large Cap", return1y: 24.6, return3y: 18.3, risk: "Moderate", expense: 0.87, aum: "₹66,900 Cr" },
  { name: "Nifty 50 Index Fund (UTI)", category: "Index", return1y: 21.2, return3y: 16.4, risk: "Moderate", expense: 0.2, aum: "₹18,400 Cr" },
  { name: "Nippon India ETF Gold BeES", category: "Gold ETF", return1y: 28.9, return3y: 17.2, risk: "Moderate", expense: 0.79, aum: "₹15,800 Cr" },
];

export interface Sector { name: string; change: number }
export const SECTORS: Sector[] = [
  { name: "Technology", change: 2.4 },
  { name: "Banking", change: 0.8 },
  { name: "Healthcare", change: -0.6 },
  { name: "Energy", change: 1.5 },
  { name: "Automobile", change: -1.2 },
  { name: "FMCG", change: 0.3 },
  { name: "Pharma", change: -0.4 },
  { name: "Real Estate", change: 1.9 },
  { name: "Metals", change: -1.8 },
  { name: "Infra", change: 1.1 },
  { name: "Media", change: -0.9 },
  { name: "Telecom", change: 0.6 },
];

export interface Ratio { name: string; value: string; explain: string }
export const RATIOS: Ratio[] = [
  { name: "P/E Ratio", value: "28.4", explain: "Price paid per rupee of annual earnings. Lower can mean cheaper, but context matters." },
  { name: "P/B Ratio", value: "5.1", explain: "Price relative to book (net asset) value per share." },
  { name: "ROE", value: "18.7%", explain: "Return on equity — profit generated per rupee of shareholder capital." },
  { name: "ROCE", value: "22.3%", explain: "Return on capital employed — efficiency of total capital, debt + equity." },
  { name: "EPS", value: "₹82.4", explain: "Earnings per share — net profit divided by outstanding shares." },
  { name: "Debt / Equity", value: "0.42", explain: "Leverage — total debt relative to shareholder equity. Lower is safer." },
  { name: "Dividend Yield", value: "1.2%", explain: "Annual dividend as a % of price — the cash return from holding." },
  { name: "Free Cash Flow", value: "₹42,800 Cr", explain: "Cash left after operating costs and capex — fuel for dividends and growth." },
  { name: "EBITDA", value: "₹61,200 Cr", explain: "Earnings before interest, tax, depreciation, and amortization — operating profitability." },
  { name: "Profit Margin", value: "16.4%", explain: "Net income as a % of revenue — how much of each rupee earned becomes profit." },
];

export interface GlobalMarket { region: string; name: string; value: string; changePct: number }
export const GLOBAL_MARKETS: GlobalMarket[] = [
  { region: "US", name: "S&P 500", value: "5,824.20", changePct: 0.55 },
  { region: "US", name: "NASDAQ", value: "20,114.50", changePct: 0.94 },
  { region: "IN", name: "NIFTY 50", value: "24,856.30", changePct: 0.58 },
  { region: "IN", name: "SENSEX", value: "81,532.70", changePct: -0.27 },
  { region: "EU", name: "FTSE 100", value: "8,342.60", changePct: 0.31 },
  { region: "EU", name: "DAX", value: "20,127.20", changePct: 0.72 },
  { region: "ASIA", name: "Nikkei 225", value: "39,432.10", changePct: 0.14 },
  { region: "ASIA", name: "Hang Seng", value: "20,148.90", changePct: -0.86 },
  { region: "CRYPTO", name: "Bitcoin", value: "$97,320", changePct: 2.1 },
  { region: "CRYPTO", name: "Ethereum", value: "$3,842", changePct: 1.6 },
  { region: "FX", name: "EUR / USD", value: "1.0512", changePct: -0.12 },
  { region: "COMM", name: "Copper", value: "$4.18/lb", changePct: 0.9 },
];
