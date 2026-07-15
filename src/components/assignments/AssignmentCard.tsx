import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { Upload, MoreVertical, Eye, FileText } from 'lucide-react'
import type { Assignment } from '@/types'

interface AssignmentCardProps {
  assignment: Assignment
  isStudent: boolean
  onEdit?: () => void
  onDelete?: () => void
  onSubmit?: () => void
  onViewSubmissions?: () => void
  isDeleting?: boolean
}

export function AssignmentCard({
  assignment,
  isStudent,
  onEdit,
  onDelete,
  onSubmit,
  onViewSubmissions,
  isDeleting,
}: AssignmentCardProps) {
  // For staff/HOD: calculate submission count (mock data)
  const submissionCount = isStudent ? undefined : Math.floor(Math.random() * 25) + 1
  const totalStudents = 25

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <CardTitle className="truncate">{assignment.title}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {assignment.description && assignment.description.substring(0, 80)}
              {assignment.description && assignment.description.length > 80 ? '...' : ''}
            </p>
          </div>

          {/* Staff/HOD kebab menu */}
          {!isStudent && (onEdit || onDelete) && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  disabled={isDeleting}
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {onEdit && (
                  <DropdownMenuItem onClick={onEdit} disabled={isDeleting}>
                    Edit
                  </DropdownMenuItem>
                )}
                {onDelete && (
                  <DropdownMenuItem
                    onClick={onDelete}
                    disabled={isDeleting}
                    className="text-destructive"
                  >
                    Delete
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Info row */}
        <div className="flex flex-wrap gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Due: </span>
            <span>{new Date(assignment.dueDate).toLocaleDateString()}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Max Marks: </span>
            <span>{assignment.maxMarks}</span>
          </div>

          {/* Submission count for staff/HOD */}
          {!isStudent && submissionCount !== undefined && (
            <div>
              <span className="text-muted-foreground">Submissions: </span>
              <Badge variant="outline">
                {submissionCount}/{totalStudents}
              </Badge>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {isStudent && onSubmit && (
            <Button onClick={onSubmit} size="sm" className="gap-2">
              <Upload className="h-4 w-4" />
              Submit
            </Button>
          )}

          {!isStudent && onViewSubmissions && (
            <Button onClick={onViewSubmissions} variant="outline" size="sm" className="gap-2">
              <Eye className="h-4 w-4" />
              View Submissions
            </Button>
          )}

          {!isStudent && onViewSubmissions && (
            <Button
              onClick={onViewSubmissions}
              variant="ghost"
              size="sm"
              className="gap-2 ml-auto text-muted-foreground hover:text-foreground"
            >
              <FileText className="h-4 w-4" />
              {submissionCount} submitted
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
