"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

interface Particle {
  id: number;
  x: number;
  y: number;
  life: number;
}

export default function TubesCursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 20, stiffness: 300, mass: 0.3 };
  const springX = useSpring(cursorX, springConfig);
  const springY = useSpring(cursorY, springConfig);

  const trailSpringConfig = { damping: 40, stiffness: 150, mass: 0.8 };
  const trailSpringX = useSpring(cursorX, trailSpringConfig);
  const trailSpringY = useSpring(cursorY, trailSpringConfig);

  const [clicking, setClicking] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const particleId = useRef(0);
  const lastPos = useRef({ x: -100, y: -100 });

  useEffect(() => {
    const move = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);

      // Crear partícula solo si el ratón se movió suficiente
      const dx = e.clientX - lastPos.current.x;
      const dy = e.clientY - lastPos.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist > 8) {
        lastPos.current = { x: e.clientX, y: e.clientY };
        const newParticle: Particle = {
          id: particleId.current++,
          x: e.clientX,
          y: e.clientY,
          life: 1,
        };
        setParticles(prev => [...prev.slice(-12), newParticle]);
      }

      const el = e.target as HTMLElement;
      setHovering(!!el.closest("a, button, [role='button'], input, textarea, select"));
    };

    const down = () => setClicking(true);
    const up = () => setClicking(false);

    window.addEventListener("mousemove", move);
    window.addEventListener("mousedown", down);
    window.addEventListener("mouseup", up);

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mousedown", down);
      window.removeEventListener("mouseup", up);
    };
  }, [cursorX, cursorY]);

  // Limpiar partículas viejas
  useEffect(() => {
    const interval = setInterval(() => {
      setParticles(prev => prev.filter(p => p.life > 0).map(p => ({ ...p, life: p.life - 0.08 })));
    }, 30);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <style>{`* { cursor: none !important; }`}</style>

      {/* Partículas de estela */}
      {particles.map((p, i) => (
        <motion.div
          key={p.id}
          className="fixed top-0 left-0 pointer-events-none z-[99998] rounded-full"
          style={{
            x: p.x - 3,
            y: p.y - 3,
            width: 6 + (1 - p.life) * 4,
            height: 6 + (1 - p.life) * 4,
            opacity: p.life * 0.6,
            backgroundColor: `hsl(${270 + i * 5}, 70%, 70%)`,
            filter: `blur(${(1 - p.life) * 3}px)`,
            transform: `translate(-50%, -50%) scale(${p.life})`,
          }}
          initial={{ scale: 1 }}
          animate={{ scale: 0 }}
          transition={{ duration: 0.4 }}
        />
      ))}

      {/* Trail exterior */}
      <motion.div
        className="fixed top-0 left-0 z-[99998] pointer-events-none"
        style={{
          x: trailSpringX,
          y: trailSpringY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      >
        <motion.div
          className="rounded-full border border-[#9B7DD4]"
          animate={{
            width: hovering ? 48 : clicking ? 18 : 32,
            height: hovering ? 48 : clicking ? 18 : 32,
            opacity: hovering ? 0.9 : 0.5,
            borderColor: clicking ? "rgba(196,176,232,0.8)" : "rgba(155,125,212,0.6)",
            boxShadow: hovering
              ? "0 0 15px 3px rgba(155,125,212,0.4)"
              : clicking
              ? "0 0 20px 5px rgba(155,125,212,0.6)"
              : "0 0 8px 2px rgba(155,125,212,0.2)",
          }}
          transition={{ duration: 0.15 }}
        />
      </motion.div>

      {/* Punto central */}
      <motion.div
        className="fixed top-0 left-0 z-[99999] pointer-events-none"
        style={{
          x: springX,
          y: springY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      >
        <motion.div
          className="rounded-full bg-white"
          animate={{
            width: clicking ? 4 : hovering ? 8 : 6,
            height: clicking ? 4 : hovering ? 8 : 6,
            backgroundColor: hovering ? "#9B7DD4" : "#ffffff",
            boxShadow: hovering
              ? "0 0 10px 3px rgba(155,125,212,0.8)"
              : clicking
              ? "0 0 12px 4px rgba(255,255,255,0.6)"
              : "0 0 6px 2px rgba(255,255,255,0.3)",
          }}
          transition={{ duration: 0.1 }}
        />
      </motion.div>
    </>
  );
}