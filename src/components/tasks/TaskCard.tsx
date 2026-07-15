import { MoreHorizontal, Edit, Trash2, Eye, AlertCircle, CheckCircle, Clock } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { mockSubjects } from '@/data/mockData'
import type { DailyTask } from '@/types'

interface TaskCardProps {
  task: DailyTask
  onEdit: (task: DailyTask) => void
  onDelete: (task: DailyTask) => void
  onViewSubmissions: (taskId: string, taskTitle: string) => void
  isDeleting?: boolean
}

export function TaskCard({
  task,
  onEdit,
  onDelete,
  onViewSubmissions,
  isDeleting,
}: TaskCardProps) {
  const subject = mockSubjects.find((s) => s.id === task.subjectId)
  const dueDate = new Date(task.dueDate)
  const isOverdue = dueDate < new Date() && task.status === 'PENDING'
  const daysUntilDue = Math.ceil((dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))

  const getPriorityColor = () => {
    if (isOverdue) return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    if (daysUntilDue <= 2) return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300'
    return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
  }

  const getStatusIcon = () => {
    switch (task.status) {
      case 'COMPLETED':
        return <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
      case 'PENDING':
        return isOverdue ? (
          <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
        ) : (
          <Clock className="h-4 w-4 text-orange-600 dark:text-orange-400" />
        )
      default:
        return null
    }
  }

  return (
    <div className="p-4 border rounded-lg hover:shadow-md transition-shadow dark:hover:bg-muted/50">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            {getStatusIcon()}
            <h4 className="font-medium text-sm truncate">{task.title}</h4>
          </div>

          <p className="text-xs text-muted-foreground mb-2">{task.description}</p>

          <div className="flex flex-wrap gap-2 mb-3">
            {subject && (
              <Badge variant="outline" className="text-xs">
                {subject.name}
              </Badge>
            )}
            <Badge
              className={`text-xs ${
                task.status === 'COMPLETED'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
              }`}
              variant="secondary"
            >
              {task.status}
            </Badge>
            {isOverdue && (
              <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 text-xs" variant="secondary">
                Overdue
              </Badge>
            )}
          </div>

          <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
            <span>
              Due: {dueDate.toLocaleDateString()}
              {!isOverdue && daysUntilDue > 0 && ` (${daysUntilDue}d)`}
            </span>
            {task.attachments && task.attachments.length > 0 && (
              <span>Attachments: {task.attachments.length}</span>
            )}
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onViewSubmissions(task.id, task.title)}
              className="cursor-pointer"
            >
              <Eye className="h-4 w-4 mr-2" />
              View Submissions
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onEdit(task)}
              className="cursor-pointer"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onDelete(task.id)}
              disabled={isDeleting}
              className="cursor-pointer text-destructive focus:text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {isDeleting ? 'Deleting...' : 'Delete'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
