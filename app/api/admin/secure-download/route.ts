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
    // 1. Parsing robuste de l'URL pour extraire version et public_id
    const parts = url.split("/upload/");
    if (parts.length < 2) return NextResponse.redirect(url);

    const beforeUpload = parts[0];
    const afterUpload = parts[1]; // Ex: v1767693979/cozetik/cv/mon-cv.pdf

    // Pour les raw, on garde 'raw', sinon 'image' (par défaut pour les PDF auto)
    const resourceType = beforeUpload.includes("/raw") ? "raw" : "image";

    const pathParts = afterUpload.split("/");
    let publicId = afterUpload;
    let version = undefined;

    // Détection version (ex: v123456)
    if (
      pathParts[0].startsWith("v") &&
      /^\d+$/.test(pathParts[0].substring(1))
    ) {
      version = pathParts[0].substring(1);
      publicId = pathParts.slice(1).join("/");
    }

    console.log(
      `🔍 Proxy Download: Type=${resourceType}, Ver=${version}, ID=${publicId}`
    );

    // 2. Générer une URL signée valide (Côté serveur)
    const signedUrl = cloudinary.url(publicId, {
      resource_type: resourceType,
      type: "upload",
      sign_url: true, // Important: signe la requête
      secure: true,
      version: version,
      // Force le format pour éviter les erreurs de type (important pour les PDF en raw)
      format: resourceType === "raw" ? undefined : "pdf",
    });

    // 3. PROXY: Le serveur télécharge le fichier
    // On utilise fetch depuis le serveur Node.js (pas de pb CORS ou 401 navigateur)
    const response = await fetch(signedUrl);

    if (!response.ok) {
      console.error(
        `❌ Erreur fetch Cloudinary (${response.status}):`,
        signedUrl
      );
      return new NextResponse(
        `Erreur lors du téléchargement: ${response.statusText}`,
        { status: response.status }
      );
    }

    // 4. Préparer les headers pour forcer le téléchargement chez le client
    const headers = new Headers();
    headers.set(
      "Content-Type",
      response.headers.get("Content-Type") || "application/pdf"
    );

    // On extrait le nom du fichier du public_id
    const filename = publicId.split("/").pop() || "document.pdf";
    headers.set("Content-Disposition", `attachment; filename="${filename}"`);

    // 5. Renvoyer le flux de données directement au navigateur
    return new NextResponse(response.body, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error("❌ Erreur Proxy:", error);
    return new NextResponse("Erreur serveur interne", { status: 500 });
  }
}
