"use client";

import type { ShopCategoryId } from "@/lib/shop/products";
import { SHOP_CATEGORIES } from "@/lib/shop/products";

type MobileCategoryChipsProps = {
  active: ShopCategoryId;
  onSelect: (id: ShopCategoryId) => void;
};

export default function MobileCategoryChips({
  active,
  onSelect,
}: MobileCategoryChipsProps) {
  return (
    <div className="lg:hidden">
      <div
        className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        role="tablist"
        aria-label="Categorías"
      >
        {SHOP_CATEGORIES.map((cat) => {
          const isActive = active === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onSelect(cat.id)}
              className={`shrink-0 rounded-full border px-4 py-2 font-mono text-[0.65rem] tracking-widest uppercase transition-[border-color,box-shadow,background] ${
                isActive
                  ? "border-[var(--violet-mid)]/50 bg-[var(--violet-deep)]/35 text-[var(--violet-glow)] shadow-[0_0_16px_rgba(157,78,221,0.3)]"
                  : "border-[var(--glass-border)] bg-[rgba(8,4,16,0.5)] text-white/55"
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
