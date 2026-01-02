import type { NextAuthConfig } from "next-auth"

/**
 * Configuration légère pour NextAuth - compatible Edge Runtime
 * N'inclut PAS Prisma ni bcrypt (trop lourds pour Edge)
 * Utilisé par le middleware pour la vérification de session
 */
export const authConfig: NextAuthConfig = {
  trustHost: true,
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  providers: [], // Les providers sont définis dans auth.ts (côté serveur uniquement)
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isAdminRoute = nextUrl.pathname.startsWith('/admin')
      const isLoginPage = nextUrl.pathname === '/auth-admin'
      const isAdminLogin = nextUrl.pathname === '/admin/login'

      // Rediriger /admin/login vers /auth-admin
      if (isAdminLogin) {
        return Response.redirect(new URL('/auth-admin', nextUrl.origin))
      }

      // Ne pas rediriger si on est déjà sur la page de login
      if (isLoginPage) {
        return true
      }

      // Protéger toutes les routes /admin/*
      if (isAdminRoute && !isLoggedIn) {
        const loginUrl = new URL('/auth-admin', nextUrl.origin)
        loginUrl.searchParams.set('callbackUrl', nextUrl.pathname)
        return Response.redirect(loginUrl)
      }

      return true
    },
  },
  pages: {
    signIn: "/auth-admin",
  },
  session: {
    strategy: "jwt",
  },
}
