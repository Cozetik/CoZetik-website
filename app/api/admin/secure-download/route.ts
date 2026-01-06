import { v2 as cloudinary } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");

  if (!url) {
    return new NextResponse("URL manquante", { status: 400 });
  }

  try {
    // 1. Analyser l'URL pour extraire les infos nécessaires
    // Format attendu: https://res.cloudinary.com/.../raw/upload/v123.../dossier/fichier.pdf
    const parts = url.split("/upload/");
    if (parts.length < 2) return NextResponse.redirect(url); // Si format inconnu, on tente l'original

    const beforeUpload = parts[0]; // Contient le resource_type à la fin (ex: .../raw)
    const afterUpload = parts[1]; // Contient la version et le public_id

    const resourceType = beforeUpload.split("/").pop() || "raw";

    // Nettoyer la version (v12345/) pour récupérer le vrai public_id
    const pathParts = afterUpload.split("/");
    let publicId = afterUpload;

    // Si le premier segment est une version (ex: v1767693351), on l'enlève
    if (pathParts[0].match(/^v\d+$/)) {
      publicId = pathParts.slice(1).join("/");
    }

    // 2. Générer une URL signée
    // sign_url: true ajoute une signature basée sur votre API_SECRET
    // Cela permet de contourner la restriction "Authenticated" du compte
    const signedUrl = cloudinary.url(publicId, {
      resource_type: resourceType,
      type: "upload",
      sign_url: true,
      secure: true,
    });

    // 3. Rediriger l'utilisateur vers l'URL signée
    return NextResponse.redirect(signedUrl);
  } catch (error) {
    console.error("Erreur de signature URL:", error);
    // En cas d'erreur, on redirige vers l'URL d'origine au cas où
    return NextResponse.redirect(url);
  }
}
