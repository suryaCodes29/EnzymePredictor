import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, CheckCircle2, Info } from 'lucide-react';

const styles = {
  success: {
    icon: CheckCircle2,
    ring: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
  },
  error: {
    icon: AlertCircle,
    ring: 'border-rose-500/40 bg-rose-500/10 text-rose-700 dark:text-rose-300'
  },
  info: {
    icon: Info,
    ring: 'border-sky-500/40 bg-sky-500/10 text-sky-700 dark:text-sky-300'
  }
};

export default function Notification({ toast, onClose }) {
  const state = styles[toast?.type || 'info'];
  const Icon = state.icon;

  return (
    <AnimatePresence>
      {toast ? (
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          className={`fixed right-4 top-4 z-50 flex max-w-sm items-start gap-3 rounded-2xl border px-4 py-3 shadow-glass backdrop-blur-xl ${state.ring}`}
        >
          <Icon className="mt-0.5 h-5 w-5" />
          <div className="flex-1">
            <p className="font-semibold">{toast.title}</p>
            <p className="text-sm opacity-90">{toast.message}</p>
          </div>
          <button onClick={onClose} className="text-xs font-semibold opacity-70 hover:opacity-100">
            Close
          </button>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
