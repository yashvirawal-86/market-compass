import { useEffect, useState } from "react";

export function Sparkline({ data, up, width = 96, height = 32 }: { data: number[]; up: boolean; width?: number; height?: number }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const step = width / (data.length - 1);
  const pts = data.map((v, i) => `${i * step},${height - ((v - min) / range) * height}`).join(" ");
  const color = up ? "var(--gain)" : "var(--loss)";
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
      <defs>
        <linearGradient id={`g-${up ? "u" : "d"}-${Math.random().toString(36).slice(2, 7)}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.4" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

export function useLivePrice(base: number, vol = 0.003) {
  const [price, setPrice] = useState(base);
  useEffect(() => {
    const id = setInterval(() => {
      setPrice((p) => p * (1 + (Math.random() - 0.5) * vol));
    }, 3000);
    return () => clearInterval(id);
  }, [vol]);
  return price;
}

export function fmt(n: number, dec = 2) {
  return n.toLocaleString("en-US", { minimumFractionDigits: dec, maximumFractionDigits: dec });
}
