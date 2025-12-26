import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import EditQuestionForm from '@/components/admin/quiz/edit-question-form'

export default async function EditQuestionPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const question = await prisma.quizQuestion.findUnique({
    where: { id },
  })

  if (!question) {
    notFound()
  }

  return (
    <div className="max-w-4xl">
      <EditQuestionForm question={question} />
    </div>
  )
}
