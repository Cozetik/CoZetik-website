import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function BlogPostCardSkeleton() {
  return (
    <Card className="flex h-full flex-col overflow-hidden">
      <CardHeader className="p-0">
        {/* Image Skeleton */}
        <Skeleton className="aspect-video w-full rounded-b-none" />
      </CardHeader>

      <CardContent className="flex-1 p-6">
        {/* Date and Reading Time Skeletons */}
        <div className="mb-3 flex items-center gap-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
        </div>

        {/* Title Skeleton */}
        <Skeleton className="mb-3 h-7 w-4/5" />

        {/* Excerpt Skeletons */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0">
        {/* Button Skeleton */}
        <Skeleton className="h-10 w-full" />
      </CardFooter>
    </Card>
  )
}
