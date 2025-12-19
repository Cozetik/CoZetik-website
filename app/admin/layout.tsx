import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { auth } from '@/auth'
import AdminLayoutClient from './layout-client'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Récupérer l'URL actuelle
  const headersList = await headers()
  const pathname = headersList.get('x-pathname') || ''

  // Ne pas vérifier la session pour la page de login
  if (pathname === '/auth-admin') {
    return <>{children}</>
  }

  // Vérifier la session pour toutes les autres pages /admin/*
  const session = await auth()

  if (!session) {
    redirect('/auth-admin')
  }

  return (
    <AdminLayoutClient userEmail={session.user?.email || ''}>
      {children}
    </AdminLayoutClient>
  )
}
