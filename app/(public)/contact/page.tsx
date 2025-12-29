"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { contactSchema, type ContactFormData } from "@/lib/validations/contact";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { League_Spartan } from "next/font/google";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const leagueSpartan = League_Spartan({
  weight: "800",
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
});

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      firstName: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
      acceptPrivacy: false,
    },
  });

  async function onSubmit(data: ContactFormData) {
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/public/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: `${data.firstName} ${data.name}`,
          email: data.email,
          phone: data.phone,
          subject: data.subject,
          message: data.message,
        }),
      });

      // Try to parse JSON response, but handle cases where response might not be JSON
      let result;
      try {
        const text = await response.text();
        result = text ? JSON.parse(text) : {};
      } catch (parseError) {
        console.error("Error parsing response:", parseError);
        throw new Error(
          "Une erreur est survenue lors de l'envoi de votre demande"
        );
      }

      if (!response.ok) {
        const errorMessage =
          result.error ||
          result.message ||
          `Une erreur est survenue (${response.status})`;
        throw new Error(errorMessage);
      }

      // Toast de validation avec icône et durée prolongée
      toast.success("Message envoyé avec succès !", {
        description: (
          <span style={{ color: "#000000" }}>
            Votre demande a bien été reçue. Nous vous répondrons dans les plus
            brefs délais.
          </span>
        ),
        duration: 5000,
        icon: <CheckCircle2 className="h-5 w-5" />,
      });
      form.reset();
    } catch (error) {
      console.error("Error submitting contact form:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Une erreur est survenue lors de l'envoi de votre demande";

      toast.error("Erreur", {
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="w-full overflow-x-hidden bg-white font-sans">
      {/* Hero Section */}
      <section className="relative bg-[#9A80B8] pb-10">
        <div className="container mx-auto px-4 md:px-20">
          <div className="relative">
            {/* Decorative purple shape */}
            <div className="absolute -right-20 top-0 h-64 w-64 rounded-none bg-[#9A80B8] opacity-30 blur-3xl"></div>

            {/* Dark grey block */}
            <div className="relative w-full md:w-fit overflow-hidden bg-[#2C2C2C] pl-[20px] pr-[30px] py-[40px] translate-y-20 md:translate-y-60 md:pl-[70px] md:pr-[150px] md:py-[100px]">
              {/* Purple scribble decoration */}
              <div className="absolute right-0 -z-100 top-0 translate-x-4 -translate-y-8 overflow-visible md:translate-x-8 md:-translate-y-15">
                <svg
                  width="219"
                  height="182"
                  viewBox="0 0 219 182"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-32 h-auto md:w-40 lg:w-48"
                >
                  <path
                    d="M45.3949 6.00049C68.6673 21.3486 91.9398 36.6967 117.284 53.4682C142.628 70.2396 169.338 87.9694 186.668 99.0875C203.999 110.206 211.139 114.175 212.702 115.426C214.264 116.677 210.033 115.089 191.721 105.406C173.409 95.7236 141.145 77.9939 117.781 66.2142C94.4161 54.4344 80.9286 49.142 71.6004 45.8863C57.6889 41.0311 51.814 40.217 51.5376 40.6099C51.0562 41.294 53.9057 42.8552 69.8013 52.6703C85.6969 62.4854 115.581 80.4797 132.827 91.6019C150.073 102.724 153.775 106.429 156.873 110.057C162.678 116.859 165.596 122.258 165.079 124.134C164.722 125.429 160.331 123.365 153.27 120.702C146.21 118.04 135.632 113.806 122.91 110.302C110.188 106.798 95.6422 104.151 79.1576 102.921C62.6729 101.69 44.6896 101.954 33.0454 103.149C21.4012 104.344 16.6409 106.461 13.263 108.742C9.88514 111.024 8.03392 113.405 6.94803 116.088C5.59768 121.681 5.58967 128.12 7.57712 140.08C9.30012 148.6 12.4736 162.096 15.7433 176"
                    stroke="#9A80B8"
                    strokeWidth="12"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              <h1
                className={`${leagueSpartan.className} relative z-10 mb-6 text-4xl font-extrabold text-white md:text-6xl lg:text-8xl`}
              >
                Contactez-nous
              </h1>

              <p
                className="font-sans max-w-4xl text-base md:text-xl leading-relaxed text-white"
                style={{ fontFamily: "var(--font-bricolage), sans-serif" }}
              >
                Une question ? Besoin d&apos;informations ? Notre équipe vous
                répond rapidement
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="pb-16 pt-32 md:pt-64">
        <div className="container mx-auto px-4 md:px-20">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            {/* Colonne gauche : Formulaire */}
            <div>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
                >
                  {/* Nom et Prénom */}
                  <div className="grid gap-6 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-sans text-base font-bold text-[#2C2C2C] pl-5">
                            Nom
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Entrez votre nom"
                              className="font-sans h-12 border-0 bg-[#EFEFEF] text-[#2C2C2C] placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-[#9A80B8]"
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
                          <FormLabel className="font-sans text-base font-bold text-[#2C2C2C] pl-5">
                            Prénom
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Entrez votre prénom"
                              className="font-sans h-12 border-0 bg-[#EFEFEF] text-[#2C2C2C] placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-[#9A80B8]"
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
                        <FormLabel className="font-sans text-base font-bold text-[#2C2C2C] pl-5">
                          Email
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="Entrez votre email"
                            className="font-sans h-12 border-0 bg-[#EFEFEF] text-[#2C2C2C] placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-[#9A80B8]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Téléphone */}
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-sans text-base font-bold text-[#2C2C2C] pl-5">
                          Téléphone
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="tel"
                            placeholder="Entrez votre numéro de téléphone"
                            className="font-sans h-12 border-0 bg-[#EFEFEF] text-[#2C2C2C] placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-[#9A80B8]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Objet de votre demande */}
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-sans text-base font-bold text-[#2C2C2C] pl-5">
                          Objet de votre demande *
                        </FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger className="font-sans h-12 border-0 bg-[#EFEFEF] text-[#2C2C2C]">
                              <SelectValue placeholder="Sélectionnez un objet" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="info-formation">
                                Demande d&apos;information sur une formation
                              </SelectItem>
                              <SelectItem value="candidature">
                                Question sur le processus de candidature
                              </SelectItem>
                              <SelectItem value="devis-entreprise">
                                Devis entreprise
                              </SelectItem>
                              <SelectItem value="partenariat">
                                Partenariat
                              </SelectItem>
                              <SelectItem value="administratif">
                                Question administrative
                              </SelectItem>
                              <SelectItem value="autre">Autre</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Votre message */}
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-sans text-base font-bold text-[#2C2C2C] pl-5">
                          Votre message *
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Décrivez votre demande..."
                            className="font-sans min-h-[150px] border-0 bg-[#EFEFEF] text-[#2C2C2C] placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-[#9A80B8] resize-none"
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
                          <FormLabel className="font-sans text-sm text-gray-600 cursor-pointer">
                            En soumettant ce formulaire, vous acceptez la
                            politique de confidentialité de Cozetik
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />

                  {/* Submit Button */}
                  <div className="flex justify-start">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="font-sans h-14 w-full md:w-auto min-w-0 md:min-w-[279px] bg-[#03120E] px-8 text-base font-bold uppercase text-white hover:bg-[#0a1f18] disabled:opacity-50"
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
                  </div>
                </form>
              </Form>
            </div>

            {/* Colonne droite : Informations de contact */}
            <div className="space-y-8">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <h2
                  className="col-span-1 mb-4 text-2xl font-bold text-black sm:col-span-2"
                  style={{ fontFamily: "var(--font-bricolage), sans-serif" }}
                >
                  Nos coordonnées
                </h2>

                <div>
                  <p
                    className="mb-2 text-base font-semibold text-gray-800"
                    style={{
                      fontFamily: "var(--font-bricolage), sans-serif",
                    }}
                  >
                    📍 Adresse
                  </p>
                  <p
                    className="text-base text-gray-600"
                    style={{
                      fontFamily: "var(--font-bricolage), sans-serif",
                    }}
                  >
                    4 Rue Sarah Bernhardt
                    <br />
                    92600 Asnières-sur-Seine
                  </p>
                </div>
                <div className="mb-4">
                  <p
                    className="mb-2 text-base font-semibold text-gray-800"
                    style={{
                      fontFamily: "var(--font-bricolage), sans-serif",
                    }}
                  >
                    📞 Téléphone
                  </p>
                  <p
                    className="text-base text-gray-600"
                    style={{
                      fontFamily: "var(--font-bricolage), sans-serif",
                    }}
                  >
                    [Numéro de téléphone]
                    <br />
                    <span className="text-sm">
                      Du lundi au vendredi, 9h - 18h
                    </span>
                  </p>
                </div>
                <div>
                  <p
                    className="mb-2 text-base font-semibold text-gray-800"
                    style={{
                      fontFamily: "var(--font-bricolage), sans-serif",
                    }}
                  >
                    📧 Email
                  </p>
                  <p
                    className="text-base text-gray-600"
                    style={{
                      fontFamily: "var(--font-bricolage), sans-serif",
                    }}
                  >
                    <Link
                      href="mailto:contact@cozetik.fr"
                      className="underline hover:text-[#9A80B8]"
                    >
                      contact@cozetik.fr
                    </Link>
                    <br />
                    <Link
                      href="mailto:entreprises@cozetik.fr"
                      className="underline hover:text-[#9A80B8]"
                    >
                      entreprises@cozetik.fr
                    </Link>
                    <span className="text-sm block mt-1">
                      (pour les demandes professionnelles)
                    </span>
                  </p>
                </div>
                <div>
                  <p
                    className="mb-2 text-base font-semibold text-gray-800"
                    style={{
                      fontFamily: "var(--font-bricolage), sans-serif",
                    }}
                  >
                    🕐 Horaires d&apos;ouverture
                  </p>
                  <p
                    className="text-base text-gray-600"
                    style={{
                      fontFamily: "var(--font-bricolage), sans-serif",
                    }}
                  >
                    Lundi - Vendredi : 9h00 - 18h00
                    <br />
                    Samedi - Dimanche : Fermé
                  </p>
                </div>
              </div>

              <div>
                <h2
                  className="mb-4 text-2xl font-bold text-black"
                  style={{ fontFamily: "var(--font-bricolage), sans-serif" }}
                >
                  Comment nous trouver ?
                </h2>
                <div
                  className="mb-4 overflow-hidden rounded-none"
                  style={{ height: "400px" }}
                >
                  <iframe
                    src="https://www.google.com/maps?q=4+Rue+Sarah+Bernhardt,+92600+Asnières-sur-Seine&output=embed&zoom=15"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Localisation Cozetik - 4 Rue Sarah Bernhardt, 92600 Asnières-sur-Seine"
                  />
                </div>
                <p
                  className="text-sm text-gray-600"
                  style={{ fontFamily: "var(--font-bricolage), sans-serif" }}
                >
                  Transports en commun : Métro ligne 13 (station
                  Asnières-Gennevilliers), Bus 175, 238, 378. Parking disponible
                  à proximité.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
