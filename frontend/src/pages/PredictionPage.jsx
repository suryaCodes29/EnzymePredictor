import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';

import api from '../api/client';
import ProbabilityBarChart from '../charts/ProbabilityBarChart';
import YieldLineChart from '../charts/YieldLineChart';
import EnzymeViewer from '../components/3DViewer/EnzymeViewer';
import GlassCard from '../components/GlassCard';
import LoadingSpinner from '../components/LoadingSpinner';
import WasteTypeSelector from '../components/WasteTypeSelector';

const fallbackWastes = ['rice', 'potato peel', 'banana peel', 'vegetable waste', 'fruit waste', 'meat', 'bones', 'woody biomass', 'used cooking oil'];

export default function PredictionPage() {
  const { notify } = useOutletContext();
  const [wastes, setWastes] = useState(fallbackWastes);
  const [form, setForm] = useState({ waste_types: ['rice'], custom_waste: '', quantity: 1 });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/supported-wastes').then(({ data }) => setWastes(data.wastes)).catch(() => setWastes(fallbackWastes));
  }, []);

  const buildWastePayload = () => {
    const selectedKnown = form.waste_types.filter((item) => item !== 'other');
    const customItems = form.custom_waste
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);

    return [...selectedKnown, ...customItems];
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const wastePayload = buildWastePayload();

    if (wastePayload.length === 0) {
      notify('error', 'Selection required', 'Please select or enter at least one food or waste type.');
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post('/predict-enzyme', {
        waste_type: wastePayload,
        quantity: Number(form.quantity)
      });
      setResult(data);
      notify('success', 'Prediction ready', 'The enzyme suitability analysis was calculated successfully.');
    } catch (error) {
      notify('error', 'Prediction failed', error.response?.data?.message || 'Unable to run the enzyme analysis.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <GlassCard>
        <div className="mb-6">
          <h2 className="text-3xl font-extrabold bg-gradient-to-r from-cyan-400 via-brand-500 to-emerald-500 bg-clip-text text-transparent pb-1">Enzyme prediction module</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 max-w-2xl">
            Select multiple food or waste types and map their combined substrate profile to the most suitable enzymes using our advanced analytics engine.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <WasteTypeSelector
            label="Food / waste types"
            options={wastes}
            selected={form.waste_types}
            onChange={(waste_types) => setForm({ ...form, waste_types })}
            customValue={form.custom_waste}
            onCustomChange={(custom_waste) => setForm({ ...form, custom_waste })}
          />

          <div className="grid gap-4 md:grid-cols-[180px_auto] md:items-end">
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">Quantity (kg)</label>
              <input
                type="number"
                min="0.1"
                step="0.1"
                className="input-field bg-white/70 backdrop-blur-sm"
                value={form.quantity}
                onChange={(event) => setForm({ ...form, quantity: Number(event.target.value) })}
              />
            </div>

            <button type="submit" className="btn-primary md:w-fit group relative overflow-hidden transition-all hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:-translate-y-0.5" disabled={loading}>
              <span className="relative z-10 font-bold">{loading ? 'Calculating...' : 'Run analysis'}</span>
              <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-emerald-500 to-cyan-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
            </button>
          </div>
        </form>
      </GlassCard>

      {loading ? (
        <GlassCard>
          <LoadingSpinner label="Generating enzyme probability and yield curves..." />
        </GlassCard>
      ) : null}

      {result ? (
        <div className="space-y-6">
          {result.model_confidence_percent < 75 && (
            <div className="rounded-2xl border border-amber-500/50 bg-amber-500/10 p-4 shadow-[0_4px_12px_rgba(245,158,11,0.15)] backdrop-blur-md">
              <div className="flex items-start gap-3">
                <span className="text-2xl" role="img" aria-label="warning">⚠️</span>
                <div>
                  <h3 className="font-bold text-amber-700 dark:text-amber-400">Low Accuracy Warning</h3>
                  <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                    Prediction confidence is only {result.model_confidence_percent}%. Please verify the mixture composition manually before making industrial scaling decisions.
                  </p>
                </div>
              </div>
            </div>
          )}

          {result.alerts?.map((alert, idx) => (
            <div key={idx} className={`rounded-2xl border p-4 shadow-[0_4px_12px_rgba(0,0,0,0.1)] backdrop-blur-md ${
              alert.level === 'critical' ? 'border-rose-500/50 bg-rose-500/10 shadow-rose-500/20' : 'border-blue-500/50 bg-blue-500/10 shadow-blue-500/20'
            }`}>
              <div className="flex items-start gap-3">
                <span className="text-2xl" role="img" aria-label="alert">{alert.level === 'critical' ? '🚨' : '🔔'}</span>
                <div>
                  <h3 className={`font-bold ${alert.level === 'critical' ? 'text-rose-700 dark:text-rose-400' : 'text-blue-700 dark:text-blue-400'}`}>
                    {alert.title}
                  </h3>
                  <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">{alert.message}</p>
                </div>
              </div>
            </div>
          ))}

          <GlassCard>
            <h3 className="text-lg font-semibold">Selected input and matched waste group</h3>
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              {result.input_waste_types?.map((item) => (
                <span key={item} className="rounded-full bg-slate-100 px-3 py-1 dark:bg-slate-800">
                  Input: {item}
                </span>
              ))}
              {result.selected_wastes?.map((item) => (
                <span key={item} className="rounded-full bg-brand-500/10 px-3 py-1 text-brand-700 dark:text-brand-300">
                  Matched: {item}
                </span>
              ))}
            </div>
          </GlassCard>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <GlassCard>
              <p className="text-sm text-slate-500 dark:text-slate-400">Primary enzyme</p>
              <h3 className="mt-2 text-2xl font-bold">{result.primary_enzyme.name}</h3>
              <p className="mt-1 text-sm">{result.primary_enzyme.probability}% probability</p>
            </GlassCard>
            <GlassCard>
              <p className="text-sm text-slate-500 dark:text-slate-400">Optimal pH / temperature</p>
              <h3 className="mt-2 text-xl font-bold">{result.primary_enzyme.optimal_ph}</h3>
              <p className="mt-1 text-sm">{result.primary_enzyme.optimal_temperature}</p>
            </GlassCard>
            <GlassCard>
              <p className="text-sm text-slate-500 dark:text-slate-400">Production time</p>
              <h3 className="mt-2 text-2xl font-bold">{result.estimated_production_time_hours} h</h3>
              <p className="mt-1 text-sm">Realistic scale-up estimate</p>
            </GlassCard>
            <GlassCard>
              <p className="text-sm text-slate-500 dark:text-slate-400">Yield / confidence</p>
              <h3 className="mt-2 text-2xl font-bold">{result.expected_yield_u_per_g} U/g</h3>
              <p className="mt-1 text-sm">Confidence: {result.model_confidence_percent}%</p>
            </GlassCard>
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            <GlassCard>
              <h3 className="text-lg font-semibold">Enzyme probability distribution</h3>
              <ProbabilityBarChart items={result.probabilities} />
              <div className="mt-4 flex flex-wrap gap-3 text-xs">
                {result.probabilities.map((item) => (
                  <span key={item.enzyme} className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 dark:bg-slate-800">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    {item.enzyme}
                  </span>
                ))}
              </div>
              <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">
                Higher probability reflects stronger substrate-enzyme alignment in the selected waste stream.
              </p>
            </GlassCard>

            <GlassCard>
              <h3 className="text-lg font-semibold">Yield vs time</h3>
              <YieldLineChart curve={result.yield_curve} />
              <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">{result.yield_curve.explanation}</p>
              <p className="mt-2 text-sm font-medium">Predicted microbial enzyme yield: {result.total_enzyme_extracted_u.toLocaleString()} U</p>
            </GlassCard>
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            <GlassCard>
              <h3 className="text-lg font-semibold">Secondary enzymes</h3>
              <ul className="mt-4 space-y-3 text-sm">
                {result.secondary_enzymes.map((item) => (
                  <li key={item.enzyme} className="flex items-center justify-between rounded-xl bg-slate-100 px-3 py-2 dark:bg-slate-800">
                    <span>{item.enzyme}</span>
                    <span className="font-semibold">{item.probability}%</span>
                  </li>
                ))}
              </ul>
            </GlassCard>

            <GlassCard>
              <h3 className="text-lg font-semibold">Scientific reasoning</h3>
              <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300">{result.scientific_reasoning}</p>
              <div className="mt-4 flex flex-wrap gap-2 text-xs">
                {result.composition_breakdown.map((item) => (
                  <span key={item.component} className="rounded-full bg-brand-500/10 px-3 py-1 text-brand-700 dark:text-brand-300">
                    {item.component}: {item.percentage}%
                  </span>
                ))}
              </div>
            </GlassCard>
          </div>

          <EnzymeViewer enzymeName={result.primary_enzyme.name} />

          <GlassCard className="!bg-brand-500/5 border-brand-500/20">
            <h4 className="text-sm font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">Structural Analysis Overview</h4>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              The 3D model above represents the predicted molecular folding of <strong>{result.primary_enzyme.name}</strong>. 
              The highlighted iridescent segments indicate the primary catalytic backbone. You can interact with the glowing <strong>Hotspots</strong> to identify specific 
              binding pockets and active sites optimized for the {result.waste_type.toLowerCase()} substrate. 
              Rotation and zoom allow for a 360° inspection of the enzyme's structural integrity and industrial suitability.
            </p>
          </GlassCard>
        </div>
      ) : null}
    </div>
  );
}
