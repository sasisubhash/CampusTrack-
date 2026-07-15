import { Skeleton } from '@/components/ui/skeleton'

export function CalendarSkeleton() {
  return (
    <div className="space-y-2">
      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {[...Array(7)].map((_, i) => (
          <Skeleton key={i} className="h-8" />
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {[...Array(42)].map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-lg" />
        ))}
      </div>
    </div>
  )
}
