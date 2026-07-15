# Next Phase Quick Reference
## Assignments Complete - Leave & Performance Need Fixes

**Updated**: July 14, 2026

---

## Current Status

✅ **Assignments Module**: COMPLETE (all 4 steps done)
⚠️ **Leave Module**: BLOCKED - Role-rendering bug prevents Staff approval workflow
⚠️ **Performance Module**: BLOCKED - Role-rendering bug prevents Staff monitoring

---

## How to Fix the Remaining Modules

### Fix Template (Copy-Paste for Leave & Performance)

```typescript
// At the top of the file
import { useAuth } from '@/features/auth/AuthContext'

export default function ModulePage() {
  // ADD THIS
  const { user } = useAuth()
  const isStudent = user?.role === 'STUDENT'
  const isStaffOrHOD = user?.role === 'STAFF' || user?.role === 'HOD'

  // CHANGE SUBTITLE (make it dynamic)
  const pageSubtitle = isStudent
    ? 'Student-specific subtitle here'
    : 'Staff/HOD-specific subtitle here'

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Module Name</h1>
          <p className="text-muted-foreground">{pageSubtitle}</p>  {/* Use dynamic variable */}
        </div>
        {/* Hide buttons for students if needed */}
        {isStaffOrHOD && (
          <Button onClick={handleStaffAction}>Staff Action</Button>
        )}
      </div>

      {/* Conditional rendering */}
      {isStudent && <StudentViewContent />}
      {isStaffOrHOD && <StaffViewContent />}
    </div>
  )
}
```

---

## Leave Management - What Needs to Change

**File**: `src/pages/Leave.tsx`

### Current (Broken)
```
60 lines - Shows only Student view
- No role check
- Subtitle: "Apply and manage leave requests"
- Only Student can apply for leave
- No approval mechanism for Staff
```

### Target (Fixed)
```
~200-300 lines - Role-based views
- Student view: Apply form, view own leaves, parent confirmation
- Staff/HOD view: Pending leaves table, Approve/Reject buttons, filter/search
- Dynamic subtitle
- Proper stats for each role
```

### Key Changes Needed
1. Import `useAuth` from auth context
2. Read `user.role` 
3. Create Staff/HOD view showing:
   - Pending leave requests from students
   - Student name, leave type, dates, reason
   - Approve/Reject buttons with optional reason input
   - Status badges
   - Filter by status/student
4. Change subtitle based on role
5. Hide "Apply Leave" button for Staff
6. Add stats for Staff view: Pending/Approved/Rejected

---

## Performance - What Needs to Change

**File**: `src/pages/Performance.tsx`

### Current (Broken)
```
100 lines - Shows only Student view
- No role check
- Subtitle: "Track your academic performance"
- Shows personal performance only
- No student monitoring for Staff
```

### Target (Fixed)
```
~300-400 lines - Role-based views
- Student view: Personal performance analytics, subject-wise breakdown
- Staff/HOD view: Class/department performance, student list with sorting, individual drill-down
- Dynamic subtitle
- Charts/trends
```

### Key Changes Needed
1. Import `useAuth` from auth context
2. Read `user.role`
3. Create Staff/HOD view showing:
   - List of students with overall performance
   - Sortable by name, performance, attendance
   - Color-coded performance badges (Excellent/Good/Needs Attention)
   - Click to view individual student details
   - Department-wide analytics
4. Change subtitle based on role
5. Update stats cards based on role
6. Add performance comparison charts for Staff

---

## Priority Matrix

| Module | Priority | Complexity | Est. Time | Business Impact |
|--------|----------|-----------|-----------|-----------------|
| Leave | HIGH | Medium | 2 hours | High (blocks workflow) |
| Performance | HIGH | Medium | 2 hours | High (blocks monitoring) |
| Attendance | MEDIUM | Unknown | TBD | Medium |

---

## Gold Standard Reference

**Use this as your template**: `src/pages/Assignments.tsx`
- ✅ Proper role detection
- ✅ Dynamic subtitles
- ✅ Role-based conditional rendering
- ✅ Separate component files per view
- ✅ TanStack Query for data
- ✅ Complete CRUD operations
- ✅ Loading/Empty/Error states
- ✅ Full TypeScript typing

**Copy this pattern exactly for Leave and Performance**

---

## Component Pattern

All three modules now follow this structure:

```
src/
├── pages/
│   ├── Assignments.tsx  ✅ (Done - USE AS TEMPLATE)
│   ├── Leave.tsx        ⚠️ (Needs fixing)
│   └── Performance.tsx   ⚠️ (Needs fixing)
├── components/
│   ├── assignments/     ✅ (Complete)
│   ├── leave/          ⚠️ (May need student/staff components)
│   └── performance/    ⚠️ (May need components)
├── features/
│   ├── assignments/    ✅ (Forms complete)
│   ├── leave/         ⚠️ (May need forms)
│   └── performance/   ⚠️ (May need components)
└── services/
    ├── assignmentService.ts  ✅ (Complete)
    ├── leaveService.ts       ⚠️ (May need approval endpoint)
    └── performanceService.ts ⚠️ (Needs async data fetch)
```

---

## Testing Checklist for Each Fix

After fixing Leave or Performance:

- [ ] Build passes with no errors: `npm run build`
- [ ] No TypeScript errors
- [ ] Login as Student → verify student view
- [ ] Login as Staff → verify staff view
- [ ] Login as HOD → verify HOD view (same as Staff)
- [ ] All buttons clickable and functional
- [ ] Dark mode toggle works
- [ ] Responsive at 375px, 768px, 1024px
- [ ] No console errors or warnings
- [ ] Toast notifications on actions
- [ ] Loading states show correctly
- [ ] Empty states show when applicable
- [ ] Filters/search work
- [ ] Pagination works (if applicable)

---

## Code Quality Requirements

- ✅ Full TypeScript typing (no `any` types)
- ✅ No console.log statements
- ✅ No TODOs or placeholder comments
- ✅ Proper error handling
- ✅ Loading states on all async
- ✅ Toast notifications on actions
- ✅ Responsive design
- ✅ Dark mode support
- ✅ Proper component composition
- ✅ TanStack Query for data fetching

---

## Common Mistakes to Avoid

❌ **DON'T**:
- Forget to import `useAuth`
- Hardcode role checks with `user?.id` instead of `user?.role`
- Show both views at same time (should be either/or)
- Forget dark mode classes (use `dark:` prefix)
- Leave console.log statements in code
- Use `any` types
- Skip loading/empty/error states
- Forget toast notifications
- Miss responsive breakpoints
- Hardcode strings (use variables for subtitles)

✅ **DO**:
- Import `useAuth` at top of file
- Create boolean variables: `isStudent`, `isStaffOrHOD`
- Use conditional rendering: `{isStudent && <Component />}`
- Use Tailwind dark mode: `dark:bg-slate-900`
- Test on mobile/tablet/desktop
- Add loading, empty, error states
- Show toast on all mutations
- Use full TypeScript types
- Make subtitles dynamic based on role
- Test with different user roles

---

## Key Files Reference

### Core Files to Understand
- `src/pages/Assignments.tsx` - TEMPLATE (use exactly as reference)
- `src/features/auth/AuthContext.tsx` - Where to get user role
- `src/hooks/use-toast.ts` - Toast notifications
- `src/services/assignmentService.ts` - Service pattern

### UI Components Available
- Card, CardHeader, CardContent, CardTitle
- Button (with variants: default, outline, ghost, destructive)
- Dialog, AlertDialog (for confirmations)
- Select, Input, Textarea (form controls)
- Badge (for status display)
- Table components (if needed)

### Hooks Available
- `useAuth()` - Get user info
- `useToast()` - Show notifications
- `useQuery()` - Fetch data (TanStack Query)
- `useMutation()` - Mutate data
- `useState()` - Component state
- `useMemo()` - Memoized values

---

## Prompt Template for Next Phase

When ready to fix Leave or Performance, use this template:

```
Fix the role-rendering bug and enhance the [Leave/Performance] page in CampusTrack.

STEP 1 - BUG FIX (do this first):
- Import useAuth hook
- Read user.role from auth state
- Split into two explicit views:
  - Student view: [existing functionality]
  - Staff/HOD view: [new staff functionality]
- Update subtitle based on role
- Hide/show actions based on role

STEP 2 - [STAFF VIEW BUILD-OUT]:
- [Specific features for staff role]

STEP 3 - TOOLBAR, STATES, PAGINATION:
- Add search/filters
- Loading, empty, error states
- Pagination if needed

Do not touch sidebar/navbar or global theme.
Follow Assignments.tsx pattern exactly.
```

---

## Success Criteria

After completing Leave and Performance fixes:
1. ✅ Build passes (npm run build)
2. ✅ All TypeScript errors resolved
3. ✅ Both Student and Staff views render correctly
4. ✅ Role-based buttons show/hide appropriately
5. ✅ All CRUD operations work
6. ✅ Toast notifications on actions
7. ✅ Loading/empty/error states working
8. ✅ Responsive on all breakpoints
9. ✅ Dark mode tested
10. ✅ No console errors/warnings

---

## Estimated Timeline

- **Leave fixes**: 2 hours
- **Performance fixes**: 2 hours
- **Testing & QA**: 1 hour
- **Total**: 5 hours (one productive sprint)

---

## Questions? Reference These Files

- Architecture pattern → `src/pages/Assignments.tsx`
- Role detection → `src/features/auth/AuthContext.tsx`
- Component examples → `src/components/assignments/*`
- Service pattern → `src/services/assignmentService.ts`
- Form pattern → `src/features/assignments/AssignmentForm.tsx`
- Audit findings → `AUDIT_ROLE_RENDERING_BUG.md`

---

**Status**: Ready for next agent to begin fixing Leave and Performance modules.
