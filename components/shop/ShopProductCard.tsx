"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import type { ShopProduct } from "@/lib/shop/products";
import { formatPrice } from "@/lib/shop/products";
import UnsplashPhoto from "@/components/ui/UnsplashPhoto";

type ShopProductCardProps = {
  product: ShopProduct;
  onAddToCart: (product: ShopProduct) => void;
};

export default function ShopProductCard({ product, onAddToCart }: ShopProductCardProps) {
  const [added, setAdded] = useState(false);
  const originalPrice = +(product.price * 1.25).toFixed(2);
  const discount = Math.round((1 - product.price / originalPrice) * 100);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <Link href={`/shop/product/${product.id}`}>
      <motion.article
        className="group relative bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer"
        whileHover={{ y: -4 }}
        transition={{ type: "spring", stiffness: 400, damping: 28 }}
      >
        {/* Imagen */}
        <div className="relative flex items-center justify-center bg-gray-50 h-52 overflow-hidden">
          <UnsplashPhoto
            section="product"
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
            fallback={<span className="text-7xl select-none">{product.glyph}</span>}
          />

          {/* Badges */}
          <span className="absolute top-3 left-3 bg-red-500 text-white text-[0.6rem] font-bold px-2 py-0.5 rounded-full">
            -{discount}%
          </span>
          {product.tag && (
            <span className="absolute top-3 right-3 bg-gray-900 text-white text-[0.6rem] font-bold px-2 py-0.5 rounded-full">
              {product.tag}
            </span>
          )}

          {/* Feedback añadido */}
          <AnimatePresence>
            {added && (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm"
              >
                <motion.div
                  initial={{ scale: 0 }} animate={{ scale: [0, 1.2, 1] }}
                  transition={{ duration: 0.3, times: [0, 0.6, 1] }}
                  className="flex flex-col items-center gap-1"
                >
                  <span className="text-3xl">✓</span>
                  <span className="text-sm font-bold text-gray-900">¡Añadido!</span>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Info */}
        <div className="p-4">
          {/* Categoría */}
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-1 font-medium">
            {product.category}
          </p>

          {/* Nombre */}
          <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-3 group-hover:text-gray-700 transition-colors">
            {product.name}
          </h3>

          {/* Precio */}
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-lg font-black text-gray-900">{formatPrice(product.price)}</span>
            <span className="text-xs text-gray-400 line-through">{formatPrice(originalPrice)}</span>
            <span className="text-xs text-red-500 font-bold">-{discount}%</span>
          </div>

          {/* Envío */}
          <p className="text-xs text-green-600 font-medium mb-4 flex items-center gap-1">
            <span>●</span> Envío gratis · Canarias
          </p>

          {/* Botón estilo Etsy — negro */}
          <motion.button
            type="button"
            onClick={handleAdd}
            className="w-full rounded-full bg-gray-900 hover:bg-gray-700 py-2.5 text-sm font-semibold text-white transition-colors"
            whileTap={{ scale: 0.97 }}
          >
            {added ? "✓ Añadido a la cesta" : "Añadir a la cesta"}
          </motion.button>
        </div>
      </motion.article>
    </Link>
  );
}