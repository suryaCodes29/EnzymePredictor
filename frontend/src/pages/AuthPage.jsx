import { motion } from 'framer-motion';
import { FlaskConical, Leaf, ShieldCheck } from 'lucide-react';
import { useState } from 'react';

import { GoogleLogin } from '@react-oauth/google';

import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../contexts/AuthContext';

const initialForm = { name: '', email: '', password: '' };

export default function AuthPage({ notify }) {
  const { login, register, googleLogin, loading } = useAuth();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState(initialForm);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (mode === 'login') {
        await login({ email: form.email, password: form.password });
        notify('success', 'Welcome back', 'You are now signed in to EnzymePredict.');
      } else {
        await register(form);
        notify('success', 'Account created', 'Your scientific dashboard is ready.');
      }
    } catch (error) {
      console.error('Auth error:', error);
      const serverMessage = error.response?.data?.message;
      const fallbackMessage = error.message || 'Please review your details and try again.';
      notify('error', 'Authentication failed', serverMessage || fallbackMessage);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      await googleLogin(credentialResponse.credential);
      notify('success', 'Google sign-in successful', 'Welcome to EnzymePredict.');
    } catch (error) {
      console.error('Google login error:', error);
      notify('error', 'Google sign-in failed', 'Please try again or use standard login.');
    }
  };

  return (
    <div className="min-h-screen bg-mesh px-4 py-8 flex items-center justify-center relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-pastel-blue/40 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-pastel-pink/40 rounded-full blur-3xl" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="glass-panel mx-auto flex w-full max-w-6xl flex-col overflow-hidden shadow-2xl lg:flex-row relative z-10"
      >
        <section className="bg-white/20 p-8 lg:w-[55%] lg:p-12 flex flex-col justify-center dark:bg-slate-900/30">
          <div className="mb-6 h-14 w-14 rounded-3xl shadow-[0_8px_32px_rgba(31,38,135,0.1)] border border-white/60 bg-white/40 backdrop-blur-md flex items-center justify-center p-1">
             <img src="/logo.png" alt="Enzyme Predict" className="h-full w-full object-contain rounded-2xl" />
          </div>
          <p className="text-xs uppercase tracking-[0.35em] font-black bg-gradient-to-r from-pastel-blue via-brand-400 to-pastel-mint bg-clip-text text-transparent dark:from-brand-200 dark:to-pastel-mint">EnzymePredict</p>
          <h1 className="mt-3 text-4xl lg:text-5xl font-black bg-gradient-to-br from-slate-900 to-slate-500 bg-clip-text text-transparent dark:from-white dark:to-slate-300 leading-tight">
            Production-ready enzyme prediction.
          </h1>
          <p className="mt-4 max-w-xl text-slate-600 dark:text-slate-300 font-medium">
            Estimate microbial enzyme yield, decomposition timelines, and authentic biochemical fermentation pathways using strict substrate profiles.
          </p>

          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {[
              {
                icon: FlaskConical,
                title: 'Rule-based science',
                text: 'No random outputs.'
              },
              {
                icon: Leaf,
                title: 'Waste valorisation',
                text: 'Supports food, meat, and wood.'
              },
              {
                icon: ShieldCheck,
                title: 'Secure by design',
                text: 'JWT & SQLite history.'
              }
            ].map(({ icon: Icon, title, text }, index) => (
              <motion.div 
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 + 0.3 }}
                key={title} className="flex gap-4 p-4 glass-card bg-white/40 dark:bg-slate-800/40 hover:bg-white/60 transition-colors"
                >
                <div className="mt-1 h-10 w-10 flex-shrink-0 flex items-center justify-center rounded-xl bg-gradient-to-br from-pastel-blue to-pastel-mint shadow-[inset_0_2px_4px_rgba(255,255,255,0.6)]">
                  <Icon className="h-5 w-5 text-brand-700" />
                </div>
                <div>
                  <h2 className="font-bold text-slate-800 dark:text-slate-100">{title}</h2>
                  <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">{text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="p-8 lg:w-[45%] lg:p-12 flex flex-col justify-center bg-white/40 dark:bg-slate-900/60 backdrop-blur-xl">
          <div className="mb-8 flex rounded-2xl bg-white/50 p-1 shadow-inner dark:bg-slate-800/50">
            {['login', 'register'].map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setMode(item)}
                className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-bold capitalize transition-all duration-300 ${
                  mode === item ? 'bg-gradient-to-r from-brand-500 to-emerald-400 text-white shadow-md' : 'text-slate-600 hover:bg-white/40 dark:text-slate-300'
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {mode === 'register' && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">Full name</label>
                <input
                  className="input-field bg-white/70 backdrop-blur-sm"
                  value={form.name}
                  onChange={(event) => setForm({ ...form, name: event.target.value })}
                  placeholder="Dr. Surya Malik"
                  required
                />
              </motion.div>
            )}

            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">Email</label>
              <input
                type="email"
                className="input-field bg-white/70 backdrop-blur-sm"
                value={form.email}
                onChange={(event) => setForm({ ...form, email: event.target.value })}
                placeholder="name@example.com"
                required
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">Password</label>
              <input
                type="password"
                className="input-field bg-white/70 backdrop-blur-sm"
                value={form.password}
                onChange={(event) => setForm({ ...form, password: event.target.value })}
                placeholder="Minimum 6 characters"
                required
              />
            </div>

            <button type="submit" className="btn-primary w-full shadow-lg shadow-brand-500/30 transform hover:-translate-y-0.5 transition-all text-base py-3 rounded-xl mt-2" disabled={loading}>
              {loading ? <LoadingSpinner label={mode === 'login' ? 'Signing in...' : 'Creating account...'} /> : mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
            
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-300/50 dark:border-slate-700"></div>
              </div>
              <div className="relative flex justify-center text-xs font-medium uppercase tracking-wider">
                <span className="bg-white/80 px-4 text-slate-400 backdrop-blur-md dark:bg-slate-900 rounded-full">Or continue with</span>
              </div>
            </div>

            <div className="flex justify-center transition-transform hover:scale-[1.02]">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => notify('error', 'Google login failed', 'The popup was closed or failed.')}
                theme="outline"
                size="large"
                shape="rectangular"
                width="100%"
              />
            </div>
          </form>
        </section>
      </motion.div>
    </div>
  );
}
