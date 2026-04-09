"use client";

import { motion, AnimatePresence } from "framer-motion";
import { FiPlay, FiPause, FiCheckCircle, FiAlertTriangle, FiTrendingUp, FiTarget, FiZap } from "react-icons/fi";

const statusConfig = {
  idle: {
    color: "text-slate-400",
    bgColor: "bg-slate-500/10",
    borderColor: "border-slate-500/20",
    icon: FiPause,
    label: "Ready to predict"
  },
  processing: {
    color: "text-cyan-400",
    bgColor: "bg-cyan-500/10",
    borderColor: "border-cyan-500/20",
    icon: FiPlay,
    label: "Analyzing data"
  },
  completed: {
    color: "text-green-400",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/20",
    icon: FiCheckCircle,
    label: "Prediction complete"
  },
  error: {
    color: "text-red-400",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/20",
    icon: FiAlertTriangle,
    label: "Prediction failed"
  }
};

export default function PredictionPanel({ status, progress, result }) {
  const currentStatus = statusConfig[status] || statusConfig.idle;
  const StatusIcon = currentStatus.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="glass-card rounded-3xl p-8"
    >
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold gradient-text">AI Prediction Engine</h2>
            <p className="text-slate-400 mt-1">
              Advanced enzyme classification and analysis powered by machine learning
            </p>
          </div>

          <motion.div
            className={`flex items-center gap-3 rounded-full px-4 py-2 ${currentStatus.bgColor} ${currentStatus.borderColor} border backdrop-blur-sm`}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <StatusIcon className={`h-4 w-4 ${currentStatus.color}`} />
            <span className={`text-sm font-medium ${currentStatus.color}`}>
              {currentStatus.label}
            </span>
          </motion.div>
        </div>

        {/* Progress Section */}
        <AnimatePresence>
          {status === 'processing' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-slate-300">Analysis Progress</span>
                <span className="text-sm text-cyan-400 font-semibold">{progress}%</span>
              </div>

              <div className="relative h-3 overflow-hidden rounded-full bg-slate-800/50 backdrop-blur-sm">
                <motion.div
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
                <motion.div
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400/50 via-blue-400/50 to-purple-400/50 blur-sm"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
                />
              </div>

              <div className="mt-3 flex justify-between text-xs text-slate-500">
                <span>Initializing AI model</span>
                <span>Generating predictions</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Results Section */}
      <AnimatePresence>
        {result && status === 'completed' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Main Result Card */}
            <motion.div
              className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 p-6 backdrop-blur-sm"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full blur-3xl"></div>

              <div className="relative flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20">
                  <FiCheckCircle className="h-8 w-8 text-green-400" />
                </div>

                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-1">Prediction Complete</h3>
                  <p className="text-slate-400 text-sm">
                    Enzyme analysis finished successfully
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Metrics Grid */}
            <div className="grid gap-4 md:grid-cols-3">
              <motion.div
                className="glass-card rounded-2xl p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-cyan-500/20 to-blue-500/20">
                    <FiTarget className="h-5 w-5 text-cyan-400" />
                  </div>
                  <span className="text-sm font-medium text-slate-400">Predicted Enzyme</span>
                </div>
                <p className="text-2xl font-bold text-white">{result.enzymeType}</p>
                <p className="text-xs text-slate-500 mt-1">Primary classification</p>
              </motion.div>

              <motion.div
                className="glass-card rounded-2xl p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-green-500/20 to-emerald-500/20">
                    <FiTrendingUp className="h-5 w-5 text-green-400" />
                  </div>
                  <span className="text-sm font-medium text-slate-400">Confidence Score</span>
                </div>
                <p className="text-2xl font-bold gradient-text">{result.confidence}</p>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-700">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-green-400 to-emerald-500"
                    initial={{ width: 0 }}
                    animate={{ width: result.confidence }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                </div>
              </motion.div>

              <motion.div
                className="glass-card rounded-2xl p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20">
                    <FiZap className="h-5 w-5 text-purple-400" />
                  </div>
                  <span className="text-sm font-medium text-slate-400">Processing Time</span>
                </div>
                <p className="text-2xl font-bold text-white">2.3s</p>
                <p className="text-xs text-slate-500 mt-1">Average response time</p>
              </motion.div>
            </div>

            {/* Summary Section */}
            <motion.div
              className="glass-card rounded-2xl p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              <h4 className="text-lg font-semibold text-white mb-3">Analysis Summary</h4>
              <p className="text-slate-300 leading-relaxed">{result.summary}</p>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs text-cyan-400 border border-cyan-500/20">
                  High Confidence
                </span>
                <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs text-green-400 border border-green-500/20">
                  Validated Model
                </span>
                <span className="rounded-full bg-purple-500/10 px-3 py-1 text-xs text-purple-400 border border-purple-500/20">
                  Real-time Analysis
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error State */}
      <AnimatePresence>
        {status === 'error' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex items-center gap-4 rounded-2xl bg-red-500/10 border border-red-500/20 p-6 backdrop-blur-sm"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/20">
              <FiAlertTriangle className="h-6 w-6 text-red-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-red-400">Prediction Failed</h3>
              <p className="text-slate-400 text-sm mt-1">
                An error occurred during analysis. Please try again or contact support.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
