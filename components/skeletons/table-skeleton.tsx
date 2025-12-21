import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'

interface TableSkeletonProps {
  columns?: number
  rows?: number
  showImage?: boolean
}

export function TableSkeleton({
  columns = 6,
  rows = 5,
  showImage = false,
}: TableSkeletonProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {showImage && (
              <TableHead className="w-[80px]">
                <Skeleton className="h-4 w-12" />
              </TableHead>
            )}
            {Array.from({ length: columns - (showImage ? 1 : 0) }).map((_, i) => (
              <TableHead key={i}>
                <Skeleton className="h-4 w-20" />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <TableRow key={rowIndex}>
              {showImage && (
                <TableCell>
                  <Skeleton className="h-[50px] w-[50px] rounded" />
                </TableCell>
              )}
              {Array.from({ length: columns - (showImage ? 1 : 0) }).map(
                (_, colIndex) => (
                  <TableCell key={colIndex}>
                    <Skeleton
                      className={`h-4 ${
                        colIndex === columns - (showImage ? 2 : 1)
                          ? 'ml-auto w-16'
                          : 'w-full'
                      }`}
                    />
                  </TableCell>
                )
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
