import { FormationCardSkeleton } from '@/components/skeletons/formation-card-skeleton'
import { Skeleton } from '@/components/ui/skeleton'
import { BookOpen } from 'lucide-react'

export default function FormationsLoading() {
  return (
    <div className="flex flex-col">
      {/* Page Header */}
      <section className="border-b bg-gradient-to-br from-primary/5 via-background to-primary/5 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            {/* Icon */}
            <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <BookOpen className="h-8 w-8 text-primary" />
            </div>

            {/* Title */}
            <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
              Nos formations
            </h1>

            {/* Description */}
            <p className="text-lg text-muted-foreground md:text-xl">
              Explorez notre catalogue complet de formations professionnelles et
              trouvez celle qui correspond parfaitement à vos objectifs de carrière.
            </p>
          </div>
        </div>
      </section>

      {/* Formations List Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="space-y-8">
            {/* Filters Section Skeleton */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-32" />
              </div>

              {/* Category Tabs Skeleton */}
              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-9 w-48" />
                <Skeleton className="h-9 w-32" />
                <Skeleton className="h-9 w-36" />
                <Skeleton className="h-9 w-28" />
              </div>
            </div>

            {/* Results Count Skeleton */}
            <Skeleton className="h-5 w-40" />

            {/* Formations Grid Skeleton */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <FormationCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
