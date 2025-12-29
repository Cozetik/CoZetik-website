import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, HelpCircle } from 'lucide-react'
import AddFaqDialog from '@/components/admin/formations/faqs/add-faq-dialog'
import FaqsTable from '@/components/admin/formations/faqs/faqs-table'

export default async function FormationFaqsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const [formation, faqs] = await Promise.all([
    prisma.formation.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
      },
    }),
    prisma.formationFAQ.findMany({
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
            <h1 className="text-3xl font-bold tracking-tight">Gérer les FAQs</h1>
            <p className="text-muted-foreground mt-1">
              Formation : <strong>{formation.title}</strong>
            </p>
          </div>
          <AddFaqDialog formationId={formation.id} />
        </div>
      </div>

      {faqs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 border rounded-none bg-muted/50">
          <HelpCircle className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Aucune FAQ disponible</h3>
          <p className="text-muted-foreground mb-4">
            Créez la première question fréquente pour cette formation
          </p>
          <AddFaqDialog formationId={formation.id} />
        </div>
      ) : (
        <FaqsTable faqs={faqs} formationId={formation.id} />
      )}
    </div>
  )
}
