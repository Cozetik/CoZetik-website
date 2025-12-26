import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import EditProfileForm from '@/components/admin/quiz/edit-profile-form'

export default async function EditProfilePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const profile = await prisma.quizProfile.findUnique({
    where: { id },
  })

  if (!profile) {
    notFound()
  }

  return (
    <div className="max-w-4xl">
      <EditProfileForm profile={profile} />
    </div>
  )
}
