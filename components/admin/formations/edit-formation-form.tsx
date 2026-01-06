"use client";

import { ImageUpload } from "@/components/admin/image-upload";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
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
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  Award,
  BookOpen,
  CheckCircle2,
  Clock,
  Euro,
  FileText,
  GraduationCap,
  Image as ImageIcon,
  Loader2,
  MessageSquare,
  Settings,
  Star,
  Tag,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const formSchema = z.object({
  title: z
    .string()
    .min(1, "Le titre est requis")
    .max(200, "Le titre est trop long"),
  categoryId: z.string().min(1, "La catégorie est requise"),
  description: z
    .string()
    .min(10, "Description trop courte (min 10 caractères)")
    .max(1000, "Description trop longue (max 1000 caractères)"),
  program: z
    .string()
    .min(20, "Le programme doit être détaillé (min 20 caractères)"),
  price: z.number().positive("Le prix doit être positif").optional().nullable(),
  duration: z.string().optional().nullable(),
  imageUrl: z.string().optional(),
  visible: z.boolean(),
  order: z.number().int().min(0),
  level: z.string().optional().nullable(),
  maxStudents: z.number().int().positive().optional().nullable(),
  prerequisites: z.string().optional().nullable(),
  objectives: z.string().optional().nullable(),
  isCertified: z.boolean(),
  isFlexible: z.boolean(),
  rating: z.number().min(0).max(5).optional().nullable(),
  reviewsCount: z.number().int().min(0),
  studentsCount: z.number().int().min(0),
});

type FormValues = z.infer<typeof formSchema>;

interface Category {
  id: string;
  name: string;
}

interface Formation {
  id: string;
  title: string;
  slug: string;
  categoryId: string;
  description: string;
  program: string;
  price: number | null;
  duration: string | null;
  imageUrl: string | null;
  visible: boolean;
  order: number;
  level: string | null;
  maxStudents: number | null;
  prerequisites: string | null;
  objectives: string[] | null;
  isCertified: boolean;
  isFlexible: boolean;
  rating: number | null;
  reviewsCount: number;
  studentsCount: number;
}

export default function EditFormationForm({
  formation,
  categories,
}: {
  formation: Formation;
  categories: Category[];
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [previousImageUrl, setPreviousImageUrl] = useState(formation.imageUrl);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: formation.title,
      categoryId: formation.categoryId,
      description: formation.description,
      program: formation.program,
      price: formation.price,
      duration: formation.duration || "",
      imageUrl: formation.imageUrl || "",
      visible: formation.visible,
      order: formation.order,
      level: formation.level || "",
      maxStudents: formation.maxStudents,
      prerequisites: formation.prerequisites || "",
      objectives: formation.objectives ? formation.objectives.join("\n") : "",
      isCertified: formation.isCertified || false,
      isFlexible: formation.isFlexible ?? true,
      rating: formation.rating,
      reviewsCount: formation.reviewsCount || 0,
      studentsCount: formation.studentsCount || 0,
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);

    try {
      const objectivesArray = values.objectives
        ? values.objectives.split("\n").filter((line) => line.trim() !== "")
        : [];

      const response = await fetch(`/api/formations/${formation.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          slug: formation.slug,
          price: values.price || null,
          duration: values.duration || null,
          level: values.level || null,
          maxStudents: values.maxStudents || null,
          prerequisites: values.prerequisites || null,
          objectives: objectivesArray,
          rating: values.rating || null,
          previousImageUrl,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de la modification");
      }

      toast.success("Formation modifiée avec succès");
      router.push("/admin/formations");
      router.refresh();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Une erreur est survenue";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageRemove = () => {
    setPreviousImageUrl(null);
    form.setValue("imageUrl", "");
  };

  return (
    <div className="font-sans w-full max-w-full">
      {/* Header */}
      <div className="mb-4 sm:mb-8 bg-gradient-to-br from-blue-600 via-cyan-500 to-teal-600 rounded-xl sm:rounded-2xl p-4 sm:p-8 text-white relative overflow-hidden w-full">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,black)]" />
        <div className="relative">
          <Button
            variant="ghost"
            asChild
            className="mb-2 sm:mb-4 text-white hover:bg-white/20 hover:text-white"
          >
            <Link href="/admin/formations">
              <ArrowLeft className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Retour aux formations</span>
              <span className="sm:hidden">Retour</span>
            </Link>
          </Button>
          <h1 className="text-2xl sm:text-4xl font-bricolage font-bold mb-1 sm:mb-2">
            Modifier la formation
          </h1>
          <p className="text-sm sm:text-base text-blue-50">
            Modifiez les informations de la formation
          </p>
        </div>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 sm:space-y-8 w-full max-w-full"
        >
          {/* Section: Informations générales */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 space-y-4 sm:space-y-6 w-full max-w-full">
            <div className="flex items-center gap-2 sm:gap-3 pb-3 sm:pb-4 border-b border-gray-200">
              <div className="rounded-lg bg-blue-100 p-1.5 sm:p-2">
                <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bricolage font-semibold text-gray-900">
                  Informations générales
                </h2>
                <p className="text-xs sm:text-sm text-gray-500">
                  Titre, catégorie et informations de base
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2 w-full">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="text-gray-700 font-medium flex items-center gap-2 text-sm sm:text-base">
                      <FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400" />
                      Titre <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ex: Formation Intelligence Artificielle"
                        className="border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all w-full text-sm sm:text-base"
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
                  <FormItem className="w-full">
                    <FormLabel className="text-gray-700 font-medium flex items-center gap-2 text-sm sm:text-base">
                      <Tag className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400" />
                      Catégorie <span className="text-red-500">*</span>
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={isLoading}
                    >
                      <FormControl>
                        <SelectTrigger className="border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all w-full text-sm sm:text-base">
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

            <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2 w-full">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="text-gray-700 font-medium flex items-center gap-2 text-sm sm:text-base">
                      <Euro className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400" />
                      Prix (€)
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Laisser vide pour gratuit"
                        className="border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all w-full text-sm sm:text-base"
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value ? parseFloat(e.target.value) : null
                          )
                        }
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormDescription className="text-xs text-gray-500">
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
                  <FormItem className="w-full">
                    <FormLabel className="text-gray-700 font-medium flex items-center gap-2 text-sm sm:text-base">
                      <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400" />
                      Durée
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ex: 3 mois, 40 heures"
                        className="border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all w-full text-sm sm:text-base"
                        {...field}
                        value={field.value ?? ""}
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
          <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 space-y-4 sm:space-y-6 w-full max-w-full">
            <div className="flex items-center gap-2 sm:gap-3 pb-3 sm:pb-4 border-b border-gray-200">
              <div className="rounded-lg bg-purple-100 p-1.5 sm:p-2">
                <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bricolage font-semibold text-gray-900">
                  Contenu pédagogique
                </h2>
                <p className="text-xs sm:text-sm text-gray-500">
                  Description et programme de la formation
                </p>
              </div>
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="text-gray-700 font-medium text-sm sm:text-base">
                    Description <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Description courte de la formation..."
                      className="min-h-[100px] border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all resize-none w-full text-sm sm:text-base"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormDescription className="text-xs text-gray-500">
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
                <FormItem className="w-full">
                  <FormLabel className="text-gray-700 font-medium text-sm sm:text-base">
                    Programme détaillé <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Décrivez le programme complet de la formation..."
                      className="min-h-[200px] border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all resize-none w-full text-sm sm:text-base"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormDescription className="text-xs text-gray-500">
                    Programme complet avec modules, chapitres, objectifs
                    pédagogiques
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Section: Média */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 space-y-4 sm:space-y-6 w-full max-w-full">
            <div className="flex items-center gap-2 sm:gap-3 pb-3 sm:pb-4 border-b border-gray-200">
              <div className="rounded-lg bg-pink-100 p-1.5 sm:p-2">
                <ImageIcon className="h-4 w-4 sm:h-5 sm:w-5 text-pink-600" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bricolage font-semibold text-gray-900">
                  Média
                </h2>
                <p className="text-xs sm:text-sm text-gray-500">
                  Image de couverture de la formation
                </p>
              </div>
            </div>

            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="text-gray-700 font-medium text-sm sm:text-base">
                    Image de couverture
                  </FormLabel>
                  <FormControl>
                    <ImageUpload
                      value={field.value}
                      onChange={(url) => {
                        field.onChange(url);
                        setPreviousImageUrl(null);
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
          <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 space-y-4 sm:space-y-6 w-full max-w-full">
            <div className="flex items-center gap-2 sm:gap-3 pb-3 sm:pb-4 border-b border-gray-200">
              <div className="rounded-lg bg-gray-100 p-1.5 sm:p-2">
                <Settings className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bricolage font-semibold text-gray-900">
                  Paramètres d&apos;affichage
                </h2>
                <p className="text-xs sm:text-sm text-gray-500">
                  Visibilité et ordre d&apos;affichage
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2 w-full">
              <FormField
                control={form.control}
                name="order"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="text-gray-700 font-medium text-sm sm:text-base">
                      Ordre d&apos;affichage
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        className="border-gray-200 focus:border-gray-500 focus:ring-2 focus:ring-gray-500/20 transition-all w-full text-sm sm:text-base"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || 0)
                        }
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormDescription className="text-xs text-gray-500">
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
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-lg border border-gray-200 p-3 sm:p-4 bg-gray-50 w-full">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isLoading}
                        className="mt-1"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-gray-700 font-medium text-sm sm:text-base">
                        Visible sur le site
                      </FormLabel>
                      <FormDescription className="text-xs text-gray-500">
                        Cochez pour rendre la formation visible sur le site
                        public
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Section: Paramètres de formation */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 space-y-4 sm:space-y-6 w-full max-w-full">
            <div className="flex items-center gap-2 sm:gap-3 pb-3 sm:pb-4 border-b border-gray-200">
              <div className="rounded-lg bg-green-100 p-1.5 sm:p-2">
                <GraduationCap className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bricolage font-semibold text-gray-900">
                  Paramètres de formation
                </h2>
                <p className="text-xs sm:text-sm text-gray-500">
                  Niveau, prérequis et objectifs pédagogiques
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2 w-full">
              <FormField
                control={form.control}
                name="level"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="text-gray-700 font-medium flex items-center gap-2 text-sm sm:text-base">
                      <TrendingUp className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400" />
                      Niveau requis
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || ""}
                      disabled={isLoading}
                    >
                      <FormControl>
                        <SelectTrigger className="border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all w-full text-sm sm:text-base">
                          <SelectValue placeholder="Sélectionnez un niveau" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Débutant">Débutant</SelectItem>
                        <SelectItem value="Intermédiaire">
                          Intermédiaire
                        </SelectItem>
                        <SelectItem value="Avancé">Avancé</SelectItem>
                        <SelectItem value="Expert">Expert</SelectItem>
                        <SelectItem value="Tous niveaux">
                          Tous niveaux
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="maxStudents"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="text-gray-700 font-medium flex items-center gap-2 text-sm sm:text-base">
                      <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400" />
                      Nombre max d&apos;étudiants
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Ex: 24"
                        className="border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all w-full text-sm sm:text-base"
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value
                              ? parseInt(e.target.value)
                              : undefined
                          )
                        }
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormDescription className="text-xs text-gray-500">
                      Laisser vide pour illimité
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="prerequisites"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="text-gray-700 font-medium flex items-center gap-2 text-sm sm:text-base">
                    <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400" />
                    Prérequis
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ex: Aucun prérequis nécessaire"
                      className="min-h-[80px] border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all resize-none w-full text-sm sm:text-base"
                      {...field}
                      value={field.value ?? ""}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="objectives"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="text-gray-700 font-medium flex items-center gap-2 text-sm sm:text-base">
                    <Target className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400" />
                    Objectifs pédagogiques
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Un objectif par ligne&#10;Ex:&#10;Automatiser vos tâches répétitives&#10;Créer des workflows intelligents&#10;Gagner 10h par semaine"
                      className="min-h-[120px] border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all resize-none font-mono text-xs sm:text-sm w-full"
                      {...field}
                      value={field.value ?? ""}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormDescription className="text-xs text-gray-500">
                    Saisissez un objectif par ligne
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2 w-full">
              <FormField
                control={form.control}
                name="isCertified"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-lg border border-gray-200 p-3 sm:p-4 bg-green-50 w-full">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isLoading}
                        className="mt-1"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-gray-700 font-medium flex items-center gap-2 text-sm sm:text-base">
                        <Award className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-600" />
                        Formation certifiante
                      </FormLabel>
                      <FormDescription className="text-xs text-gray-500">
                        La formation délivre un certificat
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isFlexible"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-lg border border-gray-200 p-3 sm:p-4 bg-green-50 w-full">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isLoading}
                        className="mt-1"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-gray-700 font-medium flex items-center gap-2 text-sm sm:text-base">
                        <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-600" />
                        Rythme flexible
                      </FormLabel>
                      <FormDescription className="text-xs text-gray-500">
                        L&apos;apprenant peut suivre à son rythme
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Section: Social Proof */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 space-y-4 sm:space-y-6 w-full max-w-full">
            <div className="flex items-center gap-2 sm:gap-3 pb-3 sm:pb-4 border-b border-gray-200">
              <div className="rounded-lg bg-yellow-100 p-1.5 sm:p-2">
                <Star className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bricolage font-semibold text-gray-900">
                  Social Proof
                </h2>
                <p className="text-xs sm:text-sm text-gray-500">
                  Notes, avis et statistiques pour rassurer les visiteurs
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full">
              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="text-gray-700 font-medium flex items-center gap-2 text-sm sm:text-base">
                      <Star className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400" />
                      Note moyenne
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.1"
                        min="0"
                        max="5"
                        placeholder="Ex: 4.8"
                        className="border-gray-200 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition-all w-full text-sm sm:text-base"
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value
                              ? parseFloat(e.target.value)
                              : undefined
                          )
                        }
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormDescription className="text-xs text-gray-500">
                      Sur 5
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="reviewsCount"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="text-gray-700 font-medium flex items-center gap-2 text-sm sm:text-base">
                      <MessageSquare className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400" />
                      Nombre d&apos;avis
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Ex: 124"
                        className="border-gray-200 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition-all w-full text-sm sm:text-base"
                        {...field}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value ? parseInt(e.target.value) : 0
                          )
                        }
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="studentsCount"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="text-gray-700 font-medium flex items-center gap-2 text-sm sm:text-base">
                      <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400" />
                      Étudiants formés
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Ex: 500"
                        className="border-gray-200 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition-all w-full text-sm sm:text-base"
                        {...field}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value ? parseInt(e.target.value) : 0
                          )
                        }
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 bg-white rounded-xl border border-gray-200 p-4 sm:p-6 w-full max-w-full">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/formations")}
              disabled={isLoading}
              className="border-gray-300 hover:bg-gray-50 transition-colors w-full sm:w-auto"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-md hover:shadow-lg transition-all w-full sm:w-auto"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                <>
                  <span className="hidden sm:inline">
                    Enregistrer les modifications
                  </span>
                  <span className="sm:hidden">Enregistrer</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
