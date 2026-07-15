import { UserCheck, UserX, Trash2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface BulkActionBarProps {
  selectedCount: number
  onActivate: () => void
  onDeactivate: () => void
  onDelete: () => void
  onClearSelection: () => void
  isLoading?: boolean
}

export function BulkActionBar({
  selectedCount,
  onActivate,
  onDeactivate,
  onDelete,
  onClearSelection,
  isLoading,
}: BulkActionBarProps) {
  if (selectedCount === 0) return null

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-5 duration-300">
      <div className="flex items-center gap-3 bg-primary text-primary-foreground px-4 py-3 rounded-lg shadow-lg border">
        <Badge variant="secondary" className="bg-primary-foreground text-primary px-2 py-1">
          {selectedCount} selected
        </Badge>
        
        <div className="h-6 w-px bg-primary-foreground/20" />
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onActivate}
          disabled={isLoading}
          className="h-8 text-primary-foreground hover:bg-primary-foreground/20 hover:text-primary-foreground"
        >
          <UserCheck className="mr-2 h-4 w-4" />
          Activate
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={onDeactivate}
          disabled={isLoading}
          className="h-8 text-primary-foreground hover:bg-primary-foreground/20 hover:text-primary-foreground"
        >
          <UserX className="mr-2 h-4 w-4" />
          Deactivate
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={onDelete}
          disabled={isLoading}
          className="h-8 text-primary-foreground hover:bg-red-500/20 hover:text-primary-foreground"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </Button>

        <div className="h-6 w-px bg-primary-foreground/20" />

        <Button
          variant="ghost"
          size="sm"
          onClick={onClearSelection}
          className="h-8 px-2 text-primary-foreground hover:bg-primary-foreground/20 hover:text-primary-foreground"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
