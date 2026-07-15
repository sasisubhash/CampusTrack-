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
import { TaskDialog } from '@/components/tasks/TaskDialog'
import { TaskSubmissionsDialog } from '@/components/tasks/TaskSubmissionsDialog'
import { TaskCard } from '@/components/tasks/TaskCard'
import { TaskFilterBar } from '@/components/tasks/TaskFilterBar'
import { TaskTableSkeleton } from '@/components/tasks/TaskTableSkeleton'
import { EmptyState } from '@/components/common/EmptyState'
import { ErrorState } from '@/components/common/ErrorState'
import { taskService, type TaskFilterOptions } from '@/services/taskService'
import { useToast } from '@/hooks/use-toast'
import type { DailyTask } from '@/types'

const PAGINATION_LIMIT = 8

export interface TaskFilters {
  search?: string
  subject?: string
  status?: string
  dueDate?: string
}

export default function TasksPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isSubmissionsOpen, setIsSubmissionsOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<DailyTask | null>(null)
  const [submissionsTaskId, setSubmissionsTaskId] = useState('')
  const [submissionsTaskTitle, setSubmissionsTaskTitle] = useState('')
  const [filters, setFilters] = useState<TaskFilters>({})
  const [currentPage, setCurrentPage] = useState(1)

  const queryClient = useQueryClient()
  const { toast } = useToast()

  // Convert UI filters to service filters
  const serviceFilters: TaskFilterOptions = {
    search: filters.search,
    subjectId: filters.subject,
    status: filters.status,
    dueDateBefore: filters.dueDate,
  }

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['tasks', serviceFilters],
    queryFn: () => taskService.getAll(serviceFilters),
  })

  const tasks = data?.data || []

  // Pagination
  const paginatedTasks = useMemo(() => {
    const startIdx = (currentPage - 1) * PAGINATION_LIMIT
    const endIdx = startIdx + PAGINATION_LIMIT
    return tasks.slice(startIdx, endIdx)
  }, [tasks, currentPage])

  // Stats
  const stats = useMemo(() => {
    return {
      total: tasks.length,
      pending: tasks.filter((t) => t.status === 'PENDING').length,
      completed: tasks.filter((t) => t.status === 'COMPLETED').length,
    }
  }, [tasks])

  // Count active filters
  const activeFilterCount = Object.values(filters).filter(Boolean).length

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data: any) =>
      taskService.create({
        ...data,
        createdBy: 'staff-1',
        assignedTo: ['student-1', 'student-2', 'student-3', 'student-4'],
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      setIsCreateOpen(false)
      toast({
        title: 'Success',
        description: 'Task created successfully',
      })
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create task',
        variant: 'destructive',
      })
    },
  })

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (data: any) => taskService.update(data.id, data.updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      setIsEditOpen(false)
      setSelectedTask(null)
      toast({
        title: 'Success',
        description: 'Task updated successfully',
      })
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update task',
        variant: 'destructive',
      })
    },
  })

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => taskService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      setIsDeleteOpen(false)
      setSelectedTask(null)
      setCurrentPage(1)
      toast({
        title: 'Success',
        description: 'Task deleted successfully',
      })
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete task',
        variant: 'destructive',
      })
    },
  })

  const handleCreate = async (data: any) => {
    await createMutation.mutateAsync(data)
  }

  const handleEdit = (task: DailyTask) => {
    setSelectedTask(task)
    setIsEditOpen(true)
  }

  const handleUpdate = async (data: any) => {
    if (!selectedTask) return
    await updateMutation.mutateAsync({
      id: selectedTask.id,
      updates: data,
    })
  }

  const handleDelete = (task: DailyTask) => {
    setSelectedTask(task)
    setIsDeleteOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!selectedTask) return
    await deleteMutation.mutateAsync(selectedTask.id)
  }

  const handleViewSubmissions = (taskId: string, taskTitle: string) => {
    setSubmissionsTaskId(taskId)
    setSubmissionsTaskTitle(taskTitle)
    setIsSubmissionsOpen(true)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Daily Tasks</h1>
          <p className="text-muted-foreground">Manage assignments and daily tasks</p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Task
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Tasks in total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">Awaiting completion</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completed}</div>
            <p className="text-xs text-muted-foreground">Tasks finished</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <TaskFilterBar
            filters={filters}
            onFiltersChange={setFilters}
            activeFilterCount={activeFilterCount}
          />
        </CardContent>
      </Card>

      {/* Tasks List */}
      <Card>
        <CardHeader>
          <CardTitle>
            All Tasks
            {activeFilterCount > 0 && (
              <span className="text-sm font-normal text-muted-foreground ml-2">
                ({tasks.length} result{tasks.length !== 1 ? 's' : ''})
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className=''>
          {isLoading ? (
            <TaskTableSkeleton />
          ) : error ? (
            <ErrorState
              title="Failed to load tasks"
              message="Could not load tasks. Please try again."
              onRetry={() => refetch()}
            />
          ) : tasks.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="No tasks found"
              description={
                activeFilterCount > 0
                  ? 'No tasks match your current filters'
                  : 'No tasks yet. Create one to get started!'
              }
            />
          ) : (
            <div className="space-y-3">
              {paginatedTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onViewSubmissions={handleViewSubmissions}
                  isDeleting={deleteMutation.isPending && selectedTask?.id === task.id}
                />  
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      <TaskDialog
        isOpen={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onSubmit={handleCreate}
        isLoading={createMutation.isPending}
      />

      {selectedTask && (
        <>
          <TaskDialog
            isOpen={isEditOpen}
            onOpenChange={setIsEditOpen}
            task={selectedTask}
            onSubmit={handleUpdate}
            isLoading={updateMutation.isPending}
          />

          <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Task?</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete "{selectedTask.title}"? This action cannot be undone.
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
        </>
      )}

      <TaskSubmissionsDialog
        isOpen={isSubmissionsOpen}
        onOpenChange={setIsSubmissionsOpen}
        taskId={submissionsTaskId}
        taskTitle={submissionsTaskTitle}
      />
    </div>
  )
}
