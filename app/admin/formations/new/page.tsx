import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import NewFormationForm from '@/components/admin/formations/new-formation-form'

export default async function NewFormationPage() {
  // Récupérer les catégories visibles
  const categories = await prisma.category.findMany({
    where: { visible: true },
    orderBy: { name: 'asc' },
    select: {
      id: true,
      name: true,
    },
  })

  // Si aucune catégorie, rediriger avec message
  if (categories.length === 0) {
    redirect('/admin/categories?message=create_category_first')
  }

  return (
    <div className="max-w-4xl">
      <NewFormationForm categories={categories} />
    </div>
  )
}
