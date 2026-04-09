import { OrbitControls, PerspectiveCamera, Stage, Stars } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { AnimatePresence, motion } from 'framer-motion';
import { Info, Maximize, RotateCcw, Zap } from 'lucide-react';
import { Suspense, useState } from 'react';

import GlassCard from '../GlassCard';
import LoadingSpinner from '../LoadingSpinner';
import ProteinModel from './ProteinModel';

export default function EnzymeViewer({ enzymeName = "Enzyme" }) {
  const [selected, setSelected] = useState(null);
  const [autoRotate, setAutoRotate] = useState(true);
  const [cameraKey, setCameraKey] = useState(0);

  const resetView = () => {
    setCameraKey((prev) => prev + 1);
    setAutoRotate(true);
    setSelected(null);
  };

  return (
    <div className="relative h-[600px] w-full overflow-hidden rounded-[24px] border border-white/40 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 shadow-2xl transition-all duration-500 hover:shadow-indigo-500/20">
      
      {/* 3D Canvas */}
      <Canvas shadows dpr={[1, 2]}>
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <Suspense fallback={null}>
          <Stage environment="city" intensity={0.6} contactShadow={false}>
            <ProteinModel 
              autoRotate={autoRotate} 
              onSelect={setSelected} 
              selectedId={selected?.id} 
            />
          </Stage>
        </Suspense>
        
        <PerspectiveCamera key={cameraKey} makeDefault position={[3, 3, 3]} fov={50} />
        <OrbitControls makeDefault enableDamping dampingFactor={0.05} autoRotate={false} />
      </Canvas>

      {/* Floating UI Overlay - Header */}
      <div className="absolute left-6 top-6 z-10 pointer-events-none">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h2 className="text-3xl font-black tracking-tighter text-white drop-shadow-lg flex items-center gap-3">
             <div className="h-8 w-8 rounded-xl bg-pastel-blue/20 backdrop-blur-md border border-white/30 flex items-center justify-center">
                <Zap className="h-4 w-4 text-cyan-400 fill-cyan-400" />
             </div>
             3D {enzymeName} Structure
          </h2>
          <p className="mt-1 text-sm font-medium text-slate-400">BioEngine v2.5 Interactive Visualizer</p>
        </motion.div>
      </div>

      {/* Glassmorphic Tooltip Panel */}
      <AnimatePresence>
        {selected && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="absolute right-6 top-6 z-10 w-72"
          >
            <GlassCard className="!bg-white/10 !border-white/20 !backdrop-blur-xl border border-white/30 shadow-2xl">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full" style={{ backgroundColor: selected.color }} />
                  {selected.name}
                </h4>
                <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-white transition-colors">✕</button>
              </div>
              <p className="mt-2 text-sm text-slate-300 leading-relaxed font-medium">
                {selected.description}
              </p>
              <div className="mt-4 flex items-center gap-2 rounded-xl bg-white/5 p-3 border border-white/10">
                <Info className="h-4 w-4 text-pastel-blue" />
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest leading-none">Functional Region</p>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Control Dock */}
      <div className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 rounded-3xl border border-white/20 bg-white/10 p-2 backdrop-blur-2xl shadow-2xl flex items-center gap-2">
        <button 
          onClick={resetView}
          className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 text-white transition hover:bg-white/20 hover:scale-105 active:scale-95"
          title="Reset Camera"
        >
          <RotateCcw className="h-5 w-5" />
        </button>
        <div className="h-6 w-px bg-white/10" />
        <button 
          onClick={() => setAutoRotate(!autoRotate)}
          className={`flex items-center gap-3 rounded-2xl px-5 py-2.5 text-sm font-bold transition-all duration-300 ${autoRotate ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30' : 'bg-white/5 text-slate-300 hover:bg-white/10'}`}
        >
          <div className={`h-2 w-2 rounded-full ${autoRotate ? 'animate-pulse bg-white' : 'bg-slate-500'}`} />
          {autoRotate ? 'Rotation Active' : 'Auto-Rotate'}
        </button>
        <button 
          className="flex items-center gap-3 rounded-2xl px-5 py-2.5 text-sm font-bold text-slate-300 bg-white/5 transition hover:bg-white/10 hover:text-white"
          onClick={() => setSelected({ id: 'active-site', name: 'Active Site', color: '#F472B6', description: 'Catalytic region where substrate binding occurs.' })}
        >
          <Maximize className="h-4 w-4" />
          Focus Active Site
        </button>
      </div>

      {/* Loading State Overlay */}
      <Suspense fallback={
        <div className="absolute inset-0 flex items-center justify-center bg-slate-950/80 backdrop-blur-md">
          <LoadingSpinner label="Compiling 3D Engine and Protein Structures..." />
        </div>
      }>
        <div className="hidden">Loading...</div>
      </Suspense>
    </div>
  );
}
