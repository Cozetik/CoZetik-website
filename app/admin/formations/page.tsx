import { prisma } from '@/lib/prisma'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Plus, BookOpen } from 'lucide-react'
import FormationsTable from '@/components/admin/formations/formations-table'

export default async function FormationsPage() {
  const formations = await prisma.formation.findMany({
    orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    include: {
      category: true,
      _count: {
        select: { sessions: true, inscriptions: true },
      },
    },
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Formations</h1>
          <p className="text-muted-foreground mt-1">
            Gérez vos formations et programmes
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/formations/new">
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle formation
          </Link>
        </Button>
      </div>

      {formations.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 border rounded-lg bg-muted/50">
          <BookOpen className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            Aucune formation créée
          </h3>
          <p className="text-muted-foreground mb-4">
            Commencez par créer votre première formation
          </p>
          <Button asChild>
            <Link href="/admin/formations/new">
              <Plus className="mr-2 h-4 w-4" />
              Créer une formation
            </Link>
          </Button>
        </div>
      ) : (
        <FormationsTable formations={formations} />
      )}
    </div>
  )
}
