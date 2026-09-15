"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ShopNav from "@/components/shop/ShopNav";
import { useCartStore } from "@/store/cart.store";
import { useHydration } from "@/store/useHydration";
import { SHOP_PRODUCTS, type ShopCategoryId } from "@/lib/shop/products";

const REQUEST_TYPES = [
  { id: "personal", label: "Creación personal", icon: "🎨", desc: "Pieza única para uso personal" },
  { id: "business", label: "Pedido empresa", icon: "🏢", desc: "Producción en volumen para negocio" },
  { id: "merch", label: "Merch & Branding", icon: "🎭", desc: "Merchandising con tu logo o diseño" },
  { id: "events", label: "Torneos & Eventos", icon: "🏆", desc: "Trofeos, displays y piezas para eventos" },
  { id: "streamer", label: "Streamer & Creator", icon: "🎮", desc: "Setup personalizado para creadores" },
  { id: "prototype", label: "Prototipo", icon: "🔬", desc: "Primer prototipo de tu diseño" },
];

export default function CustomRequestPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [navCategory, setNavCategory] = useState<ShopCategoryId>("all");
  const [submitted, setSubmitted] = useState(false);

  const rawCartCount = useCartStore((s) => s.cartCount());
  const hydrated = useHydration();
  const safeCartCount = hydrated ? rawCartCount : 0;

  const categoryCounts = useMemo(() => {
    const counts: Record<ShopCategoryId, number> = { all: SHOP_PRODUCTS.length, gaming: 0, tcg: 0, custom: 0, accesorios: 0 };
    for (const p of SHOP_PRODUCTS) counts[p.category] += 1;
    return counts;
  }, []);

  const [form, setForm] = useState({
    type: "", name: "", email: "", company: "", description: "",
    quantity: "1", budget: "", deadline: "", commercial: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value }));
  };

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); setSubmitted(true); };

  const navProps = {
    search, onSearchChange: (v: string) => { setSearch(v); router.push(`/shop?q=${v}`); },
    cartCount: safeCartCount, onCartOpen: () => router.push("/cart"),
    category: navCategory, onCategoryChange: (cat: ShopCategoryId) => { setNavCategory(cat); router.push("/shop"); },
    categoryCounts,
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#F8F8F8]">
        <ShopNav {...navProps} />
        <div className="flex min-h-[80vh] flex-col items-center justify-center px-6 text-center">
          <span className="text-6xl">✅</span>
          <h2 className="mt-6 text-2xl font-black text-gray-900">Solicitud enviada</h2>
          <p className="mt-2 max-w-md text-gray-500">Hemos recibido tu solicitud. Un artista se pondrá en contacto contigo en menos de 24 horas.</p>
          <Link href="/shop" className="mt-8 rounded-full bg-gray-900 hover:bg-gray-700 px-8 py-3 text-sm font-semibold text-white transition-colors">
            Volver a la tienda
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F8F8]">
      <ShopNav {...navProps} />

      <div className="mx-auto max-w-[900px] px-6 pb-24 pt-10 md:px-8">
        <div className="mb-10 text-center">
          <span className="text-5xl">✏️</span>
          <h1 className="mt-4 text-3xl font-black text-gray-900">Solicitar creación personalizada</h1>
          <p className="mt-3 text-base text-gray-500">¿No encuentras lo que buscas? Cuéntanos tu idea y nuestros artistas la harán realidad.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Tipo */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6">
            <h2 className="mb-4 font-bold text-gray-900">¿Qué tipo de creación necesitas?</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {REQUEST_TYPES.map((type) => (
                <button key={type.id} type="button"
                  onClick={() => setForm((prev) => ({ ...prev, type: type.id }))}
                  className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 text-center transition-all ${
                    form.type === type.id
                      ? "border-gray-900 bg-gray-50"
                      : "border-gray-200 hover:border-gray-400"
                  }`}>
                  <span className="text-3xl">{type.icon}</span>
                  <span className="text-xs font-bold text-gray-900">{type.label}</span>
                  <span className="text-[0.65rem] text-gray-400">{type.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Contacto */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6">
            <h2 className="mb-4 font-bold text-gray-900">Datos de contacto</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {[
                { name: "name", label: "Nombre *", type: "text", placeholder: "Tu nombre", required: true },
                { name: "email", label: "Email *", type: "email", placeholder: "tu@email.com", required: true },
              ].map((field) => (
                <div key={field.name} className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{field.label}</label>
                  <input type={field.type} name={field.name} value={(form as any)[field.name]}
                    onChange={handleChange} required={field.required} placeholder={field.placeholder}
                    className="rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100" />
                </div>
              ))}
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Empresa / Organización</label>
                <input type="text" name="company" value={form.company} onChange={handleChange}
                  placeholder="Opcional — para pedidos B2B"
                  className="rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-gray-400" />
              </div>
            </div>
          </div>

          {/* Proyecto */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6">
            <h2 className="mb-4 font-bold text-gray-900">Describe tu proyecto</h2>
            <div className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Descripción detallada *</label>
                <textarea name="description" value={form.description} onChange={handleChange}
                  required rows={4} placeholder="Describe tu idea con el máximo detalle posible: materiales, colores, dimensiones, uso final..."
                  className="rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-gray-400 resize-none" />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Cantidad</label>
                  <select name="quantity" value={form.quantity} onChange={handleChange}
                    className="rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-gray-400">
                    {["1", "2-5", "6-10", "11-50", "50+"].map((q) => (
                      <option key={q} value={q}>{q} unidades</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Presupuesto aprox.</label>
                  <select name="budget" value={form.budget} onChange={handleChange}
                    className="rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-gray-400">
                    <option value="">Sin definir</option>
                    {["< 50€", "50-150€", "150-500€", "500-1000€", "> 1000€"].map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Fecha límite</label>
                  <input type="date" name="deadline" value={form.deadline} onChange={handleChange}
                    className="rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-gray-400" />
                </div>
              </div>

              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-gray-200 p-4 hover:border-gray-400 transition-colors">
                <input type="checkbox" name="commercial" checked={form.commercial} onChange={handleChange}
                  className="mt-0.5 h-4 w-4 accent-gray-900 rounded" />
                <div>
                  <p className="text-sm font-semibold text-gray-900">Uso comercial</p>
                  <p className="text-xs text-gray-400">Marca esta opción si el producto será usado con fines comerciales, para venta o representación de marca.</p>
                </div>
              </label>
            </div>
          </div>

          {/* Submit — negro */}
          <button type="submit"
            className="w-full rounded-full bg-gray-900 hover:bg-gray-700 py-4 text-sm font-bold text-white transition-colors shadow-sm">
            Enviar solicitud →
          </button>

          <p className="text-center text-xs text-gray-400">Un artista te responderá en menos de 24 horas. Sin compromiso.</p>
        </form>
      </div>
    </div>
  );
}