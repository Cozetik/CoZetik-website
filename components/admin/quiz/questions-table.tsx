"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowUpDown,
  Eye,
  EyeOff,
  Hash,
  HelpCircle,
  Pencil,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import DeleteQuestionDialog from "./delete-question-dialog";

interface Question {
  id: string;
  order: number;
  question: string;
  visible: boolean;
  _count?: {
    options: number;
  };
}

export default function QuestionsTable({
  questions,
}: {
  questions: Question[];
}) {
  const router = useRouter();
  const [items, setItems] = useState(questions);

  const handleToggleVisibility = async (id: string, currentValue: boolean) => {
    try {
      const response = await fetch(
        `/api/quiz/questions/${id}/toggle-visibility`,
        {
          method: "PATCH",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de la mise à jour");
      }

      // Mettre à jour l'état local
      setItems(
        items.map((item) =>
          item.id === id ? { ...item, visible: !currentValue } : item
        )
      );

      toast.success(
        data.visible ? "Question rendue visible" : "Question masquée"
      );
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur inconnue");
    }
  };

  return (
    <>
      {/* Vue Desktop (md et plus) */}
      <div className="hidden md:block rounded-xl border border-border/50 overflow-hidden bg-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50 border-b border-border/50">
              <TableHead className="w-[100px] font-sans font-semibold text-foreground">
                <div className="flex items-center gap-2">
                  <Hash className="h-3.5 w-3.5 text-muted-foreground" />
                  Ordre
                </div>
              </TableHead>
              <TableHead className="font-sans font-semibold text-foreground">
                <div className="flex items-center gap-2">
                  Question
                  <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
              </TableHead>
              <TableHead className="w-[150px] font-sans font-semibold text-foreground text-center">
                Options
              </TableHead>
              <TableHead className="w-[120px] font-sans font-semibold text-foreground">
                Visibilité
              </TableHead>
              <TableHead className="w-[150px] text-right font-sans font-semibold text-foreground">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((question) => (
              <TableRow
                key={question.id}
                className="hover:bg-muted/30 transition-colors border-b border-border/30 last:border-0"
              >
                <TableCell className="py-4">
                  <div className="flex items-center gap-2">
                    <div className="rounded-lg bg-green-100 p-2">
                      <Hash className="h-4 w-4 text-green-600" />
                    </div>
                    <span className="font-sans font-semibold text-foreground">
                      {question.order}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="py-4">
                  <div className="flex items-start gap-2 max-w-[600px]">
                    <HelpCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="font-sans text-foreground line-clamp-2">
                      {question.question}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="py-4 text-center">
                  <Badge
                    variant="secondary"
                    className="font-sans bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20 font-medium"
                  >
                    {question._count?.options || 0} option
                    {(question._count?.options || 0) !== 1 ? "s" : ""}
                  </Badge>
                </TableCell>
                <TableCell className="py-4">
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={question.visible}
                      onCheckedChange={() =>
                        handleToggleVisibility(question.id, question.visible)
                      }
                      className="data-[state=checked]:bg-green-500"
                    />
                    <Badge
                      variant={question.visible ? "default" : "secondary"}
                      className={
                        question.visible
                          ? "font-sans bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20 hover:bg-green-500/20 font-medium"
                          : "font-sans bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20 hover:bg-gray-500/20 font-medium"
                      }
                    >
                      {question.visible ? "Visible" : "Masqué"}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell className="py-4">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      asChild
                      className="h-8 w-8 hover:bg-muted"
                      title="Gérer les options"
                    >
                      <Link
                        href={`/admin/quiz/questions/${question.id}/options`}
                      >
                        <Settings className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      asChild
                      className="h-8 w-8 hover:bg-muted"
                    >
                      <Link href={`/admin/quiz/questions/${question.id}/edit`}>
                        <Pencil className="h-4 w-4" />
                      </Link>
                    </Button>
                    <DeleteQuestionDialog
                      questionId={question.id}
                      questionOrder={question.order}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Vue Mobile (moins de md) */}
      <div className="md:hidden space-y-2 xs:space-y-2.5">
        {items.map((question) => (
          <div
            key={question.id}
            className="rounded-lg xs:rounded-xl border border-border/50 bg-card p-2.5 xs:p-3 sm:p-4 space-y-2 xs:space-y-2.5 shadow-sm hover:shadow-md transition-shadow"
          >
            {/* Header avec ordre et question */}
            <div className="flex gap-2 xs:gap-2.5">
              <div className="rounded-md xs:rounded-lg bg-green-100 p-1.5 xs:p-2 shrink-0 flex items-center justify-center">
                <Hash className="h-3.5 w-3.5 xs:h-4 xs:w-4 text-green-600" />
              </div>
              <div className="flex-1 min-w-0 space-y-0.5 xs:space-y-1">
                <div className="flex items-center gap-1.5">
                  <span className="font-sans font-semibold text-[10px] xs:text-xs text-muted-foreground">
                    #{question.order}
                  </span>
                  <Badge
                    variant="secondary"
                    className="font-sans bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20 font-medium text-[9px] xs:text-[10px] h-5 xs:h-6 px-1.5 xs:px-2"
                  >
                    {question._count?.options || 0} option
                    {(question._count?.options || 0) !== 1 ? "s" : ""}
                  </Badge>
                </div>
                <div className="flex items-start gap-1.5">
                  <HelpCircle className="h-3.5 w-3.5 xs:h-4 xs:w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <p className="font-sans text-foreground text-xs xs:text-sm line-clamp-2 leading-tight">
                    {question.question}
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between gap-2 pt-1 xs:pt-1.5 border-t border-border/30">
              <div className="flex items-center gap-2 xs:gap-2.5">
                <span className="text-[10px] xs:text-xs text-muted-foreground font-medium">
                  Visibilité
                </span>
                <Switch
                  checked={question.visible}
                  onCheckedChange={() =>
                    handleToggleVisibility(question.id, question.visible)
                  }
                  className="data-[state=checked]:bg-green-500 scale-75 xs:scale-90"
                />
                {question.visible ? (
                  <Eye className="h-3 w-3 xs:h-3.5 xs:w-3.5 text-green-600" />
                ) : (
                  <EyeOff className="h-3 w-3 xs:h-3.5 xs:w-3.5 text-gray-600" />
                )}
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  asChild
                  className="h-7 w-7 xs:h-8 xs:w-8 hover:bg-muted"
                  title="Gérer les options"
                >
                  <Link href={`/admin/quiz/questions/${question.id}/options`}>
                    <Settings className="h-3 w-3 xs:h-3.5 xs:w-3.5" />
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  asChild
                  className="h-7 w-7 xs:h-8 xs:w-8 hover:bg-muted"
                >
                  <Link href={`/admin/quiz/questions/${question.id}/edit`}>
                    <Pencil className="h-3 w-3 xs:h-3.5 xs:w-3.5" />
                  </Link>
                </Button>
                <DeleteQuestionDialog
                  questionId={question.id}
                  questionOrder={question.order}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
