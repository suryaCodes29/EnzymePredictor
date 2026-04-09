"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere } from "@react-three/drei";
import { useMemo, useRef, useState, useEffect } from "react";
import { BufferGeometry, BufferAttribute, Line, LineBasicMaterial } from "three";

function MolecularBonds({ atoms }) {
  const lineRef = useRef();

  useEffect(() => {
    if (!lineRef.current || atoms.length < 2) return;

    const points = [];
    for (let i = 0; i < atoms.length; i++) {
      points.push(...atoms[i].position);
      if (i < atoms.length - 1) {
        points.push(...atoms[i + 1].position);
      }
    }

    const geometry = new BufferGeometry();
    geometry.setAttribute("position", new BufferAttribute(new Float32Array(points), 3));
    lineRef.current.geometry = geometry;
  }, [atoms]);

  return (
    <line ref={lineRef}>
      <lineBasicMaterial color="#4ade80" linewidth={2} opacity={0.4} transparent />
    </line>
  );
}

function AdvancedProteinModel({ animationData }) {
  const groupRef = useRef();
  const atomsRef = useRef([]);
  const particlesRef = useRef([]);

  const atoms = useMemo(() => {
    const atomCount = 24;
    return Array.from({ length: atomCount }, (_, index) => {
      const angle = (index / atomCount) * Math.PI * 2;
      const radius = 0.8 + Math.sin(index * 0.5) * 0.3;
      const height = Math.cos(angle * 3) * 0.4;

      return {
        id: index,
        position: [Math.cos(angle) * radius, height, Math.sin(angle) * radius],
        radius: 0.15 + Math.random() * 0.1,
        color: `hsl(${180 + (index / atomCount) * 80}, 85%, 60%)`,
        energyLevel: Math.random() * 0.8 + 0.2,
      };
    });
  }, []);

  atomsRef.current = atoms;

  const particles = useMemo(
    () =>
      Array.from({ length: 12 }, (_, index) => ({
        position: [Math.random() * 3 - 1.5, Math.random() * 2 - 1, Math.random() * 3 - 1.5],
        velocity: [(Math.random() - 0.5) * 0.02, (Math.random() - 0.5) * 0.02, (Math.random() - 0.5) * 0.02],
        life: Math.random(),
      })),
    []
  );

  particlesRef.current = particles;

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.12;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime / 6) * 0.15;

      // Pulsing animation based on energy
      atoms.forEach((atom, idx) => {
        const pulse = Math.sin(state.clock.elapsedTime * (0.5 + idx * 0.1)) * 0.5 + 0.5;
        atomsRef.current[idx].energyLevel = 0.3 + pulse * 0.7;
      });

      // Update particles
      particlesRef.current.forEach((particle) => {
        particle.position[0] += particle.velocity[0];
        particle.position[1] += particle.velocity[1];
        particle.position[2] += particle.velocity[2];
        particle.life -= 0.015;

        if (particle.life < 0) {
          particle.life = 1;
          particle.position = [Math.random() * 3 - 1.5, Math.random() * 2 - 1, Math.random() * 3 - 1.5];
        }
      });
    }
  });

  return (
    <group ref={groupRef}>
      {/* Core structure */}
      <mesh>
        <icosahedronGeometry args={[1.2, 4]} />
        <meshStandardMaterial
          color="#0a5f7f"
          roughness={0.4}
          metalness={0.4}
          opacity={0.7}
          transparent
          wireframe={false}
        />
      </mesh>

      {/* Molecular atoms */}
      {atoms.map((atom) => (
        <mesh key={atom.id} position={atom.position}>
          <sphereGeometry args={[atom.radius * (0.8 + atomsRef.current[atom.id]?.energyLevel * 0.4 || 0.5), 32, 32]} />
          <meshStandardMaterial
            emissive={atom.color}
            color={atom.color}
            roughness={0.15}
            metalness={0.7}
            emissiveIntensity={atomsRef.current[atom.id]?.energyLevel || 0.5}
          />
        </mesh>
      ))}

      {/* Molecular bonds */}
      <MolecularBonds atoms={atoms} />

      {/* Energy particles */}
      {particlesRef.current.map((particle, idx) => (
        <mesh key={`particle-${idx}`} position={particle.position} scale={1 - particle.life * 0.5}>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshStandardMaterial
            color="#06b6d4"
            emissive="#06b6d4"
            emissiveIntensity={particle.life * 0.8}
            transparent
            opacity={particle.life}
          />
        </mesh>
      ))}
    </group>
  );
}

export default function ThreeDProtein({ liveData = null }) {
  const [animationData, setAnimationData] = useState({});

  // Update animation based on live WebSocket data
  useEffect(() => {
    if (liveData) {
      setAnimationData(liveData);
    }
  }, [liveData]);

  return (
    <div className="glass-card relative min-h-[400px] overflow-hidden rounded-3xl border border-white/10 bg-slate-950/60 p-4 shadow-2xl">
      <div className="absolute inset-x-4 top-4 z-10 rounded-2xl border border-slate-800/60 bg-gradient-to-r from-slate-950/70 to-slate-900/70 p-4 backdrop-blur-sm flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-cyan-300">Advanced 3D Protein Model</h3>
          <p className="text-xs text-slate-400 mt-1">Interactive molecular structure with real-time energy visualization</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse"></div>
          <span className="text-xs text-slate-400">Live</span>
        </div>
      </div>

      <Canvas
        camera={{ position: [0, 1.5, 4.5], fov: 50 }}
        className="h-full w-full rounded-2xl"
        style={{ background: "linear-gradient(135deg, rgba(15,23,42,0.9) 0%, rgba(30,41,59,0.9) 100%)" }}
      >
        {/* Enhanced Lighting */}
        <ambientLight intensity={0.4} />
        <pointLight intensity={1.5} position={[5, 5, 5]} color="#00d9ff" decay={2} />
        <pointLight intensity={1.2} position={[-5, -3, -5]} color="#0099cc" decay={2} />
        <pointLight intensity={0.8} position={[0, 3, 3]} color="#06b6d4" />

        {/* Directional light for depth */}
        <directionalLight position={[10, 10, 5]} intensity={0.6} color="#ffffff" />

        {/* Main protein model */}
        <AdvancedProteinModel animationData={animationData} />

        {/* Environment */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          rotateSpeed={0.8}
          zoomSpeed={1.2}
          minDistance={3}
          maxDistance={8}
        />

        {/* Performance optimization */}
        <fog attach="fog" args={["#0f172a", 5, 15]} />
      </Canvas>

      {/* Stats overlay */}
      <div className="absolute bottom-4 left-4 right-4 grid grid-cols-3 gap-2 gap-y-2 z-10">
        <div className="glass-card rounded-lg px-3 py-2 text-center">
          <div className="text-xs text-slate-400">Atoms</div>
          <div className="text-sm font-semibold text-cyan-300">24</div>
        </div>
        <div className="glass-card rounded-lg px-3 py-2 text-center">
          <div className="text-xs text-slate-400">Bonds</div>
          <div className="text-sm font-semibold text-green-400">23</div>
        </div>
        <div className="glass-card rounded-lg px-3 py-2 text-center">
          <div className="text-xs text-slate-400">Energy</div>
          <div className="text-sm font-semibold text-purple-400">95%</div>
        </div>
      </div>
    </div>
  );
}
