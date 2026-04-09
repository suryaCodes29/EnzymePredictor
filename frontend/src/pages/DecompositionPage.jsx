import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';

import api from '../api/client';
import DecompositionChart from '../charts/DecompositionChart';
import GlassCard from '../components/GlassCard';
import LoadingSpinner from '../components/LoadingSpinner';
import WasteTypeSelector from '../components/WasteTypeSelector';

const fallbackWastes = ['rice', 'potato peel', 'banana peel', 'vegetable waste', 'fruit waste', 'meat', 'bones', 'woody biomass', 'used cooking oil'];

export default function DecompositionPage() {
  const { notify } = useOutletContext();
  const [wastes, setWastes] = useState(fallbackWastes);
  const [form, setForm] = useState({ waste_types: ['banana peel'], custom_waste: '', quantity: 1 });
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
      const { data } = await api.post('/predict-decomposition', {
        waste_type: wastePayload,
        quantity: Number(form.quantity)
      });
      setResult(data);
      notify('success', 'Decomposition ready', 'The waste breakdown comparison was generated successfully.');
    } catch (error) {
      notify('error', 'Analysis failed', error.response?.data?.message || 'Unable to compute decomposition time.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <GlassCard>
        <h2 className="text-2xl font-bold">Food decomposition module</h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Compare decomposition efficiency over time for one or more food and waste types, including custom entries.
        </p>

        <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
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
              <label className="mb-1 block text-sm font-medium">Quantity (kg)</label>
              <input
                type="number"
                min="0.1"
                step="0.1"
                className="input-field"
                value={form.quantity}
                onChange={(event) => setForm({ ...form, quantity: Number(event.target.value) })}
              />
            </div>

            <button type="submit" className="btn-primary md:w-fit" disabled={loading}>
              {loading ? 'Calculating...' : 'Compare enzymes'}
            </button>
          </div>
        </form>
      </GlassCard>

      {loading ? (
        <GlassCard>
          <LoadingSpinner label="Calculating decomposition efficiency curves..." />
        </GlassCard>
      ) : null}

      {result ? (
        <div className="space-y-6">
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

          <div className="grid gap-4 md:grid-cols-3">
            <GlassCard>
              <p className="text-sm text-slate-500 dark:text-slate-400">Estimated decomposition time</p>
              <h3 className="mt-2 text-3xl font-bold">{result.estimated_decomposition_time_days} days</h3>
            </GlassCard>
            <GlassCard>
              <p className="text-sm text-slate-500 dark:text-slate-400">Fastest enzyme</p>
              <h3 className="mt-2 text-3xl font-bold">{result.fastest_enzyme}</h3>
            </GlassCard>
            <GlassCard>
              <p className="text-sm text-slate-500 dark:text-slate-400">Quantity analysed</p>
              <h3 className="mt-2 text-3xl font-bold">{result.quantity_kg} kg</h3>
            </GlassCard>
          </div>

          <GlassCard>
            <h3 className="text-lg font-semibold">Decomposition efficiency comparison</h3>
            <DecompositionChart chart={result.decomposition_chart} />
            <div className="mt-4 flex flex-wrap gap-3 text-xs">
              {result.enzyme_probabilities.map((item) => (
                <span key={item.enzyme} className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 dark:bg-slate-800">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  {item.enzyme}
                </span>
              ))}
            </div>
            <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">{result.decomposition_chart.explanation}</p>
          </GlassCard>

          <GlassCard>
            <h3 className="text-lg font-semibold">Scientific reasoning</h3>
            <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300">{result.scientific_reasoning}</p>
          </GlassCard>
        </div>
      ) : null}
    </div>
  );
}
