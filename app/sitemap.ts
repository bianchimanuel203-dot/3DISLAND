import type { MetadataRoute } from "next";
import { SHOP_PRODUCTS, SHOP_CATEGORIES } from "@/lib/shop/products";

const SITE_URL = "https://3-disland.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/landing`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/shop`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/artists`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${SITE_URL}/custom-request`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/legal`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE_URL}/privacy`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE_URL}/cookies`, changeFrequency: "yearly", priority: 0.2 },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = SHOP_CATEGORIES.filter(
    (c) => c.id !== "all"
  ).map((c) => ({
    url: `${SITE_URL}/shop?category=${c.id}`,
    changeFrequency: "daily",
    priority: 0.7,
  }));

  const productRoutes: MetadataRoute.Sitemap = SHOP_PRODUCTS.map((p) => ({
    url: `${SITE_URL}/shop/product/${p.id}`,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
