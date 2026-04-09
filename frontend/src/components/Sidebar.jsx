import {
  Beaker,
  BookOpen,
  Gauge,
  History,
  LayoutDashboard,
  LogOut,
  Microscope,
  ShieldCheck,
  UserCog
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

import { useAuth } from '../contexts/AuthContext';

const navItems = [
  { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
  { label: 'Enzyme Prediction', to: '/enzyme-prediction', icon: Microscope },
  { label: 'Decomposition', to: '/decomposition', icon: Gauge },
  { label: 'Enzyme Guide', to: '/guide', icon: BookOpen },
  { label: 'History', to: '/history', icon: History },
  { label: 'Edit Profile', to: '/profile', icon: UserCog },
  { label: 'Change Password', to: '/change-password', icon: ShieldCheck }
];

export default function Sidebar() {
  const { logout } = useAuth();

  return (
    <aside className="glass-panel hidden w-72 flex-col rounded-r-3xl px-4 py-6 lg:flex">
      <div className="mb-8 px-3">
        <p className="text-xs uppercase tracking-[0.35em] text-brand-500">EnzymePredict</p>
        <h1 className="mt-2 text-2xl font-bold">Scientific waste analytics</h1>
      </div>

      <nav className="space-y-2">
        {navItems.map(({ label, to, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                isActive
                  ? 'bg-brand-500 text-white shadow-lg'
                  : 'text-slate-700 hover:bg-slate-200/70 dark:text-slate-200 dark:hover:bg-slate-800'
              }`
            }
          >
            {label === 'Enzyme Prediction' ? (
              <img src="/bio_enzyme_logo.png" className="h-5 w-5 rounded-md" alt="" />
            ) : (
              <Icon className="h-4 w-4" />
            )}
            {label}
          </NavLink>
        ))}
      </nav>

      <button
        type="button"
        onClick={logout}
        className="mt-auto flex items-center gap-3 rounded-xl border border-slate-300 px-3 py-2.5 text-sm font-semibold transition hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
      >
        <LogOut className="h-4 w-4" />
        Logout
      </button>
    </aside>
  );
}
