"use client";

import { useParams, useRouter } from "next/navigation";
import { SHOP_PRODUCTS, formatPrice, type ShopCategoryId } from "@/lib/shop/products";
import { useCartStore } from "@/store/cart.store";
import { useFavoritesStore } from "@/store/favorites.store";
import ShopNav from "@/components/shop/ShopNav";
import Link from "next/link";
import { useState } from "react";

const categoryCounts: Record<ShopCategoryId, number> = {
  all: SHOP_PRODUCTS.length,
  gaming: SHOP_PRODUCTS.filter((p) => p.category === "gaming").length,
  tcg: SHOP_PRODUCTS.filter((p) => p.category === "tcg").length,
  custom: SHOP_PRODUCTS.filter((p) => p.category === "custom").length,
  accesorios: SHOP_PRODUCTS.filter((p) => p.category === "accesorios").length,
};

const MOCK_REVIEWS = [
  { id: 1, author: "Carlos M.", rating: 5, date: "12 mayo 2026", text: "Calidad increíble, llegó en 3 días desde Fuerteventura. El acabado es exactamente como en las fotos.", avatar: "C" },
  { id: 2, author: "Laura G.", rating: 5, date: "28 abril 2026", text: "Perfecto para mis auriculares Sony. Muy sólido, no se mueve nada. Lo recomiendo 100%.", avatar: "L" },
  { id: 3, author: "Marcos T.", rating: 4, date: "15 abril 2026", text: "Buen producto, el diseño es bonito. Le doy 4 estrellas porque tardó un día más de lo esperado.", avatar: "M" },
  { id: 4, author: "Sofía R.", rating: 5, date: "2 abril 2026", text: "Impresionante la precisión del acabado. Se nota que está fabricado con cuidado.", avatar: "S" },
];

const RATING_DIST = { 5: 68, 4: 20, 3: 8, 2: 3, 1: 1 };
const AVG_RATING = 4.8;

function Stars({ rating, size = "md" }: { rating: number; size?: "sm" | "md" | "lg" }) {
  const sz = size === "lg" ? "text-2xl" : size === "sm" ? "text-xs" : "text-sm";
  return (
    <span className={sz}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={i <= Math.round(rating) ? "text-amber-400" : "text-gray-200"}>★</span>
      ))}
    </span>
  );
}

type Tab = "descripcion" | "specs" | "resenas";

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [added, setAdded] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("descripcion");
  const [qty, setQty] = useState(1);
  const addToCart = useCartStore((s) => s.addToCart);
  const toggleFavorite = useFavoritesStore((s) => s.toggleFavorite);
  const isFavorite = useFavoritesStore((s) => s.isFavorite);

  const product = SHOP_PRODUCTS.find((p) => p.id === id);

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
        <p className="text-2xl font-bold text-gray-900">Producto no encontrado</p>
        <Link href="/shop" className="text-gray-600 underline">Volver al catálogo</Link>
      </div>
    );
  }

  const related = SHOP_PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id
  ).slice(0, 4);

  const originalPrice = +(product.price * 1.2).toFixed(2);
  const discount = 17;
  const fav = isFavorite(product.id);

  function handleAddToCart() {
    for (let i = 0; i < qty; i++) {
      addToCart({ id: product!.id, name: product!.name, price: product!.price, glyph: product!.glyph });
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="min-h-screen bg-[#F8F8F8]">
      <ShopNav
        onCartOpen={() => {}}
        category="all"
        onCategoryChange={() => {}}
        categoryCounts={categoryCounts}
      />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        {/* Breadcrumb */}
        <nav className="mb-4 flex items-center gap-1.5 text-xs text-gray-400">
          <Link href="/shop" className="hover:text-gray-700 transition-colors">Inicio</Link>
          <span>›</span>
          <Link href={`/shop?category=${product.category}`} className="hover:text-gray-700 capitalize transition-colors">{product.category}</Link>
          <span>›</span>
          <span className="text-gray-600 truncate max-w-[200px]">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_420px] lg:items-start">

          {/* LEFT */}
          <div className="flex flex-col gap-6">

            {/* Galería */}
            <div className="flex gap-3">
              <div className="hidden sm:flex flex-col gap-2">
                {[0, 1, 2, 3].map((i) => (
                  <button key={i}
                    className="flex h-16 w-16 items-center justify-center rounded-xl border-2 border-transparent bg-white text-2xl shadow-sm transition hover:border-gray-900">
                    {product.glyph}
                  </button>
                ))}
              </div>
              <div className="relative flex flex-1 items-center justify-center rounded-2xl bg-white shadow-sm min-h-[420px] border border-gray-100">
                <span className="text-[12rem] select-none" role="img" aria-label={product.name}>
                  {product.glyph}
                </span>
                {product.tag && (
                  <span className="absolute top-4 left-4 rounded-full bg-gray-900 px-3 py-1 text-xs font-bold text-white uppercase tracking-wide">
                    {product.tag}
                  </span>
                )}
                <button
                  onClick={() => toggleFavorite(product.id)}
                  className="absolute top-4 right-4 rounded-full bg-white p-2.5 shadow-md transition hover:scale-110 border border-gray-100"
                  aria-label={fav ? "Quitar de favoritos" : "Añadir a favoritos"}
                >
                  <span className="text-xl">{fav ? "❤️" : "🤍"}</span>
                </button>
                <span className="absolute bottom-4 right-4 rounded-full bg-red-500 px-2.5 py-0.5 text-xs font-bold text-white">
                  -{discount}%
                </span>
              </div>
            </div>

            {/* Tabs */}
            <div className="rounded-2xl bg-white shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex border-b border-gray-100">
                {(["descripcion", "specs", "resenas"] as Tab[]).map((tab) => (
                  <button key={tab} onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-4 text-sm font-semibold transition ${
                      activeTab === tab
                        ? "border-b-2 border-gray-900 text-gray-900 bg-gray-50/50"
                        : "text-gray-400 hover:text-gray-700"
                    }`}
                  >
                    {tab === "descripcion" && "📋 Descripción"}
                    {tab === "specs" && "⚙️ Especificaciones"}
                    {tab === "resenas" && `⭐ Reseñas (${MOCK_REVIEWS.length})`}
                  </button>
                ))}
              </div>

              <div className="p-6">
                {activeTab === "descripcion" && (
                  <div className="max-w-2xl space-y-4 text-gray-600 leading-relaxed">
                    <p>{product.description}</p>
                    <p>Cada pieza se imprime en resina de alta densidad con acabado mate. Fabricada manualmente en Fuerteventura, Islas Canarias.</p>
                    <p>Tiempo de producción estimado: <strong className="text-gray-800">2–4 días laborables</strong>. Enviamos a toda España y Europa.</p>
                  </div>
                )}

                {activeTab === "specs" && (
                  <div className="max-w-xl">
                    <table className="w-full text-sm">
                      <tbody className="divide-y divide-gray-100">
                        {[
                          ["Material", "Resina de alta densidad"],
                          ["Acabado", "Mate texturizado"],
                          ["Fabricación", "Impresión 3D FDM / Resina"],
                          ["Origen", "Fuerteventura, Islas Canarias"],
                          ["Peso aproximado", "120–180g"],
                          ["Dimensiones", "Según producto (ver descripción)"],
                          ["Tiempo producción", "2–4 días laborables"],
                          ["Garantía", "6 meses – defectos de fabricación"],
                        ].map(([key, val]) => (
                          <tr key={key}>
                            <td className="py-3 pr-6 font-medium text-gray-700 w-40">{key}</td>
                            <td className="py-3 text-gray-500">{val}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {activeTab === "resenas" && (
                  <div className="space-y-6">
                    <div className="flex gap-8 items-center pb-6 border-b border-gray-100">
                      <div className="text-center shrink-0">
                        <p className="text-5xl font-bold text-gray-900">{AVG_RATING}</p>
                        <Stars rating={AVG_RATING} size="lg" />
                        <p className="text-xs text-gray-400 mt-1">{MOCK_REVIEWS.length} reseñas</p>
                      </div>
                      <div className="flex-1 space-y-1.5">
                        {([5, 4, 3, 2, 1] as const).map((star) => (
                          <div key={star} className="flex items-center gap-2 text-xs">
                            <span className="w-4 text-right text-gray-500">{star}★</span>
                            <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
                              <div className="h-full bg-amber-400 rounded-full" style={{ width: `${RATING_DIST[star]}%` }} />
                            </div>
                            <span className="w-6 text-gray-400">{RATING_DIST[star]}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-5">
                      {MOCK_REVIEWS.map((r) => (
                        <div key={r.id} className="border-b border-gray-50 pb-5 last:border-0">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-900 text-white text-xs font-bold shrink-0">
                              {r.avatar}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-gray-800">{r.author}</p>
                              <div className="flex items-center gap-2">
                                <Stars rating={r.rating} size="sm" />
                                <span className="text-xs text-gray-400">{r.date}</span>
                              </div>
                            </div>
                            <span className="ml-auto text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">✓ Compra verificada</span>
                          </div>
                          <p className="text-sm text-gray-600 leading-relaxed">{r.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Relacionados */}
            {related.length > 0 && (
              <div>
                <h2 className="mb-4 text-lg font-bold text-gray-900">También te puede gustar</h2>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {related.map((p) => (
                    <Link key={p.id} href={`/shop/product/${p.id}`}
                      className="group flex flex-col gap-2 rounded-2xl border border-gray-100 bg-white p-4 transition hover:border-gray-300 hover:shadow-md">
                      <div className="flex h-24 items-center justify-center rounded-xl bg-gray-50 text-5xl">
                        {p.glyph}
                      </div>
                      <p className="text-xs font-semibold text-gray-800 group-hover:text-gray-600 leading-tight line-clamp-2">
                        {p.name}
                      </p>
                      <p className="text-sm font-bold text-gray-900">{formatPrice(p.price)}</p>
                      <div className="flex items-center gap-1">
                        <Stars rating={4.8} size="sm" />
                        <span className="text-xs text-gray-400">(4.8)</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT — Buy box */}
          <div className="flex flex-col gap-4 lg:sticky lg:top-24 lg:self-start">
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-gray-400">
                {product.category}
              </p>
              <h1 className="text-2xl font-bold text-gray-900 leading-snug mb-2">
                {product.name}
              </h1>
              <div className="flex items-center gap-2">
                <Stars rating={AVG_RATING} />
                <span className="text-sm font-semibold text-amber-500">{AVG_RATING}</span>
                <span className="text-sm text-gray-400">({MOCK_REVIEWS.length} reseñas)</span>
                <span className="text-xs text-green-600 font-medium ml-1">✓ 127 vendidos</span>
              </div>
            </div>

            <div className="rounded-xl bg-white p-4 shadow-sm border border-gray-100">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-gray-900">{formatPrice(product.price)}</span>
                <span className="text-base text-gray-400 line-through">{formatPrice(originalPrice)}</span>
                <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-bold text-red-600">-{discount}%</span>
              </div>
              <p className="mt-1 text-xs text-gray-400">IVA incluido · Envío gratis a Canarias</p>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <span className="h-2 w-2 rounded-full bg-green-500 inline-block"></span>
              <span className="text-green-700 font-medium">En stock</span>
              <span className="text-gray-400">· Fabricado bajo demanda</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-600">Cantidad:</span>
              <div className="flex items-center rounded-full border border-gray-200 bg-white overflow-hidden">
                <button onClick={() => setQty(Math.max(1, qty - 1))}
                  className="px-4 py-2 text-lg font-bold text-gray-600 hover:bg-gray-50 transition">−</button>
                <span className="w-10 text-center text-sm font-semibold text-gray-900">{qty}</span>
                <button onClick={() => setQty(qty + 1)}
                  className="px-4 py-2 text-lg font-bold text-gray-600 hover:bg-gray-50 transition">+</button>
              </div>
            </div>

            {/* Botones estilo Etsy — negro */}
            <div className="flex flex-col gap-2">
              <button onClick={handleAddToCart}
                className="w-full rounded-full bg-gray-900 hover:bg-gray-700 py-3.5 text-sm font-bold text-white transition active:scale-95">
                {added ? "✓ Añadido a la cesta" : "Añadir a la cesta"}
              </button>
              <button onClick={() => { handleAddToCart(); router.push("/checkout"); }}
                className="w-full rounded-full border-2 border-gray-900 hover:bg-gray-50 py-3.5 text-sm font-bold text-gray-900 transition active:scale-95">
                Comprar ahora
              </button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
              {[
                { icon: "🔒", text: "Pago seguro Stripe" },
                { icon: "📦", text: "Envío en 3–5 días" },
                { icon: "↩️", text: "Devolución 14 días" },
                { icon: "🖨️", text: "Impreso en Canarias" },
              ].map((b) => (
                <div key={b.text} className="flex items-center gap-1.5 rounded-xl bg-white p-2.5 border border-gray-100">
                  <span>{b.icon}</span> {b.text}
                </div>
              ))}
            </div>

            {/* Vendedor */}
            <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-900 text-white font-bold text-sm shrink-0">
                3D
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-400">Vendido por</p>
                <p className="text-sm font-semibold text-gray-900">3D Island – Fuerteventura</p>
              </div>
              <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full">✓ Verificado</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}