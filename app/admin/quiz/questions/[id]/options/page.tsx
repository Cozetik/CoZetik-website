import AddOptionDialog from "@/components/admin/quiz/add-option-dialog";
import OptionsTable from "@/components/admin/quiz/options-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { ArrowLeft, HelpCircle, ListOrdered } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function QuestionOptionsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

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
      orderBy: { order: "asc" },
    }),
  ]);

  if (!question) {
    notFound();
  }

  return (
    <div className="space-y-8 font-sans">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 via-cyan-500 to-teal-600 rounded-2xl p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,black)]" />
        <div className="relative">
          <Button
            variant="ghost"
            asChild
            className="mb-4 text-white hover:bg-white/20"
          >
            <Link href="/admin/quiz/questions">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour aux questions
            </Link>
          </Button>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="rounded-lg bg-white/20 p-2 backdrop-blur-sm">
                  <HelpCircle className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-4xl font-bricolage font-bold">
                  Gérer les options
                </h1>
              </div>
              <p className="text-blue-50">
                Question {question.order} : {question.question}
              </p>
            </div>
            <AddOptionDialog questionId={question.id} />
          </div>
        </div>
      </div>

      {/* Options List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bricolage font-semibold text-gray-900">
            Options de réponse
          </h2>
          {options.length > 0 && (
            <span className="text-sm text-gray-500">
              {options.length} option{options.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {options.length === 0 ? (
          <Card className="rounded-2xl border-2 border-dashed border-gray-200">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="rounded-full bg-gray-100 p-4 mb-4">
                <ListOrdered className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-lg font-semibold text-gray-900 mb-2">
                Aucune option configurée
              </p>
              <p className="text-gray-600 mb-6 text-center max-w-sm">
                Créez la première option de réponse pour cette question
              </p>
              <AddOptionDialog questionId={question.id} />
            </CardContent>
          </Card>
        ) : (
          <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
            <OptionsTable options={options} questionId={question.id} />
          </div>
        )}
      </div>
    </div>
  );
}
