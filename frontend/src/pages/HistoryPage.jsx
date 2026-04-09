import { useEffect, useState } from 'react';

import api from '../api/client';
import GlassCard from '../components/GlassCard';
import LoadingSpinner from '../components/LoadingSpinner';

export default function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/user/history')
      .then(({ data }) => setHistory(data.history))
      .catch(() => setHistory([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <GlassCard>
        <LoadingSpinner label="Loading prediction history..." />
      </GlassCard>
    );
  }

  return (
    <div className="space-y-4">
      <GlassCard>
        <h2 className="text-2xl font-bold">Prediction history</h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Every authenticated prediction is stored in SQLite and displayed below for review.
        </p>
      </GlassCard>

      {history.length === 0 ? (
        <GlassCard>
          <p className="text-sm text-slate-600 dark:text-slate-300">No saved predictions yet. Run an analysis to populate your history.</p>
        </GlassCard>
      ) : (
        history.map((item) => (
          <GlassCard key={item.id}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-wide text-brand-500">{item.module_type}</p>
                <h3 className="mt-1 text-lg font-semibold">{item.waste_type}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">Quantity: {item.quantity_kg} kg</p>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400">{new Date(item.created_at).toLocaleString()}</p>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {item.module_type === 'enzyme' ? (
                <>
                  <div className="rounded-xl bg-slate-100 p-3 dark:bg-slate-800">
                    <p className="text-xs uppercase tracking-wide text-slate-500">Primary enzyme</p>
                    <p className="mt-1 font-semibold">{item.result.primary_enzyme.name}</p>
                  </div>
                  <div className="rounded-xl bg-slate-100 p-3 dark:bg-slate-800">
                    <p className="text-xs uppercase tracking-wide text-slate-500">Expected yield</p>
                    <p className="mt-1 font-semibold">{item.result.expected_yield_u_per_g} U/g</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="rounded-xl bg-slate-100 p-3 dark:bg-slate-800">
                    <p className="text-xs uppercase tracking-wide text-slate-500">Fastest enzyme</p>
                    <p className="mt-1 font-semibold">{item.result.fastest_enzyme}</p>
                  </div>
                  <div className="rounded-xl bg-slate-100 p-3 dark:bg-slate-800">
                    <p className="text-xs uppercase tracking-wide text-slate-500">Decomposition time</p>
                    <p className="mt-1 font-semibold">{item.result.estimated_decomposition_time_days} days</p>
                  </div>
                </>
              )}
            </div>
          </GlassCard>
        ))
      )}
    </div>
  );
}
