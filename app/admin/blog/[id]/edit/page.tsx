import EditBlogPostForm from "@/components/admin/blog/edit-blog-post-form";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

interface EditBlogPostPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditBlogPostPage({
  params,
}: EditBlogPostPageProps) {
  const { id } = await params;

  // 1. Récupérer TOUS les thèmes disponibles pour le menu déroulant
  const themes = await prisma.theme.findMany({
    orderBy: { name: "asc" },
  });

  // 2. Récupérer l'article
  const post = await prisma.blogPost.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      content: true,
      imageUrl: true,
      seoTitle: true,
      seoDescription: true,
      visible: true,
      publishedAt: true,
      themes: true,
    },
  });

  if (!post) {
    notFound();
  }

  const formattedPost = {
    ...post,
    themeId: post.themes.length > 0 ? post.themes[0].id : null,
  };

  return (
    <div className="max-w-4xl mx-auto py-6">
      <EditBlogPostForm post={formattedPost} themes={themes} />
    </div>
  );
}
