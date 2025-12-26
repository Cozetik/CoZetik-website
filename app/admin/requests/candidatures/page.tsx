import { prisma } from '@/lib/prisma'
import CandidaturesTable from '@/components/admin/requests/candidatures-table'
import { AlertCircle } from 'lucide-react'

export default async function CandidaturesPage() {
  // Gestion temporaire si le modèle n'existe pas encore dans le client Prisma
  let candidatures = []
  let hasError = false
  let errorMessage = ''

  try {
    // Vérifier si le modèle existe dans le client Prisma
    if ('candidature' in prisma && prisma.candidature) {
      candidatures = await (prisma.candidature as any).findMany({
        orderBy: [{ status: 'asc' }, { createdAt: 'desc' }],
      })
    } else {
      hasError = true
      errorMessage = 'Le modèle Candidature n\'existe pas encore dans le client Prisma. Veuillez redémarrer le serveur de développement pour que les changements soient pris en compte.'
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des candidatures:', error)
    hasError = true
    errorMessage = error instanceof Error 
      ? `Erreur lors de la récupération des candidatures: ${error.message}`
      : 'Erreur inconnue lors de la récupération des candidatures. Veuillez redémarrer le serveur de développement.'
    candidatures = []
  }

  // Sérialiser les dates pour le client
  const serializedCandidatures = candidatures.map((candidature: any) => ({
    ...candidature,
    createdAt: candidature.createdAt.toISOString(),
    updatedAt: candidature.updatedAt.toISOString(),
    // S'assurer que tous les champs sont présents
    address: candidature.address ?? null,
    postalCode: candidature.postalCode ?? null,
    city: candidature.city ?? null,
    startDate: candidature.startDate ?? null,
    cvUrl: candidature.cvUrl ?? null,
    coverLetterUrl: candidature.coverLetterUrl ?? null,
    otherDocumentUrl: candidature.otherDocumentUrl ?? null,
  }))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Candidatures</h1>
        <p className="text-muted-foreground mt-2">
          Gérez les candidatures reçues via le formulaire
        </p>
      </div>

      {hasError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-red-800 mb-1">Erreur</h3>
              <p className="text-sm text-red-700">{errorMessage}</p>
            </div>
          </div>
        </div>
      ) : (
        <CandidaturesTable candidatures={serializedCandidatures} />
      )}
    </div>
  )
}

