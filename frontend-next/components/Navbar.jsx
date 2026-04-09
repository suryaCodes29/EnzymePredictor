"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import GradientButton from "./GradientButton";

const navLinks = [
  { name: "Dashboard", href: "#dashboard", icon: "📊" },
  { name: "Upload", href: "#upload", icon: "📤" },
  { name: "Predictions", href: "#predictions", icon: "🔮" },
  { name: "Analytics", href: "#analytics", icon: "📈" },
];

export default function Navbar() {
  const { data: session, status } = useSession();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'backdrop-blur-xl bg-black/80 border-b border-white/10 shadow-2xl'
          : 'backdrop-blur-md bg-transparent'
      }`}
    >
      <div className="mx-auto max-w-7xl px-6 py-4 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div
            className="flex items-center gap-3"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="relative">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-400 to-purple-500 opacity-20 blur-lg"></div>
              <div className="relative rounded-2xl border border-cyan-300/20 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 px-4 py-2 backdrop-blur-sm">
                <span className="text-lg font-bold gradient-text">EnzymeAI</span>
              </div>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map((link, index) => (
              <motion.a
                key={link.name}
                href={link.href}
                className="group relative flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-slate-300 transition-all hover:text-white"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-base">{link.icon}</span>
                {link.name}
                <motion.div
                  className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/10 to-purple-500/10 opacity-0 transition-opacity group-hover:opacity-100"
                  layoutId={`nav-bg-${index}`}
                />
              </motion.a>
            ))}
          </nav>

          {/* User Actions */}
          <div className="flex items-center gap-4">
            {status === "loading" ? (
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent"></div>
                <span className="text-sm text-slate-400">Loading...</span>
              </div>
            ) : session ? (
              <div className="flex items-center gap-4">
                <motion.div
                  className="flex items-center gap-3 rounded-full bg-slate-800/50 px-4 py-2 backdrop-blur-sm"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 text-sm font-semibold text-white">
                    {session.user?.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  <span className="hidden text-sm font-medium text-slate-200 sm:block">
                    {session.user?.name?.split(' ')[0] || 'User'}
                  </span>
                </motion.div>
                <motion.button
                  onClick={() => signOut()}
                  className="btn-secondary hidden sm:block"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Sign out
                </motion.button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <motion.a
                  href="/auth/login"
                  className="text-sm font-medium text-slate-300 transition-colors hover:text-cyan-400"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Sign in
                </motion.a>
                <GradientButton label="Get Started" />
              </div>
            )}

            {/* Mobile Menu Button */}
            <motion.button
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                animate={isMobileMenuOpen ? "open" : "closed"}
                className="flex flex-col gap-1"
              >
                <motion.span
                  className="h-0.5 w-5 bg-white transition-colors"
                  variants={{
                    closed: { rotate: 0, y: 0 },
                    open: { rotate: 45, y: 6 },
                  }}
                />
                <motion.span
                  className="h-0.5 w-5 bg-white"
                  variants={{
                    closed: { opacity: 1 },
                    open: { opacity: 0 },
                  }}
                />
                <motion.span
                  className="h-0.5 w-5 bg-white"
                  variants={{
                    closed: { rotate: 0, y: 0 },
                    open: { rotate: -45, y: -6 },
                  }}
                />
              </motion.div>
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 overflow-hidden md:hidden"
            >
              <div className="glass-card rounded-2xl p-4">
                <nav className="space-y-2">
                  {navLinks.map((link, index) => (
                    <motion.a
                      key={link.name}
                      href={link.href}
                      className="flex items-center gap-3 rounded-lg px-3 py-3 text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <span className="text-lg">{link.icon}</span>
                      {link.name}
                    </motion.a>
                  ))}
                </nav>
                {session && (
                  <motion.button
                    onClick={() => {
                      signOut();
                      setIsMobileMenuOpen(false);
                    }}
                    className="mt-4 w-full btn-secondary"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.4 }}
                  >
                    Sign out
                  </motion.button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
