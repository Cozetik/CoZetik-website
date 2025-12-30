import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/resend";
import { v2 as cloudinary } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";

// Configuration Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Fonction pour uploader un fichier vers Cloudinary
async function uploadFileToCloudinary(
  file: File,
  folder: string = "cozetik/candidatures"
): Promise<string | null> {
  try {
    if (!file || file.size === 0) {
      return null;
    }

    // Vérifier que les credentials Cloudinary existent
    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      console.warn(
        "Cloudinary credentials are not configured, skipping file upload"
      );
      return null;
    }

    // Validation taille (10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      console.warn(
        `File ${file.name} is too large (${file.size} bytes), skipping upload`
      );
      return null;
    }

    // Extraire l'extension du fichier original
    const fileExtension = file.name.split(".").pop()?.toLowerCase() || "";
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);

    // Créer un public_id avec l'extension
    const publicId = `${timestamp}-${randomString}.${fileExtension}`;

    // Convertir le fichier en buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Déterminer le type de ressource selon le type MIME
    let resourceType: "image" | "raw" | "auto" = "raw";
    if (file.type.startsWith("image/")) {
      resourceType = "image";
    } else if (
      file.type === "application/pdf" ||
      file.type.includes("document") ||
      file.type.includes("msword") ||
      file.type.includes("wordprocessingml")
    ) {
      resourceType = "raw";
    } else {
      resourceType = "auto";
    }

    // Upload vers Cloudinary via Promise
    const result = await new Promise<{ secure_url: string; public_id: string }>(
      (resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: folder,
            resource_type: resourceType,
            use_filename: true,
            unique_filename: true,
            overwrite: false,
            format: fileExtension,
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result as { secure_url: string; public_id: string });
          }
        );

        uploadStream.end(buffer);
      }
    );

    console.log(`✅ Fichier uploadé: ${file.name} -> ${result.secure_url}`);

    // ✅ Vérifier que l'URL contient bien l'extension
    if (!result.secure_url.endsWith(`.${fileExtension}`)) {
      console.warn(
        `⚠️ L'URL ne contient pas l'extension attendue: ${result.secure_url}`
      );
    }

    return result.secure_url;
  } catch (error) {
    console.error(`❌ Erreur lors de l'upload du fichier ${file.name}:`, error);
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
      categoryFormation: formData.get("categoryFormation") as string, // Ajouté
      formation: formData.get("formation") as string,
      educationLevel: formData.get("educationLevel") as string,
      currentSituation: formData.get("currentSituation") as string,
      startDate: formData.get("startDate") as string,
      motivation: formData.get("motivation") as string,
      acceptPrivacy: formData.get("acceptPrivacy") === "true",
      acceptNewsletter: formData.get("acceptNewsletter") === "true",
      cv: formData.get("cv") as File | null,
      coverLetter: formData.get("coverLetter") as File | null,
      otherDocument: formData.get("otherDocument") as File | null,
    };

    // Validation basique
    if (
      !data.firstName ||
      !data.lastName ||
      !data.email ||
      !data.phone ||
      !data.birthDate ||
      !data.categoryFormation || // Ajouté
      !data.formation
    ) {
      return NextResponse.json(
        { error: "Tous les champs obligatoires doivent être remplis" },
        { status: 400 }
      );
    }

    console.log("📝 Nouvelle candidature:", data.email);

    // Upload des fichiers vers Cloudinary
    let cvUrl: string | null = null;
    let coverLetterUrl: string | null = null;
    let otherDocumentUrl: string | null = null;

    // Upload des fichiers en parallèle
    const uploadPromises = [];
    if (data.cv && data.cv instanceof File) {
      uploadPromises.push(
        uploadFileToCloudinary(data.cv, "cozetik/candidatures/cv").then(
          (url) => {
            cvUrl = url;
          }
        )
      );
    }
    if (data.coverLetter && data.coverLetter instanceof File) {
      uploadPromises.push(
        uploadFileToCloudinary(
          data.coverLetter,
          "cozetik/candidatures/lettres"
        ).then((url) => {
          coverLetterUrl = url;
        })
      );
    }
    if (data.otherDocument && data.otherDocument instanceof File) {
      uploadPromises.push(
        uploadFileToCloudinary(
          data.otherDocument,
          "cozetik/candidatures/documents"
        ).then((url) => {
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
        cvUrl: cvUrl,
        coverLetterUrl: coverLetterUrl,
        otherDocumentUrl: otherDocumentUrl,
        acceptPrivacy: data.acceptPrivacy,
        acceptNewsletter: data.acceptNewsletter,
        status: "NEW",
      },
    });

    console.log("✅ Candidature enregistrée en DB:", candidature.id);

    // Envoyer un email de confirmation à l'utilisateur
    try {
      const emailResult = await sendEmail(
        data.email,
        "Confirmation de votre candidature - Cozetik",
        `
          <h1>Bonjour ${data.firstName} ${data.lastName},</h1>
          <p>Nous avons bien reçu votre candidature pour la formation <strong>${data.formation}</strong>.</p>
          <p>Notre équipe pédagogique l'étudiera attentivement et vous contactera sous 48 heures.</p>
          <p>Cordialement,<br>L'équipe Cozetik</p>
        `
      );
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
      const emailResult = await sendEmail(
        adminEmail,
        `Nouvelle candidature - ${data.formation}`,
        `
          <h2>Nouvelle candidature reçue</h2>
          <p><strong>Nom:</strong> ${data.civility} ${data.firstName} ${data.lastName}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Téléphone:</strong> ${data.phone}</p>
          <p><strong>Date de naissance:</strong> ${new Date(
            data.birthDate
          ).toLocaleDateString("fr-FR")}</p>
          <p><strong>Catégorie:</strong> ${data.categoryFormation}</p>
          <p><strong>Formation:</strong> ${data.formation}</p>
          <p><strong>Niveau d'études:</strong> ${data.educationLevel}</p>
          <p><strong>Situation:</strong> ${data.currentSituation}</p>
          <p><strong>Motivation:</strong> ${data.motivation}</p>
          ${cvUrl ? `<p><strong>CV:</strong> <a href="${cvUrl}">Télécharger</a></p>` : ""}
          ${coverLetterUrl ? `<p><strong>Lettre de motivation:</strong> <a href="${coverLetterUrl}">Télécharger</a></p>` : ""}
          ${otherDocumentUrl ? `<p><strong>Autre document:</strong> <a href="${otherDocumentUrl}">Télécharger</a></p>` : ""}
        `
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
