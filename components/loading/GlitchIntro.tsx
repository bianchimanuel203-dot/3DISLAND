"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";

type GlitchIntroProps = {
  onComplete: () => void;
  durationMs?: number;
};

export default function GlitchIntro({
  onComplete,
  durationMs = 1400,
}: GlitchIntroProps) {
  useEffect(() => {
    const t = setTimeout(onComplete, durationMs);
    return () => clearTimeout(t);
  }, [durationMs, onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[190] overflow-hidden bg-black"
      initial={{ opacity: 1 }}
      animate={{ opacity: [1, 1, 0] }}
      transition={{ duration: durationMs / 1000, times: [0, 0.7, 1] }}
    >
      <div
        className="glitch-layer absolute inset-0 font-display text-[clamp(3rem,14vw,6rem)] font-black tracking-[0.25em] text-[var(--violet-glow)]"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textShadow: "4px 0 #7b2cbf, -4px 0 #c77dff",
        }}
      >
        3D ISLAND
      </div>
      <div
        className="absolute inset-0 font-display text-[clamp(3rem,14vw,6rem)] font-black tracking-[0.25em] text-white mix-blend-difference"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          animation: "glitch-shift 0.2s steps(3) infinite reverse",
        }}
      >
        3D ISLAND
      </div>
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(123,44,191,0.15) 2px, rgba(123,44,191,0.15) 4px)",
        }}
      />
    </motion.div>
  );
}
