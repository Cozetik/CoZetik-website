import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="bg-cozetik-beige min-h-screen">
      {/* 1. Hero Skeleton - Dark Background */}
      <section className="bg-cozetik-black text-white py-16 lg:py-24 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              {/* Breadcrumb skeleton */}
              <div className="flex gap-2">
                <Skeleton className="h-4 w-20 bg-white/10" />
                <Skeleton className="h-4 w-4 bg-white/10" />
                <Skeleton className="h-4 w-32 bg-white/10" />
              </div>

              {/* Title skeleton */}
              <Skeleton className="h-12 w-3/4 bg-white/10" />
              <Skeleton className="h-12 w-1/2 bg-white/10" />

              {/* Description skeleton */}
              <div className="space-y-2 pt-4">
                <Skeleton className="h-4 w-full bg-white/10" />
                <Skeleton className="h-4 w-full bg-white/10" />
                <Skeleton className="h-4 w-2/3 bg-white/10" />
              </div>

              {/* Buttons skeleton */}
              <div className="flex gap-4 pt-6">
                <Skeleton className="h-12 w-40 bg-white/10 rounded-full" />
                <Skeleton className="h-12 w-40 bg-white/10 rounded-full" />
              </div>
            </div>

            {/* Image/Carousel placeholder */}
            <div className="relative aspect-video lg:aspect-square rounded-2xl overflow-hidden">
              <Skeleton className="h-full w-full bg-white/10" />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Key Infos Skeleton */}
      <section className="py-12 border-b border-cozetik-black/5">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-6 w-6 bg-cozetik-black/10" />
                <Skeleton className="h-4 w-24 bg-cozetik-black/10" />
                <Skeleton className="h-6 w-32 bg-cozetik-black/10" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Objectives Skeleton */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <Skeleton className="h-10 w-64 mb-12 bg-cozetik-black/10" />
          <div className="grid md:grid-cols-2 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex gap-4 p-6 bg-white rounded-xl">
                <Skeleton className="h-6 w-6 shrink-0 rounded-full bg-cozetik-black/10" />
                <div className="space-y-2 w-full">
                  <Skeleton className="h-5 w-full bg-cozetik-black/10" />
                  <Skeleton className="h-4 w-2/3 bg-cozetik-black/10" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
