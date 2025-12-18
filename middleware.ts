import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Permettre l'accès à la page de login sans authentification
        if (req.nextUrl.pathname === '/admin/login') {
          return true
        }

        // Pour toutes les autres routes /admin, vérifier le token
        return !!token
      },
    },
    pages: {
      signIn: '/admin/login',
    },
  }
)

// Protéger toutes les routes commençant par /admin
export const config = {
  matcher: ['/admin/:path*'],
}
