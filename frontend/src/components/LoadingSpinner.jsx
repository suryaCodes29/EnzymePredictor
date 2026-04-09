import { LoaderCircle } from 'lucide-react';

export default function LoadingSpinner({ label = 'Loading...' }) {
  return (
    <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
      <LoaderCircle className="h-5 w-5 animate-spin text-brand-500" />
      <span>{label}</span>
    </div>
  );
}
