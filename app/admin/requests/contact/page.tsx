import { prisma } from '@/lib/prisma'
import ContactRequestsTable from '@/components/admin/requests/contact-requests-table'

export default async function ContactRequestsPage() {
  const requests = await prisma.contactRequest.findMany({
    orderBy: [{ status: 'asc' }, { createdAt: 'desc' }],
  })

  // Sérialiser les dates pour le client
  const serializedRequests = requests.map((request) => ({
    ...request,
    createdAt: request.createdAt.toISOString(),
    updatedAt: request.updatedAt.toISOString(),
  }))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Demandes de contact</h1>
        <p className="text-muted-foreground mt-2">
          Gérez les demandes de contact reçues via le formulaire
        </p>
      </div>

      <ContactRequestsTable requests={serializedRequests} />
    </div>
  )
}
