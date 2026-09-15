"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";

const PARTICLE_COUNT = 48;

function seededRandom(seed: number) {
  const x = Math.sin(seed * 9999) * 10000;
  return x - Math.floor(x);
}

export default function ParticleField() {
  const particles = useMemo(
    () =>
      Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
        id: i,
        left: `${seededRandom(i) * 100}%`,
        top: `${seededRandom(i + 50) * 100}%`,
        size: 1 + seededRandom(i + 100) * 2.5,
        delay: seededRandom(i + 150) * 4,
        duration: 6 + seededRandom(i + 200) * 8,
      })),
    []
  );

  return (
    <div 
      className="pointer-events-none absolute inset-0 overflow-hidden" 
      aria-hidden
      suppressHydrationWarning
    >
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-full bg-[var(--violet-glow)]"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            boxShadow: `0 0 ${p.size * 4}px var(--violet-mid)`,
          }}
          animate={{
            y: [0, -30 - p.size * 8, 0],
            opacity: [0.15, 0.7, 0.15],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          suppressHydrationWarning
        />
      ))}
    </div>
  );
}