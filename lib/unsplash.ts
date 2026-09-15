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

const cache = new Map<UnsplashSection, Promise<string | null>>();

async function fetchUnsplashImage(section: UnsplashSection): Promise<string | null> {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;
  if (!accessKey) return null;

  const query = SECTION_QUERIES[section];
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

export function getUnsplashImage(section: UnsplashSection): Promise<string | null> {
  if (!cache.has(section)) {
    const promise = fetchUnsplashImage(section).then((url) => {
      if (!url) cache.delete(section);
      return url;
    });
    cache.set(section, promise);
  }
  return cache.get(section)!;
}
