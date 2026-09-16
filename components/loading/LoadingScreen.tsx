"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { HOME_COPY } from "@/lib/homeCopy";

type LoadingScreenProps = {
  onComplete: () => void;
  durationMs?: number;
};

export default function LoadingScreen({
  onComplete,
  durationMs = 2800,
}: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const start = performance.now();
    let frame: number;

    const tick = (now: number) => {
      const elapsed = now - start;
      const pct = Math.min(100, (elapsed / durationMs) * 100);
      setProgress(pct);
      if (elapsed < durationMs) {
        frame = requestAnimationFrame(tick);
      } else {
        onComplete();
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [durationMs, onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[#030108]"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="loading-logo-3d font-display text-center">
        <p className="mb-2 text-[0.65rem] tracking-[0.5em] text-[var(--violet-mid)] uppercase sm:text-xs">
          {HOME_COPY.loading.initializing}
        </p>
        <div
          className="loading-brand-logo-wrap mx-auto flex justify-center"
          style={{ transform: "rotateX(12deg)" }}
        >
          <Image
            src="/assets/3.svg"
            alt="3D Island"
            width={360}
            height={140}
            priority
            className="loading-brand-logo h-auto w-[min(300px,78vw)] object-contain"
          />
        </div>
      </div>

      <div className="mt-14 w-[min(280px,70vw)]">
        <div className="h-px overflow-hidden rounded-full bg-white/10">
          <motion.div
            className="h-full bg-gradient-to-r from-[var(--violet-deep)] via-[var(--violet-glow)] to-[var(--violet-mid)]"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-3 text-center font-mono text-[0.65rem] tracking-widest text-white/40">
          {Math.floor(progress).toString().padStart(3, "0")}%
        </p>
      </div>
    </motion.div>
  );
}
