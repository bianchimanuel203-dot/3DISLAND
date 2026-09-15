"use client";

type CartButtonProps = {
  count: number;
  onClick: () => void;
};

export default function CartButton({ count, onClick }: CartButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[var(--glass-border)] bg-[rgba(8,4,16,0.72)] backdrop-blur-md transition-[border-color,box-shadow,transform] hover:-translate-y-0.5 hover:border-[var(--violet-mid)]/45 hover:shadow-[0_0_28px_rgba(157,78,221,0.35)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--violet-glow)]"
      aria-label={`Carrito, ${count} artículos`}
    >
      <svg
        className="h-5 w-5 text-[var(--violet-glow)] transition-transform group-hover:scale-110"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        aria-hidden
      >
        <path
          d="M6 6h15l-1.5 9H8L6 6Z"
          strokeLinejoin="round"
        />
        <path d="M6 6L5 3H2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="9" cy="20" r="1.25" fill="currentColor" />
        <circle cx="18" cy="20" r="1.25" fill="currentColor" />
      </svg>
      {count > 0 && (
        <span className="absolute -top-1.5 -right-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--violet-deep)] px-1 font-mono text-[0.65rem] font-bold text-white shadow-[0_0_12px_rgba(199,125,255,0.6)]">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </button>
  );
}
