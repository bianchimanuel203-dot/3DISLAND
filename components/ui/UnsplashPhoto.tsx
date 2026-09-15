"use client";

import { useEffect, useState } from "react";
import type { UnsplashSection } from "@/lib/unsplash";

const clientCache = new Map<UnsplashSection, Promise<string | null>>();

function fetchSectionImage(section: UnsplashSection): Promise<string | null> {
  if (!clientCache.has(section)) {
    clientCache.set(
      section,
      fetch(`/api/unsplash?section=${section}`)
        .then((res) => (res.ok ? res.json() : { url: null }))
        .then((data) => data.url as string | null)
        .catch(() => null)
    );
  }
  return clientCache.get(section)!;
}

type UnsplashPhotoProps = {
  section: UnsplashSection;
  alt: string;
  className?: string;
  fallback?: React.ReactNode;
};

export default function UnsplashPhoto({ section, alt, className, fallback }: UnsplashPhotoProps) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    fetchSectionImage(section).then((result) => {
      if (active) setUrl(result);
    });
    return () => {
      active = false;
    };
  }, [section]);

  if (!url) return fallback ? <>{fallback}</> : null;

  return <img src={url} alt={alt} className={className} loading="lazy" />;
}
