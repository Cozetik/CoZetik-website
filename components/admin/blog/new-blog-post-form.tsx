"use client";

import type React from "react";

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

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    form.setValue("title", title);

    if (!manualSlug) {
      const slug = slugify(title);
      form.setValue("slug", slug);
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
    <div className="max-w-4xl">
      <div className="mb-8">
        <Button variant="ghost" asChild className="mb-4 -ml-3">
          <Link href="/admin/blog">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Link>
        </Button>
        <h1 className="text-4xl font-bricolage font-semibold tracking-tight mb-2">
          Nouvel article
        </h1>
        <p className="text-muted-foreground">
          Rédigez un nouvel article pour votre blog
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="space-y-6 p-6 border rounded-lg bg-card">
            <h2 className="text-xl font-bricolage font-semibold">
              Contenu principal
            </h2>

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Titre</FormLabel>
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
                  <FormLabel>Slug (URL)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="ex: 10-conseils-pour-maitriser-ia"
                      {...field}
                      onChange={(e) => {
                        setManualSlug(true);
                        field.onChange(e);
                      }}
                    />
                  </FormControl>
                  <FormDescription>
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
                <FormItem>
                  <FormLabel>Extrait</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Résumé court de l'article..."
                      className="min-h-[80px] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Maximum 500 caractères</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                  <FormLabel>Contenu</FormLabel>
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

          <div className="space-y-6 p-6 border rounded-lg bg-card">
            <h2 className="text-xl font-bricolage font-semibold">
              Image mise en avant
            </h2>

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

          <div className="space-y-6 p-6 border rounded-lg bg-card">
            <h2 className="text-xl font-bricolage font-semibold">SEO</h2>

            <FormField
              control={form.control}
              name="seoTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Meta Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Titre pour les moteurs de recherche"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
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
                <FormItem>
                  <FormLabel>Meta Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Description pour les moteurs de recherche"
                      className="min-h-[80px] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Laissez vide pour utiliser l&apos;extrait (max 160
                    caractères)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-6 p-6 border rounded-lg bg-card">
            <h2 className="text-xl font-bricolage font-semibold">
              Publication
            </h2>

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

          <div className="flex gap-3 pt-4">
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
    </div>
  );
}
