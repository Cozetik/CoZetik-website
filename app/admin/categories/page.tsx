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
    <div className="space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-4xl font-bricolage font-bold tracking-tight text-gray-900">
            Catégories
          </h1>
          <p className="mt-2 text-gray-600">
            Organisez et gérez vos catégories de formations
          </p>
        </div>
        <Link href="/admin/categories/new">
          <Button
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg font-semibold"
          >
            <Plus className="mr-2 h-5 w-5" />
            Nouvelle Catégorie
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="rounded-2xl border-0 bg-gradient-to-br from-purple-50 to-pink-50 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 p-2.5 shadow-lg">
                <FolderOpen className="h-5 w-5 text-white" />
              </div>
              <CardTitle className="text-sm font-bricolage text-gray-700">
                Total
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold font-bricolage text-gray-900">
              {stats.total}
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-0 bg-gradient-to-br from-emerald-50 to-teal-50 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 p-2.5 shadow-lg">
                <Eye className="h-5 w-5 text-white" />
              </div>
              <CardTitle className="text-sm font-bricolage text-gray-700">
                Visibles
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold font-bricolage text-gray-900">
              {stats.visible}
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-0 bg-gradient-to-br from-orange-50 to-amber-50 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 p-2.5 shadow-lg">
                <EyeOff className="h-5 w-5 text-white" />
              </div>
              <CardTitle className="text-sm font-bricolage text-gray-700">
                Masquées
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold font-bricolage text-gray-900">
              {stats.hidden}
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-0 bg-gradient-to-br from-blue-50 to-cyan-50 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 p-2.5 shadow-lg">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <CardTitle className="text-sm font-bricolage text-gray-700">
                Formations
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold font-bricolage text-gray-900">
              {stats.totalFormations}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Categories List */}
      <div className="space-y-4">
        <h2 className="text-xl font-bricolage font-semibold text-gray-900">
          Toutes les catégories
        </h2>

        {categories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 px-6 rounded-2xl border-2 border-dashed border-muted-foreground/20 bg-gradient-to-b from-muted/30 to-muted/10">
            <div className="rounded-full bg-gradient-to-br from-primary/20 to-primary/10 p-6 mb-6 shadow-lg">
              <FolderOpen className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-2xl font-bricolage font-bold mb-2">
              Aucune catégorie créée
            </h3>
            <p className="text-base font-sans text-muted-foreground mb-8 text-center max-w-md leading-relaxed">
              Commencez par créer votre première catégorie pour organiser vos
              formations de manière efficace
            </p>
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg font-sans font-semibold"
            >
              <Link href="/admin/categories/new">
                <Plus className="mr-2 h-5 w-5" />
                Créer ma première catégorie
              </Link>
            </Button>
          </div>
        ) : (
          <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
            <CategoriesTable categories={categories} />
          </div>
        )}
      </div>
    </div>
  );
}
