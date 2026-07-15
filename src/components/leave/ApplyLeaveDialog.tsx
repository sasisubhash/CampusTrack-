import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Loader2 } from 'lucide-react'
import type { Leave } from '@/types'

const applyLeaveSchema = z.object({
  type: z.enum(['SICK', 'CASUAL', 'PERMISSION']),
  fromDate: z.string().min(1, 'From date is required'),
  toDate: z.string().min(1, 'To date is required'),
  reason: z.string().min(10, 'Reason must be at least 10 characters'),
})

type ApplyLeaveFormValues = z.infer<typeof applyLeaveSchema>

interface ApplyLeaveDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: Partial<Leave>) => Promise<void>
  isLoading?: boolean
}

export function ApplyLeaveDialog({
  open,
  onOpenChange,
  onSubmit,
  isLoading,
}: ApplyLeaveDialogProps) {
  const form = useForm<ApplyLeaveFormValues>({
    resolver: zodResolver(applyLeaveSchema),
    defaultValues: {
      type: 'SICK',
      fromDate: '',
      toDate: '',
      reason: '',
    },
  })

  const handleSubmit = async (data: ApplyLeaveFormValues) => {
    try {
      await onSubmit({
        type: data.type,
        fromDate: data.fromDate,
        toDate: data.toDate,
        reason: data.reason,
      })
      form.reset()
      onOpenChange(false)
    } catch (error) {
      console.error('Form submission error:', error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Apply for Leave</DialogTitle>
          <DialogDescription>
            Submit a new leave request for approval
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Leave Type *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="SICK">Sick Leave</SelectItem>
                      <SelectItem value="CASUAL">Casual Leave</SelectItem>
                      <SelectItem value="PERMISSION">Permission</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fromDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>From Date *</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="toDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>To Date *</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Explain your leave request"
                      className="min-h-[80px] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-2 justify-end pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Apply Leave'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
