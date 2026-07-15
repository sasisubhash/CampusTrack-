import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Download, MessageSquare, Save, X, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { assignmentService, type AssignmentSubmission } from '@/services/assignmentService'
import { useToast } from '@/hooks/use-toast'
import { EmptyState } from '@/components/common/EmptyState'
import { ErrorState } from '@/components/common/ErrorState'
import { FileText } from 'lucide-react'

interface SubmissionsTableProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  assignmentId: string
  assignmentTitle: string
  maxMarks: number
}

export function SubmissionsTable({
  isOpen,
  onOpenChange,
  assignmentId,
  assignmentTitle,
  maxMarks,
}: SubmissionsTableProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [marks, setMarks] = useState<Record<string, number>>({})
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['assignment-submissions', assignmentId],
    queryFn: () => assignmentService.getSubmissions(assignmentId),
    enabled: isOpen,
  })

  const submissions = data?.data || []

  const gradeMutation = useMutation({
    mutationFn: (data: { submissionId: string; marks: number }) =>
      assignmentService.gradeSubmission(assignmentId, data.submissionId, data.marks, 'Graded'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignment-submissions'] })
      setEditingId(null)
      toast({
        title: 'Success',
        description: 'Marks submitted successfully',
      })
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      })
    },
  })

  const handleGradeSubmit = (submission: AssignmentSubmission) => {
    const studentMarks = marks[submission.id]
    if (studentMarks !== undefined) {
      gradeMutation.mutate({ submissionId: submission.id, marks: studentMarks })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'GRADED':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'LATE':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
      case 'SUBMITTED':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  const stats = {
    total: submissions.length,
    submitted: submissions.length,
    graded: submissions.filter((s) => s.status === 'GRADED').length,
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Submissions - {assignmentTitle}</DialogTitle>
          <DialogDescription>
            View and grade student submissions
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
            <div className="text-sm text-muted-foreground">Total Submissions</div>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.total}</div>
          </div>
          <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
            <div className="text-sm text-muted-foreground">Graded</div>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.graded}</div>
          </div>
          <div className="p-3 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
            <div className="text-sm text-muted-foreground">Pending</div>
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {stats.total - stats.graded}
            </div>
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
            title="No submissions yet"
            description="Students haven't submitted their work yet"
          />
        ) : (
          <div className="space-y-3 max-h-[60vh] overflow-y-auto">
            {submissions.map((submission) => (
              <div
                key={submission.id}
                className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1">
                    <p className="font-medium">{submission.studentName}</p>
                    <p className="text-xs text-muted-foreground">
                      Submitted: {new Date(submission.submittedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge className={getStatusColor(submission.status)} variant="secondary">
                    {submission.status}
                  </Badge>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm truncate">{submission.fileName}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 ml-auto"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>

                {editingId === submission.id ? (
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Input
                        type="number"
                        min="0"
                        max={maxMarks}
                        placeholder="Marks"
                        value={marks[submission.id] ?? submission.marks ?? ''}
                        onChange={(e) =>
                          setMarks({
                            ...marks,
                            [submission.id]: e.target.value ? parseInt(e.target.value, 10) : 0,
                          })
                        }
                        className="w-20 h-8"
                      />
                      <span className="text-sm text-muted-foreground">/ {maxMarks}</span>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleGradeSubmit(submission)}
                      disabled={gradeMutation.isPending}
                      className="h-8"
                    >
                      <Save className="h-3 w-3 mr-1" />
                      Save
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditingId(null)
                        const newMarks = { ...marks }
                        delete newMarks[submission.id]
                        setMarks(newMarks)
                      }}
                      disabled={gradeMutation.isPending}
                      className="h-8"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      {submission.marks !== undefined ? (
                        <span className="font-semibold text-green-600 dark:text-green-400">
                          Marks: {submission.marks}/{maxMarks}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">Not graded yet</span>
                      )}
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditingId(submission.id)
                        setMarks({ ...marks, [submission.id]: submission.marks ?? 0 })
                      }}
                      className="h-8"
                    >
                      {submission.marks !== undefined ? 'Edit' : 'Grade'}
                    </Button>
                  </div>
                )}

                {submission.feedback && (
                  <div className="mt-3 p-2 bg-muted rounded text-sm">
                    <div className="flex items-center gap-1 text-muted-foreground mb-1">
                      <MessageSquare className="h-3 w-3" />
                      Feedback
                    </div>
                    <p className="text-sm">{submission.feedback}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
