"use client";

import { ImageUpload } from "@/components/admin/image-upload";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { slugify } from "@/lib/slugify";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  ArrowLeft,
  CalendarIcon,
  FileText,
  Image as ImageIcon,
  Loader2,
  Save,
  Search,
  Send,
  X,
} from "lucide-react";
import { marked } from "marked"; // AJOUT
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { AIArticleGenerator } from "./ai-article-generator";
import { ExpertiseArticle } from "./expertise-article";

const blogPostSchema = z.object({
  title: z.string().min(1, "Le titre est requis").max(200),
  slug: z.string().min(1, "Le slug est requis").max(200),
  excerpt: z.string().max(500).optional(),
  content: z.string().min(20, "Le contenu doit être détaillé"),
  imageUrl: z.string().optional(),
  themeId: z.string().optional().nullable(),
  seoTitle: z.string().max(60).optional(),
  seoDescription: z.string().max(160).optional(),
  visible: z.boolean(),
  publishedAt: z.date().optional().nullable(),
});

interface Theme {
  id: string;
  name: string;
}

interface NewBlogPostFormProps {
  themes: Theme[];
}

export default function NewBlogPostForm({ themes }: NewBlogPostFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [manualSlug, setManualSlug] = useState(false);
  const [aiMetadata, setAiMetadata] = useState<any>(null);
  const [aiScore, setAiScore] = useState<number | null>(null);
  const [formKey, setFormKey] = useState(0);

  const form = useForm<z.infer<typeof blogPostSchema>>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
      title: "",
      slug: "",
      excerpt: "",
      content: "<p>Commencez à écrire votre article...</p>",
      imageUrl: "",
      themeId: null,
      seoTitle: "",
      seoDescription: "",
      visible: false,
      publishedAt: null,
    },
  });

  const handleAIGenerated = async (data: any) => {
    try {
      const htmlContent = await marked(data.markdown, {
        breaks: true,
        gfm: true,
      });

      // Chercher un titre avec # ou en gras
      let titleMatch = data.markdown.match(/^#{1,3}\s+(.+)$/m);
      if (!titleMatch) {
        titleMatch = data.markdown.match(/^\*\*(.+?)\*\*/m);
      }

      if (titleMatch && titleMatch[1]) {
        const extractedTitle = titleMatch[1]
          .trim()
          .replace(/\*\*(.+?)\*\*/g, "$1")
          .replace(/\*(.+?)\*/g, "$1")
          .replace(/`(.+?)`/g, "$1")
          .replace(/\[(.+?)\]\(.+?\)/g, "$1")
          .replace(/~~(.+?)~~/g, "$1")
          .trim();

        const slug = slugify(extractedTitle);
        const seoTitle =
          extractedTitle.length > 60
            ? extractedTitle.substring(0, 57) + "..."
            : extractedTitle;

        const textOnly = data.markdown
          .replace(/^#+\s+.+$/gm, "")
          .replace(/\*\*(.+?)\*\*/g, "$1")
          .replace(/\*(.+?)\*/g, "$1")
          .replace(/\[(.+?)\]\(.+?\)/g, "$1")
          .replace(/```[\s\S]*?```/g, "")
          .replace(/`(.+?)`/g, "$1")
          .replace(/^\s*[-*+]\s+/gm, "")
          .replace(/^\s*\d+\.\s+/gm, "")
          .replace(/\n+/g, " ")
          .trim();

        const excerpt = textOnly.substring(0, 200).trim();
        const lastSpaceExcerpt = excerpt.lastIndexOf(" ");
        const cleanExcerpt =
          lastSpaceExcerpt > 150
            ? excerpt.substring(0, lastSpaceExcerpt) + "..."
            : excerpt + "...";

        const seoDesc = textOnly.substring(0, 160).trim();
        const lastSpaceSeo = seoDesc.lastIndexOf(" ");
        const cleanSeoDesc =
          lastSpaceSeo > 140
            ? seoDesc.substring(0, lastSpaceSeo) + "..."
            : seoDesc + "...";

        // Utiliser setTimeout pour forcer le re-render dans le prochain tick
        setTimeout(() => {
          form.reset(
            {
              title: extractedTitle,
              slug: slug,
              excerpt: cleanExcerpt,
              content: htmlContent,
              imageUrl: "",
              themeId: null,
              seoTitle: seoTitle,
              seoDescription: cleanSeoDesc,
              visible: false,
              publishedAt: null,
            },
            {
              keepDefaultValues: false,
            }
          );

          setManualSlug(false);
          setFormKey((prev) => prev + 1);
        }, 0);
      } else {
        // Pas de titre trouvé, on met juste le contenu
        form.setValue("content", htmlContent, { shouldValidate: true });
      }

      const report = data.expertise_report || data.expertiseReport;
      if (report && typeof report === "object") {
        const avgScore =
          Object.values(report).reduce(
            (a: number, b) => (a as number) + (b as number),
            0
          ) / Object.keys(report).length;

        setAiScore(avgScore);
        setAiMetadata({
          expertise_report: report,
          sources: data.sources || [],
        });
      } else {
        setAiScore(null);
        setAiMetadata(null);
      }

      toast.success("Article généré avec titre et extrait !", {
        description: "Vous pouvez modifier les champs avant publication.",
      });
    } catch (error) {
      console.error("❌ Erreur lors de la conversion Markdown:", error);
      toast.error("Erreur lors du formatage du contenu");
    }
  };

  const onSubmit = async (values: z.infer<typeof blogPostSchema>) => {
    setIsLoading(true);

    const publishedAt =
      values.visible && !values.publishedAt ? new Date() : values.publishedAt;

    try {
      const response = await fetch("/api/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          aiScore,
          aiMetadata,
          isReviewRequired: true,
          excerpt: values.excerpt || null,
          imageUrl: values.imageUrl || null,
          themeId: values.themeId || null,
          seoTitle: values.seoTitle || null,
          seoDescription: values.seoDescription || null,
          publishedAt: publishedAt ? publishedAt.toISOString() : null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de la création");
      }

      toast.success(
        values.visible
          ? "Article publié avec succès"
          : "Article enregistré en brouillon"
      );
      router.push("/admin/blog");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur inconnue");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="font-sans w-full">
      {/* Header */}
      <div className="mb-4 sm:mb-8 bg-gradient-to-br from-blue-600 via-cyan-500 to-teal-600 rounded-xl sm:rounded-2xl p-4 sm:p-8 text-white relative overflow-hidden w-full">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,black)]" />
        <div className="relative">
          <Button
            variant="ghost"
            asChild
            className="mb-2 sm:mb-4 text-white hover:bg-white/20 hover:text-white"
          >
            <Link href="/admin/blog">
              <ArrowLeft className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Retour aux articles</span>
              <span className="sm:hidden">Retour</span>
            </Link>
          </Button>
          <h1 className="text-2xl sm:text-4xl font-bricolage font-bold mb-1 sm:mb-2">
            Nouvel article
          </h1>
          <p className="text-sm sm:text-base text-blue-50">
            Rédigez un nouvel article pour votre blog
          </p>
        </div>
      </div>

      <Form key={formKey} {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 sm:space-y-8 w-full max-w-full"
        >
          <AIArticleGenerator onGenerated={handleAIGenerated} />
          {aiMetadata && (
            <ExpertiseArticle
              report={aiMetadata.expertise_report}
              sources={aiMetadata.sources}
            />
          )}
          {/* Section: Contenu principal */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 space-y-4 sm:space-y-6 w-full max-w-full">
            <div className="flex items-center gap-2 sm:gap-3 pb-3 sm:pb-4 border-b border-gray-200">
              <div className="rounded-lg bg-blue-100 p-1.5 sm:p-2">
                <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bricolage font-semibold text-gray-900">
                  Contenu principal
                </h2>
                <p className="text-xs sm:text-sm text-gray-500">
                  Titre, slug, extrait et contenu
                </p>
              </div>
            </div>

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="text-gray-700 font-medium text-sm sm:text-base">
                    Titre <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: 10 Conseils pour maîtriser l'IA"
                      className="border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all w-full text-sm sm:text-base"
                      value={field.value || ""}
                      onChange={(e) => {
                        field.onChange(e);
                        if (!manualSlug) {
                          const slug = slugify(e.target.value);
                          form.setValue("slug", slug);
                        }
                      }}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="text-gray-700 font-medium text-sm sm:text-base">
                    Slug (URL) <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="ex: 10-conseils-pour-maitriser-ia"
                      className="border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all w-full text-sm sm:text-base font-mono"
                      value={field.value || ""}
                      onChange={(e) => {
                        setManualSlug(true);
                        field.onChange(e);
                      }}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormDescription className="text-xs text-gray-500">
                    URL de l&apos;article (généré automatiquement depuis le
                    titre)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="excerpt"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="text-gray-700 font-medium text-sm sm:text-base">
                    Extrait
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Résumé court de l'article..."
                      className="min-h-[100px] border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all w-full text-sm sm:text-base"
                      value={field.value || ""}
                      onChange={field.onChange}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormDescription className="text-xs text-gray-500">
                    Maximum 500 caractères
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="themeId"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="text-gray-700 font-medium text-sm sm:text-base">
                    Thème
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value || undefined}
                    disabled={isLoading}
                  >
                    <FormControl>
                      <SelectTrigger className="border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20">
                        <SelectValue placeholder="Sélectionner un thème" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {themes.length > 0 ? (
                        themes.map((theme) => (
                          <SelectItem key={theme.id} value={theme.id}>
                            {theme.name}
                          </SelectItem>
                        ))
                      ) : (
                        <div className="p-2 text-sm text-muted-foreground">
                          Aucun thème disponible
                        </div>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="text-gray-700 font-medium text-sm sm:text-base">
                    Contenu <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <RichTextEditor
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Section: Image */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 space-y-4 sm:space-y-6 w-full max-w-full">
            <div className="flex items-center gap-2 sm:gap-3 pb-3 sm:pb-4 border-b border-gray-200">
              <div className="rounded-lg bg-pink-100 p-1.5 sm:p-2">
                <ImageIcon className="h-4 w-4 sm:h-5 sm:w-5 text-pink-600" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bricolage font-semibold text-gray-900">
                  Image mise en avant
                </h2>
                <p className="text-xs sm:text-sm text-gray-500">
                  Image principale de l&apos;article
                </p>
              </div>
            </div>

            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="text-gray-700 font-medium text-sm sm:text-base">
                    Image
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
                    Image principale de l&apos;article (recommandé)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Section: SEO */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 space-y-4 sm:space-y-6 w-full max-w-full">
            <div className="flex items-center gap-2 sm:gap-3 pb-3 sm:pb-4 border-b border-gray-200">
              <div className="rounded-lg bg-green-100 p-1.5 sm:p-2">
                <Search className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bricolage font-semibold text-gray-900">
                  Référencement SEO
                </h2>
                <p className="text-xs sm:text-sm text-gray-500">
                  Optimisez pour les moteurs de recherche
                </p>
              </div>
            </div>

            <FormField
              control={form.control}
              name="seoTitle"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="text-gray-700 font-medium text-sm sm:text-base">
                    Meta Title
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Titre pour les moteurs de recherche"
                      className="border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all w-full text-sm sm:text-base"
                      value={field.value || ""} // ← Force une string vide
                      onChange={field.onChange}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormDescription className="text-xs text-gray-500">
                    Laissez vide pour utiliser le titre de l&apos;article (max
                    60 caractères)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="seoDescription"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="text-gray-700 font-medium text-sm sm:text-base">
                    Meta Description
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Description pour les moteurs de recherche"
                      className="min-h-[100px] border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all w-full text-sm sm:text-base"
                      value={field.value || ""}
                      onChange={field.onChange}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormDescription className="text-xs text-gray-500">
                    Laissez vide pour utiliser l&apos;extrait (max 160
                    caractères)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Section: Publication */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 space-y-4 sm:space-y-6 w-full max-w-full">
            <div className="flex items-center gap-2 sm:gap-3 pb-3 sm:pb-4 border-b border-gray-200">
              <div className="rounded-lg bg-purple-100 p-1.5 sm:p-2">
                <Send className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bricolage font-semibold text-gray-900">
                  Publication
                </h2>
                <p className="text-xs sm:text-sm text-gray-500">
                  Statut et date de publication
                </p>
              </div>
            </div>

            <FormField
              control={form.control}
              name="visible"
              render={({ field }) => (
                <FormItem className="space-y-3 w-full">
                  <FormLabel className="text-gray-700 font-medium text-sm sm:text-base">
                    Statut
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={(value) =>
                        field.onChange(value === "true")
                      }
                      value={field.value ? "true" : "false"}
                      className="flex gap-4"
                      disabled={isLoading}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="false" id="new-post-draft" />
                        <label
                          htmlFor="new-post-draft"
                          className="cursor-pointer text-sm font-normal"
                        >
                          Brouillon
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="true" id="new-post-published" />
                        <label
                          htmlFor="new-post-published"
                          className="cursor-pointer text-sm"
                        >
                          Publié
                        </label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.watch("visible") && (
              <FormField
                control={form.control}
                name="publishedAt"
                render={({ field }) => (
                  <FormItem className="flex flex-col w-full">
                    <FormLabel className="text-gray-700 font-medium text-sm sm:text-base">
                      Date de publication
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            disabled={isLoading}
                            className={cn(
                              "pl-3 text-left font-normal w-full border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP", { locale: fr })
                            ) : (
                              <span>
                                Date de publication (aujourd&apos;hui par
                                défaut)
                              </span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value || undefined}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription className="text-xs text-gray-500">
                      Laisser vide pour publier immédiatement
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>

          {/* Boutons d'action */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 bg-white rounded-xl border border-gray-200 p-4 sm:p-6 w-full max-w-full">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/blog")}
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
                  Enregistrement...
                </>
              ) : form.watch("visible") ? (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">
                    Publier l&apos;article
                  </span>
                  <span className="sm:hidden">Publier</span>
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">
                    Enregistrer en brouillon
                  </span>
                  <span className="sm:hidden">Enregistrer</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
