import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

const SUPPORTED_LOCALES = ['es', 'en'] as const
const LOCALE_COOKIE = 'NEXT_LOCALE'

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // --- checkout: exige sesión real ---
  if (pathname.startsWith('/checkout')) {
    // Requiere NEXTAUTH_SECRET en el entorno (el mismo valor que usa NextAuth en auth.ts).
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })

    if (!token) {
      const loginUrl = new URL('/auth/login', request.url)
      loginUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  // --- i18n: detecta y persiste el idioma preferido en cookie (sin prefijo de ruta) ---
  if (!request.cookies.has(LOCALE_COOKIE)) {
    const acceptLanguage = request.headers.get('accept-language') ?? ''
    const preferred = acceptLanguage.toLowerCase().startsWith('en') ? 'en' : 'es'
    const response = NextResponse.next()
    response.cookies.set(LOCALE_COOKIE, preferred satisfies (typeof SUPPORTED_LOCALES)[number], {
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
    })
    return response
  }

  return NextResponse.next()
}

export const config = {
  // Corre en todas las páginas (excluye assets, api y archivos con extensión)
  // para poder detectar/persistir el idioma en cualquier ruta.
  matcher: ['/((?!_next|api|.*\\..*).*)'],
}
