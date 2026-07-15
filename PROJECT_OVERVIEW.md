# CampusTrack - College Activity Monitoring System

## Overview
CampusTrack is a modern, enterprise-grade College ERP dashboard for monitoring academic activity across four roles: **HOD (Super Admin)**, **Staff (Admin)**, **Student (End User)**, and **Parent (Viewer)**.

## Tech Stack
- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Components**: Shadcn/UI
- **Icons**: Lucide React
- **State Management**: Zustand
- **Server-state Cache**: TanStack Query
- **Routing**: React Router DOM
- **Forms**: React Hook Form + Zod
- **Charts**: Recharts
- **Date Utilities**: date-fns

## Demo Credentials

### HOD (Super Admin)
- Email: `hod@college.edu`
- Password: `password123`

### Staff (Admin)
- Email: `staff1@college.edu`
- Password: `password123`

### Student (End User)
- Email: `student1@college.edu`
- Password: `password123`

### Parent (Viewer)
- Email: `parent1@example.com`
- Password: `password123`

## Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to:
```
http://localhost:5173
```

## Project Structure

```
src/
├── assets/              # Static assets
├── components/          
│   ├── common/         # Reusable components
│   ├── layout/         # Layout components (Sidebar, Header, MainLayout)
│   └── ui/             # Shadcn/UI components
├── config/             # Configuration files (navigation)
├── constants/          # App constants
├── data/               # Mock data
├── features/           # Feature-based modules
│   ├── auth/          # Authentication
│   └── dashboard/     # Role-specific dashboards
├── hooks/              # Custom hooks
├── pages/              # Page components
├── services/           # API service layer (mock)
├── store/              # Zustand stores
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
├── App.tsx            # Main app component
└── main.tsx           # Entry point
```

## Features Implemented

### Phase 1: Foundation ✅
- [x] Project scaffolding with Vite + React + TypeScript
- [x] Tailwind CSS setup with custom theme
- [x] Dark/Light mode support
- [x] Folder structure
- [x] Type definitions for all entities
- [x] Mock data generation
- [x] Mock API service layer with simulated latency

### Phase 2: Authentication & Layout ✅
- [x] Login page with role-based authentication
- [x] Zustand store for auth state management
- [x] Protected routes
- [x] Responsive sidebar with role-based navigation
- [x] Header with search, notifications, theme toggle, and user menu
- [x] Mobile-responsive layout

### Phase 3: Dashboards ✅
- [x] HOD Dashboard (department analytics, stats, activity feed)
- [x] Staff Dashboard (today's schedule, pending tasks, quick actions)
- [x] Student Dashboard (attendance, tasks, performance, events)
- [x] Parent Dashboard (child's performance, announcements)

## Role-Based Access Control

The application implements strict role-based permissions:

### HOD (Super Admin)
- Full access to all modules
- User management (CRUD)
- System-wide reports and analytics
- Department configuration

### Staff (Admin)
- Attendance management (CRUD)
- Task & Assignment creation
- Leave approval
- Student performance viewing
- Subject management

### Student (End User)
- View own attendance and performance
- Submit assignments
- Apply for leave
- View tasks and calendar
- Profile management

### Parent (Viewer)
- View child's attendance
- View child's performance
- View announcements
- Confirm leave requests
- View calendar events

## Next Steps

The following modules are ready to be implemented following the same pattern:

1. **User Management** (HOD only)
2. **Student Management** (All roles with different permissions)
3. **Attendance Module** (Staff CRUD, others view)
4. **Daily Tasks & Assignments** (Staff create, Students submit)
5. **Leave Management** (Full workflow)
6. **Calendar Scheduler** (FullCalendar integration)
7. **Announcements** (Create, view, notifications)
8. **Performance Analytics** (Charts with Recharts/ApexCharts)
9. **Reports** (PDF/Excel export)
10. **Settings** (Profile, preferences, system config)

## Design System

### Colors
- Primary: `#2563EB` (Blue)
- Background: `#F8FAFC`
- Surface: White
- Border Radius: `16px`

### Components
All UI components follow the Shadcn/UI design system with custom theming for both light and dark modes.

### Responsive Breakpoints
- Mobile: < 768px (sidebar collapses to drawer)
- Tablet: 768px - 1024px
- Desktop: > 1024px

## Development Guidelines

### Adding a New Module

1. Create feature folder: `src/features/<module-name>/`
2. Add types to `src/types/index.ts`
3. Add mock data to `src/data/mockData.ts`
4. Create API service in `src/services/<module>Service.ts`
5. Create Zustand store if needed in `src/store/<module>Store.ts`
6. Build components following the common component library
7. Add route to `src/App.tsx`
8. Update navigation config if needed

### Mock API Pattern

```typescript
// Service
export const moduleService = {
  getAll: async () => mockFetch(mockData),
  create: async (data) => mockCreate(data),
  update: async (id, data) => mockUpdate(data),
  delete: async (id) => mockDelete(id),
}

// Component with TanStack Query
const { data, isLoading, error } = useQuery({
  queryKey: ['module-key'],
  queryFn: moduleService.getAll,
})
```

## Build for Production

```bash
npm run build
```

The build output will be in the `dist/` folder.

## Contributing

1. Follow the existing code structure
2. Use TypeScript strictly (no `any` types)
3. Implement all four states: loading, success, empty, error
4. Test on mobile, tablet, and desktop
5. Ensure dark mode compatibility
6. Add proper error handling and user feedback

## License

This project is for educational purposes.
