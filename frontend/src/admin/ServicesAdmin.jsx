import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2, Eye, EyeOff, ChevronDown } from "lucide-react";
import { api, errMsg } from "./api";
import { panelCls, inputCls, btnPrimary, btnGhost, AdminField } from "./ui";

const empty = {
  num: "", name: "", ar: "", ku: "", tech: "", fuels: ["petrol", "diesel"],
  desc: { ar: "", en: "", ku: "" }, benefit: { ar: "", en: "", ku: "" }, systems: [], hidden: false,
};

export default function ServicesAdmin() {
  const [items, setItems] = useState([]);
  const [openId, setOpenId] = useState(null);
  const [draft, setDraft] = useState(null);

  const load = () => api.get("/admin/services").then(({ data }) => setItems(data)).catch((e) => toast.error(errMsg(e)));
  useEffect(() => { load(); }, []);

  const startEdit = (item) => {
    setOpenId(item.id);
    setDraft({ ...empty, ...item, desc: { ...empty.desc, ...item.desc }, benefit: { ...empty.benefit, ...item.benefit } });
  };

  const save = async () => {
    try {
      if (draft.id) await api.put(`/admin/services/${draft.id}`, draft);
      else await api.post("/admin/services", draft);
      toast.success("تم الحفظ");
      setOpenId(null); setDraft(null); load();
    } catch (e) { toast.error(errMsg(e)); }
  };

  const remove = async (id) => {
    if (!window.confirm("حذف هذه الخدمة؟")) return;
    try { await api.delete(`/admin/services/${id}`); toast.success("تم الحذف"); load(); }
    catch (e) { toast.error(errMsg(e)); }
  };

  const toggleHidden = async (item) => {
    try { await api.put(`/admin/services/${item.id}`, { hidden: !item.hidden }); load(); }
    catch (e) { toast.error(errMsg(e)); }
  };

  const upd = (path, value) => setDraft((d) => {
    if (path.includes(".")) {
      const [a, b] = path.split(".");
      return { ...d, [a]: { ...d[a], [b]: value } };
    }
    return { ...d, [path]: value };
  });

  return (
    <div className="space-y-3" data-testid="services-tab">
      <button
        data-testid="service-add"
        onClick={() => { setDraft({ ...empty }); setOpenId("new"); }}
        className={`${btnPrimary} flex items-center gap-2`}
      >
        <Plus size={15} /> خدمة جديدة
      </button>

      {openId === "new" && draft && (
        <Editor draft={draft} upd={upd} save={save} cancel={() => { setOpenId(null); setDraft(null); }} />
      )}

      {items.map((item) => (
        <div key={item.id} className={panelCls} data-testid={`service-item-${item.id}`}>
          <div className="flex items-center gap-3 p-4">
            <span className="font-mono text-[11px] text-rev">{item.num}</span>
            <button onClick={() => (openId === item.id ? setOpenId(null) : startEdit(item))} className="flex-1 text-start min-w-0">
              <div className="font-display font-bold text-base truncate">{item.name}</div>
              <div className="text-xs text-ash truncate">{item.ar}</div>
            </button>
            <button onClick={() => toggleHidden(item)} className="p-2 text-smoke hover:text-rev transition-colors" data-testid={`service-hide-${item.id}`} aria-label="إظهار/إخفاء">
              {item.hidden ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
            <button onClick={() => remove(item.id)} className="p-2 text-smoke hover:text-rev transition-colors" data-testid={`service-delete-${item.id}`} aria-label="حذف">
              <Trash2 size={15} />
            </button>
            <ChevronDown size={15} className={`text-ash transition-transform ${openId === item.id ? "rotate-180" : ""}`} />
          </div>
          {openId === item.id && draft && (
            <Editor draft={draft} upd={upd} save={save} cancel={() => { setOpenId(null); setDraft(null); }} />
          )}
        </div>
      ))}
    </div>
  );
}

const Editor = ({ draft, upd, save, cancel }) => (
  <div className="border-t border-white/[0.07] p-4 grid sm:grid-cols-2 gap-4" data-testid="service-editor">
    <AdminField label="الرقم"><input value={draft.num} onChange={(e) => upd("num", e.target.value)} className={inputCls} data-testid="service-num" /></AdminField>
    <AdminField label="الاسم الإنجليزي"><input value={draft.name} onChange={(e) => upd("name", e.target.value)} className={inputCls} data-testid="service-name" /></AdminField>
    <AdminField label="الاسم العربي"><input value={draft.ar} onChange={(e) => upd("ar", e.target.value)} className={inputCls} data-testid="service-ar" /></AdminField>
    <AdminField label="الاسم الكوردي"><input value={draft.ku || ""} onChange={(e) => upd("ku", e.target.value)} className={inputCls} data-testid="service-ku" /></AdminField>
    <AdminField label="الاسم التقني"><input value={draft.tech} onChange={(e) => upd("tech", e.target.value)} className={inputCls} data-testid="service-tech" /></AdminField>
    <AdminField label="الوصف (عربي)"><textarea rows={3} value={draft.desc.ar} onChange={(e) => upd("desc.ar", e.target.value)} className={inputCls} data-testid="service-desc-ar" /></AdminField>
    <AdminField label="الوصف (كوردي)"><textarea rows={3} value={draft.desc.ku || ""} onChange={(e) => upd("desc.ku", e.target.value)} className={inputCls} data-testid="service-desc-ku" /></AdminField>
    <AdminField label="الوصف (إنجليزي)"><textarea rows={3} value={draft.desc.en} onChange={(e) => upd("desc.en", e.target.value)} className={inputCls} /></AdminField>
    <AdminField label="الفائدة (عربي)"><input value={draft.benefit.ar} onChange={(e) => upd("benefit.ar", e.target.value)} className={inputCls} /></AdminField>
    <AdminField label="الفائدة (كوردي)"><input value={draft.benefit.ku || ""} onChange={(e) => upd("benefit.ku", e.target.value)} className={inputCls} /></AdminField>
    <AdminField label="الفائدة (إنجليزي)"><input value={draft.benefit.en} onChange={(e) => upd("benefit.en", e.target.value)} className={inputCls} /></AdminField>
    <AdminField label="الأنظمة (افصلها بفاصلة)">
      <input
        value={(draft.systems || []).join(", ")}
        onChange={(e) => upd("systems", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))}
        className={inputCls}
      />
    </AdminField>
    <AdminField label="نوع الوقود">
      <div className="flex gap-4 pt-2">
        {["petrol", "diesel"].map((f) => (
          <label key={f} className="flex items-center gap-2 text-sm text-smoke">
            <input
              type="checkbox"
              checked={(draft.fuels || []).includes(f)}
              onChange={(e) => upd("fuels", e.target.checked ? [...(draft.fuels || []), f] : draft.fuels.filter((x) => x !== f))}
              className="accent-rev w-4 h-4"
            />
            {f === "petrol" ? "بنزين" : "ديزل"}
          </label>
        ))}
      </div>
    </AdminField>
    <div className="sm:col-span-2 flex gap-3">
      <button onClick={save} className={btnPrimary} data-testid="service-save">حفظ</button>
      <button onClick={cancel} className={btnGhost}>إلغاء</button>
    </div>
  </div>
);
