export default function VignetteOverlay() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-[80]"
      aria-hidden
      style={{
        background:
          "radial-gradient(ellipse at center, transparent 35%, rgba(3,1,8,0.72) 100%)",
        boxShadow: "inset 0 0 120px rgba(0,0,0,0.6)",
      }}
    />
  );
}
