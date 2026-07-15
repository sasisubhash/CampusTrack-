import { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, CheckCircle, Clock, AlertCircle, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import { AssignmentDialog } from '@/components/assignments/AssignmentDialog'
import { SubmissionDialog } from '@/components/assignments/SubmissionDialog'
import { SubmissionsTable } from '@/components/assignments/SubmissionsTable'
import { AssignmentCard } from '@/components/assignments/AssignmentCard'
import { AssignmentFilterBar } from '@/components/assignments/AssignmentFilterBar'
import { AssignmentTableSkeleton } from '@/components/assignments/AssignmentTableSkeleton'
import { EmptyState } from '@/components/common/EmptyState'
import { ErrorState } from '@/components/common/ErrorState'
import { assignmentService, type AssignmentFilterOptions } from '@/services/assignmentService'
import { useAuth } from '@/features/auth/AuthContext'
import { useToast } from '@/hooks/use-toast'
import type { Assignment } from '@/types'

const PAGINATION_LIMIT = 8

export interface AssignmentFilters {
  search?: string
  subject?: string
  status?: string
}

export default function AssignmentsPage() {
  const { user } = useAuth()
  const isStudent = user?.role === 'STUDENT'
  const isStaffOrHOD = user?.role === 'STAFF' || user?.role === 'HOD'

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isSubmissionOpen, setIsSubmissionOpen] = useState(false)
  const [isSubmissionsTableOpen, setIsSubmissionsTableOpen] = useState(false)
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null)
  const [submissionAssignmentId, setSubmissionAssignmentId] = useState('')
  const [filters, setFilters] = useState<AssignmentFilters>({})
  const [currentPage, setCurrentPage] = useState(1)

  const queryClient = useQueryClient()
  const { toast } = useToast()

  // Convert UI filters to service filters
  const serviceFilters: AssignmentFilterOptions = {
    search: filters.search,
    subjectId: filters.subject,
    status: filters.status,
  }

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['assignments', serviceFilters],
    queryFn: () => assignmentService.getAll(serviceFilters),
  })

  const assignments = data?.data || []

  // Pagination
  const paginatedAssignments = useMemo(() => {
    const startIdx = (currentPage - 1) * PAGINATION_LIMIT
    const endIdx = startIdx + PAGINATION_LIMIT
    return assignments.slice(startIdx, endIdx)
  }, [assignments, currentPage])

  const totalPages = Math.ceil(assignments.length / PAGINATION_LIMIT)

  // Stats
  const stats = useMemo(() => {
    if (isStudent) {
      return {
        total: assignments.length,
        submitted: assignments.length, // Mock: all are submitted or pending
        pending: 0,
      }
    } else {
      return {
        total: assignments.length,
        submitted: assignments.length,
        pending: 0,
      }
    }
  }, [assignments, isStudent])

  // Count active filters
  const activeFilterCount = Object.values(filters).filter(Boolean).length

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data: any) =>
      assignmentService.create({
        ...data,
        createdBy: user?.id || 'staff-1',
        assignedTo: ['student-1', 'student-2', 'student-3', 'student-4'],
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignments'] })
      setIsCreateOpen(false)
      toast({
        title: 'Success',
        description: 'Assignment created successfully',
      })
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create assignment',
        variant: 'destructive',
      })
    },
  })

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (data: any) => assignmentService.update(data.id, data.updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignments'] })
      setIsEditOpen(false)
      setSelectedAssignment(null)
      toast({
        title: 'Success',
        description: 'Assignment updated successfully',
      })
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update assignment',
        variant: 'destructive',
      })
    },
  })

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => assignmentService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignments'] })
      setIsDeleteOpen(false)
      setSelectedAssignment(null)
      setCurrentPage(1)
      toast({
        title: 'Success',
        description: 'Assignment deleted successfully',
      })
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete assignment',
        variant: 'destructive',
      })
    },
  })

  // Submit mutation (student)
  const submitMutation = useMutation({
    mutationFn: (data: any) =>
      assignmentService.submit(
        data.assignmentId,
        user?.id || 'student-1',
        data.fileName,
        data.comment
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignments'] })
      setIsSubmissionOpen(false)
      setSubmissionAssignmentId('')
      toast({
        title: 'Success',
        description: 'Assignment submitted successfully',
      })
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to submit assignment',
        variant: 'destructive',
      })
    },
  })

  const handleCreate = async (data: any) => {
    await createMutation.mutateAsync(data)
  }

  const handleEdit = (assignment: Assignment) => {
    setSelectedAssignment(assignment)
    setIsEditOpen(true)
  }

  const handleUpdate = async (data: any) => {
    if (!selectedAssignment) return
    await updateMutation.mutateAsync({
      id: selectedAssignment.id,
      updates: data,
    })
  }

  const handleDelete = (assignment: Assignment) => {
    setSelectedAssignment(assignment)
    setIsDeleteOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!selectedAssignment) return
    await deleteMutation.mutateAsync(selectedAssignment.id)
  }

  const handleSubmit = (assignmentId: string, assignmentTitle: string) => {
    setSubmissionAssignmentId(assignmentId)
    setSelectedAssignment({
      id: assignmentId,
      title: assignmentTitle,
    } as any)
    setIsSubmissionOpen(true)
  }

  const handleConfirmSubmit = async (fileName: string, comment?: string) => {
    await submitMutation.mutateAsync({
      assignmentId: submissionAssignmentId,
      fileName,
      comment,
    })
  }

  const handleViewSubmissions = (assignment: Assignment) => {
    setSelectedAssignment(assignment)
    setIsSubmissionsTableOpen(true)
  }

  const pageTitle = 'Assignments'
  const pageSubtitle = isStudent
    ? 'View and submit your assignments'
    : 'Manage and evaluate assignments'

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{pageTitle}</h1>
          <p className="text-muted-foreground">{pageSubtitle}</p>
        </div>
        {isStaffOrHOD && (
          <Button onClick={() => setIsCreateOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Assignment
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assignments</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Assignments in total</p>
          </CardContent>
        </Card>

        {isStudent ? (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Submitted</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.submitted}</div>
                <p className="text-xs text-muted-foreground">Assignments submitted</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
                <AlertCircle className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.pending}</div>
                <p className="text-xs text-muted-foreground">Awaiting submission</p>
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Submissions</CardTitle>
                <Clock className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{assignments.length}</div>
                <p className="text-xs text-muted-foreground">Ready for grading</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active</CardTitle>
                <AlertCircle className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{assignments.length}</div>
                <p className="text-xs text-muted-foreground">Open for submissions</p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Filters */}
      {(isStaffOrHOD || assignments.length > 0) && (
        <Card>
          <CardContent className="pt-6">
            <AssignmentFilterBar
              filters={filters}
              onFiltersChange={setFilters}
              activeFilterCount={activeFilterCount}
            />
          </CardContent>
        </Card>
      )}

      {/* Assignments List */}
      <Card>
        <CardHeader>
          <CardTitle>
            All Assignments
            {activeFilterCount > 0 && (
              <span className="text-sm font-normal text-muted-foreground ml-2">
                ({assignments.length} result{assignments.length !== 1 ? 's' : ''})
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <AssignmentTableSkeleton />
          ) : error ? (
            <ErrorState
              title="Failed to load assignments"
              message="Could not load assignments. Please try again."
              onRetry={() => refetch()}
            />
          ) : assignments.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="No assignments found"
              description={
                activeFilterCount > 0
                  ? 'No assignments match your current filters'
                  : isStaffOrHOD
                    ? 'No assignments yet. Create one to get started!'
                    : 'No assignments assigned to you yet'
              }
            />
          ) : (
            <div className="space-y-3">
              {paginatedAssignments.map((assignment) => (
                <AssignmentCard
                  key={assignment.id}
                  assignment={assignment}
                  isStudent={isStudent}
                  onEdit={isStaffOrHOD ? () => handleEdit(assignment) : undefined}
                  onDelete={isStaffOrHOD ? () => handleDelete(assignment) : undefined}
                  onSubmit={isStudent ? () => handleSubmit(assignment.id, assignment.title) : undefined}
                  onViewSubmissions={
                    isStaffOrHOD ? () => handleViewSubmissions(assignment) : undefined
                  }
                  isDeleting={deleteMutation.isPending && selectedAssignment?.id === assignment.id}
                />
              ))}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between pt-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      {isStaffOrHOD && (
        <AssignmentDialog
          isOpen={isCreateOpen}
          onOpenChange={setIsCreateOpen}
          onSubmit={handleCreate}
          isLoading={createMutation.isPending}
        />
      )}

      {selectedAssignment && isStaffOrHOD && (
        <>
          <AssignmentDialog
            isOpen={isEditOpen}
            onOpenChange={setIsEditOpen}
            assignment={selectedAssignment}
            onSubmit={handleUpdate}
            isLoading={updateMutation.isPending}
          />

          <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Assignment?</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete "{selectedAssignment.title}"? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleConfirmDelete}
                  disabled={deleteMutation.isPending}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <SubmissionsTable
            isOpen={isSubmissionsTableOpen}
            onOpenChange={setIsSubmissionsTableOpen}
            assignmentId={selectedAssignment.id}
            assignmentTitle={selectedAssignment.title}
            maxMarks={selectedAssignment.maxMarks}
          />
        </>
      )}

      {isStudent && (
        <SubmissionDialog
          isOpen={isSubmissionOpen}
          onOpenChange={setIsSubmissionOpen}
          assignmentTitle={selectedAssignment?.title || ''}
          onSubmit={handleConfirmSubmit}
          isLoading={submitMutation.isPending}
        />
      )}
    </div>
  )
}
