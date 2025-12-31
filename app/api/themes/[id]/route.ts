import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const updateThemeSchema = z.object({
  name: z.string().min(1, "Le nom est requis").max(100),
  slug: z.string().min(1, "Le slug est requis"),
});

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return new NextResponse("ID requis", { status: 400 });
    }

    const theme = await prisma.theme.findUnique({
      where: { id },
    });

    if (!theme) {
      return NextResponse.json(
        { error: "Thème introuvable" },
        { status: 404 }
      );
    }

    return NextResponse.json(theme);
  } catch (error) {
    console.error("[THEME_GET]", error);
    return new NextResponse("Erreur interne", { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    if (!id) {
      return new NextResponse("ID requis", { status: 400 });
    }

    // Validation avec Zod
    const validatedData = updateThemeSchema.parse(body);

    // Vérifier que le thème existe
    const existingTheme = await prisma.theme.findUnique({
      where: { id },
    });

    if (!existingTheme) {
      return NextResponse.json(
        { error: "Thème introuvable" },
        { status: 404 }
      );
    }

    // Vérifier l'unicité du slug (si modifié)
    if (validatedData.slug !== existingTheme.slug) {
      const slugExists = await prisma.theme.findUnique({
        where: { slug: validatedData.slug },
      });

      if (slugExists && slugExists.id !== id) {
        return NextResponse.json(
          { error: "Un thème avec ce slug existe déjà" },
          { status: 400 }
        );
      }
    }

    // Vérifier l'unicité du nom (si modifié)
    if (validatedData.name !== existingTheme.name) {
      const nameExists = await prisma.theme.findUnique({
        where: { name: validatedData.name },
      });

      if (nameExists && nameExists.id !== id) {
        return NextResponse.json(
          { error: "Un thème avec ce nom existe déjà" },
          { status: 400 }
        );
      }
    }

    // Mettre à jour le thème
    const theme = await prisma.theme.update({
      where: { id },
      data: {
        name: validatedData.name,
        slug: validatedData.slug,
      },
    });

    revalidatePath("/admin/blog");
    revalidatePath("/blog");

    return NextResponse.json(theme);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Données invalides", details: error.issues },
        { status: 400 }
      );
    }

    console.error("[THEME_UPDATE]", error);
    return new NextResponse("Erreur interne", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return new NextResponse("ID requis", { status: 400 });
    }

    const theme = await prisma.theme.delete({
      where: {
        id: id,
      },
    });

    revalidatePath("/admin/blog");
    revalidatePath("/blog");

    return NextResponse.json(theme);
  } catch (error) {
    console.error("[THEME_DELETE]", error);
    return new NextResponse("Erreur interne", { status: 500 });
  }
}
