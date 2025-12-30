import { prisma } from "@/lib/prisma";
import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";
import { revalidatePath } from 'next/cache';
import * as z from "zod";

// Configuration Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const blogPostSchema = z.object({
  title: z.string().min(1, "Le titre est requis").max(200),
  slug: z.string().min(1, "Le slug est requis").max(200),
  excerpt: z.string().max(500).nullable().optional(),
  content: z.string().min(20, "Le contenu doit être détaillé"),
  imageUrl: z.string().nullable().optional(),
  themeId: z.string().nullable().optional(),
  seoTitle: z.string().max(60).nullable().optional(),
  seoDescription: z.string().max(160).nullable().optional(),
  visible: z.boolean(),
  publishedAt: z.string().nullable().optional(), // ISO string
  previousImageUrl: z.string().nullable().optional(), // Pour suppression
});

// Extraire le public_id depuis une URL Cloudinary
function extractCloudinaryPublicId(url: string): string | null {
  try {
    const regex = /\/(?:v\d+\/)?([^/]+\/[^/.]+)\.[^.]+$/;
    const match = url.match(regex);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

// GET - Récupérer un article par ID
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const post = await prisma.blogPost.findUnique({
      where: { id },
    });

    if (!post) {
      return NextResponse.json(
        { error: "Article non trouvé" },
        { status: 404 }
      );
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération de l'article" },
      { status: 500 }
    );
  }
}

// PUT - Mettre à jour un article
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validatedData = blogPostSchema.parse(body);

    // Vérifier que l'article existe
    const existingPost = await prisma.blogPost.findUnique({
      where: { id },
    });

    if (!existingPost) {
      return NextResponse.json(
        { error: "Article non trouvé" },
        { status: 404 }
      );
    }

    // Vérifier unicité du slug (sauf si c'est le même article)
    if (validatedData.slug !== existingPost.slug) {
      const slugExists = await prisma.blogPost.findUnique({
        where: { slug: validatedData.slug },
      });

      if (slugExists) {
        return NextResponse.json(
          { error: "Un article avec ce slug existe déjà" },
          { status: 400 }
        );
      }
    }

    // Supprimer l'ancienne image de Cloudinary si nouvelle image uploadée
    if (
      validatedData.previousImageUrl &&
      validatedData.imageUrl &&
      validatedData.previousImageUrl !== validatedData.imageUrl
    ) {
      const publicId = extractCloudinaryPublicId(
        validatedData.previousImageUrl
      );
      if (publicId) {
        try {
          await cloudinary.uploader.destroy(publicId);
        } catch (error) {
          console.error("Error deleting old image from Cloudinary:", error);
          // On continue même si la suppression échoue
        }
      }
    }

    // Si passage de Brouillon → Publié sans date, mettre date actuelle
    let publishedAt = validatedData.publishedAt
      ? new Date(validatedData.publishedAt)
      : existingPost.publishedAt;

    if (validatedData.visible && !publishedAt) {
      publishedAt = new Date();
    }

    // Mettre à jour l'article
    const updatedPost = await prisma.blogPost.update({
      where: { id },
      data: {
        title: validatedData.title,
        slug: validatedData.slug,
        excerpt: validatedData.excerpt || null,
        content: validatedData.content,
        imageUrl: validatedData.imageUrl || null,
        seoTitle: validatedData.seoTitle || null,
        seoDescription: validatedData.seoDescription || null,
        visible: validatedData.visible,
        publishedAt,
        themeId: validatedData.themeId || null,
      },
      include: {
        theme: true,
      },
    });

    revalidatePath('/admin/blog');
    revalidatePath('/blog');

    return NextResponse.json(updatedPost);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }

    console.error("Error updating blog post:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// Extraire toutes les URLs d'images Cloudinary depuis le contenu HTML
function extractCloudinaryImagesFromContent(htmlContent: string): string[] {
  const cloudinaryUrls: string[] = [];
  // Regex pour détecter les URLs Cloudinary dans les balises img src
  const imgRegex = /<img[^>]+src=["']([^"']+)["']/gi;
  let match;

  while ((match = imgRegex.exec(htmlContent)) !== null) {
    const url = match[1];
    // Vérifier si c'est une URL Cloudinary
    if (url.includes("cloudinary.com")) {
      cloudinaryUrls.push(url);
    }
  }

  return cloudinaryUrls;
}

// DELETE - Supprimer un article
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Récupérer l'article
    const post = await prisma.blogPost.findUnique({
      where: { id },
    });

    if (!post) {
      return NextResponse.json(
        { error: "Article non trouvé" },
        { status: 404 }
      );
    }

    // Supprimer l'image principale de Cloudinary si elle existe
    if (post.imageUrl) {
      const publicId = extractCloudinaryPublicId(post.imageUrl);
      if (publicId) {
        try {
          await cloudinary.uploader.destroy(publicId);
        } catch (error) {
          console.error("Error deleting main image from Cloudinary:", error);
          // On continue même si la suppression échoue
        }
      }
    }

    // Extraire et supprimer les images inline du contenu
    const inlineImages = extractCloudinaryImagesFromContent(post.content);
    for (const imageUrl of inlineImages) {
      const publicId = extractCloudinaryPublicId(imageUrl);
      if (publicId) {
        try {
          await cloudinary.uploader.destroy(publicId);
        } catch (error) {
          console.error("Error deleting inline image from Cloudinary:", error);
          // On continue même si la suppression échoue
        }
      }
    }

    // Supprimer l'article de la DB
    await prisma.blogPost.delete({
      where: { id },
    });

    revalidatePath('/admin/blog');
    revalidatePath('/blog');

    return NextResponse.json({ message: "Article supprimé avec succès" });
  } catch (error) {
    console.error("Error deleting blog post:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
