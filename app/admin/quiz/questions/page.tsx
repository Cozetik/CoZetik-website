import { prisma } from '@/lib/prisma'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Plus, HelpCircle } from 'lucide-react'
import QuestionsTable from '@/components/admin/quiz/questions-table'

export default async function QuizQuestionsPage() {
  const questions = await prisma.quizQuestion.findMany({
    orderBy: { order: 'asc' },
    include: {
      _count: {
        select: { options: true },
      },
    },
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Questions du Quiz</h1>
          <p className="text-muted-foreground mt-1">
            Gérez les questions et leurs options de réponse
          </p>
        </div>
        <Button asChild className="bg-green-600 hover:bg-green-700">
          <Link href="/admin/quiz/questions/new">
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle question
          </Link>
        </Button>
      </div>

      {questions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 border rounded-lg bg-muted/50">
          <HelpCircle className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            Aucune question créée
          </h3>
          <p className="text-muted-foreground mb-4">
            Commencez par créer votre première question
          </p>
          <Button asChild className="bg-green-600 hover:bg-green-700">
            <Link href="/admin/quiz/questions/new">
              <Plus className="mr-2 h-4 w-4" />
              Créer une question
            </Link>
          </Button>
        </div>
      ) : (
        <QuestionsTable questions={questions} />
      )}
    </div>
  )
}
