import { FormationCardSkeleton } from "@/components/skeletons/formation-card-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function FormationsLoading() {
  return (
    <div className="bg-[#FDFDFD] font-sans">
      {/* Hero Section Skeleton */}
      <section className="relative bg-[#ADA6DB] pb-10">
        <div className="container mx-auto px-6 md:px-12 lg:px-20">
          <div className="relative">
            <div className="absolute -right-16 top-2 h-64 w-64 rounded-full bg-[#ADA6DB] opacity-30 blur-3xl" />
            <div className="relative max-w-5xl translate-y-24 overflow-hidden bg-[#262626] px-8 py-14 md:px-16 md:py-20 lg:px-20 lg:py-24">
              <Skeleton className="h-12 w-3/4 bg-white/20 md:h-20 md:w-2/3" />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Skeleton */}
      <section className="pb-16 pt-32 md:pb-24 md:pt-40">
        <div className="container mx-auto px-6 md:px-12 lg:px-20">
          <div className="flex flex-col gap-10">
            {/* Filters Skeleton */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-wrap gap-3">
                <Skeleton className="h-[46px] w-24 rounded-none bg-gray-200" />
                <Skeleton className="h-[46px] w-64 rounded-none bg-gray-200" />
                <Skeleton className="h-[46px] w-64 rounded-none bg-gray-200" />
              </div>
              <div className="flex flex-wrap gap-3">
                <Skeleton className="h-[46px] w-20 rounded-none bg-gray-200" />
                <Skeleton className="h-[46px] w-32 rounded-none bg-gray-200" />
              </div>
            </div>

            {/* Grid Skeleton */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <FormationCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
