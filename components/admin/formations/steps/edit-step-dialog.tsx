"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Clock, Edit, FileText, Hash, ListChecks, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const stepSchema = z.object({
  order: z
    .number({ message: "L'ordre doit être un nombre" })
    .int("L'ordre doit être un nombre entier")
    .positive("L'ordre doit être positif"),
  title: z.string().min(1, "Le titre est requis"),
  description: z.string().min(1, "La description est requise"),
  duration: z.string().optional(),
  keyPoints: z.string().optional(),
});

type FormValues = z.infer<typeof stepSchema>;

interface Step {
  id: string;
  order: number;
  title: string;
  description: string;
  duration: string | null;
  keyPoints: string[];
}

export default function EditStepDialog({
  formationId,
  step,
}: {
  formationId: string;
  step: Step;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(stepSchema),
    defaultValues: {
      order: step.order,
      title: step.title,
      description: step.description,
      duration: step.duration || "",
      keyPoints: step.keyPoints.join("\n"),
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);

    try {
      const keyPointsArray = values.keyPoints
        ? values.keyPoints
            .split("\n")
            .map((point) => point.trim())
            .filter((point) => point.length > 0)
        : [];

      const response = await fetch(
        `/api/formations/${formationId}/steps/${step.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            order: values.order,
            title: values.title,
            description: values.description,
            duration: values.duration || null,
            keyPoints: keyPointsArray,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de la modification");
      }

      toast.success("Étape modifiée avec succès");
      setOpen(false);
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 hover:bg-blue-50 hover:text-blue-600 transition-colors"
        >
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[95vh] p-0 gap-0 overflow-hidden">
        {/* Header avec gradient */}
        <DialogHeader className="px-6 py-5 bg-gradient-to-br from-blue-600 via-cyan-500 to-teal-600 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,black)]" />
          <div className="relative flex items-start gap-4">
            <div className="rounded-xl bg-white/20 backdrop-blur-sm p-3 shadow-lg">
              <Edit className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-2xl font-bricolage font-bold text-white mb-1">
                Modifier l&apos;étape
              </DialogTitle>
              <DialogDescription className="text-blue-50 font-sans">
                Étape #{step.order} • {step.title}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Contenu scrollable */}
        <div className="overflow-y-auto px-6 py-6 max-h-[calc(95vh-180px)] font-sans">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Section Informations principales */}
              <div className="space-y-4">
                <h3 className="text-sm font-bricolage font-semibold text-gray-900 uppercase tracking-wide flex items-center gap-2">
                  <div className="h-1 w-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
                  Informations principales
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="order"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium flex items-center gap-2">
                          <Hash className="h-4 w-4 text-gray-400" />
                          Ordre <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="1"
                            className="border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value))
                            }
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-400" />
                          Durée
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="2 heures"
                            className="border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                            {...field}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium flex items-center gap-2">
                        <FileText className="h-4 w-4 text-gray-400" />
                        Titre <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ex: Fondamentaux de l'IA"
                          className="border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-base"
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Section Contenu */}
              <div className="space-y-4">
                <h3 className="text-sm font-bricolage font-semibold text-gray-900 uppercase tracking-wide flex items-center gap-2">
                  <div className="h-1 w-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
                  Contenu pédagogique
                </h3>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium">
                        Description <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Décrivez ce que les apprenants vont découvrir dans cette étape..."
                          className="min-h-[120px] border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all resize-none"
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormDescription className="text-xs text-gray-500">
                        Expliquez clairement les objectifs et le contenu de
                        l&apos;étape
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="keyPoints"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium flex items-center gap-2">
                        <ListChecks className="h-4 w-4 text-gray-400" />
                        Points clés
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Comprendre les bases de l'IA&#10;Découvrir les cas d'usage concrets&#10;Maîtriser les outils essentiels"
                          className="min-h-[120px] border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all resize-none font-mono text-sm"
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormDescription className="text-xs text-gray-500">
                        Un objectif par ligne • Utilisez des phrases courtes et
                        impactantes
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </form>
          </Form>
        </div>

        {/* Footer fixe */}
        <DialogFooter className="px-6 py-4 bg-gray-50 border-t border-gray-200 gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isLoading}
            className="border-gray-300 hover:bg-white transition-colors"
          >
            Annuler
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            onClick={form.handleSubmit(onSubmit)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-md hover:shadow-lg transition-all"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enregistrement...
              </>
            ) : (
              <>
                <Edit className="mr-2 h-4 w-4" />
                Enregistrer les modifications
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
