"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCartStore } from "@/store/cart.store";
import { useHydration } from "@/store/useHydration";
import { formatPrice } from "@/lib/shop/products";
import UnsplashPhoto from "@/components/ui/UnsplashPhoto";

export default function CheckoutPage() {
  const router = useRouter();
  const hydrated = useHydration();
  const lines = useCartStore((s) => s.lines);
  const cartTotal = useCartStore((s) => s.cartTotal());
  const clearCart = useCartStore((s) => s.clearCart);

  const safeLines = hydrated ? lines : [];
  const safeTotal = hydrated ? cartTotal : 0;
  const itemCount = safeLines.reduce((sum, l) => sum + l.quantity, 0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (hydrated && safeLines.length === 0) router.push("/cart");
  }, [hydrated, safeLines.length, router]);

  const handleCheckout = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lines: safeLines.map((l) => ({ productId: l.product.id, quantity: l.quantity })),
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Error al procesar el pago"); setLoading(false); return; }
      window.location.href = data.url;
    } catch {
      setError("Error de conexión. Inténtalo de nuevo.");
      setLoading(false);
    }
  };

  if (!hydrated || safeLines.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8F8F8]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-900 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F8F8]">
      <div className="mx-auto max-w-[900px] px-6 pb-24 pt-10 md:px-8">

        {/* Header */}
        <div className="mb-8">
          <Link href="/cart"
            className="mb-3 flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Volver al carrito
          </Link>
          <h1 className="text-3xl font-black tracking-tight text-gray-900">Finalizar pedido</h1>
          <p className="mt-1 text-sm text-gray-500">
            {itemCount} {itemCount === 1 ? "artículo" : "artículos"}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

          {/* Productos */}
          <div className="lg:col-span-2 space-y-3">
            <h2 className="font-semibold text-gray-900">Resumen del pedido</h2>
            {safeLines.map((line) => (
              <div key={line.product.id}
                className="flex gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-50 border border-gray-100">
                  <UnsplashPhoto
                    section="product"
                    alt={line.product.name}
                    className="h-full w-full object-cover"
                    fallback={<span className="text-3xl">{line.product.glyph}</span>}
                  />
                </div>
                <div className="flex flex-1 items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{line.product.name}</p>
                    <p className="text-xs text-gray-400">Cantidad: {line.quantity}</p>
                    <p className="text-xs text-green-600 font-medium">Envío gratis</p>
                  </div>
                  <p className="font-bold text-gray-900">
                    {formatPrice(line.product.price * line.quantity)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Panel pago */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <h2 className="mb-4 font-bold text-gray-900">Total</h2>

              <div className="space-y-2 border-b border-gray-100 pb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-medium text-gray-900">{formatPrice(safeTotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Envío</span>
                  <span className="font-medium text-green-600">GRATIS</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">IVA incluido</span>
                  <span className="font-medium text-gray-400">Sí</span>
                </div>
              </div>

              <div className="flex justify-between py-4 text-base font-bold">
                <span className="text-gray-900">Total</span>
                <span className="text-gray-900">{formatPrice(safeTotal)}</span>
              </div>

              {/* Métodos pago */}
              <div className="mb-4">
                <p className="mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Métodos aceptados
                </p>
                <div className="flex flex-wrap gap-2">
                  {["VISA", "MC", "AMEX", "PayPal", "GPay"].map((m) => (
                    <span key={m}
                      className="rounded-lg border border-gray-100 px-2.5 py-1 text-xs font-bold text-gray-500">
                      {m}
                    </span>
                  ))}
                </div>
              </div>

              {error && (
                <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 border border-red-100">{error}</p>
              )}

              {/* Botón — negro estilo Etsy */}
              <button type="button" onClick={handleCheckout} disabled={loading}
                className="w-full rounded-full bg-gray-900 hover:bg-gray-700 py-3.5 text-sm font-bold text-white transition-all disabled:cursor-not-allowed disabled:opacity-60 active:scale-95">
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Redirigiendo a Stripe...
                  </span>
                ) : "Pagar ahora →"}
              </button>

              {/* Seguridad */}
              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
                  <path fillRule="evenodd" d="M12.516 2.17a.75.75 0 00-1.032 0 11.209 11.209 0 01-7.877 3.08.75.75 0 00-.722.515A12.74 12.74 0 002.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 00.374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 00-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08z" clipRule="evenodd" />
                </svg>
                Pago seguro con Stripe
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}