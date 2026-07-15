import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Loader2 } from 'lucide-react'
import type { Leave } from '@/types'

interface ParentConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  leave: Leave
  onConfirm: () => void
  onDecline: () => void
  isLoading?: boolean
}

export function ParentConfirmDialog({
  open,
  onOpenChange,
  leave,
  onConfirm,
  onDecline,
  isLoading,
}: ParentConfirmDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Leave Request</AlertDialogTitle>
          <AlertDialogDescription>
            Your child has requested {leave.type.toLowerCase()} leave from{' '}
            {new Date(leave.fromDate).toLocaleDateString()} to{' '}
            {new Date(leave.toDate).toLocaleDateString()}.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-2 py-4">
          <p className="text-sm font-medium">Reason:</p>
          <p className="text-sm text-muted-foreground">{leave.reason}</p>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={onDecline}
            disabled={isLoading}
          >
            Decline
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-green-600 hover:bg-green-700"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Confirming...
              </>
            ) : (
              'Confirm'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
