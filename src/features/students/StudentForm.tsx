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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DEPARTMENTS, SEMESTERS } from '@/constants'
import type { Student } from '@/types'
import { Loader2 } from 'lucide-react'

const studentSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 characters'),
  rollNumber: z.string().min(5, 'Roll number is required'),
  department: z.enum(['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL']),
  semester: z.enum(['1', '2', '3', '4', '5', '6', '7', '8']),
  parentId: z.string().optional(),
  academicYear: z.string().optional(),
})

type StudentFormValues = z.infer<typeof studentSchema>

interface StudentFormProps {
  student?: Student
  onSubmit: (data: Omit<Student, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
  isLoading?: boolean
  existingEmails?: string[]
  existingRollNumbers?: string[]
}

export function StudentForm({ 
  student, 
  onSubmit, 
  isLoading,
  existingEmails = [],
  existingRollNumbers = [],
}: StudentFormProps) {
  const form = useForm<StudentFormValues>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      firstName: student?.firstName || '',
      lastName: student?.lastName || '',
      email: student?.email || '',
      phone: student?.phone || '',
      rollNumber: student?.rollNumber || '',
      department: student?.department || 'CSE',
      semester: student?.semester || '1',
      parentId: student?.parentId || '',
      academicYear: student?.academicYear || new Date().getFullYear().toString(),
    },
  })

  const handleSubmit = async (data: StudentFormValues) => {
    // Validate email uniqueness
    if (existingEmails.includes(data.email)) {
      form.setError('email', {
        type: 'manual',
        message: 'This email is already in use',
      })
      return
    }

    // Validate roll number uniqueness
    if (existingRollNumbers.includes(data.rollNumber)) {
      form.setError('rollNumber', {
        type: 'manual',
        message: 'This roll number is already in use',
      })
      return
    }

    // Add required fields for Student type
    const studentData: Omit<Student, 'id' | 'createdAt' | 'updatedAt'> = {
      ...data,
      role: 'STUDENT' as const,
      password: 'defaultPassword123', // Would be generated/sent via email
      isActive: true,
      avatar: undefined,
      parentId: data.parentId || '', // Ensure parentId is always a string
      academicYear: data.academicYear || new Date().getFullYear().toString(), // Ensure academicYear is always a string
    }

    await onSubmit(studentData)
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="John" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="john.doe@college.edu" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input placeholder="+91 9876543210" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="rollNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Roll Number</FormLabel>
              <FormControl>
                <Input placeholder="CSE21001" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="department"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Department</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {DEPARTMENTS.map((dept) => (
                      <SelectItem key={dept.value} value={dept.value}>
                        {dept.label}
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
            name="semester"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Semester</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select semester" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {SEMESTERS.map((sem) => (
                      <SelectItem key={sem.value} value={sem.value}>
                        {sem.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {student ? 'Update Student' : 'Create Student'}
          </Button>
        </div>
      </form>
    </Form>
  )
}