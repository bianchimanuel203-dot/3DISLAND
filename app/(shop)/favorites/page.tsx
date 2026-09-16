"use client";

import Link from "next/link";
import Image from "next/image";
import { useFavoritesStore } from "@/store/favorites.store";
import { useCartStore } from "@/store/cart.store";
import { formatPrice, SHOP_PRODUCTS, type ShopCategoryId } from "@/lib/shop/products";
import ShopNav from "@/components/shop/ShopNav";
import ShopFooter from "@/components/shop/ShopFooter";
import { useState, useMemo } from "react";
import { useHydration } from "@/store/useHydration";

export default function FavoritesPage() {
  const { items, removeFavorite } = useFavoritesStore();
  const addToCart = useCartStore((s) => s.addToCart);
  const hydrated = useHydration();
  const rawCartCount = useCartStore((s) => s.cartCount());
  const cartCount = hydrated ? rawCartCount : 0;
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<ShopCategoryId>("all");

  const categoryCounts = useMemo(() => {
    const counts: Record<ShopCategoryId, number> = {
      all: SHOP_PRODUCTS.length, gaming: 0, tcg: 0, custom: 0, accesorios: 0,
    };
    for (const p of SHOP_PRODUCTS) counts[p.category] += 1;
    return counts;
  }, []);

  // Fix NaN — buscar producto completo en SHOP_PRODUCTS
  const fullProducts = items.map(item =>
    SHOP_PRODUCTS.find(p => p.id === item.id) ?? item
  );

  return (
    <div className="min-h-screen bg-[#F8F8F8] flex flex-col">
      <ShopNav
        search={search}
        onSearchChange={setSearch}
        cartCount={cartCount}
        onCartOpen={() => {}}
        category={category}
        onCategoryChange={setCategory}
        categoryCounts={categoryCounts}
      />

      <div className="flex-1 mx-auto max-w-[1400px] w-full px-6 pb-24 pt-8 md:px-8">
        <div className="mb-6">
          <Link href="/shop" className="mb-2 flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Volver a la tienda
          </Link>
          <h1 className="text-2xl font-black text-gray-900">Mis favoritos</h1>
          <p className="mt-1 text-sm text-gray-500">
            {fullProducts.length} {fullProducts.length === 1 ? "artículo" : "artículos"}
          </p>
        </div>

        {fullProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl bg-white py-24 text-center border border-gray-100">
            <span className="text-6xl">🤍</span>
            <h2 className="mt-6 text-xl font-bold text-gray-900">No tienes favoritos todavía</h2>
            <p className="mt-2 max-w-sm text-sm text-gray-500">
              Pulsa el corazón en cualquier producto para guardarlo aquí
            </p>
            <Link href="/shop"
              className="mt-8 rounded-full bg-gray-900 hover:bg-gray-700 px-8 py-3 text-sm font-semibold text-white transition">
              Explorar catálogo
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {fullProducts.map((product) => {
              return (
                <div key={product.id}
                  className="group flex flex-col bg-white rounded-2xl overflow-hidden hover:shadow-md transition border border-gray-100 hover:border-gray-200">
                  <div className="relative flex items-center justify-center bg-gray-50 h-40 overflow-hidden">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 50vw, 25vw"
                      className="object-cover transition-transform duration-200 group-hover:scale-105"
                    />
                    <button
                      type="button"
                      onClick={() => removeFavorite(product.id)}
                      className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-white shadow transition hover:bg-red-50"
                      aria-label="Quitar de favoritos"
                    >
                      <span className="text-red-400 text-sm">❤️</span>
                    </button>
                  </div>

                  <div className="flex flex-col gap-1 p-3 flex-1">
                    <Link href={`/shop/product/${product.id}`}>
                      <h3 className="text-xs font-semibold text-gray-800 line-clamp-2 leading-snug hover:text-gray-600 transition-colors">
                        {product.name}
                      </h3>
                    </Link>
                    <div className="flex items-baseline gap-1.5 mt-1">
                      <span className="text-sm font-bold text-gray-900">{formatPrice(product.price)}</span>
                    </div>
                    <span className="text-[0.65rem] text-green-600 font-medium">Envío gratis</span>
                  </div>

                  <div className="px-3 pb-3">
                    <button
                      type="button"
                      onClick={() => addToCart(product)}
                      className="w-full rounded-full bg-gray-900 hover:bg-gray-700 py-2 text-xs font-semibold text-white transition active:scale-95"
                    >
                      Añadir a la cesta
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <ShopFooter />
    </div>
  );
}