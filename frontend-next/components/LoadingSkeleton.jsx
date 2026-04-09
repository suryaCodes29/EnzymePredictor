export default function LoadingSkeleton() {
  return (
    <div className="glass-card rounded-[2rem] p-6">
      <div className="space-y-5">
        <div className="h-5 w-2/5 rounded-full bg-slate-800/80" />
        <div className="grid gap-4 md:grid-cols-3">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="h-24 rounded-3xl bg-slate-900/70" />
          ))}
        </div>
        <div className="h-72 rounded-[2rem] bg-slate-900/70" />
      </div>
    </div>
  );
}
