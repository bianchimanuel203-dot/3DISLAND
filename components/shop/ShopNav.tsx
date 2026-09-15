"use client";

import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cart.store";
import { useHydration } from "@/store/useHydration";
import { useLocaleStore } from "@/store/locale.store";
import { SHOP_PRODUCTS, formatPrice, type ShopCategoryId } from "@/lib/shop/products";
import { useShopNavReveal } from "./useShopAnimations";

const CATEGORIES: { id: ShopCategoryId; label: Record<string, string> }[] = [
  { id: "all", label: { es: "Todo", en: "All", de: "Alle", fr: "Tout" } },
  { id: "gaming", label: { es: "Gaming", en: "Gaming", de: "Gaming", fr: "Gaming" } },
  { id: "tcg", label: { es: "TCG", en: "TCG", de: "TCG", fr: "TCG" } },
  { id: "custom", label: { es: "Custom", en: "Custom", de: "Individuell", fr: "Personnalisé" } },
  { id: "accesorios", label: { es: "Accesorios", en: "Accessories", de: "Zubehör", fr: "Accessoires" } },
];

const MEGA_MENU = [
  {
    title: { es: "Categorías", en: "Categories", de: "Kategorien", fr: "Catégories" },
    items: [
      { label: { es: "🎮 Gaming & Docks", en: "🎮 Gaming & Docks", de: "🎮 Gaming & Docks", fr: "🎮 Gaming & Docks" }, href: "/shop?category=gaming" },
      { label: { es: "🃏 TCG & Displays", en: "🃏 TCG & Displays", de: "🃏 TCG & Displays", fr: "🃏 TCG & Displays" }, href: "/shop?category=tcg" },
      { label: { es: "🏝️ Custom Canarias", en: "🏝️ Custom Canarias", de: "🏝️ Custom Canarias", fr: "🏝️ Custom Canarias" }, href: "/shop?category=custom" },
      { label: { es: "🧩 Accesorios", en: "🧩 Accessories", de: "🧩 Zubehör", fr: "🧩 Accessoires" }, href: "/shop?category=accesorios" },
    ],
  },
  {
    title: { es: "Artistas", en: "Artists", de: "Künstler", fr: "Artistes" },
    items: [
      { label: { es: "⭐ Más valorados", en: "⭐ Top rated", de: "⭐ Bestbewertet", fr: "⭐ Les mieux notés" }, href: "/artists?sort=rating" },
      { label: { es: "🔥 Trending", en: "🔥 Trending", de: "🔥 Trending", fr: "🔥 Tendance" }, href: "/artists?sort=trending" },
      { label: { es: "🆕 Nuevos artistas", en: "🆕 New artists", de: "🆕 Neue Künstler", fr: "🆕 Nouveaux artistes" }, href: "/artists?sort=new" },
      { label: { es: "🌋 Artistas canarios", en: "🌋 Canarian artists", de: "🌋 Kanarische Künstler", fr: "🌋 Artistes canariens" }, href: "/artists?origin=canarias" },
    ],
  },
  {
    title: { es: "Servicios B2B", en: "B2B Services", de: "B2B-Dienste", fr: "Services B2B" },
    items: [
      { label: { es: "✏️ Solicitar creación", en: "✏️ Request creation", de: "✏️ Erstellung anfragen", fr: "✏️ Demander création" }, href: "/custom-request" },
      { label: { es: "🏢 Pedidos empresa", en: "🏢 Business orders", de: "🏢 Firmenbestellungen", fr: "🏢 Commandes entreprise" }, href: "/custom-request?type=business" },
      { label: { es: "🎭 Merch & Branding", en: "🎭 Merch & Branding", de: "🎭 Merch & Branding", fr: "🎭 Merch & Branding" }, href: "/custom-request?type=merch" },
      { label: { es: "🏆 Torneos & Eventos", en: "🏆 Tournaments & Events", de: "🏆 Turniere & Events", fr: "🏆 Tournois & Événements" }, href: "/custom-request?type=events" },
    ],
  },
];

const LANGUAGES = [
  { code: "es", label: "ES", flag: "🇪🇸" },
  { code: "en", label: "EN", flag: "🇬🇧" },
  { code: "de", label: "DE", flag: "🇩🇪" },
  { code: "fr", label: "FR", flag: "🇫🇷" },
];

const T: Record<string, Record<string, string>> = {
  search: { es: "Busca en 3D Island...", en: "Search 3D Island...", de: "3D Island durchsuchen...", fr: "Chercher sur 3D Island..." },
  account: { es: "Acceso", en: "Sign in", de: "Anmelden", fr: "Connexion" },
  orders: { es: "Pedidos", en: "Orders", de: "Bestellungen", fr: "Commandes" },
  cart: { es: "Cesta", en: "Cart", de: "Warenkorb", fr: "Panier" },
  categories: { es: "Categorías", en: "Categories", de: "Kategorien", fr: "Catégories" },
  myAccount: { es: "Mi cuenta", en: "My account", de: "Mein Konto", fr: "Mon compte" },
  myOrders: { es: "Mis pedidos", en: "My orders", de: "Meine Bestellungen", fr: "Mes commandes" },
  returns: { es: "Devoluciones", en: "Returns", de: "Rücksendungen", fr: "Retours" },
  favorites: { es: "Favoritos", en: "Favorites", de: "Favoriten", fr: "Favoris" },
  signOut: { es: "Cerrar sesión", en: "Sign out", de: "Abmelden", fr: "Se déconnecter" },
  hello: { es: "Hola,", en: "Hello,", de: "Hallo,", fr: "Bonjour," },
  identify: { es: "identifícate", en: "sign in", de: "anmelden", fr: "connectez-vous" },
  artists: { es: "Artistas", en: "Artists", de: "Künstler", fr: "Artistes" },
  trending: { es: "Trending", en: "Trending", de: "Trending", fr: "Tendance" },
  customRequest: { es: "Solicitar creación", en: "Request creation", de: "Erstellung anfragen", fr: "Demander création" },
};

type ShopNavProps = {
  onCartOpen: () => void;
  category: ShopCategoryId;
  onCategoryChange: (cat: ShopCategoryId) => void;
  categoryCounts: Record<ShopCategoryId, number>;
  search?: string;
  onSearchChange?: (v: string) => void;
};

function SearchSuggestions({ query, onSelect }: { query: string; onSelect: (id: string) => void }) {
  const results = SHOP_PRODUCTS.filter(
    (p) =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.category.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 6);

  if (results.length === 0) return null;

  return (
    <div className="absolute left-0 right-0 top-full mt-1 overflow-hidden rounded-b-xl border border-gray-200 bg-white shadow-2xl z-50">
      {results.map((p) => (
        <button
          key={p.id}
          type="button"
          onClick={() => onSelect(p.id)}
          className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-gray-50"
        >
          <span className="text-xl">{p.glyph}</span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{p.name}</p>
            <p className="text-xs text-gray-400 capitalize">{p.category}</p>
          </div>
          <p className="text-sm font-bold text-gray-900 shrink-0">{formatPrice(p.price)}</p>
        </button>
      ))}
    </div>
  );
}

export default function ShopNav({
  onCartOpen,
  category,
  onCategoryChange,
  categoryCounts,
  search: externalSearch,
  onSearchChange: externalOnChange,
}: ShopNavProps) {
  const navRef = useRef<HTMLElement>(null);
  useShopNavReveal(navRef);

  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;

  const rawCartCount = useCartStore((s) => s.cartCount());
  const hydrated = useHydration();
  const safeCartCount = hydrated ? rawCartCount : 0;

  const { locale, setLocale } = useLocaleStore();
  const [langOpen, setLangOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [internalSearch, setInternalSearch] = useState("");
  const [scrolled, setScrolled] = useState(false);

  const search = externalSearch ?? internalSearch;
  const handleSearchChange = externalOnChange ?? setInternalSearch;

  const t = (key: string) => T[key]?.[locale] ?? T[key]?.["es"] ?? key;
  const catLabel = (cat: (typeof CATEGORIES)[0]) => cat.label[locale] ?? cat.label["es"];
  const menuLabel = (label: Record<string, string>) => label[locale] ?? label["es"];

  const handleMenuNav = (href: string) => { router.push(href); setMegaOpen(false); };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("#lang-dropdown")) setLangOpen(false);
      if (!target.closest("#mega-menu")) setMegaOpen(false);
      if (!target.closest("#user-menu")) setUserOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setMegaOpen(false); setLangOpen(false); setUserOpen(false); }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  return (
    <>
      <header ref={navRef} className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">

        {/* FILA 1 — estilo Etsy */}
        <div className="mx-auto flex max-w-[1400px] items-center gap-4 px-4 py-3">

          {/* Logo */}
          <Link href="/shop" className="shrink-0 mr-2">
            <span className="text-xl font-black tracking-tight text-gray-900">
              3D<span className="text-[#1a1a1a]">ISLAND</span>
            </span>
            <span className="block text-[0.5rem] text-gray-400 font-medium tracking-widest -mt-0.5 text-center">.es</span>
          </Link>

          {/* Barra búsqueda central — protagonista como Etsy */}
          <div className="flex flex-1 items-stretch rounded-full overflow-hidden border-2 border-gray-900 hover:border-gray-700 transition-colors">
            <div className="relative flex-1">
              <input
                type="text"
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder={t("search")}
                className="h-11 w-full bg-white pl-5 pr-2 text-sm text-gray-900 placeholder-gray-400 outline-none"
                autoComplete="off"
              />
              {search.length > 1 && (
                <SearchSuggestions
                  query={search}
                  onSelect={(id) => { handleSearchChange(""); router.push(`/shop/product/${id}`); }}
                />
              )}
            </div>
            <button
              type="button"
              className="shrink-0 flex items-center justify-center bg-gray-900 hover:bg-gray-700 px-5 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </button>
          </div>

          {/* Idioma */}
          <div id="lang-dropdown" className="relative shrink-0 hidden md:block">
            <button
              type="button"
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors rounded-full hover:bg-gray-100"
            >
              {LANGUAGES.find((l) => l.code === locale)?.flag}
              <span>{locale.toUpperCase()}</span>
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </button>
            {langOpen && (
              <div className="absolute right-0 top-full mt-2 w-32 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl z-50">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => { setLocale(lang.code); setLangOpen(false); }}
                    className={`flex w-full items-center gap-2 px-4 py-2.5 text-sm transition-colors hover:bg-gray-50 ${locale === lang.code ? "font-bold text-gray-900" : "text-gray-600"}`}
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Usuario */}
          <div id="user-menu" className="relative shrink-0">
            {user ? (
              <>
                <button
                  type="button"
                  onClick={() => setUserOpen(!userOpen)}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors rounded-full hover:bg-gray-100"
                >
                  <div className="h-7 w-7 rounded-full bg-gray-900 text-white text-xs font-bold flex items-center justify-center">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden lg:block">{user.name?.split(" ")[0]}</span>
                </button>
                {userOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl z-50">
                    <div className="border-b border-gray-100 px-4 py-3">
                      <p className="text-xs text-gray-400">Conectado como</p>
                      <p className="text-sm font-semibold text-gray-900 truncate">{user.email}</p>
                    </div>
                    <div className="py-1">
                      {[
                        { href: "/account", label: t("myAccount") },
                        { href: "/account/orders", label: t("myOrders") },
                        { href: "/account/returns", label: t("returns") },
                        { href: "/favorites", label: t("favorites") },
                      ].map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setUserOpen(false)}
                          className="flex items-center px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                    <div className="border-t border-gray-100 py-1">
                      <button
                        type="button"
                        onClick={() => { setUserOpen(false); signOut({ callbackUrl: "/shop" }); }}
                        className="flex w-full items-center px-4 py-2.5 text-sm text-red-600 transition-colors hover:bg-red-50"
                      >
                        {t("signOut")}
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <Link
                href="/auth/login"
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors rounded-full hover:bg-gray-100"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
                <span className="hidden lg:block">{t("account")}</span>
              </Link>
            )}
          </div>

          {/* Favoritos */}
          <Link
            href="/favorites"
            className="hidden sm:flex h-10 w-10 shrink-0 items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
          </Link>

          {/* Carrito — botón negro estilo Etsy */}
          <button
            type="button"
            onClick={onCartOpen}
            className="relative flex shrink-0 items-center gap-2 rounded-full bg-gray-900 hover:bg-gray-700 px-4 py-2 text-sm font-semibold text-white transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
            </svg>
            <span className="hidden sm:block">{t("cart")}</span>
            {safeCartCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                {safeCartCount > 99 ? "99+" : safeCartCount}
              </span>
            )}
          </button>
        </div>

        {/* FILA 2 — categorías estilo Etsy (se oculta al scroll) */}
        <div className={`border-t border-gray-100 transition-all duration-200 overflow-hidden ${scrolled ? "max-h-0" : "max-h-12"}`}>
          <div className="mx-auto flex max-w-[1400px] items-center px-4 overflow-x-auto scrollbar-none">

            {/* Categorías dropdown */}
            <div id="mega-menu" className="relative shrink-0">
              <button
                type="button"
                onClick={() => setMegaOpen(!megaOpen)}
                className="flex shrink-0 items-center gap-2 px-4 py-3 text-sm font-semibold text-gray-800 hover:text-gray-900 hover:bg-gray-50 transition-colors whitespace-nowrap border-b-2 border-transparent hover:border-gray-900"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
                {t("categories")}
              </button>
            </div>

            <div className="mx-2 h-4 w-px shrink-0 bg-gray-200" />

            {CATEGORIES.filter((c) => c.id !== "all").map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => { onCategoryChange(cat.id); router.push(`/shop?category=${cat.id}`); }}
                className={`flex shrink-0 items-center gap-1.5 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                  category === cat.id
                    ? "border-gray-900 text-gray-900 font-semibold"
                    : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
                }`}
              >
                {catLabel(cat)}
                <span className="text-[0.6rem] text-gray-400 font-bold">
                  ({categoryCounts[cat.id]})
                </span>
              </button>
            ))}

            <div className="mx-2 h-4 w-px shrink-0 bg-gray-200" />

            <Link href="/artists" className="flex shrink-0 items-center gap-1.5 px-4 py-3 text-sm font-medium whitespace-nowrap text-gray-600 hover:text-gray-900 border-b-2 border-transparent hover:border-gray-300 transition-colors">
              ⭐ {t("artists")}
            </Link>
            <Link href="/shop?sort=trending" className="flex shrink-0 items-center gap-1.5 px-4 py-3 text-sm font-medium whitespace-nowrap text-gray-600 hover:text-gray-900 border-b-2 border-transparent hover:border-gray-300 transition-colors">
              🔥 {t("trending")}
            </Link>
            <Link href="/custom-request" className="flex shrink-0 items-center gap-1.5 px-4 py-3 text-sm font-semibold whitespace-nowrap text-red-600 hover:text-red-700 border-b-2 border-transparent hover:border-red-600 transition-colors">
              ✏️ {t("customRequest")}
            </Link>

            {/* Volver a la landing */}
            <div className="ml-auto shrink-0">
              <Link href="/landing" className="flex items-center gap-1.5 px-4 py-3 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors whitespace-nowrap">
                ← Inicio
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Mega menú — estilo Etsy drawer lateral */}
      {megaOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/30" onClick={() => setMegaOpen(false)} />
          <div className="fixed left-0 top-0 z-50 h-full w-full max-w-sm overflow-y-auto bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <span className="text-lg font-bold text-gray-900">Menú</span>
              <button
                type="button"
                onClick={() => setMegaOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-100 text-gray-600"
              >
                ✕
              </button>
            </div>
            <div className="px-6 py-4">
              {MEGA_MENU.map((section) => (
                <div key={section.title.es} className="mb-6">
                  <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-gray-400">
                    {menuLabel(section.title)}
                  </h3>
                  <ul className="space-y-1">
                    {section.items.map((item) => (
                      <li key={item.href}>
                        <button
                          type="button"
                          onClick={() => handleMenuNav(item.href)}
                          className="flex w-full items-center rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900"
                        >
                          {menuLabel(item.label)}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              <div className="mt-4 rounded-2xl bg-gray-50 p-4 border border-gray-200">
                <p className="text-xs font-bold uppercase tracking-widest text-gray-500">¿Proyecto especial?</p>
                <p className="mt-1 text-sm text-gray-600">Solicita una creación personalizada para tu negocio o evento.</p>
                <button
                  type="button"
                  onClick={() => handleMenuNav("/custom-request")}
                  className="mt-3 flex w-full items-center justify-center rounded-full bg-gray-900 hover:bg-gray-700 py-2.5 text-sm font-semibold text-white transition-colors"
                >
                  Solicitar ahora →
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}