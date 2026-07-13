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
  rsi?: number;
  macd?: number;
  ma?: number;
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
// MOCK DATA GENERATORS (For Live Streaming)
// ==========================================
const generateInitialData = (): StockData[] => {
  const data: StockData[] = [];
  let basePrice = 150;
  const now = new Date();
  for (let i = 60; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 60000);
    const timeStr = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const change = (Math.random() - 0.5) * 2;
    const open = basePrice;
    const close = basePrice + change;
    const high = Math.max(open, close) + Math.random();
    const low = Math.min(open, close) - Math.random();
    
    // Simple mock calculation for indicators overlayed
    const ma = basePrice * 0.99 + (Math.random() * 2);
    const rsi = 50 + (Math.random() * 20 - 10); // Simulated to scale alongside or via secondary normalization
    const macd = (Math.random() - 0.5) * 5;

    data.push({ time: timeStr, open, high, low, close, ma, rsi, macd });
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
  // Authentication State
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [authEmail, setAuthEmail] = useState<string>('');
  const [authPassword, setAuthPassword] = useState<string>('');
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  // Market Data State
  const [marketData, setMarketData] = useState<StockData[]>(generateInitialData());
  const [selectedTicker, setSelectedTicker] = useState<string>('AAPL');
  
  // Indicator Visibility Toggles
  const [showRSI, setShowRSI] = useState<boolean>(true);
  const [showMACD, setShowMACD] = useState<boolean>(true);
  const [showMA, setShowMA] = useState<boolean>(true);

  // Newsletter State
  const [newsletterEmail, setNewsletterEmail] = useState<string>('');
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const [newsletterStatus, setNewsletterStatus] = useState<string>('');

  // IPO Tracker State
  const [ipos, setIpos] = useState<IPOItem[]>(initialIPOs);

  // ==========================================
  // LIVE MARKET DATA SIMULATION (WebSocket/Polling effect)
  // ==========================================
  useEffect(() => {
    const interval = setInterval(() => {
      setMarketData((prevData) => {
        const nextData = [...prevData];
        const lastBar = nextData[nextData.length - 1];
        
        // Simulating live tick movement
        const change = (Math.random() - 0.5) * 1.5;
        const newClose = lastBar.close + change;
        const newHigh = Math.max(lastBar.high, newClose);
        const newLow = Math.min(lastBar.low, newClose);
        
        // Update the current last block or push a new timeline block
        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        if (timeStr === lastBar.time) {
          nextData[nextData.length - 1] = {
            ...lastBar,
            close: newClose,
            high: newHigh,
            low: newLow,
            ma: newClose * 0.995 + Math.random(),
            rsi: 50 + (Math.random() * 15),
            macd: (Math.random() - 0.5) * 3
          };
        } else {
          nextData.shift(); // keep canvas window constant
          nextData.push({
            time: timeStr,
            open: lastBar.close,
            high: newHigh,
            low: newLow,
            close: newClose,
            ma: newClose * 0.995 + Math.random(),
            rsi: 50 + (Math.random() * 15),
            macd: (Math.random() - 0.5) * 3
          });
        }
        return nextData;
      });
    }, 2000); // Live update tick every 2 seconds

    return () => clearInterval(interval);
  }, []);

  // ==========================================
  // HANDLERS
  // ==========================================
  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (authEmail && authPassword) {
      setIsLoggedIn(true);
      setNewsletterStatus(`Welcome back, ${authEmail}!`);
    }
  };

  const handleNewsletterToggle = (e: React.FormEvent) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(newsletterEmail)) {
      setNewsletterStatus('Please enter a valid email address.');
      return;
    }

    if (!isSubscribed) {
      // Logic for Subscription
      setIsSubscribed(true);
      setNewsletterStatus('Successfully subscribed! Live market newsletter dispatched to your email.');
      
      // Direct Worker/API trigger mock
      console.log(`Dispatched Market Newsletter System to: ${newsletterEmail}`);
    } else {
      // Logic for Unsubscription
      setIsSubscribed(false);
      setNewsletterStatus('You have successfully unsubscribed from our newsletter panels.');
      setNewsletterEmail('');
    }
  };

  // Safe visual ranges for the overlay indicators
  const latestPrice = marketData[marketData.length - 1]?.close.toFixed(2);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans tracking-tight">
      {/* HEADER NAVBAR */}
      <header className="border-b border-slate-800 bg-slate-950 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center space-x-2">
          <span className="text-xl font-black bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            MARKET COMPASS
          </span>
        </div>
        
        <nav className="hidden md:flex space-x-6 text-sm font-medium text-slate-400">
          <a href="#dashboard" className="hover:text-emerald-400 transition">Live Dashboard</a>
          <a href="#indicators" className="hover:text-emerald-400 transition">Technical Analysis</a>
          <a href="#ipo" className="hover:text-emerald-400 transition">IPO Tracker</a>
          <a href="#newsletter" className="hover:text-emerald-400 transition">Newsletter</a>
        </nav>

        <div>
          {isLoggedIn ? (
            <div className="flex items-center space-x-4">
              <span className="text-xs text-emerald-400 bg-emerald-950 border border-emerald-800 px-3 py-1 rounded-full font-mono">
                ● Live Connected: {authEmail}
              </span>
              <button 
                onClick={() => setIsLoggedIn(false)} 
                className="text-xs bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg transition"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <a href="#auth-section" className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs px-4 py-2 rounded-lg transition">
              Access Terminal
            </a>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 md:p-8 space-y-12">
        
        {/* AUTOMATED AUTHENTICATION INTERFACE BANNER */}
        {!isLoggedIn && (
          <section id="auth-section" className="bg-gradient-to-br from-slate-950 to-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-2xl max-w-md mx-auto">
            <h2 className="text-xl font-bold text-center mb-2">
              {authMode === 'login' ? 'Sign In to Market Compass' : 'Create Live Stream Account'}
            </h2>
            <p className="text-xs text-slate-400 text-center mb-6">Unlock persistent live market indicators and automated email alert channels.</p>
            <form onSubmit={handleAuthSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Email Terminal Address</label>
                <input 
                  type="email" 
                  required
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500" 
                  placeholder="name@domain.com"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Password</label>
                <input 
                  type="password" 
                  required
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500" 
                  placeholder="••••••••"
                />
              </div>
              <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold py-2 rounded-lg transition text-sm">
                {authMode === 'login' ? 'Initialize Terminal Session' : 'Register Analytics Profile'}
              </button>
            </form>
            <div className="mt-4 text-center">
              <button 
                onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
                className="text-xs text-slate-400 hover:text-emerald-400 transition underline"
              >
                {authMode === 'login' ? "Don't have an account? Sign up" : 'Already verified? Log in'}
              </button>
            </div>
          </section>
        )}

        {/* LIVE TERMINAL MARKET DATA & TIMEFRAME CHARTS */}
        <section id="dashboard" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <div className="flex items-center space-x-3">
                  <select 
                    value={selectedTicker} 
                    onChange={(e) => setSelectedTicker(e.target.value)}
                    className="bg-slate-900 border border-slate-700 text-lg font-bold px-3 py-1 rounded-lg focus:outline-none"
                  >
                    <option value="AAPL">AAPL (Apple Inc.)</option>
                    <option value="TSLA">TSLA (Tesla Motors)</option>
                    <option value="NVDA">NVDA (NVIDIA Corp)</option>
                    <option value="BTCUSDT">BTC/USDT (Bitcoin)</option>
                  </select>
                  <span className="animate-pulse flex h-2 w-2 rounded-full bg-emerald-400" />
                  <span className="text-xs font-mono text-emerald-400 tracking-wider uppercase">Live Data Stream</span>
                </div>
                <div className="text-3xl font-black mt-2 font-mono">${latestPrice}</div>
              </div>

              {/* TECHNICAL INDICATOR OVERLAY CONTROLS */}
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => setShowMA(!showMA)}
                  className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition ${showMA ? 'bg-amber-500/20 text-amber-300 border-amber-500' : 'bg-slate-900 text-slate-500 border-slate-800'}`}
                >
                  MA Overlay
                </button>
                <button 
                  onClick={() => setShowRSI(!showRSI)}
                  className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition ${showRSI ? 'bg-purple-500/20 text-purple-300 border-purple-500' : 'bg-slate-900 text-slate-500 border-slate-800'}`}
                >
                  RSI Overlay
                </button>
                <button 
                  onClick={() => setShowMACD(!showMACD)}
                  className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition ${showMACD ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500' : 'bg-slate-900 text-slate-500 border-slate-800'}`}
                >
                  MACD Overlay
                </button>
              </div>
            </div>

            {/* MAIN CHART SCREEN (Price + Direct Multi-Scale Indicators Canvas Overlay) */}
            <div id="indicators" className="h-80 w-full bg-slate-900 rounded-xl relative p-4 overflow-hidden border border-slate-800 flex flex-col justify-between">
              
              {/* Scaled Indicator Metrics Visualized directly on the timeframe display canvas */}
              <div className="absolute top-2 left-4 z-10 space-y-1 pointer-events-none">
                {showMA && <div className="text-[10px] font-mono text-amber-400 font-bold">MA(14): ${(marketData[marketData.length - 1]?.ma || 0).toFixed(2)}</div>}
                {showRSI && <div className="text-[10px] font-mono text-purple-400 font-bold">RSI(14): {(marketData[marketData.length - 1]?.rsi || 0).toFixed(1)}%</div>}
                {showMACD && <div className="text-[10px] font-mono text-cyan-400 font-bold">MACD(12, 26): {(marketData[marketData.length - 1]?.macd || 0).toFixed(2)}</div>}
              </div>

              {/* Mock Bar Render Container mapping directly onto canvas timeline layout */}
              <div className="w-full flex items-end justify-between h-56 pt-6">
                {marketData.map((tick, index) => {
                  const isUp = tick.close >= tick.open;
                  const heightPercentage = Math.min(Math.max(((tick.close - 140) / 20) * 100, 15), 90);
                  
                  return (
                    <div key={index} className="flex-1 flex flex-col items-center group h-full justify-end relative">
                      
                      {/* Indicator Overlay Nodes directly inside the main canvas matrix */}
                      {showMA && (
                        <div 
                          className="absolute w-1.5 h-1.5 rounded-full bg-amber-400 z-30 transition-all duration-300"
                          style={{ bottom: `${heightPercentage + (Math.sin(index) * 4)}%` }}
                        />
                      )}
                      {showRSI && (
                        <div 
                          className="absolute w-1 h-1 bg-purple-400 z-20 transition-all duration-300"
                          style={{ bottom: `${((tick.rsi || 50) / 100) * 85}%` }}
                        />
                      )}
                      {showMACD && (
                        <div 
                          className="absolute w-1.5 h-0.5 bg-cyan-400 z-20 transition-all duration-300"
                          style={{ bottom: `${40 + ((tick.macd || 0) * 6)}%` }}
                        />
                      )}

                      {/* Main Stock Candlestick */}
                      <div 
                        className={`w-full max-w-[6px] rounded-sm transition-all duration-300 ${isUp ? 'bg-emerald-500' : 'bg-rose-500'}`}
                        style={{ height: `${heightPercentage}%` }}
                      />
                    </div>
                  );
                })}
              </div>

              {/* Timeframe Axis Scale */}
              <div className="border-t border-slate-800 pt-2 flex justify-between text-[10px] font-mono text-slate-500">
                <span>{marketData[0]?.time}</span>
                <span>Interval: 1 Min Timeframe</span>
                <span>{marketData[marketData.length - 1]?.time}</span>
              </div>
            </div>
          </div>

          {/* LAUNCHPAD IPO TRACKER PANEL */}
          <div id="ipo" className="bg-slate-950 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold mb-1 flex items-center space-x-2">
                <span>🚀 IPO Tracker Launchpad</span>
              </h3>
              <p className="text-xs text-slate-400 mb-4">Monitor historical listings & upcoming corporate public filings.</p>
              
              <div className="space-y-3">
                {ipos.map((ipo) => (
                  <div key={ipo.id} className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex justify-between items-center text-sm">
                    <div>
                      <div className="font-bold text-slate-200">{ipo.companyName}</div>
                      <div className="text-xs font-mono text-slate-500">{ipo.ticker} • Range: {ipo.priceRange}</div>
                    </div>
                    <div className="text-right">
                      <span className={`text-[10px] uppercase tracking-wider font-mono font-bold px-2 py-0.5 rounded-full ${
                        ipo.status === 'Open' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-amber-950 text-amber-400 border border-amber-800'
                      }`}>
                        {ipo.status}
                      </span>
                      <div className="text-[10px] text-slate-400 mt-1">{ipo.expectedDate}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800/60 text-center text-xs text-slate-500">
              Updates compile dynamically relative to SEBI / SEC calendar frameworks.
            </div>
          </div>
        </section>

        {/* NEWSLETTER DYNAMIC INTEGRATION MODULE */}
        <section id="newsletter" className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-xl">
            <h3 className="text-xl font-bold mb-2">📰 Advanced Analytics Newsletter</h3>
            <p className="text-sm text-slate-400">
              Get raw technical data streams, tracking indices, and updated indicator alerts dispatched automatically to your mailbox.
            </p>
          </div>

          <div className="w-full md:w-auto min-w-[320px]">
            <form onSubmit={handleNewsletterToggle} className="flex gap-2">
              <input 
                type="email" 
                required
                disabled={isSubscribed}
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="bg-slate-950 border border-slate-700 text-slate-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 flex-grow disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Enter terminal email"
              />
              <button 
                type="submit" 
                className={`text-xs font-bold px-4 py-2 rounded-lg transition whitespace-nowrap uppercase tracking-wider ${
                  isSubscribed 
                    ? 'bg-rose-600 hover:bg-rose-700 text-white' 
                    : 'bg-emerald-400 hover:bg-emerald-500 text-slate-950'
                }`}
              >
                {isSubscribed ? 'Unsubscribe' : 'Subscribe'}
              </button>
            </form>
            {newsletterStatus && (
              <p className={`text-xs mt-2 font-mono ${isSubscribed ? 'text-emerald-400' : 'text-amber-400'}`}>
                {newsletterStatus}
              </p>
            )}
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-800 bg-slate-950 py-6 text-center text-xs text-slate-500">
        © 2026 Market Compass Systems Corp. All data streams simulate real-time operations.
      </footer>
    </div>
  );
}
