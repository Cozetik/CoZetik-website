import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/resend";
import { emailContactAdmin } from "@/emails/email-contact-admin";
import { emailContactUser } from "@/emails/email-contact-user";
import {
  buildLeadRecap,
  computeDiagnostic,
  type DiagnosticAnswers,
} from "@/lib/cpf-diagnostic";

const eligibiliteSchema = z.object({
  name: z.string().min(2, "Nom requis"),
  email: z.string().email("Email invalide"),
  phone: z
    .string()
    .trim()
    .max(20, "Numéro invalide")
    .optional()
    .or(z.literal("")),
  statut: z.enum([
    "salarie",
    "demandeur-emploi",
    "independant",
    "fonctionnaire",
    "autre",
  ]),
  projet: z.enum(["creation", "reseaux-sociaux", "les-deux"]),
  echeance: z.enum(["maintenant", "trois-mois", "explore"]),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = eligibiliteSchema.parse(body);

    const answers: DiagnosticAnswers = {
      statut: data.statut,
      projet: data.projet,
      echeance: data.echeance,
    };
    // Le verdict est recalculé côté serveur : le client n'envoie que les réponses.
    const result = computeDiagnostic(answers);
    const recap = buildLeadRecap(answers, data.phone || undefined, result);

    const lead = await prisma.contactRequest.create({
      data: {
        name: data.name,
        email: data.email,
        message: recap,
        status: "NEW",
      },
    });

    // Notification admin — même canal que le formulaire de contact.
    const adminEmail = process.env.ADMIN_EMAIL;
    if (adminEmail) {
      try {
        await sendEmail(
          adminEmail,
          `🎯 Lead CPF (diagnostic) — ${data.name}`,
          emailContactAdmin(data.name, data.email, recap)
        );
      } catch (e) {
        console.error("Échec email admin (diagnostic CPF):", e);
      }
    } else {
      console.warn("ADMIN_EMAIL non configuré — lead CPF stocké sans notification");
    }

    // Confirmation au prospect (non bloquante).
    try {
      await sendEmail(
        data.email,
        "Votre diagnostic CPF — Cozetik",
        emailContactUser(
          data.name,
          `${result.verdict}\n\n${result.financement}\n\nUn conseiller Cozetik revient vers vous sous 48 h ouvrées pour la suite.`
        )
      );
    } catch (e) {
      console.error("Échec email prospect (diagnostic CPF):", e);
    }

    return NextResponse.json({ success: true, id: lead.id }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message || "Données invalides" },
        { status: 400 }
      );
    }
    console.error("Erreur diagnostic CPF:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue. Merci de réessayer." },
      { status: 500 }
    );
  }
}
