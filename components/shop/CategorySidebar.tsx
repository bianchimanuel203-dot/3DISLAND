"use client";

import type { ShopCategoryId } from "@/lib/shop/products";
import { SHOP_CATEGORIES } from "@/lib/shop/products";
import GlassPanel from "@/components/ui/GlassPanel";

type CategorySidebarProps = {
  active: ShopCategoryId;
  onSelect: (id: ShopCategoryId) => void;
  counts: Record<ShopCategoryId, number>;
};

export default function CategorySidebar({
  active,
  onSelect,
  counts,
}: CategorySidebarProps) {
  return (
    <aside className="hidden w-56 shrink-0 lg:block xl:w-64">
      <GlassPanel strong className="sticky top-28 !p-5">
        <p className="mb-4 font-mono text-[0.65rem] tracking-[0.4em] text-[var(--violet-mid)] uppercase">
          Categorías
        </p>
        <nav className="flex flex-col gap-1" aria-label="Categorías de producto">
          {SHOP_CATEGORIES.map((cat) => {
            const isActive = active === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelect(cat.id)}
                className={`rounded-xl px-3 py-2.5 text-left transition-[background,box-shadow,border-color] ${
                  isActive
                    ? "border border-[var(--violet-mid)]/40 bg-[var(--violet-deep)]/30 shadow-[0_0_20px_rgba(123,44,191,0.2)]"
                    : "border border-transparent hover:border-[var(--glass-border)] hover:bg-white/5"
                }`}
              >
                <span className="flex items-center justify-between gap-2">
                  <span
                    className={`font-display text-sm tracking-wide ${
                      isActive ? "text-[var(--violet-glow)]" : "text-white/85"
                    }`}
                  >
                    {cat.label}
                  </span>
                  <span className="font-mono text-[0.65rem] text-white/35">
                    {counts[cat.id]}
                  </span>
                </span>
                <span className="mt-0.5 block text-xs text-white/40">{cat.description}</span>
              </button>
            );
          })}
        </nav>
      </GlassPanel>
    </aside>
  );
}
