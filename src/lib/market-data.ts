// Mock financial data for Stocketize AI. Marked as sample data.
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

export type Exchange = "NSE" | "BSE" | "BOTH" | "US";

export interface Shareholder { k: string; v: number; c: string }

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
  exchange: Exchange;
  shareholding: Shareholder[];
}

// Distinct shareholding patterns per company type
const shPromoterHeavy: Shareholder[] = [
  { k: "Promoters", v: 50, c: "var(--teal)" },
  { k: "FII", v: 22, c: "var(--cyan)" },
  { k: "DII", v: 16, c: "var(--aqua)" },
  { k: "Retail", v: 12, c: "var(--lavender)" },
];
const shInstitutional: Shareholder[] = [
  { k: "Institutions", v: 68, c: "var(--teal)" },
  { k: "Insiders", v: 4, c: "var(--cyan)" },
  { k: "Mutual Funds", v: 18, c: "var(--aqua)" },
  { k: "Retail / Other", v: 10, c: "var(--lavender)" },
];
const sh = (p: number, f: number, d: number, r: number): Shareholder[] => [
  { k: "Promoters", v: p, c: "var(--teal)" },
  { k: "FII", v: f, c: "var(--cyan)" },
  { k: "DII", v: d, c: "var(--aqua)" },
  { k: "Retail", v: r, c: "var(--lavender)" },
];

export const COMPANIES: Company[] = [
  {
    ticker: "AAPL", name: "Apple Inc.", sector: "Technology", price: 234.11, change: 2.42, changePct: 1.04,
    marketCap: "$3.55T", pe: 38.4, divYield: 0.44, high52: 237.49, low52: 164.08, sentiment: "Bullish", recommendation: "Buy",
    logo: "AA", color: "#a3a3a3",
    ceo: "Tim Cook", hq: "Cupertino, USA", founded: 1976, revenue: "$391B", netProfit: "$94B", employees: "164,000",
    description: "Designs and markets smartphones, personal computers, tablets, wearables, and services worldwide.",
    competitors: ["Samsung", "Google", "Microsoft"], exchange: "US",
    shareholding: [
      { k: "Institutions", v: 62, c: "var(--teal)" },
      { k: "Insiders", v: 2, c: "var(--cyan)" },
      { k: "Mutual Funds", v: 24, c: "var(--aqua)" },
      { k: "Retail / Other", v: 12, c: "var(--lavender)" },
    ],
  },
  {
    ticker: "MSFT", name: "Microsoft Corp.", sector: "Technology", price: 428.92, change: 3.61, changePct: 0.85,
    marketCap: "$3.18T", pe: 36.1, divYield: 0.72, high52: 468.35, low52: 362.9, sentiment: "Bullish", recommendation: "Buy",
    logo: "MS", color: "#00a4ef",
    ceo: "Satya Nadella", hq: "Redmond, USA", founded: 1975, revenue: "$245B", netProfit: "$88B", employees: "228,000",
    description: "Develops software, cloud services (Azure), productivity tools (Office 365), and enterprise solutions.",
    competitors: ["Amazon AWS", "Google Cloud", "Oracle"], exchange: "US",
    shareholding: shInstitutional,
  },
  {
    ticker: "NVDA", name: "NVIDIA Corp.", sector: "Semiconductors", price: 141.55, change: 4.12, changePct: 3.0,
    marketCap: "$3.47T", pe: 65.2, divYield: 0.03, high52: 152.89, low52: 47.32, sentiment: "Bullish", recommendation: "Buy",
    logo: "NV", color: "#76b900",
    ceo: "Jensen Huang", hq: "Santa Clara, USA", founded: 1993, revenue: "$96B", netProfit: "$53B", employees: "29,600",
    description: "Designs GPUs and AI compute platforms powering gaming, data centers, and generative AI workloads.",
    competitors: ["AMD", "Intel", "Broadcom"], exchange: "US",
    shareholding: [
      { k: "Institutions", v: 66, c: "var(--teal)" },
      { k: "Insiders", v: 4, c: "var(--cyan)" },
      { k: "Mutual Funds", v: 20, c: "var(--aqua)" },
      { k: "Retail / Other", v: 10, c: "var(--lavender)" },
    ],
  },
  {
    ticker: "GOOGL", name: "Alphabet Inc.", sector: "Communication", price: 183.44, change: -0.89, changePct: -0.48,
    marketCap: "$2.25T", pe: 26.8, divYield: 0.42, high52: 201.42, low52: 130.67, sentiment: "Neutral", recommendation: "Hold",
    logo: "GO", color: "#4285f4",
    ceo: "Sundar Pichai", hq: "Mountain View, USA", founded: 1998, revenue: "$307B", netProfit: "$74B", employees: "182,502",
    description: "Parent of Google — search, advertising, YouTube, Android, and cloud infrastructure.",
    competitors: ["Microsoft", "Meta", "Amazon"], exchange: "US",
    shareholding: shInstitutional,
  },
  {
    ticker: "AMZN", name: "Amazon.com", sector: "Consumer Cyclical", price: 213.03, change: 1.55, changePct: 0.73,
    marketCap: "$2.24T", pe: 44.6, divYield: 0, high52: 215.9, low52: 144.05, sentiment: "Bullish", recommendation: "Buy",
    logo: "AM", color: "#ff9900",
    ceo: "Andy Jassy", hq: "Seattle, USA", founded: 1994, revenue: "$574B", netProfit: "$30B", employees: "1,540,000",
    description: "Operates e-commerce marketplaces, AWS cloud services, Prime, advertising, and devices.",
    competitors: ["Walmart", "Microsoft", "Alibaba"], exchange: "US",
    shareholding: shInstitutional,
  },
  {
    ticker: "TSLA", name: "Tesla Inc.", sector: "Automobile", price: 342.03, change: -6.71, changePct: -1.92,
    marketCap: "$1.09T", pe: 96.4, divYield: 0, high52: 358.64, low52: 138.8, sentiment: "Neutral", recommendation: "Hold",
    logo: "TS", color: "#e82127",
    ceo: "Elon Musk", hq: "Austin, USA", founded: 2003, revenue: "$97B", netProfit: "$7.9B", employees: "140,473",
    description: "Manufactures electric vehicles, energy storage, and solar products; develops autonomous driving software.",
    competitors: ["BYD", "Ford", "GM"], exchange: "US",
    shareholding: [
      { k: "Institutions", v: 48, c: "var(--teal)" },
      { k: "Insiders (Elon)", v: 13, c: "var(--cyan)" },
      { k: "Mutual Funds", v: 22, c: "var(--aqua)" },
      { k: "Retail / Other", v: 17, c: "var(--lavender)" },
    ],
  },
  {
    ticker: "RELIANCE", name: "Reliance Industries", sector: "Energy / Conglomerate", price: 1258.4, change: 12.6, changePct: 1.01,
    marketCap: "₹17.02L Cr", pe: 27.3, divYield: 0.79, high52: 1608.8, low52: 1201.5, sentiment: "Neutral", recommendation: "Hold",
    logo: "RI", color: "#0033a0",
    ceo: "Mukesh Ambani", hq: "Mumbai, India", founded: 1966, revenue: "₹9.0L Cr", netProfit: "₹79,000 Cr", employees: "347,000",
    description: "Diversified conglomerate across oil-to-chemicals, retail, digital services (Jio), and new energy.",
    competitors: ["ONGC", "IOC", "BPCL"], exchange: "BOTH",
    shareholding: sh(50, 22, 16, 12),
  },
  {
    ticker: "TCS", name: "Tata Consultancy Services", sector: "IT Services", price: 4128.6, change: 34.2, changePct: 0.84,
    marketCap: "₹14.94L Cr", pe: 30.5, divYield: 1.9, high52: 4592.25, low52: 3423.05, sentiment: "Bullish", recommendation: "Buy",
    logo: "TC", color: "#1f4e79",
    ceo: "K. Krithivasan", hq: "Mumbai, India", founded: 1968, revenue: "₹2.4L Cr", netProfit: "₹46,000 Cr", employees: "607,979",
    description: "Global IT services, consulting, and business solutions across 46 countries.",
    competitors: ["Infosys", "Wipro", "Accenture"], exchange: "BOTH",
    shareholding: sh(72, 13, 8, 7),
  },
  {
    ticker: "INFY", name: "Infosys Ltd.", sector: "IT Services", price: 1875.3, change: 18.7, changePct: 1.01,
    marketCap: "₹7.79L Cr", pe: 28.9, divYield: 2.3, high52: 1990.0, low52: 1358.35, sentiment: "Bullish", recommendation: "Buy",
    logo: "IN", color: "#007cc3",
    ceo: "Salil Parekh", hq: "Bengaluru, India", founded: 1981, revenue: "₹1.6L Cr", netProfit: "₹26,200 Cr", employees: "317,240",
    description: "Global consulting and IT services, with strengths in digital, cloud, and enterprise transformation.",
    competitors: ["TCS", "Wipro", "HCL Tech"], exchange: "BOTH",
    shareholding: sh(15, 33, 38, 14),
  },
  {
    ticker: "HDFCBANK", name: "HDFC Bank", sector: "Banking", price: 1786.9, change: -8.2, changePct: -0.46,
    marketCap: "₹13.64L Cr", pe: 20.4, divYield: 1.1, high52: 1880.0, low52: 1363.55, sentiment: "Neutral", recommendation: "Hold",
    logo: "HD", color: "#ed232a",
    ceo: "Sashidhar Jagdishan", hq: "Mumbai, India", founded: 1994, revenue: "₹2.8L Cr", netProfit: "₹64,000 Cr", employees: "213,000",
    description: "India's largest private-sector bank by assets — retail, wholesale, treasury, and digital banking.",
    competitors: ["ICICI Bank", "SBI", "Axis Bank"], exchange: "BOTH",
    shareholding: sh(0, 47, 34, 19),
  },
  {
    ticker: "ICICIBANK", name: "ICICI Bank", sector: "Banking", price: 1289.5, change: 9.8, changePct: 0.77,
    marketCap: "₹9.09L Cr", pe: 19.2, divYield: 0.78, high52: 1361.35, low52: 970.05, sentiment: "Bullish", recommendation: "Buy",
    logo: "IC", color: "#b02a30",
    ceo: "Sandeep Bakhshi", hq: "Mumbai, India", founded: 1994, revenue: "₹2.4L Cr", netProfit: "₹42,000 Cr", employees: "141,000",
    description: "Private-sector bank with wide retail, corporate, and international presence.",
    competitors: ["HDFC Bank", "SBI", "Axis Bank"], exchange: "BOTH",
    shareholding: sh(0, 45, 42, 13),
  },
  {
    ticker: "SBIN", name: "State Bank of India", sector: "Banking", price: 812.3, change: 4.6, changePct: 0.57,
    marketCap: "₹7.25L Cr", pe: 10.8, divYield: 1.68, high52: 912.0, low52: 599.85, sentiment: "Neutral", recommendation: "Hold",
    logo: "SB", color: "#2b4b91",
    ceo: "C.S. Setty", hq: "Mumbai, India", founded: 1955, revenue: "₹6.6L Cr", netProfit: "₹67,000 Cr", employees: "232,296",
    description: "India's largest public-sector bank with 22,000+ branches and global operations.",
    competitors: ["HDFC Bank", "ICICI Bank", "PNB"], exchange: "BOTH",
    shareholding: sh(57, 10, 24, 9),
  },
  {
    ticker: "LT", name: "Larsen & Toubro", sector: "Infrastructure", price: 3612.7, change: 21.3, changePct: 0.59,
    marketCap: "₹4.97L Cr", pe: 34.6, divYield: 0.75, high52: 3963.5, low52: 3175.05, sentiment: "Bullish", recommendation: "Buy",
    logo: "LT", color: "#0f4c81",
    ceo: "S.N. Subrahmanyan", hq: "Mumbai, India", founded: 1938, revenue: "₹2.2L Cr", netProfit: "₹13,000 Cr", employees: "51,000",
    description: "Engineering, construction, manufacturing, and technology conglomerate.",
    competitors: ["Siemens", "ABB", "BHEL"], exchange: "BOTH",
    shareholding: sh(0, 25, 41, 34),
  },
  {
    ticker: "TATAMOTORS", name: "Tata Motors", sector: "Automobile", price: 784.5, change: -11.2, changePct: -1.41,
    marketCap: "₹2.89L Cr", pe: 10.1, divYield: 0.38, high52: 1179.05, low52: 743.4, sentiment: "Bearish", recommendation: "Hold",
    logo: "TM", color: "#004ea8",
    ceo: "Natarajan Chandrasekaran", hq: "Mumbai, India", founded: 1945, revenue: "₹4.4L Cr", netProfit: "₹31,800 Cr", employees: "82,032",
    description: "Automotive manufacturer of cars, EVs, commercial vehicles, and owner of Jaguar Land Rover.",
    competitors: ["Maruti Suzuki", "M&M", "Hyundai"], exchange: "BOTH",
    shareholding: sh(46, 18, 22, 14),
  },
  {
    ticker: "ASIANPAINT", name: "Asian Paints", sector: "FMCG / Chemicals", price: 2412.3, change: -18.7, changePct: -0.77,
    marketCap: "₹2.31L Cr", pe: 46.7, divYield: 1.35, high52: 3422.9, low52: 2372.35, sentiment: "Bearish", recommendation: "Hold",
    logo: "AP", color: "#e30613",
    ceo: "Amit Syngle", hq: "Mumbai, India", founded: 1942, revenue: "₹35,500 Cr", netProfit: "₹5,460 Cr", employees: "8,300",
    description: "India's largest paint company; decorative and industrial coatings across South Asia.",
    competitors: ["Berger Paints", "Kansai Nerolac", "Akzo Nobel"], exchange: "BOTH",
    shareholding: sh(53, 17, 19, 11),
  },
  // NSE-only listings
  {
    ticker: "ZOMATO", name: "Zomato Ltd.", sector: "Consumer Internet", price: 268.4, change: 5.2, changePct: 1.98,
    marketCap: "₹2.36L Cr", pe: 320.5, divYield: 0, high52: 304.7, low52: 121.65, sentiment: "Bullish", recommendation: "Buy",
    logo: "ZM", color: "#e23744",
    ceo: "Deepinder Goyal", hq: "Gurgaon, India", founded: 2008, revenue: "₹13,545 Cr", netProfit: "₹351 Cr", employees: "6,127",
    description: "Food delivery, quick-commerce (Blinkit), and dining-out platform across India and UAE.",
    competitors: ["Swiggy", "Zepto", "BigBasket"], exchange: "NSE",
    shareholding: sh(0, 55, 21, 24),
  },
  {
    ticker: "PAYTM", name: "One97 Communications", sector: "Fintech", price: 928.1, change: 12.8, changePct: 1.4,
    marketCap: "₹59,100 Cr", pe: 0, divYield: 0, high52: 1062.95, low52: 310.0, sentiment: "Neutral", recommendation: "Hold",
    logo: "PT", color: "#00baf2",
    ceo: "Vijay Shekhar Sharma", hq: "Noida, India", founded: 2010, revenue: "₹9,978 Cr", netProfit: "-₹1,422 Cr", employees: "26,364",
    description: "Digital payments, financial services and merchant platform in India.",
    competitors: ["PhonePe", "Google Pay", "Razorpay"], exchange: "NSE",
    shareholding: sh(9, 62, 12, 17),
  },
  {
    ticker: "NYKAA", name: "FSN E-Commerce (Nykaa)", sector: "Beauty / E-com", price: 178.5, change: -1.4, changePct: -0.78,
    marketCap: "₹51,000 Cr", pe: 1450, divYield: 0, high52: 229.3, low52: 154.05, sentiment: "Neutral", recommendation: "Hold",
    logo: "NY", color: "#fc2779",
    ceo: "Falguni Nayar", hq: "Mumbai, India", founded: 2012, revenue: "₹6,386 Cr", netProfit: "₹40 Cr", employees: "3,738",
    description: "Beauty, personal care and fashion e-commerce platform in India.",
    competitors: ["Myntra", "Purplle", "Amazon Beauty"], exchange: "NSE",
    shareholding: sh(52, 14, 20, 14),
  },
  {
    ticker: "IRCTC", name: "IRCTC", sector: "Travel / PSU", price: 794.2, change: 6.7, changePct: 0.85,
    marketCap: "₹63,540 Cr", pe: 50.2, divYield: 0.85, high52: 1148.6, low52: 728.05, sentiment: "Neutral", recommendation: "Hold",
    logo: "IR", color: "#003a70",
    ceo: "Sanjay Kumar Jain", hq: "New Delhi, India", founded: 1999, revenue: "₹4,270 Cr", netProfit: "₹1,111 Cr", employees: "1,443",
    description: "Indian Railways subsidiary for online ticketing, catering, tourism, and packaged drinking water.",
    competitors: ["MakeMyTrip", "EaseMyTrip", "Yatra"], exchange: "NSE",
    shareholding: sh(62, 9, 16, 13),
  },
  // BSE-only or BSE-prominent listings
  {
    ticker: "BAJFINANCE", name: "Bajaj Finance", sector: "NBFC", price: 6812.5, change: 42.1, changePct: 0.62,
    marketCap: "₹4.22L Cr", pe: 30.8, divYield: 0.53, high52: 7830.0, low52: 6187.6, sentiment: "Bullish", recommendation: "Buy",
    logo: "BF", color: "#005baa",
    ceo: "Rajeev Jain", hq: "Pune, India", founded: 1987, revenue: "₹54,000 Cr", netProfit: "₹14,451 Cr", employees: "56,573",
    description: "Diversified NBFC offering consumer finance, SME loans, wealth and rural lending.",
    competitors: ["Bajaj Finserv", "Cholamandalam", "HDFC AMC"], exchange: "BSE",
    shareholding: sh(54, 21, 15, 10),
  },
  {
    ticker: "HINDUNILVR", name: "Hindustan Unilever", sector: "FMCG", price: 2412.7, change: -14.3, changePct: -0.59,
    marketCap: "₹5.67L Cr", pe: 55.3, divYield: 1.85, high52: 3035.0, low52: 2172.05, sentiment: "Neutral", recommendation: "Hold",
    logo: "HU", color: "#1f3864",
    ceo: "Rohit Jawa", hq: "Mumbai, India", founded: 1933, revenue: "₹60,469 Cr", netProfit: "₹10,277 Cr", employees: "21,000",
    description: "India's largest FMCG company — home care, beauty & personal care, foods & refreshments.",
    competitors: ["Nestle", "Dabur", "P&G"], exchange: "BSE",
    shareholding: sh(62, 14, 17, 7),
  },
  {
    ticker: "MARUTI", name: "Maruti Suzuki", sector: "Automobile", price: 11256.4, change: 82.7, changePct: 0.74,
    marketCap: "₹3.54L Cr", pe: 26.9, divYield: 1.1, high52: 13675.0, low52: 10225.05, sentiment: "Bullish", recommendation: "Buy",
    logo: "MU", color: "#c8102e",
    ceo: "Hisashi Takeuchi", hq: "New Delhi, India", founded: 1981, revenue: "₹1.42L Cr", netProfit: "₹13,209 Cr", employees: "40,000",
    description: "India's largest carmaker by volume; a subsidiary of Suzuki Motor Corporation.",
    competitors: ["Hyundai", "Tata Motors", "Mahindra"], exchange: "BSE",
    shareholding: sh(58, 20, 15, 7),
  },
  {
    ticker: "ITC", name: "ITC Ltd.", sector: "Diversified / FMCG", price: 468.9, change: 3.4, changePct: 0.73,
    marketCap: "₹5.86L Cr", pe: 27.1, divYield: 3.2, high52: 528.55, low52: 399.35, sentiment: "Neutral", recommendation: "Hold",
    logo: "IT", color: "#f2a900",
    ceo: "Sanjiv Puri", hq: "Kolkata, India", founded: 1910, revenue: "₹70,928 Cr", netProfit: "₹20,458 Cr", employees: "23,554",
    description: "Cigarettes, FMCG, hotels, paperboards, packaging, and agri-business.",
    competitors: ["HUL", "Godfrey Phillips", "Dabur"], exchange: "BSE",
    shareholding: sh(0, 43, 41, 16),
  },
  {
    ticker: "WIPRO", name: "Wipro Ltd.", sector: "IT Services", price: 302.7, change: 1.2, changePct: 0.4,
    marketCap: "₹3.17L Cr", pe: 22.7, divYield: 0.33, high52: 320.4, low52: 208.5, sentiment: "Neutral", recommendation: "Hold",
    logo: "WI", color: "#341f65",
    ceo: "Srinivas Pallia", hq: "Bengaluru, India", founded: 1945, revenue: "₹89,760 Cr", netProfit: "₹11,045 Cr", employees: "230,000",
    description: "Global IT, consulting and business process services company.",
    competitors: ["TCS", "Infosys", "HCL"], exchange: "BSE",
    shareholding: sh(72.9, 8.7, 10.5, 7.9),
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
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=70",
  },
  {
    title: "NVIDIA guides above consensus on Blackwell demand",
    summary: "Data-center revenue climbs to record as hyperscalers extend AI infrastructure buildout into 2026.",
    source: "Bloomberg", time: "34 min ago", category: "Tech",
    image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=800&q=70",
  },
  {
    title: "RBI keeps repo rate steady, flags food inflation risks",
    summary: "MPC votes 5-1 to hold at 6.5%; retail inflation trajectory remains a key monitorable ahead of the next review.",
    source: "Mint", time: "1 hr ago", category: "India",
    image: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=800&q=70",
  },
  {
    title: "Oil edges higher on OPEC+ production discipline",
    summary: "Brent trades near $74 as producers reaffirm voluntary cuts through Q1 2026.",
    source: "CNBC", time: "2 hr ago", category: "Commodities",
    image: "https://images.unsplash.com/photo-1615751072497-5f5169febe17?auto=format&fit=crop&w=800&q=70",
  },
  {
    title: "Indian IT firms raise FY26 guidance on discretionary spend revival",
    summary: "TCS and Infosys point to stronger BFSI deal pipelines in North America and Europe.",
    source: "Economic Times", time: "3 hr ago", category: "India",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=70",
  },
  {
    title: "Gold hits fresh highs as central banks add to reserves",
    summary: "Spot gold above $2,680/oz on sustained EM central-bank buying and softer real yields.",
    source: "Financial Times", time: "5 hr ago", category: "Commodities",
    image: "https://images.unsplash.com/photo-1610375461369-d613b564f4c4?auto=format&fit=crop&w=800&q=70",
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
];

export interface IPO {
  name: string; status: "Upcoming" | "Open" | "Closed"; band: string; gmp: string; sub: string; date: string; color: string;
}
export const IPOS: IPO[] = [
  // Upcoming
  { name: "Vishal Mega Mart", status: "Upcoming", band: "₹74-78", gmp: "+₹18", sub: "—", date: "Dec 11-13", color: "#f97316" },
  { name: "Ather Energy", status: "Upcoming", band: "₹302-321", gmp: "+₹42", sub: "—", date: "Dec 16-18", color: "#22c55e" },
  { name: "Zepto (Kiranakart)", status: "Upcoming", band: "₹385-410", gmp: "+₹68", sub: "—", date: "Dec 19-21", color: "#a855f7" },
  { name: "Ola Consumer", status: "Upcoming", band: "₹212-228", gmp: "+₹31", sub: "—", date: "Dec 23-26", color: "#0ea5e9" },
  // Open
  { name: "Mobikwik", status: "Open", band: "₹265-279", gmp: "+₹135", sub: "12.4x", date: "Closes Dec 13", color: "#3b82f6" },
  { name: "InventurusKnowledge", status: "Open", band: "₹1265-1329", gmp: "+₹210", sub: "3.8x", date: "Closes Dec 13", color: "#22c55e" },
  { name: "Emcure Pharma", status: "Open", band: "₹960-1008", gmp: "+₹82", sub: "6.1x", date: "Closes Dec 14", color: "#f59e0b" },
  { name: "Bajaj Housing Finance", status: "Open", band: "₹66-70", gmp: "+₹58", sub: "18.7x", date: "Closes Dec 15", color: "#0f4c81" },
  // Closed
  { name: "Sai Life Sciences", status: "Closed", band: "₹522-549", gmp: "+₹32", sub: "10.3x", date: "Lists Dec 18", color: "#a855f7" },
  { name: "International Gemmological", status: "Closed", band: "₹397-417", gmp: "+₹165", sub: "35.5x", date: "Listed", color: "#eab308" },
  { name: "NTPC Green Energy", status: "Closed", band: "₹102-108", gmp: "+₹12", sub: "2.5x", date: "Listed", color: "#16a34a" },
  { name: "Swiggy", status: "Closed", band: "₹371-390", gmp: "+₹18", sub: "3.6x", date: "Listed", color: "#fc8019" },
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
  { region: "US", name: "Russell 2000", value: "2,412.85", changePct: 0.42 },
  { region: "US", name: "VIX", value: "14.20", changePct: -3.15 },
  { region: "IN", name: "NIFTY 50", value: "24,856.30", changePct: 0.58 },
  { region: "IN", name: "SENSEX", value: "81,532.70", changePct: -0.27 },
  { region: "IN", name: "Bank Nifty", value: "52,418.90", changePct: 0.60 },
  { region: "IN", name: "Nifty IT", value: "43,825.10", changePct: 1.12 },
  { region: "EU", name: "FTSE 100", value: "8,342.60", changePct: 0.31 },
  { region: "EU", name: "DAX", value: "20,127.20", changePct: 0.72 },
  { region: "EU", name: "CAC 40", value: "7,412.30", changePct: 0.28 },
  { region: "ASIA", name: "Nikkei 225", value: "39,432.10", changePct: 0.14 },
  { region: "ASIA", name: "Hang Seng", value: "20,148.90", changePct: -0.86 },
  { region: "ASIA", name: "Shanghai Comp.", value: "3,412.55", changePct: 0.32 },
  { region: "CRYPTO", name: "Bitcoin", value: "$97,320", changePct: 2.1 },
  { region: "CRYPTO", name: "Ethereum", value: "$3,842", changePct: 1.6 },
  { region: "CRYPTO", name: "Solana", value: "$236.40", changePct: 3.8 },
  { region: "FX", name: "EUR / USD", value: "1.0512", changePct: -0.12 },
  { region: "FX", name: "GBP / USD", value: "1.2685", changePct: 0.18 },
  { region: "FX", name: "USD / JPY", value: "149.85", changePct: 0.24 },
  { region: "COMM", name: "Copper", value: "$4.18/lb", changePct: 0.9 },
  { region: "COMM", name: "Natural Gas", value: "$3.42/MMBtu", changePct: -1.4 },
];
