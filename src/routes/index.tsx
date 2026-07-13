import React, { useState, useEffect, useRef } from 'react';

// ==========================================
// TYPES & INTERFACES
// ==========================================
interface StockData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  ma: number;
  rsi: number;
  macd: number;
}

interface IPOItem {
  id: string;
  companyName: string;
  ticker: string;
  expectedDate: string;
  priceRange: string;
  status: 'Upcoming' | 'Open' | 'Closed';
}

// ==========================================
// DATA GENERATORS
// ==========================================
const generateInitialData = (): StockData[] => {
  const data: StockData[] = [];
  let basePrice = 150;
  const now = new Date();
  for (let i = 40; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 60000);
    const timeStr = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const change = (Math.random() - 0.5) * 4;
    const open = basePrice;
    const close = basePrice + change;
    const high = Math.max(open, close) + Math.random() * 2;
    const low = Math.min(open, close) - Math.random() * 2;
    
    data.push({
      time: timeStr,
      open,
      high,
      low,
      close,
      ma: basePrice + (Math.random() - 0.5) * 2,
      rsi: 30 + Math.random() * 40,
      macd: (Math.random() - 0.5) * 6
    });
    basePrice = close;
  }
  return data;
};

const initialIPOs: IPOItem[] = [
  { id: '1', companyName: 'TechNova Global', ticker: 'TNVA', expectedDate: '2026-07-20', priceRange: '$45 - $50', status: 'Open' },
  { id: '2', companyName: 'GreenEnergy Pulse', ticker: 'GEPL', expectedDate: '2026-07-28', priceRange: '$18 - $22', status: 'Upcoming' },
  { id: '3', companyName: 'Apex Quantum Analytics', ticker: 'AQAN', expectedDate: '2026-08-05', priceRange: '$105 - $110', status: 'Upcoming' },
];

export default function MarketCompass() {
  // ==========================================
  // STATE MANAGEMENT
  // ==========================================
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [authEmail, setAuthEmail] = useState<string>('');
  const [authPassword, setAuthPassword] = useState<string>('');
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  const [marketData, setMarketData] = useState<StockData[]>(generateInitialData());
  const [selectedTicker, setSelectedTicker] = useState<string>('AAPL');
  
  const [showRSI, setShowRSI] = useState<boolean>(true);
  const [showMACD, setShowMACD] = useState<boolean>(true);
  const [showMA, setShowMA] = useState<boolean>(true);

  const [newsletterEmail, setNewsletterEmail] = useState<string>('');
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const [newsletterStatus, setNewsletterStatus] = useState<string>('');

  const [ipos] = useState<IPOItem[]>(initialIPOs);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // ==========================================
  // LIVE FEED SIMULATION (Updates every 2 seconds)
  // ==========================================
  useEffect(() => {
    const interval = setInterval(() => {
      setMarketData((prevData) => {
        if (!prevData || prevData.length === 0) return generateInitialData();
        const nextData = [...prevData];
        const lastBar = nextData[nextData.length - 1];
        
        const change = (Math.random() - 0.5) * 2;
        const newClose = lastBar.close + change;
        const newHigh = Math.max(lastBar.high, newClose);
        const newLow = Math.min(lastBar.low, newClose);
        
        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

        nextData.shift();
        nextData.push({
          time: timeStr,
          open: lastBar.close,
          high: newHigh,
          low: newLow,
          close: newClose,
          ma: newClose + (Math.random() - 0.5) * 1.5,
          rsi: Math.max(10, Math.min(90, lastBar.rsi + (Math.random() - 0.5) * 10)),
          macd: Math.max(-10, Math.min(10, lastBar.macd + (Math.random() - 0.5) * 2))
        });
        return nextData;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // ==========================================
  // CANVAS RENDERING ENGINE (Overlays charts safely)
  // ==========================================
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || marketData.length === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear Canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const padding = 40;
    const chartWidth = canvas.width - padding * 2;
    const chartHeight = canvas.height - padding * 2;
    const barCount = marketData.length;
    const barWidth = chartWidth / barCount;

    // Find Price Bounds
    const prices = marketData.flatMap(d => [d.high, d.low, d.ma]);
    const maxPrice = Math.max(...prices) * 1.02;
    const minPrice = Math.min(...prices) * 0.98;
    const priceRange = maxPrice - minPrice;

    // Helper to map Price to Y Coordinate
    const getY = (val: number) => canvas.height - padding - ((val - minPrice) / priceRange) * chartHeight;

    // Draw Grid Lines
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = padding + (chartHeight / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(canvas.width - padding, y);
      ctx.stroke();
    }

    // Loop data to draw candlesticks and indicator lines
    marketData.forEach((d, i) => {
      const x = padding + i * barWidth + barWidth / 2;
      const isUp = d.close >= d.open;

      // Draw Candlestick Wick
      ctx.strokeStyle = isUp ? '#10b981' : '#f43f5e';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(x, getY(d.high));
      ctx.lineTo(x, getY(d.low));
      ctx.stroke();

      // Draw Candlestick Body
      ctx.fillStyle = isUp ? '#10b981' : '#f43f5e';
      const bodyTop = getY(Math.max(d.open, d.close));
      const bodyBottom = getY(Math.min(d.open, d.close));
      ctx.fillRect(x - barWidth * 0.3, bodyTop, barWidth * 0.6, Math.max(2, bodyBottom - bodyTop));
    });

    // OVERLAY: Moving Average (Gold Line)
    if (showMA) {
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2;
      ctx.beginPath();
      marketData.forEach((d, i) => {
        const x = padding + i * barWidth + barWidth / 2;
        if (i === 0) ctx.moveTo(x, getY(d.ma));
        else ctx.lineTo(x, getY(d.ma));
      });
      ctx.stroke();
    }

    // OVERLAY: RSI Normalization Layer (Purple Line)
    if (showRSI) {
      ctx.strokeStyle = '#a855f7';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      marketData.forEach((d, i) => {
        const x = padding + i * barWidth + barWidth / 2;
        // Map 0-100 RSI values directly into the visual heights of the canvas
        const rsiY = canvas.height - padding - (d.rsi / 100) * chartHeight;
        if (i === 0) ctx.moveTo(x, rsiY);
        else ctx.lineTo(x, rsiY);
      });
      ctx.stroke();
    }

    // OVERLAY: MACD Normalization Layer (Cyan Line)
    if (showMACD) {
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      marketData.forEach((d, i) => {
        const x = padding + i * barWidth + barWidth / 2;
        // Normalize MACD scale (-10 to +10) into visual center
        const macdY = canvas.height - padding - ((d.macd + 10) / 20) * chartHeight;
        if (i === 0) ctx.moveTo(x, macdY);
        else ctx.lineTo(x, macdY);
      });
      ctx.stroke();
    }

  }, [marketData, showMA, showRSI, showMACD]);

  // ==========================================
  // EVENT HANDLERS
  // ==========================================
  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (authEmail && authPassword) {
      setIsLoggedIn(true);
    }
  };

  const handleNewsletterToggle = (e: React.FormEvent) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(newsletterEmail)) {
      setNewsletterStatus('Please write a valid email address.');
      return;
    }

    if (!isSubscribed) {
      setIsSubscribed(true);
      setNewsletterStatus(`Success! A live newsletter update has been sent to ${newsletterEmail}`);
    } else {
      setIsSubscribed(false);
      setNewsletterStatus('Unsubscribed from the market update mailing stream.');
      setNewsletterEmail('');
    }
  };

  const latest = marketData[marketData.length - 1] || { close: 0, ma: 0, rsi: 0, macd: 0 };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans p-4 md:p-8 space-y-8">
      {/* HEADER NAVBAR */}
      <header className="flex flex-col sm:flex-row justify-between items-center bg-slate-950 p-6 rounded-2xl border border-slate-800 gap-4">
        <h1 className="text-xl font-black tracking-wider text-emerald-400">MARKET COMPASS TERMINAL</h1>
        <div className="flex items-center space-x-4">
          {isLoggedIn ? (
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950 border border-emerald-900 px-3 py-1 rounded-full">
              Connected: {authEmail}
            </span>
          ) : (
            <span className="text-xs font-mono text-rose-400 bg-rose-950 border border-rose-900 px-3 py-1 rounded-full">
              Offline Terminal Mode
            </span>
          )}
        </div>
      </header>

      {/* AUTH WINDOW */}
      {!isLoggedIn && (
        <div className="max-w-md mx-auto bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <h2 className="text-lg font-bold text-center mb-4 uppercase tracking-wide">Secure Node Authentication</h2>
          <form onSubmit={handleAuthSubmit} className="space-y-4">
            <input 
              type="email" 
              placeholder="System Email" 
              required
              value={authEmail} 
              onChange={(e) => setAuthEmail(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
            />
            <input 
              type="password" 
              placeholder="Passkey Token" 
              required
              value={authPassword} 
              onChange={(e) => setAuthPassword(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
            />
            <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold py-2 rounded-lg transition text-sm uppercase">
              Establish Session
            </button>
          </form>
        </div>
      )}

      {/* MAIN CONTAINER PANELS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* CHART WORKBENCH */}
        <div className="lg:col-span-2 bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <select 
                value={selectedTicker} 
                onChange={(e) => setSelectedTicker(e.target.value)}
                className="bg-slate-900 border border-slate-700 text-lg font-bold px-3 py-1 rounded-lg focus:outline-none text-emerald-400 font-mono"
              >
                <option value="AAPL">AAPL (Apple Inc.)</option>
                <option value="TSLA">TSLA (Tesla Inc.)</option>
                <option value="NVDA">NVDA (NVIDIA Corp.)</option>
              </select>
              <div className="text-3xl font-black font-mono mt-1">${latest.close.toFixed(2)}</div>
            </div>

            {/* DIRECT CANVAS OVERLAY CONTROLS */}
            <div className="flex flex-wrap gap-2">
              <button onClick={() => setShowMA(!showMA)} className={`text-xs px-3 py-1.5 rounded-lg border transition font-mono ${showMA ? 'bg-amber-500/20 text-amber-400 border-amber-500' : 'bg-slate-900 text-slate-600 border-slate-800'}`}>
                MA (Gold)
              </button>
              <button onClick={() => setShowRSI(!showRSI)} className={`text-xs px-3 py-1.5 rounded-lg border transition font-mono ${showRSI ? 'bg-purple-500/20 text-purple-400 border-purple-500' : 'bg-slate-900 text-slate-600 border-slate-800'}`}>
                RSI (Purple)
              </button>
              <button onClick={() => setShowMACD(!showMACD)} className={`text-xs px-3 py-1.5 rounded-lg border transition font-mono ${showMACD ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500' : 'bg-slate-900 text-slate-600 border-slate-800'}`}>
                MACD (Cyan)
              </button>
            </div>
          </div>

          {/* TIME-FRAME CANVAS TARGET */}
          <div className="relative bg-slate-900 rounded-xl p-2 border border-slate-800 overflow-hidden">
            <div className="absolute top-2 left-4 z-10 flex gap-4 text-[10px] font-mono">
              {showMA && <span className="text-amber-400">MA: ${latest.ma.toFixed(2)}</span>}
              {showRSI && <span className="text-purple-400">RSI: {latest.rsi.toFixed(1)}%</span>}
              {showMACD && <span className="text-cyan-400">MACD: {latest.macd.toFixed(2)}</span>}
            </div>
            <canvas 
              ref={canvasRef} 
              width={700} 
              height={320} 
              className="w-full h-auto block"
            />
          </div>
        </div>

        {/* IPO DATA MODULE */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold mb-4 tracking-wider text-slate-300">🚀 LIVE IPO TRACKER</h3>
            <div className="space-y-3">
              {ipos.map((ipo) => (
                <div key={ipo.id} className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex justify-between items-center text-xs">
                  <div>
                    <div className="font-bold text-slate-200">{ipo.companyName}</div>
                    <div className="font-mono text-slate-500 mt-0.5">{ipo.ticker} • {ipo.priceRange}</div>
                  </div>
                  <span className={`px-2 py-0.5 font-mono text-[10px] font-bold rounded-full ${ipo.status === 'Open' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-amber-950 text-amber-400 border border-amber-800'}`}>
                    {ipo.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="text-[10px] text-slate-600 font-mono text-center mt-4">Automated SEC Engine Sync Active</div>
        </div>
      </div>

      {/* INTERACTIVE NEWSLETTER FORM */}
      <section className="bg-gradient-to-r from-slate-950 to-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h3 className="text-md font-bold mb-1">📰 Automated Live Feed Subscriber</h3>
          <p className="text-xs text-slate-400">Get technical updates and tracking indicators synchronized straight to your email terminal.</p>
        </div>

        <div className="w-full md:w-auto min-w-[300px]">
          <form onSubmit={handleNewsletterToggle} className="flex gap-2">
            <input 
              type="email" 
              required
              disabled={isSubscribed}
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              className="bg-slate-950 border border-slate-700 text-slate-100 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 flex-grow disabled:opacity-50"
              placeholder="terminal@domain.com"
            />
            <button 
              type="submit" 
              className={`text-xs font-bold px-4 py-2 rounded-lg transition font-mono uppercase tracking-wider ${
                isSubscribed ? 'bg-rose-600 hover:bg-rose-700 text-white' : 'bg-emerald-400 hover:bg-emerald-500 text-slate-950'
              }`}
            >
              {isSubscribed ? 'Unsubscribe' : 'Subscribe'}
            </button>
          </form>
          {newsletterStatus && (
            <p className="text-[10px] font-mono mt-2 text-amber-400">{newsletterStatus}</p>
          )}
        </div>
      </section>
    </div>
  );
}
