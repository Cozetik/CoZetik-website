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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { ImageUpload } from '@/components/admin/image-upload'
import { slugify } from '@/lib/slugify'
import { toast } from 'sonner'
import Link from 'next/link'
import { ArrowLeft, Loader2 } from 'lucide-react'

const formSchema = z.object({
  title: z
    .string()
    .min(1, 'Le titre est requis')
    .max(200, 'Le titre est trop long'),
  categoryId: z.string().min(1, 'La catégorie est requise'),
  description: z
    .string()
    .min(10, 'Description trop courte (min 10 caractères)')
    .max(1000, 'Description trop longue (max 1000 caractères)'),
  program: z
    .string()
    .min(20, 'Le programme doit être détaillé (min 20 caractères)'),
  price: z
    .number()
    .positive('Le prix doit être positif')
    .optional()
    .nullable(),
  duration: z.string().optional().nullable(),
  imageUrl: z.string().optional(),
  visible: z.boolean(),
  order: z.number().int().min(0),
})

type FormValues = z.infer<typeof formSchema>

interface Category {
  id: string
  name: string
}

interface Formation {
  id: string
  title: string
  categoryId: string
  description: string
  program: string
  price: number | null
  duration: string | null
  imageUrl: string | null
  visible: boolean
  order: number
}

export default function EditFormationForm({
  formation,
  categories,
}: {
  formation: Formation
  categories: Category[]
}) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [previousImageUrl, setPreviousImageUrl] = useState(formation.imageUrl)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: formation.title,
      categoryId: formation.categoryId,
      description: formation.description,
      program: formation.program,
      price: formation.price,
      duration: formation.duration || '',
      imageUrl: formation.imageUrl || '',
      visible: formation.visible,
      order: formation.order,
    },
  })

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true)

    // Générer le slug depuis le titre
    const slug = slugify(values.title)

    if (!slug) {
      toast.error('Le titre doit contenir au moins un caractère valide')
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch(`/api/formations/${formation.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          slug,
          price: values.price || null,
          duration: values.duration || null,
          previousImageUrl,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la modification')
      }

      toast.success('Formation modifiée avec succès')
      router.push('/admin/formations')
      router.refresh()
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Une erreur est survenue'
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageRemove = () => {
    // La suppression de l'ancienne image sera gérée par l'API lors de la soumission
    setPreviousImageUrl(null)
    form.setValue('imageUrl', '')
  }

  return (
    <>
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/admin/formations">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour aux formations
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">
          Modifier la formation
        </h1>
        <p className="text-muted-foreground mt-1">
          Modifiez les informations de la formation
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Section: Informations générales */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Informations générales</h2>

            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Titre *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ex: Formation Intelligence Artificielle"
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
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Catégorie *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={isLoading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez une catégorie" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prix (€)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Laisser vide pour gratuit"
                        {...field}
                        value={field.value ?? ''}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormDescription>
                      Laisser vide si la formation est gratuite
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Durée</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ex: 3 mois, 40 heures"
                        {...field}
                        value={field.value ?? ''}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Section: Contenu */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Contenu</h2>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Description courte de la formation..."
                      className="min-h-[100px] resize-none"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormDescription>
                    Résumé court de la formation (max 1000 caractères)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="program"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Programme détaillé *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Décrivez le programme complet de la formation..."
                      className="min-h-[200px] resize-none"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormDescription>
                    Programme complet avec modules, chapitres, objectifs
                    pédagogiques
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Section: Média */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Média</h2>

            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image de couverture</FormLabel>
                  <FormControl>
                    <ImageUpload
                      value={field.value}
                      onChange={(url) => {
                        field.onChange(url)
                        setPreviousImageUrl(null)
                      }}
                      onRemove={handleImageRemove}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Section: Paramètres */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Paramètres</h2>

            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="order"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ordre d&apos;affichage</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormDescription>
                      Plus le nombre est petit, plus la formation apparaît en
                      premier
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="visible"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Visible sur le site</FormLabel>
                      <FormDescription>
                        Cochez cette case pour rendre la formation visible sur
                        le site public
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Boutons */}
          <div className="flex gap-4 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/admin/formations')}
              disabled={isLoading}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                'Enregistrer les modifications'
              )}
            </Button>
          </div>
        </form>
      </Form>
    </>
  )
}
