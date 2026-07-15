import { useState } from 'react'
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
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Loader2 } from 'lucide-react'
import type { Leave } from '@/types'

interface ApproveRejectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  leave: Leave
  onApprove: () => void
  onReject: (remarks: string) => void
  isLoading?: boolean
}

export function ApproveRejectDialog({
  open,
  onOpenChange,
  leave,
  onApprove,
  onReject,
  isLoading,
}: ApproveRejectDialogProps) {
  const [activeTab, setActiveTab] = useState<'approve' | 'reject'>('approve')
  const [rejectRemarks, setRejectRemarks] = useState('')

  const handleReject = () => {
    onReject(rejectRemarks)
    setRejectRemarks('')
    setActiveTab('approve')
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Review Leave Request</AlertDialogTitle>
          <AlertDialogDescription>
            {leave.studentName} has requested {leave.type.toLowerCase()} leave from{' '}
            {new Date(leave.fromDate).toLocaleDateString()} to{' '}
            {new Date(leave.toDate).toLocaleDateString()}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'approve' | 'reject')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="approve">Approve</TabsTrigger>
            <TabsTrigger value="reject">Reject</TabsTrigger>
          </TabsList>

          <TabsContent value="approve" className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Click "Approve" to accept this leave request.
            </p>
          </TabsContent>

          <TabsContent value="reject" className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Reason for Rejection</label>
              <Textarea
                placeholder="Provide a reason for rejecting this leave request"
                value={rejectRemarks}
                onChange={(e) => setRejectRemarks(e.target.value)}
                className="min-h-[80px] resize-none"
              />
            </div>
          </TabsContent>
        </Tabs>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          {activeTab === 'approve' ? (
            <AlertDialogAction
              onClick={onApprove}
              disabled={isLoading}
              className="bg-green-600 hover:bg-green-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Approving...
                </>
              ) : (
                'Approve Leave'
              )}
            </AlertDialogAction>
          ) : (
            <AlertDialogAction
              onClick={handleReject}
              disabled={isLoading || !rejectRemarks.trim()}
              className="bg-red-600 hover:bg-red-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Rejecting...
                </>
              ) : (
                'Reject Leave'
              )}
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
