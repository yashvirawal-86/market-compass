import axios from "axios";

const API_KEY = import.meta.env.VITE_FINNHUB_API_KEY;

const api = axios.create({
  baseURL: "https://finnhub.io/api/v1",
  timeout: 10000,
});

export async function getQuote(symbol: string) {
  const { data } = await api.get("/quote", {
    params: {
      symbol,
      token: API_KEY,
    },
  });

  return {
    current: data.c,
    change: data.d,
    percentChange: data.dp,
    high: data.h,
    low: data.l,
    open: data.o,
    previousClose: data.pc,
  };
}

export async function getCompanyProfile(symbol: string) {
  const { data } = await api.get("/stock/profile2", {
    params: {
      symbol,
      token: API_KEY,
    },
  });

  return data;
}

export async function getMarketNews() {
  const { data } = await api.get("/news", {
    params: {
      category: "general",
      token: API_KEY,
    },
  });

  return data.slice(0, 10);
}
