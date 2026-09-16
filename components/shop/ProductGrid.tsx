"use client";

import Link from "next/link";
import Image from "next/image";
import { type ShopProduct, formatPrice } from "@/lib/shop/products";

type ProductGridProps = {
  products: ShopProduct[];
  onAddToCart: (p: ShopProduct) => void;
};

export default function ProductGrid({ products, onAddToCart }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl bg-white py-20 text-center border border-gray-100">
        <span className="text-5xl">🔍</span>
        <p className="mt-4 font-semibold text-gray-800">No se encontraron productos</p>
        <p className="mt-1 text-sm text-gray-400">Prueba con otra búsqueda o categoría</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {products.map((product) => {
        return (
          <div key={product.id}
            className="group relative flex flex-col bg-white rounded-2xl border border-gray-100 cursor-pointer hover:shadow-md hover:border-gray-200 transition-all duration-200 overflow-hidden">

            {/* Imagen */}
            <Link href={`/shop/product/${product.id}`}
              className="relative block overflow-hidden bg-gray-50"
              style={{ aspectRatio: "1 / 1" }}>
              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover transition-transform duration-300 group-hover:scale-110"
              />

              {/* Badge tag */}
              {product.tag && (
                <span className="absolute top-2 right-2 bg-gray-900 text-white text-[0.6rem] font-bold px-1.5 py-0.5 rounded-full">
                  {product.tag}
                </span>
              )}

              {/* Botón carrito — aparece en hover */}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onAddToCart(product);
                }}
                className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 flex h-9 w-9 items-center justify-center rounded-full bg-gray-900 text-white shadow-md transition-all duration-200 hover:bg-gray-700"
                aria-label="Añadir al carrito"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                </svg>
              </button>
            </Link>

            {/* Info */}
            <Link href={`/shop/product/${product.id}`} className="flex flex-col gap-0.5 p-3 flex-1">
              <h3 className="text-xs text-gray-900 font-medium line-clamp-2 leading-snug" style={{ minHeight: "2.6em" }}>
                {product.name}
              </h3>

              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-sm font-bold text-gray-900">{formatPrice(product.price)}</span>
              </div>

              <span className="text-[0.65rem] text-green-600 font-medium mt-0.5">
                Envío gratis
              </span>
            </Link>
          </div>
        );
      })}
    </div>
  );
}