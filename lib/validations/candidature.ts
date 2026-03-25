import { z } from "zod";

// Schéma de base pour le formulaire (garde birthDate comme string)
const baseCandidatureFormSchema = z.object({
  civility: z.enum(["M", "Mme", "Autre"], {
    message: "La civilité est requise",
  }),
  firstName: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  birthDate: z.string().min(1, "La date de naissance est requise"),
  email: z.string().email("Adresse email invalide"),
  phone: z
    .string()
    .min(10, "Le numéro de téléphone doit contenir au moins 10 caractères"),
  address: z.string().optional(),
  postalCode: z.string().optional(),
  city: z.string().optional(),
  categoryFormation: z
    .string()
    .min(1, "La catégorie de formation souhaitée est requise"),
  formation: z.string().min(1, "La formation souhaitée est requise"),
  educationLevel: z.string().min(1, "Le niveau d'études est requis"),
  currentSituation: z.string().min(1, "La situation actuelle est requise"),
  startDate: z.string().optional(),
  pack: z.string().optional(),
  motivation: z
    .string()
    .min(500, "Le texte de motivation doit contenir au moins 500 caractères"),
  cv: z
    .any()
    .optional()
    .refine(
      (file) => !file || file?.size <= 5 * 1024 * 1024,
      "Le fichier ne doit pas dépasser 5 Mo"
    )
    .refine(
      (file) =>
        !file ||
        [
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ].includes(file?.type),
      "Le fichier doit être au format PDF, DOC ou DOCX"
    ),
  coverLetter: z
    .any()
    .optional()
    .refine(
      (file) => !file || file?.size <= 5 * 1024 * 1024,
      "Le fichier ne doit pas dépasser 5 Mo"
    ),
  otherDocument: z
    .any()
    .optional()
    .refine(
      (file) => !file || file?.size <= 5 * 1024 * 1024,
      "Le fichier ne doit pas dépasser 5 Mo"
    ),
  acceptPrivacy: z
    .boolean()
    .refine(
      (val) => val === true,
      "Vous devez accepter le traitement de vos données"
    ),
  acceptNewsletter: z.boolean().optional(),
  cpfAmount: z.preprocess(
    (val) => (val === "" ? null : val),
    z.number().nullable().optional()
  ),
  additionalFormations: z.array(z.string()).default([]),
});

// Règles métiers supplémentaires (packs & formations complémentaires)
function applyBusinessRules<T extends z.ZodTypeAny>(schema: T) {
  return schema.superRefine((data: any, ctx) => {
    const packName = (data.pack || "").toLowerCase();
    const additionalFormations: string[] = (
      data.additionalFormations || []
    ).filter((id: string) => id && id.trim() !== "");

    // Vérifier le nombre maximum de formations complémentaires selon le pack
    if (packName.includes("premium") && !packName.includes("expert")) {
      if (additionalFormations.length > 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["additionalFormations"],
          message:
            "Le pack Premium permet au maximum 1 formation complémentaire.",
        });
      }
    } else if (packName.includes("expert")) {
      if (additionalFormations.length > 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["additionalFormations"],
          message:
            "Le pack Expert permet au maximum 2 formations complémentaires.",
        });
      }
    } else {
      // Découverte ou autre pack : pas de formations complémentaires
      if (additionalFormations.length > 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["additionalFormations"],
          message:
            "Les formations complémentaires ne sont disponibles que pour les packs Premium et Expert.",
        });
      }
    }

    // Empêcher les doublons entre formation principale et complémentaires
    const allIds = [data.formation, ...additionalFormations];
    const uniqueIds = new Set(allIds.filter((id) => !!id));
    if (uniqueIds.size !== allIds.filter((id) => !!id).length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["additionalFormations"],
        message:
          "Chaque formation (principale ou complémentaire) doit être sélectionnée une seule fois.",
      });
    }
  });
}

// Schéma pour le formulaire (garde birthDate comme string)
export const candidatureFormSchema = applyBusinessRules(
  baseCandidatureFormSchema
);

// Schéma pour l'API (transforme birthDate en Date)
export const candidatureSchema = applyBusinessRules(
  baseCandidatureFormSchema.extend({
    birthDate: z
      .string()
      .min(1, "La date de naissance est requise")
      .transform((val) => new Date(val)),
  })
);

export type CandidatureFormData = z.infer<typeof candidatureFormSchema>;
export type CandidatureData = z.infer<typeof candidatureSchema>;
