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
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  candidatureFormSchema, // Changé de candidatureSchema à candidatureFormSchema
  type CandidatureFormData,
} from "@/lib/validations/candidature";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Calendar, CheckCircle2, Loader2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const EDUCATION_LEVELS = [
  { value: "bac", label: "Bac" },
  { value: "bac+1", label: "Bac+1" },
  { value: "bac+2", label: "Bac+2" },
  { value: "bac+3", label: "Bac+3" },
  { value: "bac+4", label: "Bac+4" },
  { value: "bac+5", label: "Bac+5 ou plus" },
];

const SITUATIONS = [
  { value: "etudiant", label: "Étudiant" },
  { value: "recherche-emploi", label: "En recherche d'emploi" },
  { value: "activite", label: "En activité professionnelle" },
  { value: "reconversion", label: "En reconversion" },
  { value: "autre", label: "Autre" },
];

const START_DATES = [
  { value: "des-que-possible", label: "Dès que possible" },
  { value: "septembre-2025", label: "Rentrée septembre 2025" },
  { value: "janvier-2026", label: "Rentrée janvier 2026" },
  { value: "a-definir", label: "À définir" },
];

type Category = {
  id: string;
  name: string;
  slug: string;
};

type Formation = {
  id: string;
  title: string;
  slug: string;
  categoryId: string;
};

function CandidaterContent() {
  const searchParams = useSearchParams();
  const categoryIdFromUrl = searchParams.get("categoryId");
  const formationIdFromUrl = searchParams.get("formationId");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [formations, setFormations] = useState<Formation[]>([]);
  const [filteredFormations, setFilteredFormations] = useState<Formation[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  const form = useForm<CandidatureFormData>({
    resolver: zodResolver(candidatureFormSchema),
    defaultValues: {
      civility: "M",
      firstName: "",
      lastName: "",
      birthDate: "",
      email: "",
      phone: "",
      address: "",
      postalCode: "",
      city: "",
      categoryFormation: categoryIdFromUrl || "",
      formation: formationIdFromUrl || "",
      educationLevel: "",
      currentSituation: "",
      startDate: "",
      motivation: "",
      acceptPrivacy: false,
      acceptNewsletter: false,
    },
  });

  useEffect(() => {
    async function fetchData() {
      setIsLoadingData(true);
      try {
        const [categoriesRes, formationsRes] = await Promise.all([
          fetch("/api/categories"),
          fetch("/api/formations"),
        ]);

        if (!categoriesRes.ok || !formationsRes.ok) {
          throw new Error("Erreur lors du chargement des données");
        }

        const categoriesData = await categoriesRes.json();
        const formationsData = await formationsRes.json();

        setCategories(categoriesData);
        setFormations(formationsData);

        if (categoryIdFromUrl) {
          const filtered = formationsData.filter(
            (f: Formation) => f.categoryId === categoryIdFromUrl
          );
          setFilteredFormations(filtered);

          form.reset({
            ...form.getValues(),
            categoryFormation: categoryIdFromUrl,
            formation:
              formationIdFromUrl &&
              filtered.find((f: Formation) => f.id === formationIdFromUrl)
                ? formationIdFromUrl
                : "",
          });
        }

        setIsInitialized(true);
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
        toast.error("Erreur", {
          description: "Impossible de charger les formations disponibles",
        });
        setIsInitialized(true);
      } finally {
        setIsLoadingData(false);
      }
    }

    fetchData();
  }, [categoryIdFromUrl, formationIdFromUrl]);

  const selectedCategory = form.watch("categoryFormation");
  useEffect(() => {
    if (!isInitialized) return;

    if (selectedCategory) {
      const filtered = formations.filter(
        (f) => f.categoryId === selectedCategory
      );
      setFilteredFormations(filtered);

      const currentFormation = form.getValues("formation");
      if (
        currentFormation &&
        !filtered.find((f) => f.id === currentFormation)
      ) {
        form.setValue("formation", "");
      }
    } else {
      setFilteredFormations([]);
      form.setValue("formation", "");
    }
  }, [selectedCategory, formations, form, isInitialized]);

  async function onSubmit(data: CandidatureFormData) {
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key === "birthDate" && typeof value === "string") {
          formData.append(key, new Date(value).toISOString());
        } else if (value instanceof File) {
          formData.append(key, value);
        } else if (typeof value === "boolean") {
          formData.append(key, value.toString());
        } else if (value) {
          formData.append(key, value.toString());
        }
      });

      const response = await fetch("/api/public/candidatures", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        let errorMessage = "Une erreur est survenue";
        try {
          const error = await response.json();
          errorMessage = error.error || errorMessage;
        } catch (parseError) {
          const text = await response.text();
          console.error("Erreur non-JSON:", text.substring(0, 100));
          errorMessage = `Erreur ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      await response.json();

      toast.success("Candidature envoyée !", {
        description: (
          <span style={{ color: "#000000" }}>
            Votre candidature a bien été enregistrée. Notre équipe pédagogique
            l&apos;étudiera attentivement et vous contactera sous 48 heures.
          </span>
        ),
        duration: 5000,
        icon: <CheckCircle2 className="h-5 w-5" />,
      });

      setIsSubmitted(true);
      form.reset();
    } catch (error) {
      console.error("Error submitting candidature:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Une erreur est survenue lors de l'envoi de votre candidature";

      toast.error("Erreur", {
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="max-w-2xl w-full text-center">
          <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-6" />
          <h1
            className="text-3xl font-bold text-black mb-4"
            style={{ fontFamily: "var(--font-bricolage), sans-serif" }}
          >
            Candidature envoyée !
          </h1>
          <p
            className="text-lg text-gray-800 mb-8"
            style={{ fontFamily: "var(--font-bricolage), sans-serif" }}
          >
            Merci pour votre confiance. Votre candidature a bien été
            enregistrée. Notre équipe pédagogique l&apos;étudiera attentivement
            et vous contactera sous 48 heures.
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center bg-black px-8 py-3 text-base font-bricolage font-semibold text-white transition-all duration-200 hover:bg-gray-800"
          >
            Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white font-sans">
      {/* Hero Section */}
      <section className="relative bg-[#9A80B8] pb-10">
        <div className="container mx-auto px-4 md:px-20">
          <div className="relative">
            <div className="absolute -right-20 top-0 h-64 w-64 rounded-none bg-[#9A80B8] opacity-30 blur-3xl pointer-events-none"></div>
            <div className="relative w-full md:w-fit bg-[#2C2C2C] pl-[20px] pr-[30px] py-[40px] translate-y-20 md:translate-y-60 md:pl-[70px] md:pr-[150px] md:py-[100px]">
              <h1
                className="mb-6 text-4xl font-extrabold text-white md:text-6xl lg:text-8xl"
                style={{ fontFamily: "var(--font-bricolage), sans-serif" }}
              >
                Candidater à une formation
              </h1>
              <p
                className="font-sans max-w-4xl text-base leading-relaxed text-white md:text-xl"
                style={{ fontFamily: "var(--font-bricolage), sans-serif" }}
              >
                Complétez votre dossier en quelques minutes, nous revenons vers
                vous rapidement
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="pb-8 pt-32 md:pt-64">
        <div className="container mx-auto px-4 md:px-20 max-w-4xl">
          <p
            className="text-base text-gray-800 md:text-lg"
            style={{ fontFamily: "var(--font-bricolage), sans-serif" }}
          >
            Vous souhaitez rejoindre Cozetik ? Remplissez le formulaire
            ci-dessous. Notre équipe pédagogique étudiera votre candidature et
            vous contactera sous 48 heures pour échanger sur votre projet.
          </p>
        </div>
      </section>

      {/* Formulaire */}
      <section className="pb-16">
        <div className="container mx-auto px-4 md:px-20 max-w-4xl">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Section 1 : Informations personnelles */}
              <div className="space-y-6">
                <h2
                  className="text-2xl font-bold text-black"
                  style={{ fontFamily: "var(--font-bricolage), sans-serif" }}
                >
                  Informations personnelles
                </h2>

                <FormField
                  control={form.control}
                  name="civility"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-sans text-base font-bold text-[#2C2C2C]">
                        Civilité *
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="flex gap-6"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="M" id="M" />
                            <Label htmlFor="M" className="cursor-pointer">
                              M.
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Mme" id="Mme" />
                            <Label htmlFor="Mme" className="cursor-pointer">
                              Mme
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Autre" id="Autre" />
                            <Label htmlFor="Autre" className="cursor-pointer">
                              Autre
                            </Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-sans text-base font-bold text-[#2C2C2C]">
                          Prénom *
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Entrez votre prénom"
                            className="font-sans h-12 border-0 bg-[#EFEFEF] text-[#2C2C2C]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-sans text-base font-bold text-[#2C2C2C]">
                          Nom *
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Entrez votre nom"
                            className="font-sans h-12 border-0 bg-[#EFEFEF] text-[#2C2C2C]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="birthDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-sans text-base font-bold text-[#2C2C2C]">
                        Date de naissance *
                      </FormLabel>
                      <FormControl>
                        <div className="relative group">
                          <Input
                            type="date"
                            className="font-sans h-12 border-0 bg-[#EFEFEF] text-[#2C2C2C] pr-10 transition-all duration-200 group-hover:bg-[#E5E5E5] [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-3 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-inner-spin-button]:appearance-none focus:ring-2 focus:ring-[#9A80B8]/20"
                            {...field}
                          />
                          <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#2C2C2C]/50 pointer-events-none group-hover:text-[#9A80B8] transition-colors duration-200" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-sans text-base font-bold text-[#2C2C2C]">
                          Email *
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="Entrez votre email"
                            className="font-sans h-12 border-0 bg-[#EFEFEF] text-[#2C2C2C]"
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
                        <FormLabel className="font-sans text-base font-bold text-[#2C2C2C]">
                          Téléphone *
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="tel"
                            placeholder="Entrez votre numéro"
                            className="font-sans h-12 border-0 bg-[#EFEFEF] text-[#2C2C2C]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-sans text-base font-bold text-[#2C2C2C]">
                        Adresse
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Entrez votre adresse"
                          className="font-sans h-12 border-0 bg-[#EFEFEF] text-[#2C2C2C]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="postalCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-sans text-base font-bold text-[#2C2C2C]">
                          Code postal
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Entrez votre code postal"
                            className="font-sans h-12 border-0 bg-[#EFEFEF] text-[#2C2C2C]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-sans text-base font-bold text-[#2C2C2C]">
                          Ville
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Entrez votre ville"
                            className="font-sans h-12 border-0 bg-[#EFEFEF] text-[#2C2C2C]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Section 2 : Projet de formation */}
              <div className="space-y-6">
                <h2
                  className="text-2xl font-bold text-black"
                  style={{ fontFamily: "var(--font-bricolage), sans-serif" }}
                >
                  Votre projet de formation
                </h2>

                <FormField
                  control={form.control}
                  name="categoryFormation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-sans text-base font-bold text-[#2C2C2C]">
                        Catégorie de formation souhaitée *
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || ""}
                        disabled={isLoadingData}
                      >
                        <FormControl>
                          <SelectTrigger className="font-sans h-12 border-0 bg-[#EFEFEF] text-[#2C2C2C]">
                            <SelectValue
                              placeholder={
                                isLoadingData
                                  ? "Chargement..."
                                  : "Sélectionnez une catégorie"
                              }
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem
                              key={category.id}
                              value={category.id}
                              className="font-sans"
                            >
                              {category.name}
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
                  name="formation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-sans text-base font-bold text-[#2C2C2C]">
                        Formation souhaitée *
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || ""}
                        disabled={
                          isLoadingData ||
                          !selectedCategory ||
                          filteredFormations.length === 0
                        }
                      >
                        <FormControl>
                          <SelectTrigger className="font-sans h-12 border-0 bg-[#EFEFEF] text-[#2C2C2C]">
                            <SelectValue
                              placeholder={
                                isLoadingData
                                  ? "Chargement..."
                                  : !selectedCategory
                                    ? "Sélectionnez d'abord une catégorie"
                                    : filteredFormations.length === 0
                                      ? "Aucune formation disponible"
                                      : "Sélectionnez une formation"
                              }
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {filteredFormations.map((formation) => (
                            <SelectItem
                              key={formation.id}
                              value={formation.id}
                              className="font-sans"
                            >
                              {formation.title}
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
                  name="educationLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-sans text-base font-bold text-[#2C2C2C]">
                        Niveau d&apos;études actuel *
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || ""}
                      >
                        <FormControl>
                          <SelectTrigger className="font-sans h-12 border-0 bg-[#EFEFEF] text-[#2C2C2C]">
                            <SelectValue placeholder="Sélectionnez votre niveau" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {EDUCATION_LEVELS.map((level) => (
                            <SelectItem
                              key={level.value}
                              value={level.value}
                              className="font-sans"
                            >
                              {level.label}
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
                  name="currentSituation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-sans text-base font-bold text-[#2C2C2C]">
                        Situation actuelle *
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || ""}
                      >
                        <FormControl>
                          <SelectTrigger className="font-sans h-12 border-0 bg-[#EFEFEF] text-[#2C2C2C]">
                            <SelectValue placeholder="Sélectionnez votre situation" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {SITUATIONS.map((situation) => (
                            <SelectItem
                              key={situation.value}
                              value={situation.value}
                              className="font-sans"
                            >
                              {situation.label}
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
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-sans text-base font-bold text-[#2C2C2C]">
                        Date de début souhaitée
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || ""}
                      >
                        <FormControl>
                          <SelectTrigger className="font-sans h-12 border-0 bg-[#EFEFEF] text-[#2C2C2C]">
                            <SelectValue placeholder="Sélectionnez une date" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {START_DATES.map((date) => (
                            <SelectItem
                              key={date.value}
                              value={date.value}
                              className="font-sans"
                            >
                              {date.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Section 3 : Motivation */}
              <div className="space-y-6">
                <h2
                  className="text-2xl font-bold text-black"
                  style={{ fontFamily: "var(--font-bricolage), sans-serif" }}
                >
                  Votre motivation
                </h2>

                <FormField
                  control={form.control}
                  name="motivation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-sans text-base font-bold text-[#2C2C2C]">
                        Parlez-nous de votre projet * (500 caractères minimum)
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Qu'est-ce qui vous motive à suivre cette formation ? Quels sont vos objectifs professionnels ?"
                          className="font-sans min-h-[200px] border-0 bg-[#EFEFEF] text-[#2C2C2C] resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Section 4 : Documents */}
              <div className="space-y-6">
                <h2
                  className="text-2xl font-bold text-black"
                  style={{ fontFamily: "var(--font-bricolage), sans-serif" }}
                >
                  Documents
                </h2>

                <FormField
                  control={form.control}
                  name="cv"
                  render={({ field: { value, onChange, ...field } }) => (
                    <FormItem>
                      <FormLabel className="font-sans text-base font-bold text-[#2C2C2C]">
                        CV * (PDF, DOC, DOCX - 5 Mo max)
                      </FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-4">
                          <Input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            className="font-sans h-12 border-0 bg-[#EFEFEF] text-[#2C2C2C]"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) onChange(file);
                            }}
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="coverLetter"
                  render={({ field: { value, onChange, ...field } }) => (
                    <FormItem>
                      <FormLabel className="font-sans text-base font-bold text-[#2C2C2C]">
                        Lettre de motivation (optionnel - PDF, DOC, DOCX - 5 Mo
                        max)
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          className="font-sans h-12 border-0 bg-[#EFEFEF] text-[#2C2C2C]"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) onChange(file);
                          }}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="otherDocument"
                  render={({ field: { value, onChange, ...field } }) => (
                    <FormItem>
                      <FormLabel className="font-sans text-base font-bold text-[#2C2C2C]">
                        Autre document (optionnel - diplômes, attestations...)
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          className="font-sans h-12 border-0 bg-[#EFEFEF] text-[#2C2C2C]"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) onChange(file);
                          }}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Section 5 : Consentement */}
              <div className="space-y-6">
                <h2
                  className="text-2xl font-bold text-black"
                  style={{ fontFamily: "var(--font-bricolage), sans-serif" }}
                >
                  Consentement
                </h2>

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
                          J&apos;accepte que mes données personnelles soient
                          traitées par Cozetik dans le cadre de ma candidature *
                        </FormLabel>
                        <p className="text-xs text-gray-500">
                          <Link
                            href="/politique-confidentialite"
                            className="underline hover:text-[#9A80B8]"
                          >
                            Consulter notre politique de confidentialité
                          </Link>
                        </p>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="acceptNewsletter"
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
                          J&apos;accepte de recevoir des informations sur les
                          formations et événements de Cozetik (optionnel)
                        </FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                <p
                  className="text-xs text-gray-500"
                  style={{ fontFamily: "var(--font-bricolage), sans-serif" }}
                >
                  Conformément au RGPD, vous disposez d&apos;un droit
                  d&apos;accès, de rectification et de suppression de vos
                  données. Pour l&apos;exercer, contactez-nous à
                  contact@cozetik.fr
                </p>
              </div>

              {/* Bouton final */}
              <div className="flex justify-start">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="font-sans h-14 w-full md:w-auto min-w-0 md:min-w-[279px] bg-[#03120E] px-8 text-base font-bold uppercase text-white hover:bg-[#0a1f18] disabled:opacity-50"
                  style={{ fontFamily: "var(--font-bricolage), sans-serif" }}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      Envoyer ma candidature
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </section>
    </div>
  );
}

export default function CandidaterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-[#9A80B8]" />
            <p className="text-lg text-gray-600">Chargement du formulaire...</p>
          </div>
        </div>
      }
    >
      <CandidaterContent />
    </Suspense>
  );
}
