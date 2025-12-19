import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function FormationCardSkeleton() {
  return (
    <Card className="flex h-full flex-col overflow-hidden">
      <CardHeader className="p-0">
        {/* Image Skeleton */}
        <div className="relative aspect-video w-full">
          <Skeleton className="h-full w-full rounded-b-none" />
          {/* Category Badge Skeleton */}
          <div className="absolute left-3 top-3">
            <Skeleton className="h-6 w-20" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-6">
        {/* Title Skeleton */}
        <Skeleton className="mb-3 h-7 w-3/4" />

        {/* Description Skeletons */}
        <div className="mb-4 space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>

        {/* Meta Info Skeletons */}
        <div className="flex gap-3">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-24" />
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0">
        {/* Button Skeleton */}
        <Skeleton className="h-10 w-full" />
      </CardFooter>
    </Card>
  )
}
