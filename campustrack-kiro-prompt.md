# CampusTrack — College Activity Monitoring System
### Kiro Implementation Prompt (Spec-Driven Build)

Paste this into Kiro as your initial spec prompt. It is written so Kiro can generate `requirements.md`, `design.md`, and `tasks.md` from it, then execute tasks module-by-module.

---

## 1. Project Summary

Build **CampusTrack**, a frontend-only, enterprise-grade College ERP dashboard for monitoring academic activity across four roles: **HOD (Super Admin)**, **Staff (Admin)**, **Student (End User)**, and **Parent (Viewer)**.

The product must look and feel like a modern SaaS product — comparable to **Notion, Linear, Vercel Dashboard, or Jira** — not a bootstrap admin template. No real backend: use a typed mock API layer backed by dummy JSON, wired through Redux Toolkit and TanStack Query so it behaves like a real integration and can be swapped for a live API later without refactoring components.

**Problem this solves:** colleges currently track attendance, tasks, leave, and performance across paper records, spreadsheets, and WhatsApp. CampusTrack centralizes all of it on one platform with real-time visibility for every role.

---

## 2. Tech Stack (mandatory, do not substitute)

| Layer | Choice |
|---|---|
| Framework | React 19 + TypeScript + Vite |
| Styling | Tailwind CSS |
| Components | Shadcn/UI |
| Icons | Lucide React |
| State | Redux Toolkit |
| Server-state cache | TanStack Query (wrapping the mock API) |
| Routing | React Router DOM |
| Forms | React Hook Form + Zod |
| Tables | TanStack Table |
| Charts | ApexCharts |
| Calendar | FullCalendar |
| Animation | Framer Motion |
| Toasts | React Hot Toast |

Backend: **none** — design UI only, all data from a mock API service layer over dummy JSON.

---

## 3. Design System

- Primary color: `#2563EB`
- Background: `#F8FAFC`
- Surface/cards: white
- Border radius: `16px`
- Shadows: soft, low-opacity elevation (no hard drop shadows)
- Light mode and dark mode, both fully themed (not just inverted grays)
- Subtle glassmorphism on overlays/navbars where appropriate — used sparingly, not on every panel
- Fully responsive: desktop, tablet, mobile — sidebar collapses to a drawer/bottom nav on mobile
- Motion: Framer Motion for page transitions, card entrance, modal open/close, list reordering — kept subtle and fast (150–250ms), never gratuitous
- Every async view must implement all four states: **loading (skeleton)**, **loaded**, **empty state**, **error state**

---

## 4. Application Shell

- Collapsible left sidebar, menu items driven by role (see §5) — not the same menu re-filtered, an actually distinct config per role
- Top navbar: global search, notification bell with panel, theme toggle, profile dropdown (profile, settings, logout)
- Breadcrumb bar under navbar reflecting current route
- Main content area with consistent page container, page title, and action bar

---

## 5. Roles & Permissions

Implement route guarding and conditional UI based on role. Use this permission matrix as the source of truth for what each role can do (✅ = full CRUD unless noted):

| Module | HOD | Staff | Student | Parent |
|---|---|---|---|---|
| Dashboard | ✅ (own view) | ✅ (own view) | ✅ (own view) | ✅ (own view) |
| User Management | ✅ | ❌ | ❌ | ❌ |
| Student Management | ✅ | View | View Self | View Child |
| Attendance | View | CRUD | View | View |
| Daily Tasks | View | CRUD | View | View |
| Assignments | View | CRUD | Submit/View | View |
| Leave Management | View | Approve/Reject | Apply | View/Confirm |
| Calendar | CRUD | CRUD | View | View |
| Announcements | CRUD | CRUD | View | View |
| Performance | View | View | View Self | View Child |
| Reports | CRUD | View | ❌ | ❌ |
| Settings | CRUD | Profile only | Profile only | Profile only |

Each role's dashboard must show different widgets (see §6.2), and each role's sidebar must expose only the modules it has access to.

---

## 6. Modules to Build (build one completely before starting the next)

For every module: implement full CRUD where the matrix allows it, with **Create/Edit/View inside Dialogs**, a **Delete confirmation AlertDialog**, **Zod validation** on every form, **toast feedback** on every action, and a **Redux slice** for the module's client state combined with a **TanStack Query** hook for the mock-API fetch/mutate cycle.

### 6.1 User Management
CRUD for HOD/Staff/Student/Parent accounts, role assignment, activate/deactivate, reset password, searchable + paginated + sortable + filterable table, profile view.

### 6.2 Dashboard (role-specific)
- **HOD:** summary cards, department analytics, attendance graph, top students, top staff, notifications feed, today's activity
- **Staff:** today's classes, pending assignments to grade, attendance quick-entry, student progress snapshot
- **Student:** attendance %, pending tasks, assignments due, performance snapshot, mini calendar
- **Parent:** child's attendance, performance, announcements, upcoming events

### 6.3 Attendance
Take/edit/view/delete attendance, monthly + subject-wise views, attendance calendar, statistics charts, export to PDF/Excel.

### 6.4 Daily Tasks & Assignments
Staff: create/edit/delete tasks, upload notes/files, set due dates. Student: view tasks, submit assignment, track status (Completed/Pending/Late) with a progress indicator.

### 6.5 Leave Management
Student applies for leave/permission, parent confirmation step, staff approval/rejection with remarks, leave history, leave calendar view.

### 6.6 Calendar Scheduler
Month/week/day views (FullCalendar), create/edit/delete events, event types (Exam, Workshop, Holiday, Meeting, Assignment Deadline), reminders.

### 6.7 Announcements
Notice board scoped to Department/College/Emergency, full CRUD for HOD/Staff, notification center integration, toast on new announcement.

### 6.8 Performance Analytics
Attendance %, assignment %, task completion %, overall performance, subject-wise breakdown, top performers & at-risk students, bar/pie/line/area charts (ApexCharts).

### 6.9 Reports
Attendance/Student/Staff/Leave/Assignment reports, filterable by date/department/student, chart summaries, export to PDF/Excel.

### 6.10 Settings
Profile, department/semester/academic-year/subject management (HOD only), password change, notification preferences, theme, audit log & activity history.

---

## 7. Common Component Library

Build these once as shared, reusable components and reuse everywhere — do not re-implement per module:

`DataTable` (TanStack Table wrapper w/ search, filter, sort, pagination) · `Card` · `Modal/Dialog` · `Drawer` · `Dropdown` · `Tooltip` · `Popover` · `AlertDialog` · `Tabs` · `Accordion` · `Pagination` · `SearchBar` · `FilterBar` · `DatePicker` · `Select` · `Checkbox` · `Radio` · `Switch` · `Avatar` · `Badge` · `Toast` (wired to react-hot-toast) · `Breadcrumb` · `Skeleton` · `LoadingSpinner` · `EmptyState` · `ErrorState`

---

## 8. Folder Structure (create exactly this)

```
src/
├── assets/
├── components/
│   ├── common/
│   ├── forms/
│   ├── charts/
│   ├── tables/
│   ├── modals/
│   ├── calendar/
│   ├── cards/
│   ├── notifications/
│   └── layout/
├── features/
│   ├── auth/
│   ├── dashboard/
│   ├── users/
│   ├── attendance/
│   ├── tasks/
│   ├── leave/
│   ├── calendar/
│   ├── announcements/
│   ├── performance/
│   ├── reports/
│   └── settings/
├── pages/
├── routes/
├── services/
├── store/
├── hooks/
├── types/
├── utils/
├── constants/
├── data/
└── App.tsx
```

Each `features/<module>/` folder should be self-contained: its Redux slice, its API service functions, its Zod schemas, its components, and its page(s).

---

## 9. Redux Store

Create these slices, each with typed state, actions, and selectors:

`authSlice` · `dashboardSlice` · `studentSlice` · `staffSlice` · `attendanceSlice` · `assignmentSlice` · `leaveSlice` · `calendarSlice` · `announcementSlice` · `reportSlice` · `settingsSlice` · `notificationSlice`

Use Redux for client/UI state and cross-cutting concerns (auth, active filters, modal open state); use TanStack Query for anything that models a server round-trip (fetch list, create, update, delete) against the mock API in `services/`.

---

## 10. Mock API Layer

- `services/mockApi.ts` (or per-module service files) simulating REST calls with `setTimeout`-based latency and occasional simulated errors (to exercise error states)
- `data/*.json` or `data/*.ts` with realistic dummy data: users across all 4 roles, students with departments/semesters, attendance records, assignments, leave requests, calendar events, announcements, performance scores
- All services typed end-to-end against `types/` interfaces — no `any`

---

## 11. Build Order (instruct Kiro to follow this sequence)

1. Scaffold project, Tailwind theme tokens, dark/light mode, folder structure, routing shell, layout (sidebar/navbar/breadcrumb)
2. Auth (mock login per role) + route guarding by role
3. Common component library (§7)
4. Module 1: User Management → fully complete before continuing
5. Module 2: Dashboard (all 4 role variants)
6. Module 3: Attendance
7. Module 4: Daily Tasks & Assignments
8. Module 5: Leave Management
9. Module 6: Calendar Scheduler
10. Module 7: Announcements
11. Module 8: Performance Analytics
12. Module 9: Reports
13. Module 10: Settings
14. Final pass: responsive QA, empty/error/loading states audit, animation polish, accessibility pass (focus states, aria labels, keyboard nav on dialogs/tables)

Each module should ship complete — CRUD, validation, states, charts/tables where applicable — before Kiro proceeds to the next.

---

## 12. Definition of Done (per module)

- [ ] Sidebar entry visible only to permitted roles
- [ ] List view: TanStack Table with search, filter, sort, pagination
- [ ] Create/Edit forms: React Hook Form + Zod, open in Dialog
- [ ] View opens in Dialog (read-only)
- [ ] Delete requires AlertDialog confirmation
- [ ] All actions dispatch Redux + fire toast feedback
- [ ] Loading skeleton, empty state, and error state all implemented and reachable
- [ ] Fully responsive at desktop/tablet/mobile breakpoints
- [ ] Dark mode verified
- [ ] No placeholder/TODO code — production-ready, typed, no `any`
