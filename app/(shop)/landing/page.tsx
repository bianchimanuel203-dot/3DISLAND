"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/store/cart.store";
import { useSidecartStore } from "@/store/sidecart.store";
import { useHydration } from "@/store/useHydration";
import { SHOP_PRODUCTS, formatPrice } from "@/lib/shop/products";
import { SplineScene } from "@/components/ui/spline-scene";
import RetroGrid from "@/components/ui/retro-grid";
import { ZoomParallax } from "@/components/ui/zoom-parallax";
import { GlowCard } from "@/components/ui/spotlight-card";
import ButtonColorful from "@/components/ui/button-colorful";
import Link from "next/link";

const FEATURED = SHOP_PRODUCTS.slice(0, 6);

const TESTIMONIALS = [
  { name: "Carlos M.", location: "Madrid", rating: 5, text: "Calidad increíble. Llegó desde Fuerteventura en 3 días y el acabado es perfecto.", avatar: "C" },
  { name: "Laura G.", location: "Barcelona", rating: 5, text: "El soporte para auriculares es exactamente lo que buscaba. Muy sólido.", avatar: "L" },
  { name: "Marcos T.", location: "Valencia", rating: 4, text: "Buen producto, diseño bonito. Lo recomiendo.", avatar: "M" },
  { name: "Sofía R.", location: "Sevilla", rating: 5, text: "Impresionante precisión. Se nota que está fabricado con cuidado.", avatar: "S" },
];

const FAQS = [
  { q: "¿Cuánto tarda en llegar?", a: "Fabricamos bajo demanda en Fuerteventura. El tiempo de producción es 2-4 días laborables + envío (1-3 días España peninsular)." },
  { q: "¿Puedo personalizar un producto?", a: "Sí. Puedes enviarnos tu diseño STL o describirnos lo que necesitas y te hacemos un presupuesto en 24h." },
  { q: "¿Qué materiales usáis?", a: "Resina de alta densidad y PLA premium. Acabado mate violeta característico de 3D Island." },
  { q: "¿Hacéis devoluciones?", a: "Sí, tienes 14 días para devolver si algo no está bien. Defectos de fabricación cubiertos al 100%." },
  { q: "¿Envíais fuera de España?", a: "Sí, enviamos a toda Europa. Consulta costes de envío en el checkout." },
];

const STEPS = [
  { n: "01", title: "Elige tu pieza", desc: "Explora el catálogo o cuéntanos tu idea personalizada.", emoji: "🔍" },
  { n: "02", title: "Fabricamos en Canarias", desc: "Imprimimos tu pedido a mano en Fuerteventura con acabado premium.", emoji: "🖨️" },
  { n: "03", title: "Lo recibes en casa", desc: "Envío seguro a toda España y Europa en 3-7 días.", emoji: "📦" },
];

const PARALLAX_IMAGES = [
  { src: "/products/producto-1.png", alt: "Impresora 3D Island fabricando" },
  { src: "/products/producto-2.png", alt: "Cabezal impresora 3D filamento" },
  { src: "/products/producto-3.png", alt: "Impresora 3D transparente" },
  { src: "/products/producto-4.png", alt: "Pieza geométrica naranja" },
  { src: "/products/producto-5.png", alt: "Pieza holográfica imprimiéndose" },
  { src: "/products/producto-6.png", alt: "Boquilla impresión 3D" },
  { src: "/products/producto-7.png", alt: "Logo 3D Island" },
];

const CATS = [
  { id: "gaming", emoji: "🎮", title: "Gaming & Docks", desc: "Soportes para mandos, docks para Switch, organizadores gaming", color: "purple" as const, href: "/shop?category=gaming", count: 4 },
  { id: "tcg", emoji: "🃏", title: "TCG & Displays", desc: "Expositores para cartas, displays PSA, slab altares", color: "blue" as const, href: "/shop?category=tcg", count: 4 },
  { id: "custom", emoji: "🏝️", title: "Custom Canarias", desc: "Diseños únicos inspirados en las islas, piezas personalizadas", color: "green" as const, href: "/shop?category=custom", count: 2 },
  { id: "accesorios", emoji: "🧩", title: "Accesorios", desc: "Organizadores de escritorio, posavasos, keycap shrines", color: "orange" as const, href: "/shop?category=accesorios", count: 2 },
];

type Product = typeof FEATURED[0];

const HOLO_STYLES = `
  .product-card-holo {
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }
  .product-card-holo::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: 16px;
    background: radial-gradient(
      120px 120px at var(--x, 50%) var(--y, 50%),
      rgba(155,125,212,0.15) 0%,
      transparent 70%
    );
    pointer-events: none;
    z-index: 1;
  }
  .product-card-holo::after {
    content: "";
    position: absolute;
    inset: -1px;
    border-radius: 17px;
    background: radial-gradient(
      80px 80px at var(--x, 50%) var(--y, 50%),
      rgba(155,125,212,0.5) 0%,
      transparent 70%
    );
    pointer-events: none;
    z-index: 0;
    mask: linear-gradient(black, black) padding-box, linear-gradient(black, black);
    mask-clip: padding-box, border-box;
    mask-composite: exclude;
    -webkit-mask-composite: destination-out;
  }
`;

function Stars({ n }: { n: number }) {
  return (
    <span>
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} className={i <= n ? "text-amber-400" : "text-gray-500"}>★</span>
      ))}
    </span>
  );
}

function CountUp({ to, suffix = "" }: { to: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const duration = 2000;
    const steps = 60;
    const increment = to / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= to) { setCount(to); clearInterval(timer); }
      else setCount(Math.floor(current));
    }, duration / steps);
    return () => clearInterval(timer);
  }, [inView, to]);

  return <span ref={ref}>{count.toLocaleString("es-ES")}{suffix}</span>;
}

function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function QuickViewModal({ product, onClose, onAdd }: { product: Product; onClose: () => void; onAdd: () => void }) {
  const originalPrice = +(product.price * 1.25).toFixed(2);
  const discount = Math.round((1 - product.price / originalPrice) * 100);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => { document.body.style.overflow = ""; document.removeEventListener("keydown", handler); };
  }, [onClose]);

  const handleAdd = () => {
    for (let i = 0; i < qty; i++) onAdd();
    setAdded(true);
    setTimeout(() => { setAdded(false); onClose(); }, 1200);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 bg-[#1a1a1a] border border-white/15 rounded-2xl overflow-hidden max-w-2xl w-full shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <button type="button" onClick={onClose}
          className="absolute top-4 right-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition">✕</button>
        <div className="flex flex-col md:flex-row">
          <div className="relative flex items-center justify-center bg-gradient-to-b from-[#1a1a2e] to-[#0d0d1a] h-64 md:h-auto md:w-64 shrink-0">
            <motion.span className="text-8xl select-none"
              animate={{ rotate: [0, 5, -5, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
              {product.glyph}
            </motion.span>
            <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">-{discount}%</span>
            {product.tag && <span className="absolute top-3 right-3 text-white text-xs font-bold px-2 py-1 rounded"
              style={{ background: "linear-gradient(135deg, #06b6d4, #9B7DD4)" }}>{product.tag}</span>}
          </div>
          <div className="flex flex-col gap-4 p-6 flex-1">
            <div>
              <p className="text-[#9B7DD4] text-xs font-bold uppercase tracking-widest mb-1">{product.category}</p>
              <h2 className="text-xl font-black text-white leading-tight">{product.name}</h2>
              <div className="flex items-center gap-2 mt-2">
                <Stars n={5} />
                <span className="text-xs text-gray-300">4.8 (127 reseñas)</span>
              </div>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed">{product.description}</p>
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-black text-white">{formatPrice(product.price)}</span>
              <span className="text-sm text-gray-400 line-through">{formatPrice(originalPrice)}</span>
              <span className="text-sm text-red-400 font-bold">-{discount}%</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-300">
              <span className="h-2 w-2 rounded-full bg-green-400 inline-block" />
              En stock · Fabricado bajo demanda · Fuerteventura
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-300">Cantidad:</span>
              <div className="flex items-center rounded-lg border border-white/15 overflow-hidden">
                <button type="button" onClick={() => setQty(Math.max(1, qty - 1))} className="px-3 py-2 text-white hover:bg-white/10 transition">−</button>
                <span className="w-8 text-center text-sm text-white font-semibold">{qty}</span>
                <button type="button" onClick={() => setQty(qty + 1)} className="px-3 py-2 text-white hover:bg-white/10 transition">+</button>
              </div>
            </div>
            <div className="flex gap-3 mt-auto">
              <ButtonColorful onClick={handleAdd} className="flex-1 h-11">
                {added ? "✓ ¡Añadido!" : "Añadir al carrito"}
              </ButtonColorful>
              <Link href={`/shop/product/${product.id}`} onClick={onClose}
                className="px-4 rounded-full border border-white/20 hover:border-[#9B7DD4] text-sm text-white text-center flex items-center transition">
                Ver más
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-300">
              <span>🔒 Pago seguro Stripe</span>
              <span>↩️ Devolución 14 días</span>
              <span>📦 Envío gratis</span>
              <span>🖨️ Hecho en Canarias</span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Navbar({ cartCount, onCartOpen }: { cartCount: number; onCartOpen: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-black/95 backdrop-blur-md shadow-lg" : "bg-transparent"}`}
      initial={{ y: -80 }} animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
        <motion.span className="text-xl font-black tracking-tight text-white" whileHover={{ scale: 1.05 }}>
          3D<span className="text-[#9B7DD4]">ISLAND</span>
          <span className="text-xs font-normal text-gray-300 ml-1">.es</span>
        </motion.span>
        <nav className="hidden md:flex items-center gap-8 text-sm text-gray-200">
          <a href="#productos" className="hover:text-white transition">Productos</a>
          <a href="#como-funciona" className="hover:text-white transition">Cómo funciona</a>
          <a href="#custom" className="hover:text-white transition">Custom</a>
          <a href="#faq" className="hover:text-white transition">FAQ</a>
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/shop">
            <ButtonColorful className="hidden md:flex text-xs px-4 h-9">
              Ir a la tienda
            </ButtonColorful>
          </Link>
          <motion.button type="button" onClick={onCartOpen}
            className="relative flex items-center gap-2 rounded-full bg-white/15 hover:bg-white/25 px-4 py-2 text-sm text-white transition"
            whileTap={{ scale: 0.95 }}>
            🛒
            {cartCount > 0 && (
              <motion.span key={cartCount} initial={{ scale: 0 }} animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#9B7DD4] text-[10px] font-bold text-white">
                {cartCount}
              </motion.span>
            )}
            <span className="hidden sm:block">Cesta</span>
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
}

function Hero({ onShopClick }: { onShopClick: () => void }) {
  return (
    <section className="relative min-h-screen bg-black/[0.96] overflow-hidden flex items-center">
      <svg
        className="animate-spotlight pointer-events-none absolute z-[1] h-[169%] w-[138%] lg:w-[84%] opacity-0 -top-40 left-0 md:left-60 md:-top-20"
        xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3787 2842" fill="none"
      >
        <g filter="url(#spotlight-filter)">
          <ellipse cx="1924.71" cy="273.501" rx="1924.71" ry="273.501"
            transform="matrix(-0.822377 -0.568943 -0.568943 0.822377 3631.88 2291.09)"
            fill="white" fillOpacity="0.21" />
        </g>
        <defs>
          <filter id="spotlight-filter" x="0.860352" y="0.838989" width="3785.16" height="2840.26"
            filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
            <feGaussianBlur stdDeviation="151" result="effect1_foregroundBlur_1065_8" />
          </filter>
        </defs>
      </svg>

      <div className="absolute inset-0 z-0">
        <SplineScene
          scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
          className="w-full h-full"
        />
      </div>
      <div className="absolute inset-0 z-[2] bg-gradient-to-r from-black/95 via-black/70 to-transparent" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-24">
        <div className="max-w-xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#9B7DD4]/40 bg-[#9B7DD4]/10 px-4 py-2 text-sm text-[#C4B0E8] backdrop-blur-sm"
          >
            <span className="animate-pulse">●</span>
            Fabricado a mano en Fuerteventura, Canarias
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl md:text-6xl lg:text-7xl font-black text-white leading-none tracking-tight mb-6"
          >
            Piezas 3D<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#9B7DD4] to-[#C4B0E8]">únicas</span><br />
            para ti
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg text-gray-200 max-w-md mb-10"
          >
            Gaming, TCG, accesorios y diseños personalizados. Cada pieza impresa bajo demanda con acabado premium.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 mb-16"
          >
            <ButtonColorful onClick={onShopClick} className="px-8 h-12 text-base">
              Ver productos →
            </ButtonColorful>
            <motion.a href="#custom"
              className="rounded-full border-2 border-white/40 hover:border-white/80 px-8 py-3 text-base font-bold text-white transition flex items-center justify-center hover:bg-white/5"
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              Solicitar custom
            </motion.a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="flex flex-wrap gap-4"
          >
            {[
              { to: 12000, suffix: "+", label: "Piezas fabricadas" },
              { to: 8500, suffix: "+", label: "Clientes satisfechos" },
              { to: 3, suffix: " años", label: "Experiencia" },
              { to: 100, suffix: "%", label: "Hecho en Canarias" },
            ].map((s) => (
              <div key={s.label} className="backdrop-blur-sm bg-white/10 rounded-xl px-5 py-3 border border-white/20">
                <p className="text-xl font-black text-white"><CountUp to={s.to} suffix={s.suffix} /></p>
                <p className="text-xs text-gray-200">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-300 z-10"
        animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}
      >
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </motion.div>
    </section>
  );
}

function TrustBar() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const items = [
    { icon: "🖨️", title: "Fabricado a mano", desc: "En Fuerteventura" },
    { icon: "🔒", title: "Pago seguro", desc: "Stripe certificado" },
    { icon: "↩️", title: "14 días", desc: "Para devoluciones" },
    { icon: "♻️", title: "Sin stock muerto", desc: "Bajo demanda" },
  ];
  return (
    <section ref={ref} className="bg-[#141414] border-y border-white/10 py-6">
      <div className="mx-auto max-w-7xl px-6 grid grid-cols-2 md:grid-cols-4 gap-6">
        {items.map((item, i) => (
          <motion.div key={item.title}
            initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="flex items-center gap-3"
          >
            <span className="text-2xl">{item.icon}</span>
            <div>
              <p className="text-sm font-bold text-white">{item.title}</p>
              <p className="text-xs text-gray-300">{item.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function CategoriesSection() {
  return (
    <section className="bg-[#0d0d0d] py-24 px-6">
      <div className="mx-auto max-w-7xl">
        <FadeIn className="text-center mb-16">
          <p className="text-[#9B7DD4] text-sm font-semibold uppercase tracking-widest mb-3">Categorías</p>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Explora por categoría</h2>
          <p className="text-gray-300 max-w-xl mx-auto">Cada categoría, fabricada a mano en Fuerteventura.</p>
        </FadeIn>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CATS.map((cat, i) => (
            <FadeIn key={cat.id} delay={i * 0.1}>
              <Link href={cat.href}>
                <GlowCard glowColor={cat.color} customSize
                  className="w-full p-6 flex flex-col gap-4 cursor-pointer group transition-transform hover:-translate-y-1 duration-300 min-h-[200px]"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-5xl">{cat.emoji}</span>
                    <span className="text-xs text-gray-300 bg-white/10 px-2 py-1 rounded-full">{cat.count} productos</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#9B7DD4] transition-colors">{cat.title}</h3>
                    <p className="text-sm text-gray-300 leading-relaxed">{cat.desc}</p>
                  </div>
                  <div className="flex items-center gap-1 text-[#9B7DD4] text-sm font-medium mt-auto">
                    Ver categoría
                    <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>→</motion.span>
                  </div>
                </GlowCard>
              </Link>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

function ZoomParallaxSection() {
  return (
    <div className="relative bg-[#0d0d0d]">
      <div className="absolute top-0 left-0 right-0 z-10 flex flex-col items-center justify-center pt-20 text-center pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 rounded-full border border-[#9B7DD4]/40 bg-[#9B7DD4]/10 px-4 py-2 text-sm text-[#C4B0E8] backdrop-blur-sm mb-4"
        >
          ✦ Cada pieza es única
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-4xl md:text-6xl font-black text-white"
        >
          Hecho en{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9B7DD4] to-[#C4B0E8]">Canarias</span>
        </motion.h2>
      </div>
      <ZoomParallax images={PARALLAX_IMAGES} />
    </div>
  );
}

function ProductCard({ product, onAdd, onQuickView }: { product: Product; onAdd: () => void; onQuickView: () => void }) {
  const [added, setAdded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const originalPrice = +(product.price * 1.25).toFixed(2);
  const discount = Math.round((1 - product.price / originalPrice) * 100);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 15;
    const rotateY = (centerX - x) / 15;
    cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    cardRef.current.style.setProperty("--x", `${x}px`);
    cardRef.current.style.setProperty("--y", `${y}px`);
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)";
  };

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAdd();
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <>
      <style>{HOLO_STYLES}</style>
      <div
        ref={cardRef}
        className="product-card-holo group relative bg-[#1a1a1a] rounded-2xl overflow-hidden border border-white/10 cursor-pointer"
        style={{ transformStyle: "preserve-3d" }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={onQuickView}
      >
        <div className="relative flex items-center justify-center bg-gradient-to-b from-[#1a1a2e] to-[#0d0d1a] h-52 overflow-hidden"
          style={{ transform: "translateZ(10px)" }}>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-[#9B7DD4]/10 blur-2xl" />
          </div>
          <motion.span className="text-7xl select-none relative z-10"
            whileHover={{ scale: 1.15, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}>
            {product.glyph}
          </motion.span>
          <span className="absolute top-3 left-3 bg-red-500 text-white text-[0.6rem] font-bold px-2 py-0.5 rounded-sm z-10">-{discount}%</span>
          {product.tag && (
            <span className="absolute top-3 right-3 text-white text-[0.6rem] font-bold px-2 py-0.5 rounded-sm z-10"
              style={{ background: "linear-gradient(135deg, #06b6d4, #9B7DD4)" }}>
              {product.tag}
            </span>
          )}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition bg-black/20 z-10">
            <span className="text-white text-xs font-semibold bg-black/60 px-3 py-1.5 rounded-full backdrop-blur-sm">Vista rápida</span>
          </div>
          <AnimatePresence>
            {added && (
              <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }}
                className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-20">
                <motion.div initial={{ scale: 0 }} animate={{ scale: [0, 1.3, 1] }} transition={{ duration: 0.4, times: [0, 0.6, 1] }}
                  className="flex flex-col items-center gap-2">
                  <span className="text-4xl">✓</span>
                  <span className="text-white text-sm font-bold">¡Añadido!</span>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
          <motion.button type="button" onClick={handleAdd}
            className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 flex h-9 w-9 items-center justify-center rounded-full text-white shadow-lg z-20"
            style={{ background: "linear-gradient(135deg, #06b6d4, #9B7DD4)" }}
            whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}>+
          </motion.button>
        </div>
        <div className="p-4 border-t border-white/5 relative z-10" style={{ transform: "translateZ(5px)" }}>
          <h3 className="text-sm font-bold text-white line-clamp-2 mb-2">{product.name}</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-black text-white">{formatPrice(product.price)}</span>
            <span className="text-xs text-gray-400 line-through">{formatPrice(originalPrice)}</span>
            <span className="text-xs text-red-400 font-bold">-{discount}%</span>
          </div>
          <p className="text-xs text-gray-300 mt-1 flex items-center gap-1">
            <span className="text-green-400">●</span> Envío gratis · Canarias
          </p>
        </div>
      </div>
    </>
  );
}

function ProductsSection({ onAdd }: { onAdd: (p: Product) => void }) {
  const [quickView, setQuickView] = useState<Product | null>(null);
  return (
    <section id="productos" className="bg-[#141414] py-24 px-6">
      <div className="mx-auto max-w-7xl">
        <FadeIn className="text-center mb-16">
          <p className="text-[#9B7DD4] text-sm font-semibold uppercase tracking-widest mb-3">Catálogo</p>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Nuestros productos</h2>
          <p className="text-gray-300 max-w-xl mx-auto">Piezas únicas fabricadas bajo demanda. Cada una con acabado premium.</p>
        </FadeIn>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {FEATURED.map((p, i) => (
            <FadeIn key={p.id} delay={i * 0.08}>
              <ProductCard product={p} onAdd={() => onAdd(p)} onQuickView={() => setQuickView(p)} />
            </FadeIn>
          ))}
        </div>
        <FadeIn className="text-center mt-12">
          <Link href="/shop">
            <ButtonColorful className="px-10 h-12 text-base">
              Ver todo el catálogo →
            </ButtonColorful>
          </Link>
        </FadeIn>
      </div>
      <AnimatePresence>
        {quickView && <QuickViewModal product={quickView} onClose={() => setQuickView(null)} onAdd={() => onAdd(quickView)} />}
      </AnimatePresence>
    </section>
  );
}

function HowItWorks() {
  return (
    <section id="como-funciona" className="relative py-24 px-6 overflow-hidden">
      <div className="absolute inset-0 opacity-40">
        <RetroGrid gridColor="#9B7DD4" showScanlines={false} glowEffect={true} />
      </div>
      <div className="absolute inset-0 bg-black/55" />
      <div className="relative z-10 mx-auto max-w-7xl">
        <FadeIn className="text-center mb-16">
          <p className="text-[#9B7DD4] text-sm font-semibold uppercase tracking-widest mb-3">Proceso</p>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Cómo funciona</h2>
        </FadeIn>
        <div className="grid md:grid-cols-3 gap-8">
          {STEPS.map((step, i) => (
            <FadeIn key={step.n} delay={i * 0.15}>
              <motion.div
                className="relative bg-black/50 backdrop-blur-sm rounded-2xl p-8 border border-white/15"
                whileHover={{ borderColor: "rgba(155,125,212,0.6)", y: -4, backgroundColor: "rgba(0,0,0,0.7)" }}
              >
                <span className="text-5xl mb-6 block">{step.emoji}</span>
                <span className="text-[#9B7DD4] text-xs font-bold tracking-widest">{step.n}</span>
                <h3 className="text-xl font-bold text-white mt-2 mb-3">{step.title}</h3>
                <p className="text-gray-300 text-sm leading-relaxed">{step.desc}</p>
                {i < STEPS.length - 1 && (
                  <div className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 text-[#9B7DD4] text-2xl z-10">→</div>
                )}
              </motion.div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

function CustomSection() {
  return (
    <section id="custom" className="relative py-24 px-6 overflow-hidden">
      <motion.div className="absolute inset-0"
        animate={{
          background: [
            "radial-gradient(ellipse at 0% 50%, #4A1D96 0%, #0a0a0a 70%)",
            "radial-gradient(ellipse at 100% 50%, #1E3A5F 0%, #0a0a0a 70%)",
            "radial-gradient(ellipse at 0% 50%, #4A1D96 0%, #0a0a0a 70%)",
          ],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      />
      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <FadeIn>
          <span className="text-6xl mb-6 block">🖨️</span>
          <h2 className="text-4xl md:text-6xl font-black text-white mb-6">
            ¿Tienes un diseño?<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9B7DD4] to-[#C4B0E8]">Lo fabricamos.</span>
          </h2>
          <p className="text-gray-200 text-lg mb-10 max-w-2xl mx-auto">
            Envíanos tu archivo STL o cuéntanos tu idea. Te damos presupuesto en 24 horas. Sin moldes, sin mínimos.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/custom-request">
              <ButtonColorful className="px-8 h-12 text-base">
                Solicitar presupuesto →
              </ButtonColorful>
            </Link>
            <motion.a href="mailto:hola@3disland.es"
              className="rounded-full border-2 border-white/40 hover:border-white/80 px-8 py-3 text-base font-bold text-white transition flex items-center justify-center hover:bg-white/5"
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              Escribirnos por email
            </motion.a>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

function Testimonials() {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setCurrent(c => (c + 1) % TESTIMONIALS.length), 4000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="bg-[#141414] py-24 px-6">
      <div className="mx-auto max-w-4xl">
        <FadeIn className="text-center mb-16">
          <p className="text-[#9B7DD4] text-sm font-semibold uppercase tracking-widest mb-3">Opiniones</p>
          <h2 className="text-4xl md:text-5xl font-black text-white">Lo que dicen nuestros clientes</h2>
        </FadeIn>
        <div className="relative overflow-hidden rounded-2xl bg-[#1a1a1a] border border-white/10 p-8 md:p-12 min-h-[220px]">
          <AnimatePresence mode="wait">
            <motion.div key={current}
              initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -60 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
              <Stars n={TESTIMONIALS[current].rating} />
              <p className="text-white text-xl md:text-2xl font-medium mt-4 mb-6 leading-relaxed">"{TESTIMONIALS[current].text}"</p>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full text-white font-bold"
                  style={{ background: "linear-gradient(135deg, #06b6d4, #9B7DD4)" }}>
                  {TESTIMONIALS[current].avatar}
                </div>
                <div>
                  <p className="text-white font-semibold">{TESTIMONIALS[current].name}</p>
                  <p className="text-gray-300 text-sm">{TESTIMONIALS[current].location}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
          <div className="absolute bottom-6 right-6 flex gap-2">
            {TESTIMONIALS.map((_, i) => (
              <button key={i} type="button" onClick={() => setCurrent(i)}
                className={`h-1.5 rounded-full transition-all ${i === current ? "w-6 bg-[#9B7DD4]" : "w-1.5 bg-white/30"}`} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section id="faq" className="bg-[#0d0d0d] py-24 px-6">
      <div className="mx-auto max-w-3xl">
        <FadeIn className="text-center mb-16">
          <p className="text-[#9B7DD4] text-sm font-semibold uppercase tracking-widest mb-3">FAQ</p>
          <h2 className="text-4xl md:text-5xl font-black text-white">Preguntas frecuentes</h2>
        </FadeIn>
        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <FadeIn key={i} delay={i * 0.05}>
              <motion.div className="rounded-xl border border-white/15 overflow-hidden bg-[#1a1a1a]"
                whileHover={{ borderColor: "rgba(155,125,212,0.4)" }}>
                <button type="button" onClick={() => setOpen(open === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left">
                  <span className="text-white font-medium">{faq.q}</span>
                  <motion.span animate={{ rotate: open === i ? 45 : 0 }} className="text-[#9B7DD4] text-xl shrink-0 ml-4">+</motion.span>
                </button>
                <AnimatePresence>
                  {open === i && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                      <p className="px-6 pb-4 text-gray-300 text-sm leading-relaxed">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

function Newsletter() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  return (
    <section className="bg-[#141414] py-24 px-6">
      <FadeIn className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Mantente al día</h2>
        <p className="text-gray-300 mb-8">Nuevos productos, ofertas exclusivas y novedades desde Fuerteventura.</p>
        {sent ? (
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-[#9B7DD4] font-semibold">
            ¡Gracias! Te avisaremos pronto. 🎉
          </motion.p>
        ) : (
          <div className="flex gap-3 max-w-md mx-auto">
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="tu@email.com"
              className="flex-1 rounded-full bg-white/10 border border-white/20 px-5 py-3 text-sm text-white placeholder-gray-400 outline-none focus:border-[#9B7DD4]" />
            <ButtonColorful onClick={() => { if (email) setSent(true); }} className="px-6 h-11">
              Suscribirse
            </ButtonColorful>
          </div>
        )}
      </FadeIn>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-black border-t border-white/10 py-12 px-6">
      <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <span className="text-xl font-black text-white">
            3D<span className="text-[#9B7DD4]">ISLAND</span>
            <span className="text-sm font-normal text-gray-300 ml-1">.es</span>
          </span>
          <p className="text-xs text-gray-400 mt-1">Fabricación bajo demanda · Fuerteventura, Islas Canarias</p>
        </div>
        <div className="flex flex-wrap gap-6 text-sm text-gray-300">
          {[
            { label: "Tienda", href: "/shop" },
            { label: "Custom", href: "/custom-request" },
            { label: "Contacto", href: "mailto:hola@3disland.es" },
            { label: "Privacidad", href: "/privacy" },
            { label: "Términos", href: "/terms" },
          ].map(l => (
            <a key={l.href} href={l.href} className="hover:text-white transition">{l.label}</a>
          ))}
        </div>
        <p className="text-xs text-gray-400">© {new Date().getFullYear()} 3D Island</p>
      </div>
    </footer>
  );
}

export default function LandingPage() {
  const rawCartCount = useCartStore(s => s.cartCount());
  const hydrated = useHydration();
  const cartCount = hydrated ? rawCartCount : 0;
  const addToCart = useCartStore(s => s.addToCart);
  const { open } = useSidecartStore();

  const scrollToProducts = () => {
    document.getElementById("productos")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="bg-black">
      <Navbar cartCount={cartCount} onCartOpen={open} />
      <Hero onShopClick={scrollToProducts} />
      <TrustBar />
      <CategoriesSection />
      <ZoomParallaxSection />
      <ProductsSection onAdd={p => addToCart(p)} />
      <HowItWorks />
      <CustomSection />
      <Testimonials />
      <FAQ />
      <Newsletter />
      <Footer />
    </div>
  );
}