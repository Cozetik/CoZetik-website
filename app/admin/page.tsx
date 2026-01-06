import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import {
  ArrowUpRight,
  Briefcase,
  FileText,
  GraduationCap,
  Mail,
  Tags,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";

export default async function AdminDashboardPage() {
  // Récupérer toutes les statistiques en parallèle pour optimiser les performances
  const [
    totalFormations,
    activeCategories,
    publishedBlogPosts,
    newContactRequests,
    newInscriptions,
    newCandidatures,
  ] = await Promise.all([
    prisma.formation.count(),
    prisma.category.count({ where: { visible: true } }),
    prisma.blogPost.count({ where: { visible: true } }),
    prisma.contactRequest.count({ where: { status: "NEW" } }),
    prisma.formationInscription.count({ where: { status: "NEW" } }),
    prisma.candidature.count({ where: { status: "NEW" } }),
  ]);

  const stats = [
    {
      title: "Formations",
      value: totalFormations,
      icon: GraduationCap,
      description: "Formations disponibles",
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50",
      trend: null,
      href: "/admin/formations",
    },
    {
      title: "Catégories",
      value: activeCategories,
      icon: Tags,
      description: "Catégories actives",
      gradient: "from-emerald-500 to-teal-500",
      bgGradient: "from-emerald-50 to-teal-50",
      trend: null,
      href: "/admin/categories",
    },
    {
      title: "Articles",
      value: publishedBlogPosts,
      icon: FileText,
      description: "Publications en ligne",
      gradient: "from-violet-500 to-purple-500",
      bgGradient: "from-violet-50 to-purple-50",
      trend: null,
      href: "/admin/blog",
    },
    {
      title: "Messages",
      value: newContactRequests,
      icon: Mail,
      description: "Demandes en attente",
      gradient: "from-orange-500 to-amber-500",
      bgGradient: "from-orange-50 to-amber-50",
      badge: newContactRequests > 0,
      urgent: true,
      href: "/admin/requests/contact",
    },
    {
      title: "Candidatures",
      value: newCandidatures,
      icon: Briefcase,
      description: "En attente de review",
      gradient: "from-indigo-500 to-blue-500",
      bgGradient: "from-indigo-50 to-blue-50",
      badge: newCandidatures > 0,
      urgent: true,
      href: "/admin/requests/candidatures",
    },
  ];

  const formatNumber = (num: number): string => {
    return num.toLocaleString("fr-FR");
  };

  const urgentCount = newContactRequests + newCandidatures;

  return (
    <div className="min-h-screen space-y-8 font-sans">
      {/* Header Section */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <h1 className="text-4xl font-bricolage font-bold tracking-tight text-gray-900 lg:text-5xl">
            Dashboard
          </h1>
          <p className="text-base text-gray-600 max-w-2xl">
            Vue d&apos;ensemble de votre plateforme en temps réel
          </p>
        </div>

        {urgentCount > 0 && (
          <div className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-red-50 to-orange-50 px-6 py-4 border border-red-100">
            <div className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500"></span>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 font-bricolage">
                {urgentCount} action{urgentCount > 1 ? "s" : ""} requise
                {urgentCount > 1 ? "s" : ""}
              </p>
              <p className="text-xs text-gray-600">
                Éléments nécessitant votre attention
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.title} href={stat.href} className="block">
              <Card
                className={`group relative overflow-hidden rounded-2xl border-0 bg-gradient-to-br ${stat.bgGradient} shadow-sm transition-all duration-300 hover:shadow-xl hover:scale-[1.02] cursor-pointer`}
              >
                {/* Gradient Border Effect */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-5`}
                />

                {stat.badge && (
                  <div className="absolute top-4 right-4">
                    <span className="relative flex h-3 w-3">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500"></span>
                    </span>
                  </div>
                )}

                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div
                      className={`rounded-xl bg-gradient-to-br ${stat.gradient} p-3 shadow-lg transition-transform duration-300 group-hover:scale-110`}
                    >
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    {stat.urgent && stat.value > 0 && (
                      <Badge
                        variant="destructive"
                        className="rounded-full px-3 py-1 text-xs font-semibold shadow-sm"
                      >
                        Urgent
                      </Badge>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-2">
                  <CardTitle className="text-sm font-bricolage font-semibold text-gray-700 uppercase tracking-wide">
                    {stat.title}
                  </CardTitle>

                  <div className="flex items-end gap-2">
                    <span className="text-4xl font-bold text-gray-900 font-bricolage">
                      {formatNumber(stat.value)}
                    </span>
                    {stat.trend && (
                      <div className="flex items-center gap-1 text-emerald-600 mb-1">
                        <TrendingUp className="h-4 w-4" />
                        <span className="text-sm font-semibold">+12%</span>
                      </div>
                    )}
                  </div>

                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    {stat.description}
                    <ArrowUpRight className="h-3 w-3 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </p>
                </CardContent>

                {/* Decorative Element */}
                <div
                  className={`absolute -bottom-6 -right-6 h-24 w-24 rounded-full bg-gradient-to-br ${stat.gradient} opacity-10 blur-2xl transition-all duration-300 group-hover:opacity-20`}
                />
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
