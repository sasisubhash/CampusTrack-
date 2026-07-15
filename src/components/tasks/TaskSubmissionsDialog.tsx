import { useQuery } from '@tanstack/react-query'
import { FileText } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Loader2 } from 'lucide-react'
import { taskService, type TaskSubmission } from '@/services/taskService'
import { EmptyState } from '@/components/common/EmptyState'
import { ErrorState } from '@/components/common/ErrorState'

interface TaskSubmissionsDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  taskId: string
  taskTitle: string
}

export function TaskSubmissionsDialog({
  isOpen,
  onOpenChange,
  taskId,
  taskTitle,
}: TaskSubmissionsDialogProps) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['task-submissions', taskId],
    queryFn: () => taskService.getSubmissions(taskId),
    enabled: isOpen,
  })

  const submissions = data?.data || []

  const completed = submissions.filter((s) => s.status === 'COMPLETED').length
  const pending = submissions.filter((s) => s.status === 'PENDING').length
  const late = submissions.filter((s) => s.status === 'LATE').length

  const getStatusColor = (status: TaskSubmission['status']) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'LATE':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
      case 'PENDING':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Task Submissions - {taskTitle}</DialogTitle>
          <DialogDescription>
            View student completion status
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
            <div className="text-sm text-muted-foreground">Completed</div>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{completed}</div>
          </div>
          <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-900/20 border border-gray-200 dark:border-gray-800">
            <div className="text-sm text-muted-foreground">Pending</div>
            <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">{pending}</div>
          </div>
          <div className="p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
            <div className="text-sm text-muted-foreground">Late</div>
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{late}</div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <ErrorState
            title="Failed to load submissions"
            message="Could not load student submissions"
            onRetry={() => refetch()}
          />
        ) : submissions.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No submissions"
            description="No student data available for this task"
          />
        ) : (
          <div className="space-y-2 max-h-[60vh] overflow-y-auto">
            {submissions.map((submission) => (
              <div
                key={submission.studentId}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div>
                  <p className="font-medium text-sm">{submission.studentName}</p>
                  {submission.completedDate && (
                    <p className="text-xs text-muted-foreground">
                      {new Date(submission.completedDate).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <Badge className={getStatusColor(submission.status)} variant="secondary">
                  {submission.status}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
