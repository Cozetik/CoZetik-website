import NewBlogPostForm from "@/components/admin/blog/new-blog-post-form";
import { prisma } from "@/lib/prisma";

export default async function NewBlogPostPage() {
  const themes = await prisma.theme.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="max-w-4xl mx-auto py-6">
      <NewBlogPostForm themes={themes} />
    </div>
  );
}
