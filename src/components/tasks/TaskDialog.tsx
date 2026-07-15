import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { TaskForm } from '@/features/tasks/TaskForm'
import type { DailyTask } from '@/types'

interface TaskDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  task?: DailyTask
  onSubmit: (data: Omit<DailyTask, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'assignedTo'> & { attachmentName?: string }) => Promise<void>
  isLoading?: boolean
}

export function TaskDialog({
  isOpen,
  onOpenChange,
  task,
  onSubmit,
  isLoading,
}: TaskDialogProps) {
  const handleSubmit = async (data: any) => {
    await onSubmit(data)
    onOpenChange(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{task ? 'Edit Task' : 'Create New Task'}</DialogTitle>
          <DialogDescription>
            {task
              ? 'Update the task details below'
              : 'Fill in the details to create a new task'}
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[60vh] overflow-y-auto">
          <TaskForm
            task={task}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
