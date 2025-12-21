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
import { toast } from 'sonner'
import Link from 'next/link'
import { ArrowLeft, Loader2 } from 'lucide-react'

const formSchema = z.object({
  name: z.string().min(1, 'Le nom est requis').max(200, 'Le nom est trop long'),
  description: z.string().optional(),
  logoUrl: z.string().optional(),
  websiteUrl: z.string().url('URL invalide').optional().or(z.literal('')),
  visible: z.boolean(),
  order: z.number().int().min(0),
})

type FormValues = z.infer<typeof formSchema>

interface Partner {
  id: string
  name: string
  description: string | null
  logoUrl: string | null
  websiteUrl: string | null
  visible: boolean
  order: number
}

export default function EditPartnerForm({ partner }: { partner: Partner }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [previousLogoUrl, setPreviousLogoUrl] = useState(partner.logoUrl)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: partner.name,
      description: partner.description || '',
      logoUrl: partner.logoUrl || '',
      websiteUrl: partner.websiteUrl || '',
      visible: partner.visible,
      order: partner.order,
    },
  })

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true)

    try {
      const response = await fetch(`/api/partners/${partner.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          description: values.description || null,
          logoUrl: values.logoUrl || null,
          websiteUrl: values.websiteUrl || null,
          previousLogoUrl,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la modification')
      }

      toast.success('Partenaire modifié avec succès')
      router.push('/admin/partners')
      router.refresh()
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Une erreur est survenue'
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogoRemove = () => {
    // La suppression de l'ancien logo sera gérée par l'API lors de la soumission
    setPreviousLogoUrl(null)
    form.setValue('logoUrl', '')
  }

  return (
    <>
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/admin/partners">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour aux partenaires
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">
          Modifier le partenaire
        </h1>
        <p className="text-muted-foreground mt-1">
          Modifiez les informations du partenaire
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Section: Informations */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Informations</h2>

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom du partenaire *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: Google, Microsoft, etc."
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
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Description du partenaire..."
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
              name="websiteUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Site web</FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder="https://example.com"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormDescription>
                    URL complète du site web du partenaire
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Section: Logo */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Logo</h2>

            <FormField
              control={form.control}
              name="logoUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Logo du partenaire</FormLabel>
                  <FormControl>
                    <ImageUpload
                      value={field.value}
                      onChange={(url) => {
                        field.onChange(url)
                        setPreviousLogoUrl(null)
                      }}
                      onRemove={handleLogoRemove}
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
                      Plus le nombre est petit, plus le partenaire apparaît en
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
                        Cochez cette case pour rendre le partenaire visible sur
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
              onClick={() => router.push('/admin/partners')}
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
