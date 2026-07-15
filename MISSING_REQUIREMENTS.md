# Missing Requirements - Action Plan

## 🔴 Critical Gaps from Requirements

### Priority 1: Core Technologies (MUST FIX)

#### 1. Replace Zustand with Redux Toolkit ⚠️ HIGH PRIORITY
**Current**: Zustand stores
**Required**: Redux Toolkit with all slices

**Action Items**:
```bash
npm install @reduxjs/toolkit react-redux
```

Create slices:
- [ ] authSlice
- [ ] dashboardSlice
- [ ] studentSlice
- [ ] staffSlice
- [ ] attendanceSlice
- [ ] assignmentSlice
- [ ] leaveSlice
- [ ] calendarSlice
- [ ] announcementSlice
- [ ] reportSlice
- [ ] settingsSlice
- [ ] notificationSlice

#### 2. Install ApexCharts ⚠️ HIGH PRIORITY
**Required**: ApexCharts for Performance Analytics

**Action Items**:
```bash
npm install apexcharts react-apexcharts
```

Add charts to:
- [ ] Performance Analytics (bar, pie, line, area charts)
- [ ] Dashboard (attendance graphs)
- [ ] Reports (chart summaries)

#### 3. Install FullCalendar ⚠️ HIGH PRIORITY
**Required**: FullCalendar with Month/Week/Day views

**Action Items**:
```bash
npm install @fullcalendar/core @fullcalendar/react @fullcalendar/daygrid @fullcalendar/timegrid @fullcalendar/interaction
```

Implement:
- [ ] Month/Week/Day views
- [ ] Create/edit events in dialogs
- [ ] Event types
- [ ] Reminders

#### 4. Install Framer Motion ⚠️ MEDIUM PRIORITY
**Required**: Framer Motion for animations

**Action Items**:
```bash
npm install framer-motion
```

Add animations:
- [ ] Page transitions
- [ ] Card entrance
- [ ] Modal open/close
- [ ] List reordering

#### 5. Switch to React Hot Toast ⚠️ MEDIUM PRIORITY
**Current**: Shadcn Toast
**Required**: React Hot Toast

**Action Items**:
```bash
npm install react-hot-toast
```

Replace all toast implementations

---

### Priority 2: Missing UI Components

#### Missing Components to Build:
- [ ] **Tooltip** - Hover information
- [ ] **Popover** - Contextual pop-up content
- [ ] **Accordion** - Collapsible sections
- [ ] **SearchBar** - Dedicated search component
- [ ] **FilterBar** - Filter controls
- [ ] **DatePicker** - Date selection
- [ ] **Skeleton** - Loading skeleton screens

#### Missing Folder Structure:
Create these folders:
```
src/components/
├── forms/          # Form components
├── charts/         # Chart wrappers
├── tables/         # Table components
├── modals/         # Modal components
├── calendar/       # Calendar components
├── cards/          # Card variations
└── notifications/  # Notification components
```

Create `src/routes/` folder for route configuration

---

### Priority 3: Complete Module Features

#### Attendance Module
- [ ] Mark attendance form (Staff CRUD)
- [ ] Monthly calendar view
- [ ] Subject-wise breakdown view
- [ ] Statistics charts (ApexCharts)
- [ ] Export to PDF functionality
- [ ] Export to Excel functionality

#### Daily Tasks & Assignments
- [ ] File upload handling
- [ ] Create task form (Staff)
- [ ] Edit task form (Staff)
- [ ] Submit assignment interface (Student)
- [ ] Progress indicators
- [ ] Grading interface (Staff)
- [ ] Late submission tracking

#### Leave Management
- [ ] Apply leave form (Student)
- [ ] Parent confirmation workflow
- [ ] Staff approval dialog with remarks
- [ ] Leave calendar view
- [ ] Leave history page
- [ ] Status tracking

#### Calendar Scheduler
- [ ] FullCalendar integration
- [ ] Week view
- [ ] Day view
- [ ] Create event dialog
- [ ] Edit event dialog
- [ ] Delete event confirmation
- [ ] Event reminders
- [ ] Department filters

#### Announcements
- [ ] Create announcement dialog (HOD/Staff)
- [ ] Edit announcement dialog
- [ ] Delete confirmation
- [ ] Notification center integration
- [ ] Toast on new announcement
- [ ] Pin/Unpin functionality
- [ ] Read tracking

#### Performance Analytics
- [ ] Bar charts (ApexCharts)
- [ ] Pie charts (ApexCharts)
- [ ] Line charts (ApexCharts)
- [ ] Area charts (ApexCharts)
- [ ] Top performers list
- [ ] At-risk students identification
- [ ] Trend analysis

#### Reports
- [ ] Generate report forms
- [ ] Filter by date range
- [ ] Filter by department
- [ ] Filter by student
- [ ] Chart summaries
- [ ] Actual PDF generation
- [ ] Actual Excel export

#### Settings
- [ ] Department management (HOD)
- [ ] Semester management (HOD)
- [ ] Academic year configuration (HOD)
- [ ] Subject management (HOD)
- [ ] Audit log viewer
- [ ] Activity history

---

### Priority 4: Redux Integration

#### All Modules Need Redux Slices:
Each module needs:
- [ ] Redux slice for client/UI state
- [ ] TanStack Query for server calls
- [ ] Actions dispatched on all CRUD operations
- [ ] Selectors for derived state

**Example Pattern**:
```typescript
// Redux: UI state (modals, filters, pagination)
const modalState = useSelector(selectModalState)
dispatch(openModal('create'))

// TanStack Query: Server data
const { data } = useQuery(['users'], userService.getAll)
const mutation = useMutation(userService.create)
```

---

### Priority 5: Breadcrumb Implementation

**Required**: Breadcrumb bar under navbar

**Action Items**:
- [ ] Create breadcrumb component
- [ ] Add to MainLayout
- [ ] Auto-generate from route path
- [ ] Style according to design system

**Example**:
```
Home > User Management > Edit User
Dashboard > Attendance > Mark Attendance
```

---

### Priority 6: Loading States

**Required**: Skeleton loading for all async views

**Action Items**:
- [ ] Create Skeleton components
- [ ] Replace LoadingSpinner with Skeletons
- [ ] Table skeleton
- [ ] Card skeleton
- [ ] Form skeleton
- [ ] Dashboard skeleton

---

### Priority 7: Module Completion Checklist

#### User Management ✅ (COMPLETE)
- [x] CRUD operations
- [x] TanStack Table
- [x] Dialogs
- [x] Validation
- [x] Toast feedback
- [x] All 4 states
- [ ] Redux slice (needs migration)

#### All Other Modules ⚠️ (INCOMPLETE)
Each needs:
- [ ] Redux slice
- [ ] Full CRUD in dialogs
- [ ] Zod validation on all forms
- [ ] Toast feedback on all actions
- [ ] Loading skeleton (not spinner)
- [ ] Charts where specified
- [ ] Export functionality where specified

---

## 📊 Compliance Summary

### Tech Stack Compliance:
| Required | Current | Status |
|----------|---------|--------|
| Redux Toolkit | Zustand | ❌ MISSING |
| ApexCharts | None | ❌ MISSING |
| FullCalendar | Mock | ❌ MISSING |
| Framer Motion | CSS | ❌ MISSING |
| React Hot Toast | Shadcn Toast | ❌ WRONG |
| TanStack Table | ✅ Installed | ✅ PARTIAL |
| TanStack Query | ✅ Installed | ✅ PARTIAL |
| React Hook Form | ✅ Installed | ✅ COMPLETE |
| Zod | ✅ Installed | ✅ COMPLETE |
| Shadcn/UI | ✅ Installed | ✅ COMPLETE |
| Lucide React | ✅ Installed | ✅ COMPLETE |
| Tailwind CSS | ✅ Configured | ✅ COMPLETE |
| React Router | ✅ Installed | ✅ COMPLETE |

### Feature Compliance:
| Requirement | Status |
|-------------|--------|
| 4 Role Dashboards | ✅ COMPLETE |
| Role-based Navigation | ✅ COMPLETE |
| Dark/Light Mode | ✅ COMPLETE |
| Mobile Responsive | ✅ COMPLETE |
| User Management (Full CRUD) | ✅ COMPLETE |
| Other Modules (Full CRUD) | ❌ PARTIAL |
| Charts | ❌ MISSING |
| Calendar Integration | ❌ MISSING |
| File Upload | ❌ MISSING |
| PDF/Excel Export | ❌ MISSING |
| Breadcrumbs | ❌ MISSING |
| Animations | ❌ MISSING |
| Redux Slices | ❌ MISSING |
| Skeleton Loading | ❌ MISSING |

---

## 🎯 Recommended Action Plan

### Phase 1: Fix Core Technologies (2-3 days)
1. Install Redux Toolkit
2. Migrate Zustand stores to Redux slices
3. Install ApexCharts
4. Install FullCalendar
5. Install Framer Motion
6. Install React Hot Toast

### Phase 2: Complete Module Features (1 week)
1. Attendance - Full CRUD with calendar and charts
2. Tasks & Assignments - Full CRUD with file upload
3. Leave Management - Full workflow
4. Calendar - FullCalendar integration
5. Announcements - Full CRUD with notifications
6. Performance - Add charts
7. Reports - Add generation and export
8. Settings - Complete HOD features

### Phase 3: Polish & Compliance (2-3 days)
1. Add breadcrumbs
2. Add all animations
3. Replace spinners with skeletons
4. Add missing common components
5. Complete folder structure
6. Responsive QA
7. Accessibility pass

---

## 📋 Quick Fix Commands

```bash
# Install missing packages
npm install @reduxjs/toolkit react-redux
npm install apexcharts react-apexcharts
npm install @fullcalendar/core @fullcalendar/react @fullcalendar/daygrid @fullcalendar/timegrid @fullcalendar/interaction
npm install framer-motion
npm install react-hot-toast

# Create missing folders
mkdir -p src/components/forms
mkdir -p src/components/charts
mkdir -p src/components/tables
mkdir -p src/components/modals
mkdir -p src/components/calendar
mkdir -p src/components/cards
mkdir -p src/components/notifications
mkdir -p src/routes
```

---

## 🚨 Critical Path Items

**Must fix BEFORE considering the project complete**:
1. ✅ Redux Toolkit (instead of Zustand)
2. ✅ ApexCharts (for Performance module)
3. ✅ FullCalendar (for Calendar module)
4. ✅ Framer Motion (for animations)
5. ✅ React Hot Toast (instead of Shadcn Toast)
6. ✅ Breadcrumbs (under navbar)
7. ✅ Full CRUD for all modules (not just User Management)
8. ✅ Charts in Dashboard and Performance
9. ✅ File upload in Assignments
10. ✅ PDF/Excel export in Reports and Attendance

---

**Current Compliance: ~60%**
**Target: 100%**

The foundation is excellent, but these specific requirements from the prompt MUST be addressed for full compliance.
