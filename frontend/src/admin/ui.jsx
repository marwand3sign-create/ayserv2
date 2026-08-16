export const panelCls = "border border-white/[0.07] bg-white/[0.02]";
export const inputCls =
  "w-full bg-white/[0.03] border border-white/10 focus:border-rev px-3 py-2.5 text-sm outline-none transition-colors placeholder:text-ash rounded-none";
export const btnPrimary =
  "bg-rev text-white font-semibold px-4 py-2.5 text-sm hover:bg-[#D41010] transition-colors disabled:opacity-60";
export const btnGhost =
  "border border-white/15 text-smoke px-3 py-2.5 text-sm hover:border-rev hover:text-rev transition-colors";

export const AdminField = ({ label, children }) => (
  <label className="block">
    <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-ash block mb-1.5">{label}</span>
    {children}
  </label>
);
