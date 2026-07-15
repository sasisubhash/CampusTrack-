import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function TaskTableSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <Card key={i} className="p-4">
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-full" />
                <div className="flex gap-2">
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-5 w-16" />
                </div>
              </div>
              <Skeleton className="h-8 w-8 rounded" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
