import { z } from 'zod'

export const contactSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  firstName: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  phone: z.string().optional(),
  subject: z.string().min(1, "L'objet de votre demande est requis"),
  message: z.string().min(10, "Le message doit contenir au moins 10 caractères"),
  acceptPrivacy: z.boolean().refine(val => val === true, "Vous devez accepter la politique de confidentialité"),
})

export type ContactFormData = z.infer<typeof contactSchema>
