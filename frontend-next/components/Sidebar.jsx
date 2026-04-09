"use client";

import { motion } from "framer-motion";

const items = [
  { label: "Overview", icon: "📊" },
  { label: "Dataset", icon: "📁" },
  { label: "Models", icon: "🧬" },
  { label: "Insights", icon: "✨" },
];

export default function Sidebar() {
  return (
    <motion.aside
      initial={{ opacity: 0, x: -40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.65, ease: "easeOut" }}
      className="glass-card hidden w-72 flex-col gap-4 p-6 lg:flex"
    >
      <div className="rounded-3xl border border-white/10 bg-slate-950/30 p-4 text-sm text-slate-300">
        AI Control Center
      </div>
      <div className="space-y-3">
        {items.map((item) => (
          <button
            key={item.label}
            className="group flex w-full items-center gap-3 rounded-3xl px-4 py-3 text-left text-sm text-slate-300 transition hover:bg-cyan-400/10 hover:text-cyan-100"
          >
            <span className="rounded-2xl bg-slate-800/70 p-3 text-lg group-hover:bg-cyan-500/20">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </div>
      <div className="mt-auto rounded-3xl border border-cyan-300/10 bg-cyan-400/5 p-5 text-sm text-slate-200">
        <h4 className="font-semibold text-slate-100">Live pulse</h4>
        <p className="mt-3 text-slate-400">GPU utilization, prediction queue, and model sync are all optimized for real-time outputs.</p>
      </div>
    </motion.aside>
  );
}
