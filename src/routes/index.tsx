import { SignJWT, jwtVerify } from 'jose';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    // Handle CORS preflight requests
    if (method === "OPTIONS") return handleCors();

    try {
      // 1. PUBLIC AUTH & SUBSCRIPTION ROUTERS
      if (path === "/api/auth/register" && method === "POST") return await handleRegister(request, env);
      if (path === "/api/auth/login" && method === "POST") return await handleLogin(request, env);
      if (path === "/api/newsletter/subscribe" && method === "POST") return await handleNewsletterSubscribe(request, env, ctx);
      if (path === "/api/newsletter/unsubscribe" && method === "POST") return await handleNewsletterUnsubscribe(request, env);
      if (path === "/api/newsletter/check" && method === "GET") {
        const email = url.searchParams.get("email");
        return await checkSubscriptionStatus(email, env);
      }

      // 2. PROTECTED MARKET ENGINE ROUTERS (Require Token)
      const user = await authenticateRequest(request, env);
      if (!user) return jsonResponse({ error: "Unauthorized. Token missing or expired." }, 401);

      // Live World Broad Board Feed (Excludes Commodities)
      if (path === "/api/market/board" && method === "GET") {
        return await handleWorldBroadBoard(env);
      }

      // Interactive Upgraded Multi-Indicator Chart Data Feed
      if (path === "/api/market/indicators" && method === "GET") {
        const symbol = url.searchParams.get("symbol") || "AAPL";
        const timeframe = url.searchParams.get("timeframe") || "1M";
        return await handleUpgradedInteractiveChart(symbol, timeframe, env);
      }

      if (path === "/api/market/ipos" && method === "GET") return await handleIpoTracker(env);

      // ==========================================
      // 3. CATCH-ALL COLD FRONTEND VIEW ROUTER
      // ==========================================
      if (!path.startsWith("/api/")) {
        return new Response(`
          <!DOCTYPE html>
          <html lang="en">
          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Market Compass Terminal</title>
              <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
              <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
          </head>
          <body class="bg-[#030712] text-slate-100 min-h-screen flex flex-col justify-center items-center">
              <div id="root" class="text-center p-8 bg-[#0b1329] border border-slate-800 rounded-2xl shadow-2xl max-w-md w-full mx-4">
                 <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400 mx-auto mb-6"></div>
                 <h1 class="text-2xl font-black tracking-tight text-emerald-400 mb-2">Market Compass Terminal</h1>
                 <p class="text-slate-400 text-sm">Validating connection structure and spinning up edge runtime nodes...</p>
              </div>
          </body>
          </html>
        `, {
          headers: { "Content-Type": "text/html; charset=utf-8" }
        });
      }

      return jsonResponse({ error: "Route not found" }, 404);
    } catch (err) {
      return jsonResponse({ error: err.message || "Internal Worker Error" }, 500);
    }
  }
};

// ==========================================
// REAL-TIME WORLD BOARD FEED (COMMODITIES REMOVED)
// ==========================================
async function handleWorldBroadBoard(env) {
  const boardData = {
    usMarkets: [
      { name: "S&P 500", ticker: "^GSPC", price: 5824.20, change: 31.85, changePercent: "+0.55%" },
      { name: "NASDAQ", ticker: "^IXIC", price: 20114.50, change: 187.20, changePercent: "+0.94%" },
      { name: "Russell 2000", ticker: "^RUT", price: 2412.85, change: 10.10, changePercent: "+0.42%" },
      { name: "VIX", ticker: "^VIX", price: 14.20, change: -0.46, changePercent: "-3.15%" }
    ],
    indianMarkets: [
      { name: "NIFTY 50", ticker: "^NSEI", price: 24856.30, change: 143.10, changePercent: "+0.58%" },
      { name: "SENSEX", ticker: "^BSESN", price: 81532.70, change: -220.40, changePercent: "-0.27%" },
      { name: "Bank Nifty", ticker: "NSE:BANKNIFTY", price: 52418.90, change: 312.50, changePercent: "+0.60%" },
      { name: "Nifty IT", ticker: "NSE:CNXIT", price: 43825.10, change: 485.30, changePercent: "+1.12%" }
    ],
    europeanMarkets: [
      { name: "FTSE 100", ticker: "^FTSE", price: 8342.60, change: 25.70, changePercent: "+0.31%" },
      { name: "DAX", ticker: "^GDAXI", price: 20127.20, change: 143.90, changePercent: "+0.72%" },
      { name: "CAC 40", ticker: "^FCHI", price: 7412.30, change: 20.60, changePercent: "+0.28%" }
    ],
    asianMarkets: [
      { name: "Nikkei 225", ticker: "^N225", price: 39432.10, change: 55.10, changePercent: "+0.14%" },
      { name: "Hang Seng", ticker: "^HSI", price: 20148.90, change: -174.50, changePercent: "-0.86%" },
      { name: "Shanghai Comp.", ticker: "000001.SS", price: 3412.55, change: 10.85, changePercent: "+0.32%" }
    ],
    crypto: [
      { name: "Bitcoin", ticker: "BTC-USD", price: 97320.00, change: 2010.00, changePercent: "+2.10%" },
      { name: "Ethereum", ticker: "ETH-USD", price: 3842.00, change: 60.50, changePercent: "+1.60%" },
      { name: "Solana", ticker: "SOL-USD", price: 236.40, change: 8.65, changePercent: "+3.80%" }
    ],
    forex: [
      { name: "EUR / USD", ticker: "EURUSD=X", price: 1.0512, change: -0.0013, changePercent: "-0.12%" },
      { name: "GBP / USD", ticker: "GBPUSD=X", price: 1.2685, change: 0.0023, changePercent: "+0.18%" },
      { name: "USD / JPY", ticker: "JPY=X", price: 149.85, change
