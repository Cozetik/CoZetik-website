import { z } from 'zod'

export const inscriptionSchema = z.object({
  name: z
    .string()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(100, 'Le nom ne peut pas dépasser 100 caractères'),
  email: z.string().email('Adresse email invalide'),
  phone: z
    .string()
    .min(10, 'Le numéro de téléphone doit contenir au moins 10 caractères')
    .regex(
      /^[\d\s+()-]+$/,
      'Le numéro de téléphone ne peut contenir que des chiffres et caractères +()-'
    ),
  message: z
    .string()
    .min(10, 'Le message doit contenir au moins 10 caractères')
    .max(1000, 'Le message ne peut pas dépasser 1000 caractères'),
  formationId: z.string().cuid('ID de formation invalide'),
})

export type InscriptionFormData = z.infer<typeof inscriptionSchema>
