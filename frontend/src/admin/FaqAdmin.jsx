import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { api, errMsg } from "./api";
import { panelCls, inputCls, btnPrimary, btnGhost, AdminField } from "./ui";

const empty = { q: { ar: "", en: "", ku: "" }, a: { ar: "", en: "", ku: "" } };

export default function FaqAdmin() {
  const [items, setItems] = useState([]);
  const [draft, setDraft] = useState(null);

  const load = () => api.get("/admin/faq").then(({ data }) => setItems(data)).catch((e) => toast.error(errMsg(e)));
  useEffect(() => { load(); }, []);

  const save = async () => {
    try {
      if (draft.id) await api.put(`/admin/faq/${draft.id}`, draft);
      else await api.post("/admin/faq", draft);
      toast.success("تم الحفظ");
      setDraft(null); load();
    } catch (e) { toast.error(errMsg(e)); }
  };

  const remove = async (id) => {
    if (!window.confirm("حذف هذا السؤال؟")) return;
    try { await api.delete(`/admin/faq/${id}`); toast.success("تم الحذف"); load(); }
    catch (e) { toast.error(errMsg(e)); }
  };

  const upd = (group, lang, value) => setDraft((d) => ({ ...d, [group]: { ...d[group], [lang]: value } }));

  return (
    <div className="space-y-3" data-testid="faq-tab">
      <button onClick={() => setDraft({ ...empty })} className={`${btnPrimary} flex items-center gap-2`} data-testid="faq-add">
        <Plus size={15} /> سؤال جديد
      </button>

      {draft && (
        <div className={`${panelCls} p-4 grid sm:grid-cols-2 gap-4`} data-testid="faq-editor">
          <AdminField label="السؤال (عربي)"><input value={draft.q.ar} onChange={(e) => upd("q", "ar", e.target.value)} className={inputCls} data-testid="faq-q-ar" /></AdminField>
          <AdminField label="السؤال (كوردي)"><input value={draft.q.ku || ""} onChange={(e) => upd("q", "ku", e.target.value)} className={inputCls} data-testid="faq-q-ku" /></AdminField>
          <AdminField label="السؤال (إنجليزي)"><input value={draft.q.en} onChange={(e) => upd("q", "en", e.target.value)} className={inputCls} /></AdminField>
          <AdminField label="الجواب (عربي)"><textarea rows={3} value={draft.a.ar} onChange={(e) => upd("a", "ar", e.target.value)} className={inputCls} data-testid="faq-a-ar" /></AdminField>
          <AdminField label="الجواب (كوردي)"><textarea rows={3} value={draft.a.ku || ""} onChange={(e) => upd("a", "ku", e.target.value)} className={inputCls} data-testid="faq-a-ku" /></AdminField>
          <AdminField label="الجواب (إنجليزي)"><textarea rows={3} value={draft.a.en} onChange={(e) => upd("a", "en", e.target.value)} className={inputCls} /></AdminField>
          <div className="sm:col-span-2 flex gap-3">
            <button onClick={save} className={btnPrimary} data-testid="faq-save">حفظ</button>
            <button onClick={() => setDraft(null)} className={btnGhost}>إلغاء</button>
          </div>
        </div>
      )}

      {items.map((item) => (
        <div key={item.id} className={`${panelCls} p-4 flex items-start justify-between gap-3`} data-testid={`faq-item-${item.id}`}>
          <button onClick={() => setDraft({ ...empty, ...item, q: { ...empty.q, ...item.q }, a: { ...empty.a, ...item.a } })} className="text-start min-w-0">
            <div className="font-semibold text-sm">{item.q?.ar}</div>
            <div className="text-xs text-ash mt-1 line-clamp-2">{item.a?.ar}</div>
          </button>
          <button onClick={() => remove(item.id)} className="p-2 text-smoke hover:text-rev transition-colors shrink-0" data-testid={`faq-delete-${item.id}`}>
            <Trash2 size={15} />
          </button>
        </div>
      ))}
    </div>
  );
}
