import { z } from 'zod'

export const contactSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  firstName: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  postalCode: z.string().min(5, "Le code postal doit contenir au moins 5 caractères"),
  phone: z.string().min(10, "Le numéro de téléphone doit contenir au moins 10 caractères"),
  message: z.string().min(10, "Le message doit contenir au moins 10 caractères"),
  acceptPrivacy: z.boolean().refine(val => val === true, "Vous devez accepter la politique de confidentialité"),
})

export type ContactFormData = z.infer<typeof contactSchema>
