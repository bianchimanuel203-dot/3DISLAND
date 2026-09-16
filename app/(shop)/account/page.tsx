"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";

export default function AccountPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/login?callbackUrl=/account");
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8F8F8]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-900 border-t-transparent" />
      </div>
    );
  }

  if (!session?.user) return null;
  const user = session.user;

  return (
    <div className="min-h-screen bg-[#F8F8F8]">
      <div className="mx-auto max-w-[1400px] px-6 pb-24 pt-10 md:px-8">

        <nav className="mb-6 flex items-center gap-2 text-xs text-gray-400">
          <Link href="/shop" className="hover:text-gray-700 transition-colors">Tienda</Link>
          <span>/</span>
          <span className="text-gray-600">Mi cuenta</span>
        </nav>

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            {user.image ? (
              <Image src={user.image} alt={user.name ?? ""} className="h-16 w-16 rounded-full object-cover shadow-sm" width={64} height={64} />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-900 text-2xl font-bold text-white shadow-sm">
                {user.name?.charAt(0).toUpperCase() ?? "U"}
              </div>
            )}
            <div>
              <h1 className="text-2xl font-black text-gray-900">Hola, {user.name?.split(" ")[0] ?? "Usuario"} 👋</h1>
              <p className="text-sm text-gray-400">{user.email}</p>
            </div>
          </div>
          <button type="button" onClick={() => signOut({ callbackUrl: "/shop" })}
            className="flex items-center gap-2 rounded-full border border-red-200 px-4 py-2 text-sm font-medium text-red-500 transition-colors hover:bg-red-50">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
            </svg>
            Cerrar sesión
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { href: "/account/orders", emoji: "📦", title: "Mis pedidos", desc: "Consulta el estado de tus pedidos y su historial completo", bg: "bg-gray-50" },
            { href: "/account/returns", emoji: "↩️", title: "Devoluciones", desc: "Gestiona devoluciones y cambios de tus compras", bg: "bg-orange-50" },
            { href: "/favorites", emoji: "❤️", title: "Favoritos", desc: "Productos guardados que te interesan", bg: "bg-pink-50" },
            { href: "/account/security", emoji: "🔒", title: "Seguridad", desc: "Gestiona tu cuenta y preferencias de privacidad", bg: "bg-green-50" },
          ].map((item) => (
            <Link key={item.href} href={item.href}
              className="group flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white p-6 transition-all hover:border-gray-300 hover:shadow-md">
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${item.bg} text-2xl`}>
                {item.emoji}
              </div>
              <div>
                <h2 className="font-bold text-gray-900 group-hover:text-gray-600">{item.title}</h2>
                <p className="mt-1 text-xs text-gray-400">{item.desc}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-6">
          <h2 className="mb-4 font-bold text-gray-900">Información de cuenta</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {[
              { label: "Nombre", value: user.name ?? "—" },
              { label: "Email", value: user.email ?? "—" },
              { label: "Método de acceso", value: "Google" },
              { label: "Estado", value: "✓ Activo" },
            ].map((item) => (
              <div key={item.label}>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">{item.label}</p>
                <p className="mt-1 text-sm font-medium text-gray-900">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900">Pedidos recientes</h2>
            <Link href="/account/orders" className="text-xs text-gray-500 hover:text-gray-900 transition-colors">Ver todos</Link>
          </div>
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <span className="text-4xl">🔭</span>
            <p className="mt-3 font-semibold text-gray-900">Aún no tienes pedidos</p>
            <p className="mt-1 text-sm text-gray-400">Cuando realices tu primera compra aparecerá aquí</p>
            <Link href="/shop"
              className="mt-4 rounded-full bg-gray-900 hover:bg-gray-700 px-6 py-2.5 text-sm font-semibold text-white transition-colors">
              Explorar tienda
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}