"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useCartStore } from "@/store/cart.store";
import { useSidecartStore } from "@/store/sidecart.store";
import { useHydration } from "@/store/useHydration";
import { formatPrice } from "@/lib/shop/products";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import UnsplashPhoto from "@/components/ui/UnsplashPhoto";

export default function Sidecart() {
  const { isOpen, close } = useSidecartStore();
  const lines = useCartStore((s) => s.lines);
  const removeFromCart = useCartStore((s) => s.removeFromCart);
  const cartTotal = useCartStore((s) => s.cartTotal());
  const hydrated = useHydration();
  const router = useRouter();
  const { data: session } = useSession();

  const safeLines = hydrated ? lines : [];
  const safeTotal = hydrated ? cartTotal : 0;
  const itemCount = safeLines.reduce((sum, l) => sum + l.quantity, 0);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [close]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const handleCheckout = () => {
    close();
    if (session?.user) {
      router.push("/checkout");
    } else {
      router.push("/auth/login?callbackUrl=/checkout");
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={close}
      />

      {/* Panel */}
      <div
        className={`fixed right-0 top-0 z-50 h-full w-full max-w-sm bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-base font-bold text-gray-900">Tu cesta</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {itemCount} {itemCount === 1 ? "artículo" : "artículos"}
            </p>
          </div>
          <button
            type="button"
            onClick={close}
            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-100 transition text-gray-500 text-lg"
          >
            ✕
          </button>
        </div>

        {/* Contenido */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {safeLines.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-4">
              <span className="text-6xl">🛒</span>
              <p className="font-bold text-gray-900 text-lg">Tu cesta está vacía</p>
              <p className="text-sm text-gray-400">Añade productos para continuar</p>
              <button
                type="button"
                onClick={close}
                className="mt-2 rounded-full bg-gray-900 hover:bg-gray-700 px-6 py-2.5 text-sm font-semibold text-white transition"
              >
                Seguir comprando
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {safeLines.map((line) => (
                <div key={line.product.id} className="flex gap-3 items-start pb-4 border-b border-gray-50 last:border-0">
                  {/* Imagen */}
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-50 border border-gray-100">
                    <UnsplashPhoto
                      section="product"
                      alt={line.product.name}
                      className="h-full w-full object-cover"
                      fallback={<span className="text-3xl">{line.product.glyph}</span>}
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 line-clamp-2 leading-snug">
                      {line.product.name}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5 capitalize">{line.product.category}</p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs text-gray-500">{line.quantity} ×</span>
                        <span className="text-sm font-bold text-gray-900">
                          {formatPrice(line.product.price)}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFromCart(line.product.id)}
                        className="text-xs text-gray-400 hover:text-red-500 transition"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {safeLines.length > 0 && (
          <div className="border-t border-gray-100 px-5 py-4 flex flex-col gap-3 bg-gray-50">
            {/* Trust signal */}
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="text-green-500 font-bold">✓</span>
              Envío gratis · Fabricado en Canarias
            </div>

            {/* Subtotal */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Subtotal ({itemCount} artículos)</span>
              <span className="text-lg font-bold text-gray-900">{formatPrice(safeTotal)}</span>
            </div>

            <p className="text-xs text-gray-400">IVA incluido · Envío calculado al pagar</p>

            {/* CTAs estilo Etsy */}
            <button
              type="button"
              onClick={handleCheckout}
              className="w-full rounded-full bg-gray-900 hover:bg-gray-700 py-3 text-sm font-bold text-white transition active:scale-95"
            >
              {session?.user ? "Finalizar compra →" : "Entrar para comprar →"}
            </button>

            <Link
              href="/cart"
              onClick={close}
              className="w-full rounded-full border-2 border-gray-900 hover:bg-gray-50 py-2.5 text-sm font-semibold text-gray-900 text-center transition"
            >
              Ver cesta completa
            </Link>

            {/* Payment icons */}
            <div className="flex items-center justify-center gap-2 pt-1">
              {["Visa", "MC", "PayPal", "Stripe"].map(p => (
                <span key={p} className="text-[0.6rem] font-bold text-gray-400 border border-gray-200 rounded px-1.5 py-0.5">
                  {p}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}