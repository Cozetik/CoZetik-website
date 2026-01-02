"use client";

import Header from "@/components/admin/header";
import MobileNav from "@/components/admin/mobile-nav";
import Sidebar from "@/components/admin/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";

interface AdminLayoutClientProps {
  children: React.ReactNode;
  userEmail: string;
}

export default function AdminLayoutClient({
  children,
  userEmail,
}: AdminLayoutClientProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="flex font-sans antialiased">
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 lg:block">
        <Sidebar />
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        <Header
          userEmail={userEmail}
          onMenuClick={() => setMobileNavOpen(true)}
        />
        <main className="flex-1 bg-background p-6 font-sans">{children}</main>
      </div>

      {/* Mobile Navigation */}
      <MobileNav open={mobileNavOpen} onOpenChange={setMobileNavOpen} />

      {/* Toast Notifications */}
      <Toaster />
    </div>
  );
}
