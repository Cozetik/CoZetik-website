import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ListOrdered } from 'lucide-react'
import AddStepDialog from '@/components/admin/formations/steps/add-step-dialog'
import StepsTable from '@/components/admin/formations/steps/steps-table'

export default async function FormationStepsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const [formation, steps] = await Promise.all([
    prisma.formation.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
      },
    }),
    prisma.formationStep.findMany({
      where: { formationId: id },
      orderBy: { order: 'asc' },
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
              Gérer les steps pédagogiques
            </h1>
            <p className="text-muted-foreground mt-1">
              Formation : <strong>{formation.title}</strong>
            </p>
          </div>
          <AddStepDialog formationId={formation.id} />
        </div>
      </div>

      {steps.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 border rounded-none bg-muted/50">
          <ListOrdered className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Aucun step configuré</h3>
          <p className="text-muted-foreground mb-4">
            Créez le premier step pédagogique pour cette formation
          </p>
          <AddStepDialog formationId={formation.id} />
        </div>
      ) : (
        <StepsTable steps={steps} formationId={formation.id} />
      )}
    </div>
  )
}
