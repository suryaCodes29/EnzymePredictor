"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const particles = [
  { style: "top: 10%; left: 5%; width: 240px; height: 240px; background: radial-gradient(circle, rgba(102, 126, 234, 0.15), transparent);", delay: 0 },
  { style: "top: 60%; left: 15%; width: 180px; height: 180px; background: radial-gradient(circle, rgba(240, 147, 251, 0.12), transparent);", delay: 1 },
  { style: "top: 25%; right: 8%; width: 300px; height: 300px; background: radial-gradient(circle, rgba(79, 172, 254, 0.14), transparent);", delay: 2 },
  { style: "bottom: 20%; right: 12%; width: 220px; height: 220px; background: radial-gradient(circle, rgba(245, 87, 108, 0.13), transparent);", delay: 3 },
  { style: "top: 75%; left: 70%; width: 160px; height: 160px; background: radial-gradient(circle, rgba(0, 242, 254, 0.11), transparent);", delay: 4 },
  { style: "top: 45%; left: 50%; width: 120px; height: 120px; background: radial-gradient(circle, rgba(118, 75, 162, 0.12), transparent);", delay: 5 },
];

const floatingElements = [
  { icon: "🧬", x: 10, y: 20, size: 24, delay: 0 },
  { icon: "⚗️", x: 85, y: 15, size: 20, delay: 2 },
  { icon: "🧪", x: 20, y: 80, size: 22, delay: 4 },
  { icon: "🔬", x: 90, y: 75, size: 26, delay: 1 },
  { icon: "🧫", x: 60, y: 40, size: 18, delay: 3 },
  { icon: "📊", x: 75, y: 85, size: 20, delay: 5 },
];

export default function AnimatedBackground() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      {/* Animated gradient orbs */}
      {particles.map((particle, index) => (
        <motion.div
          key={index}
          className="absolute rounded-full blur-2xl"
          style={{
            ...Object.fromEntries(particle.style.split(";").filter(Boolean).map((rule) => rule.split(":").map((item) => item.trim()))),
            opacity: 0.6,
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.4, 0.8, 0.4],
            x: mousePosition.x * (index % 2 === 0 ? 1 : -1) * 5,
            y: mousePosition.y * (index % 2 === 0 ? 1 : -1) * 5,
          }}
          transition={{
            duration: 8 + index * 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: particle.delay,
          }}
        />
      ))}

      {/* Floating scientific icons */}
      {floatingElements.map((element, index) => (
        <motion.div
          key={`icon-${index}`}
          className="absolute text-white/20 select-none"
          style={{
            left: `${element.x}%`,
            top: `${element.y}%`,
            fontSize: element.size,
          }}
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, -5, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 4 + index,
            repeat: Infinity,
            ease: "easeInOut",
            delay: element.delay,
          }}
        >
          {element.icon}
        </motion.div>
      ))}

      {/* Dynamic mesh gradient overlay */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: `
            radial-gradient(circle at ${50 + mousePosition.x}% ${50 + mousePosition.y}%, rgba(102, 126, 234, 0.1), transparent 50%),
            radial-gradient(circle at ${20 + mousePosition.x}% ${80 + mousePosition.y}%, rgba(240, 147, 251, 0.08), transparent 40%),
            radial-gradient(circle at ${80 + mousePosition.x}% ${20 + mousePosition.y}%, rgba(79, 172, 254, 0.09), transparent 45%)
          `,
          transform: `translate(${mousePosition.x * 2}px, ${mousePosition.y * 2}px)`,
          transition: 'transform 0.3s ease-out',
        }}
      />

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />

      {/* Animated light rays */}
      <motion.div
        className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-cyan-400/20 via-transparent to-transparent"
        animate={{ opacity: [0.3, 0.8, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-purple-400/20 via-transparent to-transparent"
        animate={{ opacity: [0.5, 0.2, 0.5] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
    </div>
  );
}
