import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

interface AnnouncementSkeletonProps {
  count?: number
}

export function AnnouncementSkeleton({ count = 3 }: AnnouncementSkeletonProps) {
  return (
    <div className="space-y-4">
      {[...Array(count)].map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <div className="space-y-2">
              <Skeleton className="h-6 w-2/3" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-24" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
