import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import EditFormationForm from '@/components/admin/formations/edit-formation-form'

export default async function EditFormationPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const [formation, categories] = await Promise.all([
    prisma.formation.findUnique({
      where: { id },
      include: {
        category: true,
      },
    }),
    prisma.category.findMany({
      where: { visible: true },
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
      },
    }),
  ])

  if (!formation) {
    notFound()
  }

  return (
    <div className="max-w-4xl">
      <EditFormationForm formation={formation} categories={categories} />
    </div>
  )
}
