import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import type { Role } from '@prisma/client'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          // Récupérer l'utilisateur depuis la base de données
          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email,
            },
          })

          // Vérifier si l'utilisateur existe
          if (!user) {
            return null
          }

          // Comparer le mot de passe avec bcrypt
          const isPasswordValid = await bcrypt.compare(
            credentials.password,
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
          console.error('Auth error:', error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Lors de la première connexion, ajouter l'id et le role au token
      if (user) {
        token.id = user.id
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
  },
  pages: {
    signIn: '/admin/login',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
}
