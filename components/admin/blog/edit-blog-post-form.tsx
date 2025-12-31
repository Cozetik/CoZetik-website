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
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { ArrowLeft, CalendarIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

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

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  themeId: string | null;
  imageUrl: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  visible: boolean;
  publishedAt: Date | string | null;
}

// Ajout de l'interface Theme
interface Theme {
  id: string;
  name: string;
}

interface EditBlogPostFormProps {
  post: BlogPost;
  themes: Theme[]; // Ajout de la prop themes
}

export default function EditBlogPostForm({
  post,
  themes,
}: EditBlogPostFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [previousImageUrl] = useState(post.imageUrl);

  const form = useForm<z.infer<typeof blogPostSchema>>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || "",
      content: post.content,
      imageUrl: post.imageUrl || "",
      themeId: post.themeId || null,
      seoTitle: post.seoTitle || "",
      seoDescription: post.seoDescription || "",
      visible: post.visible,
      publishedAt: post.publishedAt ? new Date(post.publishedAt) : null,
    },
  });

  // Gestion du changement de titre (sans regénérer le slug)
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    form.setValue("title", title);
    // Le slug n'est plus régénéré automatiquement lors de l'édition
  };

  const onSubmit = async (values: z.infer<typeof blogPostSchema>) => {
    setIsLoading(true);

    // Si publié et pas de date, mettre date actuelle
    const publishedAt =
      values.visible && !values.publishedAt ? new Date() : values.publishedAt;

    try {
      const response = await fetch(`/api/blog/${post.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          excerpt: values.excerpt || null,
          imageUrl: values.imageUrl || null,
          themeId: values.themeId || null,
          seoTitle: values.seoTitle || null,
          seoDescription: values.seoDescription || null,
          publishedAt: publishedAt ? publishedAt.toISOString() : null,
          previousImageUrl, // Pour supprimer l'ancienne image si changée
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de la mise à jour");
      }

      toast.success(
        values.visible
          ? "Article publié avec succès"
          : "Article mis à jour en brouillon"
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
    <>
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/admin/blog">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour au blog
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Modifier l&apos;article</h1>
        <p className="text-muted-foreground">
          Modifiez les informations de votre article
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Section: Contenu principal */}
          <div className="space-y-4 p-6 border rounded-none bg-card">
            <h2 className="text-xl font-semibold">Contenu principal</h2>

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Titre *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: 10 Conseils pour maîtriser l'IA"
                      {...field}
                      onChange={handleTitleChange}
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
                <FormItem>
                  <FormLabel>Slug (URL) *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="ex: 10-conseils-pour-maitriser-ia"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    URL de l&apos;article (modifiable manuellement)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="excerpt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Extrait</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Résumé court de l'article (pour la liste et le SEO)..."
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Maximum 500 caractères</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Remplacement du placeholder par le vrai Select */}
            <FormField
              control={form.control}
              name="themeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Thème</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value || undefined}
                  >
                    <FormControl>
                      <SelectTrigger>
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
                <FormItem>
                  <FormLabel>Contenu *</FormLabel>
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

          {/* Section: Médias */}
          <div className="space-y-4 p-6 border rounded-none bg-card">
            <h2 className="text-xl font-semibold">Image mise en avant</h2>

            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image</FormLabel>
                  <FormControl>
                    <ImageUpload
                      value={field.value}
                      onChange={field.onChange}
                      onRemove={() => field.onChange("")}
                    />
                  </FormControl>
                  <FormDescription>
                    Image principale de l&apos;article (recommandé)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Section: SEO */}
          <div className="space-y-4 p-6 border rounded-none bg-card">
            <h2 className="text-xl font-semibold">SEO</h2>

            <FormField
              control={form.control}
              name="seoTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Meta Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Titre pour les moteurs de recherche (max 60 caractères)"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Laissez vide pour utiliser le titre de l&apos;article
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="seoDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Meta Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Description pour les moteurs de recherche (max 160 caractères)"
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Laissez vide pour utiliser l&apos;extrait
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Section: Publication */}
          <div className="space-y-4 p-6 border rounded-none bg-card">
            <h2 className="text-xl font-semibold">Publication</h2>

            <FormField
              control={form.control}
              name="visible"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Statut</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={(value) =>
                        field.onChange(value === "true")
                      }
                      value={field.value ? "true" : "false"}
                      className="flex gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="false" id="draft" />
                        <label
                          htmlFor="draft"
                          className="cursor-pointer text-sm font-normal"
                        >
                          Brouillon
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="true" id="published" />
                        <label
                          htmlFor="published"
                          className="cursor-pointer text-sm font-normal"
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
                  <FormItem className="flex flex-col">
                    <FormLabel>Date de publication</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "pl-3 text-left font-normal w-full",
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
                    <FormDescription>
                      Laisser vide pour publier immédiatement
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>

          {/* Boutons */}
          <div className="flex gap-4 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/blog")}
              disabled={isLoading}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading
                ? "Enregistrement..."
                : form.watch("visible")
                  ? "Publier"
                  : "Enregistrer en brouillon"}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
