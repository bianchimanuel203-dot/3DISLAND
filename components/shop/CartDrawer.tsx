"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { ShopProduct } from "@/lib/shop/products";
import { formatPrice } from "@/lib/shop/products";
import UnsplashPhoto from "@/components/ui/UnsplashPhoto";

export type CartLine = {
  product: ShopProduct;
  quantity: number;
};

type CartDrawerProps = {
  open: boolean;
  onClose: () => void;
  lines: CartLine[];
  onRemove: (productId: string) => void;
  onClear: () => void;
};

export default function CartDrawer({
  open,
  onClose,
  lines,
  onRemove,
  onClear,
}: CartDrawerProps) {
  const total = lines.reduce(
    (sum, line) => sum + line.product.price * line.quantity,
    0
  );

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.button
            type="button"
            className="fixed inset-0 z-[60] bg-black/30 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-label="Cerrar carrito"
          />

          {/* Drawer */}
          <motion.aside
            className="fixed top-0 right-0 z-[70] flex h-full w-full max-w-md flex-col border-l border-[#E9E4F5] bg-[#F8F8FC] p-6 shadow-[-20px_0_60px_rgba(139,92,246,0.08)]"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            role="dialog"
            aria-labelledby="cart-drawer-title"
          >
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
              <h2
                id="cart-drawer-title"
                className="font-display text-lg font-bold tracking-wide text-[#24183A]"
              >
                Tu carga
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-[#DDD6F3] px-3 py-1.5 font-mono text-xs tracking-widest text-[#6E6785] uppercase transition-colors hover:border-violet-400 hover:text-violet-600"
              >
                Cerrar
              </button>
            </div>

            {/* Empty state */}
            {lines.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border border-[#E9E4F5] bg-white text-center p-8">
                <p className="text-4xl opacity-60" aria-hidden>
                  🌑
                </p>
                <p className="mt-4 text-sm text-[#6E6785]">
                  {"El vacío aún no guarda artefactos. Explora el catálogo."}
                </p>
              </div>
            ) : (
              <>
                {/* Lines */}
                <ul className="flex-1 space-y-3 overflow-y-auto pr-1">
                  {lines.map((line) => (
                    <li key={line.product.id}>
                      <div className="flex gap-4 rounded-2xl border border-[#E9E4F5] bg-white p-4 shadow-sm">
                        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl flex items-center justify-center">
                          <UnsplashPhoto
                            section="product"
                            alt={line.product.name}
                            className="h-full w-full object-cover"
                            fallback={<span className="text-3xl" aria-hidden>{line.product.glyph}</span>}
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-display text-sm font-semibold tracking-wide text-[#24183A]">
                            {line.product.name}
                          </p>
                          <p className="font-mono text-xs text-violet-500">
                            {line.quantity} × {formatPrice(line.product.price)}
                          </p>
                          <button
                            type="button"
                            onClick={() => onRemove(line.product.id)}
                            className="mt-2 font-mono text-[0.65rem] tracking-widest text-[#9D97B3] uppercase transition-colors hover:text-violet-600"
                          >
                            Quitar
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

                {/* Footer */}
                <div className="mt-6 border-t border-[#E9E4F5] pt-6">
                  <div className="mb-4 flex justify-between text-sm">
                    <span className="text-[#6E6785]">Total estimado</span>
                    <span className="font-bold text-violet-600">
                      {formatPrice(total)}
                    </span>
                  </div>
                  <button
                    type="button"
                    className="w-full rounded-full bg-violet-600 py-3 font-mono text-[0.75rem] tracking-[0.2em] text-white uppercase transition-all hover:bg-violet-500 hover:shadow-[0_10px_25px_rgba(139,92,246,0.25)] disabled:cursor-not-allowed disabled:opacity-50"
                    disabled
                    title="Checkout próximamente"
                  >
                    Finalizar ritual
                  </button>
                  <button
                    type="button"
                    onClick={onClear}
                    className="mt-3 w-full font-mono text-[0.65rem] tracking-widest text-[#9D97B3] uppercase transition-colors hover:text-[#6E6785]"
                  >
                    Vaciar carrito
                  </button>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}