import type { ReactNode } from "react";

type GlassPanelProps = {
  children: ReactNode;
  className?: string;
  strong?: boolean;
};

export default function GlassPanel({
  children,
  className = "",
  strong = false,
}: GlassPanelProps) {
  return (
    <div
      className={`rounded-2xl p-6 sm:p-8 ${strong ? "glass-panel-strong" : "glass-panel"} ${className}`}
    >
      {children}
    </div>
  );
}
