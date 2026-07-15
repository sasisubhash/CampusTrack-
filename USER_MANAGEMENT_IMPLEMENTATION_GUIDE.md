# User Management - Complete Implementation Guide

## ✅ Components Created:

1. **FilterBar.tsx** - Multi-filter component with Role, Status, Department, Semester
2. **BulkActionBar.tsx** - Floating action bar for bulk operations  
3. **UserCard.tsx** - Mobile-responsive card view
4. **ResetPasswordDialog.tsx** - Password reset confirmation
5. **UserTableSkeleton.tsx** - Loading state skeleton
6. **skeleton.tsx** - Base skeleton UI component

## 🔄 Next Steps - Users.tsx Complete Rewrite Required

The current Users.tsx needs extensive modifications. Given the file size, here's the approach:

### Key Changes Needed:

1. **State Management:**
```typescript
// Add these states
const [filters, setFilters] = useState<UserFilters>({})
const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({})
const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false)
const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false)
const [searchQuery, setSearchQuery] = useState('')
```

2. **Filter Logic:**
```typescript
const filteredUsers = useMemo(() => {
  let filtered = users
  
  // Apply search
  if (searchQuery) {
    filtered = filtered.filter(u => 
      `${u.firstName} ${u.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }
  
  // Apply filters
  if (filters.role) {
    filtered = filtered.filter(u => u.role === filters.role)
  }
  if (filters.status) {
    filtered = filtered.filter(u => 
      u.isActive === (filters.status === 'active')
    )
  }
  if (filters.department) {
    filtered = filtered.filter(u => 
      (u as any).department === filters.department
    )
  }
  if (filters.semester) {
    filtered = filtered.filter(u => 
      (u as any).semester === filters.semester
    )
  }
  
  return filtered
}, [users, searchQuery, filters])
```

3. **Bulk Actions:**
```typescript
const selectedUserIds = Object.keys(rowSelection).filter(k => rowSelection[k])
const selectedCount = selectedUserIds.length

const handleBulkActivate = async () => {
  // API calls for each selected user
  await Promise.all(
    selectedUserIds.map(id => 
      toggleStatusMutation.mutateAsync({ id, isActive: true })
    )
  )
  setRowSelection({})
  toast({ title: `${selectedCount} users activated` })
}
```

4. **Export Function:**
```typescript
const exportToCSV = () => {
  const headers = ['Name', 'Email', 'Role', 'Phone', 'Status', 'Department']
  const rows = filteredUsers.map(u => [
    `"${u.firstName} ${u.lastName}"`,
    u.email,
    u.role,
    u.phone,
    u.isActive ? 'Active' : 'Inactive',
    (u as any).department || 'N/A'
  ])
  
  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `users-export-${new Date().toISOString().split('T')[0]}.csv`
  link.click()
}
```

5. **Column Definitions with Checkboxes:**
```typescript
const columns: ColumnDef<User>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
      />
    ),
  },
  // ... rest of columns with sorting
]
```

6. **Sortable Columns:**
```typescript
{
  accessorKey: 'role',
  header: ({ column }) => (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
    >
      Role
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  ),
}
```

7. **Mobile View:**
```typescript
{/* Mobile Card View */}
<div className="md:hidden space-y-3">
  {filteredUsers.map(user => (
    <UserCard
      key={user.id}
      user={user}
      isSelected={rowSelection[user.id] || false}
      onSelect={(checked) => {
        setRowSelection(prev => ({
          ...prev,
          [user.id]: checked
        }))
      }}
      onMenuClick={() => {
        setSelectedUser(user)
        // open dropdown
      }}
    />
  ))}
</div>
```

8. **Enhanced View Dialog:**
```typescript
<Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
    <DialogHeader>
      <DialogTitle>User Details</DialogTitle>
    </DialogHeader>
    {selectedUser && (
      <div className="space-y-6">
        {/* Avatar and basic info */}
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

        {/* Details grid */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Role</p>
            <p className="text-lg">{selectedUser.role}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Phone</p>
            <p className="text-lg">{selectedUser.phone}</p>
          </div>
          
          {/* Conditional fields based on role */}
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
          
          <div>
            <p className="text-sm font-medium text-muted-foreground">Joined</p>
            <p className="text-lg">
              {new Date(selectedUser.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
            <p className="text-lg">
              {new Date(selectedUser.updatedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        </div>
      </div>
    )}
  </DialogContent>
</Dialog>
```

## File Size Issue:

The complete Users.tsx with all enhancements will be ~800+ lines. Given the constraints, I recommend:

**Option 1:** I create the file in multiple chunks using fs_write + fs_append
**Option 2:** I provide you with the complete code and you manually replace the file
**Option 3:** I create a new Users_v2.tsx and you can swap it in

Which approach would you prefer?

## Also Needed:

1. **UserForm validation enhancement** - Add duplicate email check
2. **Route guard** - Add role check at component level
3. **DataTable enhancement** - Enable row selection support

## Testing Checklist:

- [ ] Filters work individually and in combination
- [ ] Search works with filters
- [ ] Clear filters resets all
- [ ] Row checkboxes select/deselect
- [ ] Select all works
- [ ] Bulk actions show floating bar
- [ ] Bulk activate/deactivate/delete work
- [ ] Export CSV downloads with correct data
- [ ] Sorting works on all sortable columns
- [ ] Reset password dialog shows and works
- [ ] View dialog shows all fields
- [ ] Mobile card view renders < 768px
- [ ] Tablet view hides phone column
- [ ] Loading skeleton shows while loading
- [ ] Empty state shows when no results
- [ ] Error state shows on error with retry

Let me know which approach you'd like and I'll proceed!
