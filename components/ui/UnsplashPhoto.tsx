"use client";

import { useEffect, useState } from "react";
import type { UnsplashSection } from "@/lib/unsplash";

// Cacheada por sección + query, no solo por sección, para que cada entidad
// (producto, artista...) pueda pedir su propia foto distinta.
const clientCache = new Map<string, Promise<string | null>>();

function fetchSectionImage(section: UnsplashSection, query?: string): Promise<string | null> {
  const cacheKey = `${section}:${query ?? ""}`;
  if (!clientCache.has(cacheKey)) {
    const params = new URLSearchParams({ section });
    if (query) params.set("q", query);
    clientCache.set(
      cacheKey,
      fetch(`/api/unsplash?${params.toString()}`)
        .then((res) => (res.ok ? res.json() : { url: null }))
        .then((data) => data.url as string | null)
        .catch(() => null)
    );
  }
  return clientCache.get(cacheKey)!;
}

type UnsplashPhotoProps = {
  section: UnsplashSection;
  /** Discriminador opcional (nombre/slug de la entidad) para que no todas las
   * entidades de la misma sección compartan la misma foto cacheada. */
  query?: string;
  alt: string;
  className?: string;
  fallback?: React.ReactNode;
};

export default function UnsplashPhoto({ section, query, alt, className, fallback }: UnsplashPhotoProps) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    fetchSectionImage(section, query).then((result) => {
      if (active) setUrl(result);
    });
    return () => {
      active = false;
    };
  }, [section, query]);

  if (!url) return fallback ? <>{fallback}</> : null;

  return <img src={url} alt={alt} className={className} loading="lazy" />;
}
