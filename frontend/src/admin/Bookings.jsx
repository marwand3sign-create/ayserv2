import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Search, Download, Trash2, MessageCircle, Save } from "lucide-react";
import { api, errMsg, statusMeta } from "./api";
import { panelCls, inputCls, btnGhost } from "./ui";

const statuses = ["all", "new", "contacted", "done", "cancelled"];

export default function Bookings() {
  const [rows, setRows] = useState([]);
  const [status, setStatus] = useState("all");
  const [q, setQ] = useState("");
  const [notes, setNotes] = useState({});
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/admin/bookings", { params: { status, q: q || undefined } });
      setRows(data);
    } catch (e) {
      toast.error(errMsg(e));
    } finally {
      setLoading(false);
    }
  }, [status, q]);

  useEffect(() => { load(); }, [load]);

  const setStatusFor = async (id, value) => {
    try {
      await api.patch(`/admin/bookings/${id}`, { status: value });
      setRows((r) => r.map((b) => (b.id === id ? { ...b, status: value } : b)));
      toast.success("تم تحديث الحالة");
    } catch (e) { toast.error(errMsg(e)); }
  };

  const saveNote = async (id) => {
    try {
      await api.patch(`/admin/bookings/${id}`, { admin_notes: notes[id] ?? "" });
      setRows((r) => r.map((b) => (b.id === id ? { ...b, admin_notes: notes[id] ?? "" } : b)));
      toast.success("تم حفظ الملاحظة");
    } catch (e) { toast.error(errMsg(e)); }
  };

  const remove = async (id) => {
    if (!window.confirm("حذف هذا الحجز نهائيًا؟")) return;
    try {
      await api.delete(`/admin/bookings/${id}`);
      setRows((r) => r.filter((b) => b.id !== id));
      toast.success("تم الحذف");
    } catch (e) { toast.error(errMsg(e)); }
  };

  const exportCsv = async () => {
    try {
      const res = await api.get("/admin/bookings-export", { responseType: "blob" });
      const url = URL.createObjectURL(res.data);
      const a = document.createElement("a");
      a.href = url;
      a.download = "bookings.csv";
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) { toast.error(errMsg(e)); }
  };

  return (
    <div className="space-y-4" data-testid="bookings-tab">
      <div className="flex flex-wrap gap-2 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute top-1/2 -translate-y-1/2 start-3 text-ash" />
          <input
            data-testid="bookings-search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="ابحث بالاسم، الهاتف، الماركة..."
            className={`${inputCls} ps-9`}
          />
        </div>
        <select data-testid="bookings-status-filter" value={status} onChange={(e) => setStatus(e.target.value)} className={`${inputCls} w-auto`}>
          {statuses.map((s) => <option key={s} value={s}>{s === "all" ? "كل الحالات" : statusMeta[s].label}</option>)}
        </select>
        <button data-testid="bookings-export" onClick={exportCsv} className={`${btnGhost} flex items-center gap-2`}>
          <Download size={14} /> تصدير CSV
        </button>
      </div>

      {loading && <div className="font-mono text-xs text-ash">جاري التحميل...</div>}
      {!loading && rows.length === 0 && <div className={`${panelCls} p-8 text-center text-ash text-sm`} data-testid="bookings-empty">لا توجد حجوزات مطابقة</div>}

      <div className="space-y-3">
        {rows.map((b) => (
          <div key={b.id} className={`${panelCls} p-4`} data-testid={`booking-row-${b.id}`}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="font-display font-bold text-lg">{b.name}</div>
                <div dir="ltr" className="font-mono text-xs text-smoke text-start">{b.phone}</div>
                <div className="text-sm text-smoke mt-2">
                  {b.brand} {b.model} — {b.year} {b.engine ? `• ${b.engine}` : ""}
                </div>
                {b.service && <div className="font-mono text-[11px] text-rev mt-1">{b.service}</div>}
                {b.notes && <div className="text-xs text-ash mt-1">“{b.notes}”</div>}
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="font-mono text-[10px] text-ash">{new Date(b.created_at).toLocaleString("ar-IQ")}</span>
                <select
                  data-testid={`booking-status-${b.id}`}
                  value={b.status || "new"}
                  onChange={(e) => setStatusFor(b.id, e.target.value)}
                  className={`font-mono text-[11px] border px-2 py-1.5 bg-transparent ${statusMeta[b.status || "new"].cls}`}
                >
                  {Object.entries(statusMeta).map(([k, m]) => <option key={k} value={k} className="bg-graphite text-white">{m.label}</option>)}
                </select>
                <div className="flex gap-2">
                  <a
                    data-testid={`booking-wa-${b.id}`}
                    href={`https://wa.me/${b.phone.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 border border-white/15 text-smoke hover:text-rev hover:border-rev transition-colors"
                    aria-label="WhatsApp"
                  >
                    <MessageCircle size={15} />
                  </a>
                  <button
                    data-testid={`booking-delete-${b.id}`}
                    onClick={() => remove(b.id)}
                    className="p-2 border border-white/15 text-smoke hover:text-rev hover:border-rev transition-colors"
                    aria-label="حذف"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <input
                data-testid={`booking-note-${b.id}`}
                value={notes[b.id] ?? b.admin_notes ?? ""}
                onChange={(e) => setNotes((n) => ({ ...n, [b.id]: e.target.value }))}
                placeholder="ملاحظة داخلية..."
                className={inputCls}
              />
              <button onClick={() => saveNote(b.id)} className={`${btnGhost} shrink-0`} data-testid={`booking-note-save-${b.id}`}>
                <Save size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
