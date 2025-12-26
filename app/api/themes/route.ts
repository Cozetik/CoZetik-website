import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, slug } = body;

    if (!name || !slug) {
      return new NextResponse("Le nom et le slug sont requis", { status: 400 });
    }

    // Vérifier si le slug existe déjà pour éviter les doublons
    const existingTheme = await prisma.theme.findUnique({
      where: { slug },
    });

    if (existingTheme) {
      return new NextResponse("Ce thème existe déjà", { status: 409 });
    }

    const theme = await prisma.theme.create({
      data: {
        name,
        slug,
      },
    });

    return NextResponse.json(theme);
  } catch (error) {
    console.error("[THEMES_POST]", error);
    return new NextResponse("Erreur interne", { status: 500 });
  }
}
