import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Note: Dans Next.js 15+, params doit parfois être await,
    // mais la déstructuration directe fonctionne généralement dans les versions actuelles.
    const id = params.id;

    if (!id) {
      return new NextResponse("ID requis", { status: 400 });
    }

    const theme = await prisma.theme.delete({
      where: {
        id: id,
      },
    });

    return NextResponse.json(theme);
  } catch (error) {
    console.error("[THEME_DELETE]", error);
    return new NextResponse("Erreur interne", { status: 500 });
  }
}
