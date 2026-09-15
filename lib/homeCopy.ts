import type { Artifact } from "@/components/ui/ProductCard";

export const HOME_COPY = {
  loading: {
    initializing: "Inicializando el Reino",
  },
  hero: {
    scrollHint: "Desciende para explorar",
    title: "3D ISLAND",
    tagline:
      "Una forja digital entre océano y vacío — reliquias gaming, bóvedas TCG y fabricación canaria tejidas en un solo reino inmersivo.",
  },
  forge: {
    sectionLabel: "Capacidades",
    heading: "Lo que la forja manifiesta",
    capabilities: [
      {
        index: "01",
        title: "Reliquias Gaming",
        tag: "FORJA",
        body: "Altares para cascos, tronos para mandos y santuarios de cables — impresos con precisión para setups que compiten bajo el neón.",
      },
      {
        index: "02",
        title: "Bóvedas TCG",
        tag: "ARCHIVO",
        body: "Núcleos magnéticos para mazos, vitrinas para slabs y organizadores de torneo — forjados en Canarias para coleccionistas que tratan las cartas como reliquias.",
      },
      {
        index: "03",
        title: "Fabricación de la Isla",
        tag: "ORIGEN",
        body: "Cada pieza emerge de Canarias — impresión 3D a medida con acabados violeta y precisión dimensional.",
      },
    ],
  },
  depths: {
    sectionLabel: "Registro de artefactos",
    heading: "Catalogado desde las profundidades violetas",
    intro:
      "No es una tienda — es un archivo narrativo de piezas nacidas en nuestras impresoras isleñas. Cada artefacto lleva un nombre en clave, un reino y una historia.",
  },
  cta: {
    region: "Canarias • Impresión 3D",
    heading: "Entra a la Forja",
    body: "Proyectos a medida, fabricación B2B y configuradores aguardan más allá de este umbral. La impresora nunca exigió un clic — solo tu descenso por el vacío.",
    explore: "Explorar el reino",
    configurator: "Configurador 3D",
  },
  footer: "3D ISLAND — CANARIAS — FORJA MMXXVI",
  productCard: {
    catalogued: "Artefacto catalogado",
  },
} as const;

export const HOME_ARTIFACTS: Artifact[] = [
  {
    id: "ARC-01",
    codename: "Trono de Agarre Neón",
    realm: "GAMING",
    descriptor: "Estación de mando PS5",
    glyph: "🎮",
    lore: "Forjado para setups competitivos — un trono neón que suspende tu mando entre partidas.",
  },
  {
    id: "ARC-02",
    codename: "Soporte Corona Fantasma",
    realm: "GAMING",
    descriptor: "Altar Gengar para cascos",
    glyph: "😈",
    lore: "Arquitectura de resina violeta inspirada en reinos sombríos. Tu casco descansa como reliquia, no como accesorio.",
  },
  {
    id: "ARC-03",
    codename: "Bóveda Magnética",
    realm: "TCG",
    descriptor: "Núcleo de preservación de mazos",
    glyph: "📦",
    lore: "Sello magnético para mazos Pokémon y MTG — la protección como ritual, no como plástico.",
  },
  {
    id: "ARC-04",
    codename: "Prisma de Exhibición",
    realm: "TCG",
    descriptor: "Monolito para slabs gradadas",
    glyph: "💎",
    lore: "Un prisma vertical para cartas gradadas — la luz se refracta en acrílico violeta como artefacto de museo.",
  },
];
