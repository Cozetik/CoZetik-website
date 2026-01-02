"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  ChevronDown,
  FileText,
  GraduationCap,
  Handshake,
  Heart,
  HelpCircle,
  Inbox,
  LayoutDashboard,
  Tags,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface NavItemWithSub {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  subItems: { name: string; href: string }[];
}

const navItems: (NavItem | NavItemWithSub)[] = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Formations", href: "/admin/formations", icon: GraduationCap },
  { name: "Catégories", href: "/admin/categories", icon: Tags },
  { name: "Valeurs", href: "/admin/values", icon: Heart },
  { name: "Blog", href: "/admin/blog", icon: FileText },
  { name: "Thèmes Blog", href: "/admin/theme", icon: Tags },
  { name: "Partenaires", href: "/admin/partners", icon: Handshake },
  {
    name: "Quiz",
    icon: HelpCircle,
    subItems: [
      { name: "Questions", href: "/admin/quiz/questions" },
      { name: "Profils", href: "/admin/quiz/profiles" },
    ],
  },
  {
    name: "Demandes",
    icon: Inbox,
    subItems: [
      { name: "Contacts", href: "/admin/requests/contact" },
      { name: "Inscriptions", href: "/admin/requests/inscriptions" },
      { name: "Candidatures", href: "/admin/requests/candidatures" },
    ],
  },
];

function isNavItemWithSub(
  item: NavItem | NavItemWithSub
): item is NavItemWithSub {
  return "subItems" in item;
}

export default function Sidebar() {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>(["Quiz", "Demandes"]);

  const toggleExpanded = (name: string) => {
    setExpandedItems((prev) =>
      prev.includes(name)
        ? prev.filter((item) => item !== name)
        : [...prev, name]
    );
  };

  const isActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin";
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="flex h-full flex-col border-r bg-muted/40">
      {/* Logo/Header */}
      <div className="flex h-16 items-center border-b px-6">
        <h1 className="text-xl font-bold tracking-tight">Cozetik Admin</h1>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {navItems.map((item) => {
            if (isNavItemWithSub(item)) {
              const isExpanded = expandedItems.includes(item.name);
              const hasActiveChild = item.subItems.some((subItem) =>
                isActive(subItem.href)
              );

              return (
                <div key={item.name}>
                  <button
                    onClick={() => toggleExpanded(item.name)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-none px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                      hasActiveChild && "bg-accent text-accent-foreground"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    <span className="flex-1 text-left">{item.name}</span>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-transform",
                        isExpanded && "rotate-180"
                      )}
                    />
                  </button>

                  {isExpanded && (
                    <div className="ml-7 mt-1 space-y-1">
                      {item.subItems.map((subItem) => (
                        <Link
                          key={subItem.href}
                          href={subItem.href}
                          className={cn(
                            "block rounded-none px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
                            isActive(subItem.href) &&
                              "bg-accent font-medium text-accent-foreground"
                          )}
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-none px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                  isActive(item.href) && "bg-accent text-accent-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      {/* Footer */}
      <div className="border-t p-4">
        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Cozetik
        </p>
      </div>
    </div>
  );
}
