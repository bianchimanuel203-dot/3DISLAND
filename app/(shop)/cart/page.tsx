"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useCartStore } from "@/store/cart.store";
import { useHydration } from "@/store/useHydration";
import { formatPrice, SHOP_PRODUCTS, type ShopCategoryId } from "@/lib/shop/products";
import ShopNav from "@/components/shop/ShopNav";
import ShopFooter from "@/components/shop/ShopFooter";
import { useState, useMemo } from "react";

export default function CartPage() {
  const router = useRouter();
  const hydrated = useHydration();
  const { data: session } = useSession();

  const lines = useCartStore((s) => s.lines);
  const removeFromCart = useCartStore((s) => s.removeFromCart);
  const clearCart = useCartStore((s) => s.clearCart);
  const cartTotal = useCartStore((s) => s.cartTotal());

  const safeLines = hydrated ? lines : [];
  const safeTotal = hydrated ? cartTotal : 0;
  const itemCount = safeLines.reduce((sum, l) => sum + l.quantity, 0);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<ShopCategoryId>("all");

  const categoryCounts = useMemo(() => {
    const counts: Record<ShopCategoryId, number> = {
      all: SHOP_PRODUCTS.length, gaming: 0, tcg: 0, custom: 0, accesorios: 0,
    };
    for (const p of SHOP_PRODUCTS) counts[p.category] += 1;
    return counts;
  }, []);

  const rawCartCount = useCartStore((s) => s.cartCount());
  const cartCount = hydrated ? rawCartCount : 0;

  const handleCheckout = () => {
    if (session?.user) {
      router.push("/checkout");
    } else {
      router.push("/auth/login?callbackUrl=/checkout");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F8F8] flex flex-col">
      <ShopNav
        search={search}
        onSearchChange={(v) => { setSearch(v); router.push(`/shop?q=${v}`); }}
        cartCount={cartCount}
        onCartOpen={() => {}}
        category={category}
        onCategoryChange={(cat) => { setCategory(cat); router.push("/shop"); }}
        categoryCounts={categoryCounts}
      />

      <div className="flex-1 mx-auto max-w-[1400px] w-full px-6 pb-24 pt-8 md:px-8">
        <div className="mb-6">
          <Link href="/shop" className="mb-3 flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Seguir comprando
          </Link>
          <h1 className="text-2xl font-black text-gray-900">Tu cesta</h1>
          {safeLines.length > 0 && (
            <p className="mt-1 text-sm text-gray-500">
              {itemCount} {itemCount === 1 ? "artículo" : "artículos"}
            </p>
          )}
        </div>

        {safeLines.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-100 bg-white py-24 text-center">
            <span className="text-6xl">🛒</span>
            <h2 className="mt-6 text-xl font-bold text-gray-900">Tu cesta está vacía</h2>
            <p className="mt-2 text-sm text-gray-500">Explora el catálogo y añade productos</p>
            <Link href="/shop"
              className="mt-8 rounded-full bg-gray-900 hover:bg-gray-700 px-8 py-3 text-sm font-semibold text-white transition">
              Ir a la tienda
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Items */}
            <div className="lg:col-span-2">
              <div className="space-y-3">
                {safeLines.map((line) => (
                  <div key={line.product.id}
                    className="flex gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-xl bg-gray-50 text-4xl border border-gray-100">
                      {line.product.glyph}
                    </div>
                    <div className="flex flex-1 flex-col justify-between">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-semibold text-gray-900">{line.product.name}</h3>
                          <p className="mt-0.5 text-xs text-gray-500 line-clamp-2">{line.product.description}</p>
                          <span className="mt-1.5 inline-block rounded-full bg-green-50 px-2 py-0.5 text-[0.65rem] font-medium text-green-600">
                            Envío GRATIS
                          </span>
                        </div>
                        <span className="shrink-0 text-base font-bold text-gray-900">
                          {formatPrice(line.product.price * line.quantity)}
                        </span>
                      </div>
                      <div className="mt-3 flex items-center gap-4">
                        <div className="flex items-center gap-2 rounded-full border border-gray-200 px-3 py-1">
                          <span className="text-xs text-gray-500">
                            {line.quantity} × {formatPrice(line.product.price)}
                          </span>
                        </div>
                        <button type="button" onClick={() => removeFromCart(line.product.id)}
                          className="text-xs text-gray-400 underline-offset-2 hover:text-red-500 hover:underline transition-colors">
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button type="button" onClick={clearCart}
                className="mt-4 text-sm text-gray-400 underline-offset-2 hover:text-red-500 hover:underline transition-colors">
                Vaciar cesta
              </button>
            </div>

            {/* Resumen */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">

                {/* Métodos de pago */}
                <div className="mb-5">
                  <p className="mb-3 text-sm font-semibold text-gray-900">Forma de pago</p>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: "VISA", color: "text-blue-700" },
                      { label: "MC", color: "text-red-500" },
                      { label: "AMEX", color: "text-blue-500" },
                      { label: "PayPal", color: "text-blue-600" },
                      { label: "GPay", color: "text-gray-700" },
                      { label: "Klarna", color: "text-pink-500" },
                    ].map((method) => (
                      <div key={method.label}
                        className="flex items-center justify-center rounded-lg border border-gray-100 py-2 text-xs font-bold hover:border-gray-300 transition-colors">
                        <span className={method.color}>{method.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Totales */}
                <div className="space-y-3 border-t border-gray-100 pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="font-medium text-gray-900">{formatPrice(safeTotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Envío</span>
                    <span className="font-medium text-green-600">GRATIS</span>
                  </div>
                  <div className="flex justify-between border-t border-gray-100 pt-3 text-base font-bold">
                    <span className="text-gray-900">Total ({itemCount} {itemCount === 1 ? "artículo" : "artículos"})</span>
                    <span className="text-gray-900">{formatPrice(safeTotal)}</span>
                  </div>
                </div>

                {/* Trust badge */}
                <div className="mt-4 flex items-center gap-2 rounded-xl bg-gray-50 p-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0 text-green-600" viewBox="0 0 24 24" fill="currentColor">
                    <path fillRule="evenodd" d="M12.516 2.17a.75.75 0 00-1.032 0 11.209 11.209 0 01-7.877 3.08.75.75 0 00-.722.515A12.74 12.74 0 002.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 00.374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 00-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08z" clipRule="evenodd" />
                  </svg>
                  <span className="text-xs text-gray-500">Tu compra está cubierta con la protección de compras de 3D Island</span>
                </div>

                {/* CTA principal — negro estilo Etsy */}
                <button type="button" onClick={handleCheckout}
                  className="mt-5 w-full rounded-full bg-gray-900 hover:bg-gray-700 py-3.5 text-sm font-bold text-white transition active:scale-95">
                  {session?.user ? "Finalizar compra →" : "Entrar para comprar →"}
                </button>

                {/* Código descuento */}
                <button type="button"
                  className="mt-3 flex w-full items-center gap-2 rounded-xl border border-gray-100 hover:border-gray-300 p-3 text-left transition">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 14.25l6-6m4.5-3.493V21.75l-3.75-1.5-3.75 1.5-3.75-1.5-3.75 1.5V4.757c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0c1.1.128 1.907 1.077 1.907 2.185z" />
                  </svg>
                  <span className="text-xs font-medium text-gray-600">Aplicar código de descuento</span>
                </button>

                <label className="mt-3 flex cursor-pointer items-center gap-2">
                  <input type="checkbox" className="h-4 w-4 accent-gray-900 rounded" />
                  <span className="text-xs text-gray-500">Marcar el pedido como regalo</span>
                </label>
              </div>
            </div>
          </div>
        )}
      </div>

      <ShopFooter />
    </div>
  );
}