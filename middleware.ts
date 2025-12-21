import { auth } from "@/auth"

export default auth((req) => {
  try {
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
  matcher: ['/admin/:path*', '/auth-admin']
}
