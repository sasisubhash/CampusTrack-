import { useState, useMemo } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Calendar, CheckCircle, Clock, XCircle, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
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
import { useAuth } from '@/features/auth/AuthContext'
import { useToast } from '@/hooks/use-toast'
import { EmptyState } from '@/components/common/EmptyState'
import { ApplyLeaveDialog } from '@/components/leave/ApplyLeaveDialog'
import { LeaveDetailDialog } from '@/components/leave/LeaveDetailDialog'
import { ApproveRejectDialog } from '@/components/leave/ApproveRejectDialog'
import { ParentConfirmDialog } from '@/components/leave/ParentConfirmDialog'
import type { Leave } from '@/types'

// Mock leave data
const mockLeaves: Leave[] = [
  {
    id: '1',
    studentId: 'stu-1',
    studentName: 'Rahul Kumar',
    type: 'SICK',
    fromDate: '2026-07-14',
    toDate: '2026-07-15',
    reason: 'Fever and cold',
    parentConfirmation: true,
    parentConfirmedAt: '2026-07-14T10:00:00',
    status: 'PENDING',
    createdAt: '2026-07-14T09:00:00',
  },
  {
    id: '2',
    studentId: 'stu-2',
    studentName: 'Priya Sharma',
    type: 'CASUAL',
    fromDate: '2026-07-16',
    toDate: '2026-07-16',
    reason: 'Family function',
    parentConfirmation: true,
    parentConfirmedAt: '2026-07-16T08:00:00',
    status: 'APPROVED',
    approvedBy: 'staff-1',
    approvedAt: '2026-07-16T11:00:00',
    createdAt: '2026-07-16T08:00:00',
  },
]

export default function LeavePage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const queryClient = useQueryClient()

  // Role checks
  const isStudent = user?.role === 'STUDENT'
  const isStaff = user?.role === 'STAFF' || user?.role === 'HOD'
  const isParent = user?.role === 'PARENT'
  const isHOD = user?.role === 'HOD'

  // State
  const [leaves, setLeaves] = useState<Leave[]>(mockLeaves)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<string>('')
  const [filterStatus, setFilterStatus] = useState<string>('')
  const [isApplyDialogOpen, setIsApplyDialogOpen] = useState(false)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false)
  const [isParentConfirmDialogOpen, setIsParentConfirmDialogOpen] = useState(false)
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false)
  const [selectedLeave, setSelectedLeave] = useState<Leave | null>(null)

  // Filter and search
  const filteredLeaves = useMemo(() => {
    let result = [...leaves]

    // For students, show only their leaves
    if (isStudent) {
      result = result.filter((l) => l.studentId === user?.id)
    }

    // Search by student name (for staff/hod)
    if (searchQuery.trim() && isStaff) {
      result = result.filter((l) =>
        (l.studentName || '').toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Filter by type
    if (filterType) {
      result = result.filter((l) => l.type === filterType)
    }

    // Filter by status
    if (filterStatus) {
      result = result.filter((l) => l.status === filterStatus)
    }

    return result
  }, [leaves, searchQuery, filterType, filterStatus, isStudent, isStaff, user?.id])

  // Stats
  const stats = useMemo(() => {
    return {
      total: filteredLeaves.length,
      approved: filteredLeaves.filter((l) => l.status === 'APPROVED').length,
      pending: filteredLeaves.filter((l) => l.status === 'PENDING').length,
      rejected: filteredLeaves.filter((l) => l.status === 'REJECTED').length,
    }
  }, [filteredLeaves])

  // Mutations
  const applyLeaveMutation = useMutation({
    mutationFn: async (data: Partial<Leave>) => {
      const newLeave: Leave = {
        ...data,
        id: `leave-${Date.now()}`,
        studentId: user?.id || 'student-1',
        studentName: `${user?.firstName || 'Student'} ${user?.lastName || ''}`,
        status: 'PENDING',
        parentConfirmation: false,
        createdAt: new Date().toISOString(),
      } as Leave
      setLeaves([...leaves, newLeave])
      return newLeave
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Leave request submitted successfully',
      })
      setIsApplyDialogOpen(false)
      queryClient.invalidateQueries({ queryKey: ['leaves'] })
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to submit leave request',
        variant: 'destructive',
      })
    },
  })

  const approveMutation = useMutation({
    mutationFn: async () => {
      if (!selectedLeave) return
      const updated = {
        ...selectedLeave,
        status: 'APPROVED' as const,
        approvedBy: user?.id || 'staff-1',
        approvedAt: new Date().toISOString(),
      }
      setLeaves(leaves.map((l) => (l.id === selectedLeave.id ? updated : l)))
      return updated
    },
    onSuccess: () => {
      toast({ title: 'Success', description: 'Leave approved' })
      setIsApproveDialogOpen(false)
      setSelectedLeave(null)
    },
  })

  const rejectMutation = useMutation({
    mutationFn: async (remarks: string) => {
      if (!selectedLeave) return
      const updated = {
        ...selectedLeave,
        status: 'REJECTED' as const,
        approvedBy: user?.id || 'staff-1',
        approvedAt: new Date().toISOString(),
        remarks,
      }
      setLeaves(leaves.map((l) => (l.id === selectedLeave.id ? updated : l)))
      return updated
    },
    onSuccess: () => {
      toast({ title: 'Success', description: 'Leave rejected' })
      setIsApproveDialogOpen(false)
      setSelectedLeave(null)
    },
  })

  const cancelMutation = useMutation({
    mutationFn: async () => {
      if (!selectedLeave) return
      setLeaves(leaves.filter((l) => l.id !== selectedLeave.id))
      return selectedLeave
    },
    onSuccess: () => {
      toast({ title: 'Success', description: 'Leave request cancelled' })
      setIsCancelDialogOpen(false)
      setSelectedLeave(null)
    },
  })

  const parentConfirmMutation = useMutation({
    mutationFn: async (confirmed: boolean) => {
      if (!selectedLeave) return
      const updated = {
        ...selectedLeave,
        parentConfirmation: confirmed,
        parentConfirmedAt: new Date().toISOString(),
      }
      setLeaves(leaves.map((l) => (l.id === selectedLeave.id ? updated : l)))
      return updated
    },
    onSuccess: (_, confirmed) => {
      toast({
        title: 'Success',
        description: confirmed ? 'Leave confirmed' : 'Leave declined',
      })
      setIsParentConfirmDialogOpen(false)
      setSelectedLeave(null)
    },
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'REJECTED':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  const getPageSubtitle = () => {
    if (isStudent) return 'Apply and track your leave requests'
    if (isStaff) return 'Review and approve student leave requests'
    if (isParent) return 'Confirm or decline your child\'s leave requests'
    return 'View all leave activity across the college'
  }

  const handleLeaveClick = (leave: Leave) => {
    setSelectedLeave(leave)
    setIsDetailDialogOpen(true)
  }

  const handleApprove = (leave: Leave) => {
    setSelectedLeave(leave)
    setIsApproveDialogOpen(true)
  }

  const handleCancel = (leave: Leave) => {
    setSelectedLeave(leave)
    setIsCancelDialogOpen(true)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Leave Management</h1>
          <p className="text-muted-foreground">{getPageSubtitle()}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            Leave Calendar
          </Button>
          {isStudent && (
            <Button onClick={() => setIsApplyDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Apply Leave
            </Button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.pending}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      {(isStaff || filteredLeaves.length > 0) && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex gap-2 flex-wrap">
                {isStaff && (
                  <Input
                    placeholder="Search by student name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="max-w-sm"
                  />
                )}
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-3 py-2 border rounded-md bg-background text-foreground"
                >
                  <option value="">All Types</option>
                  <option value="SICK">Sick</option>
                  <option value="CASUAL">Casual</option>
                  <option value="PERMISSION">Permission</option>
                </select>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border rounded-md bg-background text-foreground"
                >
                  <option value="">All Status</option>
                  <option value="PENDING">Pending</option>
                  <option value="APPROVED">Approved</option>
                  <option value="REJECTED">Rejected</option>
                </select>
                {(searchQuery || filterType || filterStatus) && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSearchQuery('')
                      setFilterType('')
                      setFilterStatus('')
                    }}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Clear
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Leave Requests */}
      <Card>
        <CardHeader>
          <CardTitle>
            Leave Requests
            {(searchQuery || filterType || filterStatus) && (
              <span className="text-sm font-normal text-muted-foreground ml-2">
                ({filteredLeaves.length} result{filteredLeaves.length !== 1 ? 's' : ''})
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredLeaves.length === 0 ? (
            <EmptyState
              icon={Calendar}
              title="No leave requests found"
              description={
                searchQuery || filterType || filterStatus
                  ? 'Try adjusting your filters'
                  : isStudent
                    ? 'You haven\'t applied for leave yet'
                    : 'No pending leave requests'
              }
            />
          ) : (
            <div className="space-y-4">
              {filteredLeaves.map((leave) => (
                <div
                  key={leave.id}
                  onClick={() => handleLeaveClick(leave)}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{leave.type} Leave</h4>
                      <Badge variant="outline">{leave.type}</Badge>
                    </div>
                    {(isStaff || isHOD) && (
                      <p className="text-sm font-medium text-muted-foreground">
                        {leave.studentName || 'Student'}
                      </p>
                    )}
                    <p className="text-sm text-muted-foreground">{leave.reason}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(leave.fromDate).toLocaleDateString()} -{' '}
                      {new Date(leave.toDate).toLocaleDateString()}
                    </p>
                    <div className="flex gap-2 flex-wrap pt-1">
                      {leave.parentConfirmation && (
                        <Badge variant="secondary" className="text-xs">
                          ✓ Parent Confirmed
                        </Badge>
                      )}
                      {leave.status === 'PENDING' && !leave.parentConfirmation && (
                        <Badge variant="secondary" className="text-xs text-orange-700">
                          Awaiting Parent Confirmation
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {/* Staff/HOD: Approve/Reject buttons */}
                    {isStaff && leave.status === 'PENDING' && leave.parentConfirmation && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleApprove(leave)
                          }}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedLeave(leave)
                            setIsApproveDialogOpen(true)
                          }}
                          className="text-red-600"
                        >
                          Reject
                        </Button>
                      </div>
                    )}

                    {/* Parent: Confirm/Decline buttons (only for pending requests without confirmation) */}
                    {isParent && leave.status === 'PENDING' && !leave.parentConfirmation && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedLeave(leave)
                            setIsParentConfirmDialogOpen(true)
                          }}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Confirm
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation()
                            parentConfirmMutation.mutate(false)
                          }}
                          className="text-red-600"
                        >
                          Decline
                        </Button>
                      </div>
                    )}

                    {/* Student: Cancel button (only on pending) */}
                    {isStudent && leave.status === 'PENDING' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleCancel(leave)
                        }}
                        className="text-red-600"
                      >
                        Cancel
                      </Button>
                    )}

                    {/* Status badge */}
                    <Badge className={getStatusColor(leave.status)} variant="secondary">
                      {leave.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      <ApplyLeaveDialog
        open={isApplyDialogOpen}
        onOpenChange={setIsApplyDialogOpen}
        onSubmit={async (data) => {
          await applyLeaveMutation.mutateAsync(data)
        }}
        isLoading={applyLeaveMutation.isPending}
      />

      {selectedLeave && (
        <>
          <LeaveDetailDialog
            open={isDetailDialogOpen}
            onOpenChange={setIsDetailDialogOpen}
            leave={selectedLeave}
          />

          <ApproveRejectDialog
            open={isApproveDialogOpen}
            onOpenChange={setIsApproveDialogOpen}
            leave={selectedLeave}
            onApprove={() => approveMutation.mutate()}
            onReject={(remarks) => rejectMutation.mutate(remarks)}
            isLoading={approveMutation.isPending || rejectMutation.isPending}
          />

          {isParent && (
            <ParentConfirmDialog
              open={isParentConfirmDialogOpen}
              onOpenChange={setIsParentConfirmDialogOpen}
              leave={selectedLeave}
              onConfirm={() => parentConfirmMutation.mutate(true)}
              onDecline={() => parentConfirmMutation.mutate(false)}
              isLoading={parentConfirmMutation.isPending}
            />
          )}

          <AlertDialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Cancel Leave Request?</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to cancel this leave request? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Keep Request</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => cancelMutation.mutate()}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {cancelMutation.isPending ? 'Cancelling...' : 'Cancel Request'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}
    </div>
  )
}
