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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  Lightbulb,
  Loader2,
  Palette,
  Settings,
  Stethoscope,
  User,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const formSchema = z.object({
  letter: z.string().min(1, "La lettre est requise"),
  name: z.string().min(3, "Le nom est requis (min 3 caractères)"),
  emoji: z.string().min(1, "L'emoji est requis"),
  color: z.string().min(4, "La couleur est requise (format hex)"),
  blocageRacine: z
    .string()
    .min(10, "Le blocage racine est requis (min 10 caractères)"),
  desir: z.string().min(10, "Le désir est requis (min 10 caractères)"),
  phraseMiroir: z
    .string()
    .min(20, "La phrase miroir est requise (min 20 caractères)"),
  programmeSignature: z.string().min(3, "Le programme signature est requis"),
  modulesComplementaires: z.string().optional(),
  visible: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

const LETTERS = ["A", "B", "C", "D", "E", "F", "G", "H"];
const EMOJIS = ["🟦", "🟩", "🟨", "🟧", "🟥", "🟪", "⬛", "⬜"];

export default function NewProfileForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      letter: "",
      name: "",
      emoji: "",
      color: "#3B82F6",
      blocageRacine: "",
      desir: "",
      phraseMiroir: "",
      programmeSignature: "",
      modulesComplementaires: "",
      visible: true,
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);

    try {
      const modulesArray = values.modulesComplementaires
        ? values.modulesComplementaires
            .split("\n")
            .filter((line) => line.trim() !== "")
        : [];

      const response = await fetch("/api/quiz/profiles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          modulesComplementaires: modulesArray,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de la création");
      }

      toast.success("Profil créé avec succès");
      router.push("/admin/quiz/profiles");
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
            <Link href="/admin/quiz/profiles">
              <ArrowLeft className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Retour aux profils</span>
              <span className="sm:hidden">Retour</span>
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl sm:text-4xl font-bricolage font-bold mb-1 sm:mb-2">
              Nouveau profil
            </h1>
            <p className="text-sm sm:text-base text-blue-50">
              Créez un nouveau profil pour le quiz
            </p>
          </div>
        </div>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 sm:space-y-8 w-full max-w-full"
        >
          {/* Section: Identité */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 space-y-4 sm:space-y-6 w-full max-w-full">
            <div className="flex items-center gap-2 sm:gap-3 pb-3 sm:pb-4 border-b border-gray-200">
              <div className="rounded-lg bg-blue-100 p-1.5 sm:p-2">
                <User className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bricolage font-semibold text-gray-900">
                  Identité du profil
                </h2>
                <p className="text-xs sm:text-sm text-gray-500">
                  Lettre, emoji et informations de base
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
              <FormField
                control={form.control}
                name="letter"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium text-sm sm:text-base">
                      Lettre <span className="text-red-500">*</span>
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isLoading}
                    >
                      <FormControl>
                        <SelectTrigger className="border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20">
                          <SelectValue placeholder="Choisir" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {LETTERS.map((letter) => (
                          <SelectItem key={letter} value={letter}>
                            {letter}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="emoji"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium text-sm sm:text-base">
                      Emoji <span className="text-red-500">*</span>
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isLoading}
                    >
                      <FormControl>
                        <SelectTrigger className="border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20">
                          <SelectValue placeholder="Choisir" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {EMOJIS.map((emoji) => (
                          <SelectItem key={emoji} value={emoji}>
                            <span className="text-2xl">{emoji}</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium flex items-center gap-2 text-sm sm:text-base">
                      <Palette className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400" />
                      Couleur <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="color"
                        {...field}
                        disabled={isLoading}
                        className="h-10 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                      />
                    </FormControl>
                    <FormDescription className="text-xs text-gray-500">
                      Format HEX
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="text-gray-700 font-medium text-sm sm:text-base">
                    Nom du profil <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: Le Communicateur Invisible"
                      {...field}
                      disabled={isLoading}
                      className="border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Section: Diagnostic */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 space-y-4 sm:space-y-6 w-full max-w-full">
            <div className="flex items-center gap-2 sm:gap-3 pb-3 sm:pb-4 border-b border-gray-200">
              <div className="rounded-lg bg-blue-100 p-1.5 sm:p-2">
                <Stethoscope className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bricolage font-semibold text-gray-900">
                  Diagnostic
                </h2>
                <p className="text-xs sm:text-sm text-gray-500">
                  Blocages, désirs et phrase miroir
                </p>
              </div>
            </div>

            <FormField
              control={form.control}
              name="blocageRacine"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="text-gray-700 font-medium text-sm sm:text-base">
                    Blocage racine <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ex: l'exposition (regard, trac, sur-contrôle)"
                      className="min-h-[80px] border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 resize-none text-sm sm:text-base w-full"
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
              name="desir"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="text-gray-700 font-medium text-sm sm:text-base">
                    Désir <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ex: être écouté(e), respecté(e), crédible"
                      className="min-h-[80px] border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 resize-none text-sm sm:text-base w-full"
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
              name="phraseMiroir"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="text-gray-700 font-medium text-sm sm:text-base">
                    Phrase miroir <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ex: Tu ne manques pas de talent..."
                      className="min-h-[100px] border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 resize-none text-sm sm:text-base w-full"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormDescription className="text-xs text-gray-500">
                    La phrase qui résonne avec ce profil
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Section: Recommandations */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 space-y-4 sm:space-y-6 w-full max-w-full">
            <div className="flex items-center gap-2 sm:gap-3 pb-3 sm:pb-4 border-b border-gray-200">
              <div className="rounded-lg bg-blue-100 p-1.5 sm:p-2">
                <Lightbulb className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bricolage font-semibold text-gray-900">
                  Recommandations
                </h2>
                <p className="text-xs sm:text-sm text-gray-500">
                  Programmes et modules suggérés
                </p>
              </div>
            </div>

            <FormField
              control={form.control}
              name="programmeSignature"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="text-gray-700 font-medium text-sm sm:text-base">
                    Programme signature <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: FAIS-TOI ENTENDRE"
                      {...field}
                      disabled={isLoading}
                      className="border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm sm:text-base w-full"
                    />
                  </FormControl>
                  <FormDescription className="text-xs text-gray-500">
                    Le programme principal recommandé
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="modulesComplementaires"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="text-gray-700 font-medium text-sm sm:text-base">
                    Modules complémentaires
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Un module par ligne&#10;Parler juste&#10;Habite ton corps&#10;Prendre la parole"
                      className="min-h-[120px] border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 resize-none text-sm sm:text-base w-full"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormDescription className="text-xs text-gray-500">
                    Saisissez un module par ligne
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
                  Contrôlez la visibilité du profil
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
                      Cochez pour rendre le profil visible dans le quiz
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
              onClick={() => router.push("/admin/quiz/profiles")}
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
                  <span className="hidden sm:inline">Créer le profil</span>
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
