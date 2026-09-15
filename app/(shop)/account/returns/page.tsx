"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect } from "react";

export default function ReturnsPage() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/login?callbackUrl=/account/returns");
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8F8F8]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-900 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F8F8]">
      <div className="mx-auto max-w-[1400px] px-6 pb-24 pt-10 md:px-8">
        <nav className="mb-6 flex items-center gap-2 text-xs text-gray-400">
          <Link href="/shop" className="hover:text-gray-700 transition-colors">Tienda</Link>
          <span>/</span>
          <Link href="/account" className="hover:text-gray-700 transition-colors">Mi cuenta</Link>
          <span>/</span>
          <span className="text-gray-600">Devoluciones</span>
        </nav>

        <h1 className="mb-8 text-2xl font-black text-gray-900">Devoluciones</h1>

        <div className="rounded-2xl border border-gray-100 bg-white p-16 text-center">
          <span className="text-6xl">↩️</span>
          <h2 className="mt-6 text-xl font-bold text-gray-900">No tienes devoluciones activas</h2>
          <p className="mt-2 max-w-sm mx-auto text-sm text-gray-400">
            Tienes 30 días desde la recepción para solicitar una devolución.
          </p>
          <Link href="/shop"
            className="mt-6 inline-block rounded-full bg-gray-900 hover:bg-gray-700 px-8 py-3 text-sm font-semibold text-white transition-colors">
            Volver a la tienda
          </Link>
        </div>

        <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-6">
          <h2 className="mb-4 font-bold text-gray-900">Política de devoluciones</h2>
          <div className="space-y-3 text-sm text-gray-600">
            {[
              ["🕐", "30 días para devolver desde la recepción"],
              ["📦", "El producto debe estar en su estado original"],
              ["🚚", "Recogida gratuita en Canarias"],
              ["💳", "Reembolso en 3-5 días laborables"],
              ["🎨", "Productos personalizados no tienen devolución"],
            ].map(([icon, text]) => (
              <div key={text} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                <span className="text-lg">{icon}</span>
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}