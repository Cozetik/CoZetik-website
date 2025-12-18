import { prisma } from '@/lib/prisma'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Plus, FolderOpen } from 'lucide-react'
import CategoriesTable from '@/components/admin/categories/categories-table'

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { order: 'asc' },
    include: {
      _count: {
        select: { formations: true },
      },
    },
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Catégories</h1>
          <p className="text-muted-foreground mt-1">
            Gérez les catégories de formations
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/categories/new">
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle catégorie
          </Link>
        </Button>
      </div>

      {categories.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 border rounded-lg bg-muted/50">
          <FolderOpen className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Aucune catégorie créée</h3>
          <p className="text-muted-foreground mb-4">
            Commencez par créer votre première catégorie
          </p>
          <Button asChild>
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
  )
}
