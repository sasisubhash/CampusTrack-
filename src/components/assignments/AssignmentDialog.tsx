import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { AssignmentForm } from '@/features/assignments/AssignmentForm'
import type { Assignment } from '@/types'

interface AssignmentDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  assignment?: Assignment
  onSubmit: (data: any) => Promise<void>
  isLoading?: boolean
}

export function AssignmentDialog({
  isOpen,
  onOpenChange,
  assignment,
  onSubmit,
  isLoading,
}: AssignmentDialogProps) {
  const isEdit = !!assignment
  const title = isEdit ? 'Edit Assignment' : 'Create Assignment'
  const description = isEdit
    ? 'Update assignment details and settings'
    : 'Create a new assignment for your students'

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <AssignmentForm
          assignment={assignment}
          onSubmit={onSubmit}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  )
}
