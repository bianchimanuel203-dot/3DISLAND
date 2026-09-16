# 3D Island 🖨️

Marketplace de piezas de impresión 3D fabricadas en Fuerteventura.
Plataforma full-stack con catálogo, carrito, autenticación y pagos.

🔗 [Ver demo](https://3-disland.vercel.app)

---

## Stack

- **Frontend:** Next.js 16 · TypeScript · Tailwind CSS · Shadcn/ui
- **Backend:** Next.js API Routes · Prisma ORM · PostgreSQL (Supabase)
- **Auth:** NextAuth.js (Email + Google OAuth)
- **Pagos:** Stripe (modo test)
- **Storage:** Supabase Storage
- **3D:** Spline
- **i18n:** next-intl (ES/EN)
- **Deploy:** Vercel

---

## Funcionalidades

- Catálogo de productos con fotos reales (Unsplash API)
- Carrito y checkout completo
- Autenticación con email y Google
- Panel de subida de modelos 3D
- Internacionalización español/inglés
- Experiencia 3D con Spline en la landing

---

## Arquitectura

app/ # Next.js App Router (rutas y páginas)
components/ # Componentes reutilizables
lib/ # Supabase, Prisma, utilidades
store/ # Estado global (Zustand)
prisma/ # Schema y migraciones
i18n/ # Configuración de idiomas
messages/ # Traducciones ES/EN


## Instalación local

```bash
git clone https://github.com/bianchimanuel203-dot/3DISLAND.git
cd 3DISLAND
npm install
cp .env.example .env.local
# Rellena las variables de entorno
npm run dev
```

## Variables de entorno necesarias

DATABASE_URL
NEXTAUTH_SECRET
NEXTAUTH_URL
SUPABASE_URL
SUPABASE_ANON_KEY
STRIPE_SECRET_KEY
UNSPLASH_ACCESS_KEY
