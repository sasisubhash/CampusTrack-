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
import type { Announcement } from '@/types'

const editAnnouncementSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
  content: z.string().min(10, 'Content must be at least 10 characters').max(1000),
  type: z.enum(['COLLEGE', 'DEPARTMENT', 'EMERGENCY']),
  department: z.string().optional(),
})

type EditAnnouncementFormValues = z.infer<typeof editAnnouncementSchema>

interface AnnouncementDetailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  announcement: Announcement
  canEdit?: boolean
  onEdit?: (data: Partial<Announcement>) => Promise<void>
  onDelete?: () => void
}

function getTypeColor(type: string) {
  switch (type) {
    case 'EMERGENCY':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    case 'COLLEGE':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
    case 'DEPARTMENT':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
  }
}

export function AnnouncementDetailDialog({
  open,
  onOpenChange,
  announcement,
  canEdit = false,
  onEdit,
  onDelete,
}: AnnouncementDetailDialogProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editLoading, setEditLoading] = useState(false)

  const form = useForm<EditAnnouncementFormValues>({
    resolver: zodResolver(editAnnouncementSchema),
    defaultValues: {
      title: announcement.title,
      content: announcement.content,
      type: announcement.type,
      department: announcement.department || '',
    },
  })

  const handleEditSubmit = async (data: EditAnnouncementFormValues) => {
    if (!onEdit) return
    try {
      setEditLoading(true)
      await onEdit({
        title: data.title,
        content: data.content,
        type: data.type,
        department: (data.department || undefined) as any,
      })
      setIsEditing(false)
    } finally {
      setEditLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Announcement' : 'Announcement Details'}</DialogTitle>
          <DialogDescription>
            {new Date(announcement.createdAt).toLocaleDateString('en-US', {
              weekday: 'short',
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
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
                      <Input placeholder="Announcement title" {...field} />
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
                    <FormLabel>Type *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="COLLEGE">College-Wide</SelectItem>
                        <SelectItem value="DEPARTMENT">Department</SelectItem>
                        <SelectItem value="EMERGENCY">Emergency</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {form.watch('type') === 'DEPARTMENT' && (
                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || ''}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
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
              )}

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Announcement content"
                        className="min-h-[150px] resize-none"
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
            {/* Announcement Info */}
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Title</p>
                  <p className="font-bold text-lg">{announcement.title}</p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <Badge className={getTypeColor(announcement.type)}>
                    {announcement.type}
                  </Badge>
                  {announcement.department && (
                    <Badge variant="outline">{announcement.department}</Badge>
                  )}
                  <span className="text-xs text-muted-foreground">
                    {new Date(announcement.createdAt).toLocaleDateString('en-US', {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Content</p>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {announcement.content}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            {canEdit && (
              <div className="flex gap-2">
                <Button
                  onClick={() => setIsEditing(true)}
                  variant="outline"
                  className="flex-1"
                >
                  <Edit2 className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                {onDelete && (
                  <Button
                    onClick={onDelete}
                    variant="outline"
                    className="flex-1 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
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
