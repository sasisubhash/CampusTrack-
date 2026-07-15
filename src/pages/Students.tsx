import { useState, useMemo, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { ColumnDef } from '@tanstack/react-table'
import { Plus, MoreHorizontal, Eye, Edit, Trash2, UserCheck, UserX, ArrowUpDown, Download, Search, GraduationCap, Users, Building2, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { DataTable } from '@/components/common/DataTable'
import { EmptyState } from '@/components/common/EmptyState'
import { ErrorState } from '@/components/common/ErrorState'
import { StudentForm } from '@/features/students/StudentForm'
import { StudentFilterBar, type StudentFilters } from '@/components/students/StudentFilterBar'
import { BulkActionBar } from '@/components/users/BulkActionBar'
import { StudentCard } from '@/components/students/StudentCard'
import { StudentTableSkeleton } from '@/components/students/StudentTableSkeleton'
import { studentService } from '@/services/studentService'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/features/auth/AuthContext'
import { useNavigate } from 'react-router-dom'
import type { Student } from '@/types'
import { DEPARTMENTS } from '@/constants'

export default function StudentsPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [filters, setFilters] = useState<StudentFilters>({})
  const [searchQuery, setSearchQuery] = useState('')
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({})
  
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const { user: currentUser } = useAuth()
  const navigate = useNavigate()

  // Route guard - HOD and Staff only
  useEffect(() => {
    if (currentUser && currentUser.role !== 'HOD' && currentUser.role !== 'STAFF') {
      toast({
        title: 'Access Denied',
        description: 'You do not have permission to access this page',
        variant: 'destructive',
      })
      navigate('/dashboard')
    }
  }, [currentUser, navigate, toast])

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['students'],
    queryFn: () => studentService.getAll(),
  })

  const createMutation = useMutation({
    mutationFn: studentService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] })
      setIsCreateOpen(false)
      toast({
        title: 'Success',
        description: 'Student created successfully',
      })
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      })
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Student> }) =>
      studentService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] })
      setIsEditOpen(false)
      setSelectedStudent(null)
      toast({
        title: 'Success',
        description: 'Student updated successfully',
      })
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: studentService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] })
      setIsDeleteOpen(false)
      setSelectedStudent(null)
      toast({
        title: 'Success',
        description: 'Student deleted successfully',
      })
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      })
    },
  })

  const bulkDeleteMutation = useMutation({
    mutationFn: async (studentIds: string[]) => {
      await Promise.all(studentIds.map(id => studentService.delete(id)))
    },
    onSuccess: (_data, studentIds) => {
      queryClient.invalidateQueries({ queryKey: ['students'] })
      setIsBulkDeleteOpen(false)
      setRowSelection({})
      toast({
        title: 'Success',
        description: `${studentIds.length} students deleted successfully`,
      })
    },
  })

  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      studentService.toggleStatus(id, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] })
      toast({
        title: 'Success',
        description: 'Student status updated successfully',
      })
    },
  })

  const bulkStatusMutation = useMutation({
    mutationFn: async ({ studentIds, isActive }: { studentIds: string[]; isActive: boolean }) => {
      await Promise.all(studentIds.map(id => studentService.toggleStatus(id, isActive)))
    },
    onSuccess: (_data, { studentIds, isActive }) => {
      queryClient.invalidateQueries({ queryKey: ['students'] })
      setRowSelection({})
      toast({
        title: 'Success',
        description: `${studentIds.length} students ${isActive ? 'activated' : 'deactivated'} successfully`,
      })
    },
  })

  const students = data?.data || []

  // Filter and search logic
  const filteredStudents = useMemo(() => {
    let filtered = students

    // Apply search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(s =>
        `${s.firstName} ${s.lastName}`.toLowerCase().includes(query) ||
        s.rollNumber.toLowerCase().includes(query) ||
        s.email.toLowerCase().includes(query)
      )
    }

    // Apply filters
    if (filters.department) {
      filtered = filtered.filter(s => s.department === filters.department)
    }
    if (filters.semester) {
      filtered = filtered.filter(s => s.semester === filters.semester)
    }
    if (filters.status) {
      filtered = filtered.filter(s => s.isActive === (filters.status === 'active'))
    }

    return filtered
  }, [students, searchQuery, filters])

  // Stats calculation
  const stats = useMemo(() => {
    const total = students.length
    const active = students.filter(s => s.isActive).length
    const departmentCount = new Set(students.map(s => s.department)).size
    const avgAttendance = 85 // Mock data - would come from attendance service

    return { total, active, departmentCount, avgAttendance }
  }, [students])

  const selectedStudentIds = Object.keys(rowSelection).filter(k => rowSelection[k])
  const selectedCount = selectedStudentIds.length

  // Bulk actions
  const handleBulkActivate = () => {
    bulkStatusMutation.mutate({ studentIds: selectedStudentIds, isActive: true })
  }

  const handleBulkDeactivate = () => {
    bulkStatusMutation.mutate({ studentIds: selectedStudentIds, isActive: false })
  }

  const handleBulkDelete = () => {
    setIsBulkDeleteOpen(true)
  }

  const confirmBulkDelete = () => {
    bulkDeleteMutation.mutate(selectedStudentIds)
  }

  // Export to CSV
  const exportToCSV = () => {
    const headers = ['Name', 'Roll Number', 'Department', 'Semester', 'Email', 'Phone', 'Status']
    const rows = filteredStudents.map(s => [
      `"${s.firstName} ${s.lastName}"`,
      s.rollNumber,
      s.department,
      s.semester,
      s.email,
      s.phone,
      s.isActive ? 'Active' : 'Inactive',
    ])

    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `students-export-${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    toast({
      title: 'Export Complete',
      description: `Exported ${filteredStudents.length} students to CSV`,
    })
  }
  const departmentColors = {
    CSE: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    ECE: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    EEE: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    MECH: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    CIVIL: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
  }

  const columns: ColumnDef<Student>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'avatar',
      header: '',
      cell: ({ row }) => {
        const student = row.original
        return (
          <Avatar className="h-8 w-8">
            <AvatarImage src={student.avatar} />
            <AvatarFallback>
              {student.firstName[0]}{student.lastName[0]}
            </AvatarFallback>
          </Avatar>
        )
      },
      enableSorting: false,
    },
    {
      accessorKey: 'firstName',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const student = row.original
        return (
          <div>
            <div className="font-medium">
              {student.firstName} {student.lastName}
            </div>
            <div className="text-sm text-muted-foreground">{student.email}</div>
          </div>
        )
      },
    },
    {
      accessorKey: 'rollNumber',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Roll Number
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
    },
    {
      accessorKey: 'department',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Department
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const department = row.original.department
        return (
          <Badge className={departmentColors[department]} variant="secondary">
            {department}
          </Badge>
        )
      },
    },
    {
      accessorKey: 'semester',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Semester
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => (
        <Badge variant="outline">
          Sem {row.original.semester}
        </Badge>
      ),
    },
    {
      accessorKey: 'isActive',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Status
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const isActive = row.original.isActive
        return (
          <Badge variant={isActive ? 'default' : 'secondary'}>
            {isActive ? 'Active' : 'Inactive'}
          </Badge>
        )
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const student = row.original
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => {
                  setSelectedStudent(student)
                  setIsViewOpen(true)
                }}
              >
                <Eye className="mr-2 h-4 w-4" />
                View
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setSelectedStudent(student)
                  setIsEditOpen(true)
                }}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  toggleStatusMutation.mutate({
                    id: student.id,
                    isActive: !student.isActive,
                  })
                }}
              >
                {student.isActive ? (
                  <>
                    <UserX className="mr-2 h-4 w-4" />
                    Deactivate
                  </>
                ) : (
                  <>
                    <UserCheck className="mr-2 h-4 w-4" />
                    Activate
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => {
                  setSelectedStudent(student)
                  setIsDeleteOpen(true)
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]
  if (isLoading) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Student Management</h1>
          <p className="text-muted-foreground">
            Manage all students in the system
          </p>
        </div>
        <StudentTableSkeleton />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Student Management</h1>
          <p className="text-muted-foreground">
            Manage all students in the system
          </p>
        </div>
        <ErrorState
          message="Failed to load students. Please try again."
          onRetry={() => refetch()}
        />
      </div>
    )
  }

  const hasFiltersOrSearch = searchQuery.trim() || Object.values(filters).some(v => v)

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Student Management</h1>
          <p className="text-muted-foreground">
            Manage all students in the system
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportToCSV} disabled={filteredStudents.length === 0}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Button onClick={() => setIsCreateOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Student
          </Button>
        </div>
      </div>
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              Across all departments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active}</div>
            <p className="text-xs text-muted-foreground">
              Currently enrolled
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Departments</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.departmentCount}</div>
            <p className="text-xs text-muted-foreground">
              With enrolled students
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Attendance</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgAttendance}%</div>
            <p className="text-xs text-muted-foreground">
              This semester
            </p>
          </CardContent>
        </Card>
      </div>
      <StudentFilterBar
        filters={filters}
        onFiltersChange={setFilters}
        onClearFilters={() => setFilters({})}
      />

      <div className="relative flex items-center max-w-sm">
        <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, roll number, or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-8"
        />
      </div>

      {filteredStudents.length === 0 ? (
        <EmptyState
          icon={GraduationCap}
          title={hasFiltersOrSearch ? 'No students match your filters' : 'No students found'}
          description={
            hasFiltersOrSearch
              ? 'Try adjusting your search or filters'
              : 'Get started by adding your first student'
          }
          action={
            hasFiltersOrSearch
              ? {
                  label: 'Clear filters',
                  onClick: () => {
                    setFilters({})
                    setSearchQuery('')
                  },
                }
              : {
                  label: 'Add Student',
                  onClick: () => setIsCreateOpen(true),
                }
          }
        />
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block">
            <DataTable
              columns={columns}
              data={filteredStudents}
              rowSelection={rowSelection}
              onRowSelectionChange={setRowSelection}
            />
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-3">
            {filteredStudents.map((student) => (
              <StudentCard
                key={student.id}
                student={student}
                isSelected={rowSelection[student.id] || false}
                onSelect={(checked) => {
                  setRowSelection((prev) => ({
                    ...prev,
                    [student.id]: checked,
                  }))
                }}
                onClick={() => {
                  setSelectedStudent(student)
                  setIsViewOpen(true)
                }}
                onMenuClick={() => {
                  setSelectedStudent(student)
                  // Mobile menu would trigger here
                }}
              />
            ))}
          </div>
        </>
      )}
      {/* Bulk Action Bar */}
      <BulkActionBar
        selectedCount={selectedCount}
        onActivate={handleBulkActivate}
        onDeactivate={handleBulkDeactivate}
        onDelete={handleBulkDelete}
        onClearSelection={() => setRowSelection({})}
        isLoading={bulkStatusMutation.isPending || bulkDeleteMutation.isPending}
      />

      {/* Create Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Student</DialogTitle>
            <DialogDescription>
              Add a new student to the system
            </DialogDescription>
          </DialogHeader>
          <StudentForm
            onSubmit={async (data) => {
              await createMutation.mutateAsync(data)
            }}
            isLoading={createMutation.isPending}
            existingEmails={students.map(s => s.email)}
            existingRollNumbers={students.map(s => s.rollNumber)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Student</DialogTitle>
            <DialogDescription>
              Update student information
            </DialogDescription>
          </DialogHeader>
          {selectedStudent && (
            <StudentForm
              student={selectedStudent}
              onSubmit={async (data) => {
                // Convert form data to partial student update
                const updateData: Partial<Student> = {
                  firstName: data.firstName,
                  lastName: data.lastName,
                  email: data.email,
                  phone: data.phone,
                  rollNumber: data.rollNumber,
                  department: data.department,
                  semester: data.semester,
                  parentId: data.parentId,
                  academicYear: data.academicYear,
                }
                await updateMutation.mutateAsync({
                  id: selectedStudent.id,
                  data: updateData,
                })
              }}
              isLoading={updateMutation.isPending}
              existingEmails={students.filter(s => s.id !== selectedStudent.id).map(s => s.email)}
              existingRollNumbers={students.filter(s => s.id !== selectedStudent.id).map(s => s.rollNumber)}
            />
          )}
        </DialogContent>
      </Dialog>
      {/* View Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Student Details</DialogTitle>
          </DialogHeader>
          {selectedStudent && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={selectedStudent.avatar} />
                  <AvatarFallback className="text-2xl">
                    {selectedStudent.firstName[0]}{selectedStudent.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-2xl font-bold">
                    {selectedStudent.firstName} {selectedStudent.lastName}
                  </h3>
                  <p className="text-muted-foreground">{selectedStudent.email}</p>
                  <div className="flex gap-2 mt-2">
                    <Badge variant={selectedStudent.isActive ? 'default' : 'secondary'}>
                      {selectedStudent.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                    <Badge className={departmentColors[selectedStudent.department]} variant="secondary">
                      {selectedStudent.department}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Roll Number</p>
                  <p className="text-lg">{selectedStudent.rollNumber}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Phone</p>
                  <p className="text-lg">{selectedStudent.phone}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground">Department</p>
                  <p className="text-lg">{DEPARTMENTS.find(d => d.value === selectedStudent.department)?.label}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground">Semester</p>
                  <p className="text-lg">Semester {selectedStudent.semester}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground">Academic Year</p>
                  <p className="text-lg">{selectedStudent.academicYear || 'N/A'}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground">Attendance</p>
                  <p className="text-lg">85%</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground">Joined</p>
                  <p className="text-lg">
                    {new Date(selectedStudent.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
                  <p className="text-lg">
                    {new Date(selectedStudent.updatedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the student
              {selectedStudent && ` ${selectedStudent.firstName} ${selectedStudent.lastName}`}
              {' '}from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (selectedStudent) {
                  deleteMutation.mutate(selectedStudent.id)
                }
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Delete Confirmation */}
      <AlertDialog open={isBulkDeleteOpen} onOpenChange={setIsBulkDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {selectedCount} students?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the following students:
              <div className="mt-3 max-h-40 overflow-y-auto space-y-1">
                {selectedStudentIds.map((id) => {
                  const student = students.find((s) => s.id === id)
                  return student ? (
                    <div key={id} className="text-sm font-medium">
                      • {student.firstName} {student.lastName} ({student.rollNumber})
                    </div>
                  ) : null
                })}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmBulkDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete {selectedCount} Students
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}