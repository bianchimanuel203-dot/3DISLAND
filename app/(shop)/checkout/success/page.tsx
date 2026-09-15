"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useCartStore } from "@/store/cart.store";

export default function CheckoutSuccessPage() {
  const clearCart = useCartStore((s) => s.clearCart);

  // Vacía el carrito al llegar aquí
  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="min-h-screen bg-[#F8F8FC] flex items-center justify-center px-6">
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{ background: "radial-gradient(circle at top, rgba(168,85,247,0.06), transparent 45%)" }}
      />

      <div className="relative z-10 w-full max-w-md text-center">
        <div className="rounded-3xl border border-[#E9E4F5] bg-white p-10 shadow-sm">

          {/* Icono éxito */}
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-emerald-600" viewBox="0 0 24 24" fill="currentColor">
              <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
            </svg>
          </div>

          <h1 className="text-2xl font-black text-[#24183A]">
            ¡Pedido confirmado!
          </h1>
          <p className="mt-3 text-sm text-gray-500">
            Gracias por tu compra. Recibirás un email de confirmación en breve. Tu artefacto está siendo preparado en Canarias.
          </p>

          {/* Info pedido */}
          <div className="mt-6 rounded-2xl bg-violet-50 p-4 text-left">
            <div className="flex items-center gap-2 text-sm text-violet-700">
              <span>📦</span>
              <span className="font-semibold">Fabricación en 24-48h</span>
            </div>
            <div className="mt-2 flex items-center gap-2 text-sm text-violet-700">
              <span>🚚</span>
              <span className="font-semibold">Envío gratis a Canarias</span>
            </div>
            <div className="mt-2 flex items-center gap-2 text-sm text-violet-700">
              <span>📧</span>
              <span className="font-semibold">Confirmación por email</span>
            </div>
          </div>

          {/* Acciones */}
          <div className="mt-6 space-y-3">
            <Link
              href="/shop"
              className="block w-full rounded-full bg-violet-600 py-3 text-sm font-bold text-white transition-colors hover:bg-violet-700"
            >
              Seguir comprando
            </Link>
            <Link
              href="/"
              className="block w-full rounded-full border border-gray-200 py-3 text-sm font-semibold text-gray-600 transition-colors hover:border-violet-300 hover:text-violet-600"
            >
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}