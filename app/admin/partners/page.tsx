import { prisma } from '@/lib/prisma'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Plus, Handshake } from 'lucide-react'
import PartnersTable from '@/components/admin/partners/partners-table'

export default async function PartnersPage() {
  const partners = await prisma.partner.findMany({
    orderBy: { order: 'asc' },
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Partenaires</h1>
          <p className="text-muted-foreground mt-1">
            Gérez vos entreprises partenaires
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/partners/new">
            <Plus className="mr-2 h-4 w-4" />
            Nouveau partenaire
          </Link>
        </Button>
      </div>

      {partners.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 border rounded-lg bg-muted/50">
          <Handshake className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            Aucun partenaire créé
          </h3>
          <p className="text-muted-foreground mb-4">
            Commencez par ajouter votre premier partenaire
          </p>
          <Button asChild>
            <Link href="/admin/partners/new">
              <Plus className="mr-2 h-4 w-4" />
              Créer un partenaire
            </Link>
          </Button>
        </div>
      ) : (
        <PartnersTable partners={partners} />
      )}
    </div>
  )
}
