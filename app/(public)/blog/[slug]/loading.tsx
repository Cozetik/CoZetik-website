import { Skeleton } from "@/components/ui/skeleton";

export default function BlogPostLoading() {
  return (
    <div className="flex flex-col animate-pulse">
      <div className="relative mb-12 overflow-hidden rounded-lg">
        <div className="w-full h-[50vh] bg-muted" />
      </div>

      <section className="border-b pb-2">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <Skeleton className="mb-6 h-10 w-3/4 sm:h-14" />
            <Skeleton className="mb-8 h-10 w-1/2 sm:h-14" />

            <div className="mb-8 flex flex-wrap items-center gap-4">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-32" />
            </div>

            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-full" />
              <div className="py-8">
                <Skeleton className="h-64 w-full rounded-lg" />{" "}
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-11/12" />
              <Skeleton className="h-4 w-full" />
            </div>

            <div className="mt-12 flex flex-col gap-4">
              <Skeleton className="h-10 w-1/4" />
              <Skeleton className="h-10 w-1/4" />
              <Skeleton className="h-10 w-1/4" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <Skeleton className="mb-6 h-10 w-1/3 sm:h-14" />

            <div className="space-y-4">
              <div className="flex gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
              <div className="flex gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            </div>

            <div className="mt-8">
              <Skeleton className="h-10 w-full sm:h-14" />
              <Skeleton className="mt-2 h-10 w-full sm:h-14" />{" "}
              <Skeleton className="mt-2 h-24 w-full rounded-lg" />{" "}
              <Skeleton className="mt-4 h-10 w-1/4" />
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col gap-4">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-1/4" />
          </div>
        </div>
      </footer>
    </div>
  );
}
