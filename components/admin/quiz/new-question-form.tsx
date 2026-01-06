"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Hash, HelpCircle, Loader2, Settings } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const formSchema = z.object({
  order: z
    .number({ message: "L'ordre doit être un nombre" })
    .int("L'ordre doit être un nombre entier")
    .positive("L'ordre doit être positif"),
  question: z
    .string()
    .min(10, "La question est trop courte (min 10 caractères)")
    .max(1000, "La question est trop longue (max 1000 caractères)"),
  visible: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

export default function NewQuestionForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      order: 1,
      question: "",
      visible: true,
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/quiz/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de la création");
      }

      toast.success("Question créée avec succès");
      // Rediriger vers la page de gestion des options
      router.push(`/admin/quiz/questions/${data.id}/options`);
      router.refresh();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Une erreur est survenue";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="font-sans w-full max-w-full">
      {/* Header */}
      <div className="mb-4 sm:mb-8 bg-gradient-to-br from-blue-600 via-cyan-500 to-teal-600 rounded-xl sm:rounded-2xl p-4 sm:p-8 text-white relative overflow-hidden w-full">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,black)]" />
        <div className="relative">
          <Button
            variant="ghost"
            asChild
            className="mb-2 sm:mb-4 text-white hover:bg-white/20"
          >
            <Link href="/admin/quiz/questions">
              <ArrowLeft className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Retour aux questions</span>
              <span className="sm:hidden">Retour</span>
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl sm:text-4xl font-bricolage font-bold mb-1 sm:mb-2">
              Nouvelle question
            </h1>
            <p className="text-sm sm:text-base text-blue-50">
              Créez une nouvelle question pour le quiz
            </p>
          </div>
        </div>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 sm:space-y-8 w-full max-w-full"
        >
          {/* Section: Informations */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 space-y-4 sm:space-y-6 w-full max-w-full">
            <div className="flex items-center gap-2 sm:gap-3 pb-3 sm:pb-4 border-b border-gray-200">
              <div className="rounded-lg bg-blue-100 p-1.5 sm:p-2">
                <HelpCircle className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bricolage font-semibold text-gray-900">
                  Informations de la question
                </h2>
                <p className="text-xs sm:text-sm text-gray-500">
                  Texte et ordre d&apos;affichage
                </p>
              </div>
            </div>

            <FormField
              control={form.control}
              name="order"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="text-gray-700 font-medium flex items-center gap-2 text-sm sm:text-base">
                    <Hash className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400" />
                    Ordre <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="1, 2, 3..."
                      className="border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm sm:text-base w-full"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormDescription className="text-xs text-gray-500">
                    Position de la question dans le quiz
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="question"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="text-gray-700 font-medium text-sm sm:text-base">
                    Question <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ex: Aujourd'hui, ton problème numéro 1, c'est…"
                      className="min-h-[120px] border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none text-sm sm:text-base w-full"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormDescription className="text-xs text-gray-500">
                    Saisissez le texte de la question (10-1000 caractères)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Section: Paramètres d'affichage */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 space-y-4 sm:space-y-6 w-full max-w-full">
            <div className="flex items-center gap-2 sm:gap-3 pb-3 sm:pb-4 border-b border-gray-200">
              <div className="rounded-lg bg-gray-100 p-1.5 sm:p-2">
                <Settings className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bricolage font-semibold text-gray-900">
                  Paramètres d&apos;affichage
                </h2>
                <p className="text-xs sm:text-sm text-gray-500">
                  Visibilité et ordre d&apos;affichage
                </p>
              </div>
            </div>

            <FormField
              control={form.control}
              name="visible"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-lg border border-gray-200 p-3 sm:p-4 bg-gray-50 w-full">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isLoading}
                      className="mt-1"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-gray-700 font-medium text-sm sm:text-base">
                      Visible sur le site
                    </FormLabel>
                    <FormDescription className="text-xs text-gray-500">
                      Cochez pour rendre la question visible dans le quiz
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </div>

          {/* Boutons d'action */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 bg-white rounded-xl border border-gray-200 p-4 sm:p-6 w-full max-w-full">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/quiz/questions")}
              disabled={isLoading}
              className="border-gray-300 hover:bg-gray-50 transition-colors w-full sm:w-auto"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-md hover:shadow-lg transition-all w-full sm:w-auto"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Création...
                </>
              ) : (
                <>
                  <span className="hidden sm:inline">
                    Créer et ajouter des options
                  </span>
                  <span className="sm:hidden">Créer</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
