"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useState, useMemo } from "react";
import ShopNav from "@/components/shop/ShopNav";
import { useCartStore } from "@/store/cart.store";
import { useHydration } from "@/store/useHydration";
import { SHOP_PRODUCTS, formatPrice, type ShopCategoryId } from "@/lib/shop/products";
import UnsplashPhoto from "@/components/ui/UnsplashPhoto";

const MOCK_ARTISTS: Record<string, any> = {
  "3d-island-studio": { id: "3d-island-studio", name: "3D Island Studio", avatar: "🏝️", location: "Las Palmas, Canarias", specialty: "Gaming & TCG", rating: 4.9, reviews: 128, sales: 340, products: 12, joined: "2024", bio: "Estudio especializado en piezas premium para gaming y coleccionismo. Más de 2 años fabricando con impresión FDM de alta resolución y acabados artesanales.", badges: ["Top Vendedor", "Envío Rápido", "Canarias", "Verificado"], socials: { instagram: "@3dislandstudio" } },
  "violet-forge": { id: "violet-forge", name: "Violet Forge", avatar: "⚡", location: "Tenerife, Canarias", specialty: "Custom & B2B", rating: 4.8, reviews: 89, sales: 210, products: 8, joined: "2024", bio: "Especialistas en piezas personalizadas para empresas, eventos y streamers. Diseño y fabricación en 48h con garantía total.", badges: ["B2B", "Personalización", "Verificado"], socials: { instagram: "@violetforge", twitter: "@violetforge3d" } },
};

function StarRating({ rating, size = "sm" }: { rating: number; size?: "sm" | "lg" }) {
  return (
    <div className={`flex items-center gap-0.5 ${size === "lg" ? "text-xl" : "text-sm"}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className={star <= Math.round(rating) ? "text-amber-400" : "text-gray-200"}>★</span>
      ))}
    </div>
  );
}

export default function ArtistProfilePage() {
  const params = useParams();
  const router = useRouter();
  const artistId = params.id as string;
  const artist = MOCK_ARTISTS[artistId];

  const [search, setSearch] = useState("");
  const [navCategory, setNavCategory] = useState<ShopCategoryId>("all");
  const [activeTab, setActiveTab] = useState<"products" | "reviews" | "about">("products");

  const rawCartCount = useCartStore((s) => s.cartCount());
  const hydrated = useHydration();
  const safeCartCount = hydrated ? rawCartCount : 0;

  const categoryCounts = useMemo(() => {
    const counts: Record<ShopCategoryId, number> = { all: SHOP_PRODUCTS.length, gaming: 0, tcg: 0, custom: 0, accesorios: 0 };
    for (const p of SHOP_PRODUCTS) counts[p.category] += 1;
    return counts;
  }, []);

  if (!artist) {
    return (
      <div className="min-h-screen bg-[#F8F8F8] flex flex-col items-center justify-center">
        <span className="text-5xl mb-4">🔍</span>
        <p className="text-xl font-bold text-gray-900">Artista no encontrado</p>
        <Link href="/artists" className="mt-4 text-gray-600 hover:text-gray-900 underline text-sm">← Ver todos los artistas</Link>
      </div>
    );
  }

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

      <div>
        {/* Banner */}
        <div className="h-48 overflow-hidden bg-gray-900 sm:h-56">
          <UnsplashPhoto
            section="artist"
            query={`${artist.name} banner`}
            alt={`${artist.name} banner`}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="mx-auto max-w-[1400px] px-6 pb-24 md:px-8">
          <div className="relative -mt-16 mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-4">
              <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-2xl border-4 border-white bg-gray-50 shadow-lg">
                <UnsplashPhoto
                  section="artist"
                  query={artist.name}
                  alt={artist.name}
                  className="h-full w-full object-cover"
                  fallback={<span className="text-5xl">{artist.avatar}</span>}
                />
              </div>
              <div className="mb-2">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-black text-gray-900">{artist.name}</h1>
                  {artist.badges.includes("Verificado") && (
                    <span className="rounded-full bg-gray-900 px-2 py-0.5 text-[0.65rem] font-bold text-white">✓ Verificado</span>
                  )}
                </div>
                <p className="text-sm text-gray-500">{artist.location} · {artist.specialty}</p>
                <div className="mt-1 flex items-center gap-2">
                  <StarRating rating={artist.rating} />
                  <span className="text-sm font-semibold text-amber-500">{artist.rating}</span>
                  <span className="text-sm text-gray-400">({artist.reviews} opiniones)</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button type="button"
                className="rounded-full border-2 border-gray-900 px-5 py-2 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-50">
                Seguir
              </button>
              <Link href={`/custom-request?artist=${artist.id}`}
                className="rounded-full bg-gray-900 hover:bg-gray-700 px-5 py-2 text-sm font-semibold text-white transition-colors">
                Solicitar creación
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "Ventas", value: artist.sales, icon: "🛒" },
              { label: "Productos", value: artist.products, icon: "📦" },
              { label: "Opiniones", value: artist.reviews, icon: "⭐" },
              { label: "Desde", value: artist.joined, icon: "📅" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-gray-100 bg-white p-4 text-center">
                <span className="text-2xl">{stat.icon}</span>
                <p className="mt-1 text-xl font-black text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-400">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Badges */}
          <div className="mb-8 flex flex-wrap gap-2">
            {artist.badges.map((badge: string) => (
              <span key={badge} className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-bold text-gray-700">
                {badge}
              </span>
            ))}
          </div>

          {/* Tabs */}
          <div className="mb-6 border-b border-gray-200">
            <div className="flex gap-0">
              {(["products", "reviews", "about"] as const).map((tab) => (
                <button key={tab} type="button" onClick={() => setActiveTab(tab)}
                  className={`border-b-2 px-5 py-3 text-sm font-medium transition-colors -mb-px ${
                    activeTab === tab
                      ? "border-gray-900 text-gray-900"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}>
                  {tab === "products" ? `Productos (${artist.products})` : tab === "reviews" ? `Opiniones (${artist.reviews})` : "Sobre mí"}
                </button>
              ))}
            </div>
          </div>

          {activeTab === "products" && (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {SHOP_PRODUCTS.slice(0, artist.products).map((p) => (
                <Link key={p.id} href={`/shop/product/${p.id}`}
                  className="group rounded-2xl border border-gray-100 bg-white p-4 transition-all hover:border-gray-300 hover:shadow-md">
                  <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-xl bg-gray-50">
                    <Image
                      src={p.image}
                      alt={p.name}
                      fill
                      sizes="(max-width: 640px) 50vw, 25vw"
                      className="object-cover"
                    />
                  </div>
                  <p className="mt-2 text-sm font-semibold text-gray-900 line-clamp-1 group-hover:text-gray-600">{p.name}</p>
                  <p className="mt-1 text-sm font-bold text-gray-900">{formatPrice(p.price)}</p>
                  <p className="text-xs text-green-600">Envío gratis</p>
                </Link>
              ))}
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="space-y-4 max-w-2xl">
              {[
                { author: "Carlos M.", rating: 5, date: "12 may 2026", text: "Calidad increíble, impresión perfecta. Llegó en 2 días a Las Palmas.", verified: true },
                { author: "Laura K.", rating: 5, date: "8 may 2026", text: "Exactamente lo que buscaba. El acabado es precioso.", verified: true },
                { author: "Iván R.", rating: 4, date: "2 may 2026", text: "Muy buen producto, el embalaje es cuidadísimo. Repetiré.", verified: false },
              ].map((review, i) => (
                <div key={i} className="rounded-2xl border border-gray-100 bg-white p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{review.author}</p>
                      <div className="mt-0.5 flex items-center gap-2">
                        <StarRating rating={review.rating} />
                        {review.verified && <span className="text-[0.65rem] text-green-600 font-medium">✓ Compra verificada</span>}
                      </div>
                    </div>
                    <span className="text-xs text-gray-400">{review.date}</span>
                  </div>
                  <p className="mt-2 text-sm text-gray-600">{review.text}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === "about" && (
            <div className="max-w-2xl space-y-4">
              <div className="rounded-2xl border border-gray-100 bg-white p-6">
                <h3 className="mb-3 font-bold text-gray-900">Sobre {artist.name}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{artist.bio}</p>
              </div>
              {Object.keys(artist.socials).length > 0 && (
                <div className="rounded-2xl border border-gray-100 bg-white p-6">
                  <h3 className="mb-3 font-bold text-gray-900">Redes sociales</h3>
                  <div className="space-y-2">
                    {artist.socials.instagram && <p className="text-sm text-gray-700">📷 {artist.socials.instagram}</p>}
                    {artist.socials.twitter && <p className="text-sm text-gray-700">🐦 {artist.socials.twitter}</p>}
                  </div>
                </div>
              )}
              <Link href={`/custom-request?artist=${artist.id}`}
                className="flex items-center justify-between rounded-2xl bg-gray-50 p-5 transition-colors hover:bg-gray-100 border border-gray-100">
                <div>
                  <p className="font-bold text-gray-900">¿Quieres algo personalizado?</p>
                  <p className="text-sm text-gray-500">Solicita una creación exclusiva a {artist.name}</p>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}