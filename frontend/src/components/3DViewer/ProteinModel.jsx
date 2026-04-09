import { Float, Html, useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

const SAMPLE_HOTSPOTS = [
  { id: 'active-site', name: 'Active Site', position: [0.8, 1, 0.5], description: 'Catalytic region where substrate binding occurs.', color: '#F472B6' },
  { id: 'binding-pocket', name: 'Binding Pocket', position: [-0.5, -0.8, 1], description: 'Main pocket for lock-and-key substrate fit.', color: '#60A5FA' },
  { id: 'cofactor', name: 'Cofactor', position: [1.2, -0.3, -0.8], description: 'Non-protein chemical compound required for activity.', color: '#34D399' }
];

function Model({ url, autoRotate, onSelect, selectedId }) {
  const group = useRef();
  
  // Try to load GLB if URL is provided, otherwise we'll render the "Mathematical Enzyme"
  // For this demo, let's build a complex "Mathematical Enzyme" which looks like a folded protein chain
  const tubeGeometry = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-1, 0, 1),
      new THREE.Vector3(-0.5, 0.5, 0.5),
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0.5, -0.5, 0.8),
      new THREE.Vector3(1, 0, -1),
      new THREE.Vector3(0.5, 0.5, -0.5),
      new THREE.Vector3(-0.2, 0.8, -1),
      new THREE.Vector3(-1, 0, 1)
    ]);
    return new THREE.TubeGeometry(curve, 64, 0.15, 12, true);
  }, []);

  useFrame((state) => {
    if (autoRotate && group.current) {
      group.current.rotation.y += 0.005;
      group.current.rotation.z += 0.002;
    }
  });

  return (
    <group ref={group}>
      <mesh geometry={tubeGeometry} castShadow receiveShadow>
        <meshPhysicalMaterial 
          color="#A78BFA" 
          roughness={0.1} 
          metalness={0.8} 
          transmission={0.4} 
          thickness={1} 
          clearcoat={1}
          iridescence={0.8}
        />
      </mesh>
      
      {/* Decorative spheres representing amino acid clusters */}
      <mesh position={[0, 0, 0]} castShadow>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshStandardMaterial color="#818CF8" emissive="#4338CA" emissiveIntensity={0.5} roughness={0} />
      </mesh>
      
      {/* Clickable Hotspots */}
      {SAMPLE_HOTSPOTS.map((hotspot) => (
        <group key={hotspot.id} position={hotspot.position}>
          <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <mesh 
              onClick={(e) => {
                e.stopPropagation();
                onSelect(hotspot);
              }}
              onPointerOver={() => (document.body.style.cursor = 'pointer')}
              onPointerOut={() => (document.body.style.cursor = 'auto')}
            >
              <sphereGeometry args={[0.15, 16, 16]} />
              <meshStandardMaterial 
                color={selectedId === hotspot.id ? "#ffffff" : hotspot.color} 
                emissive={hotspot.color} 
                emissiveIntensity={selectedId === hotspot.id ? 2 : 0.8}
              />
            </mesh>
            
            {/* Label */}
            <Html distanceFactor={6} position={[0, 0.3, 0]}>
              <div className={`pointer-events-none whitespace-nowrap rounded-lg bg-black/80 px-2 py-1 text-[10px] font-bold text-white backdrop-blur-md transition-opacity duration-300 ${selectedId === hotspot.id ? 'opacity-100 scale-110' : 'opacity-40'}`}>
                {hotspot.name}
              </div>
            </Html>
          </Float>
        </group>
      ))}
    </group>
  );
}

export default Model;
