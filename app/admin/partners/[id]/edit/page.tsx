import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import EditPartnerForm from '@/components/admin/partners/edit-partner-form'

export default async function EditPartnerPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const partner = await prisma.partner.findUnique({
    where: { id },
  })

  if (!partner) {
    notFound()
  }

  return (
    <div className="max-w-4xl">
      <EditPartnerForm partner={partner} />
    </div>
  )
}
