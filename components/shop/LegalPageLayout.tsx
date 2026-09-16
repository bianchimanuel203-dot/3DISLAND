import type { ReactNode } from "react";
import Link from "next/link";
import ShopFooter from "@/components/shop/ShopFooter";

export default function LegalPageLayout({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-[900px] items-center justify-between px-6 py-4">
          <Link href="/shop" className="text-lg font-black tracking-tight text-gray-900">
            3D<span className="text-gray-400">ISLAND</span>
          </Link>
          <Link href="/shop" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
            Volver a la tienda
          </Link>
        </div>
      </header>

      <main className="flex-1">
        <div className="mx-auto max-w-[900px] px-6 py-12">
          <h1 className="text-3xl font-black tracking-tight text-gray-900">{title}</h1>
          <p className="mt-2 text-sm text-gray-500">Última actualización: {updated}</p>
          <div className="prose prose-gray mt-8 max-w-none space-y-6 text-gray-700">
            {children}
          </div>
        </div>
      </main>

      <ShopFooter />
    </div>
  );
}
