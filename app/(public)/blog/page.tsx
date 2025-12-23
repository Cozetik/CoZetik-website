import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import BlogClient from "../../../components/blog/BlogClient";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Découvrez nos articles sur les formations professionnelles, les tendances du marché et les conseils pour développer vos compétences.",
  openGraph: {
    title: "Blog Cozetik - Actualités et conseils formations",
    description:
      "Actualités, conseils et tendances du monde de la formation professionnelle. Articles d'experts pour rester informé.",
    images: ["/og-image.jpg"],
    url: "https://cozetik.com/blog",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog Cozetik - Actualités et conseils formations",
    description: "Actualités et tendances de la formation professionnelle.",
    images: ["/og-image.jpg"],
  },
};

interface BlogPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const { theme } = await searchParams;
  const activeThemeSlug = typeof theme === "string" ? theme : undefined;

  const themes = await prisma.theme.findMany({
    orderBy: { name: "asc" },
  });

  const whereCondition = {
    visible: true,
    publishedAt: {
      lte: new Date(),
    },
    ...(activeThemeSlug
      ? {
          themes: {
            some: {
              slug: activeThemeSlug,
            },
          },
        }
      : {}),
  };

  const posts = await prisma.blogPost.findMany({
    where: whereCondition,
    orderBy: {
      publishedAt: "desc",
    },
    select: {
      id: true,
      slug: true,
      title: true,
      excerpt: true,
      content: true,
      imageUrl: true,
      publishedAt: true,
      themes: {
        select: {
          name: true,
          slug: true,
        },
      },
    },
  });

  return (
    <BlogClient
      posts={posts}
      themes={themes}
      activeThemeSlug={activeThemeSlug}
    />
  );
}
