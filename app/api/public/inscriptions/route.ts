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
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error('❌ Erreur parsing request body:', parseError);
      return NextResponse.json(
        { error: 'Format de données invalide. Veuillez vérifier les informations saisies.' },
        { status: 400 }
      );
    }
    
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
          status: 'NEW' as const
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
      
      // Extraire le message d'erreur plus détaillé
      let errorMessage = 'Erreur lors de l\'enregistrement';
      let errorDetails = undefined;
      
      if (dbError instanceof Error) {
        errorMessage = dbError.message;
        errorDetails = process.env.NODE_ENV === 'development' ? {
          message: dbError.message,
          stack: dbError.stack,
        } : undefined;
      }
      
      return NextResponse.json(
        { 
          error: errorMessage,
          details: errorDetails
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
    let emailSent = false;
    let emailError = null;
    try {
      const emailResult = await sendEmail(
        validatedData.email,
        `Confirmation inscription - ${formation.title}`,
        emailInscriptionUser(validatedData.name, formation.title, sessionDate)
      );
      
      if (emailResult.success) {
        console.log('✅ Email utilisateur envoyé à:', validatedData.email);
        emailSent = true;
      } else {
        console.error('❌ Échec envoi email utilisateur:', emailResult.error);
        console.error('❌ Détails:', emailResult.error instanceof Error ? emailResult.error.message : String(emailResult.error));
        emailError = emailResult.error instanceof Error ? emailResult.error.message : String(emailResult.error);
        // On continue même si l'email échoue pour ne pas bloquer l'inscription
      }
    } catch (emailErrorException) {
      console.error('❌ Erreur exception envoi email utilisateur:', emailErrorException);
      if (emailErrorException instanceof Error) {
        console.error('❌ Message:', emailErrorException.message);
        console.error('❌ Stack:', emailErrorException.stack);
        emailError = emailErrorException.message;
      } else {
        emailError = String(emailErrorException);
      }
      // On continue même si l'email échoue
    }

    // 6. Envoyer email de notification à l'admin
    const adminEmail = process.env.ADMIN_EMAIL;
    if (adminEmail) {
      try {
        const adminEmailResult = await sendEmail(
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
        
        if (adminEmailResult.success) {
          console.log('✅ Email admin envoyé à:', adminEmail);
        } else {
          console.error('❌ Échec envoi email admin:', adminEmailResult.error);
          console.error('❌ Détails:', adminEmailResult.error instanceof Error ? adminEmailResult.error.message : String(adminEmailResult.error));
        }
      } catch (emailError) {
        console.error('❌ Erreur exception envoi email admin:', emailError);
        if (emailError instanceof Error) {
          console.error('❌ Message:', emailError.message);
        }
        // On continue même si l'email échoue
      }
    } else {
      console.warn('⚠️ ADMIN_EMAIL non configuré');
    }

    // 7. Retourner succès
    const response: any = {
      success: true,
      message: 'Inscription enregistrée avec succès',
      id: inscription.id,
      formation: formation.title
    };
    
    // Ajouter info email en mode développement ou si erreur
    if (process.env.NODE_ENV === 'development' || emailError) {
      response.emailSent = emailSent;
      if (emailError) {
        response.emailError = emailError;
      }
    }
    
    return NextResponse.json(response, { status: 201 });

  } catch (error) {
    // Erreur de validation Zod
    if (error instanceof z.ZodError) {
      console.error('❌ Erreur validation:', error.issues);
      const firstError = error.issues[0];
      return NextResponse.json(
        { 
          error: firstError?.message || 'Données invalides',
          details: error.issues 
        },
        { status: 400 }
      );
    }

    // Erreur de parsing JSON
    if (error instanceof SyntaxError) {
      console.error('❌ Erreur parsing JSON:', error);
      return NextResponse.json(
        { error: 'Format de données invalide' },
        { status: 400 }
      );
    }

    // Autres erreurs
    console.error('❌ Erreur inattendue:', error);
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Une erreur est survenue lors de l\'envoi de votre demande';
    
    return NextResponse.json(
      { 
        error: process.env.NODE_ENV === 'development' 
          ? errorMessage 
          : 'Une erreur est survenue lors de l\'envoi de votre demande'
      },
      { status: 500 }
    );
  }
}
