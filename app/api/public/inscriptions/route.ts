import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/resend';
import { emailInscriptionUser } from '@/emails/email-inscription-user';
import { emailInscriptionAdmin } from '@/emails/email-inscription-admin';

// Schéma de validation Zod
const inscriptionSchema = z.object({
  name: z.string().min(2, "Nom requis"),
  email: z.string().email("Email invalide"),
  phone: z.string().min(10, "Téléphone requis"),
  message: z.string().min(10, "Message trop court"),
  formationId: z.string().min(1, "Formation requise")
});

export async function POST(request: NextRequest) {
  try {
    // 1. Parser et valider les données
    const body = await request.json();
    const validatedData = inscriptionSchema.parse(body);

    console.log('📝 Nouvelle inscription formation:', validatedData.email);

    // 2. Vérifier que la formation existe
    let formation;
    try {
      formation = await prisma.formation.findUnique({
        where: { id: validatedData.formationId },
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
      });

      if (!formation) {
        console.error('❌ Formation inexistante:', validatedData.formationId);
        return NextResponse.json(
          { error: 'Formation introuvable' },
          { status: 404 }
        );
      }

      console.log('✅ Formation trouvée:', formation.title);
    } catch (dbError) {
      console.error('❌ Erreur vérification formation:', dbError);
      return NextResponse.json(
        { error: 'Erreur lors de la vérification' },
        { status: 500 }
      );
    }

    // 3. Créer l'inscription en base de données
    let inscription;
    try {
      inscription = await prisma.formationInscription.create({
        data: {
          name: validatedData.name,
          email: validatedData.email,
          phone: validatedData.phone,
          message: validatedData.message,
          formationId: validatedData.formationId,
          status: 'NEW'
        }
      });
      console.log('✅ Inscription enregistrée en DB:', inscription.id);
    } catch (dbError) {
      console.error('❌ Erreur DB:', dbError);
      // Log plus détaillé pour le débogage
      if (dbError instanceof Error) {
        console.error('❌ Message:', dbError.message);
        console.error('❌ Stack:', dbError.stack);
      }
      return NextResponse.json(
        { 
          error: 'Erreur lors de l\'enregistrement',
          details: process.env.NODE_ENV === 'development' ? (dbError instanceof Error ? dbError.message : String(dbError)) : undefined
        },
        { status: 500 }
      );
    }

    // 4. Formater la date de session (si disponible)
    const nextSession = formation.sessions && formation.sessions.length > 0 
      ? formation.sessions[0]
      : null;
    
    const sessionDate = nextSession
      ? new Date(nextSession.startDate).toLocaleDateString('fr-FR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      : 'À définir';

    // 5. Envoyer email de confirmation à l'utilisateur
    try {
      await sendEmail(
        validatedData.email,
        `Confirmation inscription - ${formation.title}`,
        emailInscriptionUser(validatedData.name, formation.title, sessionDate)
      );
      console.log('✅ Email utilisateur envoyé');
    } catch (emailError) {
      console.error('⚠️ Erreur envoi email utilisateur:', emailError);
      // On continue même si l'email échoue
    }

    // 6. Envoyer email de notification à l'admin
    const adminEmail = process.env.ADMIN_EMAIL;
    if (adminEmail) {
      try {
        await sendEmail(
          adminEmail,
          `Nouvelle inscription - ${formation.title}`,
          emailInscriptionAdmin(
            validatedData.name,
            validatedData.email,
            validatedData.phone,
            formation.title,
            validatedData.message
          )
        );
        console.log('✅ Email admin envoyé');
      } catch (emailError) {
        console.error('⚠️ Erreur envoi email admin:', emailError);
        // On continue même si l'email échoue
      }
    } else {
      console.warn('⚠️ ADMIN_EMAIL non configuré');
    }

    // 7. Retourner succès
    return NextResponse.json({
      success: true,
      message: 'Inscription enregistrée avec succès',
      id: inscription.id,
      formation: formation.title
    }, { status: 201 });

  } catch (error) {
    // Erreur de validation Zod
    if (error instanceof z.ZodError) {
      console.error('❌ Erreur validation:', error.issues);
      return NextResponse.json(
        { 
          error: 'Données invalides',
          details: error.issues 
        },
        { status: 400 }
      );
    }

    // Autres erreurs
    console.error('❌ Erreur inattendue:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
