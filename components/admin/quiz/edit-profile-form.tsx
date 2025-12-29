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
import { toast } from 'sonner'
import Link from 'next/link'
import { ArrowLeft, Loader2 } from 'lucide-react'

const formSchema = z.object({
  letter: z.string().min(1, 'La lettre est requise'),
  name: z.string().min(3, 'Le nom est requis (min 3 caractères)'),
  emoji: z.string().min(1, 'L\'emoji est requis'),
  color: z.string().min(4, 'La couleur est requise (format hex)'),
  blocageRacine: z.string().min(10, 'Le blocage racine est requis (min 10 caractères)'),
  desir: z.string().min(10, 'Le désir est requis (min 10 caractères)'),
  phraseMiroir: z.string().min(20, 'La phrase miroir est requise (min 20 caractères)'),
  programmeSignature: z.string().min(3, 'Le programme signature est requis'),
  modulesComplementaires: z.string().optional(),
  visible: z.boolean(),
})

type FormValues = z.infer<typeof formSchema>

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
const EMOJIS = ['🟦', '🟩', '🟨', '🟧', '🟥', '🟪', '⬛', '⬜']

interface Profile {
  id: string
  letter: string
  name: string
  emoji: string
  color: string
  blocageRacine: string
  desir: string
  phraseMiroir: string
  programmeSignature: string
  modulesComplementaires: string[]
  visible: boolean
}

export default function EditProfileForm({ profile }: { profile: Profile }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      letter: profile.letter,
      name: profile.name,
      emoji: profile.emoji,
      color: profile.color,
      blocageRacine: profile.blocageRacine,
      desir: profile.desir,
      phraseMiroir: profile.phraseMiroir,
      programmeSignature: profile.programmeSignature,
      modulesComplementaires: profile.modulesComplementaires.join('\n'),
      visible: profile.visible,
    },
  })

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true)

    try {
      // Convertir modulesComplementaires (string avec retours à la ligne) en array
      const modulesArray = values.modulesComplementaires
        ? values.modulesComplementaires.split('\n').filter(line => line.trim() !== '')
        : []

      const response = await fetch(`/api/quiz/profiles/${profile.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          modulesComplementaires: modulesArray,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la modification')
      }

      toast.success('Profil modifié avec succès')
      router.push('/admin/quiz/profiles')
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
    <>
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/admin/quiz/profiles">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour aux profils
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">
          Modifier le profil
        </h1>
        <p className="text-muted-foreground mt-1">
          Profil {profile.letter} : {profile.name}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Section: Identité */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Identité du profil</h2>

            <div className="grid gap-6 md:grid-cols-3">
              <FormField
                control={form.control}
                name="letter"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lettre *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={isLoading}
                    >
                      <FormControl>
                        <SelectTrigger>
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
                    <FormLabel>Emoji *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={isLoading}
                    >
                      <FormControl>
                        <SelectTrigger>
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
                    <FormLabel>Couleur *</FormLabel>
                    <FormControl>
                      <Input
                        type="color"
                        {...field}
                        disabled={isLoading}
                        className="h-10"
                      />
                    </FormControl>
                    <FormDescription>Format HEX</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom du profil *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: Le Communicateur Invisible"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Section: Diagnostic */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Diagnostic</h2>

            <FormField
              control={form.control}
              name="blocageRacine"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Blocage racine *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ex: l'exposition (regard, trac, sur-contrôle)"
                      className="min-h-[80px] resize-none"
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
                <FormItem>
                  <FormLabel>Désir *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ex: être écouté(e), respecté(e), crédible"
                      className="min-h-[80px] resize-none"
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
                <FormItem>
                  <FormLabel>Phrase miroir *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ex: Tu ne manques pas de talent..."
                      className="min-h-[100px] resize-none"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormDescription>
                    La phrase qui résonne avec ce profil
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Section: Recommandations */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Recommandations</h2>

            <FormField
              control={form.control}
              name="programmeSignature"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Programme signature *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: FAIS-TOI ENTENDRE"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormDescription>
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
                <FormItem>
                  <FormLabel>Modules complémentaires</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Un module par ligne&#10;Parler juste&#10;Habite ton corps&#10;Prendre la parole"
                      className="min-h-[120px] resize-none"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormDescription>
                    Saisissez un module par ligne
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Section: Paramètres */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Paramètres</h2>

            <FormField
              control={form.control}
              name="visible"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-none border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Profil visible</FormLabel>
                    <FormDescription>
                      Cochez cette case pour rendre le profil visible dans le quiz
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </div>

          {/* Boutons */}
          <div className="flex gap-4 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/admin/quiz/profiles')}
              disabled={isLoading}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-green-600 hover:bg-green-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Modification...
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
