"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import ShopNav from "@/components/shop/ShopNav";
import { useCartStore } from "@/store/cart.store";
import { useHydration } from "@/store/useHydration";
import { SHOP_PRODUCTS, type ShopCategoryId } from "@/lib/shop/products";

const MOCK_ARTISTS = [
  { id: "3d-island-studio", name: "3D Island Studio", avatar: "🏝️", location: "Las Palmas, Canarias", specialty: "Gaming & TCG", rating: 4.9, reviews: 128, sales: 340, products: 12, joined: "2024", bio: "Estudio especializado en piezas premium para gaming y coleccionismo. Impresión FDM de alta resolución con acabados artesanales.", badges: ["Top Vendedor", "Envío Rápido", "Canarias"], featured: true },
  { id: "violet-forge", name: "Violet Forge", avatar: "⚡", location: "Tenerife, Canarias", specialty: "Custom & B2B", rating: 4.8, reviews: 89, sales: 210, products: 8, joined: "2024", bio: "Especialistas en piezas personalizadas para empresas, eventos y streamers. Diseño y fabricación en 48h.", badges: ["B2B", "Personalización"], featured: true },
  { id: "neon-maker", name: "Neon Maker", avatar: "🎨", location: "Gran Canaria", specialty: "Accesorios & Deco", rating: 4.7, reviews: 54, sales: 120, products: 6, joined: "2025", bio: "Creaciones únicas de decoración y accesorios con estética neón. Cada pieza es una obra de arte funcional.", badges: ["Nuevo", "Tendencia"], featured: false },
  { id: "canarias-3d", name: "Canarias 3D", avatar: "🌋", location: "Lanzarote, Canarias", specialty: "Cultura canaria", rating: 4.6, reviews: 41, sales: 95, products: 5, joined: "2025", bio: "Piezas inspiradas en la cultura y naturaleza canaria. Volcanes, flora endémica y tradición local en formato 3D.", badges: ["Local", "Cultura"], featured: false },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className={`text-sm ${star <= Math.round(rating) ? "text-amber-400" : "text-gray-200"}`}>★</span>
      ))}
    </div>
  );
}

export default function ArtistsPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [navCategory, setNavCategory] = useState<ShopCategoryId>("all");
  const [sortBy, setSortBy] = useState<"rating" | "sales" | "new">("rating");
  const [filterSearch, setFilterSearch] = useState("");

  const rawCartCount = useCartStore((s) => s.cartCount());
  const hydrated = useHydration();
  const safeCartCount = hydrated ? rawCartCount : 0;

  const categoryCounts = useMemo(() => {
    const counts: Record<ShopCategoryId, number> = { all: SHOP_PRODUCTS.length, gaming: 0, tcg: 0, custom: 0, accesorios: 0 };
    for (const p of SHOP_PRODUCTS) counts[p.category] += 1;
    return counts;
  }, []);

  const sortedArtists = useMemo(() => {
    let list = [...MOCK_ARTISTS];
    if (filterSearch) list = list.filter((a) => a.name.toLowerCase().includes(filterSearch.toLowerCase()) || a.specialty.toLowerCase().includes(filterSearch.toLowerCase()));
    if (sortBy === "rating") list.sort((a, b) => b.rating - a.rating);
    if (sortBy === "sales") list.sort((a, b) => b.sales - a.sales);
    if (sortBy === "new") list.sort((a, b) => b.joined.localeCompare(a.joined));
    return list;
  }, [sortBy, filterSearch]);

  return (
    <div className="min-h-screen bg-[#F8F8F8]">
      <ShopNav
        search={search}
        onSearchChange={(v) => { setSearch(v); router.push(`/shop?q=${v}`); }}
        cartCount={safeCartCount}
        onCartOpen={() => router.push("/cart")}
        category={navCategory}
        onCategoryChange={(cat) => { setNavCategory(cat); router.push("/shop"); }}
        categoryCounts={categoryCounts}
      />

      <div className="mx-auto max-w-[1400px] px-6 pb-24 pt-10 md:px-8">
        <div className="mb-8">
          <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase">Comunidad · 3D Island</p>
          <h1 className="mt-2 text-3xl font-black text-gray-900">Artistas del Vault</h1>
          <p className="mt-3 max-w-2xl text-base text-gray-500">
            Descubre a los creadores detrás de cada pieza. Artistas canarios especializados en impresión 3D premium.
          </p>
        </div>

        {/* Destacados */}
        <div className="mb-10">
          <h2 className="mb-4 text-lg font-bold text-gray-900">⭐ Artistas destacados</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {MOCK_ARTISTS.filter((a) => a.featured).map((artist) => (
              <Link key={artist.id} href={`/artists/${artist.id}`}
                className="group flex gap-4 rounded-2xl border border-gray-100 bg-white p-5 transition-all hover:border-gray-300 hover:shadow-md">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gray-50 text-4xl border border-gray-100">
                  {artist.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-gray-900 group-hover:text-gray-600">{artist.name}</h3>
                      <p className="text-xs text-gray-400">{artist.location}</p>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {artist.badges.slice(0, 2).map((badge) => (
                        <span key={badge} className="rounded-full bg-gray-100 px-2 py-0.5 text-[0.6rem] font-bold text-gray-600">
                          {badge}
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="mt-1.5 text-xs text-gray-500 line-clamp-2">{artist.bio}</p>
                  <div className="mt-2 flex items-center gap-3">
                    <StarRating rating={artist.rating} />
                    <span className="text-xs font-semibold text-amber-500">{artist.rating}</span>
                    <span className="text-xs text-gray-300">·</span>
                    <span className="text-xs text-gray-400">{artist.sales} ventas</span>
                    <span className="text-xs text-gray-300">·</span>
                    <span className="text-xs text-gray-400">{artist.products} productos</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Filtros */}
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <input type="text" value={filterSearch} onChange={(e) => setFilterSearch(e.target.value)}
            placeholder="Buscar artista..."
            className="flex-1 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm outline-none focus:border-gray-400 max-w-xs" />
          <div className="flex gap-2">
            {([
              { value: "rating", label: "⭐ Mejor valorados" },
              { value: "sales", label: "🔥 Más ventas" },
              { value: "new", label: "🆕 Más nuevos" },
            ] as const).map((opt) => (
              <button key={opt.value} type="button" onClick={() => setSortBy(opt.value)}
                className={`rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
                  sortBy === opt.value
                    ? "bg-gray-900 text-white"
                    : "border border-gray-200 bg-white text-gray-600 hover:border-gray-400"
                }`}>
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {sortedArtists.map((artist) => (
            <Link key={artist.id} href={`/artists/${artist.id}`}
              className="group flex flex-col rounded-2xl border border-gray-100 bg-white p-5 transition-all hover:border-gray-300 hover:shadow-md">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-50 text-3xl border border-gray-100">
                  {artist.avatar}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 group-hover:text-gray-600 text-sm">{artist.name}</h3>
                  <p className="text-xs text-gray-400">{artist.specialty}</p>
                </div>
              </div>
              <p className="mt-3 text-xs text-gray-500 line-clamp-2">{artist.bio}</p>
              <div className="mt-3 flex items-center gap-2">
                <StarRating rating={artist.rating} />
                <span className="text-xs font-semibold text-amber-500">{artist.rating}</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-xs text-gray-400">
                <span>{artist.sales} ventas</span>
                <span>{artist.products} productos</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-1">
                {artist.badges.map((badge) => (
                  <span key={badge} className="rounded-full bg-gray-50 px-2 py-0.5 text-[0.6rem] font-bold text-gray-500 border border-gray-100">
                    {badge}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}