import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { subject } = await req.json();

    if (!subject) {
      return NextResponse.json(
        { error: "Le sujet est requis" },
        { status: 400 }
      );
    }

    // Utilise l'URL Railway centralisée
    const fastApiUrl = process.env.FASTAPI_URL || "http://localhost:8000";
    const apiUrl = `${fastApiUrl}/api/blog/generate`;

    console.log(`📡 Appel à ${apiUrl}`);

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subject }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        detail: "Erreur inconnue",
      }));
      console.error("❌ Erreur FastAPI:", errorData);
      return NextResponse.json(
        { error: errorData.detail || "Erreur lors de la génération" },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      subject: data.subject,
      markdown: data.markdown,
      expertiseReport: data.expertise_report,
      sources: data.sources,
    });
  } catch (error) {
    console.error("❌ Erreur:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Erreur serveur lors de la génération du blog",
      },
      { status: 500 }
    );
  }
}
