import { prisma } from '@/lib/prisma'
import { Button } from '@/components/ui/button'
import { Heart } from 'lucide-react'
import AddValueDialog from '@/components/admin/values/add-value-dialog'
import ValuesTable from '@/components/admin/values/values-table'

export default async function ValuesPage() {
  const values = await prisma.value.findMany({
    orderBy: { order: 'asc' },
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Nos Valeurs</h1>
          <p className="text-muted-foreground mt-1">
            Gérez les valeurs affichées sur la page d&apos;accueil
          </p>
        </div>
        <AddValueDialog />
      </div>

      {values.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 border rounded-none bg-muted/50">
          <Heart className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            Aucune valeur créée
          </h3>
          <p className="text-muted-foreground mb-4">
            Commencez par créer votre première valeur
          </p>
          <AddValueDialog />
        </div>
      ) : (
        <ValuesTable values={values} />
      )}
    </div>
  )
}
