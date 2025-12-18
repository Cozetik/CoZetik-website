import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import EditCategoryForm from '@/components/admin/categories/edit-category-form'

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const category = await prisma.category.findUnique({
    where: { id },
  })

  if (!category) {
    notFound()
  }

  return <EditCategoryForm category={category} />
}
