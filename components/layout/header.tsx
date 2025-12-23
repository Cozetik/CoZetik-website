"use client";

import { Button } from "@/components/ui/button";
import { useScrollDirection } from "@/hooks/use-scroll-direction";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";
import { MobileNav } from "./mobile-nav";

const navItems = [
  { href: "/", label: "Accueil" },
  { href: "/formations", label: "Formations" },
  { href: "/a-propos", label: "À propos" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const [mobileNavOpen, setMobileNavOpen] = React.useState(false);
  const [scrollY, setScrollY] = React.useState(0);
  const pathname = usePathname();
  const { scrollDirection, isScrolled } = useScrollDirection({
    threshold: 100,
  });

  React.useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isHidden = scrollDirection === "down" && isScrolled;
  const isAtTop = scrollY < 50;

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-300 ease-out",
        isHidden && "-translate-y-full",
        isAtTop
          ? "border-b border-white/10 bg-transparent backdrop-blur-sm"
          : "border-b border-white/10 bg-cozetik-black/95 backdrop-blur-md shadow-[0_2px_8px_rgba(0,0,0,0.1)]"
      )}
    >
      <div className="mx-auto flex h-20 max-w-[1440px] items-center justify-between px-10">
        <Link
          href="/"
          className="flex h-full items-center py-2"
          aria-label="Accueil Cozetik"
        >
          {/* Logo footer (blanc) quand scroll UP, logo normal quand en haut ou scroll DOWN */}
          <Image
            src={
              scrollDirection === "up" && isScrolled
                ? "/logo footer.png"
                : "/logo-cozetik_Logo-transparent.png"
            }
            alt="Cozetik"
            width={280}
            height={80}
            className="h-full w-auto object-contain transition-opacity duration-300"
            priority
          />
        </Link>

        <nav
          className="hidden items-center gap-10 md:flex"
          aria-label="Navigation principale"
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "font-sans text-base font-normal text-cozetik-white transition-colors duration-200 hover:text-cozetik-beige focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cozetik-beige focus-visible:ring-offset-2 focus-visible:ring-offset-transparent rounded-sm",
                pathname === item.href && "text-cozetik-beige font-semibold"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Button
          variant="ghost"
          size="icon"
          className="text-cozetik-white transition-colors duration-200 hover:bg-transparent hover:text-cozetik-beige md:hidden"
          onClick={() => setMobileNavOpen(true)}
          aria-label="Menu"
        >
          <Menu className="h-6 w-6" />
        </Button>

        <MobileNav
          open={mobileNavOpen}
          onOpenChange={setMobileNavOpen}
          items={navItems}
        />
      </div>
    </header>
  );
}
