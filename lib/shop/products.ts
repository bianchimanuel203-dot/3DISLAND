export type ShopCategoryId =
  | "all"
  | "gaming"
  | "tcg"
  | "custom"
  | "accesorios";

export type ShopProduct = {
  id: string;
  name: string;
  category: Exclude<ShopCategoryId, "all">;
  description: string;
  price: number;
  glyph: string;
  image: string;
  tag?: string;
  featured?: boolean;
};

export const SHOP_CATEGORIES: {
  id: ShopCategoryId;
  label: string;
  description: string;
}[] = [
  { id: "all", label: "Todo el catálogo", description: "Explora la forja completa" },
  { id: "gaming", label: "Gaming", description: "Soportes, docks y altares" },
  { id: "tcg", label: "TCG", description: "Vaults, displays y organizadores" },
  { id: "custom", label: "Custom", description: "Piezas a medida desde Canarias" },
  { id: "accesorios", label: "Accesorios", description: "Complementos y utilidades" },
];

export const SHOP_PRODUCTS: ShopProduct[] = [
  {
    id: "prd-neon-grip",
    name: "Neon Grip Throne",
    category: "gaming",
    description: "Estación de mando PS5 con acabado violeta y cable management integrado.",
    price: 34.9,
    glyph: "🎮",
    image: "/products/producto-1.png",
    tag: "Nuevo",
    featured: true,
  },
  {
    id: "prd-phantom-crown",
    name: "Phantom Crown Stand",
    category: "gaming",
    description: "Soporte para auriculares inspirado en sombras — resina violeta de alta densidad.",
    price: 28.5,
    glyph: "😈",
    image: "/products/producto-2.png",
    featured: true,
  },
  {
    id: "prd-dual-dock",
    name: "Dual Charge Dock",
    category: "gaming",
    description: "Base magnética para dos mandos con LED ambiental suave.",
    price: 42.0,
    glyph: "⚡",
    image: "/products/producto-3.png",
  },
  {
    id: "prd-magnetic-vault",
    name: "Magnetic Vault",
    category: "tcg",
    description: "Caja magnética para decks Pokémon y MTG — sellado ritual, no plástico barato.",
    price: 24.9,
    glyph: "📦",
    image: "/products/producto-4.png",
    tag: "Top ventas",
    featured: true,
  },
  {
    id: "prd-graded-prism",
    name: "Graded Prism Display",
    category: "tcg",
    description: "Monolito vertical para cartas gradadas con acrílico violeta tipo museo.",
    price: 38.0,
    glyph: "💎",
    image: "/products/producto-5.png",
  },
  {
    id: "prd-slab-altar",
    name: "Slab Altar Trio",
    category: "tcg",
    description: "Expositor triple para slabs PSA/CGC con base antideslizante.",
    price: 45.5,
    glyph: "🏛️",
    image: "/products/producto-6.png",
  },
  {
    id: "prd-island-sigil",
    name: "Island Sigil Plaque",
    category: "custom",
    description: "Placa personalizada 3D Island — nombre, logo o runas a tu medida.",
    price: 19.9,
    glyph: "🏝️",
    image: "/products/producto-7.png",
    tag: "Personalizable",
  },
  {
    id: "prd-canarias-crest",
    name: "Canarias Crest Relic",
    category: "custom",
    description: "Escudo isleño impreso en capas con gradiente violeta y textura grabada.",
    price: 32.0,
    glyph: "🌋",
    image: "/products/producto-8.svg",
    featured: true,
  },
  {
    id: "prd-desk-organizer",
    name: "Void Desk Organizer",
    category: "accesorios",
    description: "Organizador modular para cables, llaves y tokens de partida.",
    price: 22.5,
    glyph: "🧩",
    image: "/products/producto-1.png",
  },
  {
    id: "prd-coaster-set",
    name: "Gengar Glow Coasters",
    category: "accesorios",
    description: "Set de 4 posavasos con borde neón y textura antideslizante.",
    price: 16.9,
    glyph: "☕",
    image: "/products/producto-2.png",
  },
  {
    id: "prd-keycap-shrine",
    name: "Keycap Shrine",
    category: "gaming",
    description: "Expositor para keycaps artesanales con iluminación lateral opcional.",
    price: 26.0,
    glyph: "⌨️",
    image: "/products/producto-3.png",
  },
  {
    id: "prd-tournament-tray",
    name: "Tournament Tray Core",
    category: "tcg",
    description: "Bandeja de torneo con compartimentos para dados, tokens y sideboard.",
    price: 29.9,
    glyph: "🎲",
    image: "/products/producto-4.png",
  },
];

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
  }).format(price);
}
