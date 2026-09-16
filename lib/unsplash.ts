const SECTION_QUERIES = {
  product: "3D printing miniature",
  artist: "artist portrait creative",
  hero: "3D printing technology",
  fuerteventura: "Fuerteventura canary islands",
} as const;

export type UnsplashSection = keyof typeof SECTION_QUERIES;

export function isUnsplashSection(value: string): value is UnsplashSection {
  return value in SECTION_QUERIES;
}

// Cacheada por query COMPLETA (sección + discriminador), no solo por sección,
// para que distintas entidades (p.ej. artistas distintos) no compartan la misma foto.
const cache = new Map<string, Promise<string | null>>();

function buildQuery(section: UnsplashSection, discriminator?: string): string {
  const base = SECTION_QUERIES[section];
  return discriminator ? `${base} ${discriminator}` : base;
}

async function fetchUnsplashImage(query: string): Promise<string | null> {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;
  if (!accessKey) return null;

  const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`;

  try {
    const res = await fetch(url, {
      headers: { Authorization: `Client-ID ${accessKey}` },
      next: { revalidate: 60 * 60 * 24 },
    });
    if (!res.ok) return null;

    const data = await res.json();
    return data?.results?.[0]?.urls?.regular ?? null;
  } catch {
    return null;
  }
}

export function getUnsplashImage(section: UnsplashSection, discriminator?: string): Promise<string | null> {
  const query = buildQuery(section, discriminator);
  if (!cache.has(query)) {
    const promise = fetchUnsplashImage(query).then((url) => {
      if (!url) cache.delete(query);
      return url;
    });
    cache.set(query, promise);
  }
  return cache.get(query)!;
}
