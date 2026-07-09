import { useEffect, useRef } from "react";

export default function TradingViewChart() {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current) return;

    // Remove old widget if React re-renders
    container.current.innerHTML = "";

    const script = document.createElement("script");

    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";

    script.type = "text/javascript";
    script.async = true;

    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: "NASDAQ:AAPL",
      interval: "D",
      timezone: "Etc/UTC",
      theme: "dark",
      style: "1",
      locale: "en",
      allow_symbol_change: true,
      save_image: true,
      hide_side_toolbar: false,
      withdateranges: true,
      details: true,
      hotlist: true,
      calendar: true,
      studies: [
        "RSI@tv-basicstudies",
        "MACD@tv-basicstudies",
        "MASimple@tv-basicstudies"
      ]
    });

    container.current.appendChild(script);
  }, []);

  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      <h2 className="text-3xl font-bold text-white mb-6">
        Live TradingView Chart
      </h2>

      <div
        className="tradingview-widget-container rounded-xl overflow-hidden border border-cyan-500/30"
        style={{ height: "700px" }}
      >
        <div
          ref={container}
          className="tradingview-widget-container__widget"
          style={{ height: "100%", width: "100%" }}
        />
      </div>
    </section>
  );
}
