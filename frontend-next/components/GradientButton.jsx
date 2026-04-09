"use client";

import { motion } from "framer-motion";

export default function GradientButton({ label, onClick, disabled = false, variant = "primary", size = "md" }) {
  const baseClasses = "relative overflow-hidden rounded-full font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:ring-offset-2 focus:ring-offset-slate-900";

  const variants = {
    primary: "bg-gradient-to-r from-cyan-400 via-sky-500 to-indigo-500 text-slate-950 shadow-lg shadow-cyan-500/25 hover:shadow-xl hover:shadow-cyan-500/40",
    secondary: "bg-slate-800/50 text-slate-300 border border-slate-600/50 backdrop-blur-sm hover:bg-slate-700/50 hover:border-slate-500/50",
    ghost: "bg-transparent text-cyan-400 border border-cyan-400/30 hover:bg-cyan-400/10 hover:border-cyan-400/50"
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base"
  };

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      whileHover={disabled ? {} : { scale: 1.05 }}
      whileTap={disabled ? {} : { scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      {/* Animated background gradient */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-500 opacity-0"
        whileHover={{ opacity: variant === "primary" ? 0.1 : 0 }}
        transition={{ duration: 0.3 }}
      />

      {/* Shimmer effect */}
      <motion.div
        className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
        animate={{ translateX: ["100%", "-100%"] }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatDelay: 3,
          ease: "easeInOut"
        }}
      />

      <span className="relative z-10">{label}</span>
    </motion.button>
  );
}
