import { useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import {
  Search, Moon, Sun, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight,
  Activity, Sparkles, BarChart3, LineChart, CandlestickChart, Newspaper,
  Rocket, GraduationCap, Globe2, Brain, Mail, MessageCircle,
  ShieldCheck, Zap, ChevronRight, LayoutDashboard, Building2, AreaChart,
} from "lucide-react";

/* ---------- Owner + external link helpers ---------- */
const OWNER = {
  name: "Yashvi Rawal",
  email: "yashvirawal86@gmail.com",
  linkedin: "https://www.linkedin.com/in/yashvi-rawal",
  youtube: "https://www.youtube.com/@Yashvi-Rawal",
  instagram: "https://www.instagram.com/",
  site: "www.yr.stocketize.com",
  whatsapp: "https://wa.me/919550541145",
  whatsappDisplay: "+91 95505 41145",
};
const yahooQuote = (ticker: string) =>
  `https://finance.yahoo.com/quote/${encodeURIComponent(ticker.replace(/\./g, "-"))}`;
const googleNews = (q: string) =>
  `https://www.google.com/search?tbm=nws&q=${encodeURIComponent(q)}`;
const investopedia = (q: string) =>
  `https://www.investopedia.com/search?q=${encodeURIComponent(q)}`;
import { Sparkline, fmt } from "@/components/sparkline";
import {
  MARKET_INDICES, COMPANIES, NEWS, ECON_EVENTS, IPOS, FUNDS, SECTORS, RATIOS, GLOBAL_MARKETS,
  type Shareholder,
} from "@/lib/market-data";
import { subscribeToNewsletter } from "@/lib/newsletter.functions";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: "Stocketize AI — Indian Stock Market Intelligence, News & Learning" },
      { name: "description", content: "Live NSE & BSE market data, Nifty 50 & Sensex, company deep dives, IPOs, mutual funds, financial ratios and beginner-friendly investing education. Educational only — not financial advice." },
      { name: "keywords", content: "Indian stock market, NSE, BSE, Nifty 50, Sensex, IPO, mutual funds, share market news, stock analysis, investing for beginners, Stocketize AI" },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "Stocketize AI — Indian Stock Market Intelligence" },
      { property: "og:description", content: "Live markets, deep-dive company profiles, IPOs and jargon-free investing education." },
      { property: "og:site_name", content: "Stocketize AI" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Stocketize AI — Indian Stock Market Intelligence" },
      { name: "twitter:description", content: "Live markets, company deep dives and beginner-friendly education." },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Stocketize AI",
          url: "https://www.yr.stocketize.com/",
          potentialAction: {
            "@type": "SearchAction",
            target: "https://www.yr.stocketize.com/?q={search_term_string}",
            "query-input": "required name=search_term_string",
          },
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            { "@type": "Question", name: "Is Stocketize AI giving me financial advice?", acceptedAnswer: { "@type": "Answer", text: "No. All content is AI-generated and strictly for education and information only. Always consult a SEBI-registered advisor before investing." } },
            { "@type": "Question", name: "How current is the market data on Stocketize AI?", acceptedAnswer: { "@type": "Answer", text: "The platform simulates realistic Indian and global market data for demonstration. When connected to a live feed, indices, prices and news update automatically throughout market hours." } },
            { "@type": "Question", name: "Do I need a paid account to use Stocketize AI?", acceptedAnswer: { "@type": "Answer", text: "No. Reading market data, company profiles, education and news is completely free. The newsletter is also free." } },
            { "@type": "Question", name: "How often is the newsletter sent?", acceptedAnswer: { "@type": "Answer", text: "Subscribers receive a welcome brief immediately, a daily morning market update, and a longer weekend deep-dive." } },
            { "@type": "Question", name: "I'm a complete beginner — where should I start?", acceptedAnswer: { "@type": "Answer", text: "Head to the Investor Education Hub on the home page and start with 'What is the Stock Market?' followed by 'How to Start Investing'." } },
          ],
        }),
      },
    ],
  }),
});

/* ---------- Theme toggle ---------- */
function useTheme() {
  const [light, setLight] = useState(false);
  useEffect(() => {
    document.documentElement.classList.toggle("light", light);
  }, [light]);
  return { light, toggle: () => setLight((x) => !x) };
}

/* ---------- Header ---------- */
function Header({ light, toggle }: { light: boolean; toggle: () => void }) {
  const nav = ["Home", "Markets", "Companies", "News", "About"];
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 20);
    on(); window.addEventListener("scroll", on);
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all ${scrolled ? "py-2" : "py-4"}`}>
      <div className={`mx-auto max-w-7xl px-4 sm:px-6 transition-all`}>
        <div className={`glass-strong rounded-2xl px-3 sm:px-5 py-2.5 flex items-center gap-3 ${scrolled ? "glow-cyan" : ""}`}>
          <a href="#home" className="flex items-center gap-2 shrink-0">
            <div className="relative h-9 w-9 rounded-xl gradient-brand grid place-items-center glow-cyan">
              <Activity className="h-4 w-4 text-[color:var(--midnight)]" strokeWidth={3} />
            </div>
            <div className="hidden sm:block leading-tight">
              <div className="font-display font-bold text-[15px] tracking-tight">Stocketize<span className="gradient-text"> AI</span></div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-widest">Market Intelligence</div>
            </div>
          </a>

          <nav className="hidden lg:flex items-center gap-1 ml-4">
            {nav.map((n) => (
              <a key={n} href={`#${n.toLowerCase()}`}
                 className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground rounded-lg hover:bg-white/5 transition">
                {n}
              </a>
            ))}
          </nav>

          <div className="flex-1" />

          <SmartSearch />


          <button onClick={toggle} aria-label="Toggle theme"
            className="h-9 w-9 grid place-items-center rounded-xl glass hover:border-[color:var(--cyan)]/40 transition">
            {light ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </button>

          <LoginButton />

          <SignUpButton />
        </div>
      </div>
    </header>
  );
}

/* ---------- Login (Name + Mobile only) ---------- */
function LoginButton() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "" });
  const [sent, setSent] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = `Stocketize AI — Login request from ${form.name}`;
    const body = `Name: ${form.name}\nMobile: ${form.phone}\nDate: ${new Date().toLocaleString()}`;
    window.location.href = `mailto:${OWNER.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
    setTimeout(() => { setOpen(false); setSent(false); setForm({ name: "", phone: "" }); }, 1200);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="h-9 px-4 rounded-xl glass hover:border-[color:var(--cyan)]/40 text-sm font-semibold transition shrink-0">
        Login
      </button>
      {open && (
        <Modal onClose={() => setOpen(false)}>
          <div className="mb-5">
            <div className="text-xs uppercase tracking-[0.2em] text-[color:var(--cyan)] font-semibold mb-2">Welcome back</div>
            <h3 className="text-2xl font-bold leading-tight">Log in to <span className="gradient-text">Stocketize AI</span></h3>
            <p className="text-sm text-muted-foreground mt-1">Enter the same name and mobile number you used when signing up.</p>
          </div>
          <form onSubmit={submit} className="space-y-3">
            <Field label="Full name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} placeholder="Jane Doe" required />
            <Field label="Mobile number" type="tel" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} placeholder="+91 98765 43210" required />
            <button type="submit" className="w-full h-11 rounded-xl gradient-brand text-[color:var(--midnight)] font-semibold hover:opacity-90 transition">
              {sent ? "✓ Sent" : "Log in"}
            </button>
          </form>
        </Modal>
      )}
    </>
  );
}

/* ---------- Sign Up ---------- */
function SignUpButton() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", purpose: "" });
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreePrivacy || !agreeTerms) return;
    const subject = `New Stocketize AI Sign Up — ${form.name}`;
    const body = [
      `A new visitor just signed up on Stocketize AI:`,
      ``,
      `Name:      ${form.name}`,
      `Email:     ${form.email}`,
      `Contact:   ${form.phone}`,
      `Purpose:   ${form.purpose}`,
      ``,
      `Accepted Privacy Policy: Yes`,
      `Accepted Terms & Conditions: Yes`,
      ``,
      `Date:      ${new Date().toLocaleString()}`,
      `Site:      ${OWNER.site}`,
    ].join("\n");
    window.location.href =
      `mailto:${OWNER.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
    setTimeout(() => {
      setOpen(false); setSent(false);
      setForm({ name: "", email: "", phone: "", purpose: "" });
      setAgreePrivacy(false); setAgreeTerms(false);
    }, 1200);
  };

  const canSubmit = agreePrivacy && agreeTerms;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="h-9 px-4 rounded-xl gradient-brand text-[color:var(--midnight)] text-sm font-semibold hover:opacity-90 transition shrink-0">
        Sign Up
      </button>
      {open && (
        <Modal onClose={() => setOpen(false)}>
          <div className="mb-5">
            <div className="text-xs uppercase tracking-[0.2em] text-[color:var(--cyan)] font-semibold mb-2">Join Stocketize AI</div>
            <h3 className="text-2xl font-bold leading-tight">Create your <span className="gradient-text">free account</span></h3>
            <p className="text-sm text-muted-foreground mt-1">Tell us a bit about yourself — we'll get you set up.</p>
          </div>
          <form onSubmit={submit} className="space-y-3">
            <Field label="Full name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} placeholder="Jane Doe" required />
            <Field label="Email address" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} placeholder="you@email.com" required />
            <Field label="Contact number" type="tel" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} placeholder="+91 98765 43210" required />
            <div>
              <label className="text-[11px] uppercase tracking-widest text-muted-foreground font-semibold">Purpose of visit</label>
              <textarea required rows={3} value={form.purpose} onChange={(e) => setForm({ ...form, purpose: e.target.value })}
                placeholder="e.g. learning about the stock market, tracking my portfolio, researching companies…"
                className="mt-1 w-full px-3 py-2 rounded-xl glass bg-transparent border border-white/10 focus:border-[color:var(--cyan)]/50 outline-none text-sm resize-none" />
            </div>

            <label className="flex items-start gap-2.5 text-xs text-muted-foreground cursor-pointer select-none">
              <input type="checkbox" required checked={agreePrivacy} onChange={(e) => setAgreePrivacy(e.target.checked)}
                className="mt-0.5 h-4 w-4 accent-[color:var(--cyan)] shrink-0" />
              <span>I have read and agree to the{" "}
                <Link to="/privacy" target="_blank" className="text-[color:var(--cyan)] hover:underline">Privacy Policy</Link>.
              </span>
            </label>
            <label className="flex items-start gap-2.5 text-xs text-muted-foreground cursor-pointer select-none">
              <input type="checkbox" required checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-0.5 h-4 w-4 accent-[color:var(--cyan)] shrink-0" />
              <span>I accept the{" "}
                <Link to="/terms" target="_blank" className="text-[color:var(--cyan)] hover:underline">Terms &amp; Conditions</Link>{" "}
                and the{" "}
                <Link to="/disclaimer" target="_blank" className="text-[color:var(--cyan)] hover:underline">Disclaimer</Link>.
              </span>
            </label>

            <button type="submit" disabled={!canSubmit}
              className="w-full h-11 rounded-xl gradient-brand text-[color:var(--midnight)] font-semibold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed">
              {sent ? "✓ Submitted" : "Create Account"}
            </button>
            {!canSubmit && (
              <p className="text-[11px] text-muted-foreground text-center">Please accept both agreements to continue.</p>
            )}
          </form>
        </Modal>
      )}
    </>
  );
}

function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] grid place-items-center p-4 bg-[color:var(--midnight)]/70 backdrop-blur-sm animate-in fade-in"
         onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()}
           className="glass-strong rounded-2xl w-full max-w-md p-6 sm:p-8 relative">
        <button aria-label="Close" onClick={onClose}
          className="absolute top-3 right-3 h-8 w-8 grid place-items-center rounded-lg hover:bg-white/10 transition text-muted-foreground">✕</button>
        {children}
      </div>
    </div>
  );
}

/* ---------- Smart site-wide search ---------- */
function SmartSearch() {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  type Hit = { label: string; sub: string; type: string; href: string; external?: boolean };
  const results: Hit[] = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return [];
    const hits: Hit[] = [];
    COMPANIES.forEach((c) => {
      if (c.name.toLowerCase().includes(term) || c.ticker.toLowerCase().includes(term) || c.sector.toLowerCase().includes(term)) {
        hits.push({ label: c.name, sub: `${c.ticker} • ${c.sector}`, type: "Company", href: "/#companies" });
      }
    });
    SECTORS.forEach((s) => {
      if (s.name.toLowerCase().includes(term)) hits.push({ label: s.name, sub: "Sector heatmap", type: "Sector", href: "/#markets" });
    });
    NEWS.forEach((n) => {
      if (n.title.toLowerCase().includes(term) || n.category.toLowerCase().includes(term)) {
        hits.push({ label: n.title, sub: `${n.source} • ${n.category}`, type: "News", href: googleNews(n.title), external: true });
      }
    });
    IPOS.forEach((i) => {
      if (i.name.toLowerCase().includes(term)) hits.push({ label: i.name, sub: `IPO • ${i.status} • ${i.date}`, type: "IPO", href: "/#ipos" });
    });
    FUNDS.forEach((f) => {
      if (f.name.toLowerCase().includes(term) || f.category.toLowerCase().includes(term)) {
        hits.push({ label: f.name, sub: `Fund • ${f.category}`, type: "Fund", href: "/#funds" });
      }
    });
    RATIOS.forEach((r) => {
      if (r.name.toLowerCase().includes(term) || r.explain.toLowerCase().includes(term)) {
        hits.push({ label: r.name, sub: "Financial ratio", type: "Learn", href: investopedia(r.name), external: true });
      }
    });
    const edu = [
      "What is the Stock Market?", "How to Start Investing", "Types of Stocks",
      "Fundamental Analysis", "Technical Analysis", "Risk Management",
      "Investment Strategies", "Options & Derivatives 101",
    ];
    edu.forEach((e) => {
      if (e.toLowerCase().includes(term)) hits.push({ label: e, sub: "Education", type: "Learn", href: "/#learn" });
    });
    return hits.slice(0, 8);
  }, [q]);

  return (
    <div ref={ref} className="relative hidden md:block">
      <div className="flex items-center gap-2 glass rounded-xl px-3 py-1.5 min-w-0 w-64">
        <Search className="h-4 w-4 text-muted-foreground shrink-0" />
        <input
          value={q}
          onChange={(e) => { setQ(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          placeholder="Search companies, sectors, IPOs…"
          className="bg-transparent outline-none text-sm min-w-0 flex-1 placeholder:text-muted-foreground/70" />
      </div>
      {open && q.trim() && (
        <div className="absolute right-0 mt-2 w-[420px] max-w-[92vw] glass-strong rounded-2xl p-2 shadow-2xl z-[80] max-h-[70vh] overflow-y-auto">
          {results.length === 0 ? (
            <div className="p-4 text-sm text-muted-foreground text-center">No matches for "{q}".</div>
          ) : results.map((r, i) => (
            <a key={i} href={r.href} target={r.external ? "_blank" : undefined} rel={r.external ? "noreferrer noopener" : undefined}
               onClick={() => setOpen(false)}
               className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/5 transition">
              <span className="text-[10px] uppercase tracking-widest text-[color:var(--cyan)] font-semibold shrink-0 mt-0.5 w-14">{r.type}</span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium truncate">{r.label}</span>
                <span className="block text-[11px] text-muted-foreground truncate">{r.sub}</span>
              </span>
              <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

function Field({ label, value, onChange, type = "text", placeholder, required }:
  { label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string; required?: boolean }) {
  return (
    <div>
      <label className="text-[11px] uppercase tracking-widest text-muted-foreground font-semibold">{label}</label>
      <input type={type} required={required} placeholder={placeholder} value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full h-11 px-3 rounded-xl glass bg-transparent border border-white/10 focus:border-[color:var(--cyan)]/50 outline-none text-sm" />
    </div>
  );
}


/* ---------- Hero ---------- */
function Hero() {
  const tickers = [...MARKET_INDICES, ...MARKET_INDICES];
  return (
    <section id="home" className="relative pt-32 pb-20 overflow-hidden">
      <div className="absolute inset-0 animate-grid opacity-30 pointer-events-none" />
      <div className="absolute -top-20 -right-20 h-96 w-96 rounded-full bg-[color:var(--cyan)]/20 blur-[120px] pointer-events-none" />
      <div className="absolute top-40 -left-20 h-96 w-96 rounded-full bg-[color:var(--aqua)]/15 blur-[120px] pointer-events-none" />

      {/* Floating candlesticks */}
      <div className="absolute inset-0 pointer-events-none">
        {[
          { l: "12%", t: "22%", d: "0s" },
          { l: "82%", t: "28%", d: "1.5s" },
          { l: "18%", t: "70%", d: "3s" },
          { l: "88%", t: "68%", d: "2s" },
        ].map((p, i) => (
          <div key={i} className="animate-float absolute opacity-40" style={{ left: p.l, top: p.t, animationDelay: p.d }}>
            <CandlestickChart className="h-10 w-10 text-[color:var(--cyan)]" />
          </div>
        ))}
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 glass rounded-full px-3 py-1.5 text-xs text-muted-foreground mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--gain)] animate-pulse-glow" />
              Live Market Data • Educational Platform
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05]">
              Real-Time Stock Market{" "}
              <span className="gradient-text">Intelligence</span> for Smarter Learning
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-xl">
              Track live markets, discover company insights, analyze financial data, and stay updated with breaking market news — all in one place.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#markets" className="group inline-flex items-center gap-2 h-12 px-5 rounded-xl gradient-brand text-[color:var(--midnight)] font-semibold hover:opacity-90 transition glow-cyan">
                Explore Markets <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
              </a>
              <a href="#dashboard" className="inline-flex items-center gap-2 h-12 px-5 rounded-xl glass hover:border-[color:var(--cyan)]/40 transition font-medium">
                <LayoutDashboard className="h-4 w-4" /> Live Dashboard
              </a>
            </div>

            <div className="mt-10 grid grid-cols-3 gap-3 max-w-md">
              {[
                { k: "10K+", v: "Instruments" },
                { k: "25+", v: "Global Markets" },
                { k: "Live", v: "Data Refresh" },
              ].map((s) => (
                <div key={s.v} className="glass rounded-xl px-4 py-3">
                  <div className="text-lg sm:text-xl font-bold gradient-text">{s.k}</div>
                  <div className="text-[11px] uppercase tracking-wide text-muted-foreground">{s.v}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Hero chart card */}
          <div className="relative">
            <div className="glass-strong rounded-3xl p-5 hover-lift">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-widest">NIFTY 50</div>
                  <div className="flex items-baseline gap-2">
                    <div className="font-mono text-2xl font-bold">24,856.30</div>
                    <div className="text-sm font-semibold text-[color:var(--gain)] flex items-center gap-0.5">
                      <TrendingUp className="h-3.5 w-3.5" /> +0.58%
                    </div>
                  </div>
                </div>
                <div className="flex gap-1">
                  {["1D", "1W", "1M", "1Y"].map((r, i) => (
                    <button key={r} className={`px-2.5 py-1 text-xs rounded-md ${i === 2 ? "bg-[color:var(--cyan)]/20 text-[color:var(--cyan)]" : "text-muted-foreground hover:bg-white/5"}`}>{r}</button>
                  ))}
                </div>
              </div>
              <HeroChart />
              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                {[
                  { k: "Open", v: "24,714" },
                  { k: "High", v: "24,912" },
                  { k: "Low", v: "24,689" },
                ].map((x) => (
                  <div key={x.k} className="glass rounded-lg py-2">
                    <div className="text-[10px] uppercase text-muted-foreground">{x.k}</div>
                    <div className="font-mono text-sm">{x.v}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 glass-strong rounded-2xl p-3 hidden sm:flex items-center gap-2 glow-cyan animate-float">
              <Sparkles className="h-4 w-4 text-[color:var(--aqua)]" />
              <span className="text-xs">AI Analysis Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Ticker */}
      <div className="mt-16 relative overflow-hidden border-y border-white/10 py-3 glass">
        <div className="flex gap-8 animate-ticker whitespace-nowrap">
          {tickers.map((t, i) => (
            <div key={i} className="flex items-center gap-2 text-sm">
              <span className="font-semibold">{t.name}</span>
              <span className="font-mono">{fmt(t.price)}</span>
              <span className={`font-mono text-xs ${t.change >= 0 ? "text-[color:var(--gain)]" : "text-[color:var(--loss)]"}`}>
                {t.change >= 0 ? "▲" : "▼"} {fmt(Math.abs(t.changePct))}%
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
  const pts = useMemo(() => {
    const arr: number[] = [];
    let v = 100;
    for (let i = 0; i < 60; i++) { v = v * (1 + (Math.random() - 0.48) * 0.02); arr.push(v); }
    return arr;
  }, []);
  const w = 460, h = 180;
  const min = Math.min(...pts), max = Math.max(...pts);
  const step = w / (pts.length - 1);
  const line = pts.map((v, i) => `${i * step},${h - ((v - min) / (max - min)) * (h - 20) - 10}`).join(" ");
  const area = `M0,${h} L ${line} L ${w},${h} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-40">
      <defs>
        <linearGradient id="heroGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--cyan)" stopOpacity="0.5" />
          <stop offset="100%" stopColor="var(--cyan)" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75].map((y) => (
        <line key={y} x1="0" y1={h * y} x2={w} y2={h * y} stroke="currentColor" strokeOpacity="0.08" strokeDasharray="2 4" />
      ))}
      <path d={area} fill="url(#heroGrad)" />
      <polyline points={line} fill="none" stroke="var(--cyan)" strokeWidth="2" />
      <circle cx={(pts.length - 1) * step} cy={h - ((pts[pts.length - 1] - min) / (max - min)) * (h - 20) - 10} r="4" fill="var(--aqua)" />
      <circle cx={(pts.length - 1) * step} cy={h - ((pts[pts.length - 1] - min) / (max - min)) * (h - 20) - 10} r="8" fill="var(--aqua)" opacity="0.3" className="animate-pulse-glow" />
    </svg>
  );
}

/* ---------- Section title ---------- */
function SectionTitle({ eyebrow, title, subtitle, id }: { eyebrow?: string; title: React.ReactNode; subtitle?: string; id?: string }) {
  return (
    <div id={id} className="mb-10 max-w-3xl">
      {eyebrow && <div className="text-xs uppercase tracking-[0.2em] text-[color:var(--cyan)] mb-3 font-semibold">{eyebrow}</div>}
      <h2 className="text-3xl sm:text-4xl font-bold leading-tight">{title}</h2>
      {subtitle && <p className="mt-3 text-muted-foreground text-base sm:text-lg">{subtitle}</p>}
    </div>
  );
}

/* ---------- Live Dashboard ---------- */
function LiveDashboard() {
  const [tick, setTick] = useState(0);
  useEffect(() => { const id = setInterval(() => setTick((t) => t + 1), 3500); return () => clearInterval(id); }, []);
  return (
    <section className="relative py-20 mx-auto max-w-7xl px-4 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-10" id="dashboard">
        <SectionTitle eyebrow="Live Dashboard" title={<>The Market at a <span className="gradient-text">Glance</span></>}
          subtitle="Real-time snapshots of global indices, commodities, and FX. Data refreshes automatically." />
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--gain)] animate-pulse-glow" /> Auto-refresh • Sample data
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {MARKET_INDICES.map((m) => {
          const jitter = Math.sin((tick + m.symbol.length) * 1.3) * 0.15;
          const px = m.price * (1 + jitter * 0.001);
          const up = m.change >= 0;
          return (
            <div key={m.symbol} className="group glass rounded-2xl p-4 hover-lift">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{m.symbol}</div>
                  <div className="text-sm font-semibold">{m.name}</div>
                </div>
                <div className={`h-7 w-7 rounded-lg grid place-items-center ${up ? "bg-[color:var(--gain)]/10 text-[color:var(--gain)]" : "bg-[color:var(--loss)]/10 text-[color:var(--loss)]"}`}>
                  {up ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                </div>
              </div>
              <div className="font-mono text-lg font-bold">{fmt(px)}</div>
              <div className={`text-xs font-medium mt-0.5 ${up ? "text-[color:var(--gain)]" : "text-[color:var(--loss)]"}`}>
                {up ? "+" : ""}{fmt(m.change)} ({up ? "+" : ""}{fmt(m.changePct)}%)
              </div>
              <div className="mt-2"><Sparkline data={m.spark} up={up} width={160} height={36} /></div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ---------- Trending Stocks ---------- */
function Trending() {
  return (
    <section className="relative py-20 mx-auto max-w-7xl px-4 sm:px-6">
      <SectionTitle eyebrow="Trending Stocks" id="companies"
        title={<>Blue-Chip <span className="gradient-text">Movers</span> Today</>}
        subtitle="Fundamentals and sentiment at a glance across global and Indian large-caps. For information only — not investment advice." />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {COMPANIES.slice(0, 9).map((c) => <StockCard key={c.ticker} c={c} />)}
      </div>
    </section>
  );
}

function StockCard({ c }: { c: (typeof COMPANIES)[number] }) {
  const up = c.change >= 0;
  const recColor = c.recommendation === "Buy" ? "text-[color:var(--gain)] bg-[color:var(--gain)]/10" :
    c.recommendation === "Sell" ? "text-[color:var(--loss)] bg-[color:var(--loss)]/10" :
    "text-[color:var(--lavender)] bg-white/5";
  return (
    <div className="glass rounded-2xl p-5 hover-lift">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-11 w-11 rounded-xl grid place-items-center font-bold text-white shrink-0" style={{ background: c.color }}>{c.logo}</div>
          <div className="min-w-0">
            <div className="font-semibold truncate">{c.name}</div>
            <div className="text-xs text-muted-foreground">{c.ticker} • {c.sector}</div>
          </div>
        </div>
        <span className={`text-[10px] font-semibold px-2 py-1 rounded-md ${recColor}`}>{c.recommendation}</span>
      </div>
      <div className="flex items-baseline justify-between mb-4">
        <div className="font-mono text-xl font-bold">{c.ticker.length > 4 ? "₹" : "$"}{fmt(c.price)}</div>
        <div className={`text-sm font-semibold ${up ? "text-[color:var(--gain)]" : "text-[color:var(--loss)]"} flex items-center gap-0.5`}>
          {up ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
          {up ? "+" : ""}{fmt(c.changePct)}%
        </div>
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
        <Meta k="Market Cap" v={c.marketCap} />
        <Meta k="P / E" v={fmt(c.pe)} />
        <Meta k="Div. Yield" v={`${fmt(c.divYield)}%`} />
        <Meta k="Sentiment" v={c.sentiment} tone={c.sentiment === "Bullish" ? "up" : c.sentiment === "Bearish" ? "down" : "n"} />
        <Meta k="52W High" v={c.ticker.length > 4 ? `₹${fmt(c.high52)}` : `$${fmt(c.high52)}`} />
        <Meta k="52W Low" v={c.ticker.length > 4 ? `₹${fmt(c.low52)}` : `$${fmt(c.low52)}`} />
      </div>
    </div>
  );
}

function Meta({ k, v, tone }: { k: string; v: string; tone?: "up" | "down" | "n" }) {
  const c = tone === "up" ? "text-[color:var(--gain)]" : tone === "down" ? "text-[color:var(--loss)]" : "";
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wide text-muted-foreground">{k}</div>
      <div className={`font-mono text-sm font-medium ${c}`}>{v}</div>
    </div>
  );
}

/* ---------- Company Profile ---------- */
type Exchange = "ALL" | "NSE" | "BSE";
function CompanyProfile() {
  const [q, setQ] = useState("");
  const [exchange, setExchange] = useState<Exchange>("ALL");
  // NSE and BSE each show a different subset (BOTH-listed appear on both);
  // ALL includes globals.
  const filtered = COMPANIES.filter((c) => {
    const matches = c.name.toLowerCase().includes(q.toLowerCase()) || c.ticker.toLowerCase().includes(q.toLowerCase());
    if (!matches) return false;
    if (exchange === "NSE") return c.exchange === "NSE" || c.exchange === "BOTH";
    if (exchange === "BSE") return c.exchange === "BSE" || c.exchange === "BOTH";
    return true;
  });
  const [active, setActive] = useState(COMPANIES[0]);
  // Keep active in current filter
  useEffect(() => {
    if (!filtered.find((c) => c.ticker === active.ticker) && filtered[0]) setActive(filtered[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exchange]);

  return (
    <section className="relative py-20 mx-auto max-w-7xl px-4 sm:px-6">
      <SectionTitle eyebrow="Company Intelligence"
        title={<>Deep-Dive <span className="gradient-text">Profiles</span></>}
        subtitle="Switch between NSE, BSE and global listings, then explore leadership, financials, shareholding and business context." />
      <div className="grid lg:grid-cols-[320px_1fr] gap-6">
        <div className="glass-strong rounded-2xl p-4">
          <div className="grid grid-cols-3 gap-1 glass rounded-xl p-1 mb-3">
            {(["ALL", "NSE", "BSE"] as Exchange[]).map((ex) => (
              <button key={ex} onClick={() => setExchange(ex)}
                className={`h-8 rounded-lg text-xs font-semibold transition ${exchange === ex ? "bg-[color:var(--cyan)] text-[color:var(--midnight)]" : "text-muted-foreground hover:text-foreground"}`}>
                {ex}
              </button>
            ))}
          </div>
          <div className="glass rounded-xl px-3 py-2 flex items-center gap-2 mb-3">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input placeholder={`Search ${exchange === "ALL" ? "all" : exchange} companies…`} value={q} onChange={(e) => setQ(e.target.value)}
              className="bg-transparent outline-none text-sm flex-1 min-w-0" />
          </div>
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground px-1 pb-1">
            {filtered.length} {exchange === "ALL" ? "listings" : `${exchange} listings`}
          </div>
          <div className="max-h-[520px] overflow-y-auto space-y-1 pr-1">
            {filtered.length === 0 && (
              <div className="p-4 text-xs text-muted-foreground text-center">No listed companies match this filter.</div>
            )}
            {filtered.map((c) => (
              <button key={c.ticker} onClick={() => setActive(c)}
                className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition ${active.ticker === c.ticker ? "bg-[color:var(--cyan)]/15 border border-[color:var(--cyan)]/30" : "hover:bg-white/5 border border-transparent"}`}>
                <div className="h-9 w-9 rounded-lg grid place-items-center text-xs font-bold text-white shrink-0" style={{ background: c.color }}>{c.logo}</div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium truncate">{c.name}</div>
                  <div className="text-[11px] text-muted-foreground">
                    {c.ticker} • {c.exchange === "BOTH" ? "NSE / BSE" : c.exchange}
                  </div>
                </div>
                <div className={`text-xs font-mono ${c.change >= 0 ? "text-[color:var(--gain)]" : "text-[color:var(--loss)]"}`}>
                  {c.change >= 0 ? "+" : ""}{fmt(c.changePct)}%
                </div>
              </button>
            ))}
          </div>
        </div>



        <div className="glass-strong rounded-2xl p-6 lg:p-8">
          <div className="flex flex-wrap items-start gap-4 justify-between mb-6">
            <div className="flex items-center gap-4 min-w-0">
              <div className="h-14 w-14 rounded-2xl grid place-items-center font-bold text-white text-lg shrink-0" style={{ background: active.color }}>{active.logo}</div>
              <div className="min-w-0">
                <div className="text-xs uppercase tracking-widest text-muted-foreground">{active.sector}</div>
                <h3 className="text-2xl font-bold truncate">{active.name}</h3>
                <div className="text-sm text-muted-foreground">{active.ticker} • Listed {active.founded}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-mono text-2xl font-bold">{active.ticker.length > 4 ? "₹" : "$"}{fmt(active.price)}</div>
              <div className={`text-sm font-semibold ${active.change >= 0 ? "text-[color:var(--gain)]" : "text-[color:var(--loss)]"}`}>
                {active.change >= 0 ? "+" : ""}{fmt(active.change)} ({active.change >= 0 ? "+" : ""}{fmt(active.changePct)}%)
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-3 mb-6">
            {[
              { k: "CEO", v: active.ceo },
              { k: "Headquarters", v: active.hq },
              { k: "Founded", v: String(active.founded) },
              { k: "Revenue", v: active.revenue },
              { k: "Net Profit", v: active.netProfit },
              { k: "Employees", v: active.employees },
            ].map((x) => (
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
              <ShareholdingBar parts={active.shareholding} />
            </div>
            <div className="glass rounded-xl p-4">
              <div className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Major competitors</div>
              <div className="flex flex-wrap gap-2">
                {active.competitors.map((c) => (
                  <span key={c} className="text-xs px-2.5 py-1 rounded-md glass border border-white/10">{c}</span>
                ))}
              </div>
            </div>
          </div>

          <a href={yahooQuote(active.ticker)} target="_blank" rel="noreferrer noopener"
             className="inline-flex items-center gap-2 h-11 px-5 rounded-xl gradient-brand text-[color:var(--midnight)] font-semibold hover:opacity-90 transition">
            View Complete Analysis <ChevronRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}

function ShareholdingBar({ parts }: { parts: Shareholder[] }) {
  const total = parts.reduce((a, p) => a + p.v, 0) || 1;
  return (
    <div>
      <div className="flex h-3 rounded-full overflow-hidden mb-3">
        {parts.map((p) => (
          <div key={p.k} style={{ width: `${(p.v / total) * 100}%`, background: p.c }} />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-y-1.5 text-xs">
        {parts.map((p) => (
          <div key={p.k} className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full" style={{ background: p.c }} />
            <span className="text-muted-foreground">{p.k}</span>
            <span className="ml-auto font-mono">{fmt(p.v)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Interactive Chart ---------- */
function InteractiveChart() {
  const ranges = ["1D", "1W", "1M", "6M", "1Y", "5Y"];
  const [range, setRange] = useState("1M");
  const [type, setType] = useState<"candle" | "line" | "area">("candle");
  const data = useMemo(() => {
    const n = { "1D": 40, "1W": 60, "1M": 90, "6M": 120, "1Y": 160, "5Y": 200 }[range]!;
    const arr: { o: number; c: number; h: number; l: number }[] = [];
    let v = 100;
    for (let i = 0; i < n; i++) {
      const o = v; const c = v * (1 + (Math.random() - 0.48) * 0.025);
      const h = Math.max(o, c) * (1 + Math.random() * 0.008);
      const l = Math.min(o, c) * (1 - Math.random() * 0.008);
      arr.push({ o, c, h, l }); v = c;
    }
    return arr;
  }, [range]);
  return (
    <section className="relative py-20 mx-auto max-w-7xl px-4 sm:px-6">
      <SectionTitle eyebrow="Interactive Charts"
        title={<>Analyze <span className="gradient-text">Any Timeframe</span></>}
        subtitle="Switch between candlestick and line, adjust the timeframe, and layer volume alongside the price action." />
      <div className="glass-strong rounded-3xl p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="flex gap-1 glass rounded-xl p-1">
            {ranges.map((r) => (
              <button key={r} onClick={() => setRange(r)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${range === r ? "bg-[color:var(--cyan)] text-[color:var(--midnight)]" : "text-muted-foreground hover:text-foreground"}`}>{r}</button>
            ))}
          </div>
          <div className="flex gap-1 glass rounded-xl p-1">
            <button onClick={() => setType("candle")} className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg ${type === "candle" ? "bg-[color:var(--cyan)] text-[color:var(--midnight)]" : "text-muted-foreground"}`}>
              <CandlestickChart className="h-3.5 w-3.5" /> Candles
            </button>
            <button onClick={() => setType("line")} className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg ${type === "line" ? "bg-[color:var(--cyan)] text-[color:var(--midnight)]" : "text-muted-foreground"}`}>
              <LineChart className="h-3.5 w-3.5" /> Line
            </button>
          </div>
          <div className="ml-auto flex flex-wrap gap-2 text-xs text-muted-foreground">
            {["RSI", "MACD", "MA(20)", "MA(50)", "Volume"].map((i) => (
              <span key={i} className="glass px-2.5 py-1 rounded-md border border-white/10">{i}</span>
            ))}
          </div>
        </div>
        <BigChart data={data} type={type} />
      </div>
    </section>
  );
}

function BigChart({ data, type }: { data: { o: number; c: number; h: number; l: number }[]; type: "candle" | "line" }) {
  const w = 1100, h = 360, pad = 20;
  const all = data.flatMap((d) => [d.h, d.l]);
  const min = Math.min(...all), max = Math.max(...all);
  const y = (v: number) => pad + (h - pad * 2) * (1 - (v - min) / (max - min));
  const step = (w - pad * 2) / data.length;
  const line = data.map((d, i) => `${pad + i * step},${y(d.c)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-[300px] sm:h-[380px]">
      <defs>
        <linearGradient id="chartArea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--cyan)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="var(--cyan)" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0.2, 0.4, 0.6, 0.8].map((p) => (
        <line key={p} x1="0" y1={h * p} x2={w} y2={h * p} stroke="currentColor" strokeOpacity="0.06" strokeDasharray="3 5" />
      ))}
      {type === "line" && (
        <>
          <path d={`M ${pad},${h} L ${line} L ${w - pad},${h} Z`} fill="url(#chartArea)" />
          <polyline points={line} fill="none" stroke="var(--cyan)" strokeWidth="2" />
        </>
      )}
      {type === "candle" && data.map((d, i) => {
        const x = pad + i * step; const up = d.c >= d.o;
        const color = up ? "var(--gain)" : "var(--loss)";
        return (
          <g key={i}>
            <line x1={x + step / 2} x2={x + step / 2} y1={y(d.h)} y2={y(d.l)} stroke={color} strokeWidth="1" />
            <rect x={x + 1} y={y(Math.max(d.o, d.c))} width={Math.max(1, step - 2)} height={Math.max(1, Math.abs(y(d.o) - y(d.c)))} fill={color} rx="0.5" />
          </g>
        );
      })}
    </svg>
  );
}

/* ---------- Ratios ---------- */
function Ratios() {
  return (
    <section className="relative py-20 mx-auto max-w-7xl px-4 sm:px-6">
      <SectionTitle eyebrow="Financial Ratios"
        title={<>The <span className="gradient-text">Numbers That Matter</span></>}
        subtitle="Every ratio comes with a beginner-friendly explanation." />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {RATIOS.map((r) => (
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

/* ---------- Gainers / Losers ---------- */
function GainersLosers() {
  const sorted = [...COMPANIES].sort((a, b) => b.changePct - a.changePct);
  const gainers = sorted.filter((c) => c.change >= 0).slice(0, 5);
  const losers = sorted.filter((c) => c.change < 0).reverse().slice(0, 5);
  return (
    <section className="relative py-20 mx-auto max-w-7xl px-4 sm:px-6">
      <SectionTitle eyebrow="Movers"
        title={<>Today's <span className="gradient-text">Top Gainers & Losers</span></>}
        subtitle="Auto-updated market movers across our tracked universe." />
      <div className="grid md:grid-cols-2 gap-6">
        <MoversTable title="Top Gainers" rows={gainers} up />
        <MoversTable title="Top Losers" rows={losers} up={false} />
      </div>
    </section>
  );
}

function MoversTable({ title, rows, up }: { title: string; rows: typeof COMPANIES; up: boolean }) {
  return (
    <div className="glass-strong rounded-2xl overflow-hidden">
      <div className={`px-5 py-4 flex items-center gap-2 border-b border-white/10 ${up ? "text-[color:var(--gain)]" : "text-[color:var(--loss)]"}`}>
        {up ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
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
          {rows.map((r, i) => (
            <tr key={r.ticker} className="border-t border-white/5 hover:bg-white/5 transition">
              <td className="px-5 py-3 text-muted-foreground font-mono text-xs">{i + 1}</td>
              <td className="px-5 py-3">
                <div className="flex items-center gap-2.5">
                  <div className="h-7 w-7 rounded-md grid place-items-center text-[10px] font-bold text-white" style={{ background: r.color }}>{r.logo}</div>
                  <div>
                    <div className="text-sm font-medium">{r.name}</div>
                    <div className="text-[11px] text-muted-foreground">{r.ticker}</div>
                  </div>
                </div>
              </td>
              <td className="px-5 py-3 text-right font-mono">{r.ticker.length > 4 ? "₹" : "$"}{fmt(r.price)}</td>
              <td className={`px-5 py-3 text-right font-mono font-semibold ${up ? "text-[color:var(--gain)]" : "text-[color:var(--loss)]"}`}>
                {up ? "+" : ""}{fmt(r.changePct)}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ---------- News ---------- */
function NewsGrid() {
  return (
    <section className="relative py-20 mx-auto max-w-7xl px-4 sm:px-6">
      <div className="flex items-end justify-between flex-wrap gap-4" id="news">
        <SectionTitle eyebrow="Market News" title={<>Latest <span className="gradient-text">Headlines</span></>}
          subtitle="Curated from trusted financial news sources — updates automatically." />
        <a href="https://finance.yahoo.com/news/" target="_blank" rel="noreferrer noopener" className="text-sm text-[color:var(--cyan)] hover:underline">View all →</a>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {NEWS.map((n, i) => (
          <article key={i} className="glass rounded-2xl overflow-hidden hover-lift group">
            <div className="relative h-40 overflow-hidden" style={{ background: n.image }}>
              <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--midnight)]/80 to-transparent" />
              <div className="absolute top-3 left-3 text-[10px] uppercase tracking-widest bg-white/15 backdrop-blur px-2 py-1 rounded-md font-semibold">{n.category}</div>
              <Newspaper className="absolute bottom-3 right-3 h-8 w-8 text-white/70" />
            </div>
            <div className="p-5">
              <div className="flex items-center gap-2 text-[11px] text-muted-foreground mb-2">
                <span className="font-medium text-foreground/80">{n.source}</span>
                <span>•</span><span>{n.time}</span>
              </div>
              <h3 className="font-semibold leading-snug mb-2 group-hover:text-[color:var(--cyan)] transition">{n.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2">{n.summary}</p>
              <a href={googleNews(n.title)} target="_blank" rel="noreferrer noopener"
                 className="mt-4 text-xs font-semibold text-[color:var(--cyan)] inline-flex items-center gap-1 hover:gap-2 transition-all">
                Read more <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ---------- Economic Calendar ---------- */
function EconCalendar() {
  return (
    <section className="relative py-20 mx-auto max-w-7xl px-4 sm:px-6">
      <SectionTitle eyebrow="Economic Calendar"
        title={<>Upcoming <span className="gradient-text">Market-Moving Events</span></>}
        subtitle="Central-bank decisions, macro releases, earnings, and IPO dates." />
      <div className="glass-strong rounded-2xl overflow-hidden">
        <div className="hidden sm:grid grid-cols-[100px_100px_80px_1fr_100px] px-5 py-3 text-[11px] uppercase tracking-widest text-muted-foreground border-b border-white/10">
          <div>Date</div><div>Time IST</div><div>Region</div><div>Event</div><div className="text-right">Impact</div>
        </div>
        {ECON_EVENTS.map((e, i) => (
          <div key={i} className="grid grid-cols-2 sm:grid-cols-[100px_100px_80px_1fr_100px] px-5 py-4 border-b border-white/5 last:border-0 items-center gap-2 hover:bg-white/5 transition">
            <div className="font-mono text-sm">{e.date}</div>
            <div className="font-mono text-xs text-muted-foreground">{e.time}</div>
            <div className="text-xs"><span className="glass px-2 py-0.5 rounded-md">{e.region}</span></div>
            <div className="col-span-2 sm:col-span-1 text-sm font-medium">{e.event}</div>
            <div className="text-right">
              <span className={`text-[10px] font-semibold px-2 py-1 rounded-md ${
                e.impact === "High" ? "bg-[color:var(--loss)]/15 text-[color:var(--loss)]" :
                e.impact === "Medium" ? "bg-[color:var(--aqua)]/15 text-[color:var(--aqua)]" :
                "bg-white/5 text-muted-foreground"
              }`}>{e.impact}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------- IPO ---------- */
function IPOSection() {
  const [tab, setTab] = useState<"Upcoming" | "Open" | "Closed">("Open");
  return (
    <section id="ipos" className="relative py-20 mx-auto max-w-7xl px-4 sm:px-6">
      <SectionTitle eyebrow="IPO Center"
        title={<>Track <span className="gradient-text">Every New Listing</span></>}
        subtitle="Upcoming, open, and recently listed IPOs with price band, GMP, and subscription snapshot." />
      <div className="flex gap-1 glass rounded-xl p-1 w-fit mb-6">
        {(["Upcoming", "Open", "Closed"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition ${tab === t ? "bg-[color:var(--cyan)] text-[color:var(--midnight)]" : "text-muted-foreground hover:text-foreground"}`}>{t}</button>
        ))}
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {IPOS.filter((i) => i.status === tab).map((i) => (
          <div key={i.name} className="glass rounded-2xl p-5 hover-lift">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-11 w-11 rounded-xl grid place-items-center font-bold text-white shrink-0" style={{ background: i.color }}>
                <Rocket className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <div className="font-semibold truncate">{i.name}</div>
                <div className="text-[11px] text-muted-foreground">{i.date}</div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="glass rounded-lg py-2">
                <div className="text-[10px] uppercase text-muted-foreground">Band</div>
                <div className="text-xs font-mono font-semibold">{i.band}</div>
              </div>
              <div className="glass rounded-lg py-2">
                <div className="text-[10px] uppercase text-muted-foreground">GMP</div>
                <div className="text-xs font-mono font-semibold text-[color:var(--gain)]">{i.gmp}</div>
              </div>
              <div className="glass rounded-lg py-2">
                <div className="text-[10px] uppercase text-muted-foreground">Sub.</div>
                <div className="text-xs font-mono font-semibold">{i.sub}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------- Funds ---------- */
function FundsSection() {
  return (
    <section id="funds" className="relative py-20 mx-auto max-w-7xl px-4 sm:px-6">
      <SectionTitle eyebrow="Mutual Funds & ETFs"
        title={<>Popular <span className="gradient-text">Funds Snapshot</span></>}
        subtitle="Trailing returns, risk rating, expense ratio, and AUM at a glance." />
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
            {FUNDS.map((f) => (
              <tr key={f.name} className="border-t border-white/5 hover:bg-white/5 transition">
                <td className="px-5 py-4 font-medium">{f.name}</td>
                <td className="px-5 py-4 text-xs text-muted-foreground">{f.category}</td>
                <td className="px-5 py-4 text-right font-mono text-[color:var(--gain)] font-semibold">+{fmt(f.return1y)}%</td>
                <td className="px-5 py-4 text-right font-mono text-[color:var(--gain)] hidden sm:table-cell">+{fmt(f.return3y)}%</td>
                <td className="px-5 py-4 hidden md:table-cell">
                  <span className={`text-[10px] px-2 py-0.5 rounded-md ${f.risk === "High" ? "bg-[color:var(--loss)]/15 text-[color:var(--loss)]" : f.risk === "Moderate" ? "bg-[color:var(--aqua)]/15 text-[color:var(--aqua)]" : "bg-[color:var(--gain)]/15 text-[color:var(--gain)]"}`}>{f.risk}</span>
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

/* ---------- Education ---------- */
function Education() {
  const items = [
    { icon: GraduationCap, title: "What is the Stock Market?", desc: "A plain-English intro to exchanges, tickers, orders, and price discovery." },
    { icon: Rocket, title: "How to Start Investing", desc: "Open a demat, define goals, pick your first instruments, size positions." },
    { icon: BarChart3, title: "Types of Stocks", desc: "Common vs preferred, large / mid / small-cap, cyclical vs defensive." },
    { icon: Building2, title: "Fundamental Analysis", desc: "Read a P&L, balance sheet, and cash-flow statement like an analyst." },
    { icon: LineChart, title: "Technical Analysis", desc: "Trends, support / resistance, moving averages, and RSI basics." },
    { icon: ShieldCheck, title: "Risk Management", desc: "Position sizing, diversification, stop losses, and emotional discipline." },
    { icon: Brain, title: "Investment Strategies", desc: "Value, growth, dividend, momentum, and index investing compared." },
    { icon: Zap, title: "Options & Derivatives 101", desc: "How futures and options work — payoffs, greeks, and common strategies." },
  ];
  return (
    <section id="learn" className="relative py-20 mx-auto max-w-7xl px-4 sm:px-6">
      <SectionTitle eyebrow="Learn"
        title={<>Investor <span className="gradient-text">Education Hub</span></>}
        subtitle="Zero to informed — concise, jargon-free lessons for every experience level." />
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((i) => (
          <div key={i.title} className="glass rounded-2xl p-5 hover-lift group">
            <div className="h-10 w-10 rounded-xl gradient-brand grid place-items-center mb-4 text-[color:var(--midnight)]">
              <i.icon className="h-5 w-5" strokeWidth={2.4} />
            </div>
            <h3 className="font-semibold mb-1.5">{i.title}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed mb-4">{i.desc}</p>
            <a href={investopedia(i.title)} target="_blank" rel="noreferrer noopener"
               className="text-xs font-semibold text-[color:var(--cyan)] inline-flex items-center gap-1 group-hover:gap-2 transition-all">
              Learn more <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------- Heatmap ---------- */
function Heatmap() {
  const shade = (v: number) => {
    const abs = Math.min(1, Math.abs(v) / 3);
    return v >= 0
      ? `color-mix(in oklab, var(--gain) ${20 + abs * 55}%, transparent)`
      : `color-mix(in oklab, var(--loss) ${20 + abs * 55}%, transparent)`;
  };
  return (
    <section className="relative py-20 mx-auto max-w-7xl px-4 sm:px-6" id="markets">
      <SectionTitle eyebrow="Sector Heatmap"
        title={<>Market Pulse by <span className="gradient-text">Sector</span></>}
        subtitle="One glance shows where capital is rotating today." />
      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
        {SECTORS.map((s) => (
          <div key={s.name} className="rounded-xl p-4 border border-white/10 hover-lift transition"
               style={{ background: shade(s.change) }}>
            <div className="text-xs font-semibold">{s.name}</div>
            <div className={`font-mono text-lg font-bold mt-1 ${s.change >= 0 ? "text-[color:var(--gain)]" : "text-[color:var(--loss)]"}`}>
              {s.change >= 0 ? "+" : ""}{fmt(s.change)}%
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------- Global Markets ---------- */
function GlobalMarkets() {
  const groups = ["US", "IN", "EU", "ASIA", "CRYPTO", "FX", "COMM"] as const;
  const labels: Record<(typeof groups)[number], string> = { US: "US Markets", IN: "Indian Markets", EU: "European Markets", ASIA: "Asian Markets", CRYPTO: "Crypto", FX: "Forex", COMM: "Commodities" };
  return (
    <section className="relative py-20 mx-auto max-w-7xl px-4 sm:px-6">
      <SectionTitle eyebrow="Global Markets"
        title={<>The <span className="gradient-text">World Board</span></>}
        subtitle="Regional indices, crypto, FX, and commodities in one view." />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {groups.map((g) => {
          const rows = GLOBAL_MARKETS.filter((m) => m.region === g);
          if (!rows.length) return null;
          return (
            <div key={g} className="glass-strong rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Globe2 className="h-4 w-4 text-[color:var(--cyan)]" />
                <div className="font-semibold text-sm">{labels[g]}</div>
              </div>
              <div className="space-y-2.5">
                {rows.map((r) => (
                  <div key={r.name} className="flex items-center justify-between text-sm">
                    <div className="text-muted-foreground">{r.name}</div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm">{r.value}</span>
                      <span className={`font-mono text-xs w-16 text-right ${r.changePct >= 0 ? "text-[color:var(--gain)]" : "text-[color:var(--loss)]"}`}>
                        {r.changePct >= 0 ? "+" : ""}{fmt(r.changePct)}%
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

/* ---------- AI Insights ---------- */
function AIInsights() {
  return (
    <section className="relative py-20 mx-auto max-w-7xl px-4 sm:px-6">
      <div className="relative glass-strong rounded-3xl p-8 sm:p-12 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-[color:var(--cyan)]/25 blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-[color:var(--aqua)]/20 blur-[120px] pointer-events-none" />
        <div className="relative grid lg:grid-cols-[1.2fr_1fr] gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 glass rounded-full px-3 py-1.5 text-xs font-semibold mb-5">
              <Sparkles className="h-3.5 w-3.5 text-[color:var(--aqua)]" />
              AI Market Insights • Informational Only
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold leading-tight">
              Today's <span className="gradient-text">market mood</span>, summarized by AI.
            </h2>
            <p className="mt-4 text-muted-foreground">
              An overview of today's session — sector rotation, bullish and bearish undercurrents, notable highlights, and key risks. Generated by AI for context only; not investment advice.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3 max-w-md">
              <Mood label="Overall Mood" value="Cautiously Bullish" tone="up" />
              <Mood label="Volatility (VIX)" value="14.2 • Low" tone="n" />
              <Mood label="Breadth" value="62% Advancers" tone="up" />
              <Mood label="Sentiment Flow" value="Neutral → Positive" tone="n" />
            </div>
          </div>
          <div className="space-y-3">
            {[
              { t: "Sector Leaders", d: "Technology (+2.4%) and Real Estate (+1.9%) lead as bond yields ease." },
              { t: "Sector Laggards", d: "Metals (-1.8%) and Automobile (-1.2%) under pressure on China demand concerns." },
              { t: "Highlights", d: "AI infrastructure names extend gains; NVIDIA up 3% on strong guidance." },
              { t: "Risks to Watch", d: "US CPI print next week and RBI commentary on food-inflation trajectory." },
            ].map((x) => (
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

function Mood({ label, value, tone }: { label: string; value: string; tone: "up" | "down" | "n" }) {
  const c = tone === "up" ? "text-[color:var(--gain)]" : tone === "down" ? "text-[color:var(--loss)]" : "text-[color:var(--aqua)]";
  return (
    <div className="glass rounded-xl p-3">
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className={`font-semibold mt-0.5 text-sm ${c}`}>{value}</div>
    </div>
  );
}

/* ---------- Newsletter ---------- */
function Newsletter() {
  const [email, setEmail] = useState("");
  const [ok, setOk] = useState(false);

  const buildNewsletter = (to: string) => {
    const subject = `Welcome to Stocketize AI — Your Daily Market Brief`;
    const body = [
      `Hi there,`,
      ``,
      `Thanks for subscribing to Stocketize AI — you're in!`,
      ``,
      `Here's a preview of what lands in your inbox every morning:`,
      ``,
      `📈 MARKETS TODAY`,
      `• NIFTY 50: 24,856 (+0.58%)   • SENSEX: 81,532 (-0.27%)`,
      `• NASDAQ: 20,114 (+0.94%)     • S&P 500: 5,824 (+0.55%)`,
      `• Gold: $2,687/oz (+0.54%)    • Crude (WTI): $71.32 (+1.25%)`,
      ``,
      `🔥 TOP MOVERS`,
      `• NVIDIA extends gains on strong Blackwell demand.`,
      `• Indian IT firms raise FY26 guidance on BFSI deal revival.`,
      `• Metals under pressure on China demand concerns.`,
      ``,
      `🧠 AI MARKET MOOD`,
      `Cautiously bullish. Breadth positive (62% advancers), VIX low at 14.2.`,
      `Watch: US CPI print next week + RBI commentary on food inflation.`,
      ``,
      `📚 LEARN TODAY`,
      `"Fundamental vs Technical Analysis — which one should a beginner start with?"`,
      `Read on the site: https://${OWNER.site}/#learn`,
      ``,
      `— ${OWNER.name}`,
      `Founder, Stocketize AI`,
      `${OWNER.email} • ${OWNER.linkedin} • ${OWNER.youtube}`,
      ``,
      `Educational content only. Not investment advice.`,
      `You're subscribed as: ${to}`,
    ].join("\n");
    return { subject, body };
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) return;
    const { subject, body } = buildNewsletter(email);
    // 1) Notify owner of the new subscriber
    const notify =
      `mailto:${OWNER.email}` +
      `?subject=${encodeURIComponent("New Stocketize AI subscriber")}` +
      `&body=${encodeURIComponent(`New subscriber: ${email}\nSite: ${OWNER.site}\nDate: ${new Date().toLocaleString()}`)}`;
    // 2) Compose the welcome newsletter to the subscriber
    const welcome =
      `mailto:${email}` +
      `?cc=${OWNER.email}` +
      `&subject=${encodeURIComponent(subject)}` +
      `&body=${encodeURIComponent(body)}`;
    // Open owner notification in background, welcome in foreground
    try { window.open(notify, "_blank"); } catch {}
    window.location.href = welcome;
    setOk(true);
    setEmail("");
  };

  return (
    <section className="relative py-20 mx-auto max-w-7xl px-4 sm:px-6" id="about">
      <div className="relative overflow-hidden rounded-3xl p-10 sm:p-14 text-center gradient-brand text-[color:var(--midnight)]">
        <div className="absolute inset-0 animate-grid opacity-25 pointer-events-none" />
        <div className="relative max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-[color:var(--midnight)]/15 rounded-full px-3 py-1 text-xs font-semibold mb-4">
            <Mail className="h-3.5 w-3.5" /> Newsletter
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold">Markets in your inbox, every morning.</h2>
          <p className="mt-3 text-[color:var(--midnight)]/80">Daily updates, weekly deep dives, and beginner-friendly education — free, always.</p>
          <form onSubmit={onSubmit} className="mt-6 flex flex-col sm:flex-row gap-2 max-w-lg mx-auto">
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required placeholder="you@email.com"
              className="flex-1 h-12 px-4 rounded-xl bg-[color:var(--midnight)]/10 border border-[color:var(--midnight)]/20 placeholder:text-[color:var(--midnight)]/50 outline-none focus:border-[color:var(--midnight)]/60" />
            <button type="submit" className="h-12 px-6 rounded-xl bg-[color:var(--midnight)] text-white font-semibold hover:opacity-90 transition">Subscribe</button>
          </form>
          {ok && <div className="mt-3 text-sm">✓ You're on the list — check your mail app for your welcome brief.</div>}
        </div>
      </div>
    </section>
  );
}

/* ---------- Footer ---------- */
function Footer() {
  return (
    <footer className="mt-10 border-t border-white/10 bg-[color:var(--midnight)] text-white/90">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-14">
        <div className="grid md:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-9 w-9 rounded-xl gradient-brand grid place-items-center">
                <Activity className="h-4 w-4 text-[color:var(--midnight)]" strokeWidth={3} />
              </div>
              <div className="font-display font-bold">Stocketize<span className="gradient-text"> AI</span></div>
            </div>
            <p className="text-sm text-white/60 leading-relaxed">Real-time market intelligence, company insights, and investor education — in one elegant platform.</p>
          </div>
          <FooterCol title="Quick Links" items={[
            { label: "Home", href: "#home" },
            { label: "Markets", href: "#markets" },
            { label: "Companies", href: "#companies" },
            { label: "News", href: "#news" },
            { label: "About", href: "#about" },
          ]} />
          <FooterCol title="Legal" items={[
            { label: "Privacy Policy", to: "/privacy" },
            { label: "Terms & Conditions", to: "/terms" },
            { label: "Disclaimer", to: "/disclaimer" },
            { label: "Affiliate Disclosure", to: "/affiliate-disclosure" },
          ]} />
          <div>
            <div className="text-sm font-semibold mb-4">About the Website Owner</div>
            <ul className="text-sm text-white/70 space-y-2">
              <li>Name: <span className="text-white">{OWNER.name}</span></li>
              <li className="flex items-center gap-1.5">
                <Globe2 className="h-3.5 w-3.5 shrink-0" />
                <span className="text-white break-all">{OWNER.site}</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 shrink-0" />
                <a href={`mailto:${OWNER.email}`} className="text-white hover:text-[color:var(--cyan)] transition break-all">
                  {OWNER.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 grid md:grid-cols-2 gap-4 text-xs text-white/60">
          <div className="rounded-xl border border-white/10 p-4 leading-relaxed">
            <div className="font-semibold text-white/90 mb-1">Disclaimer</div>
            Stocketize AI is an AI-generated website created solely for educational and informational purposes. Nothing on this site is financial, investment, tax or legal advice. Always do your own research and consult a SEBI-registered / qualified financial advisor before making any investment decisions. Read the full <Link to="/disclaimer" className="underline hover:text-[color:var(--cyan)]">Disclaimer</Link>.
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

type FooterItem = { label: string; href?: string; to?: "/privacy" | "/terms" | "/disclaimer" | "/affiliate-disclosure" };
function FooterCol({ title, items }: { title: string; items: FooterItem[] }) {
  return (
    <div>
      <div className="text-sm font-semibold mb-4">{title}</div>
      <ul className="space-y-2 text-sm text-white/70">
        {items.map((i) => (
          <li key={i.label}>
            {i.to ? (
              <Link to={i.to} className="hover:text-[color:var(--cyan)] transition">{i.label}</Link>
            ) : (
              <a href={i.href} className="hover:text-[color:var(--cyan)] transition">{i.label}</a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}


/* ---------- Testimonials ---------- */
function Testimonials() {
  const items = [
    { q: "The company deep-dives helped me understand what to actually look at before buying a stock. As a first-time investor from Pune, this is exactly what I needed.", n: "Ananya Menon", r: "Retail Investor • Pune" },
    { q: "The daily brief is my morning coffee read. Concise, non-hyped, and it explains WHY the market moved — not just what happened.", n: "Rohan Iyer", r: "Software Engineer • Bengaluru" },
    { q: "I use the ratios section to teach my finance students. Every metric comes with a plain-English explanation, which is rare on Indian sites.", n: "Prof. Meera Kulkarni", r: "MBA Faculty • Mumbai" },
    { q: "Finally an educational platform that clearly says 'this isn't advice'. That honesty is what made me stick around.", n: "Vikram Shah", r: "Chartered Accountant • Ahmedabad" },
    { q: "The IPO tracker and sector heatmap are super useful for weekend research. Clean UI, no clutter, and works well on my phone.", n: "Sneha Reddy", r: "Long-term Investor • Hyderabad" },
  ];
  return (
    <section className="relative py-20 mx-auto max-w-7xl px-4 sm:px-6">
      <SectionTitle eyebrow="Community"
        title={<>What <span className="gradient-text">Investors Say</span></>}
        subtitle="Feedback from readers across India who use Stocketize AI to learn and stay informed." />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map((t) => (
          <figure key={t.n} className="glass rounded-2xl p-6 hover-lift">
            <div className="text-[color:var(--cyan)] text-3xl leading-none mb-2">"</div>
            <blockquote className="text-sm leading-relaxed text-muted-foreground">{t.q}</blockquote>
            <figcaption className="mt-5 flex items-center gap-3">
              <div className="h-9 w-9 rounded-full gradient-brand grid place-items-center text-[color:var(--midnight)] font-bold text-sm">
                {t.n.split(" ").map((x) => x[0]).slice(0, 2).join("")}
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

/* ---------- FAQ ---------- */
function FAQ() {
  const items = [
    { q: "Is Stocketize AI giving me financial advice?", a: "No. All content is AI-generated and strictly for education and information only. Nothing on the site is investment, tax or legal advice. Please consult a SEBI-registered advisor before making any investment." },
    { q: "How current is the market data on Stocketize AI?", a: "The platform currently uses realistic simulated data for demonstration. When connected to a live NSE / BSE feed, indices, prices, gainers/losers, IPO status and news auto-refresh throughout market hours." },
    { q: "Do I need to pay to use the website or the newsletter?", a: "No. Reading market data, company profiles, education content, IPOs, mutual funds, ratios and news is completely free. The daily newsletter is also free." },
    { q: "How often is the newsletter sent and what does it contain?", a: "Subscribers receive a welcome brief immediately, a daily morning market update, and a weekend deep-dive. Content covers NSE/BSE movement, top gainers/losers, IPOs, economic events, and beginner-friendly education." },
    { q: "I'm a complete beginner — where should I start?", a: "Open the Investor Education Hub on the home page and start with 'What is the Stock Market?' followed by 'How to Start Investing'. Every ratio in the Financial Ratios section also has a plain-English explanation." },
  ];
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  return (
    <section className="relative py-20 mx-auto max-w-4xl px-4 sm:px-6" id="faq">
      <SectionTitle eyebrow="FAQ"
        title={<>Frequently <span className="gradient-text">Asked Questions</span></>}
        subtitle="Quick answers about Stocketize AI, data accuracy, newsletters and getting started with Indian stock market investing." />
      <div className="space-y-3">
        {items.map((it, i) => {
          const open = openIdx === i;
          return (
            <div key={it.q} className="glass rounded-2xl overflow-hidden border border-white/10">
              <button onClick={() => setOpenIdx(open ? null : i)}
                className="w-full flex items-center justify-between gap-4 text-left px-5 py-4 hover:bg-white/5 transition">
                <span className="text-sm sm:text-base font-semibold">{it.q}</span>
                <ChevronRight className={`h-4 w-4 shrink-0 text-[color:var(--cyan)] transition-transform ${open ? "rotate-90" : ""}`} />
              </button>
              {open && (
                <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">{it.a}</div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ---------- Page ---------- */
function Home() {
  const { light, toggle } = useTheme();
  return (
    <div className="min-h-screen">
      <Header light={light} toggle={toggle} />
      <main>
        <Hero />
        <LiveDashboard />
        <Trending />
        <CompanyProfile />
        <InteractiveChart />
        <Ratios />
        <GainersLosers />
        <NewsGrid />
        <EconCalendar />
        <IPOSection />
        <FundsSection />
        <Education />
        <Heatmap />
        <GlobalMarkets />
        <AIInsights />
        <Testimonials />
        <FAQ />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
}

