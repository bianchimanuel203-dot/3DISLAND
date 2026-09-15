"use client";

import { motion } from "framer-motion";

export default function AnimatedGradientBg() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      <motion.div
        className="absolute -top-1/2 left-1/2 h-[120vh] w-[120vw] -translate-x-1/2 rounded-full opacity-40 blur-[100px]"
        style={{
          background:
            "radial-gradient(circle, #7b2cbf 0%, #5a189a 35%, transparent 70%)",
        }}
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.35, 0.5, 0.35],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute right-[-20%] bottom-[-30%] h-[80vh] w-[70vw] rounded-full opacity-25 blur-[90px]"
        style={{
          background:
            "radial-gradient(circle, #c77dff 0%, #9d4edd 40%, transparent 70%)",
        }}
        animate={{ x: [0, -30, 0], y: [0, 20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <div
        className="absolute inset-0 opacity-70"
        style={{
          background:
            "linear-gradient(180deg, rgba(5, 1, 10, 0.8) 0%, transparent 35%, transparent 65%, rgba(5, 1, 10, 0.8) 100%)",
        }}
      />
    </div>
  );
}
