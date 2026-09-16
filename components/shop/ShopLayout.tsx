"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SHOP_PRODUCTS, type ShopCategoryId } from "@/lib/shop/products";
import ProductGrid from "./ProductGrid";
import ShopNav from "./ShopNav";
import ShopFooter from "./ShopFooter";
import { useShopAnimations } from "./useShopAnimations";
import { useCartStore } from "@/store/cart.store";
import { useHydration } from "@/store/useHydration";

type SortOption = "relevance" | "price-asc" | "price-desc" | "newest";

function normalizeQuery(q: string): string {
  return q.trim().toLowerCase();
}

const SLIDES = [
  {
    id: 1,
    bg: "bg-gray-900",
    textColor: "text-white",
    subtitleColor: "text-gray-300",
    title: "Fabricado en Canarias",
    subtitle: "Cada pieza, hecha a mano en Fuerteventura",
    cta: "Ver catálogo",
    href: "/shop",
    emoji: "🖨️",
  },
  {
    id: 2,
    bg: "bg-gray-800",
    textColor: "text-white",
    subtitleColor: "text-gray-300",
    title: "Gaming & TCG",
    subtitle: "Soportes, displays y accesorios para tu setup",
    cta: "Ver Gaming",
    href: "/shop?category=gaming",
    emoji: "🎮",
  },
  {
    id: 3,
    bg: "bg-gray-900",
    textColor: "text-white",
    subtitleColor: "text-gray-300",
    title: "Custom Canarias",
    subtitle: "Tu diseño impreso en 3D. Sin moldes, sin mínimos.",
    cta: "Solicitar pieza",
    href: "/custom-request",
    emoji: "🏝️",
  },
];

const OFERTAS = SHOP_PRODUCTS.filter((p) => p.featured).slice(0, 6);

function HeroBanner({ onNavigate }: { onNavigate: (href: string) => void }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setCurrent((c) => (c + 1) % SLIDES.length), 4000);
    return () => clearInterval(t);
  }, []);

  const slide = SLIDES[current];

  return (
    <div className={`relative overflow-hidden ${slide.bg} transition-all duration-700`} style={{ height: "200px" }}>
      <div className="mx-auto max-w-[1400px] px-8 h-full flex items-center justify-between">
        <div className="flex flex-col gap-2 max-w-lg">
          <p className="text-gray-400 text-xs font-medium uppercase tracking-widest">3D Island</p>
          <h2 className="text-2xl md:text-3xl font-black text-white leading-tight">
            {slide.title}
          </h2>
          <p className={`text-sm ${slide.subtitleColor}`}>{slide.subtitle}</p>
          <button
            type="button"
            onClick={() => onNavigate(slide.href)}
            className="self-start mt-1 rounded-full bg-white hover:bg-gray-100 px-6 py-2 text-sm font-bold text-gray-900 transition active:scale-95"
          >
            {slide.cta} →
          </button>
        </div>
        <div className="hidden md:block text-[6rem] select-none opacity-80">
          {slide.emoji}
        </div>
      </div>

      <button
        type="button"
        onClick={() => setCurrent((c) => (c - 1 + SLIDES.length) % SLIDES.length)}
        className="absolute left-3 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white/20 hover:bg-white/40 text-white transition"
      >
        ‹
      </button>
      <button
        type="button"
        onClick={() => setCurrent((c) => (c + 1) % SLIDES.length)}
        className="absolute right-3 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white/20 hover:bg-white/40 text-white transition"
      >
        ›
      </button>

      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setCurrent(i)}
            className={`h-1 rounded-full transition-all ${i === current ? "w-5 bg-white" : "w-1.5 bg-white/40"}`}
          />
        ))}
      </div>
    </div>
  );
}

function TrustBar() {
  return (
    <div className="bg-white border-b border-gray-100">
      <div className="mx-auto max-w-[1400px] px-4 py-2.5 flex flex-wrap items-center justify-center gap-6 text-xs text-gray-500">
        <span className="flex items-center gap-1.5">
          🖨️ <span className="font-semibold text-gray-700">Fabricado a mano</span> en Fuerteventura
        </span>
        <span className="flex items-center gap-1.5">
          🔒 <span className="font-semibold text-gray-700">Pago seguro</span> con Stripe
        </span>
        <span className="flex items-center gap-1.5">
          ↩️ <span className="font-semibold text-gray-700">Devolución</span> en 14 días
        </span>
        <span className="flex items-center gap-1.5">
          ♻️ <span className="font-semibold text-gray-700">Sin stock muerto</span>
        </span>
      </div>
    </div>
  );
}

export default function ShopLayout() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mainRef = useRef<HTMLElement>(null);

  const [category, setCategory] = useState<ShopCategoryId>(
    (searchParams.get("category") as ShopCategoryId) ?? "all"
  );
  const [search, setSearch] = useState(searchParams.get("q") ?? "");
  const [sort, setSort] = useState<SortOption>("relevance");

  const addToCart = useCartStore((s) => s.addToCart);
  const rawCartCount = useCartStore((s) => s.cartCount());
  const hydrated = useHydration();

  useShopAnimations(mainRef);

  useEffect(() => {
    const cat = searchParams.get("category") as ShopCategoryId;
    const q = searchParams.get("q") ?? "";
    if (cat && cat !== category) setCategory(cat);
    if (q !== search) setSearch(q);
  }, [searchParams]);

  const categoryCounts = useMemo(() => {
    const counts: Record<ShopCategoryId, number> = {
      all: SHOP_PRODUCTS.length, gaming: 0, tcg: 0, custom: 0, accesorios: 0,
    };
    for (const p of SHOP_PRODUCTS) counts[p.category] += 1;
    return counts;
  }, []);

  const filteredProducts = useMemo(() => {
    const q = normalizeQuery(search);
    let products = SHOP_PRODUCTS.filter((p) => {
      const matchCat = category === "all" || p.category === category;
      if (!matchCat) return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    });
    if (sort === "price-asc") products = [...products].sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") products = [...products].sort((a, b) => b.price - a.price);
    else if (sort === "newest") products = [...products].reverse();
    return products;
  }, [category, search, sort]);

  const handleCategoryChange = (cat: ShopCategoryId) => {
    setCategory(cat);
    const params = new URLSearchParams();
    if (cat !== "all") params.set("category", cat);
    if (search) params.set("q", search);
    router.push(`/shop${params.toString() ? `?${params}` : ""}`);
  };

  const handleSearchChange = (q: string) => {
    setSearch(q);
    const params = new URLSearchParams();
    if (category !== "all") params.set("category", category);
    if (q) params.set("q", q);
    router.push(`/shop${params.toString() ? `?${params}` : ""}`);
  };

  const categoryTitle: Record<ShopCategoryId, string> = {
    all: "Todo el catálogo",
    gaming: "Gaming & Docks",
    tcg: "TCG & Displays",
    custom: "Custom Canarias",
    accesorios: "Accesorios",
  };

  const isHome = category === "all" && !search;

  return (
    <div className="min-h-screen bg-[#F8F8F8] flex flex-col">
      <ShopNav
        search={search}
        onSearchChange={handleSearchChange}
        cartCount={hydrated ? rawCartCount : 0}
        onCartOpen={() => router.push("/cart")}
        category={category}
        onCategoryChange={handleCategoryChange}
        categoryCounts={categoryCounts}
      />

      {isHome && <HeroBanner onNavigate={router.push} />}
      <TrustBar />

      <div className="flex-1">
        <div className="mx-auto max-w-[1400px] px-4 py-4">

          {/* Destacados de hoy */}
          {isHome && OFERTAS.length > 0 && (
            <div className="mb-6 bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-bold text-gray-900">Destacados de hoy</h2>
                <button
                  type="button"
                  onClick={() => router.push("/shop")}
                  className="text-xs text-gray-500 hover:text-gray-800 font-medium transition-colors"
                >
                  Ver todos →
                </button>
              </div>
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
                {OFERTAS.map((product) => (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => router.push(`/shop/product/${product.id}`)}
                    className="group flex flex-col bg-white overflow-hidden hover:shadow-md transition rounded-xl border border-gray-100 text-left"
                  >
                    <div className="relative flex items-center justify-center bg-gray-50 h-28 overflow-hidden rounded-t-xl">
                      <img
                        src={product.image}
                        alt={product.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-110"
                      />
                    </div>
                    <div className="p-2.5">
                      <p className="text-xs text-gray-700 line-clamp-1 font-medium">{product.name}</p>
                      <p className="text-sm font-bold text-gray-900 mt-0.5">{product.price.toFixed(2)} €</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Cabecera catálogo */}
          <div className="flex items-center justify-between mb-4 px-1">
            <div className="flex items-center gap-3">
              <h1 className="text-sm font-bold text-gray-900">
                {categoryTitle[category]}
              </h1>
              <span className="text-xs text-gray-400">
                {filteredProducts.length} productos
                {search && <span> · "<span className="text-gray-600">{search}</span>"</span>}
              </span>
            </div>
            <div className="flex items-center gap-3">
              {/* Ordenar */}
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortOption)}
                className="text-xs border border-gray-200 rounded-full px-3 py-1.5 bg-white text-gray-700 outline-none hover:border-gray-400 transition cursor-pointer"
              >
                <option value="relevance">Relevancia</option>
                <option value="price-asc">Precio: menor a mayor</option>
                <option value="price-desc">Precio: mayor a menor</option>
                <option value="newest">Más recientes</option>
              </select>
              {(search || category !== "all") && (
                <button
                  type="button"
                  onClick={() => { setSearch(""); setCategory("all"); router.push("/shop"); }}
                  className="text-xs text-gray-500 hover:text-gray-900 underline transition-colors"
                >
                  Limpiar filtros
                </button>
              )}
            </div>
          </div>

          <main ref={mainRef}>
            <ProductGrid products={filteredProducts} onAddToCart={addToCart} />
          </main>
        </div>
      </div>

      <ShopFooter />
    </div>
  );
}