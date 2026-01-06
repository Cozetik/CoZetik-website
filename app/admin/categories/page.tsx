import CategoriesTable from "@/components/admin/categories/categories-table";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { FolderOpen, Plus } from "lucide-react";
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-4xl font-bricolage font-semibold tracking-tight">
            Catégories
          </h1>
          <p className="text-muted-foreground font-sans">
            Gérez les catégories de formations
          </p>
        </div>
        <Button asChild size="default" className="shadow-sm font-sans">
          <Link href="/admin/categories/new">
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle catégorie
          </Link>
        </Button>
      </div>

      {categories.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-6 rounded-lg border border-dashed">
          <div className="rounded-full bg-muted p-3 mb-4">
            <FolderOpen className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-bricolage font-semibold mb-1.5">
            Aucune catégorie créée
          </h3>
          <p className="text-sm font-sans text-muted-foreground mb-6 text-center max-w-sm">
            Commencez par créer votre première catégorie de formation
          </p>
          <Button asChild size="sm" className="font-sans">
            <Link href="/admin/categories/new">
              <Plus className="mr-2 h-4 w-4" />
              Créer une catégorie
            </Link>
          </Button>
        </div>
      ) : (
        <CategoriesTable categories={categories} />
      )}
    </div>
  );
}
