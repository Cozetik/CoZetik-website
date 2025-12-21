import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendEmail } from '@/lib/resend'
import { emailInscriptionAccepted } from '@/emails/email-inscription-accepted'
import * as z from 'zod'

const statusSchema = z.object({
  status: z.enum(['NEW', 'TREATED', 'ARCHIVED']),
})

// PATCH - Changer le statut d'une inscription formation
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const validatedData = statusSchema.parse(body)

    // Vérifier que l'inscription existe avec la formation et les sessions
    const existingInscription = await prisma.formationInscription.findUnique({
      where: { id },
      include: {
        formation: {
          include: {
            sessions: {
              where: {
                available: true,
                startDate: {
                  gte: new Date()
                }
              },
              orderBy: {
                startDate: 'asc'
              },
              take: 1
            }
          }
        }
      }
    })

    if (!existingInscription) {
      return NextResponse.json(
        { error: 'Inscription non trouvée' },
        { status: 404 }
      )
    }

    // Mettre à jour le statut
    const updatedInscription = await prisma.formationInscription.update({
      where: { id },
      data: {
        status: validatedData.status,
      },
      include: {
        formation: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
    })

    // Envoyer un email à l'utilisateur si le statut passe à TREATED
    if (validatedData.status === 'TREATED' && existingInscription.status !== 'TREATED') {
      try {
        // Formater la date de session (si disponible)
        const nextSession = existingInscription.formation.sessions && existingInscription.formation.sessions.length > 0 
          ? existingInscription.formation.sessions[0]
          : null;
        
        const sessionDate = nextSession
          ? new Date(nextSession.startDate).toLocaleDateString('fr-FR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })
          : undefined;

        const emailResult = await sendEmail(
          existingInscription.email,
          `Votre inscription a été acceptée - ${existingInscription.formation.title}`,
          emailInscriptionAccepted(
            existingInscription.name,
            existingInscription.formation.title,
            sessionDate
          )
        )
        
        if (emailResult.success) {
          console.log('✅ Email d\'acceptation d\'inscription envoyé à:', existingInscription.email)
        } else {
          console.error('❌ Échec envoi email d\'acceptation:', emailResult.error)
          // On continue même si l'email échoue pour ne pas bloquer la mise à jour
        }
      } catch (emailError) {
        console.error('❌ Erreur exception envoi email d\'acceptation:', emailError)
        // On continue même si l'email échoue
      }
    }

    return NextResponse.json(updatedInscription)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      )
    }

    console.error('Error updating inscription status:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
