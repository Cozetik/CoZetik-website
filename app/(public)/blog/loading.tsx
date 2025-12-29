import { BlogPostCardSkeleton } from "@/components/skeletons/blog-post-card-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function BlogLoading() {
  return (
    <div className="flex flex-col">
      {/* Page Header Skeleton */}
      <section className="border-b bg-[#C792DF] py-16 pt-36 text-center">
        <div className="container mx-auto px-4">
          <div className="mx-auto flex max-w-5xl flex-col items-center">
            {/* Title Skeleton */}
            <Skeleton className="h-12 w-3/4 md:h-20 md:w-2/3 bg-white/20" />

            {/* Line Skeleton */}
            <div className="my-6 -translate-y-2">
              <Skeleton className="h-4 w-64 md:w-96 bg-white/20" />
            </div>

            {/* Description Skeleton */}
            <div className="flex flex-col items-center gap-2 w-full">
              <Skeleton className="h-6 w-full max-w-2xl bg-white/20" />
              <Skeleton className="h-6 w-2/3 max-w-xl bg-white/20" />
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          {/* Filter Skeleton */}
          <div className="flex justify-center mb-10">
            <Skeleton className="h-10 w-[280px] rounded-none" />
          </div>

          {/* Posts Count Skeleton */}
          <div className="mb-8">
            <Skeleton className="h-5 w-48" />
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
  );
}
