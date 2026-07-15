import { useState, useMemo, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { ColumnDef } from '@tanstack/react-table'
import { Plus, MoreHorizontal, Eye, Edit, Trash2, UserCheck, UserX, KeyRound, ArrowUpDown, Download, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
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
import { UserForm } from '@/features/users/UserForm'
import { FilterBar, type UserFilters } from '@/components/users/FilterBar'
import { BulkActionBar } from '@/components/users/BulkActionBar'
import { UserCard } from '@/components/users/UserCard'
import { ResetPasswordDialog } from '@/components/users/ResetPasswordDialog'
import { UserTableSkeleton } from '@/components/users/UserTableSkeleton'
import { userService } from '@/services/userService'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/features/auth/AuthContext'
import { useNavigate } from 'react-router-dom'
import type { User } from '@/types'
import { Users as UsersIcon } from 'lucide-react'

export default function UsersPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false)
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [filters, setFilters] = useState<UserFilters>({})
  const [searchQuery, setSearchQuery] = useState('')
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({})
  
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const { user: currentUser } = useAuth()
  const navigate = useNavigate()

  // Route guard - HOD only
  useEffect(() => {
    if (currentUser && currentUser.role !== 'HOD') {
      toast({
        title: 'Access Denied',
        description: 'You do not have permission to access this page',
        variant: 'destructive',
      })
      navigate('/dashboard')
    }
  }, [currentUser, navigate, toast])

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['users'],
    queryFn: () => userService.getAll(),
  })

  const createMutation = useMutation({
    mutationFn: userService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      setIsCreateOpen(false)
      toast({
        title: 'Success',
        description: 'User created successfully',
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
    mutationFn: ({ id, data }: { id: string; data: Partial<User> }) =>
      userService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      setIsEditOpen(false)
      setSelectedUser(null)
      toast({
        title: 'Success',
        description: 'User updated successfully',
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
    mutationFn: userService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      setIsDeleteOpen(false)
      setSelectedUser(null)
      toast({
        title: 'Success',
        description: 'User deleted successfully',
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
    mutationFn: async (userIds: string[]) => {
      await Promise.all(userIds.map(id => userService.delete(id)))
    },
    onSuccess: (_data, userIds) => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      setIsBulkDeleteOpen(false)
      setRowSelection({})
      toast({
        title: 'Success',
        description: `${userIds.length} users deleted successfully`,
      })
    },
  })

  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      userService.toggleStatus(id, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast({
        title: 'Success',
        description: 'User status updated successfully',
      })
    },
  })

  const bulkStatusMutation = useMutation({
    mutationFn: async ({ userIds, isActive }: { userIds: string[]; isActive: boolean }) => {
      await Promise.all(userIds.map(id => userService.toggleStatus(id, isActive)))
    },
    onSuccess: (_data, { userIds, isActive }) => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      setRowSelection({})
      toast({
        title: 'Success',
        description: `${userIds.length} users ${isActive ? 'activated' : 'deactivated'} successfully`,
      })
    },
  })

  const resetPasswordMutation = useMutation({
    mutationFn: userService.resetPassword,
    onSuccess: () => {
      setIsResetPasswordOpen(false)
      setSelectedUser(null)
      toast({
        title: 'Success',
        description: 'Password reset email sent successfully',
      })
    },
  })

  const users = data?.data?.data || []

  // Filter and search logic
  const filteredUsers = useMemo(() => {
    let filtered = users

    // Apply search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(u =>
        `${u.firstName} ${u.lastName}`.toLowerCase().includes(query) ||
        u.email.toLowerCase().includes(query) ||
        u.phone.toLowerCase().includes(query)
      )
    }

    // Apply filters
    if (filters.role) {
      filtered = filtered.filter(u => u.role === filters.role)
    }
    if (filters.status) {
      filtered = filtered.filter(u => u.isActive === (filters.status === 'active'))
    }
    if (filters.department) {
      filtered = filtered.filter(u => (u as any).department === filters.department)
    }
    if (filters.semester) {
      filtered = filtered.filter(u => (u as any).semester === filters.semester)
    }

    return filtered
  }, [users, searchQuery, filters])

  const selectedUserIds = Object.keys(rowSelection).filter(k => rowSelection[k])
  const selectedCount = selectedUserIds.length

  // Bulk actions
  const handleBulkActivate = () => {
    bulkStatusMutation.mutate({ userIds: selectedUserIds, isActive: true })
  }

  const handleBulkDeactivate = () => {
    bulkStatusMutation.mutate({ userIds: selectedUserIds, isActive: false })
  }

  const handleBulkDelete = () => {
    setIsBulkDeleteOpen(true)
  }

  const confirmBulkDelete = () => {
    bulkDeleteMutation.mutate(selectedUserIds)
  }

  // Export to CSV
  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Role', 'Phone', 'Status', 'Department', 'Employee ID', 'Roll Number']
    const rows = filteredUsers.map(u => [
      `"${u.firstName} ${u.lastName}"`,
      u.email,
      u.role,
      u.phone,
      u.isActive ? 'Active' : 'Inactive',
      (u as any).department || 'N/A',
      (u as any).employeeId || 'N/A',
      (u as any).rollNumber || 'N/A',
    ])

    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `users-export-${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    toast({
      title: 'Export Complete',
      description: `Exported ${filteredUsers.length} users to CSV`,
    })
  }

  const roleColors = {
    HOD: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    STAFF: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    STUDENT: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    PARENT: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
  }

  const columns: ColumnDef<User>[] = [
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
        const user = row.original
        return (
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatar} />
            <AvatarFallback>
              {user.firstName[0]}{user.lastName[0]}
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
        const user = row.original
        return (
          <div>
            <div className="font-medium">
              {user.firstName} {user.lastName}
            </div>
            <div className="text-sm text-muted-foreground">{user.email}</div>
          </div>
        )
      },
    },
    {
      accessorKey: 'role',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Role
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const role = row.original.role
        return (
          <Badge className={roleColors[role]} variant="secondary">
            {role}
          </Badge>
        )
      },
    },
    {
      accessorKey: 'phone',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Phone
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
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
        const user = row.original
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
                  setSelectedUser(user)
                  setIsViewOpen(true)
                }}
              >
                <Eye className="mr-2 h-4 w-4" />
                View
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setSelectedUser(user)
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
                    id: user.id,
                    isActive: !user.isActive,
                  })
                }}
              >
                {user.isActive ? (
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
              <DropdownMenuItem
                onClick={() => {
                  setSelectedUser(user)
                  setIsResetPasswordOpen(true)
                }}
              >
                <KeyRound className="mr-2 h-4 w-4" />
                Reset Password
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => {
                  setSelectedUser(user)
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
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">
            Manage all users across the system
          </p>
        </div>
        <UserTableSkeleton />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">
            Manage all users across the system
          </p>
        </div>
        <ErrorState
          message="Failed to load users. Please try again."
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
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">
            Manage all users across the system
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportToCSV} disabled={filteredUsers.length === 0}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Button onClick={() => setIsCreateOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </div>
      </div>

      <FilterBar
        filters={filters}
        onFiltersChange={setFilters}
        onClearFilters={() => setFilters({})}
      />

      <div className="relative flex items-center max-w-sm">
        <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, email, or phone..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-8"
        />
      </div>

      {filteredUsers.length === 0 ? (
        <EmptyState
          icon={UsersIcon}
          title={hasFiltersOrSearch ? 'No users match your filters' : 'No users found'}
          description={
            hasFiltersOrSearch
              ? 'Try adjusting your search or filters'
              : 'Get started by creating your first user'
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
                  label: 'Add User',
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
              data={filteredUsers}
              rowSelection={rowSelection}
              onRowSelectionChange={setRowSelection}
            />
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-3">
            {filteredUsers.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                isSelected={rowSelection[user.id] || false}
                onSelect={(checked) => {
                  setRowSelection((prev) => ({
                    ...prev,
                    [user.id]: checked,
                  }))
                }}
                onMenuClick={() => {
                  setSelectedUser(user)
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
            <DialogTitle>Create New User</DialogTitle>
            <DialogDescription>
              Add a new user to the system
            </DialogDescription>
          </DialogHeader>
          <UserForm
            onSubmit={async (data) => {
              await createMutation.mutateAsync(data)
            }}
            isLoading={createMutation.isPending}
            existingEmails={users.map(u => u.email)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <UserForm
              user={selectedUser}
              onSubmit={async (data) => {
                await updateMutation.mutateAsync({
                  id: selectedUser.id,
                  data,
                })
              }}
              isLoading={updateMutation.isPending}
              existingEmails={users.filter(u => u.id !== selectedUser.id).map(u => u.email)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Enhanced View Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={selectedUser.avatar} />
                  <AvatarFallback className="text-2xl">
                    {selectedUser.firstName[0]}{selectedUser.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-2xl font-bold">
                    {selectedUser.firstName} {selectedUser.lastName}
                  </h3>
                  <p className="text-muted-foreground">{selectedUser.email}</p>
                  <Badge variant={selectedUser.isActive ? 'default' : 'secondary'} className="mt-1">
                    {selectedUser.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Role</p>
                  <Badge className={roleColors[selectedUser.role]} variant="secondary">
                    {selectedUser.role}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Phone</p>
                  <p className="text-lg">{selectedUser.phone}</p>
                </div>

                {(selectedUser.role === 'HOD' || selectedUser.role === 'STAFF' || selectedUser.role === 'STUDENT') && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Department</p>
                    <p className="text-lg">{(selectedUser as any).department || 'N/A'}</p>
                  </div>
                )}

                {(selectedUser.role === 'HOD' || selectedUser.role === 'STAFF') && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Employee ID</p>
                    <p className="text-lg">{(selectedUser as any).employeeId || 'N/A'}</p>
                  </div>
                )}

                {selectedUser.role === 'STUDENT' && (
                  <>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Roll Number</p>
                      <p className="text-lg">{(selectedUser as any).rollNumber || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Semester</p>
                      <p className="text-lg">{(selectedUser as any).semester || 'N/A'}</p>
                    </div>
                  </>
                )}

                {selectedUser.role === 'PARENT' && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Linked Children</p>
                    <p className="text-lg">
                      {(selectedUser as any).childrenIds?.length || 0} student(s)
                    </p>
                  </div>
                )}

                <div>
                  <p className="text-sm font-medium text-muted-foreground">Joined</p>
                  <p className="text-lg">
                    {new Date(selectedUser.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
                  <p className="text-lg">
                    {new Date(selectedUser.updatedAt).toLocaleDateString('en-US', {
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
              This action cannot be undone. This will permanently delete the user
              {selectedUser && ` ${selectedUser.firstName} ${selectedUser.lastName}`}
              {' '}from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (selectedUser) {
                  deleteMutation.mutate(selectedUser.id)
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
            <AlertDialogTitle>Delete {selectedCount} users?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the following users:
              <div className="mt-3 max-h-40 overflow-y-auto space-y-1">
                {selectedUserIds.map((id) => {
                  const user = users.find((u) => u.id === id)
                  return user ? (
                    <div key={id} className="text-sm font-medium">
                      • {user.firstName} {user.lastName} ({user.email})
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
              Delete {selectedCount} Users
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reset Password Dialog */}
      <ResetPasswordDialog
        open={isResetPasswordOpen}
        onOpenChange={setIsResetPasswordOpen}
        user={selectedUser}
        onConfirm={async () => {
          if (selectedUser) {
            await resetPasswordMutation.mutateAsync(selectedUser.id)
          }
        }}
      />
    </div>
  )
}
