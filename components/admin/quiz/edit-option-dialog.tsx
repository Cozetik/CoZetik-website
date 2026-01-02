'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
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
import { Pencil, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

const optionSchema = z.object({
  letter: z.string().min(1, 'La lettre est requise'),
  text: z
    .string()
    .min(5, 'Le texte est trop court (min 5 caractères)')
    .max(500, 'Le texte est trop long (max 500 caractères)'),
  order: z
    .number({ message: "L'ordre doit être un nombre" })
    .int("L'ordre doit être un nombre entier")
    .positive("L'ordre doit être positif"),
})

type FormValues = z.infer<typeof optionSchema>

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']

interface Option {
  id: string
  letter: string
  text: string
  order: number
}

export default function EditOptionDialog({
  option,
  questionId,
}: {
  option: Option
  questionId: string
}) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(optionSchema),
    defaultValues: {
      letter: option.letter,
      text: option.text,
      order: option.order,
    },
  })

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true)

    try {
      const response = await fetch(`/api/quiz/questions/${questionId}/options/${option.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la modification')
      }

      toast.success('Option modifiée avec succès')
      setOpen(false)
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Modifier l'option">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Modifier l&apos;option {option.letter}</DialogTitle>
          <DialogDescription>
            Modifiez les informations de cette option de réponse
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
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
                          <SelectValue placeholder="Choisir une lettre" />
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
                name="order"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ordre *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="1, 2, 3..."
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormDescription>
                      Position dans la liste
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Texte *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ex: Je sais des choses, mais j&apos;ai du mal à les partager..."
                      className="min-h-[100px]"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormDescription>
                    Texte complet de l&apos;option de réponse
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
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
                  'Enregistrer'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
