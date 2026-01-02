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
      throw new Error("Le fichier est vide ou invalide");
    }

    // Vérifier que les credentials Cloudinary existent
    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      const errorMsg = "Les identifiants Cloudinary ne sont pas configurés. Vérifiez vos variables d'environnement.";
      console.error("❌", errorMsg);
      throw new Error(errorMsg);
    }

    // Validation taille (10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new Error(
        `Le fichier ${file.name} est trop volumineux (${(file.size / 1024 / 1024).toFixed(2)} Mo). Taille maximale: 10 Mo`
      );
    }

    // Extraire l'extension du fichier original et créer un nom de fichier unique
    const fileExtension = file.name.split(".").pop()?.toLowerCase() || "";
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);

    // Créer un nom de fichier avec extension pour le public_id
    const publicId = `${timestamp}-${randomString}${fileExtension ? `.${fileExtension}` : ''}`;

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
    console.log(`📤 Début upload: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} Mo, type: ${file.type}, resourceType: ${resourceType}, extension: ${fileExtension})`);
    
    // Configuration pour l'upload
    const uploadOptions: any = {
      folder: folder,
      resource_type: resourceType,
      public_id: publicId,
      use_filename: false,
      unique_filename: true,
      overwrite: false,
      access_mode: 'public', // Rendre les fichiers accessibles publiquement
      type: 'upload', // Type d'upload standard
    };

    // Pour les fichiers raw, ne pas spécifier le format (Cloudinary le détecte automatiquement)
    // Le format est géré par l'extension du fichier dans le public_id si nécessaire
    
    console.log(`📤 Options d'upload:`, JSON.stringify(uploadOptions, null, 2));
    
    const result = await new Promise<{ secure_url: string; public_id: string }>(
      (resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          uploadOptions,
          (error, result) => {
            if (error) {
              console.error(`❌ Erreur Cloudinary pour ${file.name}:`, error);
              console.error(`❌ Détails erreur:`, JSON.stringify(error, null, 2));
              reject(error);
            } else if (!result) {
              console.error(`❌ Résultat Cloudinary vide pour ${file.name}`);
              reject(new Error("Résultat d'upload vide"));
            } else {
              console.log(`✅ Upload réussi: ${file.name} -> ${result.secure_url}`);
              resolve(result as { secure_url: string; public_id: string });
            }
          }
        );

        uploadStream.on('error', (streamError) => {
          console.error(`❌ Erreur stream upload pour ${file.name}:`, streamError);
          reject(streamError);
        });

        uploadStream.end(buffer);
      }
    );

    console.log(`✅ Fichier uploadé avec succès: ${file.name} -> ${result.secure_url}`);

    // ✅ Vérifier que l'URL contient bien l'extension
    if (!result.secure_url.includes(`.${fileExtension}`)) {
      console.warn(
        `⚠️ L'URL ne contient pas l'extension attendue: ${result.secure_url}`
      );
    }

    return result.secure_url;
  } catch (error: any) {
    console.error(`❌ Erreur lors de l'upload du fichier ${file.name}:`, error);
    
    // Extraire le message d'erreur
    let errorMessage = "Erreur inconnue";
    
    if (error instanceof Error) {
      errorMessage = error.message;
      console.error(`❌ Message d'erreur:`, errorMessage);
      console.error(`❌ Stack:`, error.stack);
    } else if (error && typeof error === 'object') {
      // Si c'est un objet d'erreur Cloudinary
      errorMessage = error.message || JSON.stringify(error);
      console.error(`❌ Détails erreur Cloudinary:`, JSON.stringify(error, null, 2));
    }
    
    // Vérifier si c'est une erreur de credentials
    if (errorMessage.includes("Invalid api_key") || errorMessage.includes("Invalid API Key") || error?.http_code === 401) {
      throw new Error("Les identifiants Cloudinary sont incorrects. Vérifiez que CLOUDINARY_API_KEY et CLOUDINARY_API_SECRET sont correctement configurés dans votre fichier .env.local");
    }
    
    // Vérifier si c'est une erreur de cloud name
    if (errorMessage.includes("Invalid cloud_name") || errorMessage.includes("404") || error?.http_code === 404) {
      throw new Error("Le nom du cloud Cloudinary est incorrect. Vérifiez CLOUDINARY_CLOUD_NAME dans votre fichier .env.local");
    }
    
    // Re-lancer l'erreur avec le message original pour plus de détails
    throw new Error(`Erreur lors de l'upload du fichier ${file.name}: ${errorMessage}`);
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
    let cvFileName: string | null = null;
    let coverLetterUrl: string | null = null;
    let coverLetterFileName: string | null = null;
    let otherDocumentUrl: string | null = null;
    let otherDocumentFileName: string | null = null;

    // Upload des fichiers en parallèle avec gestion d'erreur
    const uploadPromises = [];
    if (data.cv && data.cv instanceof File) {
      uploadPromises.push(
        uploadFileToCloudinary(data.cv, "cozetik/candidatures/cv")
          .then((url) => {
            if (!url) {
              throw new Error("L'upload du CV a échoué (aucune URL retournée)");
            }
            cvUrl = url;
            console.log("✅ CV uploadé avec succès:", url);
          })
          .catch((error) => {
            console.error("❌ Erreur upload CV:", error);
            console.error("❌ Détails complets:", JSON.stringify(error, null, 2));
            
            const errorMessage = error instanceof Error 
              ? error.message 
              : "Erreur inconnue lors de l'upload du CV";
            
            // Message d'erreur plus détaillé
            let userMessage = `Échec de l'upload du CV: ${errorMessage}`;
            
            if (errorMessage.includes("credentials") || errorMessage.includes("Invalid API Key")) {
              userMessage = "Les identifiants Cloudinary sont incorrects. Contactez l'administrateur.";
            } else if (errorMessage.includes("cloud_name") || errorMessage.includes("404")) {
              userMessage = "Configuration Cloudinary incorrecte. Contactez l'administrateur.";
            } else if (errorMessage.includes("trop volumineux") || errorMessage.includes("too large")) {
              userMessage = errorMessage; // Garder le message original pour la taille
            }
            
            throw new Error(userMessage);
          })
      );
    } else {
      // CV est obligatoire
      return NextResponse.json(
        { error: "Le CV est obligatoire" },
        { status: 400 }
      );
    }
    
    if (data.coverLetter && data.coverLetter instanceof File) {
      coverLetterFileName = data.coverLetter.name; // Stocker le nom original
      uploadPromises.push(
        uploadFileToCloudinary(
          data.coverLetter,
          "cozetik/candidatures/lettres"
        )
          .then((url) => {
            coverLetterUrl = url;
          })
          .catch((error) => {
            console.error("❌ Erreur upload lettre de motivation:", error);
            // On continue même si l'upload de la lettre échoue
          })
      );
    }
    
    if (data.otherDocument && data.otherDocument instanceof File) {
      otherDocumentFileName = data.otherDocument.name; // Stocker le nom original
      uploadPromises.push(
        uploadFileToCloudinary(
          data.otherDocument,
          "cozetik/candidatures/documents"
        )
          .then((url) => {
            otherDocumentUrl = url;
          })
          .catch((error) => {
            console.error("❌ Erreur upload autre document:", error);
            // On continue même si l'upload de l'autre document échoue
          })
      );
    }

    // Attendre que tous les uploads soient terminés
    try {
      await Promise.all(uploadPromises);
    } catch (error) {
      console.error("❌ Erreur lors des uploads:", error);
      throw error; // Re-lancer l'erreur pour qu'elle soit gérée par le catch global
    }
    
    // Vérifier que le CV a bien été uploadé (obligatoire)
    if (!cvUrl) {
      return NextResponse.json(
        { error: "Échec de l'upload du CV. Veuillez réessayer." },
        { status: 500 }
      );
    }
    
    console.log("📎 Uploads terminés:", {
      cvUrl,
      coverLetterUrl,
      otherDocumentUrl,
    });

    // Vérifier que les données requises sont présentes
    if (!data.motivation || data.motivation.trim().length < 500) {
      return NextResponse.json(
        { error: "La lettre de motivation doit contenir au moins 500 caractères" },
        { status: 400 }
      );
    }

    // Convertir birthDate en Date object pour Prisma
    // Le schéma Prisma définit birthDate comme DateTime
    const birthDate = new Date(data.birthDate);
    
    // Vérifier que la date est valide
    if (isNaN(birthDate.getTime())) {
      return NextResponse.json(
        { error: "La date de naissance est invalide" },
        { status: 400 }
      );
    }

    let candidature;
    try {
      candidature = await prisma.candidature.create({
        data: {
          civility: data.civility,
          firstName: data.firstName,
          lastName: data.lastName,
          birthDate: birthDate,
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
          cvFileName: cvFileName,
          coverLetterUrl: coverLetterUrl,
          coverLetterFileName: coverLetterFileName,
          otherDocumentUrl: otherDocumentUrl,
          otherDocumentFileName: otherDocumentFileName,
          acceptPrivacy: data.acceptPrivacy,
          acceptNewsletter: data.acceptNewsletter,
          status: "NEW",
        },
      });

      console.log("✅ Candidature enregistrée en DB:", candidature.id);
    } catch (dbError) {
      console.error("❌ Erreur base de données:", dbError);
      if (dbError instanceof Error) {
        console.error("❌ Message DB:", dbError.message);
        // Vérifier si c'est une erreur de contrainte unique (email déjà utilisé)
        if (dbError.message.includes("Unique constraint") || dbError.message.includes("unique")) {
          return NextResponse.json(
            { error: "Une candidature avec cet email existe déjà" },
            { status: 400 }
          );
        }
      }
      throw dbError; // Re-lancer pour être géré par le catch global
    }

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
    
    // Log plus détaillé pour le débogage
    if (error instanceof Error) {
      console.error("❌ Message d'erreur:", error.message);
      console.error("❌ Stack:", error.stack);
      
      // Messages d'erreur spécifiques selon le type d'erreur
      if (error.message.includes("Cloudinary")) {
        console.error("❌ PROBLÈME: Les identifiants Cloudinary ne sont pas configurés.");
        console.error("❌ Vérifiez que CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY et CLOUDINARY_API_SECRET sont définis dans vos variables d'environnement.");
        return NextResponse.json(
          {
            error: "Erreur de configuration serveur. Veuillez contacter l'administrateur.",
            ...(process.env.NODE_ENV === "development" && {
              details: error.message,
            }),
          },
          { status: 500 }
        );
      }
      
      if (error.message.includes("trop volumineux") || error.message.includes("too large")) {
        return NextResponse.json(
          {
            error: error.message,
          },
          { status: 400 }
        );
      }
      
      if (error.message.includes("upload") || error.message.includes("Cloudinary")) {
        // Message plus détaillé selon le type d'erreur
        let userMessage = "Erreur lors de l'upload des fichiers.";
        
        if (error.message.includes("credentials") || error.message.includes("Invalid API Key")) {
          userMessage = "Erreur de configuration serveur. Les identifiants Cloudinary sont incorrects. Veuillez contacter l'administrateur.";
        } else if (error.message.includes("cloud_name") || error.message.includes("404")) {
          userMessage = "Erreur de configuration serveur. Le nom du cloud Cloudinary est incorrect. Veuillez contacter l'administrateur.";
        } else {
          userMessage = `Erreur lors de l'upload des fichiers: ${error.message}`;
        }
        
        return NextResponse.json(
          {
            error: userMessage,
            ...(process.env.NODE_ENV === "development" && {
              details: error.message,
              stack: error.stack,
            }),
          },
          { status: 500 }
        );
      }
    }
    
    // Retourner un message d'erreur plus détaillé en développement
    const errorMessage = process.env.NODE_ENV === "development" && error instanceof Error
      ? `Erreur: ${error.message}`
      : "Une erreur est survenue lors de l'enregistrement de votre candidature. Veuillez réessayer.";
    
    return NextResponse.json(
      {
        error: errorMessage,
        ...(process.env.NODE_ENV === "development" && error instanceof Error && {
          details: error.stack,
        }),
      },
      { status: 500 }
    );
  }
}
