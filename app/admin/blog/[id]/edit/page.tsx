import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import EditBlogPostForm from '@/components/admin/blog/edit-blog-post-form'

interface EditBlogPostPageProps {
  params: Promise<{ id: string }>
}

export default async function EditBlogPostPage({
  params,
}: EditBlogPostPageProps) {
  const { id } = await params

  const post = await prisma.blogPost.findUnique({
    where: { id },
  })

  if (!post) {
    notFound()
  }

  return (
    <div className="max-w-4xl mx-auto py-6">
      <EditBlogPostForm post={post} />
    </div>
  )
}
