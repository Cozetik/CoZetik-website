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
    const body = await request.json();
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
      await sendEmail(
        validatedData.email,
        'Confirmation de votre demande - Cozetik',
        emailContactUser(validatedData.name, validatedData.message)
      );
      console.log('✅ Email utilisateur envoyé');
    } catch (emailError) {
      console.error('⚠️ Erreur envoi email utilisateur:', emailError);
      // On continue même si l'email échoue
    }

    // 4. Envoyer email de notification à l'admin
    const adminEmail = process.env.ADMIN_EMAIL;
    if (adminEmail) {
      try {
        await sendEmail(
          adminEmail,
          `Nouvelle demande de contact - ${validatedData.name}`,
          emailContactAdmin(validatedData.name, validatedData.email, validatedData.message)
        );
        console.log('✅ Email admin envoyé');
      } catch (emailError) {
        console.error('⚠️ Erreur envoi email admin:', emailError);
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
