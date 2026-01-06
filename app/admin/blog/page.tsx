import BlogTable from "@/components/admin/blog/blog-table";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { FileText, Plus } from "lucide-react";
import Link from "next/link";

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({
    orderBy: { createdAt: "desc" },
  });

  // Sérialiser les dates pour le client
  const serializedPosts = posts.map((post) => ({
    ...post,
    publishedAt: post.publishedAt?.toISOString() ?? null,
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-4xl font-bricolage font-semibold tracking-tight">
            Blog
          </h1>
          <p className="text-muted-foreground font-sans">
            Gérez vos articles de blog
          </p>
        </div>
        <Button asChild size="default" className="shadow-sm font-sans">
          <Link href="/admin/blog/new">
            <Plus className="mr-2 h-4 w-4" />
            Nouvel article
          </Link>
        </Button>
      </div>

      {posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-6 rounded-lg border border-dashed">
          <div className="rounded-full bg-muted p-3 mb-4">
            <FileText className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-bricolage font-semibold mb-1.5">
            Aucun article créé
          </h3>
          <p className="text-sm font-sans text-muted-foreground mb-6 text-center max-w-sm">
            Commencez par créer votre premier article de blog
          </p>
          <Button asChild size="sm" className="font-sans">
            <Link href="/admin/blog/new">
              <Plus className="mr-2 h-4 w-4" />
              Créer un article
            </Link>
          </Button>
        </div>
      ) : (
        <BlogTable posts={serializedPosts} />
      )}
    </div>
  );
}
