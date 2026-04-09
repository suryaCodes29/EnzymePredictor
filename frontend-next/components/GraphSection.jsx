"use client";

import { motion } from "framer-motion";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, BarChart, Bar, CartesianGrid } from "recharts";
import ThreeDProtein from "./ThreeDProtein";

export default function GraphSection({ lineData, barData, liveData = null }) {
  return (
    <div className="grid gap-6 xl:grid-cols-[1.6fr_1.4fr]">
      <motion.div
        whileHover={{ y: -5 }}
        drag
        dragConstraints={{ top: -10, bottom: 10, left: -10, right: 10 }}
        className="glass-card rounded-[2rem] p-6"
      >
        <div className="flex flex-col gap-2">
          <h3 className="text-sm uppercase tracking-[0.24em] text-cyan-300">Interactive graph</h3>
          <p className="text-xl font-semibold text-slate-100">Enzyme activity over time</p>
        </div>
        <div className="mt-6 h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={lineData} margin={{ top: 20, right: 16, left: -6, bottom: 0 }}>
              <CartesianGrid stroke="rgba(148,163,184,0.12)" vertical={false} />
              <XAxis dataKey="time" tick={{ fill: "rgba(148,163,184,0.9)", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "rgba(148,163,184,0.9)", fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "rgba(15,23,42,0.96)", border: "1px solid rgba(56,189,248,0.18)", borderRadius: 18 }} />
              <Line type="monotone" dataKey="activity" stroke="#38bdf8" strokeWidth={3} dot={{ r: 4, fill: "#38bdf8" }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <div className="space-y-6">
        <motion.div
          whileHover={{ y: -5 }}
          drag
          dragConstraints={{ top: -10, bottom: 10, left: -10, right: 10 }}
          className="glass-card rounded-[2rem] p-6"
        >
          <div className="flex flex-col gap-2">
            <h3 className="text-sm uppercase tracking-[0.24em] text-cyan-300">Model confidence</h3>
            <p className="text-xl font-semibold text-slate-100">Prediction confidence by AI model</p>
          </div>
          <div className="mt-6 h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 10, right: 0, left: -16, bottom: 0 }}>
                <CartesianGrid stroke="rgba(148,163,184,0.12)" vertical={false} />
                <XAxis dataKey="model" tick={{ fill: "rgba(148,163,184,0.9)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "rgba(148,163,184,0.9)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <defs>
                <linearGradient id="gradientBar" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.95} />
                  <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0.45} />
                </linearGradient>
              </defs>
              <Bar dataKey="confidence" radius={[14, 14, 0, 0]} fill="url(#gradientBar)" />
            </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div whileHover={{ y: -5 }} className="glass-card rounded-[2rem] p-6">
          <h3 className="text-sm uppercase tracking-[0.24em] text-cyan-300">Protein engine</h3>
          <p className="mt-3 text-slate-400">Real-time molecular visualization with WebSocket streaming</p>
          <div className="mt-6 h-[400px]">
            <ThreeDProtein liveData={liveData} />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
