"use client";
import Link from "next/link";

const FOOTER_COLS = [
  {
    title: "Conócenos",
    links: [
      { label: "Sobre 3D Island", href: "/about" },
      { label: "Trabaja con nosotros", href: "/jobs" },
      { label: "Sostenibilidad", href: "/sustainability" },
      { label: "Prensa", href: "/press" },
    ],
  },
  {
    title: "Gana dinero con nosotros",
    links: [
      { label: "Vende en 3D Island", href: "/sell" },
      { label: "Vende tu diseño 3D", href: "/sell-design" },
      { label: "Programa de afiliados", href: "/affiliates" },
      { label: "Solicitar creación B2B", href: "/custom-request" },
    ],
  },
  {
    title: "Métodos de pago",
    links: [
      { label: "Métodos de pago", href: "/payment" },
      { label: "Tarjetas regalo", href: "/gift-cards" },
      { label: "Stripe Checkout seguro", href: "/security" },
      { label: "Política de devoluciones", href: "/returns" },
    ],
  },
  {
    title: "¿Necesitas ayuda?",
    links: [
      { label: "Centro de ayuda", href: "/help" },
      { label: "Localizar pedido", href: "/account/orders" },
      { label: "Atención al cliente", href: "/contact" },
      { label: "Aviso de privacidad", href: "/privacy" },
    ],
  },
];

export default function ShopFooter() {
  return (
    <footer>
      {/* Volver arriba — estilo Etsy gris */}
      <div
        className="bg-gray-100 hover:bg-gray-200 cursor-pointer text-center py-3 text-sm font-medium text-gray-700 transition border-t border-gray-200"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        ↑ Volver al principio
      </div>

      {/* Links principales — gris oscuro estilo Etsy */}
      <div className="bg-gray-900 text-white">
        <div className="mx-auto max-w-[1400px] px-8 py-10">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {FOOTER_COLS.map((col) => (
              <div key={col.title}>
                <h3 className="mb-4 text-sm font-bold text-white">{col.title}</h3>
                <ul className="space-y-2">
                  {col.links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href}
                        className="text-sm text-gray-400 hover:text-white transition-colors">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Franja inferior */}
      <div className="bg-gray-950 border-t border-gray-800">
        <div className="mx-auto max-w-[1400px] px-8 py-6 flex flex-col items-center gap-4">
          <span className="text-xl font-black tracking-tight text-white">
            3D<span className="text-gray-300">ISLAND</span>
            <span className="text-sm font-normal text-gray-500 ml-1">.es</span>
          </span>

          {/* Badges de pago */}
          <div className="flex items-center gap-2">
            {["Visa", "Mastercard", "PayPal", "Stripe", "GPay"].map(p => (
              <span key={p} className="text-[0.6rem] font-bold text-gray-500 border border-gray-700 rounded px-1.5 py-0.5">
                {p}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-500">
            {[
              { label: "Condiciones de uso", href: "/terms" },
              { label: "Aviso de privacidad", href: "/privacy" },
              { label: "Cookies", href: "/cookies" },
              { label: "Aviso legal", href: "/legal" },
              { label: "Política de envíos", href: "/shipping" },
            ].map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-gray-300 transition-colors">
                {link.label}
              </Link>
            ))}
          </div>

          <p className="text-xs text-gray-600 text-center">
            © {new Date().getFullYear()} 3D Island — Fabricación bajo demanda en Fuerteventura, Islas Canarias
          </p>
        </div>
      </div>
    </footer>
  );
}