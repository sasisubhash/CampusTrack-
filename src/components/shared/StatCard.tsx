import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'

interface StatCardProps {
    title: string
    value: string | number
    icon: LucideIcon
    description?: string
    trend?: string
    statusColor?: string // Tailwind text color class, e.g. 'text-blue-600'
    className?: string
}

export function StatCard({ title, value, icon: Icon, description, trend, statusColor, className }: StatCardProps) {
    return (
        <Card className={cn("border-0 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1 bg-card cursor-default group", className)}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">{title}</CardTitle>
                <div className={cn("p-2 rounded-full bg-secondary group-hover:bg-secondary/80 transition-colors", statusColor)}>
                    <Icon className="h-4 w-4" />
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-card-foreground">{value}</div>
                {(description || trend) && (
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                        {trend && <span className={cn("font-medium", statusColor)}>{trend}</span>}
                        {description}
                    </p>
                )}
            </CardContent>
        </Card>
    )
}
