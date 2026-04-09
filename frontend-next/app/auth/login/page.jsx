"use client";

import { motion, AnimatePresence } from "framer-motion";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FiMail, FiLock, FiChrome, FiAlertCircle, FiCheckCircle } from "react-icons/fi";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession();
      if (session) {
        router.push("/");
      }
    };
    checkSession();
  }, [router]);

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setError("");
    try {
      const result = await signIn("google", {
        callbackUrl: window.location.origin,
      });

      if (result?.error) {
        setError("Failed to sign in with Google. Please try again.");
        setGoogleLoading(false);
      }
    } catch (error) {
      console.error("Google sign-in error:", error);
      setError("An unexpected error occurred. Please try again.");
      setGoogleLoading(false);
    }
  };

  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.target);
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password. Please try again.");
      } else {
        setSuccess("Successfully signed in!");
        setTimeout(() => {
          router.push("/");
        }, 1500);
      }
    } catch (error) {
      console.error("Email sign-in error:", error);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.12),_transparent_22%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.12),_transparent_24%),linear-gradient(180deg,_#020617,_#02070f)] text-slate-100 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="glass-card w-full max-w-md rounded-3xl p-8"
      >
        <div className="text-center mb-8">
          <motion.div
            className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-cyan-300/20 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 backdrop-blur-sm"
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ duration: 0.3 }}
          >
            <span className="text-3xl">🧬</span>
          </motion.div>
          <h1 className="text-3xl font-bold gradient-text mb-2">Welcome Back</h1>
          <p className="text-slate-400">Sign in to your EnzymeAI account</p>
        </div>

        {/* Status Messages */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 flex items-center gap-3 rounded-lg bg-red-500/10 border border-red-500/20 p-4 backdrop-blur-sm"
            >
              <FiAlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
              <span className="text-red-400 text-sm">{error}</span>
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 flex items-center gap-3 rounded-lg bg-green-500/10 border border-green-500/20 p-4 backdrop-blur-sm"
            >
              <FiCheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
              <span className="text-green-400 text-sm">{success}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-6">
          {/* Google Sign In */}
          <motion.button
            onClick={handleGoogleSignIn}
            disabled={googleLoading || loading}
            className="flex w-full items-center justify-center gap-3 rounded-xl bg-white px-4 py-4 text-sm font-semibold text-slate-900 shadow-lg transition-all hover:bg-slate-50 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {googleLoading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-900 border-t-transparent"></div>
            ) : (
              <FiChrome className="h-5 w-5" />
            )}
            {googleLoading ? "Connecting..." : "Continue with Google"}
          </motion.button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-600/50" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-slate-950 px-4 text-slate-400">or continue with email</span>
            </div>
          </div>

          {/* Email Sign In Form */}
          <motion.form
            onSubmit={handleEmailSignIn}
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="w-full rounded-xl border border-slate-600/50 bg-slate-800/50 backdrop-blur-sm px-10 py-3 text-slate-100 placeholder-slate-400 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition-all"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="w-full rounded-xl border border-slate-600/50 bg-slate-800/50 backdrop-blur-sm px-10 py-3 text-slate-100 placeholder-slate-400 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition-all"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={loading || googleLoading}
              className="w-full btn-primary"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-950 border-t-transparent"></div>
                  Signing in...
                </div>
              ) : (
                "Sign In"
              )}
            </motion.button>
          </motion.form>
        </div>

        <motion.p
          className="mt-8 text-center text-sm text-slate-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Don't have an account?{" "}
          <a
            href="/auth/register"
            className="text-cyan-400 hover:text-cyan-300 transition-colors font-medium"
          >
            Create one here
          </a>
        </motion.p>
      </motion.div>
    </div>
  );
}