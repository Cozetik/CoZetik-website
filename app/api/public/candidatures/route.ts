import { emailCandidatureAdmin } from "@/emails/email-candidature-admin";
import { emailCandidatureUser } from "@/emails/email-candidature-user";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/resend";
import { UTApi } from "uploadthing/server";
import { NextRequest, NextResponse } from "next/server";

const utapi = new UTApi();

// Fonction pour uploader un fichier vers Uploadthing
async function uploadFileToUploadthing(file: File): Promise<string | null> {
  try {
    if (!file || file.size === 0) return null;

    if (!process.env.UPLOADTHING_TOKEN) {
      console.warn("UPLOADTHING_TOKEN missing");
      return null;
    }

    const response = await utapi.uploadFiles(file);

    if (response.error) {
      console.error(`❌ Erreur upload ${file.name}:`, response.error);
      return null;
    }

    console.log(`✅ Upload OK: ${response.data.url}`);
    return response.data.url;
  } catch (error) {
    console.error(`❌ Erreur upload ${file.name}:`, error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    // Parser FormData
    const formData = await request.formData();

    // Extraire les données du formulaire
    const data = {
      civility: formData.get("civility") as string,
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      birthDate: formData.get("birthDate") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      address: (formData.get("address") as string) || "",
      postalCode: (formData.get("postalCode") as string) || "",
      city: (formData.get("city") as string) || "",
      categoryFormation: formData.get("categoryFormation") as string,
      formation: formData.get("formation") as string,
      educationLevel: formData.get("educationLevel") as string,
      currentSituation: formData.get("currentSituation") as string,
      startDate: formData.get("startDate") as string,
      motivation: formData.get("motivation") as string,
      pack: (formData.get("pack") as string) || "",
      acceptPrivacy: formData.get("acceptPrivacy") === "true",
      acceptNewsletter: formData.get("acceptNewsletter") === "true",
      cv: formData.get("cv") as File | null,
      coverLetter: formData.get("coverLetter") as File | null,
      otherDocument: formData.get("otherDocument") as File | null,
      cpfAmount: formData.get("cpfAmount")
        ? parseFloat(formData.get("cpfAmount") as string)
        : null,
      additionalFormations: formData.getAll("additionalFormations") as string[],
    };

    // Validation basique
    if (
      !data.firstName ||
      !data.lastName ||
      !data.email ||
      !data.phone ||
      !data.birthDate ||
      !data.categoryFormation ||
      !data.formation
    ) {
      return NextResponse.json(
        { error: "Tous les champs obligatoires doivent être remplis" },
        { status: 400 }
      );
    }

    console.log("📝 Nouvelle candidature:", data.email);

    // Upload des fichiers vers Uploadthing
    let cvUrl: string | null = null;
    let coverLetterUrl: string | null = null;
    let otherDocumentUrl: string | null = null;

    // Upload des fichiers en parallèle
    const uploadPromises = [];
    if (data.cv && data.cv instanceof File) {
      uploadPromises.push(
        uploadFileToUploadthing(data.cv).then((url) => {
          cvUrl = url;
        })
      );
    }
    if (data.coverLetter && data.coverLetter instanceof File) {
      uploadPromises.push(
        uploadFileToUploadthing(data.coverLetter).then((url) => {
          coverLetterUrl = url;
        })
      );
    }
    if (data.otherDocument && data.otherDocument instanceof File) {
      uploadPromises.push(
        uploadFileToUploadthing(data.otherDocument).then((url) => {
          otherDocumentUrl = url;
        })
      );
    }

    // Attendre que tous les uploads soient terminés
    await Promise.all(uploadPromises);
    console.log("📎 Uploads terminés:", {
      cvUrl,
      coverLetterUrl,
      otherDocumentUrl,
    });

    // Récupérer les titres des formations pour l'email
    let mainFormationTitle = data.formation;
    let additionalFormationTitles: string[] = [];

    try {
      const mainFormation = await prisma.formation.findUnique({
        where: { id: data.formation },
        select: { title: true },
      });

      if (mainFormation?.title) {
        mainFormationTitle = mainFormation.title;
      }

      const additionalIds = (data.additionalFormations || []).filter(
        (id) => id && id.trim() !== ""
      );

      if (additionalIds.length > 0) {
        const additionalFormations = await prisma.formation.findMany({
          where: { id: { in: additionalIds } },
          select: { id: true, title: true },
        });

        const titleMap = new Map(
          additionalFormations.map((f) => [f.id, f.title])
        );

        additionalFormationTitles = additionalIds.map(
          (id) => titleMap.get(id) || id
        );
      }
    } catch (titleError) {
      console.error(
        "Erreur lors de la récupération des titres de formation:",
        titleError
      );
      // On continue avec les identifiants bruts si nécessaire
    }

    const candidature = await prisma.candidature.create({
      data: {
        civility: data.civility,
        firstName: data.firstName,
        lastName: data.lastName,
        birthDate: new Date(data.birthDate),
        email: data.email,
        phone: data.phone,
        address: data.address || null,
        postalCode: data.postalCode || null,
        city: data.city || null,
        categoryFormation: data.categoryFormation,
        formation: data.formation,
        educationLevel: data.educationLevel,
        currentSituation: data.currentSituation,
        startDate: data.startDate || null,
        motivation: data.motivation,
        pack: data.pack || null,
        additionalFormations: data.additionalFormations || [],
        cvUrl: cvUrl,
        coverLetterUrl: coverLetterUrl,
        otherDocumentUrl: otherDocumentUrl,
        acceptPrivacy: data.acceptPrivacy,
        acceptNewsletter: data.acceptNewsletter,
        cpfAmount: data.cpfAmount,
        status: "NEW",
      },
    });

    console.log("✅ Candidature enregistrée en DB:", candidature.id);

    // Envoyer un email de confirmation à l'utilisateur (template par pack)
    try {
      const { subject, html } = emailCandidatureUser({
        firstName: data.firstName,
        packName: data.pack,
        formationTitle: mainFormationTitle,
        additionalFormationTitles,
      });

      const emailResult = await sendEmail(data.email, subject, html);
      if (!emailResult.success) {
        console.warn("⚠️ Email utilisateur non envoyé:", emailResult.error);
      }
    } catch (emailError) {
      console.error("Erreur envoi email utilisateur:", emailError);
      // On continue même si l'email échoue
    }

    // Envoyer un email à l'admin
    try {
      const adminEmail = process.env.ADMIN_EMAIL || "nicoleoproject@gmail.com";
      const adminHtml = emailCandidatureAdmin({
        civility: data.civility,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        birthDate: new Date(data.birthDate).toLocaleDateString("fr-FR"),
        categoryName: data.categoryFormation,
        formationTitle: mainFormationTitle,
        educationLevel: data.educationLevel,
        currentSituation: data.currentSituation,
        startDate: data.startDate || null,
        pack: data.pack || null,
        cpfAmount: data.cpfAmount,
        motivation: data.motivation,
        additionalFormations: additionalFormationTitles,
        cvUrl,
        coverLetterUrl,
        otherDocumentUrl,
      });

      const emailResult = await sendEmail(
        adminEmail,
        `Nouvelle candidature - ${mainFormationTitle}`,
        adminHtml
      );
      if (!emailResult.success) {
        console.warn("⚠️ Email admin non envoyé:", emailResult.error);
      }
    } catch (emailError) {
      console.error("Erreur envoi email admin:", emailError);
    }

    return NextResponse.json(
      { message: "Candidature enregistrée avec succès", id: candidature.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Erreur lors de la création de la candidature:", error);
    return NextResponse.json(
      {
        error:
          "Une erreur est survenue lors de l'enregistrement de votre candidature",
      },
      { status: 500 }
    );
  }
}
