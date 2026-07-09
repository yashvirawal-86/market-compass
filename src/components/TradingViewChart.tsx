import { useEffect, useRef } from "react";

interface TradingViewChartProps {
  symbol?: string;
  theme?: "light" | "dark";
  height?: number;
}

export default function TradingViewChart({
  symbol = "NASDAQ:AAPL",
  theme = "dark",
  height = 650,
}: TradingViewChartProps) {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current) return;

    container.current.innerHTML = "";

    const script = document.createElement("script");

    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";

    script.type = "text/javascript";
    script.async = true;

    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol,
      interval: "D",
      timezone: "Etc/UTC",
      theme,
      style: "1",
      locale: "en",
      allow_symbol_change: true,
      withdateranges: true,
      hide_side_toolbar: false,
      save_image: true,
      calendar: false,
      support_host: "https://www.tradingview.com",

      studies: [
        "RSI@tv-basicstudies",
        "MACD@tv-basicstudies",
        "MASimple@tv-basicstudies"
      ]
    });

    container.current.appendChild(script);
  }, [symbol, theme]);

  return (
    <div
      className="w-full rounded-xl overflow-hidden border border-cyan-500/20 bg-slate-900 shadow-lg"
      style={{ height }}
    >
      <div
        ref={container}
        className="tradingview-widget-container"
        style={{
          width: "100%",
          height: "100%",
        }}
      >
        <div
          className="tradingview-widget-container__widget"
          style={{
            width: "100%",
            height: "100%",
          }}
        />
      </div>
    </div>
  );
}
