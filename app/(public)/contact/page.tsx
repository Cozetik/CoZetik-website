'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Metadata } from 'next'
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
import { Loader2, Send, Mail, Phone, MapPin, Clock, CheckCircle2 } from 'lucide-react'
import { contactSchema, type ContactFormData } from '@/lib/validations/contact'

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  })

  async function onSubmit(data: ContactFormData) {
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/public/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Une erreur est survenue')
      }

      setIsSuccess(true)
      toast.success('Message envoyé avec succès', {
        description: 'Nous vous répondrons dans les plus brefs délais.',
      })
      form.reset()

      // Reset success state after 5 seconds
      setTimeout(() => setIsSuccess(false), 5000)
    } catch (error) {
      console.error('Error submitting contact form:', error)
      toast.error('Erreur', {
        description:
          error instanceof Error
            ? error.message
            : 'Une erreur est survenue lors de l\'envoi',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col">
      {/* Page Header */}
      <section className="border-b bg-gradient-to-br from-primary/5 via-background to-primary/5 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            {/* Icon */}
            <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Mail className="h-8 w-8 text-primary" />
            </div>

            {/* Title */}
            <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
              Contactez-nous
            </h1>

            {/* Description */}
            <p className="text-lg text-muted-foreground md:text-xl">
              Une question ? Un projet de formation ? Notre équipe est à votre
              écoute pour vous accompagner dans votre démarche.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Contact Form - Left/Main Column */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Envoyez-nous un message</CardTitle>
                  <CardDescription>
                    Remplissez le formulaire ci-dessous et nous vous répondrons dans
                    les plus brefs délais
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isSuccess ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                        <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
                      </div>
                      <h3 className="mb-2 text-xl font-semibold">Message envoyé !</h3>
                      <p className="mb-6 text-sm text-muted-foreground">
                        Merci de nous avoir contacté. Nous vous répondrons très
                        prochainement.
                      </p>
                    </div>
                  ) : (
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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

                        {/* Message Field */}
                        <FormField
                          control={form.control}
                          name="message"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Message *</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Décrivez votre demande, question ou projet de formation..."
                                  className="min-h-[200px] resize-none"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Submit Button */}
                        <Button
                          type="submit"
                          className="w-full gap-2"
                          size="lg"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Envoi en cours...
                            </>
                          ) : (
                            <>
                              <Send className="h-4 w-4" />
                              Envoyer le message
                            </>
                          )}
                        </Button>
                      </form>
                    </Form>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Contact Info - Right/Sidebar Column */}
            <div className="lg:col-span-1">
              <div className="space-y-6">
                {/* Contact Information Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Informations de contact</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Email */}
                    <div className="flex items-start gap-3">
                      <Mail className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                      <div>
                        <div className="mb-1 text-sm font-medium">Email</div>
                        <a
                          href="mailto:contact@cozetik.com"
                          className="text-sm text-muted-foreground hover:text-primary"
                        >
                          contact@cozetik.com
                        </a>
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="flex items-start gap-3">
                      <Phone className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                      <div>
                        <div className="mb-1 text-sm font-medium">Téléphone</div>
                        <a
                          href="tel:+33123456789"
                          className="text-sm text-muted-foreground hover:text-primary"
                        >
                          +33 1 23 45 67 89
                        </a>
                      </div>
                    </div>

                    {/* Address */}
                    <div className="flex items-start gap-3">
                      <MapPin className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                      <div>
                        <div className="mb-1 text-sm font-medium">Adresse</div>
                        <p className="text-sm text-muted-foreground">
                          123 Avenue des Formations
                          <br />
                          75001 Paris, France
                        </p>
                      </div>
                    </div>

                    {/* Hours */}
                    <div className="flex items-start gap-3">
                      <Clock className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                      <div>
                        <div className="mb-1 text-sm font-medium">Horaires</div>
                        <p className="text-sm text-muted-foreground">
                          Lun - Ven : 9h00 - 18h00
                          <br />
                          Sam - Dim : Fermé
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Response Time Card */}
                <Card className="bg-primary/5">
                  <CardContent className="p-6">
                    <h3 className="mb-2 font-semibold">Temps de réponse</h3>
                    <p className="text-sm text-muted-foreground">
                      Nous nous engageons à répondre à votre demande sous 24h
                      ouvrées. Pour les urgences, n&apos;hésitez pas à nous appeler
                      directement.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
