import axios from "axios";

export const TOKEN_KEY = "tba_admin_token";

export const api = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL ? `${process.env.REACT_APP_BACKEND_URL}/api` : "/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const errMsg = (e) => {
  const d = e?.response?.data?.detail;
  if (typeof d === "string") return d;
  if (Array.isArray(d)) return d.map((x) => x?.msg || JSON.stringify(x)).join(" ");
  return e?.message || "صار خطأ غير متوقع";
};

export const statusMeta = {
  new: { label: "جديد", cls: "bg-rev/15 text-rev border-rev/40" },
  contacted: { label: "تم التواصل", cls: "bg-amber-500/15 text-amber-400 border-amber-500/40" },
  done: { label: "مكتمل", cls: "bg-emerald-500/15 text-emerald-400 border-emerald-500/40" },
  cancelled: { label: "ملغى", cls: "bg-white/10 text-ash border-white/20" },
};
