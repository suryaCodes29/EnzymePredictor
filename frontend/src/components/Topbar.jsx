import { ChevronDown, LogOut, UserCircle2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { useAuth } from '../contexts/AuthContext';
import ThemeToggle from './ThemeToggle';

const quickLinks = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Enzyme Prediction', to: '/enzyme-prediction' },
  { label: 'Decomposition', to: '/decomposition' },
  { label: 'Enzyme Guide', to: '/guide' },
  { label: 'History', to: '/history' },
  { label: 'Edit Profile', to: '/profile' },
  { label: 'Change Password', to: '/change-password' }
];

const pageTitles = {
  '/dashboard': 'Dashboard',
  '/enzyme-prediction': 'Enzyme Prediction',
  '/decomposition': 'Decomposition Analysis',
  '/guide': 'Enzyme Guide',
  '/history': 'Prediction History',
  '/profile': 'Edit Profile',
  '/change-password': 'Change Password'
};

export default function Topbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const initials = useMemo(() => {
    if (!user?.name) return 'EP';
    return user.name
      .split(' ')
      .map((item) => item[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }, [user]);

  return (
    <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div>
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Logo" className="h-10 w-10 rounded-2xl shadow-[0_4px_12px_rgba(31,38,135,0.1)] border border-white/50 bg-white/40 backdrop-blur-sm" />
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] font-black bg-gradient-to-r from-pastel-blue to-pastel-mint bg-clip-text text-transparent">EnzymePredict</p>
            <h1 className="text-2xl font-extrabold bg-gradient-to-br from-slate-800 to-slate-500 bg-clip-text text-transparent dark:from-white dark:to-slate-400">
              {pageTitles[location.pathname] || 'EnzymePredict'}
            </h1>
          </div>
        </div>
      </div>

      <div className="relative ml-auto flex items-center gap-3">
        <ThemeToggle />

        <div className="relative">
          <button
            type="button"
            onClick={() => setOpen((prev) => prev === 'alerts' ? false : 'alerts')}
            className="glass-panel flex h-10 w-10 items-center justify-center rounded-2xl relative transition hover:bg-slate-100/50"
          >
            <span className="absolute top-2 right-2 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
            </span>
            <span className="text-lg">🔔</span>
          </button>

          {open === 'alerts' && (
            <div className="glass-card absolute right-0 top-14 z-20 w-72 p-3 shadow-[0_8px_32px_rgba(31,38,135,0.2)]">
              <h3 className="mb-2 border-b border-slate-200/80 px-2 pb-2 text-sm font-bold dark:border-slate-800">System Notifications</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                <div className="rounded-xl bg-blue-500/10 p-3 text-sm">
                  <p className="font-semibold text-blue-700 dark:text-blue-400">System Transparency</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Model v2.5 updated and running with 0ms delay. Real-time predictions nominal.</p>
                </div>
                <div className="rounded-xl p-3 text-sm transition hover:bg-slate-100 dark:hover:bg-slate-800">
                  <p className="font-semibold">Recent Processing</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Yield analysis completed smoothly 10 minutes ago.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => setOpen((prev) => prev === 'user' ? false : 'user')}
          className="glass-panel flex items-center gap-3 rounded-2xl px-3 py-2"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-500 text-sm font-bold text-white">
            {initials}
          </span>
          <div className="text-left">
            <p className="text-xs text-slate-500 dark:text-slate-400">Signed in as</p>
            <p className="text-sm font-semibold">{user?.name || 'Scientist'}</p>
          </div>
          <ChevronDown className="h-4 w-4" />
        </button>

        {open ? (
          <div className="glass-card absolute right-0 top-14 z-20 w-56 p-2">
            <div className="mb-2 border-b border-slate-200/80 px-2 pb-2 dark:border-slate-800">
              <p className="text-sm font-semibold break-all">{user?.email}</p>
            </div>
            <div className="space-y-1">
              {quickLinks.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-3 py-2 text-sm transition hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  {item.label}
                </Link>
              ))}
              <button
                type="button"
                onClick={logout}
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-rose-600 transition hover:bg-rose-500/10 dark:text-rose-300"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
}
