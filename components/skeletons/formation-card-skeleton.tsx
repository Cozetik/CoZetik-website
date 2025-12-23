import { Skeleton } from "@/components/ui/skeleton";

export function FormationCardSkeleton() {
  return (
    <div className="flex h-full flex-col bg-[#262626] px-8 py-10">
      {/* Accroche */}
      <Skeleton className="h-4 w-32 bg-white/20" />

      {/* Titre */}
      <Skeleton className="mt-6 h-8 w-3/4 bg-white/20" />

      {/* Description */}
      <div className="mt-6 space-y-2">
        <Skeleton className="h-4 w-full bg-white/10" />
        <Skeleton className="h-4 w-full bg-white/10" />
        <Skeleton className="h-4 w-2/3 bg-white/10" />
      </div>

      {/* Footer */}
      <div className="mt-auto flex items-center justify-between pt-8">
        {/* Category Label */}
        <Skeleton className="h-4 w-40 bg-white/10" />

        {/* Button */}
        <Skeleton className="h-12 w-36 bg-[#ADA6DB]/50" />
      </div>
    </div>
  );
}
