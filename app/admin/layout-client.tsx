'use client'

import { useState } from 'react'
import Sidebar from '@/components/admin/sidebar'
import Header from '@/components/admin/header'
import MobileNav from '@/components/admin/mobile-nav'
import { Toaster } from '@/components/ui/sonner'

interface AdminLayoutClientProps {
  children: React.ReactNode
  userEmail: string
}

export default function AdminLayoutClient({
  children,
  userEmail,
}: AdminLayoutClientProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 lg:block">
        <Sidebar />
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header
          userEmail={userEmail}
          onMenuClick={() => setMobileNavOpen(true)}
        />
        <main className="flex-1 overflow-auto bg-background p-6">
          {children}
        </main>
      </div>

      {/* Mobile Navigation */}
      <MobileNav open={mobileNavOpen} onOpenChange={setMobileNavOpen} />

      {/* Toast Notifications */}
      <Toaster />
    </div>
  )
}
