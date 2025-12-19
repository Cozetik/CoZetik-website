import { auth } from "@/auth"

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const isAdminRoute = req.nextUrl.pathname.startsWith('/admin')
  const isLoginPage = req.nextUrl.pathname === '/auth-admin'

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
})

export const config = {
  matcher: ['/admin/:path*', '/auth-admin']
}
