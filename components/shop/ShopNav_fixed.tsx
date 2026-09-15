"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useCartStore } from "@/store/cart.store";
import { useHydration } from "@/store/useHydration";

const CATEGORIES_LIST = [
  { id: "gaming", name: "Accesorios Gaming" },
  { id: "custom", name: "Arte y colección" },
  { id: "tcg", name: "Fundas y TCG" },
  { id: "decoracion", name: "Hogar y decoración" },
];

export default function ShopNav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const lines = useCartStore((s) => s.lines);
  const cartCount = useCartStore((s) => s.cartCount());
  const hydrated = useHydration();
  const safeCartCount = hydrated ? cartCount : 0;

  const [isMiniCartOpen, setIsMiniCartOpen] = useState(false);
  const miniCartRef = useRef<HTMLDivElement>(null);
  const cartButtonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // ... (mantén tu lógica de useEffect y flyEmote igual)

  return (
    <header className="w-full sticky top-0 z-[100] border-b border-gray-100 bg-white/95 backdrop-blur-md shadow-sm">
      <div className="mx-auto max-w-[1400px] px-6 md:px-8">
        <div className="flex h-20 items-center justify-between gap-8">
          
          {/* LEFT: Logo + Categorías */}
          <div className="flex items-center gap-6">
            <Link href="/shop" className="text-3xl font-black">
              3D<span className="text-violet-600">ISLAND</span>
            </Link>

            <div ref={menuRef} className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center gap-2 rounded-full bg-violet-600 px-5 py-2.5 text-white font-bold hover:bg-violet-700 transition-colors"
              >
                {/* REINSERCIÓN DEL ICONO */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                Categorías
              </button>

              {isMenuOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 rounded-2xl bg-white shadow-2xl ring-1 ring-black ring-opacity-5 z-[101] py-2">
                  {CATEGORIES_LIST.map((cat) => (
                    <button key={cat.id} className="block w-full px-5 py-3 text-left text-sm hover:bg-violet-50 text-gray-700 font-medium">
                      {cat.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* SEARCH: Alineación corregida */}
          <div className="flex-1 max-w-2xl">
            <div className="relative w-full flex items-center">
              <input
                type="text"
                placeholder="Busca lo que se te ocurra..."
                className="h-12 w-full rounded-full border-2 border-gray-200 bg-gray-50 px-6 pr-16 text-gray-900 focus:border-violet-600 focus:bg-white outline-none transition-all"
              />
              <button className="absolute right-1 top-1 bottom-1 flex aspect-square items-center justify-center rounded-full bg-violet-600 text-white hover:bg-violet-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </button>
            </div>
          </div>

          {/* RIGHT: Carrito con Z-index alto */}
          <div className="flex items-center gap-4">
             <Link href="/auth/login" className="font-semibold text-gray-700 hover:text-violet-600">Entrar</Link>
             <div className="relative">
              <button
                ref={cartButtonRef}
                onClick={() => setIsMiniCartOpen((v) => !v)}
                className="relative flex h-12 w-12 items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-2xl"
              >
                🛒
                {safeCartCount > 0 && (
                  <span className="absolute top-0 right-0 bg-violet-600 text-white text-[10px] h-5 w-5 flex items-center justify-center rounded-full font-bold">
                    {safeCartCount}
                  </span>
                )}
              </button>

              {/* MINI CART CON Z-INDEX ASEGURADO */}
              {isMiniCartOpen && (
                <div ref={miniCartRef} className="absolute right-0 top-16 w-80 bg-white shadow-2xl rounded-2xl ring-1 ring-black ring-opacity-5 z-[105] p-4">
                  <div className="font-bold mb-3 pb-2 border-b">Carrito</div>
                  {/* ... resto de tu lógica de renderizado de carrito ... */}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}