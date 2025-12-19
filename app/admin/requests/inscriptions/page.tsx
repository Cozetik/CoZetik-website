import { prisma } from '@/lib/prisma'
import InscriptionsTable from '@/components/admin/requests/inscriptions-table'

export default async function InscriptionsPage() {
  // Récupérer les inscriptions avec leurs formations
  const inscriptions = await prisma.formation_inscriptions.findMany({
    include: {
      Formation: {
        select: {
          id: true,
          title: true,
          slug: true,
        },
      },
    },
    orderBy: [{ status: 'asc' }, { createdAt: 'desc' }],
  })

  // Récupérer toutes les formations pour le filtre
  const formations = await prisma.formation.findMany({
    select: {
      id: true,
      title: true,
      slug: true,
    },
    orderBy: { title: 'asc' },
  })

  // Sérialiser les dates pour le client
  const serializedInscriptions = inscriptions.map((inscription) => ({
    ...inscription,
    createdAt: inscription.createdAt.toISOString(),
    updatedAt: inscription.updatedAt.toISOString(),
  }))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Inscriptions formations</h1>
        <p className="text-muted-foreground mt-2">
          Gérez les inscriptions aux formations reçues via le formulaire
        </p>
      </div>

      <InscriptionsTable
        inscriptions={serializedInscriptions}
        formations={formations}
      />
    </div>
  )
}
