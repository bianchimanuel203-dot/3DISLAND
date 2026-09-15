"use client";

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  className?: string;
};

export default function SearchBar({ value, onChange, className = "" }: SearchBarProps) {
  return (
    <label
      className={`group relative flex min-w-0 flex-1 items-center ${className}`}
    >
      <span className="sr-only">Buscar productos</span>
      <svg
        className="pointer-events-none absolute left-4 h-4 w-4 text-[var(--violet-mid)] transition-colors group-focus-within:text-[var(--violet-glow)]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden
      >
        <circle cx="11" cy="11" r="7" />
        <path d="M20 20L16 16" strokeLinecap="round" />
      </svg>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Buscar en la forja..."
        className="w-full rounded-xl border border-[var(--glass-border)] bg-[rgba(8,4,16,0.65)] py-2.5 pr-4 pl-11 font-sans text-sm text-white placeholder:text-white/35 backdrop-blur-md transition-[border-color,box-shadow] outline-none focus:border-[var(--violet-mid)]/50 focus:shadow-[0_0_24px_rgba(123,44,191,0.25)]"
      />
    </label>
  );
}
