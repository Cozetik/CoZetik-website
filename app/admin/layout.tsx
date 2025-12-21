import { auth } from '@/auth'
import AdminLayoutClient from './layout-client'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Le middleware a déjà vérifié l'auth, donc session existe toujours ici
  const session = await auth()

  return (
    <AdminLayoutClient userEmail={session?.user?.email || ''}>
      {children}
    </AdminLayoutClient>
  )
}
