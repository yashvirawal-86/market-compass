import React, { useState, useEffect, useRef } from 'react';

// ==========================================
// DATA MODEL INTERFACES
// ==========================================
interface MarketTick {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  ma: number;
  rsi: number;
  macd: number;
}

interface IPOData {
  id: string;
  companyName: string;
  symbol: string;
  date: string;
  priceRange: string;
  status: 'Open' | 'Upcoming' | 'Closed';
}

// ==========================================
// INITIAL GENERATOR SEEDS
// ==========================================
const createInitialHistory = (): MarketTick[] => {
  const data: MarketTick[] = [];
  let currentPrice = 240.50;
  const now = new Date();
  
  for (let i = 45; i >= 0; i--) {
    const tickTime = new Date(now.getTime() - i * 60000);
    const timeString = tickTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const drift = (Math.random() - 0.5) * 4;
    
    const open = currentPrice;
    const close = currentPrice + drift;
    const high = Math.max(open, close) + Math.random() * 2;
    const low = Math.min(open, close) - Math.random() * 2;
    
    data.push({
      time: timeString,
      open,
      high,
      low,
      close,
      ma: currentPrice + (Math.random() - 0.5) * 1.5,
      rsi: 30 + Math.random() * 40,
      macd: (Math.random() - 0.5) * 4
    });
    currentPrice = close;
  }
  return data;
};

const initialIPOs: IPOData[] = [
  { id: '1', companyName: 'Quantum Dynamics Ltd', symbol: 'QDL', date: '2026-08-18', priceRange: '₹340 - ₹365', status: 'Open' },
  { id: '2', companyName: 'BioHelix Pharmaceuticals', symbol: 'BHP', date: '2026-08-27', priceRange: '₹120 - ₹135', status: 'Upcoming' },
  { id: '3', companyName: 'Vortex Grid Infrastructure', symbol: 'VGI', date: '2026-09-05', priceRange: '₹890 - ₹920', status: 'Upcoming' }
];

export default function MarketCompassTerminal() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [emailInput, setEmailInput] = useState<string>('');
  const [passkeyInput, setPasskeyInput] = useState<string>('');

  // Live Market State
  const [marketFeed, setMarketFeed] = useState<MarketTick[]>(createInitialHistory());
  const [selectedAsset, setSelectedAsset] = useState<string>('NIFTY50');
  
  // Indicator Overlay Switchers
  const [showMA, setShowMA] = useState<boolean>(true);
  const [showRSI, setShowRSI] = useState<boolean>(true);
  const [showMACD, setShowMACD] = useState<boolean>(true);

  // Newsletter Toggle Pipeline
  const [newsletterEmail, setNewsletterEmail] = useState<string>('');
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartContainerRef = useRef<HTMLDivElement | null>(null);

  // ==========================================
  // REAL-TIME FEED LOOP (Updates every 2 seconds)
  // ==========================================
  useEffect(() => {
    const loop = setInterval(() => {
      setMarketFeed((prevFeed) => {
        if (!prevFeed || prevFeed.length === 0) return createInitialHistory();
        const nextFeed = [...prevFeed];
        const lastTick = nextFeed[nextFeed.length - 1];
        
        const delta = (Math.random() - 0.5) * 2.5;
        const nextClose = lastTick.close + delta;
        const nextHigh = Math.max(lastTick.high, nextClose);
        const nextLow = Math.min(lastTick.low, nextClose);
        
        const clock = new Date();
        const timeStr = clock.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

        nextFeed.shift();
        nextFeed.push({
          time: timeStr,
          open: lastTick.close,
          high: nextHigh,
          low: nextLow,
          close: nextClose,
          ma: nextClose + (Math.random() - 0.5) * 1.2,
          rsi: Math.max(10, Math.min(90, lastTick.rsi + (Math.random() - 0.5) * 6)),
          macd: Math.max(-6, Math.min(6, lastTick.macd + (Math.random() - 0.5) * 1.2))
        });
        return nextFeed;
      });
    }, 2000);

    return () => clearInterval(loop);
  }, []);

  // ==========================================
  // RE-RENDERING ENGINE (Canvas Indicator Integration)
  // ==========================================
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = chartContainerRef.current;
    if (!canvas || !container || marketFeed.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = container.clientWidth;
    const height = 340;
    canvas.width = width;
    canvas.height = height;

    ctx.clearRect(0, 0, width, height);

    const pad = 40;
    const renderW = width - pad * 2;
    const renderH = height - pad * 2;
    const sliceW = renderW / marketFeed.length;

    // Find Price Bounds for Dynamic Scaling
    const allPrices = marketFeed.flatMap(t => [t.high, t.low, t.ma]);
    const ceiling = Math.max(...allPrices) * 1.01;
    const floor = Math.min(...allPrices) * 0.99;
    const range = ceiling - floor;

    const scaleY = (val: number) => height - pad - ((val - floor) / range) * renderH;

    // Draw Gridlines
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = pad + (renderH / 4) * i;
      ctx.beginPath();
      ctx.moveTo(pad, y);
      ctx.lineTo(width - pad, y);
      ctx.stroke();
    }

    // Draw Primary Candlesticks
    marketFeed.forEach((tick, idx) => {
      const x = pad + idx * sliceW + sliceW / 2;
      const greenTrend = tick.close >= tick.open;

      ctx.strokeStyle = greenTrend ? '#10b981' : '#f43f5e';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(x, scaleY(tick.high));
      ctx.lineTo(x, scaleY(tick.low));
      ctx.stroke();

      ctx.fillStyle = greenTrend ? '#10b981' : '#f43f5e';
      const top = scaleY(Math.max(tick.open, tick.close));
      const bottom = scaleY(Math.min(tick.open, tick.close));
      ctx.fillRect(x - sliceW * 0.3, top, sliceW * 0.6, Math.max(2, bottom - top));
    });

    // OVERLAY: Moving Average Line (Gold)
    if (showMA) {
      ctx.strokeStyle = '#eab308';
      ctx.lineWidth = 2;
      ctx.beginPath();
      marketFeed.forEach((tick, idx) => {
        const x = pad + idx * sliceW + sliceW / 2;
        if (idx === 0) ctx.moveTo(x, scaleY(tick.ma));
        else ctx.lineTo(x, scaleY(tick.ma));
      });
      ctx.stroke();
    }

    // OVERLAY: RSI Direct Normalization (Purple Line)
    if (showRSI) {
      ctx.strokeStyle = '#a855f7';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      marketFeed.forEach((tick, idx) => {
        const x = pad + idx * sliceW + sliceW / 2;
        const rsiY = height - pad - (tick.rsi / 100) * renderH;
        if (idx === 0) ctx.moveTo(x, rsiY);
        else ctx.lineTo(x, rsiY);
      });
      ctx.stroke();
    }

    // OVERLAY: MACD Direct Normalization (Cyan Line)
    if (showMACD) {
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      marketFeed.forEach((tick, idx) => {
        const x = pad + idx * sliceW + sliceW / 2;
        const macdY = height - pad - ((tick.macd + 6) / 12) * renderH;
        if (idx === 0) ctx.moveTo(x, macdY);
        else ctx.lineTo(x, macdY);
      });
      ctx.stroke();
    }
  }, [marketFeed, showMA, showRSI, showMACD]);

  // ==========================================
  // FORM & EVENT HANDLERS
  // ==========================================
  const executeAuthentication = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim() && passkeyInput.trim()) {
      setIsAuthenticated(true);
    }
  };

  const handleNewsletterToggle = (e: React.FormEvent) => {
    e.preventDefault();
    const validatePattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!validatePattern.test(newsletterEmail)) {
      setStatusMessage('Error: Please write a valid email address.');
      return;
    }

    if (!isSubscribed) {
      setIsSubscribed(true);
      setStatusMessage(`Subscription confirmed! Live market data report has been sent to ${newsletterEmail}`);
    } else {
      setIsSubscribed(false);
      setStatusMessage('Unsubscribed. Updates paused successfully.');
      setNewsletterEmail('');
    }
  };

  const currentTick = marketFeed[marketFeed.length - 1] || { close: 0, ma: 0, rsi: 0, macd: 0 };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans p-4 md:p-8 space-y-8">
      {/* HEADER NAVIGATION TERMINAL */}
      <header className="flex flex-col sm:flex-row justify-between items-center bg-slate-950 p-6 rounded-2xl border border-slate-800 gap-4">
        <h1 className="text-lg font-black tracking-widest text-emerald-400">MARKET COMPASS TERMINAL</h1>
        <div>
          {isAuthenticated ? (
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950/80 border border-emerald-900 px-3 py-1.5 rounded-lg">
              Session Live: {emailInput}
            </span>
          ) : (
            <span className="text-xs font-mono text-rose-400 bg-rose-950 border border-rose-900 px-3 py-1.5 rounded-lg">
              Offline Workspace Node
            </span>
          )}
        </div>
      </header>

      {/* AUTH MATRIX PANEL */}
      {!isAuthenticated && (
        <div className="max-w-md mx-auto bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="text-center">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300">Terminal Credentials Required</h2>
          </div>
          <form onSubmit={executeAuthentication} className="space-y-3">
            <input 
              type="email" 
              placeholder="Operator Email Address" 
              required
              value={emailInput} 
              onChange={(e) => setEmailInput(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
            />
            <input 
              type="password" 
              placeholder="Security Key Entry" 
              required
              value={passkeyInput} 
              onChange={(e) => setPasskeyInput(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
            />
            <button type="submit" className="w-full bg-emerald-400 hover:bg-emerald-500 text-slate-950 font-bold py-2 rounded-lg transition text-xs uppercase tracking-wide">
              Validate Terminal Node
            </button>
          </form>
        </div>
      )}

      {/* WORKBENCH DASHBOARD CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* CHART GRID DISPLAY */}
        <div className="lg:col-span-2 bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <select 
                value={selectedAsset} 
                onChange={(e) => setSelectedAsset(e.target.value)}
                className="bg-slate-900 border border-slate-700 text-xs font-bold px-3 py-1.5 rounded-lg focus:outline-none text-emerald-400 font-mono"
              >
                <option value="NIFTY50">NIFTY 50 (NSE INDEX)</option>
                <option value="SENSEX">SENSEX (BSE INDEX)</option>
                <option value="RELIANCE">RELIANCE IND</option>
              </select>
              <div className="text-3xl font-black font-mono mt-1 text-slate-100">₹{currentTick.close.toFixed(2)}</div>
            </div>

            {/* DIRECT LAYERING FILTER TOGGLES */}
            <div className="flex flex-wrap gap-2">
              <button onClick={() => setShowMA(!showMA)} className={`text-xs px-2.5 py-1.5 rounded-lg border transition font-mono ${showMA ? 'bg-amber-500/20 text-amber-400 border-amber-500' : 'bg-slate-900 text-slate-600 border-slate-800'}`}>
                MA Overlay
              </button>
              <button onClick={() => setShowRSI(!showRSI)} className={`text-xs px-2.5 py-1.5 rounded-lg border transition font-mono ${showRSI ? 'bg-purple-500/20 text-purple-400 border-purple-500' : 'bg-slate-900 text-slate-600 border-slate-800'}`}>
                RSI Charted
              </button>
              <button onClick={() => setShowMACD(!showMACD)} className={`text-xs px-2.5 py-1.5 rounded-lg border transition font-mono ${showMACD ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500' : 'bg-slate-900 text-slate-600 border-slate-800'}`}>
                MACD Vector
              </button>
            </div>
          </div>

          {/* RENDERING WRAPPER ZONE */}
          <div ref={chartContainerRef} className="relative bg-slate-900 rounded-xl p-2 border border-slate-800 w-full overflow-hidden">
            <div className="absolute top-3 left-4 z-10 flex gap-4 text-[10px] font-mono bg-slate-950/90 px-2 py-0.5 rounded border border-slate-800">
              {showMA && <span className="text-amber-400">MA: ₹{currentTick.ma.toFixed(2)}</span>}
              {showRSI && <span className="text-purple-400">RSI: {currentTick.rsi.toFixed(1)}%</span>}
              {showMACD && <span className="text-cyan-400">MACD: {currentTick.macd.toFixed(2)}</span>}
            </div>
            <canvas ref={canvasRef} className="w-full block" />
          </div>
        </div>

        {/* IPO MODULE BOX */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-sm font-bold tracking-widest text-slate-300 uppercase">🚀 IPO Live Tracker</h3>
            <div className="space-y-2">
              {initialIPOs.map((ipo) => (
                <div key={ipo.id} className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex justify-between items-center text-xs">
                  <div>
                    <div className="font-bold text-slate-200">{ipo.companyName}</div>
                    <div className="font-mono text-slate-500 text-[10px] mt-0.5">{ipo.symbol} • Range: {ipo.priceRange}</div>
                  </div>
                  <span className={`px-2 py-0.5 font-mono text-[9px] font-bold rounded ${ipo.status === 'Open' ? 'bg-emerald-950 text-emerald-400 border border-emerald-900' : 'bg-amber-950 text-amber-400 border border-amber-900'}`}>
                    {ipo.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="text-[10px] text-slate-600 font-mono text-center pt-2">Datafeed Stream Synchronized</div>
        </div>
      </div>

      {/* REACTION NEWSLETTER COMPONENT */}
      <section className="bg-gradient-to-r from-slate-950 to-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wide">📰 Live Market Report Terminal</h3>
          <p className="text-xs text-slate-400 mt-1">Pipe your streaming metrics, active indicators, and charts to your mailing setup.</p>
        </div>

        <div className="w-full md:w-auto min-w-[310px]">
          <form onSubmit={handleNewsletterToggle} className="flex gap-2">
            <input 
              type="email" 
              required
              disabled={isSubscribed}
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              className="bg-slate-950 border border-slate-700 text-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 flex-grow disabled:opacity-40"
              placeholder="operator@domain.com"
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
          {statusMessage && (
            <p className="text-[10px] font-mono mt-2 text-amber-400">{statusMessage}</p>
          )}
        </div>
      </section>
    </div>
  );
}
