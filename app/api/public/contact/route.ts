import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/resend';
import { emailContactUser } from '@/emails/email-contact-user';
import { emailContactAdmin } from '@/emails/email-contact-admin';

// Schéma de validation Zod
const contactSchema = z.object({
  name: z.string().min(2, "Nom requis"),
  email: z.string().email("Email invalide"),
  message: z.string().min(10, "Message trop court")
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
    
    const validatedData = contactSchema.parse(body);

    console.log('📝 Nouvelle demande de contact:', validatedData.email);

    // 2. Créer l'entrée en base de données
    let contactRequest;
    try {
      contactRequest = await prisma.contactRequest.create({
        data: {
          name: validatedData.name,
          email: validatedData.email,
          message: validatedData.message,
          status: 'NEW'
        }
      });
      console.log('✅ Demande enregistrée en DB:', contactRequest.id);
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

    // 3. Envoyer email de confirmation à l'utilisateur
    try {
      const emailResult = await sendEmail(
        validatedData.email,
        'Confirmation de votre demande - Cozetik',
        emailContactUser(validatedData.name, validatedData.message)
      );
      
      if (emailResult.success) {
        console.log('✅ Email utilisateur envoyé à:', validatedData.email);
      } else {
        console.error('❌ Échec envoi email utilisateur:', emailResult.error);
        console.error('❌ Détails:', emailResult.error instanceof Error ? emailResult.error.message : String(emailResult.error));
        // On continue même si l'email échoue pour ne pas bloquer la demande
      }
    } catch (emailError) {
      console.error('❌ Erreur exception envoi email utilisateur:', emailError);
      if (emailError instanceof Error) {
        console.error('❌ Message:', emailError.message);
        console.error('❌ Stack:', emailError.stack);
      }
      // On continue même si l'email échoue
    }

    // 4. Envoyer email de notification à l'admin
    const adminEmail = process.env.ADMIN_EMAIL;
    if (adminEmail) {
      try {
        const adminEmailResult = await sendEmail(
          adminEmail,
          `Nouvelle demande de contact - ${validatedData.name}`,
          emailContactAdmin(validatedData.name, validatedData.email, validatedData.message)
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

    // 5. Retourner succès
    return NextResponse.json({
      success: true,
      message: 'Demande envoyée avec succès',
      id: contactRequest.id
    }, { status: 201 });

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
