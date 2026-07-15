import { useEffect } from 'react'
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
import type { CalendarEvent } from '@/types'

const createEventSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
  type: z.enum(['EXAM', 'WORKSHOP', 'HOLIDAY', 'MEETING', 'ASSIGNMENT_DEADLINE']),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  department: z.enum(['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL', '']).optional(),
  description: z.string().max(500, 'Description too long').optional(),
})

type CreateEventFormValues = z.infer<typeof createEventSchema>

interface CreateEventDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: Partial<CalendarEvent>) => Promise<void>
  prefilledDate?: Date | null
  isLoading?: boolean
}

export function CreateEventDialog({
  open,
  onOpenChange,
  onSubmit,
  prefilledDate,
  isLoading = false,
}: CreateEventDialogProps) {
  const form = useForm<CreateEventFormValues>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      title: '',
      type: 'MEETING',
      startDate: prefilledDate ? prefilledDate.toISOString().split('T')[0] : '',
      endDate: prefilledDate ? prefilledDate.toISOString().split('T')[0] : '',
      department: '',
      description: '',
    },
  })

  // Update prefilled date when it changes
  useEffect(() => {
    if (prefilledDate && open) {
      const dateStr = prefilledDate.toISOString().split('T')[0]
      form.setValue('startDate', dateStr)
      form.setValue('endDate', dateStr)
    }
  }, [prefilledDate, open, form])

  const handleSubmit = async (data: CreateEventFormValues) => {
    try {
      await onSubmit({
        title: data.title,
        type: data.type,
        startDate: data.startDate,
        endDate: data.endDate,
        department: (data.department || undefined) as any,
        description: data.description || undefined,
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
          <DialogTitle>Create Event</DialogTitle>
          <DialogDescription>Add a new event to the calendar</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title *</FormLabel>
                  <FormControl>
                    <Input placeholder="Event title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Type *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="EXAM">Exam</SelectItem>
                      <SelectItem value="WORKSHOP">Workshop</SelectItem>
                      <SelectItem value="HOLIDAY">Holiday</SelectItem>
                      <SelectItem value="MEETING">Meeting</SelectItem>
                      <SelectItem value="ASSIGNMENT_DEADLINE">Assignment Deadline</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date *</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date *</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="department"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department (Optional)</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || ''}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">None</SelectItem>
                      <SelectItem value="CSE">CSE</SelectItem>
                      <SelectItem value="ECE">ECE</SelectItem>
                      <SelectItem value="EEE">EEE</SelectItem>
                      <SelectItem value="MECH">MECH</SelectItem>
                      <SelectItem value="CIVIL">CIVIL</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Event description"
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
                    Creating...
                  </>
                ) : (
                  'Create Event'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
