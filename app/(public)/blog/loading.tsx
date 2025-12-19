import { BlogPostCardSkeleton } from '@/components/skeletons/blog-post-card-skeleton'
import { Skeleton } from '@/components/ui/skeleton'
import { Newspaper } from 'lucide-react'

export default function BlogLoading() {
  return (
    <div className="flex flex-col">
      {/* Page Header */}
      <section className="border-b bg-gradient-to-br from-primary/5 via-background to-primary/5 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            {/* Icon */}
            <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Newspaper className="h-8 w-8 text-primary" />
            </div>

            {/* Title */}
            <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
              Notre blog
            </h1>

            {/* Description */}
            <p className="text-lg text-muted-foreground md:text-xl">
              Actualités, conseils et tendances du monde de la formation
              professionnelle. Restez informé avec nos articles d&apos;experts.
            </p>
          </div>
        </div>
      </section>

      {/* Blog Posts Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          {/* Posts Count Skeleton */}
          <div className="mb-8">
            <Skeleton className="h-5 w-32" />
          </div>

          {/* Blog Posts Grid Skeleton */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <BlogPostCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
