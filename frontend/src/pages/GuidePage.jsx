import { ChevronDown } from 'lucide-react';
import { useEffect, useState } from 'react';

import api from '../api/client';
import GlassCard from '../components/GlassCard';
import LoadingSpinner from '../components/LoadingSpinner';

export default function GuidePage() {
  const [guide, setGuide] = useState([]);
  const [active, setActive] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/guide')
      .then(({ data }) => setGuide(data.guide))
      .catch(() => setGuide([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <GlassCard>
        <LoadingSpinner label="Loading enzyme guide..." />
      </GlassCard>
    );
  }

  return (
    <div className="space-y-4">
      <GlassCard>
        <h2 className="text-2xl font-bold">Enzyme guide</h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Expand any enzyme family to review sources, materials, preparation workflow, and key industrial applications.
        </p>
      </GlassCard>

      {guide.map((enzyme, index) => {
        const isOpen = active === index;
        return (
          <GlassCard key={enzyme.name} className="p-0">
            <button
              type="button"
              onClick={() => setActive(isOpen ? -1 : index)}
              className="flex w-full items-center justify-between px-5 py-4 text-left"
            >
              <div>
                <h3 className="text-lg font-semibold">{enzyme.name}</h3>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{enzyme.description}</p>
              </div>
              <ChevronDown className={`h-5 w-5 transition ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen ? (
              <div className="grid gap-4 border-t border-slate-200/80 px-5 py-4 text-sm dark:border-slate-800 lg:grid-cols-2">
                <div>
                  <h4 className="font-semibold">Natural sources</h4>
                  <ul className="mt-2 space-y-2 text-slate-600 dark:text-slate-300">
                    {enzyme.sources.map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>

                  <h4 className="mt-4 font-semibold">Required materials</h4>
                  <ul className="mt-2 space-y-2 text-slate-600 dark:text-slate-300">
                    {enzyme.materials.map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold">Preparation process</h4>
                  <ol className="mt-2 space-y-2 text-slate-600 dark:text-slate-300">
                    {enzyme.preparation.map((step) => (
                      <li key={step}>• {step}</li>
                    ))}
                  </ol>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-xl bg-slate-100 p-3 dark:bg-slate-800">
                      <p className="text-xs uppercase tracking-wide text-slate-500">Optimal pH</p>
                      <p className="mt-1 font-semibold">{enzyme.optimal_ph}</p>
                    </div>
                    <div className="rounded-xl bg-slate-100 p-3 dark:bg-slate-800">
                      <p className="text-xs uppercase tracking-wide text-slate-500">Optimal temperature</p>
                      <p className="mt-1 font-semibold">{enzyme.optimal_temperature}</p>
                    </div>
                  </div>

                  <h4 className="mt-4 font-semibold">Industrial applications</h4>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {enzyme.applications.map((application) => (
                      <span key={application} className="rounded-full bg-brand-500/10 px-3 py-1 text-xs text-brand-700 dark:text-brand-300">
                        {application}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}
          </GlassCard>
        );
      })}
    </div>
  );
}
