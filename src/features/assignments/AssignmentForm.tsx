import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, Upload, X } from 'lucide-react'
import type { Assignment } from '@/types'
import { mockSubjects } from '@/data/mockData'

const assignmentSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(150, 'Title must be at most 150 characters'),
  subjectId: z.string().min(1, 'Subject is required'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(2000, 'Description must be at most 2000 characters'),
  dueDate: z.string().min(1, 'Due date is required'),
  maxMarks: z.coerce.number().min(1, 'Max marks must be at least 1').max(1000, 'Max marks cannot exceed 1000'),
  attachmentName: z.string().optional(),
})

type AssignmentFormValues = z.infer<typeof assignmentSchema>

interface AssignmentFormProps {
  assignment?: Assignment
  onSubmit: (data: Omit<Assignment, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'assignedTo'> & { attachmentName?: string }) => Promise<void>
  isLoading?: boolean
}

export function AssignmentForm({ assignment, onSubmit, isLoading }: AssignmentFormProps) {
  const form = useForm<AssignmentFormValues>({
    resolver: zodResolver(assignmentSchema) as any,
    defaultValues: {
      title: assignment?.title || '',
      subjectId: assignment?.subjectId || '',
      description: assignment?.description || '',
      dueDate: assignment?.dueDate?.split('T')[0] || '',
      maxMarks: assignment?.maxMarks || 100,
      attachmentName: '',
    },
  })

  const handleSubmit = async (data: AssignmentFormValues) => {
    try {
      await onSubmit({
        title: data.title,
        subjectId: data.subjectId,
        description: data.description,
        dueDate: new Date(data.dueDate).toISOString(),
        maxMarks: data.maxMarks,
        attachments: data.attachmentName ? [data.attachmentName] : undefined,
      } as any)
    } catch (error) {
      console.error('Form submission error:', error)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      form.setValue('attachmentName', file.name)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Assignment Title *</FormLabel>
              <FormControl>
                <Input placeholder="Enter assignment title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="subjectId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subject *</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a subject" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {mockSubjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.name}
                    </SelectItem>
                  ))}
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
              <FormLabel>Description *</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter assignment description and requirements"
                  className="min-h-[100px] resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Due Date *</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="maxMarks"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Max Marks *</FormLabel>
                <FormControl>
                  <Input type="number" min="1" max="1000" placeholder="100" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="attachmentName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Attachment (Optional)</FormLabel>
              <div className="flex items-center gap-2">
                <Input
                  type="file"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-input"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById('file-input')?.click()}
                  className="w-full"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Choose File
                </Button>
              </div>
              {field.value && (
                <div className="flex items-center justify-between p-2 bg-muted rounded-md text-sm">
                  <span className="truncate">{field.value}</span>
                  <button
                    type="button"
                    onClick={() => form.setValue('attachmentName', '')}
                    className="text-destructive hover:text-destructive/80"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-2 justify-end">
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {assignment ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              <>{assignment ? 'Update Assignment' : 'Create Assignment'}</>
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}
