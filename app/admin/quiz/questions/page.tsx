import QuestionsTable from "@/components/admin/quiz/questions-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { CheckCircle, HelpCircle, ListChecks, Plus } from "lucide-react";
import Link from "next/link";

export default async function QuizQuestionsPage() {
  const questions = await prisma.quizQuestion.findMany({
    orderBy: { order: "asc" },
    include: {
      _count: {
        select: { options: true },
      },
    },
  });

  const stats = {
    total: questions.length,
    withOptions: questions.filter((q) => q._count.options > 0).length,
    totalOptions: questions.reduce((sum, q) => sum + q._count.options, 0),
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-4xl font-bricolage font-bold tracking-tight text-gray-900">
            Questions du Quiz
          </h1>
          <p className="mt-2 text-gray-600">
            Gérez les questions et leurs options de réponse
          </p>
        </div>
        <Link href="/admin/quiz/questions/new">
          <Button
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg font-semibold"
          >
            <Plus className="mr-2 h-5 w-5" />
            Nouvelle Question
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      {questions.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="rounded-2xl border-0 bg-gradient-to-br from-green-50 to-emerald-50 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 p-2.5 shadow-lg">
                  <HelpCircle className="h-5 w-5 text-white" />
                </div>
                <CardTitle className="text-sm font-bricolage text-gray-700">
                  Total questions
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold font-bricolage text-gray-900">
                {stats.total}
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-0 bg-gradient-to-br from-blue-50 to-cyan-50 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 p-2.5 shadow-lg">
                  <CheckCircle className="h-5 w-5 text-white" />
                </div>
                <CardTitle className="text-sm font-bricolage text-gray-700">
                  Questions complètes
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold font-bricolage text-gray-900">
                {stats.withOptions}
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-0 bg-gradient-to-br from-purple-50 to-violet-50 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-gradient-to-br from-purple-500 to-violet-500 p-2.5 shadow-lg">
                  <ListChecks className="h-5 w-5 text-white" />
                </div>
                <CardTitle className="text-sm font-bricolage text-gray-700">
                  Total options
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold font-bricolage text-gray-900">
                {stats.totalOptions}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Questions List */}
      <div className="space-y-4">
        <h2 className="text-xl font-bricolage font-semibold text-gray-900">
          Toutes les questions
        </h2>

        {questions.length === 0 ? (
          <Card className="rounded-2xl border-2 border-dashed border-gray-200">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="rounded-full bg-gray-100 p-4 mb-4">
                <HelpCircle className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-lg font-semibold text-gray-900 mb-2">
                Aucune question créée
              </p>
              <p className="text-gray-600 mb-6 text-center max-w-sm">
                Commencez par créer votre première question pour construire
                votre quiz
              </p>
              <Link href="/admin/quiz/questions/new">
                <Button className="bg-gradient-to-r from-green-600 to-emerald-600">
                  <Plus className="mr-2 h-4 w-4" />
                  Créer une question
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
            <QuestionsTable questions={questions} />
          </div>
        )}
      </div>
    </div>
  );
}
