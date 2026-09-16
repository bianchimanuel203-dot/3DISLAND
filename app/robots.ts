import type { MetadataRoute } from "next";

const SITE_URL = "https://3disland.es";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/account",
        "/account/",
        "/cart",
        "/checkout",
        "/checkout/",
        "/configurator",
        "/auth/",
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
