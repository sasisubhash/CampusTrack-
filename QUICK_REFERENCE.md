# CampusTrack - Quick Reference Guide

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🔑 Login Credentials

### HOD Account:
- **Email**: hod@college.edu
- **Password**: password123
- **Access**: All modules

### Staff Account:
- **Email**: staff1@college.edu
- **Password**: password123
- **Access**: Dashboard, Students, Attendance, Tasks, Assignments, Leave, Calendar, Announcements

### Student Account:
- **Email**: student1@college.edu
- **Password**: password123
- **Access**: Dashboard, Tasks, Assignments, Calendar, Announcements, Performance

### Parent Account:
- **Email**: parent1@example.com
- **Password**: password123
- **Access**: Dashboard, Performance, Announcements

## 📁 Key Files

### Configuration:
- `vite.config.ts` - Vite configuration
- `tailwind.config.js` - Tailwind CSS config
- `tsconfig.json` - TypeScript config
- `components.json` - Shadcn UI config

### Entry Points:
- `src/main.tsx` - Application entry
- `src/App.tsx` - Main app component with routes
- `index.html` - HTML entry

### Core Files:
- `src/types/index.ts` - All TypeScript types (30+ interfaces)
- `src/data/mockData.ts` - Mock data (200+ records)
- `src/constants/index.ts` - Constants
- `src/config/navigation.tsx` - Navigation config

## 🎨 Component Library

### UI Components (Shadcn - 28 components):
```
src/components/ui/
├── alert-dialog.tsx
├── alert.tsx
├── avatar.tsx
├── badge.tsx
├── breadcrumb.tsx
├── button.tsx
├── card.tsx
├── checkbox.tsx
├── dialog.tsx
├── dropdown-menu.tsx
├── form.tsx
├── input.tsx
├── label.tsx
├── pagination.tsx
├── scroll-area.tsx
├── select.tsx
├── separator.tsx
├── sheet.tsx
├── skeleton.tsx
├── switch.tsx
├── table.tsx
├── tabs.tsx
├── textarea.tsx
├── toast.tsx
├── toaster.tsx
└── use-toast.ts
```

### Common Components:
```
src/components/common/
├── Breadcrumbs.tsx        # Breadcrumb navigation
├── DataTable.tsx          # Reusable data table
├── EmptyState.tsx         # Empty state component
├── ErrorState.tsx         # Error state component
└── LoadingSpinner.tsx     # Loading spinner
```

### Layout Components:
```
src/components/layout/
├── Header.tsx             # Top header with search, notifications
├── MainLayout.tsx         # Main app layout wrapper
└── Sidebar.tsx            # Collapsible sidebar navigation
```

## 🎯 Module Status

| Module | Status | Features |
|--------|--------|----------|
| Authentication | ✅ Complete | Login, protected routes, role-based |
| Dashboard (HOD) | ✅ Complete | Charts, top performers, quick actions |
| Dashboard (Staff) | ✅ Complete | Attendance entry, progress chart |
| Dashboard (Student) | ✅ Complete | Calendar, performance chart, tasks |
| Dashboard (Parent) | ✅ Complete | Child switcher, attendance, subjects |
| User Management | ✅ Complete | Full CRUD, filters, bulk actions, export |
| Students | 🔄 Placeholder | Needs full implementation |
| Attendance | 🔄 Placeholder | Needs full implementation |
| Tasks | 🔄 Placeholder | Needs full implementation |
| Assignments | 🔄 Placeholder | Needs full implementation |
| Leave | 🔄 Placeholder | Needs full implementation |
| Calendar | 🔄 Placeholder | Needs full implementation |
| Announcements | 🔄 Placeholder | Needs full implementation |
| Performance | 🔄 Placeholder | Needs full implementation |
| Reports | 🔄 Placeholder | Needs full implementation |
| Settings | 🔄 Placeholder | Needs full implementation |

## 🛠️ Common Tasks

### Add a New Module:

1. **Create page component**:
```typescript
// src/pages/NewModule.tsx
export default function NewModulePage() {
  // Implementation
}
```

2. **Add route**:
```typescript
// src/App.tsx
<Route path="/new-module" element={<NewModulePage />} />
```

3. **Add to navigation**:
```typescript
// src/config/navigation.tsx
{
  label: 'New Module',
  href: '/new-module',
  icon: IconComponent,
  roles: ['HOD', 'STAFF'],
}
```

### Create a New Component:

```bash
# Using Shadcn CLI (for UI components)
npx shadcn-ui@latest add [component-name]

# Manual creation
# Create file in appropriate folder
# Export component
# Import where needed
```

### Add Mock Data:

```typescript
// src/data/mockData.ts
export const mockNewData: NewType[] = [
  {
    id: 'id-1',
    // ... fields
  },
]
```

### Create Service:

```typescript
// src/services/newService.ts
import { delay } from './mockApi'

export const newService = {
  getAll: async () => {
    await delay(500)
    return { data: mockNewData }
  },
  // ... CRUD methods
}
```

## 🎨 Styling Guide

### Tailwind Classes:
```typescript
// Common patterns
className="p-6 space-y-6"                    // Page container
className="text-3xl font-bold tracking-tight" // Page title
className="text-muted-foreground"            // Subtitle
className="rounded-lg border bg-card"        // Card container
className="hover:shadow-md transition-shadow" // Hover effect
```

### Color Classes:
```typescript
// Primary
className="bg-primary text-primary-foreground"

// Status badges
className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
```

### Responsive:
```typescript
className="hidden md:block"        // Desktop only
className="md:hidden"              // Mobile only
className="grid md:grid-cols-2"    // Responsive grid
```

## 📊 Data Fetching Pattern

```typescript
// Using TanStack Query
const { data, isLoading, error, refetch } = useQuery({
  queryKey: ['key'],
  queryFn: () => service.getAll(),
})

// Mutation
const mutation = useMutation({
  mutationFn: service.create,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['key'] })
    toast({ title: 'Success' })
  },
})
```

## 🔐 Auth Pattern

```typescript
// Get current user
const { user } = useAuth()

// Check role
if (user?.role === 'HOD') {
  // HOD-only logic
}

// Logout
const { logout } = useAuth()
logout()
```

## 📱 Responsive Breakpoints

```typescript
// Tailwind breakpoints
sm: '640px'   // Small tablets
md: '768px'   // Tablets
lg: '1024px'  // Desktops
xl: '1280px'  // Large desktops
2xl: '1536px' // Extra large
```

## 🎯 Toast Notifications

```typescript
import { useToast } from '@/hooks/use-toast'

const { toast } = useToast()

// Success
toast({
  title: 'Success',
  description: 'Action completed successfully',
})

// Error
toast({
  title: 'Error',
  description: 'Something went wrong',
  variant: 'destructive',
})
```

## 📝 Form Pattern

```typescript
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

const schema = z.object({
  field: z.string().min(2),
})

const form = useForm({
  resolver: zodResolver(schema),
  defaultValues: { field: '' },
})

const onSubmit = (data) => {
  // Handle submission
}
```

## 🚦 Route Protection

```typescript
// App.tsx - Wrap protected routes
<Route element={<ProtectedRoute />}>
  <Route element={<MainLayout />}>
    {/* Protected routes */}
  </Route>
</Route>

// Component-level guard
useEffect(() => {
  if (user?.role !== 'HOD') {
    navigate('/dashboard')
  }
}, [user])
```

## 💡 Tips

### Performance:
- Use `useMemo` for expensive calculations
- Use `React.memo` for expensive components
- Lazy load routes with `React.lazy()`

### TypeScript:
- Always type props interfaces
- Avoid `any` - use `unknown` or proper types
- Use type imports: `import type { Type } from '...'`

### Styling:
- Use Tailwind utilities first
- Create custom components for repeated patterns
- Maintain consistent spacing (p-6, space-y-6)

### State:
- Local state for UI (useState)
- Zustand for global app state
- TanStack Query for server state

## 📚 Resources

- **Tailwind CSS**: https://tailwindcss.com/docs
- **Shadcn UI**: https://ui.shadcn.com
- **TanStack Table**: https://tanstack.com/table
- **TanStack Query**: https://tanstack.com/query
- **React Hook Form**: https://react-hook-form.com
- **Zod**: https://zod.dev
- **Lucide Icons**: https://lucide.dev

## 🐛 Troubleshooting

### Build Errors:
```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run build
```

### Type Errors:
```bash
# Check TypeScript
npx tsc --noEmit
```

### Missing Types:
```bash
# Install type definitions
npm install -D @types/[package-name]
```

## 📞 Support

For issues or questions:
1. Check documentation files in project root
2. Review completed modules for patterns
3. Check console for errors
4. Verify mock data structure

---

**Last Updated**: Build passing, User Management complete, 40% overall progress
