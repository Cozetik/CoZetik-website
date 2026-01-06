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
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-border/50">
        <div className="space-y-1.5">
          <h1 className="text-3xl font-semibold tracking-tight text-balance">
            Blog
          </h1>
          <p className="text-sm text-muted-foreground">
            Gérez vos articles de blog
          </p>
        </div>
        <Button
          asChild
          size="default"
          className="bg-primary hover:bg-primary/90 shadow-sm"
        >
          <Link href="/admin/blog/new">
            <Plus className="mr-2 h-4 w-4" />
            Nouvel article
          </Link>
        </Button>
      </div>

      {posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-6 border border-border/50 rounded-lg bg-card/30 backdrop-blur-sm">
          <div className="rounded-full bg-muted/50 p-4 mb-4">
            <FileText className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-1.5 text-balance">
            Aucun article créé
          </h3>
          <p className="text-sm text-muted-foreground mb-6 text-center max-w-sm text-balance">
            Commencez par créer votre premier article de blog
          </p>
          <Button asChild size="default" className="shadow-sm">
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
