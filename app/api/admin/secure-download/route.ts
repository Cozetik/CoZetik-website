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
    // 1. Parsing
    const parts = url.split("/upload/");
    if (parts.length < 2) return NextResponse.redirect(url);

    const beforeUpload = parts[0];
    const afterUpload = parts[1];

    // Détection brute : si l'URL contient "raw", c'est du raw, sinon image
    const resourceType = beforeUpload.includes("/raw") ? "raw" : "image";

    const pathParts = afterUpload.split("/");
    let publicId = afterUpload;
    let version = undefined;

    // Extraction version
    if (
      pathParts[0].startsWith("v") &&
      /^\d+$/.test(pathParts[0].substring(1))
    ) {
      version = pathParts[0].substring(1);
      publicId = pathParts.slice(1).join("/");
    }

    // 2. Génération URL signée
    const signedUrl = cloudinary.url(publicId, {
      resource_type: resourceType,
      type: "upload",
      sign_url: true,
      secure: true,
      version: version,
      // Si c'est raw, on ne met pas de format, sinon on force pdf
      format: resourceType === "raw" ? undefined : "pdf",
    });

    console.log(`Attempting download from: ${signedUrl}`);

    // 3. Téléchargement côté serveur
    const response = await fetch(signedUrl);

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`❌ Cloudinary Error (${response.status}):`, errorBody);
      return new NextResponse(`Erreur Cloudinary: ${response.status}`, {
        status: response.status,
      });
    }

    // 4. Conversion en Buffer (Plus stable que le stream direct pour les PDF)
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 5. Gestion intelligente du nom de fichier
    // On prend le dernier morceau de l'ID
    let filename = publicId.split("/").pop() || "document";

    // Si le nom n'a pas d'extension pdf, on la rajoute de force
    if (!filename.toLowerCase().endsWith(".pdf")) {
      filename += ".pdf";
    }

    // 6. Réponse avec Headers forcés
    const headers = new Headers();
    headers.set("Content-Type", "application/pdf");
    headers.set("Content-Length", buffer.length.toString());
    headers.set("Content-Disposition", `attachment; filename="${filename}"`);

    return new NextResponse(buffer, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error("❌ Erreur Proxy:", error);
    return new NextResponse("Erreur serveur interne", { status: 500 });
  }
}
