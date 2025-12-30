import { auth } from "@/auth"

// Keep-alive pour Neon DB (évite auto-suspend après 5min)
let lastPing = 0
const PING_INTERVAL = 4 * 60 * 1000 // 4 minutes

export default auth((req) => {
  try {
    // Keep-alive DB : ping toutes les 4 min pour éviter Neon auto-suspend
    const now = Date.now()
    if (now - lastPing > PING_INTERVAL) {
      lastPing = now
      // Fire and forget - ne bloque pas la requête
      fetch(`${req.nextUrl.origin}/api/cron/keep-alive`).catch(() => {})
    }

    const isLoggedIn = !!req.auth
    const isAdminRoute = req.nextUrl.pathname.startsWith('/admin')
    const isLoginPage = req.nextUrl.pathname === '/auth-admin'
    const isAdminLogin = req.nextUrl.pathname === '/admin/login'

    // Rediriger /admin/login vers /auth-admin (au cas où next.config rate)
    if (isAdminLogin) {
      return Response.redirect(new URL('/auth-admin', req.nextUrl.origin))
    }

    // Ne pas rediriger si on est déjà sur la page de login
    if (isLoginPage) {
      return undefined
    }

    // Protéger toutes les routes /admin/* sauf /auth-admin
    if (isAdminRoute && !isLoggedIn) {
      const loginUrl = new URL('/auth-admin', req.nextUrl.origin)
      loginUrl.searchParams.set('callbackUrl', req.nextUrl.pathname)
      return Response.redirect(loginUrl)
    }

    return undefined // Continue normalement si autorisé
  } catch (error) {
    console.error('Middleware error:', error)
    // En cas d'erreur, permettre l'accès pour éviter de bloquer l'application
    return undefined
  }
})

export const config = {
  // Matcher étendu pour capturer plus de routes (pour le keep-alive)
  matcher: [
    '/admin/:path*',
    '/auth-admin',
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ]
}
