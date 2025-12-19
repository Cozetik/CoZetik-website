import { withAuth } from 'next-auth/middleware'

export default withAuth({
  callbacks: {
    authorized: ({ token }) => !!token,
  },
  pages: {
    signIn: '/admin/login',
  },
})

// Protéger toutes les routes /admin SAUF /admin/login et /api/auth
export const config = {
  matcher: [
    '/admin/((?!login).*)',
  ],
}
