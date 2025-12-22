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
import { Checkbox } from '@/components/ui/checkbox'
import { ImageUpload } from '@/components/admin/image-upload'
import { slugify } from '@/lib/slugify'
import { toast } from 'sonner'
import Link from 'next/link'
import { ArrowLeft, Loader2 } from 'lucide-react'

const formSchema = z.object({
  name: z.string().min(1, 'Le nom est requis').max(100, 'Le nom est trop long'),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  visible: z.boolean(),
  order: z.number().int().min(0),
})

type FormValues = z.infer<typeof formSchema>

export default function NewCategoryPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      imageUrl: '',
      visible: true,
      order: 0,
    },
  })

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true)

    // Générer le slug depuis le nom
    const slug = slugify(values.name)

    if (!slug) {
      toast.error('Le nom doit contenir au moins un caractère valide')
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          slug,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la création')
      }

      toast.success('Catégorie créée avec succès')
      router.push('/admin/categories')
      router.refresh()
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Une erreur est survenue'
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/admin/categories">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour aux catégories
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">
          Nouvelle catégorie
        </h1>
        <p className="text-muted-foreground mt-1">
          Créez une nouvelle catégorie de formation
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: Intelligence Artificielle"
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
                  <FormLabel>Ordre d&apos;affichage</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      value={field.value}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormDescription>
                    Plus le nombre est petit, plus la catégorie apparaît en
                    premier
                  </FormDescription>
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
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Description de la catégorie..."
                    className="min-h-[100px] resize-none"
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
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value}
                    onChange={field.onChange}
                    onRemove={() => field.onChange('')}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormDescription>
                  Image principale de la catégorie (optionnel)
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
                    Cochez cette case pour rendre la catégorie visible sur le
                    site public
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/admin/categories')}
              disabled={isLoading}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Création...
                </>
              ) : (
                'Créer la catégorie'
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
