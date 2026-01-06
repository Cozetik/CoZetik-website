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
  Sparkles,
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

function isNavItemWithSub(
  item: NavItem | NavItemWithSub
): item is NavItemWithSub {
  return "subItems" in item;
}

interface SidebarProps {
  badges?: {
    contacts: number;
    candidatures: number;
    inscriptions: number;
  };
}

export default function Sidebar({ badges }: SidebarProps) {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>([
    "Quiz",
    "Demandes",
  ]);

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
        { name: "Candidatures", href: "/admin/requests/candidatures" },
      ],
    },
  ];

  const getBadgeForHref = (href: string): number => {
    if (!badges) return 0;
    if (href === "/admin/requests/contact") return badges.contacts;
    if (href === "/admin/requests/candidatures") return badges.candidatures;
    if (href === "/admin/inscriptions") return badges.inscriptions;
    return 0;
  };

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
    <div className="flex h-full flex-col bg-white border-r border-gray-200">
      {/* Logo/Header avec gradient */}
      <div className="relative flex h-20 items-center px-6 border-b border-gray-200">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 opacity-50" />
        <div className="relative flex items-center gap-3">
          <div className="rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 p-2.5 shadow-lg">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bricolage font-bold tracking-tight text-gray-900">
              Cozetik
            </h1>
            <p className="text-xs font-sans text-gray-500">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-4 py-6">
        <nav className="space-y-2">
          {navItems.map((item) => {
            if (isNavItemWithSub(item)) {
              const isExpanded = expandedItems.includes(item.name);
              const hasActiveChild = item.subItems.some((subItem) =>
                isActive(subItem.href)
              );
              const totalBadges = item.subItems.reduce(
                (sum, subItem) => sum + getBadgeForHref(subItem.href),
                0
              );

              return (
                <div key={item.name} className="space-y-1">
                  <button
                    onClick={() => toggleExpanded(item.name)}
                    className={cn(
                      "group flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-sans font-medium transition-all duration-200",
                      hasActiveChild
                        ? "bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 shadow-sm"
                        : "text-gray-700 hover:bg-gray-50"
                    )}
                  >
                    <div
                      className={cn(
                        "rounded-lg p-1.5 transition-colors",
                        hasActiveChild
                          ? "bg-gradient-to-br from-blue-500 to-purple-500 text-white"
                          : "bg-gray-100 text-gray-600 group-hover:bg-gray-200"
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                    </div>
                    <span className="flex-1 text-left">{item.name}</span>
                    {totalBadges > 0 && (
                      <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs font-semibold text-white">
                        {totalBadges}
                      </span>
                    )}
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-transform duration-200",
                        isExpanded && "rotate-180"
                      )}
                    />
                  </button>

                  {isExpanded && (
                    <div className="ml-11 space-y-1 border-l-2 border-gray-100 pl-3">
                      {item.subItems.map((subItem) => {
                        const badgeValue = getBadgeForHref(subItem.href);
                        return (
                          <Link
                            key={subItem.href}
                            href={subItem.href}
                            className={cn(
                              "group flex items-center justify-between rounded-lg px-3 py-2 text-sm font-sans transition-all duration-200",
                              isActive(subItem.href)
                                ? "bg-gradient-to-r from-blue-50 to-purple-50 font-medium text-blue-700"
                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            )}
                          >
                            <span>{subItem.name}</span>
                            {badgeValue > 0 && (
                              <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs font-semibold text-white animate-pulse">
                                {badgeValue}
                              </span>
                            )}
                          </Link>
                        );
                      })}
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
                  "group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-sans font-medium transition-all duration-200",
                  isActive(item.href)
                    ? "bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 shadow-sm"
                    : "text-gray-700 hover:bg-gray-50"
                )}
              >
                <div
                  className={cn(
                    "rounded-lg p-1.5 transition-colors",
                    isActive(item.href)
                      ? "bg-gradient-to-br from-blue-500 to-purple-500 text-white"
                      : "bg-gray-100 text-gray-600 group-hover:bg-gray-200"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                </div>
                <span className="flex-1">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      {/* Footer avec style amélioré */}
      <div className="border-t border-gray-200 bg-gray-50 p-4">
        <div className="flex items-center gap-3 rounded-xl bg-white px-4 py-3 shadow-sm border border-gray-100">
          <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          <div className="flex-1">
            <p className="text-xs font-sans font-semibold text-gray-900">
              Système actif
            </p>
            <p className="text-xs font-sans text-gray-500">
              &copy; {new Date().getFullYear()} Cozetik
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
