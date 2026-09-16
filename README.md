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
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
SUPABASE_URL
SUPABASE_ANON_KEY
STRIPE_SECRET_KEY
UNSPLASH_ACCESS_KEY
NEXT_PUBLIC_WEB3FORMS_KEY

`NEXT_PUBLIC_WEB3FORMS_KEY` es la access key de [Web3Forms](https://web3forms.com) usada por el formulario de `/custom-request`. Es pública a propósito (Web3Forms está diseñado para llamarse desde el cliente). **Debe estar añadida en Vercel → Settings → Environment Variables antes de cada deploy**, además de en `.env.local` para desarrollo local.

### Login con Google (NextAuth)

El login con Google usa `GOOGLE_CLIENT_ID` y `GOOGLE_CLIENT_SECRET` (ver `auth.ts`). Para que funcione en producción:

1. **Google Cloud Console** → APIs y servicios → Credenciales → tu OAuth Client ID (tipo "Aplicación web").
   - **Authorized redirect URI** debe ser exactamente:
     `https://3-disland.vercel.app/api/auth/callback/google`
   - Para desarrollo local, añade también:
     `http://localhost:3000/api/auth/callback/google`
2. **Vercel** → Project Settings → Environment Variables → añade en **Production** (y en Preview/Development si aplica):
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `NEXTAUTH_URL=https://3-disland.vercel.app` (ya presente)
   - `NEXTAUTH_SECRET` (ya presente)
3. Tras añadir o cambiar variables en Vercel, hay que **volver a desplegar** (los env vars no se aplican a un deployment ya construido).
