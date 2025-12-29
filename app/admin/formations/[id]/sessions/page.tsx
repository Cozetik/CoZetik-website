import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Calendar } from 'lucide-react'
import AddSessionDialog from '@/components/admin/formations/sessions/add-session-dialog'
import SessionsTable from '@/components/admin/formations/sessions/sessions-table'

export default async function FormationSessionsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const [formation, sessions] = await Promise.all([
    prisma.formation.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
      },
    }),
    prisma.formationSession.findMany({
      where: { formationId: id },
      orderBy: { startDate: 'asc' },
    }),
  ])

  if (!formation) {
    notFound()
  }

  return (
    <div className="max-w-5xl">
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/admin/formations">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour aux formations
          </Link>
        </Button>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Gérer les sessions
            </h1>
            <p className="text-muted-foreground mt-1">
              Formation : <strong>{formation.title}</strong>
            </p>
          </div>
          <AddSessionDialog formationId={formation.id} />
        </div>
      </div>

      {sessions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 border rounded-none bg-muted/50">
          <Calendar className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            Aucune session programmée
          </h3>
          <p className="text-muted-foreground mb-4">
            Créez la première session pour cette formation
          </p>
          <AddSessionDialog formationId={formation.id} />
        </div>
      ) : (
        <SessionsTable sessions={sessions} formationId={formation.id} />
      )}
    </div>
  )
}
