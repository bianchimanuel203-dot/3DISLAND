"use client";

export default function HeroImmersiveOverlay() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-[15] flex flex-col items-center justify-start px-6 pt-[10vh] text-center sm:pt-[12vh]"
      aria-hidden={false}
    >
      <h1 className="neon-violet m-0 font-display text-[clamp(2.5rem,12vw,5.5rem)] font-black tracking-[0.2em] text-[#E9D5FF] drop-shadow-[0_0_24px_rgba(168,85,247,0.55)]">
        3D ISLAND
      </h1>
      <p className="neon-subtle mt-4 max-w-lg font-mono text-[clamp(0.65rem,2.2vw,0.85rem)] tracking-[0.35em] text-[#E9D5FF] uppercase drop-shadow-[0_0_16px_rgba(168,85,247,0.45)]">
        HAZ CLICK EN LA IMPRESORA PARA ENTRAR
      </p>
    </div>
  );
}
