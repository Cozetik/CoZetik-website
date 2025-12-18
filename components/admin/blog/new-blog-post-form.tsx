'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { ImageUpload } from '@/components/admin/image-upload'
import { RichTextEditor } from '@/components/admin/rich-text-editor'
import { slugify } from '@/lib/slugify'
import { toast } from 'sonner'
import Link from 'next/link'
import { ArrowLeft, CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { cn } from '@/lib/utils'

const blogPostSchema = z.object({
  title: z.string().min(1, 'Le titre est requis').max(200),
  slug: z.string().min(1, 'Le slug est requis').max(200),
  excerpt: z.string().max(500).optional(),
  content: z.string().min(20, 'Le contenu doit être détaillé'),
  imageUrl: z.string().optional(),
  seoTitle: z.string().max(60).optional(),
  seoDescription: z.string().max(160).optional(),
  visible: z.boolean(),
  publishedAt: z.date().optional().nullable(),
})

export default function NewBlogPostForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [manualSlug, setManualSlug] = useState(false)

  const form = useForm<z.infer<typeof blogPostSchema>>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
      title: '',
      slug: '',
      excerpt: '',
      content: '<p>Commencez à écrire votre article...</p>',
      imageUrl: '',
      seoTitle: '',
      seoDescription: '',
      visible: false,
      publishedAt: null,
    },
  })

  // Auto-générer le slug depuis le titre
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value
    form.setValue('title', title)

    if (!manualSlug) {
      const slug = slugify(title)
      form.setValue('slug', slug)
    }
  }

  const onSubmit = async (values: z.infer<typeof blogPostSchema>) => {
    setIsLoading(true)

    // Si publié et pas de date, mettre date actuelle
    const publishedAt =
      values.visible && !values.publishedAt ? new Date() : values.publishedAt

    try {
      const response = await fetch('/api/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          excerpt: values.excerpt || null,
          imageUrl: values.imageUrl || null,
          seoTitle: values.seoTitle || null,
          seoDescription: values.seoDescription || null,
          publishedAt: publishedAt ? publishedAt.toISOString() : null,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la création')
      }

      toast.success(
        values.visible
          ? 'Article publié avec succès'
          : 'Article enregistré en brouillon'
      )
      router.push('/admin/blog')
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erreur inconnue')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/admin/blog">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour au blog
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Nouvel article</h1>
        <p className="text-muted-foreground">
          Rédigez un nouvel article pour votre blog
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Section: Contenu principal */}
          <div className="space-y-4 p-6 border rounded-lg bg-card">
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
                      onChange={(e) => {
                        setManualSlug(true)
                        field.onChange(e)
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
          <div className="space-y-4 p-6 border rounded-lg bg-card">
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
                      onRemove={() => field.onChange('')}
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
          <div className="space-y-4 p-6 border rounded-lg bg-card">
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
          <div className="space-y-4 p-6 border rounded-lg bg-card">
            <h2 className="text-xl font-semibold">Publication</h2>

            <FormField
              control={form.control}
              name="visible"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Statut</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={(value) => field.onChange(value === 'true')}
                      value={field.value ? 'true' : 'false'}
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

            {form.watch('visible') && (
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
                              'pl-3 text-left font-normal w-full',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'PPP', { locale: fr })
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
              onClick={() => router.push('/admin/blog')}
              disabled={isLoading}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading
                ? 'Enregistrement...'
                : form.watch('visible')
                  ? 'Publier'
                  : 'Enregistrer en brouillon'}
            </Button>
          </div>
        </form>
      </Form>
    </>
  )
}
