"use client";

import { ImageUpload } from "@/components/admin/image-upload";
import { Button } from "@/components/ui/button";
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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  Building2,
  Eye,
  Globe,
  Hash,
  Image as ImageIcon,
  Loader2,
  Save,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const formSchema = z.object({
  name: z.string().min(1, "Le nom est requis").max(200, "Le nom est trop long"),
  description: z.string().optional(),
  logoUrl: z.string().optional(),
  websiteUrl: z.string().url("URL invalide").optional().or(z.literal("")),
  visible: z.boolean(),
  order: z.number().int().min(0),
});

type FormValues = z.infer<typeof formSchema>;

export default function NewPartnerForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      logoUrl: "",
      websiteUrl: "",
      visible: true,
      order: 0,
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/partners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          description: values.description || null,
          logoUrl: values.logoUrl || null,
          websiteUrl: values.websiteUrl || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de la création");
      }

      toast.success("Partenaire créé avec succès");
      router.push("/admin/partners");
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
    <div className="font-sans w-full max-w-none">
      {/* Header */}
      <div className="mb-4 sm:mb-8 bg-gradient-to-br from-blue-600 via-cyan-500 to-teal-600 rounded-xl sm:rounded-2xl p-4 sm:p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,black)]" />
        <div className="relative">
          <Button
            variant="ghost"
            asChild
            className="mb-2 sm:mb-4 text-white hover:bg-white/20 hover:text-white"
          >
            <Link href="/admin/partners">
              <ArrowLeft className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Retour aux partenaires</span>
              <span className="sm:hidden">Retour</span>
            </Link>
          </Button>
          <h1 className="text-2xl sm:text-4xl font-bricolage font-bold mb-1 sm:mb-2">
            Nouveau partenaire
          </h1>
          <p className="text-sm sm:text-base text-cyan-50">
            Ajoutez un nouveau partenaire à votre réseau
          </p>
        </div>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 sm:space-y-8"
        >
          {/* Section: Informations générales */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 space-y-4 sm:space-y-6">
            <div className="flex items-center gap-2 sm:gap-3 pb-3 sm:pb-4 border-b border-gray-200">
              <div className="rounded-lg bg-blue-100 p-1.5 sm:p-2">
                <Building2 className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bricolage font-semibold text-gray-900">
                  Informations générales
                </h2>
                <p className="text-xs sm:text-sm text-gray-500">
                  Nom, description et site web
                </p>
              </div>
            </div>

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-medium text-sm sm:text-base">
                    Nom du partenaire <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: Google, Microsoft, Amazon..."
                      className="border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm sm:text-base"
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
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-medium text-sm sm:text-base">
                    Description
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Décrivez brièvement ce partenaire..."
                      className="min-h-[100px] border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm sm:text-base"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormDescription className="text-xs text-gray-500">
                    Description optionnelle du partenariat
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="websiteUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-medium flex items-center gap-2 text-sm sm:text-base">
                    <Globe className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400" />
                    Site web
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder="https://example.com"
                      className="border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm sm:text-base"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormDescription className="text-xs text-gray-500">
                    URL complète du site web du partenaire
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="order"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-medium flex items-center gap-2 text-sm sm:text-base">
                    <Hash className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400" />
                    Ordre d&apos;affichage
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0"
                      className="border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm sm:text-base"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value) || 0)
                      }
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormDescription className="text-xs text-gray-500">
                    Plus le nombre est petit, plus le partenaire apparaît en
                    premier
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Section: Logo */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 space-y-4 sm:space-y-6">
            <div className="flex items-center gap-2 sm:gap-3 pb-3 sm:pb-4 border-b border-gray-200">
              <div className="rounded-lg bg-pink-100 p-1.5 sm:p-2">
                <ImageIcon className="h-4 w-4 sm:h-5 sm:w-5 text-pink-600" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bricolage font-semibold text-gray-900">
                  Logo du partenaire
                </h2>
                <p className="text-xs sm:text-sm text-gray-500">
                  Logo ou image représentative
                </p>
              </div>
            </div>

            <FormField
              control={form.control}
              name="logoUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-medium text-sm sm:text-base">
                    Logo
                  </FormLabel>
                  <FormControl>
                    <ImageUpload
                      value={field.value}
                      onChange={field.onChange}
                      onRemove={() => field.onChange("")}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormDescription className="text-xs text-gray-500">
                    Logo du partenaire (recommandé pour l&apos;affichage)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Section: Visibilité */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 space-y-4 sm:space-y-6">
            <div className="flex items-center gap-2 sm:gap-3 pb-3 sm:pb-4 border-b border-gray-200">
              <div className="rounded-lg bg-green-100 p-1.5 sm:p-2">
                <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bricolage font-semibold text-gray-900">
                  Visibilité
                </h2>
                <p className="text-xs sm:text-sm text-gray-500">
                  Contrôlez l&apos;affichage sur le site public
                </p>
              </div>
            </div>

            <FormField
              control={form.control}
              name="visible"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-lg border border-gray-200 p-3 sm:p-4 bg-green-50">
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isLoading}
                      className="data-[state=checked]:bg-green-500 mt-1"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-gray-700 font-medium text-sm sm:text-base">
                      Partenaire visible
                    </FormLabel>
                    <FormDescription className="text-xs text-gray-500">
                      Activez cette option pour rendre le partenaire visible sur
                      le site public
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </div>

          {/* Boutons d'action */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/partners")}
              disabled={isLoading}
              className="border-gray-300 hover:bg-gray-50 transition-colors w-full sm:w-auto"
            >
              <X className="mr-2 h-4 w-4" />
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
                  <Save className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Créer le partenaire</span>
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
