import CategoriesTable from "@/components/admin/categories/categories-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { BookOpen, Eye, EyeOff, FolderOpen, Plus } from "lucide-react";
import Link from "next/link";

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
    include: {
      _count: {
        select: { formations: true },
      },
    },
  });

  const stats = {
    total: categories.length,
    visible: categories.filter((c) => c.visible).length,
    hidden: categories.filter((c) => !c.visible).length,
    totalFormations: categories.reduce(
      (sum, cat) => sum + cat._count.formations,
      0
    ),
  };

  return (
    <div className="space-y-2.5 xs:space-y-3 sm:space-y-6 lg:space-y-8 font-sans px-2.5 xs:px-3 sm:px-6 lg:px-8 py-2.5 xs:py-3 sm:py-6 max-w-[1920px] mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-2 xs:gap-2.5 sm:gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1">
          <h1 className="text-lg xs:text-xl sm:text-3xl lg:text-4xl font-bricolage font-bold tracking-tight text-gray-900">
            Catégories
          </h1>
          <p className="mt-0.5 xs:mt-1 sm:mt-2 text-[11px] xs:text-xs sm:text-base text-gray-600">
            Organisez vos catégories
          </p>
        </div>
        <Link href="/admin/categories/new" className="shrink-0">
          <Button
            size="lg"
            className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg font-semibold h-8 xs:h-9 sm:h-11 text-xs xs:text-sm"
          >
            <Plus className="mr-1 xs:mr-1.5 h-3.5 w-3.5 xs:h-4 xs:w-4 sm:h-5 sm:w-5" />
            <span className="md:hidden">Créer</span>
            <span className="hidden xs:inline sm:hidden">Nouvelle</span>
            <span className="hidden sm:inline">Nouvelle Catégorie</span>
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-1.5 xs:gap-2 sm:gap-4 md:grid-cols-4 lg:gap-6">
        <Card className="rounded-lg xs:rounded-xl border-0 bg-gradient-to-br from-purple-50 to-pink-50 shadow-sm">
          <CardHeader className="pb-1 xs:pb-1.5 p-1.5 xs:p-2 sm:p-4 lg:p-6">
            <div className="flex items-center gap-1 xs:gap-1.5">
              <div className="rounded-md xs:rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 p-0.5 xs:p-1 sm:p-2 shadow-lg shrink-0">
                <FolderOpen className="h-2.5 w-2.5 xs:h-3 xs:w-3 sm:h-5 sm:w-5 text-white" />
              </div>
              <CardTitle className="text-[9px] xs:text-[10px] sm:text-sm font-bricolage text-gray-700 truncate">
                Total
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-1.5 xs:p-2 sm:p-4 lg:p-6 pt-0">
            <p className="text-base xs:text-lg sm:text-2xl lg:text-3xl font-bold font-bricolage text-gray-900 tabular-nums">
              {stats.total}
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-lg xs:rounded-xl border-0 bg-gradient-to-br from-emerald-50 to-teal-50 shadow-sm">
          <CardHeader className="pb-1 xs:pb-1.5 p-1.5 xs:p-2 sm:p-4 lg:p-6">
            <div className="flex items-center gap-1 xs:gap-1.5">
              <div className="rounded-md xs:rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 p-0.5 xs:p-1 sm:p-2 shadow-lg shrink-0">
                <Eye className="h-2.5 w-2.5 xs:h-3 xs:w-3 sm:h-5 sm:w-5 text-white" />
              </div>
              <CardTitle className="text-[9px] xs:text-[10px] sm:text-sm font-bricolage text-gray-700 truncate">
                Visibles
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-1.5 xs:p-2 sm:p-4 lg:p-6 pt-0">
            <p className="text-base xs:text-lg sm:text-2xl lg:text-3xl font-bold font-bricolage text-gray-900 tabular-nums">
              {stats.visible}
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-lg xs:rounded-xl border-0 bg-gradient-to-br from-orange-50 to-amber-50 shadow-sm">
          <CardHeader className="pb-1 xs:pb-1.5 p-1.5 xs:p-2 sm:p-4 lg:p-6">
            <div className="flex items-center gap-1 xs:gap-1.5">
              <div className="rounded-md xs:rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 p-0.5 xs:p-1 sm:p-2 shadow-lg shrink-0">
                <EyeOff className="h-2.5 w-2.5 xs:h-3 xs:w-3 sm:h-5 sm:w-5 text-white" />
              </div>
              <CardTitle className="text-[9px] xs:text-[10px] sm:text-sm font-bricolage text-gray-700 truncate">
                Masquées
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-1.5 xs:p-2 sm:p-4 lg:p-6 pt-0">
            <p className="text-base xs:text-lg sm:text-2xl lg:text-3xl font-bold font-bricolage text-gray-900 tabular-nums">
              {stats.hidden}
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-lg xs:rounded-xl border-0 bg-gradient-to-br from-blue-50 to-cyan-50 shadow-sm">
          <CardHeader className="pb-1 xs:pb-1.5 p-1.5 xs:p-2 sm:p-4 lg:p-6">
            <div className="flex items-center gap-1 xs:gap-1.5">
              <div className="rounded-md xs:rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 p-0.5 xs:p-1 sm:p-2 shadow-lg shrink-0">
                <BookOpen className="h-2.5 w-2.5 xs:h-3 xs:w-3 sm:h-5 sm:w-5 text-white" />
              </div>
              <CardTitle className="text-[9px] xs:text-[10px] sm:text-sm font-bricolage text-gray-700 truncate">
                Formations
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-1.5 xs:p-2 sm:p-4 lg:p-6 pt-0">
            <p className="text-base xs:text-lg sm:text-2xl lg:text-3xl font-bold font-bricolage text-gray-900 tabular-nums">
              {stats.totalFormations}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Categories List */}
      <div className="space-y-1.5 xs:space-y-2 sm:space-y-4">
        <h2 className="text-xs xs:text-sm sm:text-lg lg:text-xl font-bricolage font-semibold text-gray-900 px-0.5">
          Toutes les catégories
        </h2>

        {categories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 xs:py-8 sm:py-16 lg:py-24 px-2.5 xs:px-3 sm:px-6 rounded-lg xs:rounded-xl border-2 border-dashed border-muted-foreground/20 bg-gradient-to-b from-muted/30 to-muted/10">
            <div className="rounded-full bg-gradient-to-br from-primary/20 to-primary/10 p-2.5 xs:p-3 sm:p-5 lg:p-6 mb-2.5 xs:mb-3 sm:mb-6 shadow-lg">
              <FolderOpen className="h-5 w-5 xs:h-6 xs:w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10 text-primary" />
            </div>
            <h3 className="text-sm xs:text-base sm:text-xl lg:text-2xl font-bricolage font-bold mb-1 xs:mb-1.5 text-center">
              Aucune catégorie créée
            </h3>
            <p className="text-[11px] xs:text-xs sm:text-base font-sans text-muted-foreground mb-3 xs:mb-4 sm:mb-8 text-center max-w-md leading-relaxed px-2">
              Créez votre première catégorie
            </p>
            <Button
              asChild
              size="lg"
              className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg font-sans font-semibold h-8 xs:h-9 sm:h-11 text-xs xs:text-sm"
            >
              <Link href="/admin/categories/new">
                <Plus className="mr-1 xs:mr-1.5 h-3.5 w-3.5 xs:h-4 xs:w-4 sm:h-5 sm:w-5" />
                <span className="xs:hidden">Créer</span>
                <span className="hidden xs:inline sm:hidden">Créer</span>
                <span className="hidden sm:inline">
                  Créer ma première catégorie
                </span>
              </Link>
            </Button>
          </div>
        ) : (
          <CategoriesTable categories={categories} />
        )}
      </div>
    </div>
  );
}
