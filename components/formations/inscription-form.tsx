'use client'

import { useState, useRef, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { Loader2, Send, CheckCircle2 } from 'lucide-react'
import { inscriptionSchema, type InscriptionFormData } from '@/lib/validations/inscription'

interface InscriptionFormProps {
  formationId: string
  formationTitle: string
}

export function InscriptionForm({ formationId, formationTitle }: InscriptionFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  const form = useForm<InscriptionFormData>({
    resolver: zodResolver(inscriptionSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      message: '',
      formationId,
    },
  })

  // Scroll vers le formulaire en cas d'erreur de validation après soumission
  useEffect(() => {
    if (form.formState.isSubmitted && Object.keys(form.formState.errors).length > 0) {
      setTimeout(() => {
        formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
    }
  }, [form.formState.isSubmitted, form.formState.errors])

  async function onSubmit(data: InscriptionFormData) {
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/public/inscriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      // Try to parse JSON response, but handle cases where response might not be JSON
      let result;
      try {
        const text = await response.text();
        result = text ? JSON.parse(text) : {};
      } catch (parseError) {
        console.error('Error parsing response:', parseError);
        throw new Error('Une erreur est survenue lors de l\'envoi de votre demande');
      }

      if (!response.ok) {
        // Si erreur de validation serveur, scroll vers le formulaire
        if (response.status === 400 || response.status === 422) {
          setTimeout(() => {
            formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }, 100)
        }
        
        // Extract error message from response
        const errorMessage = result.error || 
                           result.message || 
                           `Une erreur est survenue (${response.status})`;
        throw new Error(errorMessage);
      }

      setIsSuccess(true)
      toast.success('Inscription envoyée ! Nous vous contacterons rapidement.')
      form.reset()
    } catch (error) {
      console.error('Error submitting inscription:', error)
      
      // Distinguer erreurs réseau des erreurs serveur
      if (error instanceof TypeError && error.message.includes('fetch')) {
        toast.error('Erreur lors de l\'envoi. Réessayez.', {
          description: 'Problème de connexion. Vérifiez votre connexion internet.',
        })
      } else {
        const errorMessage = error instanceof Error 
          ? error.message 
          : 'Une erreur est survenue lors de l\'envoi de votre demande';
        
        toast.error('Erreur lors de l\'envoi. Réessayez.', {
          description: errorMessage,
        })
      }
      
      // Scroll vers le formulaire en cas d'erreur
      setTimeout(() => {
        formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <Card className="sticky top-24">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
            <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="mb-2 text-xl font-semibold">Demande envoyée !</h3>
          <p className="mb-6 text-sm text-muted-foreground">
            Merci pour votre intérêt. Nous vous contacterons très prochainement pour
            finaliser votre inscription.
          </p>
          <Button onClick={() => setIsSuccess(false)} variant="outline">
            Envoyer une autre demande
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle>S'inscrire à cette formation</CardTitle>
        <CardDescription>
          Remplissez ce formulaire et nous vous recontacterons rapidement
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form ref={formRef} onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Name Field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom complet *</FormLabel>
                  <FormControl>
                    <Input placeholder="Jean Dupont" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email *</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="jean.dupont@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Phone Field */}
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Téléphone *</FormLabel>
                  <FormControl>
                    <Input placeholder="+33 6 12 34 56 78" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Message Field */}
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message / Motivation *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Parlez-nous de votre projet et de vos motivations pour cette formation..."
                      className="min-h-[120px] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Hidden Formation ID */}
            <FormField
              control={form.control}
              name="formationId"
              render={({ field }) => <input type="hidden" {...field} />}
            />

            {/* Submit Button */}
            <Button type="submit" className="w-full gap-2" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Envoi en cours...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Envoyer ma demande
                </>
              )}
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              En soumettant ce formulaire, vous acceptez d'être contacté par notre
              équipe.
            </p>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
