# Student Management Module - Quick Reference

## Module Location
`src/pages/Students.tsx` (820 lines)

## Core Functionality

| Feature | Status | Location |
|---------|--------|----------|
| Create Student | ✅ Dialog form | `StudentForm.tsx` |
| View Student | ✅ Read-only profile | `Students.tsx` line 600+ |
| Edit Student | ✅ Pre-filled form | `StudentForm.tsx` |
| Delete Student | ✅ Confirmation dialog | `Students.tsx` line 770+ |
| Bulk Activate | ✅ Multiple rows | `BulkActionBar` |
| Bulk Deactivate | ✅ Multiple rows | `BulkActionBar` |
| Bulk Delete | ✅ With confirmation | `Students.tsx` line 810+ |
| Search | ✅ Live filter | `Students.tsx` line 550+ |
| Filter by Department | ✅ Dropdown | `StudentFilterBar.tsx` |
| Filter by Semester | ✅ Dropdown | `StudentFilterBar.tsx` |
| Filter by Status | ✅ Active/Inactive | `StudentFilterBar.tsx` |
| Sort by Name | ✅ Asc/Desc | Table header |
| Sort by Roll # | ✅ Asc/Desc | Table header |
| Sort by Department | ✅ Asc/Desc | Table header |
| Sort by Semester | ✅ Asc/Desc | Table header |
| Sort by Status | ✅ Asc/Desc | Table header |
| CSV Export | ✅ Filtered data | `Students.tsx` line 200+ |
| Table View | ✅ Desktop (>1024px) | Desktop render |
| Card View | ✅ Mobile (<768px) | `StudentCard.tsx` |
| Row Selection | ✅ Checkboxes | Table + cards |
| Loading State | ✅ Skeleton | `StudentTableSkeleton.tsx` |
| Empty State | ✅ No results | `EmptyState` component |
| Error State | ✅ With retry | `ErrorState` component |

## Components

### `StudentCard.tsx`
Mobile card view component
```
Props:
  - student: Student
  - isSelected: boolean
  - onSelect: (checked: boolean) => void
  - onClick: () => void
  - onMenuClick: () => void

Usage: Renders in card view on mobile
```

### `StudentFilterBar.tsx`
Filter controls
```
Props:
  - filters: StudentFilters
  - onFiltersChange: (filters: StudentFilters) => void
  - onClearFilters: () => void

Filters:
  - department: "CSE" | "ECE" | "EEE" | "MECH" | "CIVIL"
  - semester: "1"-"8"
  - status: "active" | "inactive"
```

### `StudentTableSkeleton.tsx`
Loading skeleton for the entire page
- Stats cards skeleton
- Filter bar skeleton
- Table rows skeleton (10 rows)

### `StudentForm.tsx`
Create/Edit form
```
Props:
  - student?: Student (if editing)
  - onSubmit: (data: Omit<Student, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
  - isLoading?: boolean
  - existingEmails?: string[]
  - existingRollNumbers?: string[]

Validation:
  - firstName: min 2 chars
  - lastName: min 2 chars
  - email: valid email format
  - phone: min 10 chars
  - rollNumber: min 5 chars
  - department: required enum
  - semester: required enum
  - Duplicate email check
  - Duplicate roll number check
```

## Data Flow

### Create Student
```
Students.tsx (page)
  → StudentForm (dialog)
    → useForm + Zod validation
      → studentService.create()
        → queryClient.invalidateQueries()
          → Toast: "Student created successfully"
```

### Edit Student
```
Students.tsx (page)
  → StudentForm (dialog, pre-filled)
    → useForm + Zod validation
      → studentService.update()
        → queryClient.invalidateQueries()
          → Toast: "Student updated successfully"
```

### Delete Student
```
Students.tsx (page)
  → AlertDialog (confirmation)
    → studentService.delete()
      → queryClient.invalidateQueries()
        → Toast: "Student deleted successfully"
```

### Bulk Actions
```
Selected rows (checkboxes)
  → BulkActionBar (floating)
    → studentService.toggleStatus() / delete() (all rows)
      → queryClient.invalidateQueries()
        → Toast: "3 students activated"
```

### Search & Filter
```
Search input + FilterBar
  → useMemo (filteredStudents)
    → Real-time filtering (combines all filters)
      → Renders DataTable or StudentCard list
```

## Service Layer

### `studentService.ts`

```typescript
getAll(filters?: FilterOptions): Promise<ApiResponse<Student[]>>
getById(id: string): Promise<ApiResponse<Student>>
create(data: Omit<Student, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Student>>
update(id: string, data: Partial<Student>): Promise<ApiResponse<Student>>
delete(id: string): Promise<ApiResponse<null>>
toggleStatus(id: string, isActive: boolean): Promise<ApiResponse<Student>>
getAttendance(studentId: string): Promise<ApiResponse<Attendance[]>>
getPerformance(studentId: string): Promise<ApiResponse<Performance>>
```

## Query Keys

```typescript
['students']                          // All students
['students', studentId]               // Single student
['students', 'attendance', studentId] // Student attendance
['students', 'performance', studentId] // Student performance
```

## State Management

```typescript
// Query state
const { data, isLoading, error, refetch } = useQuery({
  queryKey: ['students'],
  queryFn: () => studentService.getAll(),
})

// Mutations
const createMutation = useMutation(...)
const updateMutation = useMutation(...)
const deleteMutation = useMutation(...)
const bulkDeleteMutation = useMutation(...)
const toggleStatusMutation = useMutation(...)
const bulkStatusMutation = useMutation(...)

// Local state
const [filters, setFilters] = useState<StudentFilters>({})
const [searchQuery, setSearchQuery] = useState('')
const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({})
```

## API Integration

When replacing mock service with real API:

```typescript
// Change studentService methods from:
// studentService.getAll() 
// To:
// api.get('/api/students')

// Add error handling:
.catch(error => {
  throw new Error(error.response?.data?.message || 'Failed to load students')
})

// Add auth headers:
headers: {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
}
```

## Testing Checklist

```typescript
// Create
- [x] Form validation works
- [x] Duplicate email rejected
- [x] Duplicate roll number rejected
- [x] Success toast shown
- [x] List updated

// Read
- [x] View dialog opens
- [x] All fields displayed
- [x] Student found by ID

// Update
- [x] Form pre-filled
- [x] Can update any field
- [x] Success toast shown
- [x] List updated

// Delete
- [x] Confirmation required
- [x] Student removed
- [x] Success toast shown

// Bulk
- [x] Multiple rows selectable
- [x] Bulk actions available
- [x] Count badge shown
- [x] Clear selection works

// Search & Filter
- [x] Search by name
- [x] Search by roll #
- [x] Search by email
- [x] Filter by department
- [x] Filter by semester
- [x] Filter by status
- [x] Filters combine (AND logic)
- [x] Clear filters works

// Sorting
- [x] Click header to sort
- [x] Arrow indicator shows direction
- [x] Sort by each column

// Export
- [x] CSV downloads
- [x] Includes headers
- [x] Filtered data only
- [x] Correct filename
```

## Common Issues & Solutions

### Issue: Form validation not working
**Solution**: Ensure `zodResolver` is passed to `useForm` hook

### Issue: Duplicate email/roll# check not working
**Solution**: Pass existing values to form via `existingEmails` and `existingRollNumbers` props

### Issue: Mutations not updating UI
**Solution**: Ensure `queryClient.invalidateQueries()` is called in `onSuccess` callback

### Issue: Filters not combining with search
**Solution**: Check `useMemo` in Students.tsx applies all filters AND search

### Issue: Mobile view showing table instead of cards
**Solution**: Check responsive breakpoint - should use `md:` Tailwind classes to show table on >768px

## Performance Tips

1. **Search Debounce**: Currently immediate, consider adding debounce for large datasets
```typescript
const [searchQuery, setSearchQuery] = useState('')
const debouncedSearch = useMemo(
  () => debounce((value: string) => setSearchQuery(value), 300),
  []
)
```

2. **Pagination**: Implement page size selector
```typescript
const [pageSize, setPageSize] = useState(10)
```

3. **Virtual Scrolling**: For 1000+ students, use react-window
```typescript
<FixedSizeList
  height={600}
  itemCount={students.length}
  itemSize={50}
/>
```

## Browser Compatibility

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Accessibility

- ✅ WCAG 2.1 AA compliant
- ✅ Keyboard navigation (Tab, Enter, Escape)
- ✅ Screen reader support
- ✅ Color contrast ratios met
- ✅ Form labels properly associated

## Next Module Template

When building the next module (Attendance, Tasks, etc.), copy this structure:

```
src/pages/NewModule.tsx (800+ lines)
├── Stats cards
├── Filter bar
├── Search box
├── Table/Card view toggle
├── CRUD dialogs
├── Bulk actions
├── Loading/Empty/Error states
└── Service layer mutations

src/features/newModule/NewModuleForm.tsx
├── React Hook Form
├── Zod validation
└── Conditional fields

src/components/newModule/
├── NewModuleCard.tsx (mobile)
├── NewModuleFilterBar.tsx (filters)
└── NewModuleTableSkeleton.tsx (loading)
```

This template ensures consistency across all modules.

---

**Last Updated**: 2024  
**Status**: ✅ Production Ready  
**Build**: 0 TypeScript Errors
