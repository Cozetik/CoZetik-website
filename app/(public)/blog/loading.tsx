import { BlogPostCardSkeleton } from "@/components/skeletons/blog-post-card-skeleton";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import Line from "./../../../public/line.svg";

export default function BlogLoading() {
  return (
    <div className="flex flex-col">
      {/* Page Header */}
      <section className="border-b bg-[#C792DF] py-16 pt-36 text-center">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl ">
            {/* Title */}
            <h1 className="text-4xl font-bold tracking-tight text-center text-cozetik-white font-display uppercase md:text-7xl">
              Explorez des contenus inspirants{" "}
            </h1>
            <Image
              src={Line}
              alt="Decorative line"
              width={500}
              className="justify-self-center mb-4 -translate-y-5"
            />
            {/* Description */}
            <p className="text-lg text-cozetik-white font-sans md:text-xl">
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
  );
}
