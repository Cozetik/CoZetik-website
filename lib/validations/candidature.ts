import { z } from "zod";

export const candidatureSchema = z.object({
  civility: z.enum(["M", "Mme", "Autre"], {
    message: "La civilité est requise",
  }),
  firstName: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  birthDate: z
    .string()
    .regex(/^\d{2}\/\d{2}\/\d{4}$/, "Format de date invalide (JJ/MM/AAAA)"),
  email: z.string().email("Adresse email invalide"),
  phone: z
    .string()
    .min(10, "Le numéro de téléphone doit contenir au moins 10 caractères"),
  address: z.string().optional(),
  postalCode: z.string().optional(),
  city: z.string().optional(),
  formation: z.string().min(1, "La formation souhaitée est requise"),
  educationLevel: z.string().min(1, "Le niveau d'études est requis"),
  currentSituation: z.string().min(1, "La situation actuelle est requise"),
  startDate: z.string().optional(),
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
});

export type CandidatureFormData = z.infer<typeof candidatureSchema>;
