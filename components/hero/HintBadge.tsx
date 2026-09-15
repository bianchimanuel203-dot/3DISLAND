"use client";

import { AnimatePresence, motion } from "framer-motion";

export type HintState = "idle" | "hover" | "dragging";

const HINT_TEXTS: Record<HintState, string> = {
  idle: "DESLIZA HACIA ABAJO PARA INICIAR LA AVENTURA",
  hover: "HAZ CLIC PARA ENTRAR AL VAULT",
  dragging: "SUELTA PARA CONTINUAR",
};

type HintBadgeProps = {
  state: HintState;
};

export default function HintBadge({ state }: HintBadgeProps) {
  const text = HINT_TEXTS[state];

  return (
    <div className="absolute bottom-[8vh] left-0 right-0 flex justify-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={state}
          className="pointer-events-none flex items-center gap-2 rounded-full border border-purple-500/40 bg-black/60 px-4 py-2 font-mono text-[10px] tracking-widest text-purple-300 uppercase shadow-[0_0_12px_2px_rgba(168,85,247,0.25)] backdrop-blur-sm"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.35 }}
          aria-live="polite"
        >
          <span className="animate-pulse text-purple-400" aria-hidden>
            ◆
          </span>
          {text}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}