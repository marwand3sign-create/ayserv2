import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2, Save } from "lucide-react";
import { api, errMsg } from "./api";
import { panelCls, inputCls, btnPrimary, btnGhost } from "./ui";

export default function BrandsAdmin() {
  const [items, setItems] = useState([]);
  const [newBrand, setNewBrand] = useState({ name: "", models: "" });
  const [edits, setEdits] = useState({});

  const load = () => api.get("/admin/brands").then(({ data }) => setItems(data)).catch((e) => toast.error(errMsg(e)));
  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!newBrand.name.trim()) return;
    try {
      await api.post("/admin/brands", {
        id: newBrand.name.toLowerCase().replace(/\s/g, "-"),
        name: newBrand.name.trim(),
        models: newBrand.models.split(",").map((m) => m.trim()).filter(Boolean),
      });
      setNewBrand({ name: "", models: "" });
      toast.success("تمت الإضافة");
      load();
    } catch (e) { toast.error(errMsg(e)); }
  };

  const saveModels = async (item) => {
    try {
      await api.put(`/admin/brands/${item.id}`, {
        models: (edits[item.id] ?? item.models.join(", ")).split(",").map((m) => m.trim()).filter(Boolean),
      });
      toast.success("تم الحفظ");
      load();
    } catch (e) { toast.error(errMsg(e)); }
  };

  const remove = async (id) => {
    if (!window.confirm("حذف هذه الماركة؟")) return;
    try { await api.delete(`/admin/brands/${id}`); toast.success("تم الحذف"); load(); }
    catch (e) { toast.error(errMsg(e)); }
  };

  return (
    <div className="space-y-4" data-testid="brands-tab">
      <div className={`${panelCls} p-4 grid sm:grid-cols-[1fr_2fr_auto] gap-3 items-end`}>
        <input data-testid="brand-new-name" value={newBrand.name} onChange={(e) => setNewBrand((b) => ({ ...b, name: e.target.value }))} placeholder="اسم الماركة" className={inputCls} />
        <input data-testid="brand-new-models" value={newBrand.models} onChange={(e) => setNewBrand((b) => ({ ...b, models: e.target.value }))} placeholder="الموديلات مفصولة بفاصلة" className={inputCls} />
        <button onClick={add} className={`${btnPrimary} flex items-center gap-2`} data-testid="brand-add"><Plus size={15} /> إضافة</button>
      </div>

      {items.map((item) => (
        <div key={item.id} className={`${panelCls} p-4`} data-testid={`brand-item-${item.id}`}>
          <div className="flex items-center justify-between gap-3 mb-3">
            <span className="font-display font-bold text-base">{item.name}</span>
            <span className="font-mono text-[10px] text-ash">{item.models?.length || 0} موديل</span>
          </div>
          <div className="flex gap-2">
            <input
              data-testid={`brand-models-${item.id}`}
              value={edits[item.id] ?? (item.models || []).join(", ")}
              onChange={(e) => setEdits((s) => ({ ...s, [item.id]: e.target.value }))}
              className={inputCls}
            />
            <button onClick={() => saveModels(item)} className={`${btnGhost} shrink-0`} data-testid={`brand-save-${item.id}`}><Save size={14} /></button>
            <button onClick={() => remove(item.id)} className={`${btnGhost} shrink-0`} data-testid={`brand-delete-${item.id}`}><Trash2 size={14} /></button>
          </div>
        </div>
      ))}
    </div>
  );
}
