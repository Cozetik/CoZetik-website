import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import * as z from "zod";

const blogPostSchema = z.object({
  title: z.string().min(1, "Le titre est requis").max(200),
  slug: z.string().min(1, "Le slug est requis").max(200),
  excerpt: z.string().max(500).nullable().optional(),
  content: z.string().min(20, "Le contenu doit être détaillé"),
  imageUrl: z.string().nullable().optional(),
  seoTitle: z.string().max(60).nullable().optional(),
  seoDescription: z.string().max(160).nullable().optional(),
  visible: z.boolean(),
  publishedAt: z.string().nullable().optional(), // ISO string
  themeId: z.string().nullable().optional(),
});

export async function GET() {
  try {
    const posts = await prisma.blogPost.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        theme: true,
      },
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des articles" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = blogPostSchema.parse(body);

    // Vérifier unicité du slug
    const existing = await prisma.blogPost.findUnique({
      where: { slug: validatedData.slug },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Un article avec ce slug existe déjà" },
        { status: 400 }
      );
    }

    // Créer l'article
    const post = await prisma.blogPost.create({
      data: {
        title: validatedData.title,
        slug: validatedData.slug,
        excerpt: validatedData.excerpt || null,
        content: validatedData.content,
        imageUrl: validatedData.imageUrl || null,
        seoTitle: validatedData.seoTitle || null,
        seoDescription: validatedData.seoDescription || null,
        visible: validatedData.visible,
        publishedAt: validatedData.publishedAt
          ? new Date(validatedData.publishedAt)
          : null,
        themeId: validatedData.themeId || null,
      },
      include: {
        theme: true,
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }

    console.error("Error creating blog post:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
