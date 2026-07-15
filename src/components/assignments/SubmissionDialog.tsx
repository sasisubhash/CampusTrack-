import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Upload, X, Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

const submissionSchema = z.object({
  fileName: z.string().min(1, 'File is required'),
  comment: z.string().max(500, 'Comment must be at most 500 characters').optional(),
})

type SubmissionFormValues = z.infer<typeof submissionSchema>

interface SubmissionDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  assignmentTitle: string
  onSubmit: (fileName: string, comment?: string) => Promise<void>
  isLoading?: boolean
}

export function SubmissionDialog({
  isOpen,
  onOpenChange,
  assignmentTitle,
  onSubmit,
  isLoading,
}: SubmissionDialogProps) {
  const [fileName, setFileName] = useState('')

  const form = useForm<SubmissionFormValues>({
    resolver: zodResolver(submissionSchema) as any,
    defaultValues: {
      fileName: '',
      comment: '',
    },
  })

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFileName(file.name)
      form.setValue('fileName', file.name)
    }
  }

  const handleSubmit = async (data: SubmissionFormValues) => {
    await onSubmit(data.fileName, data.comment)
    setFileName('')
    form.reset()
    onOpenChange(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Submit Assignment</DialogTitle>
          <DialogDescription>
            Submit your work for: {assignmentTitle}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="fileName"
              render={() => (
                <FormItem>
                  <FormLabel>Upload File *</FormLabel>
                  <div className="flex items-center gap-2">
                    <Input
                      type="file"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="submission-file"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('submission-file')?.click()}
                      className="w-full"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Choose File
                    </Button>
                  </div>
                  {fileName && (
                    <div className="flex items-center justify-between p-2 bg-muted rounded-md text-sm">
                      <span className="truncate">{fileName}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setFileName('')
                          form.setValue('fileName', '')
                        }}
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

            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comment (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add any additional notes or comments"
                      className="min-h-[80px] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-2 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading || !fileName}>
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Assignment'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
