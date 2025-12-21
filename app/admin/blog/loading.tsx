import { TableSkeleton } from '@/components/skeletons/table-skeleton'
import { Skeleton } from '@/components/ui/skeleton'

export default function BlogAdminLoading() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="mb-2 h-9 w-48" />
          <Skeleton className="h-5 w-64" />
        </div>
        <Skeleton className="h-10 w-44" />
      </div>

      {/* Table Skeleton */}
      <TableSkeleton columns={7} rows={5} showImage />
    </div>
  )
}
