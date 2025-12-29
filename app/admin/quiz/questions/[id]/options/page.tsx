import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ListOrdered } from 'lucide-react'
import AddOptionDialog from '@/components/admin/quiz/add-option-dialog'
import OptionsTable from '@/components/admin/quiz/options-table'

export default async function QuestionOptionsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const [question, options] = await Promise.all([
    prisma.quizQuestion.findUnique({
      where: { id },
      select: {
        id: true,
        question: true,
        order: true,
      },
    }),
    prisma.quizOption.findMany({
      where: { questionId: id },
      orderBy: { order: 'asc' },
    }),
  ])

  if (!question) {
    notFound()
  }

  return (
    <div className="max-w-5xl">
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/admin/quiz/questions">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour aux questions
          </Link>
        </Button>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Gérer les options
            </h1>
            <p className="text-muted-foreground mt-1">
              Question {question.order} : <strong>{question.question}</strong>
            </p>
          </div>
          <AddOptionDialog questionId={question.id} />
        </div>
      </div>

      {options.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 border rounded-none bg-muted/50">
          <ListOrdered className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Aucune option configurée</h3>
          <p className="text-muted-foreground mb-4">
            Créez la première option de réponse pour cette question
          </p>
          <AddOptionDialog questionId={question.id} />
        </div>
      ) : (
        <OptionsTable options={options} questionId={question.id} />
      )}
    </div>
  )
}
