export default function StatsCard({ label, value, detail }) {
  return (
    <div className="glass-card rounded-3xl p-6 transition hover:-translate-y-1 hover:border-cyan-300/20 hover:bg-white/10">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm uppercase tracking-[0.24em] text-slate-400">{label}</p>
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-200">
          •
        </span>
      </div>
      <h3 className="mt-5 text-3xl font-semibold text-slate-100">{value}</h3>
      <p className="mt-3 text-sm leading-6 text-slate-400">{detail}</p>
    </div>
  );
}
