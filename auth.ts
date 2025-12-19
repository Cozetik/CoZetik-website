import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import type { Role } from "@prisma/client"

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true, // Requis pour Auth.js v5
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          // Récupérer l'utilisateur depuis la base de données
          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email as string,
            },
          })

          // Vérifier si l'utilisateur existe
          if (!user) {
            return null
          }

          // Comparer le mot de passe avec bcrypt
          const isPasswordValid = await bcrypt.compare(
            credentials.password as string,
            user.password
          )

          if (!isPasswordValid) {
            return null
          }

          // Retourner l'utilisateur si tout est valide
          return {
            id: user.id,
            email: user.email,
            role: user.role,
          }
        } catch (error) {
          console.error("Auth error:", error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Lors de la première connexion, ajouter l'id et le role au token
      if (user) {
        token.id = user.id as string
        token.role = user.role as Role
      }
      return token
    },
    async session({ session, token }) {
      // Ajouter l'id et le role à la session
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as Role
      }
      return session
    },
    authorized({ auth, request }) {
      // Autoriser l'accès si l'utilisateur est connecté
      const isLoggedIn = !!auth?.user
      const isAdminRoute = request.nextUrl.pathname.startsWith('/admin')

      if (isAdminRoute && !isLoggedIn) {
        return false // Bloquer l'accès, middleware redirigera
      }

      return true // Autoriser dans tous les autres cas
    },
  },
  pages: {
    signIn: "/auth-admin",
  },
  session: {
    strategy: "jwt",
  },
})
