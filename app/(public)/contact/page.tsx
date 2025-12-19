'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { contactSchema, type ContactFormData } from '@/lib/validations/contact'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      firstName: '',
      email: '',
      postalCode: '',
      phone: '',
      message: '',
      acceptPrivacy: false,
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
        body: JSON.stringify({
          name: `${data.firstName} ${data.name}`,
          email: data.email,
          message: data.message,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Une erreur est survenue')
      }

      toast.success('Message envoyé avec succès', {
        description: 'Nous vous répondrons dans les plus brefs délais.',
      })
      form.reset()
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
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-[#9A80B8] pb-40 pt-8 md:pb-48">
        <div className="container mx-auto px-6">
          <div className="relative">
            {/* Decorative purple shape */}
            <div className="absolute -right-20 top-0 h-64 w-64 rounded-full bg-[#9A80B8] opacity-30 blur-3xl"></div>
            
            {/* Dark grey block */}
            <div className="relative w-full max-w-2xl overflow-hidden bg-[#2C2C2C] p-8 md:p-12 lg:p-16 mt-24 -mb-32 md:mt-32 md:-mb-40 translate-y-40 md:translate-y-46">
              {/* Purple scribble decoration */}
              <div className="absolute right-0 top-0 translate-x-4 -translate-y-8 overflow-visible md:translate-x-6 md:-translate-y-12">
                <svg width="219" height="182" viewBox="0 0 219 182" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-32 h-auto md:w-40 lg:w-48">
                  <path d="M45.3949 6.00049C68.6673 21.3486 91.9398 36.6967 117.284 53.4682C142.628 70.2396 169.338 87.9694 186.668 99.0875C203.999 110.206 211.139 114.175 212.702 115.426C214.264 116.677 210.033 115.089 191.721 105.406C173.409 95.7236 141.145 77.9939 117.781 66.2142C94.4161 54.4344 80.9286 49.142 71.6004 45.8863C57.6889 41.0311 51.814 40.217 51.5376 40.6099C51.0562 41.294 53.9057 42.8552 69.8013 52.6703C85.6969 62.4854 115.581 80.4797 132.827 91.6019C150.073 102.724 153.775 106.429 156.873 110.057C162.678 116.859 165.596 122.258 165.079 124.134C164.722 125.429 160.331 123.365 153.27 120.702C146.21 118.04 135.632 113.806 122.91 110.302C110.188 106.798 95.6422 104.151 79.1576 102.921C62.6729 101.69 44.6896 101.954 33.0454 103.149C21.4012 104.344 16.6409 106.461 13.263 108.742C9.88514 111.024 8.03392 113.405 6.94803 116.088C5.59768 121.681 5.58967 128.12 7.57712 140.08C9.30012 148.6 12.4736 162.096 15.7433 176" stroke="#9A80B8" strokeWidth="12" strokeLinecap="round"/>
                </svg>
              </div>
              <h1 className="mb-6 text-5xl font-bold text-white md:text-6xl lg:text-7xl">
                CONTACT
              </h1>
              <p className="max-w-2xl text-lg leading-relaxed text-white md:text-xl">
                Des questions sur nos formations ou les financements ?<br />
                Pour obtenir une réponse rapide et personnalisée,<br />
                utilisez les coordonnées ci-dessous ou remplissez notre formulaire.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="pb-16 pt-40 md:pt-48">
        <div className="container mx-auto px-6">
          <div className="mx-auto max-w-4xl">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* Nom et Prénom */}
                <div className="grid gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-bold text-[#2C2C2C]">
                          Nom
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Entrez votre nom"
                            className="h-12 rounded-lg border-0 bg-[#EFEFEF] text-[#2C2C2C] placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-[#9A80B8]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-bold text-[#2C2C2C]">
                          Prénom
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Entrez votre prénom"
                            className="h-12 rounded-lg border-0 bg-[#EFEFEF] text-[#2C2C2C] placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-[#9A80B8]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-bold text-[#2C2C2C]">
                        Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Entrez votre email"
                          className="h-12 rounded-lg border-0 bg-[#EFEFEF] text-[#2C2C2C] placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-[#9A80B8]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Code postal et Téléphone */}
                <div className="grid gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="postalCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-bold text-[#2C2C2C]">
                          Code postal
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Entrez votre code postal"
                            className="h-12 rounded-lg border-0 bg-[#EFEFEF] text-[#2C2C2C] placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-[#9A80B8]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-bold text-[#2C2C2C]">
                          Numéro de téléphone
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="tel"
                            placeholder="saisissez le numéro de téléphone"
                            className="h-12 rounded-lg border-0 bg-[#EFEFEF] text-[#2C2C2C] placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-[#9A80B8]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Informations complémentaires */}
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-bold text-[#2C2C2C]">
                        Informations complémentaires
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Des questions ? N'hésitez pas !"
                          className="min-h-[150px] rounded-lg border-0 bg-[#EFEFEF] text-[#2C2C2C] placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-[#9A80B8] resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Checkbox */}
                <FormField
                  control={form.control}
                  name="acceptPrivacy"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="mt-1"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-sm text-gray-600 cursor-pointer">
                          En soumettant ce formulaire, vous acceptez la politique de confidentialité de Cozetik
                        </FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-14 w-full rounded-lg bg-[#2C2C2C] text-base font-bold uppercase text-white hover:bg-[#3C3C3C] disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      SOUMETTRE
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </section>
    </div>
  )
}
