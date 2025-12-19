import { auth } from "@/auth"

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const isAdminRoute = req.nextUrl.pathname.startsWith('/admin')

  // Protéger toutes les routes /admin/*
  if (isAdminRoute && !isLoggedIn) {
    const loginUrl = new URL('/login', req.nextUrl.origin)
    loginUrl.searchParams.set('callbackUrl', req.nextUrl.pathname)
    return Response.redirect(loginUrl)
  }

  return undefined // Continue normalement si autorisé
})

export const config = {
  matcher: ['/admin/:path*']
}
