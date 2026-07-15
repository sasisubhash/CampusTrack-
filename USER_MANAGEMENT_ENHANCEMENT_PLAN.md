# User Management Enhancement Plan

## Status: IN PROGRESS

## Components Created:
1. ✅ `FilterBar.tsx` - Role, Status, Department, Semester filters with Clear button
2. ✅ `BulkActionBar.tsx` - Floating action bar for bulk operations
3. ✅ `UserCard.tsx` - Mobile-responsive card view component

## Remaining Work:

### 1. Update Users.tsx Main Page
**Changes Needed:**
- Add FilterBar component below header
- Add row selection checkboxes (header + per-row)
- Add BulkActionBar when rows selected
- Add sorting to Role, Phone, Status columns
- Add Export to CSV/Excel button
- Add loading skeleton for table
- Add enhanced empty state with filter clear
- Add error state with retry
- Implement mobile card view (< 768px)
- Add debounced search (300ms)
- Implement filter logic combining search + filters

### 2. Enhanced View Dialog
**Additional Fields to Show:**
- Department (for HOD/Staff/Student)
- Employee ID (for HOD/Staff)
- Roll Number (for Student)
- Semester (for Student)
- Children IDs (for Parent)
- Join Date (createdAt formatted)
- Last Active (mock data)
- Linked records count

### 3. Enhanced Create/Edit Form (UserForm.tsx)
**Enhancements:**
- Email duplicate validation against existing users
- Subjects multi-select for Staff
- Parent-child linking for Parent role
- Better conditional field rendering
- Form field descriptions/hints

### 4. Reset Password Dialog
**New Component:**
- Confirmation dialog before reset
- Mock API call simulation
- Toast with result
- Loading state

### 5. Bulk Delete Confirmation
**Enhancement:**
- AlertDialog showing count: "Delete {count} users?"
- List of user names being deleted
- Confirmation required

### 6. Export Functionality
**Implementation:**
- Export current filtered view to CSV
- Include: Name, Email, Role, Phone, Status, Department
- Filename: `users-export-{date}.csv`
- Use `js-file-download` or similar library

### 7. Route Guard
**Security:**
- Check user role in component
- Redirect non-HOD users to /dashboard
- Show unauthorized message

### 8. Responsive Breakpoints:
- **Desktop (>1024px)**: Full table view as current
- **Tablet (768px-1024px)**: Table with Phone column hidden by default
- **Mobile (<768px)**: Card list view with filters in drawer

## Implementation Order:

###

 Phase 1: Core Functionality (Continuing Now)
- [x] FilterBar component
- [x] BulkActionBar component
- [x] UserCard component
- [ ] Update Users.tsx with filters
- [ ] Add row checkboxes
- [ ] Wire bulk actions
- [ ] Add sort to all sortable columns

### Phase 2: Dialogs & Forms
- [ ] Enhanced View dialog
- [ ] Enhanced UserForm with validation
- [ ] Reset Password dialog
- [ ] Bulk delete confirmation

### Phase 3: Export & Polish
- [ ] CSV/Excel export
- [ ] Loading skeleton
- [ ] Enhanced empty/error states
- [ ] Route guard

### Phase 4: Responsive
- [ ] Mobile card view
- [ ] Tablet optimizations
- [ ] Filter drawer for mobile
- [ ] FAB for "Add User" on mobile

## Technical Notes:

### Filter Logic:
```typescript
const filteredUsers = users.filter(user => {
  if (filters.role && user.role !== filters.role) return false
  if (filters.status && user.isActive !== (filters.status === 'active')) return false
  if (filters.department && (user as any).department !== filters.department) return false
  if (filters.semester && (user as any).semester !== filters.semester) return false
  return true
})
```

### Export CSV:
```typescript
const exportToCSV = () => {
  const csv = [
    ['Name', 'Email', 'Role', 'Phone', 'Status', 'Department'].join(','),
    ...filteredUsers.map(u => [
      `"${u.firstName} ${u.lastName}"`,
      u.email,
      u.role,
      u.phone,
      u.isActive ? 'Active' : 'Inactive',
      (u as any).department || 'N/A'
    ].join(','))
  ].join('\n')
  
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `users-export-${new Date().toISOString().split('T')[0]}.csv`
  a.click()
}
```

### Row Selection State:
```typescript
const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({})
const selectedUsers = Object.keys(rowSelection).filter(k => rowSelection[k])
```

## Files to Modify:
1. `src/pages/Users.tsx` - Main enhancements
2. `src/features/users/UserForm.tsx` - Add validation
3. `src/components/common/DataTable.tsx` - Add checkbox column support

## New Files to Create:
1. ✅ `src/components/users/FilterBar.tsx`
2. ✅ `src/components/users/BulkActionBar.tsx`
3. ✅ `src/components/users/UserCard.tsx`
4. `src/components/users/ResetPasswordDialog.tsx`
5. `src/components/users/UserTableSkeleton.tsx`

## Next Step:
Continue with updating Users.tsx to integrate all new components and functionality.
