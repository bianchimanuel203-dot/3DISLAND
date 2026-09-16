import type { Metadata } from "next";
import { SHOP_CATEGORIES, type ShopCategoryId } from "@/lib/shop/products";
import ShopPageClient from "./ShopPageClient";

type Props = {
  searchParams: Promise<{ category?: string }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { category } = await searchParams;
  const active = SHOP_CATEGORIES.find((c) => c.id === (category as ShopCategoryId)) ?? SHOP_CATEGORIES[0];

  const title = active.id === "all" ? "Tienda" : active.label;
  const description = `${active.description} — piezas de impresión 3D fabricadas a mano en Fuerteventura, Canarias.`;

  return {
    title,
    description,
    alternates: {
      canonical: active.id === "all" ? "/shop" : `/shop?category=${active.id}`,
    },
    openGraph: {
      title: `${title} | 3D Island`,
      description,
    },
  };
}

export default function ShopPage() {
  return <ShopPageClient />;
}
