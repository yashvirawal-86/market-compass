import { SignJWT, jwtVerify } from 'jose';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    // Handle CORS preflight requests
    if (method === "OPTIONS") {
      return handleCors();
    }

    try {
      // 1. PUBLIC ROUTES & AUTHENTICATION
      if (path === "/api/auth/register" && method === "POST") {
        return await handleRegister(request, env);
      }
      if (path === "/api/auth/login" && method === "POST") {
        return await handleLogin(request, env);
      }
      if (path === "/api/newsletter/subscribe" && method === "POST") {
        return await handleNewsletterSubscribe(request, env);
      }

      // 2. PROTECTED ROUTES (Require Valid JWT Token)
      const user = await authenticateRequest(request, env);
      if (!user) {
        return jsonResponse({ error: "Unauthorized. Missing or invalid token." }, 401);
      }

      // Live Market Data Router
      if (path === "/api/market/live" && method === "GET") {
        const symbol = url.searchParams.get("symbol") || "AAPL";
        return await handleLiveMarketData(symbol, env);
      }

      // Technical Indicators Router (RSI, MACD, Moving Averages)
      if (path === "/api/market/indicators" && method === "GET") {
        const symbol = url.searchParams.get("symbol") || "AAPL";
        return await handleTechnicalIndicators(symbol, env);
      }

      // IPO Tracker Router
      if (path === "/api/market/ipos" && method === "GET") {
        return await handleIpoTracker(env);
      }

      // TradingView Configuration Helper
      if (path === "/api/market/tradingview-config" && method === "GET") {
        return jsonResponse({
          container_id: "tradingview_chart",
          library_path: "https://s3.tradingview.com/tv.js",
          default_symbol: "NASDAQ:AAPL",
          interval: "D",
          timezone: "Etc/UTC",
          theme: "dark",
          style: "1"
        });
      }

      return jsonResponse({ error: "Route not found" }, 404);

    } catch (err) {
      return jsonResponse({ error: err.message || "Internal Server Error" }, 500);
    }
  }
};

// ==========================================
// 1. AUTHENTICATION IMPROVEMENTS (JWT-based)
// ==========================================
async function handleRegister(request, env) {
  const { email, password, name } = await request.json();
  if (!email || !password) return jsonResponse({ error: "Email and password required" }, 400);

  // Quick check if user exists in D1 SQL Database
  const existingUser = await env.DB.prepare("SELECT * FROM users WHERE email = ?").bind(email).first();
  if (existingUser) return jsonResponse({ error: "User already exists" }, 400);

  // In production, use standard Web Crypto PBKDF2 / bcrypt to hash passwords. 
  // Storing a simple SHA-256 for basic compliance in minimal worker script environments.
  const passwordHash = await hashPassword(password);

  await env.DB.prepare("INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)")
    .bind(email, passwordHash, name || "")
    .run();

  return jsonResponse({ message: "Registration successful" }, 201);
}

async function handleLogin(request, env) {
  const { email, password } = await request.json();
  const passwordHash = await hashPassword(password);

  const user = await env.DB.prepare("SELECT * FROM users WHERE email = ? AND password_hash = ?")
    .bind(email, passwordHash)
    .first();

  if (!user) return jsonResponse({ error: "Invalid credentials" }, 401);

  // Generate an industrial-grade secure JWT Token using the native WebCrypto 'jose' library
  const secret = new TextEncoder().encode(env.JWT_SECRET);
  const token = await new SignJWT({ id: user.id, email: user.email })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('2h')
    .sign(secret);

  return jsonResponse({ token, user: { email: user.email, name: user.name } });
}

async function authenticateRequest(request, env) {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;

  const token = authHeader.split(" ")[1];
  try {
    const secret = new TextEncoder().encode(env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (e) {
    return null;
  }
}

// ==========================================
// 2. LIVE MARKET DATA
// ==========================================
async function handleLiveMarketData(symbol, env) {
  // Pulling direct, low-latency live equity data from standard financial endpoints (e.g., AlphaVantage)
  const apiKey = env.ALPHA_VANTAGE_API_KEY;
  const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`;
  
  const res = await fetch(url);
  const data = await res.json();
  
  if (data["Global Quote"]) {
    const quote = data["Global Quote"];
    return jsonResponse({
      symbol: quote["01. symbol"],
      open: parseFloat(quote["02. open"]),
      high: parseFloat(quote["03. high"]),
      low: parseFloat(quote["04. low"]),
      price: parseFloat(quote["05. price"]),
      volume: parseInt(quote["06. volume"]),
      latestTradingDay: quote["07. latest trading day"],
      previousClose: parseFloat(quote["08. previous close"]),
      change: parseFloat(quote["09. change"]),
      changePercent: quote["10. change percent"]
    });
  }
  return jsonResponse({ error: "Failed to pull live data or rate limit hit." }, 400);
}

// ==========================================
// 3. TECHNICAL INDICATORS (RSI / MACD / MA)
// ==========================================
async function handleTechnicalIndicators(symbol, env) {
  const apiKey = env.ALPHA_VANTAGE_API_KEY;
  
  // Simultaneously fetch raw historical daily bars to calculate metrics accurately
  const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${apiKey}`;
  const res = await fetch(url);
  const data = await res.json();

  const timeSeries = data["Time Series (Daily)"];
  if (!timeSeries) return jsonResponse({ error: "Could not fetch historical data for technical analysis" }, 400);

  const entries = Object.entries(timeSeries).slice(0, 50); // Take last 50 trading records
  const closes = entries.map(([_, values]) => parseFloat(values["4. close"])).reverse();

  // Computations
  const ma20 = calculateSMA(closes, 20);
  const ma50 = calculateSMA(closes, 50);
  const rsi = calculateRSI(closes, 14);
  const macd = calculateMACD(closes);

  return jsonResponse({
    symbol,
    latestClose: closes[closes.length - 1],
    indicators: {
      movingAverage20: ma20,
      movingAverage50: ma50,
      rsi14: rsi,
      macd: macd
    }
  });
}

// Math/Stat functions for technical calculations
function calculateSMA(data, period) {
  if (data.length < period) return null;
  const slice = data.slice(-period);
  return (slice.reduce((acc, val) => acc + val, 0) / period).toFixed(2);
}

function calculateRSI(data, period = 14) {
  if (data.length <= period) return 50.0;
  let gains = 0, losses = 0;
  for (let i = data.length - period; i < data.length; i++) {
    const diff = data[i] - data[i - 1];
    if (diff > 0) gains += diff;
    else losses -= diff;
  }
  if (losses === 0) return 100;
  const rs = (gains / period) / (losses / period);
  return (100 - (100 / (1 + rs))).toFixed(2);
}

function calculateMACD(data) {
  const ema12 = calculateSMA(data, 12);
  const ema26 = calculateSMA(data, 26);
  if (!ema12 || !ema26) return { macdLine: "0.00", signalLine: "0.00" };
  const macdLine = (ema12 - ema26).toFixed(2);
  return { macdLine, signalLine: (macdLine * 0.9).toFixed(2) }; // Proxy signal calculation
}

// ==========================================
// 4. IPO TRACKER Backend
// ==========================================
async function handleIpoTracker(env) {
  // Scrapes or fetches upcoming/recent market listings from dynamic financial calendars
  const apiKey = env.ALPHA_VANTAGE_API_KEY;
  const url = `https://www.alphavantage.co/query?function=IPO_CALENDAR&apikey=${apiKey}`;
  
  const res = await fetch(url);
  const csvText = await res.text();

  // Simple clean parsing of CSV structure provided by financial market providers
  const lines = csvText.split("\n");
  const ipos = [];
  
  for (let i = 1; i < Math.min(lines.length, 15); i++) {
    const cols = lines[i].split(",");
    if (cols.length >= 4) {
      ipos.push({
        symbol: cols[0],
        name: cols[1],
        ipoDate: cols[2],
        priceRangeLow: cols[3],
        priceRangeHigh: cols[4] || cols[3]
      });
    }
  }
  return jsonResponse({ upComingIpos: ipos });
}

// ==========================================
// 5. NEWSLETTER BACKEND (Using Cloudflare KV)
// ==========================================
async function handleNewsletterSubscribe(request, env) {
  const { email } = await request.json();
  if (!email || !email.includes("@")) {
    return jsonResponse({ error: "A valid email address is required." }, 400);
  }

  const timestamp = new Date().toISOString();
  // Safe insertion into Cloudflare low-latency KV store
  await env.NEWSLETTER_KV.put(`subscriber:${email}`, JSON.stringify({ registeredAt: timestamp }));

  return jsonResponse({ message: "Successfully subscribed to Market Compass Insights newsletter!" }, 200);
}

// ==========================================
// UTILITIES & HELPERS
// ==========================================
async function hashPassword(password) {
  const myText = new TextEncoder().encode(password);
  const myDigest = await crypto.subtle.digest({ name: 'SHA-256' }, myText);
  return Array.from(new Uint8Array(myDigest)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS"
    }
  });
}

function handleCors() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS"
    }
  });
}
