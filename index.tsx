import { useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useAuth } from "@/lib/useAuth";
import {
  Search, Moon, Sun, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight,
  Activity, Sparkles, BarChart3, LineChart, CandlestickChart, Newspaper,
  Rocket, GraduationCap, Globe2, Brain, Mail, MessageCircle, Phone,
  ShieldCheck, Zap, ChevronRight, LayoutDashboard, Building2, AreaChart, LogOut,
  CheckCircle2, BellOff,
} from "lucide-react";
import { Sparkline, fmt } from "@/components/sparkline";
import {
  MARKET_INDICES, COMPANIES, NEWS, ECON_EVENTS, FUNDS, SECTORS, RATIOS, GLOBAL_MARKETS,
  COMPANIES_DATA, SECTORS_DATA, NEWS_DATA, ALL_IPOS_DATA, FUNDS_DATA, RATIOS_DATA,
  type Shareholder,
} from "@/lib/market-data";
import { subscribeToNewsletter } from "@/lib/newsletter.functions";

const OWNER = {
  name: "Yashvi Rawal",
  email: "yashvirawal86@gmail.com",
  linkedin: "https://www.linkedin.com/in/yashvi-rawal",
  youtube: "https://www.youtube.com/@Yashvi-Rawal",
  instagram: "https://www.instagram.com/",
  site: "www.yr.stocketize.com",
  whatsapp: "https://wa.me/919550541145",
  whatsappDisplay: "+91 9550541145",
  phone: "9550541145",
};

const yahooQuote = (t: string) => `https://finance.yahoo.com/quote/${encodeURIComponent((t || "").replace(/\./g,"-"))}`;
const googleNews = (q: string) => `https://www.google.com/search?tbm=nws&q=${encodeURIComponent(q || "")}`;
const investopedia = (q: string) => `https://www.investopedia.com/search?q=${encodeURIComponent(q || "")}`;

/* ── 18 IPOs (6 each) ── */
const ALL_IPOS = [
  { name:"Swiggy Ltd",           date:"Jul 18–20", band:"₹390–410",  gmp:"+₹65",  sub:"—",    status:"Upcoming", color:"#f97316" },
  { name:"Ola Electric",         date:"Jul 19–21", band:"₹72–76",    gmp:"+₹18",  sub:"—",    status:"Upcoming", color:"#8b5cf6" },
  { name:"FirstCry",             date:"Jul 22–24", band:"₹440–465",  gmp:"+₹48",  sub:"—",    status:"Upcoming", color:"#ec4899" },
  { name:"Afcons Infrastructure",date:"Jul 25–27", band:"₹440–463",  gmp:"+₹30",  sub:"—",    status:"Upcoming", color:"#06b6d4" },
  { name:"Vishal Mega Mart",     date:"Jul 28–30", band:"₹74–78",    gmp:"+₹12",  sub:"—",    status:"Upcoming", color:"#10b981" },
  { name:"Mobikwik",             date:"Aug 01–03", band:"₹235–279",  gmp:"+₹22",  sub:"—",    status:"Upcoming", color:"#f59e0b" },
  { name:"Bajaj Housing Finance",date:"Jul 09–11", band:"₹66–70",    gmp:"+₹52",  sub:"8.2x", status:"Open",     color:"#3b82f6" },
  { name:"Waaree Energies",      date:"Jul 08–10", band:"₹1427–1503",gmp:"+₹210", sub:"6.7x", status:"Open",     color:"#22c55e" },
  { name:"Hyundai India",        date:"Jul 09–12", band:"₹1865–1960",gmp:"+₹95",  sub:"2.4x", status:"Open",     color:"#ef4444" },
  { name:"NTPC Green Energy",    date:"Jul 10–12", band:"₹102–108",  gmp:"+₹28",  sub:"4.1x", status:"Open",     color:"#14b8a6" },
  { name:"Sagility India",       date:"Jul 09–11", band:"₹28–30",    gmp:"+₹8",   sub:"3.2x", status:"Open",     color:"#a855f7" },
  { name:"Acme Solar",           date:"Jul 10–13", band:"₹275–289",  gmp:"+₹35",  sub:"5.8x", status:"Open",     color:"#f97316" },
  { name:"Brainbees Solutions",  date:"Jun 23–25", band:"₹440–465",  gmp:"+₹62",  sub:"12.5x",status:"Closed",   color:"#ec4899" },
  { name:"Emcure Pharma",        date:"Jun 20–22", band:"₹960–1008", gmp:"+₹180", sub:"9.8x", status:"Closed",   color:"#06b6d4" },
  { name:"Ola Cabs",             date:"Jun 18–20", band:"₹72–76",    gmp:"+₹14",  sub:"4.3x", status:"Closed",   color:"#8b5cf6" },
  { name:"Vraj Iron & Steel",    date:"Jun 17–19", band:"₹195–207",  gmp:"+₹45",  sub:"17.2x",status:"Closed",   color:"#f59e0b" },
  { name:"Stanley Lifestyles",   date:"Jun 14–18", band:"₹351–369",  gmp:"+₹55",  sub:"7.6x", status:"Closed",   color:"#10b981" },
  { name:"DEE Development",      date:"Jun 12–14", band:"₹193–203",  gmp:"+₹28",  sub:"5.1x", status:"Closed",   color:"#ef4444" },
];

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: "Stocketize AI — Indian Stock Market Intelligence, News & Learning" },
      { name:"description", content:"Live NSE & BSE market data, Nifty 50 & Sensex, company deep dives, IPOs, mutual funds, financial ratios and beginner-friendly investing education." },
      { name:"keywords", content:"Indian stock market, NSE, BSE, Nifty 50, Sensex, IPO, mutual funds, share market news, stock analysis, investing for beginners, Stocketize AI" },
      { property:"og:type", content:"website" },
      { property:"og:title", content:"Stocketize AI — Indian Stock Market Intelligence" },
      { property:"og:site_name", content:"Stocketize AI" },
    ],
    links:[{ rel:"canonical", href:"/" }],
  }),
});

/* ── Theme ── */
function useTheme() {
  const [light, setLight] = useState(false);
  useEffect(() => { document.documentElement.classList.toggle("light", light); }, [light]);
  return { light, toggle: () => setLight(x => !x) };
}

/* ── Header ── */
function Header({ light, toggle }: { light:boolean; toggle:()=>void }) {
  const nav = ["Home","Markets","Companies","News","About"];
  const [scrolled, setScrolled] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 20);
    on(); window.addEventListener("scroll", on);
    return () => window.removeEventListener("scroll", on);
  }, []);
  const handleSignOut = async () => { await signOut(); navigate({ to:"/auth" }); };
  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all ${scrolled?"py-2":"py-4"}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className={`glass-strong rounded-2xl px-3 sm:px-5 py-2.5 flex items-center gap-3 ${scrolled?"glow-cyan":""}`}>
          <a href="#home" className="flex items-center gap-2 shrink-0">
            <div className="relative h-9 w-9 rounded-xl gradient-brand grid place-items-center glow-cyan">
              <Activity className="h-4 w-4 text-[color:var(--midnight)]" strokeWidth={3}/>
            </div>
            <div className="hidden sm:block leading-tight">
              <div className="font-display font-bold text-[15px] tracking-tight">Stocketize<span className="gradient-text"> AI</span></div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-widest">Market Intelligence</div>
            </div>
          </a>
          <nav className="hidden lg:flex items-center gap-1 ml-4">
            {nav.map(n => (
              <a key={n} href={`#${n.toLowerCase()}`} className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground rounded-lg hover:bg-white/5 transition">{n}</a>
            ))}
          </nav>
          <div className="flex-1"/>
          <SmartSearch/>
          <button onClick={toggle} aria-label="Toggle theme" className="h-9 w-9 grid place-items-center rounded-xl glass hover:border-[color:var(--cyan)]/40 transition">
            {light ? <Moon className="h-4 w-4"/> : <Sun className="h-4 w-4"/>}
          </button>
          {user && (
            <div className="flex items-center gap-2">
              <span className="hidden sm:block text-xs text-white/40 max-w-[120px] truncate">{user.user_metadata?.full_name || user.email}</span>
              <button onClick={handleSignOut} title="Sign out" className="h-9 px-3 flex items-center gap-1.5 rounded-xl glass hover:border-red-500/40 hover:text-red-400 text-sm font-semibold transition shrink-0">
                <LogOut className="h-4 w-4"/><span className="hidden sm:inline">Sign out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function Modal({ children, onClose }: { children:React.ReactNode; onClose:()=>void }) {
  return (
    <div className="fixed inset-0 z-[100] grid place-items-center p-4 bg-[color:var(--midnight)]/70 backdrop-blur-sm animate-in fade-in" onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} className="glass-strong rounded-2xl w-full max-w-md p-6 sm:p-8 relative">
        <button aria-label="Close" onClick={onClose} className="absolute top-3 right-3 h-8 w-8 grid place-items-center rounded-lg hover:bg-white/10 transition text-muted-foreground">✕</button>
        {children}
      </div>
    </div>
  );
}

/* ── Smart Search ── */
function SmartSearch() {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const fn = (e:MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);
  type Hit = { label:string; sub:string; type:string; href:string; external?:boolean };
  const results: Hit[] = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return [];
    const hits: Hit[] = [];
    COMPANIES_DATA?.forEach(c => {
      if (c?.name?.toLowerCase().includes(term)||c?.ticker?.toLowerCase().includes(term)||c?.sector?.toLowerCase().includes(term))
        hits.push({ label:c.name || "", sub:`${c.ticker || ""} • ${c.sector || ""}`, type:"Company", href:"/#companies" });
    });
    SECTORS_DATA?.forEach(s => {
      if (s?.name?.toLowerCase().includes(term)) hits.push({ label:s.name || "", sub:"Sector heatmap", type:"Sector", href:"/#markets" });
    });
    NEWS_DATA?.forEach(n => {
      if (n?.title?.toLowerCase().includes(term)||n?.category?.toLowerCase().includes(term))
        hits.push({ label:n.title || "", sub:`${n.source || ""} • ${n.category || ""}`, type:"News", href:googleNews(n.title || ""), external:true });
    });
    ALL_IPOS_DATA?.forEach(i => {
      if (i?.name?.toLowerCase().includes(term)||i?.ticker?.toLowerCase().includes(term))
        hits.push({ label:i.name || "", sub:`${i.ticker || ""} • Upcoming IPO`, type:"IPO", href:"/#ipos" });
    });
    FUNDS_DATA?.forEach(f => {
      if (f?.name?.toLowerCase().includes(term)||f?.ticker?.toLowerCase().includes(term))
        hits.push({ label:f.name || "", sub:`${f.ticker || ""} • Mutual Fund`, type:"Fund", href:"/#funds" });
    });
    RATIOS_DATA?.forEach(r => {
      if (r?.name?.toLowerCase().includes(term))
        hits.push({ label:r.name || "", sub:"Financial Ratio", type:"Ratio", href:"/#ratios" });
    });
    return hits.slice(0,8);
  },[q]);
  return (
    <div ref={ref} className="relative hidden md:block">
      <div className="flex items-center gap-2 glass rounded-xl px-3 py-1.5 w-64">
        <Search className="h-4 w-4 text-muted-foreground shrink-0"/>
        <input value={q} onChange={e=>{setQ(e.target.value);setOpen(true);}} onFocus={()=>setOpen(true)}
          placeholder="Search companies, sectors, IPOs…" className="bg-transparent outline-none text-sm flex-1 min-w-0 placeholder:text-muted-foreground/70"/>
      </div>
      {open && q.trim() && (
        <div className="absolute right-0 mt-2 w-[420px] max-w-[92vw] glass-strong rounded-2xl p-2 shadow-2xl z-[80] max-h-[70vh] overflow-y-auto">
          {results.length===0 ? <div className="p-4 text-sm text-muted-foreground text-center">No matches for "{q}".</div>
            : results.map((r,i) => (
              <a key={i} href={r.href} target={r.external?"_blank":undefined} rel={r.external?"noreferrer noopener":undefined}
                onClick={()=>setOpen(false)} className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/5 transition">
                <span className="text-[10px] uppercase tracking-widest text-[color:var(--cyan)] font-semibold shrink-0 mt-0.5 w-14">{r.type}</span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium truncate">{r.label}</span>
                  <span className="block text-[11px] text-muted-foreground truncate">{r.sub}</span>
                </span>
                <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5"/>
              </a>
            ))}
        </div>
      )}
    </div>
  );
}

function Field({ label, value, onChange, type="text", placeholder, required }:
  { label:string; value:string; onChange:(v:string)=>void; type?:string; placeholder?:string; required?:boolean }) {
  return (
    <div>
      <label className="text-[11px] uppercase tracking-widest text-muted-foreground font-semibold">{label}</label>
      <input type={type} required={required} placeholder={placeholder} value={value} onChange={e=>onChange(e.target.value)}
        className="mt-1 w-full h-11 px-3 rounded-xl glass bg-transparent border border-white/10 focus:border-[color:var(--cyan)]/50 outline-none text-sm"/>
    </div>
  );
}

/* ── Hero ── */
function Hero() {
  const tickers = [...MARKET_INDICES,...MARKET_INDICES];
  return (
    <section id="home" className="relative pt-32 pb-20 overflow-hidden">
      <div className="absolute inset-0 animate-grid opacity-30 pointer-events-none"/>
      <div className="absolute -top-20 -right-20 h-96 w-96 rounded-full bg-[color:var(--cyan)]/20 blur-[120px] pointer-events-none"/>
      <div className="absolute top-40 -left-20 h-96 w-96 rounded-full bg-[color:var(--aqua)]/15 blur-[120px] pointer-events-none"/>
      <div className="absolute inset-0 pointer-events-none">
        {[{l:"12%",t:"22%",d:"0s"},{l:"82%",t:"28%",d:"1.5s"},{l:"18%",t:"70%",d:"3s"},{l:"88%",t:"68%",d:"2s"}].map((p,i)=>(
          <div key={i} className="animate-float absolute opacity-40" style={{left:p.l,top:p.t,animationDelay:p.d}}>
            <CandlestickChart className="h-10 w-10 text-[color:var(--cyan)]"/>
          </div>
        ))}
      </div>
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 glass rounded-full px-3 py-1.5 text-xs text-muted-foreground mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--gain)] animate-pulse-glow"/>
              Live Market Data • Educational Platform
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05]">
              Real-Time Stock Market{" "}<span className="gradient-text">Intelligence</span> for Smarter Learning
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-xl">
              Track live markets, discover company insights, analyze financial data, and stay updated with breaking market news — all in one place.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#markets" className="group inline-flex items-center gap-2 h-12 px-5 rounded-xl gradient-brand text-[color:var(--midnight)] font-semibold hover:opacity-90 transition glow-cyan">
                Explore Markets <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition"/>
              </a>
              <a href="#dashboard" className="inline-flex items-center gap-2 h-12 px-5 rounded-xl glass hover:border-[color:var(--cyan)]/40 transition font-medium">
                <LayoutDashboard className="h-4 w-4"/> Live Dashboard
              </a>
            </div>
            <div className="mt-10 grid grid-cols-3 gap-3 max-w-md">
              {[{k:"10K+",v:"Instruments"},{k:"25+",v:"Global Markets"},{k:"Live",v:"Data Refresh"}].map(s=>(
                <div key={s.v} className="glass rounded-xl px-4 py-3">
                  <div className="text-lg sm:text-xl font-bold gradient-text">{s.k}</div>
                  <div className="text-[11px] uppercase tracking-wide text-muted-foreground">{s.v}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="glass-strong rounded-3xl p-5 hover-lift">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-widest">NIFTY 50</div>
                  <div className="flex items-baseline gap-2">
                    <div className="font-mono text-2xl font-bold">24,856.30</div>
                    <div className="text-sm font-semibold text-[color:var(--gain)] flex items-center gap-0.5">
                      <TrendingUp className="h-3.5 w-3.5"/> +0.58%
                    </div>
                  </div>
                </div>
                <div className="flex gap-1">
                  {["1D","1W","1M","1Y"].map((r,i)=>(
                    <button key={r} className={`px-2.5 py-1 text-xs rounded-md ${i===2?"bg-[color:var(--cyan)]/20 text-[color:var(--cyan)]":"text-muted-foreground hover:bg-white/5"}`}>{r}</button>
                  ))}
                </div>
              </div>
              <HeroChart/>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                {[{k:"Open",v:"24,714"},{k:"High",v:"24,912"},{k:"Low",v:"24,689"}].map(x=>(
                  <div key={x.k} className="glass rounded-lg py-2">
                    <div className="text-[10px] uppercase text-muted-foreground">{x.k}</div>
                    <div className="font-mono text-sm">{x.v}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 glass-strong rounded-2xl p-3 hidden sm:flex items-center gap-2 glow-cyan animate-float">
              <Sparkles className="h-4 w-4 text-[color:var(--aqua)]"/>
              <span className="text-xs">AI Analysis Active</span>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-16 relative overflow-hidden border-y border-white/10 py-3 glass">
        <div className="flex gap-8 animate-ticker whitespace-nowrap">
          {tickers.map((t,i)=>(
            <div key={i} className="flex items-center gap-2 text-sm">
              <span className="font-semibold">{t.name}</span>
              <span className="font-mono">{fmt(t.price)}</span>
              <span className={`font-mono text-xs ${t.change>=0?"text-[color:var(--gain)]":"text-[color:var(--loss)]"}`}>
                {t.change>=0?"▲":"▼"} {fmt(Math.abs(t.changePct))}%
              </span>
              <span className="text-muted-foreground">•</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HeroChart() {
  const pts = useMemo(()=>{
    const arr:number[]=[]; let v=100;
    for(let i=0;i<60;i++){v=v*(1+(Math.random()-0.48)*0.02);arr.push(v);}
    return arr;
  },[]);
  const w=460,h=180,min=Math.min(...pts),max=Math.max(...pts),step=w/(pts.length-1);
  const line=pts.map((v,i)=>`${i*step},${h-((v-min)/(max-min))*(h-20)-10}`).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-40">
      <defs>
        <linearGradient id="heroGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--cyan)" stopOpacity="0.5"/>
          <stop offset="100%" stopColor="var(--cyan)" stopOpacity="0"/>
        </linearGradient>
      </defs>
      {[0.25,0.5,0.75].map(y=>(
        <line key={y} x1="0" y1={h*y} x2={w} y2={h*y} stroke="currentColor" strokeOpacity="0.08" strokeDasharray="2 4"/>
      ))}
      <path d={`M0,${h} L ${line} L ${w},${h} Z`} fill="url(#heroGrad)"/>
      <polyline points={line} fill="none" stroke="var(--cyan)" strokeWidth="2"/>
      <circle cx={(pts.length-1)*step} cy={h-((pts[pts.length-1]-min)/(max-min))*(h-20)-10} r="4" fill="var(--aqua)"/>
      <circle cx={(pts.length-1)*step} cy={h-((pts[pts.length-1]-min)/(max-min))*(h-20)-10} r="8" fill="var(--aqua)" opacity="0.3" className="animate-pulse-glow"/>
    </svg>
  );
}

function SectionTitle({ eyebrow, title, subtitle, id }:{ eyebrow?:string; title:React.ReactNode; subtitle?:string; id?:string }) {
  return (
    <div id={id} className="mb-10 max-w-3xl">
      {eyebrow && <div className="text-xs uppercase tracking-[0.2em] text-[color:var(--cyan)] mb-3 font-semibold">{eyebrow}</div>}
      <h2 className="text-3xl sm:text-4xl font-bold leading-tight">{title}</h2>
      {subtitle && <p className="mt-3 text-muted-foreground text-base sm:text-lg">{subtitle}</p>}
    </div>
  );
}

/* ── Live Dashboard ── */
type LiveQ = { symbol:string; name:string; price:number; change:number; changePct:number; high:number; low:number; };
const SYM_MAP:Record<string,string> = {
  "^NSEI":"NIFTY 50","^BSESN":"SENSEX","^NSEBANK":"BANK NIFTY","^CNXIT":"NIFTY IT",
  "^DJI":"Dow Jones","^IXIC":"NASDAQ","^GSPC":"S&P 500","GC=F":"Gold","CL=F":"Crude Oil","USDINR=X":"USD/INR",
};

function LiveDashboard() {
  const [quotes, setQuotes] = useState<LiveQ[]>([]);
  const [lastUpdate, setLastUpdate] = useState("");
  const [isLive, setIsLive] = useState(false);
  const [tick, setTick] = useState(0);

  const tryFetch = async () => {
    try {
      const syms = Object.keys(SYM_MAP).join(",");
      const res = await fetch(
        `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${syms}&fields=regularMarketPrice,regularMarketChange,regularMarketChangePercent,regularMarketDayHigh,regularMarketDayLow`,
        { headers:{"User-Agent":"Mozilla/5.0"} }
      );
      if (!res.ok) throw new Error();
      const json = await res.json();
      const results = json?.quoteResponse?.result ?? [];
      if (results.length > 0) {
        setQuotes(results.map((q:any)=>({
          symbol:q.symbol, name:SYM_MAP[q.symbol]??q.shortName??q.symbol,
          price:q.regularMarketPrice??0, change:q.regularMarketChange??0,
          changePct:q.regularMarketChangePercent??0,
          high:q.regularMarketDayHigh??0, low:q.regularMarketDayLow??0,
        })));
        setIsLive(true);
        setLastUpdate(new Date().toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"}));
      }
    } catch { setIsLive(false); }
  };

  useEffect(()=>{
    tryFetch();
    const liveId = setInterval(tryFetch,60_000);
    const tickId = setInterval(()=>setTick(t=>t+1),3500);
    return ()=>{ clearInterval(liveId); clearInterval(tickId); };
  },[]);

  const display = quotes.length > 0 ? quotes : MARKET_INDICES.map(m=>({
    symbol:m.symbol, name:m.name,
    price:m.price*(1+Math.sin((tick+m.symbol.length)*1.3)*0.001),
    change:m.change, changePct:m.changePct, high:m.price*1.012, low:m.price*0.988,
  }));

  return (
    <section className="relative py-20 mx-auto max-w-7xl px-4 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-10" id="dashboard">
        <SectionTitle eyebrow="Live Dashboard" title={<>The Market at a <span className="gradient-text">Glance</span></>}
          subtitle="Real-time snapshots of global indices, commodities, and FX. Refreshes every 60 seconds."/>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className={`h-1.5 w-1.5 rounded-full animate-pulse-glow ${isLive?"bg-[color:var(--gain)]":"bg-yellow-400"}`}/>
          {isLive ? `Live • Updated ${lastUpdate}` : "Simulated • Markets may be closed"}
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {display.map(m=>{
          const up = m.change>=0;
          const isINR = ["^NSEI","^BSESN","^NSEBANK","^CNXIT"].includes(m.symbol);
          const cur = isINR ? "₹" : "";
          return (
            <div key={m.symbol} className="group glass rounded-2xl p-4 hover-lift">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{m.symbol.replace(/[\^=]/g,"").replace(/F$/,"")}</div>
                  <div className="text-sm font-semibold leading-tight">{m.name}</div>
                </div>
                <div className={`h-7 w-7 rounded-lg grid place-items-center ${up?"bg-[color:var(--gain)]/10 text-[color:var(--gain)]":"bg-[color:var(--loss)]/10 text-[color:var(--loss)]"}`}>
                  {up ? <TrendingUp className="h-3.5 w-3.5"/> : <TrendingDown className="h-3.5 w-3.5"/>}
                </div>
              </div>
              <div className="font-mono text-lg font-bold">{cur}{fmt(m.price)}</div>
              <div className={`text-xs font-medium mt-0.5 ${up?"text-[color:var(--gain)]":"text-[color:var(--loss)]"}`}>
                {up?"+":""}{fmt(m.change)} ({up?"+":""}{fmt(m.changePct)}%)
              </div>
              <div className="mt-2 grid grid-cols-2 gap-1 text-[10px] text-muted-foreground">
                <span>H: {fmt(m.high)}</span><span>L: {fmt(m.low)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ── Trending ── */
function Trending() {
  return (
    <section className="relative py-20 mx-auto max-w-7xl px-4 sm:px-6">
      <SectionTitle eyebrow="Trending Stocks" id="companies"
        title={<>Blue-Chip <span className="gradient-text">Movers</span> Today</>}
        subtitle="Fundamentals and sentiment at a glance across global and Indian large-caps. For information only — not investment advice."/>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {COMPANIES.slice(0,9).map(c=><StockCard key={c.ticker} c={c}/>)}
      </div>
    </section>
  );
}

function StockCard({ c }:{ c:(typeof COMPANIES)[number] }) {
  const up = c.change>=0;
  const recColor = c.recommendation==="Buy"?"text-[color:var(--gain)] bg-[color:var(--gain)]/10":c.recommendation==="Sell"?"text-[color:var(--loss)] bg-[color:var(--loss)]/10":"text-[color:var(--lavender)] bg-white/5";
  return (
    <div className="glass rounded-2xl p-5 hover-lift">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-11 w-11 rounded-xl grid place-items-center font-bold text-white shrink-0" style={{background:c.color}}>{c.logo}</div>
          <div className="min-w-0">
            <div className="font-semibold truncate">{c.name}</div>
            <div className="text-xs text-muted-foreground">{c.ticker} • {c.sector}</div>
          </div>
        </div>
        <span className={`text-[10px] font-semibold px-2 py-1 rounded-md ${recColor}`}>{c.recommendation}</span>
      </div>
      <div className="flex items-baseline justify-between mb-4">
        <div className="font-mono text-xl font-bold">{c.ticker.length>4?"₹":"$"}{fmt(c.price)}</div>
        <div className={`text-sm font-semibold ${up?"text-[color:var(--gain)]":"text-[color:var(--loss)]"} flex items-center gap-0.5`}>
          {up?<ArrowUpRight className="h-4 w-4"/>:<ArrowDownRight className="h-4 w-4"/>}
          {up?"+":""}{fmt(c.changePct)}%
        </div>
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
        <Meta k="Market Cap" v={c.marketCap}/>
        <Meta k="P / E" v={fmt(c.pe)}/>
        <Meta k="Div. Yield" v={`${fmt(c.divYield)}%`}/>
        <Meta k="Sentiment" v={c.sentiment} tone={c.sentiment==="Bullish"?"up":c.sentiment==="Bearish"?"down":"n"}/>
        <Meta k="52W High" v={c.ticker.length>4?`₹${fmt(c.high52)}`:`$${fmt(c.high52)}`}/>
        <Meta k="52W Low"  v={c.ticker.length>4?`₹${fmt(c.low52)}`:`$${fmt(c.low52)}`}/>
      </div>
    </div>
  );
}

function Meta({ k, v, tone }:{ k:string; v:string; tone?:"up"|"down"|"n" }) {
  const c = tone==="up"?"text-[color:var(--gain)]":tone==="down"?"text-[color:var(--loss)]":"";
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wide text-muted-foreground">{k}</div>
      <div className={`font-mono text-sm font-medium ${c}`}>{v}</div>
    </div>
  );
}

/* ── Company Profile ── */
type Exchange = "ALL"|"NSE"|"BSE";
function CompanyProfile() {
  const [q, setQ] = useState("");
  const [exchange, setExchange] = useState<Exchange>("ALL");
  const filtered = COMPANIES.filter(c=>{
    const m = c.name.toLowerCase().includes(q.toLowerCase())||c.ticker.toLowerCase().includes(q.toLowerCase());
    if (!m) return false;
    if (exchange==="NSE") return c.exchange==="NSE"||c.exchange==="BOTH";
    if (exchange==="BSE") return c.exchange==="BSE"||c.exchange==="BOTH";
    return true;
  });
  const [active, setActive] = useState(COMPANIES_DATA?.[0] || null);
  useEffect(()=>{ if (!filtered.find(c=>c.ticker===active.ticker)&&filtered[0]) setActive(filtered[0]); },[exchange]);
  return (
    <section className="relative py-20 mx-auto max-w-7xl px-4 sm:px-6">
      <SectionTitle eyebrow="Company Intelligence" title={<>Deep-Dive <span className="gradient-text">Profiles</span></>}
        subtitle="Switch between NSE, BSE and global listings, then explore leadership, financials, shareholding and business context."/>
      <div className="grid lg:grid-cols-[320px_1fr] gap-6">
        <div className="glass-strong rounded-2xl p-4">
          <div className="grid grid-cols-3 gap-1 glass rounded-xl p-1 mb-3">
            {(["ALL","NSE","BSE"] as Exchange[]).map(ex=>(
              <button key={ex} onClick={()=>setExchange(ex)}
                className={`h-8 rounded-lg text-xs font-semibold transition ${exchange===ex?"bg-[color:var(--cyan)] text-[color:var(--midnight)]":"text-muted-foreground hover:text-foreground"}`}>{ex}</button>
            ))}
          </div>
          <div className="glass rounded-xl px-3 py-2 flex items-center gap-2 mb-3">
            <Search className="h-4 w-4 text-muted-foreground"/>
            <input placeholder={`Search ${exchange==="ALL"?"all":exchange} companies…`} value={q} onChange={e=>setQ(e.target.value)} className="bg-transparent outline-none text-sm flex-1 min-w-0"/>
          </div>
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground px-1 pb-1">{filtered.length} listings</div>
          <div className="max-h-[520px] overflow-y-auto space-y-1 pr-1">
            {filtered.length===0 && <div className="p-4 text-xs text-muted-foreground text-center">No listed companies match this filter.</div>}
            {filtered.map(c=>(
              <button key={c.ticker} onClick={()=>setActive(c)}
                className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition ${active.ticker===c.ticker?"bg-[color:var(--cyan)]/15 border border-[color:var(--cyan)]/30":"hover:bg-white/5 border border-transparent"}`}>
                <div className="h-9 w-9 rounded-lg grid place-items-center text-xs font-bold text-white shrink-0" style={{background:c.color}}>{c.logo}</div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium truncate">{c.name}</div>
                  <div className="text-[11px] text-muted-foreground">{c.ticker} • {c.exchange==="BOTH"?"NSE / BSE":c.exchange}</div>
                </div>
                <div className={`text-xs font-mono ${c.change>=0?"text-[color:var(--gain)]":"text-[color:var(--loss)]"}`}>{c.change>=0?"+":""}{fmt(c.changePct)}%</div>
              </button>
            ))}
          </div>
        </div>
        <div className="glass-strong rounded-2xl p-6 lg:p-8">
          <div className="flex flex-wrap items-start gap-4 justify-between mb-6">
            <div className="flex items-center gap-4 min-w-0">
              <div className="h-14 w-14 rounded-2xl grid place-items-center font-bold text-white text-lg shrink-0" style={{background:active.color}}>{active.logo}</div>
              <div className="min-w-0">
                <div className="text-xs uppercase tracking-widest text-muted-foreground">{active.sector}</div>
                <h3 className="text-2xl font-bold truncate">{active.name}</h3>
                <div className="text-sm text-muted-foreground">{active.ticker} • Listed {active.founded}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-mono text-2xl font-bold">{active.ticker.length>4?"₹":"$"}{fmt(active.price)}</div>
              <div className={`text-sm font-semibold ${active.change>=0?"text-[color:var(--gain)]":"text-[color:var(--loss)]"}`}>
                {active.change>=0?"+":""}{fmt(active.change)} ({active.change>=0?"+":""}{fmt(active.changePct)}%)
              </div>
            </div>
          </div>
          <div className="grid sm:grid-cols-3 gap-3 mb-6">
            {[{k:"CEO",v:active.ceo},{k:"Headquarters",v:active.hq},{k:"Founded",v:String(active.founded)},{k:"Revenue",v:active.revenue},{k:"Net Profit",v:active.netProfit},{k:"Employees",v:active.employees}].map(x=>(
              <div key={x.k} className="glass rounded-xl p-3">
                <div className="text-[10px] uppercase text-muted-foreground tracking-wider">{x.k}</div>
                <div className="text-sm font-medium mt-0.5">{x.v}</div>
              </div>
            ))}
          </div>
          <div className="glass rounded-xl p-4 mb-6">
            <div className="text-xs uppercase tracking-widest text-[color:var(--cyan)] font-semibold mb-2">About the business</div>
            <p className="text-sm text-muted-foreground leading-relaxed">{active.description}</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            <div className="glass rounded-xl p-4">
              <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Shareholding pattern</div>
              <ShareholdingBar parts={active.shareholding}/>
            </div>
            <div className="glass rounded-xl p-4">
              <div className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Major competitors</div>
              <div className="flex flex-wrap gap-2">
                {active.competitors.map(c=><span key={c} className="text-xs px-2.5 py-1 rounded-md glass border border-white/10">{c}</span>)}
              </div>
            </div>
          </div>
          <a href={yahooQuote(active.ticker)} target="_blank" rel="noreferrer noopener"
            className="inline-flex items-center gap-2 h-11 px-5 rounded-xl gradient-brand text-[color:var(--midnight)] font-semibold hover:opacity-90 transition">
            View Complete Analysis <ChevronRight className="h-4 w-4"/>
          </a>
        </div>
      </div>
    </section>
  );
}

function ShareholdingBar({ parts }:{ parts:Shareholder[] }) {
  const total = parts.reduce((a,p)=>a+p.v,0)||1;
  return (
    <div>
      <div className="flex h-3 rounded-full overflow-hidden mb-3">
        {parts.map(p=><div key={p.k} style={{width:`${(p.v/total)*100}%`,background:p.c}}/>)}
      </div>
      <div className="grid grid-cols-2 gap-y-1.5 text-xs">
        {parts.map(p=>(
          <div key={p.k} className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full" style={{background:p.c}}/>
            <span className="text-muted-foreground">{p.k}</span>
            <span className="ml-auto font-mono">{fmt(p.v)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Indicator math ── */
function calcMA(data:number[], period:number):(number|null)[] {
  return data.map((_,i)=>{ if(i<period-1) return null; return data.slice(i-period+1,i+1).reduce((a,b)=>a+b,0)/period; });
}
function calcEMA(data:number[], period:number):number[] {
  const k=2/(period+1); let ema=data[0];
  return data.map((v,i)=>{ ema=i===0?data[0]:v*k+ema*(1-k); return ema; });
}
function calcRSI(closes:number[], period=14):(number|null)[] {
  const result:(number|null)[]=Array(closes.length).fill(null);
  for(let i=period;i<closes.length;i++){
    let g=0,l=0;
    for(let j=i-period+1;j<=i;j++){ const d=closes[j]-closes[j-1]; if(d>0)g+=d; else l+=Math.abs(d); }
    const ag=g/period,al=l/period;
    result[i]=al===0?100:100-100/(1+ag/al);
  }
  return result;
}
function calcMACD(closes:number[]):{macd:number[];signal:number[];hist:number[]} {
  const ema12=calcEMA(closes,12),ema26=calcEMA(closes,26);
  const macd=ema12.map((v,i)=>v-ema26[i]);
  const signal=calcEMA(macd,9);
  return { macd, signal, hist:macd.map((v,i)=>v-signal[i]) };
}
function calcHA(data:{o:number;c:number;h:number;l:number}[]) {
  const ha:{o:number;c:number;h:number;l:number}[]=[];
  for(let i=0;i<data.length;i++){
    const d=data[i],haC=(d.o+d.h+d.l+d.c)/4,haO=i===0?(d.o+d.c)/2:(ha[i-1].o+ha[i-1].c)/2;
    ha.push({o:haO,c:haC,h:Math.max(d.h,haO,haC),l:Math.min(d.l,haO,haC)});
  }
  return ha;
}

/* ── Interactive Chart with OVERLAY indicators ── */
type ChartType = "candle"|"heikin"|"bar"|"line"|"area";

function InteractiveChart() {
  const ranges = ["1D","1W","1M","6M","1Y","5Y"];
  const [range, setRange] = useState("1M");
  const [type, setType] = useState<ChartType>("candle");
  const [showRSI,  setShowRSI]  = useState(false);
  const [showMACD, setShowMACD] = useState(false);
  const [showMA20, setShowMA20] = useState(true);
  const [showMA50, setShowMA50] = useState(true);
  const [showVol,  setShowVol]  = useState(false);

  const raw = useMemo(()=>{
    const n={  "1D":40,"1W":60,"1M":90,"6M":120,"1Y":160,"5Y":200 }[range]!;
    const arr:{o:number;c:number;h:number;l:number;v:number}[]=[];
    let v=100;
    for(let i=0;i<n;i++){
      const o=v,c=v*(1+(Math.random()-0.48)*0.025);
      arr.push({o,c,h:Math.max(o,c)*(1+Math.random()*0.008),l:Math.min(o,c)*(1-Math.random()*0.008),v:Math.floor(Math.random()*1e6+5e5)});
      v=c;
    }
    return arr;
  },[range]);

  const data = type==="heikin" ? calcHA(raw).map((d,i)=>({...d,v:raw[i].v})) : raw;
  const closes = data.map(d=>d.c);
  const ma20   = showMA20 ? calcMA(closes,20) : [];
  const ma50   = showMA50 ? calcMA(closes,50) : [];
  const rsi    = showRSI  ? calcRSI(closes)   : [];
  const macdD  = showMACD ? calcMACD(closes)  : null;

  const indicators = [
    {key:"RSI",   active:showRSI,  toggle:()=>setShowRSI(x=>!x)},
    {key:"MACD",  active:showMACD, toggle:()=>setShowMACD(x=>!x)},
    {key:"MA(20)",active:showMA20, toggle:()=>setShowMA20(x=>!x)},
    {key:"MA(50)",active:showMA50, toggle:()=>setShowMA50(x=>!x)},
    {key:"Volume",active:showVol,  toggle:()=>setShowVol(x=>!x)},
  ];
  const chartTypes:{key:ChartType;label:string}[] = [
    {key:"candle",label:"Candles"},{key:"heikin",label:"Heikin-Ashi"},
    {key:"bar",label:"Bar"},{key:"line",label:"Line"},{key:"area",label:"Area"},
  ];

  return (
    <section className="relative py-20 mx-auto max-w-7xl px-4 sm:px-6">
      <SectionTitle eyebrow="Interactive Charts"
        title={<>Analyze <span className="gradient-text">Any Timeframe</span></>}
        subtitle="Switch chart types, adjust timeframes, and overlay RSI, MACD, Moving Averages and Volume directly on the chart."/>
      <div className="glass-strong rounded-3xl p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="flex gap-1 glass rounded-xl p-1">
            {ranges.map(r=>(
              <button key={r} onClick={()=>setRange(r)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${range===r?"bg-[color:var(--cyan)] text-[color:var(--midnight)]":"text-muted-foreground hover:text-foreground"}`}>{r}</button>
            ))}
          </div>
          <div className="flex gap-1 glass rounded-xl p-1 flex-wrap">
            {chartTypes.map(({key,label})=>(
              <button key={key} onClick={()=>setType(key)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${type===key?"bg-[color:var(--cyan)] text-[color:var(--midnight)]":"text-muted-foreground hover:text-foreground"}`}>{label}</button>
            ))}
          </div>
          <div className="ml-auto flex flex-wrap gap-2">
            {indicators.map(({key,active,toggle})=>(
              <button key={key} onClick={toggle}
                className={`px-2.5 py-1 text-xs rounded-md border font-semibold transition ${active?"bg-[color:var(--cyan)]/20 border-[color:var(--cyan)]/50 text-[color:var(--cyan)]":"glass border-white/10 text-muted-foreground hover:text-foreground"}`}>
                {key}
              </button>
            ))}
          </div>
        </div>
        <OverlayChart
          data={data} type={type==="heikin"?"candle":type}
          ma20={ma20} ma50={ma50} rsi={rsi} macd={macdD}
          showVol={showVol} showRSI={showRSI} showMACD={showMACD}
        />
      </div>
    </section>
  );
}

function OverlayChart({ data, type, ma20, ma50, rsi, macd, showVol, showRSI, showMACD }:{
  data:{o:number;c:number;h:number;l:number;v:number}[];
  type:"candle"|"bar"|"line"|"area";
  ma20:(number|null)[];
  ma50:(number|null)[];
  rsi:(number|null)[];
  macd:{macd:number[];signal:number[];hist:number[]}|null;
  showVol:boolean; showRSI:boolean; showMACD:boolean;
}) {
  const W=1100, PAD=20;
  const priceH = 260;
  const volH   = showVol  ? 60  : 0;
  const rsiH   = showRSI  ? 70  : 0;
  const macdH  = showMACD ? 70  : 0;
  const GAP    = 8;
  const totalH = priceH + (volH?volH+GAP:0) + (rsiH?rsiH+GAP:0) + (macdH?macdH+GAP:0) + PAD;
  const step = (W-PAD*2)/data.length;
  const allP = data.flatMap(d=>[d.h,d.l]);
  const pMin=Math.min(...allP), pMax=Math.max(...allP);
  const py=(v:number)=>PAD+(priceH-PAD)*(1-(v-pMin)/(pMax-pMin));
  const maLine=(arr:(number|null)[])=>arr.map((v,i)=>v!==null?`${PAD+i*step+step/2},${py(v)}`:null).filter(Boolean).join(" ");
  const linePts=data.map((d,i)=>`${PAD+i*step+step/2},${py(d.c)}`).join(" ");
  let volY=priceH+GAP, rsiY=volY+(volH?volH+GAP:0), macdY=rsiY+(rsiH?rsiH+GAP:0);
  const rsiScale=(v:number)=>rsiY+rsiH*(1-v/100);
  const macdVals = macd ? [...macd.macd,...macd.signal,...macd.hist] : [0];
  const mMin=Math.min(...macdVals), mMax=Math.max(...macdVals);
  const mScale=(v:number)=>macdY+macdH*(1-(v-mMin)/(mMax-mMin||1));
  const mZero=mScale(0);
  const maxV=Math.max(...data.map(d=>d.v));
  const vScale=(v:number)=>(v/maxV)*(volH-4);

  return (
    <svg viewBox={`0 0 ${W} ${totalH}`} className="w-full" style={{height:`${Math.max(260,totalH*0.55)}px`}}>
      <defs>
        <linearGradient id="areaG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--cyan)" stopOpacity="0.4"/>
          <stop offset="100%" stopColor="var(--cyan)" stopOpacity="0"/>
        </linearGradient>
        <clipPath id="priceClip">
          <rect x={0} y={PAD} width={W} height={priceH-PAD}/>
        </clipPath>
      </defs>
      {[0.25,0.5,0.75].map(p=>(
        <line key={p} x1={0} y1={PAD+(priceH-PAD)*p} x2={W} y2={PAD+(priceH-PAD)*p} stroke="currentColor" strokeOpacity="0.06" strokeDasharray="3 5"/>
      ))}
      {type==="line" && <polyline points={linePts} fill="none" stroke="var(--cyan)" strokeWidth="2" clipPath="url(#priceClip)"/>}
      {type==="area" && (
        <g clipPath="url(#priceClip)">
          <path d={`M ${PAD},${priceH} L ${linePts} L ${W-PAD},${priceH} Z`} fill="url(#areaG)"/>
          <polyline points={linePts} fill="none" stroke="var(--cyan)" strokeWidth="2"/>
        </g>
      )}
      {type==="candle" && data.map((d,i)=>{
        const x=PAD+i*step, cx=x+step/2, up=d.c>=d.o, color=up?"var(--gain)":"var(--loss)";
        return (
          <g key={i} clipPath="url(#priceClip)">
            <line x1={cx} x2={cx} y1={py(d.h)} y2={py(d.l)} stroke={color} strokeWidth="1"/>
            <rect x={x+1} y={py(Math.max(d.o,d.c))} width={Math.max(1,step-2)} height={Math.max(1,Math.abs(py(d.o)-py(d.c)))} fill={color} rx="0.5"/>
          </g>
        );
      })}
      {type==="bar" && data.map((d,i)=>{
        const cx=PAD+i*step+step/2, up=d.c>=d.o, color=up?"var(--gain)":"var(--loss)";
        return (
          <g key={i} clipPath="url(#priceClip)">
            <line x1={cx} x2={cx} y1={py(d.h)} y2={py(d.l)} stroke={color} strokeWidth="1.5"/>
            <line x1={cx-step*0.3} x2={cx} y1={py(d.o)} y2={py(d.o)} stroke={color} strokeWidth="1.5"/>
            <line x1={cx} x2={cx+step*0.3} y1={py(d.c)} y2={py(d.c)} stroke={color} strokeWidth="1.5"/>
          </g>
        );
      })}
      {ma20.length>0 && <polyline points={maLine(ma20)} fill="none" stroke="#f59e0b" strokeWidth="1.5" opacity="0.85" clipPath="url(#priceClip)"/>}
      {ma50.length>0 && <polyline points={maLine(ma50)} fill="none" stroke="#a855f7" strokeWidth="1.5" opacity="0.85" clipPath="url(#priceClip)"/>}
      {(ma20.length>0||ma50.length>0) && (
        <g>
          {ma20.length>0 && <><rect x={W-130} y={PAD+6} width={10} height={3} fill="#f59e0b" rx="1"/><text x={W-116} y={PAD+11} fill="#f59e0b" fontSize="9">MA(20)</text></>}
          {ma50.length>0 && <><rect x={W-65}  y={PAD+6} width={10} height={3} fill="#a855f7" rx="1"/><text x={W-51}  y={PAD+11} fill="#a855f7" fontSize="9">MA(50)</text></>}
        </g>
      )}
      {showVol && (
        <g>
          <line x1={0} x2={W} y1={volY} y2={volY} stroke="currentColor" strokeOpacity="0.1"/>
          <text x={PAD} y={volY+10} fill="currentColor" opacity="0.4" fontSize="8" textAnchor="start">VOLUME</text>
          {data.map((d,i)=>{
            const bh=vScale(d.v), up=d.c>=d.o;
            return <rect key={i} x={PAD+i*step+1} y={volY+volH-bh} width={Math.max(1,step-2)} height={bh} fill={up?"var(--gain)":"var(--loss)"} opacity="0.5" rx="0.5"/>;
          })}
        </g>
      )}
      {showRSI && (
        <g>
          <line x1={0} x2={W} y1={rsiY} y2={rsiY} stroke="currentColor" strokeOpacity="0.1"/>
          <text x={PAD} y={rsiY+10} fill="currentColor" opacity="0.4" fontSize="8">RSI(14)</text>
          <line x1={PAD} x2={W-PAD} y1={rsiScale(70)} y2={rsiScale(70)} stroke="var(--loss)" strokeOpacity="0.35" strokeDasharray="3 4"/>
          <line x1={PAD} x2={W-PAD} y1={rsiScale(30)} y2={rsiScale(30)} stroke="var(--gain)" strokeOpacity="0.35" strokeDasharray="3 4"/>
          <text x={W-PAD+2} y={rsiScale(70)+3} fill="var(--loss)" fontSize="7" opacity="0.6">70</text>
          <text x={W-PAD+2} y={rsiScale(30)+3} fill="var(--gain)" fontSize="7" opacity="0.6">30</text>
          <polyline
            points={rsi.map((v,i)=>v!==null?`${PAD+i*step+step/2},${rsiScale(v)}`:null).filter(Boolean).join(" ")}
            fill="none" stroke="var(--aqua)" strokeWidth="1.5"/>
        </g>
      )}
      {showMACD && macd && (
        <g>
          <line x1={0} x2={W} y1={macdY} y2={macdY} stroke="currentColor" strokeOpacity="0.1"/>
          <text x={PAD} y={macdY+10} fill="currentColor" opacity="0.4" fontSize="8">MACD(12,26,9)</text>
          <line x1={PAD} x2={W-PAD} y1={mZero} y2={mZero} stroke="currentColor" strokeOpacity="0.15"/>
          {macd.hist.map((v,i)=>{
            const bh=Math.abs(mScale(v)-mZero);
            return <rect key={i} x={PAD+i*step+1} y={v>=0?mZero-bh:mZero} width={Math.max(1,step-2)} height={bh} fill={v>=0?"var(--gain)":"var(--loss)"} opacity="0.5"/>;
          })}
          <polyline points={macd.macd.map((v,i)=>`${PAD+i*step+step/2},${mScale(v)}`).join(" ")} fill="none" stroke="var(--cyan)" strokeWidth="1.5"/>
          <polyline points={macd.signal.map((v,i)=>`${PAD+i*step+step/2},${mScale(v)}`).join(" ")} fill="none" stroke="#f59e0b" strokeWidth="1.5"/>
          <rect x={W-130} y={macdY+4} width={8} height={2} fill="var(--cyan)" rx="1"/>
          <text x={W-118} y={macdY+9} fill="var(--cyan)" fontSize="7" opacity="0.8">MACD</text>
          <rect x={W-75}  y={macdY+4} width={8} height={2} fill="#f59e0b" rx="1"/>
          <text x={W-63}  y={macdY+9} fill="#f59e0b" fontSize="7" opacity="0.8">Signal</text>
        </g>
      )}
    </svg>
  );
}

/* ── Ratios ── */
function Ratios() {
  return (
    <section className="relative py-20 mx-auto max-w-7xl px-4 sm:px-6">
      <SectionTitle eyebrow="Financial Ratios" title={<>The <span className="gradient-text">Numbers That Matter</span></>}
        subtitle="Every ratio comes with a beginner-friendly explanation."/>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {RATIOS.map(r=>(
          <div key={r.name} className="glass rounded-2xl p-4 hover-lift">
            <div className="text-[10px] uppercase tracking-widest text-[color:var(--cyan)] font-semibold">{r.name}</div>
            <div className="font-mono text-2xl font-bold mt-1">{r.value}</div>
            <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{r.explain}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── Gainers / Losers ── */
function GainersLosers() {
  const sorted=[...COMPANIES].sort((a,b)=>b.changePct-a.changePct);
  return (
    <section className="relative py-20 mx-auto max-w-7xl px-4 sm:px-6">
      <SectionTitle eyebrow="Movers" title={<>Today's <span className="gradient-text">Top Gainers & Losers</span></>}
        subtitle="Auto-updated market movers across our tracked universe."/>
      <div className="grid md:grid-cols-2 gap-6">
        <MoversTable title="Top Gainers" rows={sorted.filter(c=>c.change>=0).slice(0,5)} up/>
        <MoversTable title="Top Losers"  rows={sorted.filter(c=>c.change<0).reverse().slice(0,5)} up={false}/>
      </div>
    </section>
  );
}

function MoversTable({ title, rows, up }:{ title:string; rows:typeof COMPANIES; up:boolean }) {
  return (
    <div className="glass-strong rounded-2xl overflow-hidden">
      <div className={`px-5 py-4 flex items-center gap-2 border-b border-white/10 ${up?"text-[color:var(--gain)]":"text-[color:var(--loss)]"}`}>
        {up?<TrendingUp className="h-4 w-4"/>:<TrendingDown className="h-4 w-4"/>}
        <div className="font-semibold text-foreground">{title}</div>
        <span className="ml-auto text-[10px] uppercase tracking-widest text-muted-foreground">Live</span>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-[11px] uppercase tracking-wider text-muted-foreground">
            <th className="text-left px-5 py-2 font-medium">#</th>
            <th className="text-left px-5 py-2 font-medium">Company</th>
            <th className="text-right px-5 py-2 font-medium">Price</th>
            <th className="text-right px-5 py-2 font-medium">Change</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r,i)=>(
            <tr key={r.ticker} className="border-t border-white/5 hover:bg-white/5 transition">
              <td className="px-5 py-3 text-muted-foreground font-mono text-xs">{i+1}</td>
              <td className="px-5 py-3">
                <div className="flex items-center gap-2.5">
                  <div className="h-7 w-7 rounded-md grid place-items-center text-[10px] font-bold text-white" style={{background:r.color}}>{r.logo}</div>
                  <div>
                    <div className="text-sm font-medium">{r.name}</div>
                    <div className="text-[11px] text-muted-foreground">{r.ticker}</div>
                  </div>
                </div>
              </td>
              <td className="px-5 py-3 text-right font-mono">{r.ticker.length>4?"₹":"$"}{fmt(r.price)}</td>
              <td className={`px-5 py-3 text-right font-mono font-semibold ${up?"text-[color:var(--gain)]":"text-[color:var(--loss)]"}`}>
                {up?"+":""}{fmt(r.changePct)}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ── News ── */
function NewsGrid() {
  return (
    <section className="relative py-20 mx-auto max-w-7xl px-4 sm:px-6">
      <div className="flex items-end justify-between flex-wrap gap-4" id="news">
        <SectionTitle eyebrow="Market News" title={<>Latest <span className="gradient-text">Headlines</span></>}
          subtitle="Curated from trusted financial news sources — updates automatically."/>
        <a href="https://finance.yahoo.com/news/" target="_blank" rel="noreferrer noopener" className="text-sm text-[color:var(--cyan)] hover:underline">View all →</a>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {NEWS.map((n,i)=>(
          <article key={i} className="glass rounded-2xl overflow-hidden hover-lift group">
            <div className="relative h-40 overflow-hidden bg-white/5">
              <img src={n.image} alt={n.title} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"/>
              <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--midnight)]/85 via-[color:var(--midnight)]/20 to-transparent"/>
              <div className="absolute top-3 left-3 text-[10px] uppercase tracking-widest bg-white/15 backdrop-blur px-2 py-1 rounded-md font-semibold">{n.category}</div>
              <Newspaper className="absolute bottom-3 right-3 h-8 w-8 text-white/70"/>
            </div>
            <div className="p-5">
              <div className="flex items-center gap-2 text-[11px] text-muted-foreground mb-2">
                <span className="font-medium text-foreground/80">{n.source}</span><span>•</span><span>{n.time}</span>
              </div>
              <h3 className="font-semibold leading-snug mb-2 group-hover:text-[color:var(--cyan)] transition">{n.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2">{n.summary}</p>
              <a href={googleNews(n.title)} target="_blank" rel="noreferrer noopener"
                className="mt-4 text-xs font-semibold text-[color:var(--cyan)] inline-flex items-center gap-1 hover:gap-2 transition-all">
                Read more <ArrowUpRight className="h-3.5 w-3.5"/>
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ── Economic Calendar ── */
function EconCalendar() {
  return (
    <section className="relative py-20 mx-auto max-w-7xl px-4 sm:px-6">
      <SectionTitle eyebrow="Economic Calendar" title={<>Upcoming <span className="gradient-text">Market-Moving Events</span></>}
        subtitle="Central-bank decisions, macro releases, earnings, and IPO dates."/>
      <div className="glass-strong rounded-2xl overflow-hidden">
        <div className="hidden sm:grid grid-cols-[100px_100px_80px_1fr_100px] px-5 py-3 text-[11px] uppercase tracking-widest text-muted-foreground border-b border-white/10">
          <div>Date</div><div>Time IST</div><div>Region</div><div>Event</div><div className="text-right">Impact</div>
        </div>
        {ECON_EVENTS.map((e,i)=>(
          <div key={i} className="grid grid-cols-2 sm:grid-cols-[100px_100px_80px_1fr_100px] px-5 py-4 border-b border-white/5 last:border-0 items-center gap-2 hover:bg-white/5 transition">
            <div className="font-mono text-sm">{e.date}</div>
            <div className="font-mono text-xs text-muted-foreground">{e.time}</div>
            <div className="text-xs"><span className="glass px-2 py-0.5 rounded-md">{e.region}</span></div>
            <div className="col-span-2 sm:col-span-1 text-sm font-medium">{e.event}</div>
            <div className="text-right">
              <span className={`text-[10px] font-semibold px-2 py-1 rounded-md ${e.impact==="High"?"bg-[color:var(--loss)]/15 text-[color:var(--loss)]":e.impact==="Medium"?"bg-[color:var(--aqua)]/15 text-[color:var(--aqua)]":"bg-white/5 text-muted-foreground"}`}>{e.impact}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── IPO (6/6/6) ── */
function IPOSection() {
  const [tab, setTab] = useState<"Upcoming"|"Open"|"Closed">("Open");
  const filtered = ALL_IPOS.filter(i=>i.status===tab);
  return (
    <section id="ipos" className="relative py-20 mx-auto max-w-7xl px-4 sm:px-6">
      <SectionTitle eyebrow="IPO Center" title={<>Track <span className="gradient-text">Every New Listing</span></>}
        subtitle="Upcoming, open, and recently listed IPOs with price band, GMP, and subscription snapshot."/>
      <div className="flex gap-1 glass rounded-xl p-1 w-fit mb-6">
        {(["Upcoming","Open","Closed"] as const).map(t=>(
          <button key={t} onClick={()=>setTab(t)}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition ${tab===t?"bg-[color:var(--cyan)] text-[color:var(--midnight)]":"text-muted-foreground hover:text-foreground"}`}>
            {t} <span className="ml-1 opacity-60">({ALL_IPOS.filter(i=>i.status===t).length})</span>
          </button>
        ))}
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(ipo=>(
          <div key={ipo.name} className="glass rounded-2xl p-5 hover-lift">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-11 w-11 rounded-xl grid place-items-center font-bold text-white shrink-0" style={{background:ipo.color}}>
                <Rocket className="h-5 w-5"/>
              </div>
              <div className="min-w-0">
                <div className="font-semibold truncate">{ipo.name}</div>
                <div className="text-[11px] text-muted-foreground">{ipo.date}</div>
              </div>
              <span className={`ml-auto text-[10px] font-semibold px-2 py-1 rounded-md shrink-0 ${ipo.status==="Open"?"bg-[color:var(--gain)]/15 text-[color:var(--gain)]":ipo.status==="Upcoming"?"bg-[color:var(--aqua)]/15 text-[color:var(--aqua)]":"bg-white/10 text-muted-foreground"}`}>
                {ipo.status}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="glass rounded-lg py-2">
                <div className="text-[10px] uppercase text-muted-foreground">Band</div>
                <div className="text-xs font-mono font-semibold">{ipo.band}</div>
              </div>
              <div className="glass rounded-lg py-2">
                <div className="text-[10px] uppercase text-muted-foreground">GMP</div>
                <div className="text-xs font-mono font-semibold text-[color:var(--gain)]">{ipo.gmp}</div>
              </div>
              <div className="glass rounded-lg py-2">
                <div className="text-[10px] uppercase text-muted-foreground">Sub.</div>
                <div className="text-xs font-mono font-semibold">{ipo.sub}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── Funds ── */
function FundsSection() {
  return (
    <section id="funds" className="relative py-20 mx-auto max-w-7xl px-4 sm:px-6">
      <SectionTitle eyebrow="Mutual Funds & ETFs" title={<>Popular <span className="gradient-text">Funds Snapshot</span></>}
        subtitle="Trailing returns, risk rating, expense ratio, and AUM at a glance."/>
      <div className="glass-strong rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="text-[11px] uppercase tracking-widest text-muted-foreground">
            <tr>
              <th className="text-left px-5 py-3 font-medium">Fund</th>
              <th className="text-left px-5 py-3 font-medium">Category</th>
              <th className="text-right px-5 py-3 font-medium">1Y</th>
              <th className="text-right px-5 py-3 font-medium hidden sm:table-cell">3Y</th>
              <th className="text-left px-5 py-3 font-medium hidden md:table-cell">Risk</th>
              <th className="text-right px-5 py-3 font-medium hidden md:table-cell">Expense</th>
              <th className="text-right px-5 py-3 font-medium hidden lg:table-cell">AUM</th>
            </tr>
          </thead>
          <tbody>
            {FUNDS.map(f=>(
              <tr key={f.name} className="border-t border-white/5 hover:bg-white/5 transition">
                <td className="px-5 py-4 font-medium">{f.name}</td>
                <td className="px-5 py-4 text-xs text-muted-foreground">{f.category}</td>
                <td className="px-5 py-4 text-right font-mono text-[color:var(--gain)] font-semibold">+{fmt(f.return1y)}%</td>
                <td className="px-5 py-4 text-right font-mono text-[color:var(--gain)] hidden sm:table-cell">+{fmt(f.return3y)}%</td>
                <td className="px-5 py-4 hidden md:table-cell">
                  <span className={`text-[10px] px-2 py-0.5 rounded-md ${f.risk==="High"?"bg-[color:var(--loss)]/15 text-[color:var(--loss)]":f.risk==="Moderate"?"bg-[color:var(--aqua)]/15 text-[color:var(--aqua)]":"bg-[color:var(--gain)]/15 text-[color:var(--gain)]"}`}>{f.risk}</span>
                </td>
                <td className="px-5 py-4 text-right font-mono text-xs hidden md:table-cell">{fmt(f.expense)}%</td>
                <td className="px-5 py-4 text-right font-mono text-xs hidden lg:table-cell">{f.aum}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

/* ── Education ── */
function Education() {
  const items = [
    {icon:GraduationCap,title:"What is the Stock Market?",desc:"A plain-English intro to exchanges, tickers, orders, and price discovery."},
    {icon:Rocket,title:"How to Start Investing",desc:"Open a demat, define goals, pick your first instruments, size positions."},
    {icon:BarChart3,title:"Types of Stocks",desc:"Common vs preferred, large / mid / small-cap, cyclical vs defensive."},
    {icon:Building2,title:"Fundamental Analysis",desc:"Read a P&L, balance sheet, and cash-flow statement like an analyst."},
    {icon:LineChart,title:"Technical Analysis",desc:"Trends, support / resistance, moving averages, and RSI basics."},
    {icon:ShieldCheck,title:"Risk Management",desc:"Position sizing, diversification, stop losses, and emotional discipline."},
    {icon:Brain,title:"Investment Strategies",desc:"Value, growth, dividend, momentum, and index investing compared."},
    {icon:Zap,title:"Options & Derivatives 101",desc:"How futures and options work — payoffs, greeks, and common strategies."},
  ];
  return (
    <section id="learn" className="relative py-20 mx-auto max-w-7xl px-4 sm:px-6">
      <SectionTitle eyebrow="Learn" title={<>Investor <span className="gradient-text">Education Hub</span></>}
        subtitle="Zero to informed — concise, jargon-free lessons for every experience level."/>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map(i=>(
          <div key={i.title} className="glass rounded-2xl p-5 hover-lift group">
            <div className="h-10 w-10 rounded-xl gradient-brand grid place-items-center mb-4 text-[color:var(--midnight)]">
              <i.icon className="h-5 w-5" strokeWidth={2.4}/>
            </div>
            <h3 className="font-semibold mb-1.5">{i.title}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed mb-4">{i.desc}</p>
            <a href={investopedia(i.title)} target="_blank" rel="noreferrer noopener"
              className="text-xs font-semibold text-[color:var(--cyan)] inline-flex items-center gap-1 group-hover:gap-2 transition-all">
              Learn more <ArrowUpRight className="h-3.5 w-3.5"/>
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── Heatmap ── */
function Heatmap() {
  const shade=(v:number)=>{
    const abs=Math.min(1,Math.abs(v)/3);
    return v>=0?`color-mix(in oklab, var(--gain) ${20+abs*55}%, transparent)`:`color-mix(in oklab, var(--loss) ${20+abs*55}%, transparent)`;
  };
  return (
    <section className="relative py-20 mx-auto max-w-7xl px-4 sm:px-6" id="markets">
      <SectionTitle eyebrow="Sector Heatmap" title={<>Market Pulse by <span className="gradient-text">Sector</span></>}
        subtitle="One glance shows where capital is rotating today."/>
      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
        {SECTORS.map(s=>(
          <div key={s.name} className="rounded-xl p-4 border border-white/10 hover-lift transition" style={{background:shade(s.change)}}>
            <div className="text-xs font-semibold">{s.name}</div>
            <div className={`font-mono text-lg font-bold mt-1 ${s.change>=0?"text-[color:var(--gain)]":"text-[color:var(--loss)]"}`}>
              {s.change>=0?"+":""}{fmt(s.change)}%
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── Global Markets ── */
function GlobalMarkets() {
  const groups=["US","IN","EU","ASIA","CRYPTO","FX","COMM"] as const;
  const labels:Record<(typeof groups)[number],string>={US:"US Markets",IN:"Indian Markets",EU:"European Markets",ASIA:"Asian Markets",CRYPTO:"Crypto",FX:"Forex",COMM:"Commodities"};
  return (
    <section className="relative py-20 mx-auto max-w-7xl px-4 sm:px-6">
      <SectionTitle eyebrow="Global Markets" title={<>The <span className="gradient-text">World Board</span></>}
        subtitle="Regional indices, crypto, FX, and commodities in one view."/>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {groups.map(g=>{
          const rows=GLOBAL_MARKETS.filter(m=>m.region===g);
          if (!rows.length) return null;
          return (
            <div key={g} className="glass-strong rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Globe2 className="h-4 w-4 text-[color:var(--cyan)]"/>
                <div className="font-semibold text-sm">{labels[g]}</div>
              </div>
              <div className="space-y-2.5">
                {rows.map(r=>(
                  <div key={r.name} className="flex items-center justify-between text-sm">
                    <div className="text-muted-foreground">{r.name}</div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm">{r.value}</span>
                      <span className={`font-mono text-xs w-16 text-right ${r.changePct>=0?"text-[color:var(--gain)]":"text-[color:var(--loss)]"}`}>
                        {r.changePct>=0?"+":""}{fmt(r.changePct)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ── AI Insights ── */
function AIInsights() {
  return (
    <section className="relative py-20 mx-auto max-w-7xl px-4 sm:px-6">
      <div className="relative glass-strong rounded-3xl p-8 sm:p-12 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-[color:var(--cyan)]/25 blur-[120px] pointer-events-none"/>
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-[color:var(--aqua)]/20 blur-[120px] pointer-events-none"/>
        <div className="relative grid lg:grid-cols-[1.2fr_1fr] gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 glass rounded-full px-3 py-1.5 text-xs font-semibold mb-5">
              <Sparkles className="h-3.5 w-3.5 text-[color:var(--aqua)]"/> AI Market Insights • Informational Only
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold leading-tight">Today's <span className="gradient-text">market mood</span>, summarized by AI.</h2>
            <p className="mt-4 text-muted-foreground">An overview of today's session — sector rotation, bullish and bearish undercurrents, notable highlights, and key risks. Generated by AI for context only; not investment advice.</p>
            <div className="mt-6 grid grid-cols-2 gap-3 max-w-md">
              <Mood label="Overall Mood"   value="Cautiously Bullish" tone="up"/>
              <Mood label="Volatility (VIX)" value="14.2 • Low"       tone="n"/>
              <Mood label="Breadth"        value="62% Advancers"      tone="up"/>
              <Mood label="Sentiment Flow" value="Neutral → Positive" tone="n"/>
            </div>
          </div>
          <div className="space-y-3">
            {[
              {t:"Sector Leaders", d:"Technology (+2.4%) and Real Estate (+1.9%) lead as bond yields ease."},
              {t:"Sector Laggards",d:"Metals (-1.8%) and Automobile (-1.2%) under pressure on China demand concerns."},
              {t:"Highlights",     d:"AI infrastructure names extend gains; NVIDIA up 3% on strong guidance."},
              {t:"Risks to Watch", d:"US CPI print next week and RBI commentary on food-inflation trajectory."},
            ].map(x=>(
              <div key={x.t} className="glass rounded-xl p-4 hover-lift">
                <div className="text-xs uppercase tracking-widest text-[color:var(--cyan)] font-semibold mb-1">{x.t}</div>
                <div className="text-sm text-muted-foreground leading-relaxed">{x.d}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Mood({ label, value, tone }:{ label:string; value:string; tone:"up"|"down"|"n" }) {
  const c=tone==="up"?"text-[color:var(--gain)]":tone==="down"?"text-[color:var(--loss)]":"text-[color:var(--aqua)]";
  return (
    <div className="glass rounded-xl p-3">
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className={`font-semibold mt-0.5 text-sm ${c}`}>{value}</div>
    </div>
  );
}

/* ── Newsletter ── */
function Newsletter() {
  const [email,    setEmail]    = useState("");
  const [status,   setStatus]   = useState<"idle"|"sending"|"ok"|"err">("idle");
  const [msg,      setMsg]      = useState("");
  const [subEmail, setSubEmail] = useState<string|null>(()=>typeof localStorage!=="undefined"?localStorage.getItem("stocketize_sub"):null);
  const subscribe = useServerFn(subscribeToNewsletter);

  const handleUnsubscribe = () => {
    if (typeof localStorage !== "undefined") localStorage.removeItem("stocketize_sub");
    setSubEmail(null);
    setStatus("idle");
    setMsg("");
    setEmail("");
  };

  const onSubmit = async (e:React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) return;
    setStatus("sending");
    try {
      const res = await subscribe({ data:{ email } });
      if (res.ok) {
        setStatus("ok");
        setMsg("✓ You're on the list — your welcome market brief is on the way!");
        if (typeof localStorage !== "undefined") localStorage.setItem("stocketize_sub", email);
        setSubEmail(email);
        setEmail("");
      } else {
        setStatus("err");
        setMsg(res.error ?? "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("err");
      setMsg("Network issue — please try again in a moment.");
    }
  };

  return (
    <section className="relative py-20 mx-auto max-w-7xl px-4 sm:px-6" id="about">
      <div className="relative overflow-hidden rounded-3xl p-10 sm:p-14 text-center gradient-brand text-[color:var(--midnight)]">
        <div className="absolute inset-0 animate-grid opacity-25 pointer-events-none"/>
        <div className="relative max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-[color:var(--midnight)]/15 rounded-full px-3 py-1 text-xs font-semibold mb-4">
            <Mail className="h-3.5 w-3.5"/> Newsletter
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold">Markets in your inbox, every morning.</h2>
          <p className="mt-3 text-[color:var(--midnight)]/80">Daily updates, weekly deep dives, and beginner-friendly education — free, always.</p>
          {subEmail ? (
            <div className="mt-8">
              <div className="inline-flex items-center gap-3 bg-[color:var(--midnight)]/20 rounded-2xl px-6 py-4 mb-4">
                <CheckCircle2 className="h-6 w-6 text-[color:var(--midnight)]"/>
                <div className="text-left">
                  <div className="font-semibold text-sm">Subscribed!</div>
                  <div className="text-xs text-[color:var(--midnight)]/70">{subEmail}</div>
                </div>
              </div>
              <div className="flex justify-center">
                <button onClick={handleUnsubscribe}
                  className="inline-flex items-center gap-2 h-11 px-6 rounded-xl bg-[color:var(--midnight)]/20 hover:bg-[color:var(--midnight)]/30 text-[color:var(--midnight)] font-semibold transition text-sm">
                  <BellOff className="h-4 w-4"/> Unsubscribe
                </button>
              </div>
              <p className="mt-3 text-[11px] text-[color:var(--midnight)]/60">You'll receive live market updates every morning. Click Unsubscribe to stop emails.</p>
            </div>
          ) : (
            <>
              <form onSubmit={onSubmit} className="mt-6 flex flex-col sm:flex-row gap-2 max-w-lg mx-auto">
                <input value={email} onChange={e=>setEmail(e.target.value)} type="email" required placeholder="you@email.com"
                  className="flex-1 h-12 px-4 rounded-xl bg-[color:var(--midnight)]/10 border border-[color:var(--midnight)]/20 placeholder:text-[color:var(--midnight)]/50 outline-none focus:border-[color:var(--midnight)]/60"/>
                <button type="submit" disabled={status==="sending"}
                  className="h-12 px-6 rounded-xl bg-[color:var(--midnight)] text-white font-semibold hover:opacity-90 transition disabled:opacity-70">
                  {status==="sending"?"Subscribing…":"Subscribe"}
                </button>
              </form>
              {status==="ok"  && <div className="mt-3 text-sm font-medium">{msg}</div>}
              {status==="err" && <div className="mt-3 text-sm text-[color:var(--midnight)]/80">{msg}</div>}
              <p className="mt-3 text-[11px] text-[color:var(--midnight)]/70">By subscribing you agree to receive market emails from {OWNER.name}. Unsubscribe anytime.</p>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

/* ── WhatsApp FAB ── */
function WhatsAppFab() {
  return (
    <a href={OWNER.whatsapp} target="_blank" rel="noreferrer noopener" aria-label="Chat with Stocketize on WhatsApp"
      className="fixed bottom-6 right-6 z-[90] h-14 w-14 rounded-full grid place-items-center shadow-2xl transition hover:scale-110 group"
      style={{background:"linear-gradient(135deg,#25D366,#128C7E)"}}>
      <MessageCircle className="h-6 w-6 text-white" strokeWidth={2.4}/>
      <span className="absolute right-full mr-3 whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-semibold bg-[color:var(--midnight)] text-white opacity-0 group-hover:opacity-100 transition pointer-events-none">Chat on WhatsApp</span>
      <span className="absolute inset-0 rounded-full animate-ping opacity-40" style={{background:"#25D366"}}/>
    </a>
  );
}

/* ── Footer ── */
function Footer() {
  return (
    <footer className="mt-10 border-t border-white/10 bg-[color:var(--midnight)] text-white/90">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-14">
        <div className="grid md:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-9 w-9 rounded-xl gradient-brand grid place-items-center"><Activity className="h-4 w-4 text-[color:var(--midnight)]" strokeWidth={3}/></div>
              <div className="font-display font-bold">Stocketize<span className="gradient-text"> AI</span></div>
            </div>
            <p className="text-sm text-white/60 leading-relaxed">Real-time market intelligence, company insights, and investor education — in one elegant platform.</p>
          </div>
          <FooterCol title="Quick Links" items={[{label:"Home",href:"#home"},{label:"Markets",href:"#markets"},{label:"Companies",href:"#companies"},{label:"News",href:"#news"},{label:"About",href:"#about"}]}/>
          <FooterCol title="Legal" items={[{label:"Privacy Policy",to:"/privacy"},{label:"Terms & Conditions",to:"/terms"},{label:"Disclaimer",to:"/disclaimer"},{label:"Affiliate Disclosure",to:"/affiliate-disclosure"}]}/>
          <div>
            <div className="text-sm font-semibold mb-4">About the Website Owner</div>
            <ul className="text-sm text-white/70 space-y-2">
              <li>Name: <span className="text-white">{OWNER.name}</span></li>
              <li className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5 shrink-0"/>
                <a href={`tel:${OWNER.phone}`} className="text-white hover:text-[color:var(--cyan)] transition">Contact No. — {OWNER.phone}</a></li>
              <li className="flex items-center gap-1.5"><MessageCircle className="h-3.5 w-3.5 shrink-0" style={{color:"#25D366"}}/>
                <a href={OWNER.whatsapp} target="_blank" rel="noreferrer noopener" className="text-white hover:text-[color:var(--cyan)] transition">WhatsApp — {OWNER.whatsappDisplay}</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 grid md:grid-cols-2 gap-4 text-xs text-white/60">
          <div className="rounded-xl border border-white/10 p-4 leading-relaxed">
            <div className="font-semibold text-white/90 mb-1">Disclaimer</div>
            Stocketize AI is created solely for educational and informational purposes. Nothing on this site is financial, investment, tax or legal advice. Always consult a SEBI-registered advisor before investing. Read the full <Link to="/disclaimer" className="underline hover:text-[color:var(--cyan)]">Disclaimer</Link>.
          </div>
          <div className="rounded-xl border border-white/10 p-4 leading-relaxed">
            <div className="font-semibold text-white/90 mb-1">Affiliate Disclosure</div>
            This website earns revenue through <strong>advertisements, affiliate partnerships, sponsored content and referral links</strong>. Commissions may be earned at no extra cost to you. See the full <Link to="/affiliate-disclosure" className="underline hover:text-[color:var(--cyan)]">Affiliate Disclosure</Link>.
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap justify-between items-center gap-2 text-xs text-white/50">
          <div>© 2026 Stocketize AI. All rights reserved.</div>
          <div>Built for learners, by learners.</div>
        </div>
      </div>
    </footer>
  );
}

type FooterItem = { label:string; href?:string; to?:"/privacy"|"/terms"|"/disclaimer"|"/affiliate-disclosure" };
function FooterCol({ title, items }:{ title:string; items:FooterItem[] }) {
  return (
    <div>
      <div className="text-sm font-semibold mb-4">{title}</div>
      <ul className="space-y-2 text-sm text-white/70">
        {items.map(i=>(
          <li key={i.label}>
            {i.to ? <Link to={i.to} className="hover:text-[color:var(--cyan)] transition">{i.label}</Link>
              : <a href={i.href} className="hover:text-[color:var(--cyan)] transition">{i.label}</a>}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ── Testimonials ── */
function Testimonials() {
  const items=[
    {q:"The company deep-dives helped me understand what to actually look at before buying a stock. As a first-time investor from Pune, this is exactly what I needed.",n:"Ananya Menon",r:"Retail Investor • Pune"},
    {q:"The daily brief is my morning coffee read. Concise, non-hyped, and it explains WHY the market moved — not just what happened.",n:"Rohan Iyer",r:"Software Engineer • Bengaluru"},
    {q:"I use the ratios section to teach my finance students. Every metric comes with a plain-English explanation, which is rare on Indian sites.",n:"Prof. Meera Kulkarni",r:"MBA Faculty • Mumbai"},
    {q:"Finally an educational platform that clearly says 'this isn't advice'. That honesty is what made me stick around.",n:"Vikram Shah",r:"Chartered Accountant • Ahmedabad"},
    {q:"The IPO tracker and sector heatmap are super useful for weekend research. Clean UI, no clutter, and works well on my phone.",n:"Sneha Reddy",r:"Long-term Investor • Hyderabad"},
    {q:"The WhatsApp support is a lovely touch. Got a clear, honest reply within a day — no salesy pitch, just help.",n:"Karan Bhatia",r:"Aspiring Trader • Jaipur"},
  ];
  return (
    <section className="relative py-20 mx-auto max-w-7xl px-4 sm:px-6">
      <SectionTitle eyebrow="Community" title={<>What <span className="gradient-text">Investors Say</span></>}
        subtitle="Feedback from readers across India who use Stocketize AI to learn and stay informed."/>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map(t=>(
          <figure key={t.n} className="glass rounded-2xl p-6 hover-lift">
            <div className="text-[color:var(--cyan)] text-3xl leading-none mb-2">"</div>
            <blockquote className="text-sm leading-relaxed text-muted-foreground">{t.q}</blockquote>
            <figcaption className="mt-5 flex items-center gap-3">
              <div className="h-9 w-9 rounded-full gradient-brand grid place-items-center text-[color:var(--midnight)] font-bold text-sm">
                {t.n.split(" ").map(x=>x[0]).slice(0,2).join("")}
              </div>
              <div>
                <div className="text-sm font-semibold">{t.n}</div>
                <div className="text-[11px] text-muted-foreground">{t.r}</div>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

/* ── FAQ ── */
function FAQ() {
  const items=[
    {q:"Is Stocketize AI giving me financial advice?",a:"No. All content is AI-generated and strictly for education and information only. Nothing on the site is investment, tax or legal advice. Please consult a SEBI-registered advisor before making any investment."},
    {q:"How current is the market data on Stocketize AI?",a:"The platform attempts to fetch live NSE/BSE data. When markets are open, indices, prices and news update every 60 seconds. Outside market hours, realistic simulated data is shown as a fallback."},
    {q:"Do I need to pay to use the website or the newsletter?",a:"No. Reading market data, company profiles, education content, IPOs, mutual funds, ratios and news is completely free. The daily newsletter is also free."},
    {q:"How often is the newsletter sent and what does it contain?",a:"Subscribers receive a welcome brief immediately, a daily morning market update, and a weekend deep-dive covering NSE/BSE movement, top gainers/losers, IPOs, economic events, and education."},
    {q:"I'm a complete beginner — where should I start?",a:"Open the Investor Education Hub on the home page and start with 'What is the Stock Market?' followed by 'How to Start Investing'. Every ratio in the Financial Ratios section also has a plain-English explanation."},
  ];
  const [openIdx, setOpenIdx] = useState<number|null>(0);
  return (
    <section className="relative py-20 mx-auto max-w-4xl px-4 sm:px-6" id="faq">
      <SectionTitle eyebrow="FAQ" title={<>Frequently <span className="gradient-text">Asked Questions</span></>}
        subtitle="Quick answers about Stocketize AI, data accuracy, newsletters and getting started."/>
      <div className="space-y-3">
        {items.map((it,i)=>{
          const open=openIdx===i;
          return (
            <div key={it.q} className="glass rounded-2xl overflow-hidden border border-white/10">
              <button onClick={()=>setOpenIdx(open?null:i)} className="w-full flex items-center justify-between gap-4 text-left px-5 py-4 hover:bg-white/5 transition">
                <span className="text-sm sm:text-base font-semibold">{it.q}</span>
                <ChevronRight className={`h-4 w-4 shrink-0 text-[color:var(--cyan)] transition-transform ${open?"rotate-90":""}`}/>
              </button>
              {open && <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">{it.a}</div>}
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ── Home ── */
function Home() {
  const { light, toggle } = useTheme();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  useEffect(()=>{ if (!loading&&!user) navigate({ to:"/auth" }); },[user,loading,navigate]);
  if (loading) {
    return (
      <div className="min-h-screen bg-[#060a14] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center animate-pulse">
            <Activity className="h-5 w-5 text-[#060a14]"/>
          </div>
          <p className="text-white/30 text-sm">Loading…</p>
        </div>
      </div>
    );
  }
  if (!user) return null;
  return (
    <div className="min-h-screen">
      <Header light={light} toggle={toggle}/>
      <main>
        <Hero/>
        <LiveDashboard/>
        <Trending/>
        <CompanyProfile/>
        <InteractiveChart/>
        <Ratios/>
        <GainersLosers/>
        <NewsGrid/>
        <EconCalendar/>
        <IPOSection/>
        <FundsSection/>
        <Education/>
        <Heatmap/>
        <GlobalMarkets/>
        <AIInsights/>
        <Testimonials/>
        <FAQ/>
        <Newsletter/>
      </main>
      <Footer/>
      <WhatsAppFab/>
    </div>
  );
}

