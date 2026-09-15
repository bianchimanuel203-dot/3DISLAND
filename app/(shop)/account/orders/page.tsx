"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function OrdersPage() {
  const { status } = useSession();
  const router = useRouter();
  const [filter, setFilter] = useState("Todos");

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/login?callbackUrl=/account/orders");
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
          <span className="text-gray-600">Mis pedidos</span>
        </nav>

        <h1 className="mb-8 text-2xl font-black text-gray-900">Mis pedidos</h1>

        <div className="mb-6 flex flex-wrap gap-2">
          {["Todos", "En proceso", "Enviados", "Entregados", "Cancelados"].map((f) => (
            <button key={f} type="button" onClick={() => setFilter(f)}
              className={`rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
                filter === f
                  ? "bg-gray-900 text-white"
                  : "border border-gray-200 bg-white text-gray-600 hover:border-gray-400"
              }`}>
              {f}
            </button>
          ))}
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-16 text-center">
          <span className="text-6xl">🔭</span>
          <h2 className="mt-6 text-xl font-bold text-gray-900">Aún no tienes pedidos</h2>
          <p className="mt-2 max-w-sm mx-auto text-sm text-gray-400">
            Cuando realices tu primera compra aparecerá aquí con su estado en tiempo real.
          </p>
          <Link href="/shop"
            className="mt-6 inline-block rounded-full bg-gray-900 hover:bg-gray-700 px-8 py-3 text-sm font-semibold text-white transition-colors">
            Ir a la tienda
          </Link>
        </div>

        <div className="mt-6 rounded-2xl border border-amber-100 bg-amber-50 p-4">
          <p className="text-xs font-semibold text-amber-700">
            ℹ️ Los pedidos reales se mostrarán aquí cuando conectemos la base de datos con Supabase + Prisma.
          </p>
        </div>
      </div>
    </div>
  );
}