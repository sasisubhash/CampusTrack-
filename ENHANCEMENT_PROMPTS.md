# CampusTrack Module Enhancement Prompts

These are ready-to-paste prompts for enhancing each of the 8 remaining modules. Follow the sequencing below.

---

## PHASE 1: CRITICAL (Wiring Dead Buttons)

### 📋 TASKS MODULE - PROMPT 1 (STEP 1: FUNCTIONAL AUDIT + WIRE CREATE)

**Kiro Prompt**:

```
STEP 1 — FUNCTIONAL AUDIT: TASKS MODULE

Current State:
- File: src/pages/Tasks.tsx (~120 lines)
- Static placeholder with hardcoded 3 tasks
- Summary cards show counts (hardcoded)
- Create Task button present but NOT wired
- Status badge shows PENDING/COMPLETED (not clickable)

AUDIT CHECKLIST (Click in browser and verify):
1. Click "Create Task" button → What happens? (Should open dialog, currently does nothing)
2. Click on a task row → Should it be clickable? (Currently not wired)
3. Are the summary card numbers real or hardcoded? (Currently hardcoded)
4. Is there a way to mark a task complete? (No UI for this)
5. Test dark mode on all elements (buttons, badges, text)

ISSUES FOUND:
- "Create Task" button not wired to any handler
- No form/dialog exists for creating tasks
- No Redux integration — all data is static
- No API calls (mock or real)
- No toast notifications
- No loading states

YOUR TASK (STEP 1 only):
1. Create src/features/tasks/TaskForm.tsx (React Hook Form + Zod validation)
   - Fields: title (required), subject (select), dueDate (date picker), priority (select: high/medium/low), description (optional)
   - Validation: title required (3-50 chars), subject required, dueDate required (future date)
   
2. Create src/components/tasks/TaskDialog.tsx
   - Dialog wrapper that shows TaskForm
   - Buttons: "Create" (disabled while submitting), "Cancel"
   
3. Create src/features/tasks/TaskService.ts (mock API)
   - Function: createTask(data) → returns { id, ...data, status: 'PENDING' }
   - Simulate 500ms delay
   
4. Enhance src/pages/Tasks.tsx:
   - Add useState for dialog visibility
   - Wire "Create Task" button to open dialog
   - On form submit: call createTask() via TanStack Query useMutation
   - Show loading state (disable button, show spinner)
   - On success: toast("Task created successfully"), close dialog, refresh list
   - On error: toast("Failed to create task", error message)
   
5. Wire Redux:
   - Create src/features/tasks/TaskSlice.ts with setTasks, addTask actions
   - Dispatch task to Redux after successful creation
   - Load tasks from Redux on page load (initially from mock data)
   
6. Verify:
   - Build passes (0 TypeScript errors)
   - Click "Create Task" → dialog opens
   - Fill form → "Create" button becomes enabled (validation works)
   - Submit → success toast, dialog closes, task appears in list
   - Dark mode tested on dialog and form

DO NOT add:
- Edit/delete functionality yet (STEP 2)
- Filters/search (STEP 2)
- Status toggles (STEP 2)
- Charts or analytics (STEP 2)
```

---

### 📝 ASSIGNMENTS MODULE - PROMPT 1 (STEP 1: FUNCTIONAL AUDIT + WIRE SUBMIT)

**Kiro Prompt**:

```
STEP 1 — FUNCTIONAL AUDIT: ASSIGNMENTS MODULE

Current State:
- File: src/pages/Assignments.tsx (~100 lines)
- Static placeholder with hardcoded 2 assignments
- "Submit" button on pending assignments NOT wired
- "Create Assignment" button NOT wired

AUDIT CHECKLIST (Click in browser and verify):
1. Click "Submit" button on pending assignment → What happens? (Should open file upload dialog, currently does nothing)
2. Click "Create Assignment" button → Should this be visible to students? (Currently visible to all)
3. Are the summary card numbers (Total, Submitted, Pending) real or hardcoded? (Hardcoded)
4. Does submitted assignment show marks? (Yes, but hardcoded "85")
5. Is there a "View Submission" button for submitted assignments? (No)
6. Test dark mode on all elements

ISSUES FOUND:
- "Submit" button not wired to file upload flow
- No file upload component/dialog
- "Create Assignment" visible to all (should be Staff/HOD only)
- No state management
- No API integration
- No loading states
- No toast notifications
- No role-based permissions

YOUR TASK (STEP 1 only):
1. Create src/features/assignments/SubmissionDialog.tsx
   - File upload component (accept .pdf, .docx, .zip, .txt)
   - Max file size: 10MB
   - Show file name after selection
   - Buttons: "Submit" (disabled while uploading), "Cancel"
   
2. Create src/features/assignments/AssignmentService.ts (mock API)
   - Function: submitAssignment(assignmentId, file) → returns { id, submissionDate, status: 'SUBMITTED' }
   - Simulate 1s delay (for file upload effect)
   
3. Enhance src/pages/Assignments.tsx:
   - Add useState for dialog visibility and selected assignment
   - Wire "Submit" button to open SubmissionDialog for that assignment
   - On file selection: call submitAssignment() via TanStack Query useMutation
   - Show progress indicator during upload
   - On success: toast("Assignment submitted successfully"), close dialog, update assignment status, refresh summary counts
   - On error: toast("Failed to submit assignment", error message)
   
4. Wire Redux:
   - Create src/features/assignments/AssignmentSlice.ts with setAssignments, updateAssignment actions
   - Update assignment status in Redux after successful submission
   
5. Hide "Create Assignment" button from students:
   - Use useAuth() to get current user role
   - Only show button if role === 'STAFF' or 'HOD'
   
6. Verify:
   - Build passes (0 TypeScript errors)
   - Click "Submit" on pending assignment → dialog opens
   - Select file → file name shown
   - Click "Submit" → loading spinner, upload effect
   - Success → toast, dialog closes, assignment now shows "Submitted" status with marks
   - "Create Assignment" button hidden for students
   - Dark mode tested

DO NOT add:
- Grading interface for Staff (STEP 2)
- View submission details (STEP 2)
- Edit/delete submissions (STEP 2)
```

---

### 🏃 LEAVE MODULE - PROMPT 1 (STEP 1: FUNCTIONAL AUDIT + WIRE APPLY)

**Kiro Prompt**:

```
STEP 1 — FUNCTIONAL AUDIT: LEAVE MODULE

Current State:
- File: src/pages/Leave.tsx (~110 lines)
- Static placeholder with hardcoded 2 leave requests
- "Apply Leave" button NOT wired to form
- "View Calendar" button NOT wired
- Parent Confirmation badge hardcoded on BOTH items (incorrect — should only show after parent confirms)

AUDIT CHECKLIST (Click in browser and verify):
1. Click "Apply Leave" button → What happens? (Should open form dialog, currently does nothing)
2. Click on a leave item → Is it clickable? (No)
3. Are summary counts (Total, Approved, Pending) real or hardcoded? (Hardcoded)
4. "Parent Confirmed" badge appears on both items — is this correct? (NO — should only show on item #2 after parent confirms item #1)
5. Can you approve/reject a leave request? (No UI for this)
6. Test dark mode

ISSUES FOUND:
- "Apply Leave" button not wired
- No leave application form
- Parent confirmation badge hardcoded incorrectly
- No state management
- No role-based permissions (Staff approves, Parent confirms, Student applies)
- No approval workflow
- No API integration
- No toast notifications

YOUR TASK (STEP 1 only):
1. Create src/features/leave/LeaveForm.tsx (React Hook Form + Zod)
   - Fields: type (select: SICK/CASUAL/EARNED/MEDICAL), fromDate (date picker), toDate (date picker, >= fromDate), reason (textarea, 10-500 chars)
   - Validation: all required, dates valid, reason min 10 chars
   
2. Create src/components/leave/LeaveDialog.tsx
   - Dialog wrapper for LeaveForm
   - Buttons: "Apply" (disabled while submitting), "Cancel"
   
3. Create src/features/leave/LeaveService.ts (mock API)
   - Function: applyLeave(data) → returns { id, ...data, status: 'PENDING', parentConfirmation: false }
   - Simulate 500ms delay
   
4. Enhance src/pages/Leave.tsx:
   - Add useState for dialog visibility
   - Wire "Apply Leave" button to open dialog
   - On form submit: call applyLeave() via TanStack Query useMutation
   - Show loading state
   - On success: toast("Leave request submitted"), close dialog, add new leave to list with status PENDING, parentConfirmation: false (not true!)
   - On error: toast("Failed to apply leave", error)
   
5. Fix hardcoded data:
   - Update mock leaves data: set parentConfirmation: true only on item #2 (id: '2')
   - Set parentConfirmation: false for item #1 (new items should default to false)
   
6. Wire Redux:
   - Create src/features/leave/LeaveSlice.ts with setLeaves, addLeave actions
   - Store leaves in Redux
   
7. Verify:
   - Build passes (0 TypeScript errors)
   - Click "Apply Leave" → dialog opens with form
   - Fill form → "Apply" button enabled
   - Submit → loading spinner, success toast
   - New leave appears at bottom with status PENDING, parentConfirmation: false
   - Only item #2 shows "Parent Confirmed" badge (item #1 does NOT)
   - Dark mode tested

DO NOT add:
- Parent approval workflow (STEP 2)
- Staff approval workflow (STEP 2)
- Calendar integration (STEP 2)
- Leave cancellation (STEP 2)
```

---

### 📅 CALENDAR MODULE - PROMPT 1 (STEP 1: FUNCTIONAL AUDIT + WIRE CREATE)

**Kiro Prompt**:

```
STEP 1 — FUNCTIONAL AUDIT: CALENDAR MODULE

Current State:
- File: src/pages/CalendarPage.tsx (~90 lines)
- Static calendar grid for July 2026
- Today (14th) highlighted (correct)
- "Create Event" button NOT wired
- No month navigation
- Static events in sidebar

AUDIT CHECKLIST (Click in browser and verify):
1. Click "Create Event" button → What happens? (Should open event form, currently nothing)
2. Click on a calendar date → Should it be clickable? (Currently not wired)
3. Can you navigate to previous/next month? (No buttons, stuck on July)
4. Click on an event in sidebar → Should show details? (Currently not clickable)
5. Is the calendar grid dynamic or static HTML? (Static)
6. Test dark mode

ISSUES FOUND:
- "Create Event" button not wired
- No calendar navigation (prev/next month)
- No event creation form
- No state management
- No API integration
- No loading states
- Static calendar HTML
- No event CRUD

YOUR TASK (STEP 1 only):
1. Create src/features/calendar/EventForm.tsx (React Hook Form + Zod)
   - Fields: title (required), type (select: EXAM/WORKSHOP/HOLIDAY/MEETING), startDate (date picker), endDate (date picker, >= startDate), department (optional, select)
   - Validation: title required (3-50 chars), type required, dates valid
   
2. Create src/components/calendar/EventDialog.tsx
   - Dialog wrapper for EventForm
   - Buttons: "Create" (disabled while submitting), "Cancel"
   
3. Create src/features/calendar/CalendarService.ts (mock API)
   - Function: createEvent(data) → returns { id, ...data }
   - Simulate 500ms delay
   
4. Enhance src/pages/CalendarPage.tsx:
   - Add useState for dialog visibility
   - Wire "Create Event" button to open EventDialog
   - On form submit: call createEvent() via TanStack Query useMutation
   - Show loading state
   - On success: toast("Event created"), close dialog, add event to sidebar list, refresh calendar if date changed
   - On error: toast("Failed to create event", error)
   
5. Add month navigation:
   - Add prev/next buttons next to "July 2026" title
   - Clicking prev/next updates the displayed month
   - Calendar grid updates to show correct dates for selected month
   - (TIP: Use state for currentDate, calculate days based on month)
   
6. Wire Redux:
   - Create src/features/calendar/CalendarSlice.ts with setEvents, addEvent, setCurrentMonth actions
   - Store events and current month in Redux
   
7. Verify:
   - Build passes (0 TypeScript errors)
   - Click "Create Event" → dialog opens
   - Fill form → "Create" button enabled
   - Submit → success toast, dialog closes
   - Event appears in sidebar under "Upcoming Events"
   - Click prev/next month buttons → calendar updates to show June/August
   - Dates in sidebar update when month changes (show only events from selected month)
   - Dark mode tested

DO NOT add:
- Event detail view (STEP 2)
- Event editing/deletion (STEP 2)
- Event filtering/search (STEP 2)
- Event dragging (STEP 2)
```

---

### 📢 ANNOUNCEMENTS MODULE - PROMPT 1 (STEP 1: FUNCTIONAL AUDIT + WIRE CREATE)

**Kiro Prompt**:

```
STEP 1 — FUNCTIONAL AUDIT: ANNOUNCEMENTS MODULE

Current State:
- File: src/pages/Announcements.tsx (~110 lines)
- Static list of 3 announcements
- "New Announcement" button NOT wired
- Pinned announcements appear first (logic works but data is static)
- Type badges with color coding (visual only)

AUDIT CHECKLIST (Click in browser and verify):
1. Click "New Announcement" button → What happens? (Should open form, currently nothing)
2. Are announcements clickable to view full content? (No)
3. Can you pin/unpin announcements? (No UI for this)
4. Are the announcements real or hardcoded? (Hardcoded)
5. Is "New Announcement" visible to all users or only Admin? (Currently visible to all)
6. Test dark mode

ISSUES FOUND:
- "New Announcement" button not wired
- No announcement creation form
- No state management
- No role-based permissions (only Admin/HOD should see create button)
- No API integration
- No loading states
- No toast notifications
- No announcement editing/deletion

YOUR TASK (STEP 1 only):
1. Create src/features/announcements/AnnouncementForm.tsx (React Hook Form + Zod)
   - Fields: title (required), content (required), type (select: COLLEGE/DEPARTMENT/EMERGENCY), department (conditional select, show only if type=DEPARTMENT)
   - Validation: title (3-100 chars), content (10-5000 chars), type required
   
2. Create src/components/announcements/AnnouncementDialog.tsx
   - Dialog wrapper for AnnouncementForm
   - Buttons: "Post" (disabled while submitting), "Cancel"
   
3. Create src/features/announcements/AnnouncementService.ts (mock API)
   - Function: createAnnouncement(data) → returns { id, ...data, isPinned: false, createdAt: new Date() }
   - Simulate 500ms delay
   
4. Enhance src/pages/Announcements.tsx:
   - Add useState for dialog visibility
   - Wire "New Announcement" button to open AnnouncementDialog
   - On form submit: call createAnnouncement() via TanStack Query useMutation
   - Show loading state
   - On success: toast("Announcement posted"), close dialog, add announcement to top of list (or below pinned announcements)
   - On error: toast("Failed to post announcement", error)
   
5. Hide "New Announcement" button from students/staff:
   - Use useAuth() to get current user role
   - Only show button if role === 'ADMIN' or 'HOD'
   - If user is student, don't show button but still show announcements
   
6. Wire Redux:
   - Create src/features/announcements/AnnouncementSlice.ts with setAnnouncements, addAnnouncement actions
   - Store announcements in Redux
   
7. Verify:
   - Build passes (0 TypeScript errors)
   - If logged in as Admin/HOD: "New Announcement" button visible
   - If logged in as Student: "New Announcement" button NOT visible
   - Click button (as Admin) → dialog opens
   - Fill form → "Post" button enabled
   - Submit → success toast, dialog closes
   - New announcement appears at top of list (or below existing pinned items)
   - Department field only shows when type=DEPARTMENT
   - Dark mode tested

DO NOT add:
- Announcement editing/deletion (STEP 2)
- Pinning/unpinning UI (STEP 2)
- Announcement scheduling (STEP 2)
- Search/filtering (STEP 2)
```

---

## PHASE 2: SUPPORTING (Read-Only Views)

### 📊 PERFORMANCE MODULE - PROMPT 1 (STEP 1: INTEGRATION + API)

**Kiro Prompt**:

```
STEP 1 — PERFORMANCE MODULE: REDUX INTEGRATION + MOCK API

Current State:
- File: src/pages/Performance.tsx (~100 lines)
- Hardcoded performance metrics (overall: 87.6%, attendance: 85%, etc.)
- Read-only display (no editing, this is correct for performance)
- Subject-wise breakdown with progress bars

YOUR TASK (STEP 1 only):
1. Create src/features/performance/PerformanceService.ts (mock API)
   - Function: fetchPerformanceData(studentId, period?) → returns performance metrics
   - Simulate 500ms delay
   - Return structure: { overall, attendance, assignments, tasks, subjectWise: [...] }
   
2. Create src/features/performance/PerformanceSlice.ts
   - State: performanceData, loading, error
   - Reducers: setPerformanceData, setLoading, setError
   
3. Enhance src/pages/Performance.tsx:
   - Remove hardcoded performanceData
   - Use TanStack Query useQuery() to fetch data from mock API
   - While loading: show skeleton loaders (CardSkeleton for summary cards, TableSkeleton for subject list)
   - On success: display data from Redux
   - On error: show error state with Retry button (calls refetch())
   - Empty state: if no data, show "No performance data available"
   
4. Create loading skeleton components:
   - src/components/performance/PerformanceCardSkeleton.tsx (4 summary cards)
   - src/components/performance/SubjectTableSkeleton.tsx (subject list)
   
5. Show proper toast on error:
   - On fetch error: toast("Failed to load performance data")
   - Retry button should call refetch()
   
6. Add role-based data filtering:
   - If user is Student: show own performance only
   - If user is Parent: show child's performance (get from user.childId or similar)
   - If user is Staff/HOD: allow dropdown to select student (optional for STEP 1)
   
7. Verify:
   - Build passes (0 TypeScript errors)
   - Page loads → shows loading skeletons
   - After 500ms delay → data displays (no more hardcoded values)
   - Data matches mock API response
   - Responsive design works
   - Dark mode tested
   - Error state works (manually trigger error to test)

DO NOT add:
- Charts/graphs yet (STEP 2)
- Historical trends (STEP 2)
- Student selection dropdown for Staff (defer to STEP 2)
- Export functionality (defer to STEP 2)
```

---

### 📋 REPORTS MODULE - PROMPT 1 (STEP 1: WIRE DOWNLOAD + BASIC FILTERS)

**Kiro Prompt**:

```
STEP 1 — REPORTS MODULE: WIRE DOWNLOAD BUTTONS + BASIC FILTERS

Current State:
- File: src/pages/Reports.tsx (~110 lines)
- 4 report type cards (Attendance, Performance, Leave, Assignments)
- "Recent Reports" list with Download PDF/Excel buttons NOT wired
- "Filters" button NOT wired

YOUR TASK (STEP 1 only):
1. Create src/features/reports/ReportService.ts (mock API)
   - Function: downloadReport(reportType, format: 'pdf' | 'excel', filters?) → simulates file generation
   - Returns a mock blob (or console.log + toast indicating download started)
   - Simulate 1s delay to show loading effect
   
2. Create src/components/reports/FilterDialog.tsx
   - Filter options: Date range (from/to), Report type filter (show only selected type), Department filter
   - Buttons: "Apply", "Reset"
   - Store filters in state
   
3. Enhance src/pages/Reports.tsx:
   - Wire Download buttons (PDF/Excel) on recent reports:
     - On click: show loading toast ("Preparing report...")
     - Call downloadReport() via TanStack Query useMutation
     - On success: simulate browser download (trigger file download), show success toast ("Report downloaded")
     - On error: show error toast
   
   - Wire Filters button:
     - Click → open FilterDialog
     - Apply filters → filter the recent reports list based on report type and date range
     - Show filtered results
   
4. Add date range picker to filter dialog:
   - Use date picker component (date input fields)
   - Validation: fromDate <= toDate
   
5. Wire report type cards:
   - Clicking a report type card should apply a filter (filter reports by that type)
   - Show visual feedback (highlight selected type)
   
6. Add loading state to download buttons:
   - Disable button while downloading
   - Show spinner
   - Re-enable after success/error
   
7. Verify:
   - Build passes (0 TypeScript errors)
   - Click Download PDF/Excel → loading toast, then success toast
   - Click Filters button → dialog opens with filter options
   - Apply filters → report list updates
   - Click report type card → filters by that type
   - Responsive design
   - Dark mode tested

DO NOT add:
- Custom report builder (STEP 2)
- Report preview (STEP 2)
- Report scheduling (STEP 2)
- Advanced filtering (STEP 2)
```

---

## PHASE 3: SETTINGS (Complex Form)

### ⚙️ SETTINGS MODULE - PROMPT 1 (STEP 1: WIRE SAVE BUTTONS + VALIDATION)

**Kiro Prompt**:

```
STEP 1 — SETTINGS MODULE: WIRE SAVE BUTTONS + FORM VALIDATION

Current State:
- File: src/pages/Settings.tsx (~160 lines)
- Profile section with form fields (not connected to any state)
- Password change section (not connected)
- Notification preferences with toggles (not connected)
- Appearance section with dark mode toggle (not connected)
- "Save Changes" button NOT wired
- "Change Password" button NOT wired
- All fields have defaultValue but no onChange handlers

YOUR TASK (STEP 1 only):
1. Create src/features/settings/ProfileSchema.ts (Zod validation)
   - Fields: firstName (required, 2-50 chars), lastName (required, 2-50 chars), email (required, valid email), phone (required, valid phone format)
   - Export as ProfileUpdateSchema
   
2. Create src/features/settings/PasswordSchema.ts (Zod validation)
   - Fields: currentPassword (required, min 6), newPassword (required, min 8), confirmPassword (required, must match newPassword)
   - Validation: newPassword must differ from currentPassword
   - Export as PasswordChangeSchema
   
3. Enhance Profile section:
   - Replace form with React Hook Form + Zod validation (use ProfileUpdateSchema)
   - Wire "Save Changes" button to submit form
   - On submit:
     - Call updateProfile(data) via TanStack Query useMutation (create mock API)
     - Show loading state (disable button, show spinner)
     - On success: toast("Profile updated successfully"), update user data in Redux/Context
     - On error: toast("Failed to update profile", error)
   - Show field-level validation errors (red text below fields)
   - Responsive grid layout
   
4. Enhance Password section:
   - Replace with React Hook Form + Zod validation (use PasswordChangeSchema)
   - Wire "Change Password" button to submit form
   - On submit:
     - Call changePassword(data) via TanStack Query useMutation (create mock API)
     - Show loading state
     - Show success: toast("Password changed successfully")
     - Clear form after success
     - On error: toast with error (e.g., "Current password incorrect")
   - Password fields should be type="password"
   - Show validation errors
   
5. Create mock APIs:
   - src/features/settings/SettingsService.ts
   - Functions: updateProfile(data), changePassword(data), updateNotifications(settings), updateAppearance(settings)
   - All simulate 500ms delay and return success
   
6. Enhance Notifications section:
   - Wire each toggle to update Redux state
   - On toggle: call updateNotifications() via useMutation
   - Show toast feedback (e.g., "Email notifications enabled")
   - Store preference (in Redux or localStorage)
   
7. Enhance Appearance section:
   - Wire dark mode toggle to update global theme state
   - On toggle: call updateAppearance() via useMutation
   - Show toast feedback
   - Toggle should immediately update the theme (dark/light) visually
   
8. Verify:
   - Build passes (0 TypeScript errors)
   - Profile section: Fill form, leave email empty → "Email is required" error
   - Fill all fields → "Save Changes" button enabled
   - Click "Save Changes" → loading spinner, success toast, form values reflect updated user data
   - Password section: Mismatch confirmPassword → error shown
   - Click "Change Password" → loading, success toast, form cleared
   - Toggle notifications → toast feedback
   - Toggle dark mode → theme updates immediately on page
   - Responsive design (forms stack on mobile)
   - Dark mode tested

DO NOT add:
- Avatar upload (defer to STEP 2 or later)
- Advanced security settings (STEP 2+)
- Two-factor authentication (STEP 2+)
- Session management (STEP 2+)
```

---

## ADVANCED ENHANCEMENT PROMPTS (AFTER PHASE 1-3)

### 🎯 Tasks Module - STEP 2 (CRUD + Filters)
### 📝 Assignments Module - STEP 2 (Grading Interface for Staff)
### 🏃 Leave Module - STEP 2 (Approval Workflow)
### 📅 Calendar Module - STEP 2 (Event Details & Management)
### 📢 Announcements Module - STEP 2 (Edit/Delete/Pin)
### 📊 Performance Module - STEP 2 (Charts + Historical Trends)
### 📋 Reports Module - STEP 2 (Custom Report Builder)
### ⚙️ Settings Module - STEP 2 (Avatar Upload + Advanced Options)

---

## RECOMMENDED EXECUTION ORDER

**Recommended Sequence** (by complexity and value):

1. ✅ **Tasks** (Simplest list CRUD)
2. ✅ **Announcements** (Simple list CRUD, minimal workflow)
3. ✅ **Settings** (Form-heavy but no complex workflows)
4. ✅ **Calendar** (Slightly complex with date handling)
5. ✅ **Performance** (Read-only, API integration)
6. ✅ **Reports** (Export/download logic)
7. ✅ **Assignments** (File upload + grading)
8. ✅ **Leave** (Multi-step approval workflow, most complex)

---

## CROSS-CUTTING NOTES

**For All Modules**:
- Use `useAuth()` to check user role before showing admin/staff actions
- Always wrap async operations in TanStack Query (useQuery for fetches, useMutation for mutations)
- Mock API files should simulate real delays (300-1000ms) for better UX testing
- Toast notifications: Success (green), Error (red), Loading (blue)
- Loading states: Show skeleton loaders, disable buttons, show spinners
- Error states: Show user-friendly message + Retry button that calls refetch()
- Empty states: Show icon + message ("No data") when list is empty

**TypeScript Strict Mode**:
- No `any` types
- All function returns typed
- All Redux state typed
- Zod schema as source of truth for form types

**Testing Checklist After Each Module**:
- ✅ Build passes (0 errors)
- ✅ Buttons are wired and functional
- ✅ Loading states appear correctly
- ✅ Error states work (mock error by rejecting API)
- ✅ Empty state appears when needed
- ✅ Toast notifications fire on success/error
- ✅ Dark mode tested
- ✅ Responsive (375px, 768px, 1024px)
- ✅ No console.log or TODO comments

---

**Status**: 🟢 Ready to begin Phase 1 implementation. Choose first module (recommend: Tasks) and paste the corresponding STEP 1 prompt.

