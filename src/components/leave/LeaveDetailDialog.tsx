import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import type { Leave } from '@/types'

interface LeaveDetailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  leave: Leave
}

export function LeaveDetailDialog({
  open,
  onOpenChange,
  leave,
}: LeaveDetailDialogProps) {
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

  const timelineSteps = [
    {
      label: 'Applied',
      date: leave.createdAt,
      completed: true,
    },
    {
      label: 'Parent Confirmation',
      date: leave.parentConfirmedAt,
      completed: leave.parentConfirmation,
      status: leave.parentConfirmation ? '✓' : '⏳',
    },
    {
      label: 'Staff Review',
      date: leave.approvedAt,
      completed: leave.status === 'APPROVED' || leave.status === 'REJECTED',
      status: leave.status === 'APPROVED' ? '✓' : leave.status === 'REJECTED' ? '✗' : '⏳',
    },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Leave Request Details</DialogTitle>
          <DialogDescription>Full timeline and approval status</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Info */}
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Type</p>
                  <p className="font-medium">{leave.type} Leave</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge className={getStatusColor(leave.status)}>{leave.status}</Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">From Date</p>
                  <p className="font-medium">
                    {new Date(leave.fromDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">To Date</p>
                  <p className="font-medium">
                    {new Date(leave.toDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <Separator className="my-4" />
              <div>
                <p className="text-sm text-muted-foreground mb-2">Reason</p>
                <p className="text-sm">{leave.reason}</p>
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <div>
            <h4 className="font-semibold mb-4">Approval Timeline</h4>
            <div className="space-y-4">
              {timelineSteps.map((step, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        step.completed
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      {step.status || '✓'}
                    </div>
                    {idx < timelineSteps.length - 1 && (
                      <div
                        className={`w-0.5 h-8 ${
                          step.completed ? 'bg-green-100' : 'bg-gray-100'
                        }`}
                      />
                    )}
                  </div>
                  <div className="pt-1">
                    <p className="font-medium text-sm">{step.label}</p>
                    {step.date && (
                      <p className="text-xs text-muted-foreground">
                        {new Date(step.date).toLocaleDateString()} at{' '}
                        {new Date(step.date).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Remarks if rejected */}
          {leave.status === 'REJECTED' && leave.remarks && (
            <>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground mb-2">Rejection Reason</p>
                <p className="text-sm text-red-600">{leave.remarks}</p>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
