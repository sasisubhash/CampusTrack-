import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2, Edit2, Trash2 } from 'lucide-react'
import type { CalendarEvent } from '@/types'

const editEventSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
  type: z.enum(['EXAM', 'WORKSHOP', 'HOLIDAY', 'MEETING', 'ASSIGNMENT_DEADLINE']),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  department: z.enum(['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL', '']).optional(),
  description: z.string().max(500, 'Description too long').optional(),
})

type EditEventFormValues = z.infer<typeof editEventSchema>

interface EventDetailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  event: CalendarEvent
  onEdit?: (data: Partial<CalendarEvent>) => Promise<void>
  onDelete?: () => void
}

function getEventTypeColor(type: string) {
  switch (type) {
    case 'EXAM':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    case 'WORKSHOP':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
    case 'HOLIDAY':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
    case 'MEETING':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
    case 'ASSIGNMENT_DEADLINE':
      return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
  }
}

export function EventDetailDialog({
  open,
  onOpenChange,
  event,
  onEdit,
  onDelete,
}: EventDetailDialogProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editLoading, setEditLoading] = useState(false)

  const form = useForm<EditEventFormValues>({
    resolver: zodResolver(editEventSchema),
    defaultValues: {
      title: event.title,
      type: event.type,
      startDate: event.startDate,
      endDate: event.endDate,
      department: event.department || '',
      description: event.description || '',
    },
  })

  const handleEditSubmit = async (data: EditEventFormValues) => {
    if (!onEdit) return
    try {
      setEditLoading(true)
      await onEdit({
        title: data.title,
        type: data.type,
        startDate: data.startDate,
        endDate: data.endDate,
        department: (data.department || undefined) as any,
        description: data.description || undefined,
      })
      setIsEditing(false)
    } finally {
      setEditLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Event' : 'Event Details'}</DialogTitle>
          <DialogDescription>
            {event.startDate === event.endDate
              ? new Date(event.startDate).toLocaleDateString()
              : `${new Date(event.startDate).toLocaleDateString()} - ${new Date(
                  event.endDate
                ).toLocaleDateString()}`}
          </DialogDescription>
        </DialogHeader>

        {isEditing ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleEditSubmit)} className="space-y-4">
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

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                  disabled={editLoading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={editLoading}>
                  {editLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        ) : (
          <div className="space-y-6">
            {/* Event Info */}
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Title</p>
                  <p className="font-medium text-lg">{event.title}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Type</p>
                    <Badge className={getEventTypeColor(event.type)}>
                      {event.type.replace(/_/g, ' ')}
                    </Badge>
                  </div>
                  {event.department && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Department</p>
                      <Badge variant="outline">{event.department}</Badge>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Start Date</p>
                    <p className="font-medium">
                      {new Date(event.startDate).toLocaleDateString('en-US', {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">End Date</p>
                    <p className="font-medium">
                      {new Date(event.endDate).toLocaleDateString('en-US', {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>

                {event.description && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Description</p>
                    <p className="text-sm">{event.description}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Actions */}
            {(onEdit || onDelete) && (
              <div className="flex gap-2">
                {onEdit && (
                  <Button
                    onClick={() => setIsEditing(true)}
                    variant="outline"
                    className="flex-1"
                  >
                    <Edit2 className="h-4 w-4 mr-2" />
                    Edit Event
                  </Button>
                )}
                {onDelete && (
                  <Button
                    onClick={onDelete}
                    variant="outline"
                    className="flex-1 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Event
                  </Button>
                )}
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
