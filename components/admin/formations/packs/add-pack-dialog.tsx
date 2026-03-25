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
import { Checkbox } from "@/components/ui/checkbox";
import { zodResolver } from "@hookform/resolvers/zod";
import { Euro, FileText, Hash, ListChecks, Loader2, Plus, Star, TrendingDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const packSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  description: z.string().optional(),
  price: z.number({ message: "Le prix doit être un nombre" }).positive("Le prix doit être positif"),
  originalPrice: z.number().positive().optional().nullable(),
  savings: z.string().optional(),
  features: z.string().min(1, "Au moins une inclusion est requise"),
  isPopular: z.boolean().default(false),
  order: z
    .number({ message: "L'ordre doit être un nombre" })
    .int("L'ordre doit être un nombre entier")
    .min(0, "L'ordre doit être positif ou zéro"),
});

type FormValues = z.infer<typeof packSchema>;

export default function AddPackDialog({
  formationId,
  nextOrder = 0,
}: {
  formationId: string;
  nextOrder?: number;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(packSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      originalPrice: null,
      savings: "",
      features: "",
      isPopular: false,
      order: nextOrder,
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);

    try {
      const featuresArray = values.features
        ? values.features
            .split("\n")
            .map((f) => f.trim())
            .filter((f) => f.length > 0)
        : [];

      const response = await fetch(`/api/formations/${formationId}/packs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          features: featuresArray,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de la création");
      }

      toast.success("Pack ajouté avec succès");
      setOpen(false);
      form.reset({
        name: "",
        description: "",
        price: 0,
        originalPrice: null,
        savings: "",
        features: "",
        isPopular: false,
        order: nextOrder + 1,
      });
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
          size="lg"
          className="bg-gradient-to-r flex items-center text-md from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg font-bricolage font-semibold"
        >
          <Plus className="mr-2 h-5 w-5" />
          Nouveau pack
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[95vh] p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-6 py-5 bg-gradient-to-br from-blue-600 via-cyan-500 to-teal-600 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,black)]" />
          <div className="relative flex items-start gap-4">
            <div className="rounded-xl bg-white/20 backdrop-blur-sm p-3 shadow-lg">
              <Plus className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-2xl font-bricolage font-bold text-white mb-1">
                Nouveau pack
              </DialogTitle>
              <DialogDescription className="text-blue-50 font-sans">
                Ajoutez un pack tarifaire (Découverte, Premium, Expert)
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="overflow-y-auto px-6 py-6 max-h-[calc(95vh-180px)] font-sans">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-sm font-bricolage font-semibold text-gray-900 uppercase tracking-wide flex items-center gap-2">
                  <div className="h-1 w-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
                  Informations principales
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium flex items-center gap-2">
                          <FileText className="h-4 w-4 text-gray-400" />
                          Nom <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Découverte, Premium, Expert..."
                            className="border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                            {...field}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

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
                            placeholder="0"
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
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium">
                        Description courte
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ex: Idéal pour démarrer"
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

              <div className="space-y-4">
                <h3 className="text-sm font-bricolage font-semibold text-gray-900 uppercase tracking-wide flex items-center gap-2">
                  <div className="h-1 w-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full" />
                  Tarification
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium flex items-center gap-2">
                          <Euro className="h-4 w-4 text-gray-400" />
                          Prix TTC <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="1500"
                            className="border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseFloat(e.target.value))
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
                    name="originalPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium flex items-center gap-2">
                          <TrendingDown className="h-4 w-4 text-gray-400" />
                          Prix barré (optionnel)
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="3000"
                            className="border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all"
                            {...field}
                            value={field.value ?? ""}
                            onChange={(e) =>
                              field.onChange(e.target.value ? parseFloat(e.target.value) : null)
                            }
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
                  name="savings"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium">
                        Texte d&apos;économie
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ex: Soit 400€ d'économies"
                          className="border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all"
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-bricolage font-semibold text-gray-900 uppercase tracking-wide flex items-center gap-2">
                  <div className="h-1 w-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
                  Inclusions & Mise en avant
                </h3>

                <FormField
                  control={form.control}
                  name="features"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium flex items-center gap-2">
                        <ListChecks className="h-4 w-4 text-gray-400" />
                        Ce qui est inclut <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="1 formation&#10;30h de formation&#10;3 rdvs individuels"
                          className="min-h-[120px] border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all resize-none font-mono text-sm"
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormDescription className="text-xs text-gray-500">
                        Un élément par ligne
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isPopular"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-lg border border-gray-200 p-4 bg-yellow-50/50">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-gray-900 font-semibold flex items-center gap-2">
                          <Star className="h-4 w-4 text-yellow-600 fill-yellow-600" />
                          Offre la plus choisie
                        </FormLabel>
                        <FormDescription className="text-xs text-gray-600">
                          Affiche un badge &quot;OFFRE LA PLUS CHOISIE&quot; sur la carte
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </form>
          </Form>
        </div>

        <DialogFooter className="px-6 py-4 bg-gray-50 border-t border-gray-200 gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isLoading}
            className="border-gray-300 hover:bg-white transition-colors font-sans"
          >
            Annuler
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            onClick={form.handleSubmit(onSubmit)}
            className=" font-sans bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-md hover:shadow-lg transition-all"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Ajout en cours...
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Ajouter le pack
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
