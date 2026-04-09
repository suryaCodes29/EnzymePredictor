import { motion } from 'framer-motion';
import { Activity, Beaker, Database, Thermometer } from 'lucide-react';
import { useEffect, useState } from 'react';

import api from '../api/client';
import GlassCard from '../components/GlassCard';
import { useAuth } from '../contexts/AuthContext';

function AnimatedNumber({ value }) {
  const [current, setCurrent] = useState(0);
  
  useEffect(() => {
    if (typeof value !== 'number') {
      setCurrent(value);
      return;
    }
    
    let start = 0;
    const duration = 2000;
    const increment = value / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCurrent(value);
        clearInterval(timer);
      } else {
        setCurrent(Math.floor(start));
      }
    }, 16);
    
    return () => clearInterval(timer);
  }, [value]);

  return <>{current}</>;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ health: 'Checking...', wasteCount: 0 });

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [{ data: health }, { data: wastes }] = await Promise.all([api.get('/health'), api.get('/supported-wastes')]);
        setStats({ health: health.status, wasteCount: wastes.wastes.length });
      } catch {
        setStats({ health: 'Unavailable', wasteCount: 9 });
      }
    };

    loadDashboard();
  }, []);

  const cards = [
    { icon: Beaker, label: 'Supported feedstocks', value: stats.wasteCount, note: 'Validated waste categories' },
    { icon: Thermometer, label: 'Temperature guardrail', value: '≤ 60 °C', note: 'Biological safety limit' },
    { icon: Activity, label: 'Prediction mode', value: 'Rule-based', note: 'No placeholder values' },
    { icon: Database, label: 'API status', value: stats.health, note: 'Flask + SQLite service' }
  ];

  return (
    <div className="space-y-6">
      <motion.div 
        initial={{ opacity: 0, y: 8 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-6"
      >
        <div className="flex-1">
          <h2 className="text-4xl font-extrabold bg-gradient-to-r from-pastel-blue via-brand-500 to-pastel-lavender bg-clip-text text-transparent pb-1">
            Welcome, {user?.name?.split(' ')[0] || 'Researcher'}.
          </h2>
          <p className="mt-2 text-slate-600 dark:text-slate-300 max-w-2xl">
            Use the dashboard to compare enzyme suitability, decomposition behaviour, and preparation guidance for organic waste streams.
          </p>
        </div>
        <div className="flex-shrink-0">
          <GlassCard className="!p-2 group hover:scale-105 transition-transform duration-300">
            <div className="flex items-center gap-4 px-4 py-2">
              <img 
                src="/bio_enzyme_logo.png" 
                alt="Bio Enzyme Logo" 
                className="h-16 w-16 rounded-2xl shadow-lg shadow-green-500/20"
              />
              <div>
                <p className="text-[10px] uppercase tracking-widest text-brand-500 font-bold">Powered by</p>
                <h3 className="text-xl font-black bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">BIO ENZYME</h3>
              </div>
            </div>
          </GlassCard>
        </div>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ icon: Icon, label, value, note }, index) => (
          <motion.div 
            key={label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="group"
          >
            <GlassCard>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{label}</p>
                  <p className="mt-2 text-3xl font-bold bg-gradient-to-br from-slate-800 to-slate-500 bg-clip-text text-transparent dark:from-white dark:to-slate-400">
                    {typeof value === 'number' ? <AnimatedNumber value={value} /> : value}
                  </p>
                </div>
                <div className="relative rounded-2xl bg-gradient-to-br from-pastel-blue/20 to-pastel-mint/20 p-3 text-brand-600 dark:text-pastel-mint transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(167,243,208,0.5)]">
                  <Icon className="h-6 w-6 stroke-[1.5]" />
                </div>
              </div>
              <p className="mt-4 border-t border-slate-200/50 pt-3 text-xs text-slate-500 dark:border-slate-700/50 dark:text-slate-400">{note}</p>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
          <GlassCard>
            <h3 className="text-xl font-bold">Scientific validation layer</h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
            <li>• Primary enzymes are mapped directly from waste substrate composition.</li>
            <li>• Temperature ranges remain within realistic biological operating windows.</li>
            <li>• Production time never drops below 24 hours and scales with biomass complexity.</li>
            <li>• Yield is proportional to quantity and substrate efficiency rather than random estimation.</li>
          </ul>
        </GlassCard>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
        <GlassCard>
          <h3 className="text-xl font-bold">Suggested first analyses</h3>
          <div className="mt-4 space-y-4 text-sm text-slate-600 dark:text-slate-300">
            <div className="p-3 bg-white/40 dark:bg-slate-800/40 rounded-xl transition hover:bg-white/60">
              <p><strong>Fruit waste:</strong> pectinase-led softening and juice release assessment.</p>
            </div>
            <div className="p-3 bg-white/40 dark:bg-slate-800/40 rounded-xl transition hover:bg-white/60">
              <p><strong>Meat waste:</strong> protease and lipase comparison for rapid decomposition.</p>
            </div>
            <div className="p-3 bg-white/40 dark:bg-slate-800/40 rounded-xl transition hover:bg-white/60">
              <p><strong>Woody biomass:</strong> cellulase-xylanase-ligninase synergy study.</p>
            </div>
          </div>
        </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}
