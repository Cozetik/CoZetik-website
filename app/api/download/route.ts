import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const url = request.nextUrl.searchParams.get("url");
    const filename = request.nextUrl.searchParams.get("filename");

    if (!url) {
      return NextResponse.json({ error: "URL manquante" }, { status: 400 });
    }

    // Récupérer le fichier depuis Cloudinary
    const response = await fetch(url);

    if (!response.ok) {
      return NextResponse.json(
        { error: "Impossible de récupérer le fichier" },
        { status: 500 }
      );
    }

    const blob = await response.blob();

    // Déterminer le nom du fichier
    let downloadFilename = filename || "document";
    if (!downloadFilename.includes(".")) {
      // Extraire l'extension de l'URL si pas présente dans filename
      const urlParts = url.split(".");
      const extension = urlParts[urlParts.length - 1].split("?")[0];
      downloadFilename = `${downloadFilename}.${extension}`;
    }

    // Créer la réponse avec les bons headers pour forcer le téléchargement
    return new NextResponse(blob, {
      headers: {
        "Content-Type":
          response.headers.get("Content-Type") || "application/octet-stream",
        "Content-Disposition": `attachment; filename="${downloadFilename}"`,
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    console.error("Erreur lors du téléchargement:", error);
    return NextResponse.json(
      { error: "Erreur lors du téléchargement du fichier" },
      { status: 500 }
    );
  }
}
