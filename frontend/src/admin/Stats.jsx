import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from "recharts";
import { CalendarClock, Inbox, TrendingUp, CheckCircle2 } from "lucide-react";
import { api, errMsg, statusMeta } from "./api";
import { panelCls } from "./ui";
import { toast } from "sonner";

const Card = ({ icon: Icon, label, value, testid }) => (
  <div className={`${panelCls} p-5`} data-testid={testid}>
    <div className="flex items-center justify-between mb-3">
      <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-ash">{label}</span>
      <Icon size={16} className="text-rev" />
    </div>
    <div className="font-display font-black text-3xl">{value}</div>
  </div>
);

export default function Stats() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/admin/stats").then(({ data }) => setData(data)).catch((e) => toast.error(errMsg(e)));
  }, []);

  if (!data) return <div className="font-mono text-xs text-ash" data-testid="stats-loading">جاري التحميل...</div>;

  return (
    <div className="space-y-6" data-testid="stats-tab">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card icon={Inbox} label="كل الحجوزات" value={data.total} testid="stat-total" />
        <Card icon={CalendarClock} label="اليوم" value={data.today} testid="stat-today" />
        <Card icon={TrendingUp} label="آخر 7 أيام" value={data.week} testid="stat-week" />
        <Card icon={CheckCircle2} label="مكتملة" value={data.byStatus?.done || 0} testid="stat-done" />
      </div>

      <div className="flex flex-wrap gap-2">
        {Object.entries(statusMeta).map(([k, m]) => (
          <span key={k} className={`font-mono text-[11px] border px-3 py-1.5 ${m.cls}`} data-testid={`stat-status-${k}`}>
            {m.label}: {data.byStatus?.[k] || 0}
          </span>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className={`${panelCls} p-4`}>
          <div className="font-mono text-[10px] tracking-[0.15em] text-ash mb-4">الحجوزات — آخر 14 يوم</div>
          <div className="h-56 min-h-[224px] w-full">
            <ResponsiveContainer width="100%" height="100%" minHeight={224} minWidth={100}>
              <LineChart data={data.daily}>
                <CartesianGrid stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="day" tick={{ fill: "#8a8a8a", fontSize: 10 }} tickFormatter={(d) => d?.slice(5)} />
                <YAxis tick={{ fill: "#8a8a8a", fontSize: 10 }} allowDecimals={false} />
                <Tooltip contentStyle={{ background: "#111", border: "1px solid rgba(255,32,32,0.4)" }} />
                <Line type="monotone" dataKey="count" stroke="#FF2020" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className={`${panelCls} p-4`}>
          <div className="font-mono text-[10px] tracking-[0.15em] text-ash mb-4">أكثر الخدمات طلبًا</div>
          <div className="h-56 min-h-[224px] w-full">
            <ResponsiveContainer width="100%" height="100%" minHeight={224} minWidth={100}>
              <BarChart data={data.topServices}>
                <XAxis dataKey="label" tick={{ fill: "#8a8a8a", fontSize: 9 }} interval={0} />
                <YAxis tick={{ fill: "#8a8a8a", fontSize: 10 }} allowDecimals={false} />
                <Tooltip contentStyle={{ background: "#111", border: "1px solid rgba(255,32,32,0.4)" }} />
                <Bar dataKey="count" fill="#FF2020" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className={`${panelCls} p-4`}>
        <div className="font-mono text-[10px] tracking-[0.15em] text-ash mb-3">أكثر الماركات</div>
        <div className="flex flex-wrap gap-2">
          {data.topBrands?.length ? data.topBrands.map((b) => (
            <span key={b.label} className="font-mono text-[11px] border border-white/10 px-3 py-1.5 text-smoke">
              {b.label} — {b.count}
            </span>
          )) : <span className="text-ash text-xs">لا توجد بيانات بعد</span>}
        </div>
      </div>
    </div>
  );
}
