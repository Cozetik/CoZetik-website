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
    // 1. Analyser l'URL
    const parts = url.split("/upload/");
    if (parts.length < 2) return NextResponse.redirect(url);

    const beforeUpload = parts[0];
    const afterUpload = parts[1]; // Ex: v1767693979/cozetik/cv/mon-cv.pdf

    // Récupérer le type (raw/image)
    // Attention: parfois l'URL contient /v123/ directement après raw/upload/
    const resourceType = beforeUpload.split("/").pop() || "raw";

    const pathParts = afterUpload.split("/");

    let publicId = afterUpload;
    let version = undefined;

    // 2. Extraire la version réelle
    // C'est CRUCIAL car Cloudinary rejette la signature si la version ne matche pas
    if (pathParts[0].match(/^v\d+$/)) {
      version = pathParts[0].substring(1); // On garde juste le numéro (ex: 1767693979)
      publicId = pathParts.slice(1).join("/"); // Le reste est le public_id
    }

    // Si on n'a pas trouvé de version, c'est peut-être une vieille URL ou format différent
    // On laisse publicId tel quel dans ce cas.

    // 3. Générer l'URL signée avec la BONNE version
    const signedUrl = cloudinary.url(publicId, {
      resource_type: resourceType,
      type: "upload",
      sign_url: true,
      secure: true,
      version: version, // On force la version d'origine
    });

    return NextResponse.redirect(signedUrl);
  } catch (error) {
    console.error("Erreur de signature URL:", error);
    // En cas d'erreur, on redirige vers l'URL d'origine au cas où
    return NextResponse.redirect(url);
  }
}
