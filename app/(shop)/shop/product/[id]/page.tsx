import type { Metadata } from "next";
import { SHOP_PRODUCTS } from "@/lib/shop/products";
import ProductPageClient from "./ProductPageClient";

const SITE_URL = "https://3-disland.vercel.app";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = SHOP_PRODUCTS.find((p) => p.id === id);

  if (!product) {
    return { title: "Producto no encontrado" };
  }

  return {
    title: product.name,
    description: product.description,
    alternates: { canonical: `/shop/product/${product.id}` },
    openGraph: {
      type: "website",
      url: `${SITE_URL}/shop/product/${product.id}`,
      title: product.name,
      description: product.description,
      images: [{ url: product.image, alt: product.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: product.description,
      images: [product.image],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const product = SHOP_PRODUCTS.find((p) => p.id === id);

  const jsonLd = product
    ? {
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.name,
        description: product.description,
        image: [product.image, ...(product.gallery ?? [])].map(
          (src) => `${SITE_URL}${src}`
        ),
        sku: product.id,
        category: product.category,
        brand: { "@type": "Brand", name: "3D Island" },
        offers: {
          "@type": "Offer",
          url: `${SITE_URL}/shop/product/${product.id}`,
          priceCurrency: "EUR",
          price: product.price.toFixed(2),
          availability: "https://schema.org/InStock",
          itemCondition: "https://schema.org/NewCondition",
          seller: { "@type": "Organization", name: "3D Island — Fuerteventura" },
        },
      }
    : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <ProductPageClient id={id} />
    </>
  );
}
