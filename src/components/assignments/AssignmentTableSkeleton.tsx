import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function AssignmentTableSkeleton() {
  return (
    <div className="space-y-3">
      {[...Array(4)].map((_, i) => (
        <Card key={i}>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
                <Skeleton className="h-8 w-8 rounded" />
              </div>

              {/* Info row */}
              <div className="flex gap-4">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-32" />
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Skeleton className="h-9 w-32" />
                <Skeleton className="h-9 w-40" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
