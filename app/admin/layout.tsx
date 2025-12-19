import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import AdminLayoutClient from './layout-client'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Vérifier la session pour toutes les pages /admin/*
  const session = await auth()

  if (!session) {
    redirect('/login')
  }

  return (
    <AdminLayoutClient userEmail={session.user?.email || ''}>
      {children}
    </AdminLayoutClient>
  )
}
