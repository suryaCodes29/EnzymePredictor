import { Check, PlusCircle } from 'lucide-react';

function formatLabel(value) {
  return value
    .split(' ')
    .map((item) => item.charAt(0).toUpperCase() + item.slice(1))
    .join(' ');
}

export default function WasteTypeSelector({
  label,
  options,
  selected,
  onChange,
  customValue,
  onCustomChange
}) {
  const toggleValue = (value) => {
    const exists = selected.includes(value);
    onChange(exists ? selected.filter((item) => item !== value) : [...selected, value]);
  };

  const isOtherSelected = selected.includes('other');
  const chosenItems = selected.filter((item) => item !== 'other');

  return (
    <div className="space-y-3">
      <div>
        <label className="mb-1 block text-sm font-medium">{label}</label>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Select one or more food or waste types. Choose <strong>Other</strong> to enter your own custom type.
        </p>
      </div>

      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
        {options.map((option) => {
          const active = selected.includes(option);
          return (
            <button
              key={option}
              type="button"
              onClick={() => toggleValue(option)}
              className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-left text-sm transition ${
                active
                  ? 'border-brand-500 bg-brand-500 text-white'
                  : 'border-slate-300 bg-white/70 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-950/40 dark:hover:bg-slate-800'
              }`}
            >
              {active ? <Check className="h-4 w-4" /> : <PlusCircle className="h-4 w-4" />}
              <span>{formatLabel(option)}</span>
            </button>
          );
        })}

        <button
          type="button"
          onClick={() => toggleValue('other')}
          className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-left text-sm transition ${
            isOtherSelected
              ? 'border-brand-500 bg-brand-500 text-white'
              : 'border-dashed border-slate-300 bg-white/70 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-950/40 dark:hover:bg-slate-800'
          }`}
        >
          {isOtherSelected ? <Check className="h-4 w-4" /> : <PlusCircle className="h-4 w-4" />}
          <span>Other food / waste type</span>
        </button>
      </div>

      {chosenItems.length > 0 ? (
        <div className="flex flex-wrap gap-2 text-xs">
          {chosenItems.map((item) => (
            <span key={item} className="rounded-full bg-brand-500/10 px-3 py-1 text-brand-700 dark:text-brand-300">
              {formatLabel(item)}
            </span>
          ))}
        </div>
      ) : null}

      {isOtherSelected ? (
        <div>
          <input
            className="input-field"
            value={customValue}
            onChange={(event) => onCustomChange(event.target.value)}
            placeholder="Enter custom food or waste types, e.g. apple peel, bread waste, fish scraps"
          />
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Use commas to add multiple custom entries.</p>
        </div>
      ) : null}
    </div>
  );
}
