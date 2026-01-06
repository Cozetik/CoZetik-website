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
import { slugify } from "@/lib/slugify";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2 } from "lucide-react";
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
  // Nouveaux champs pour page immersive
  level: z.string().optional().nullable(),
  maxStudents: z.number().int().positive().optional().nullable(),
  prerequisites: z.string().optional().nullable(),
  objectives: z.string().optional().nullable(), // Sera converti en array
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

export default function NewFormationForm({
  categories,
}: {
  categories: Category[];
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      categoryId: "",
      description: "",
      program: "",
      price: undefined,
      duration: "",
      imageUrl: "",
      visible: true,
      order: 0,
      level: "",
      maxStudents: undefined,
      prerequisites: "",
      objectives: "",
      isCertified: false,
      isFlexible: true,
      rating: undefined,
      reviewsCount: 0,
      studentsCount: 0,
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);

    // Générer le slug depuis le titre
    const slug = slugify(values.title);

    if (!slug) {
      toast.error("Le titre doit contenir au moins un caractère valide");
      setIsLoading(false);
      return;
    }

    try {
      // Convertir objectives (string avec retours à la ligne) en array
      const objectivesArray = values.objectives
        ? values.objectives.split("\n").filter((line) => line.trim() !== "")
        : [];

      const response = await fetch("/api/formations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          slug,
          price: values.price || null,
          duration: values.duration || null,
          level: values.level || null,
          maxStudents: values.maxStudents || null,
          prerequisites: values.prerequisites || null,
          objectives: objectivesArray,
          rating: values.rating || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de la création");
      }

      toast.success("Formation créée avec succès");
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

  return (
    <>
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/admin/formations">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour aux formations
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight font-bricolage">
          Nouvelle formation
        </h1>
        <p className="text-muted-foreground mt-1 font-sans">
          Créez une nouvelle formation pour votre plateforme
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Section: Informations générales */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Informations générales</h2>

            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Titre *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ex: Formation Intelligence Artificielle"
                        {...field}
                        disabled={isLoading}
                        className="font-sans"
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
                  <FormItem>
                    <FormLabel>Catégorie *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isLoading}
                    >
                      <FormControl>
                        <SelectTrigger>
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

            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prix (€)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Laisser vide pour gratuit"
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value ? parseFloat(e.target.value) : null
                          )
                        }
                        disabled={isLoading}
                        className="font-sans"
                      />
                    </FormControl>
                    <FormDescription>
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
                  <FormItem>
                    <FormLabel>Durée</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ex: 3 mois, 40 heures"
                        {...field}
                        value={field.value ?? ""}
                        disabled={isLoading}
                        className="font-sans"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Section: Contenu */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Contenu</h2>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Description courte de la formation..."
                      className="min-h-[100px] resize-none"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormDescription>
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
                <FormItem>
                  <FormLabel>Programme détaillé *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Décrivez le programme complet de la formation..."
                      className="min-h-[200px] resize-none"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormDescription>
                    Programme complet avec modules, chapitres, objectifs
                    pédagogiques
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Section: Média */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Média</h2>

            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image de couverture</FormLabel>
                  <FormControl>
                    <ImageUpload
                      value={field.value}
                      onChange={field.onChange}
                      onRemove={() => field.onChange("")}
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
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || 0)
                        }
                        disabled={isLoading}
                        className="font-sans"
                      />
                    </FormControl>
                    <FormDescription>
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
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-none border p-4">
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
                        Cochez cette case pour rendre la formation visible sur
                        le site public
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Section: Paramètres de formation */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Paramètres de formation</h2>

            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Niveau requis</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || ""}
                      disabled={isLoading}
                    >
                      <FormControl>
                        <SelectTrigger>
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
                  <FormItem>
                    <FormLabel>
                      Nombre max d&apos;étudiants par session
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Ex: 24"
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
                        className="font-sans"
                      />
                    </FormControl>
                    <FormDescription>
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
                <FormItem>
                  <FormLabel>Prérequis</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ex: Aucun prérequis nécessaire"
                      className="min-h-[80px] resize-none"
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
                <FormItem>
                  <FormLabel>Objectifs pédagogiques</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Un objectif par ligne&#10;Ex:&#10;Automatiser vos tâches répétitives&#10;Créer des workflows intelligents&#10;Gagner 10h par semaine"
                      className="min-h-[120px] resize-none"
                      {...field}
                      value={field.value ?? ""}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormDescription>
                    Saisissez un objectif par ligne
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="isCertified"
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
                      <FormLabel>Formation certifiante</FormLabel>
                      <FormDescription>
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
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-none border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Rythme flexible</FormLabel>
                      <FormDescription>
                        L&apos;apprenant peut suivre à son rythme
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Section: Social Proof */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Social Proof (optionnel)</h2>
            <p className="text-sm text-muted-foreground">
              Ces informations seront affichées pour rassurer les visiteurs
            </p>

            <div className="grid gap-6 md:grid-cols-3">
              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Note moyenne</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.1"
                        min="0"
                        max="5"
                        placeholder="Ex: 4.8"
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
                        className="font-sans"
                      />
                    </FormControl>
                    <FormDescription>Sur 5</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="reviewsCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre d&apos;avis</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Ex: 124"
                        {...field}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value ? parseInt(e.target.value) : 0
                          )
                        }
                        disabled={isLoading}
                        className="font-sans"
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
                  <FormItem>
                    <FormLabel>Nombre d&apos;étudiants formés</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Ex: 500"
                        {...field}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value ? parseInt(e.target.value) : 0
                          )
                        }
                        disabled={isLoading}
                        className="font-sans"
                      />
                    </FormControl>
                    <FormMessage />
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
              onClick={() => router.push("/admin/formations")}
              disabled={isLoading}
              className="font-sans"
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading} className="font-sans">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Création...
                </>
              ) : (
                "Créer la formation"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
