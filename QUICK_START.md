# 🚀 Quick Start Guide - CampusTrack

## 1. Start Development Server

```bash
npm run dev
```

The app will open at: **http://localhost:5173**

## 2. Login with Demo Accounts

### 🎓 HOD (Super Admin)
```
Email: hod@college.edu
Password: password123
```
**Can access**: Everything

### 👨‍🏫 Staff (Admin)
```
Email: staff1@college.edu  
Password: password123
```
**Can access**: Attendance, Tasks, Assignments, Leave Approval

### 👨‍🎓 Student (End User)
```
Email: student1@college.edu
Password: password123
```
**Can access**: Own attendance, tasks, assignments, performance

### 👨‍👩‍👧 Parent (Viewer)
```
Email: parent1@example.com
Password: password123
```
**Can access**: Child's attendance, performance, announcements

## 3. Navigate the App

### After Login:
1. **Dashboard** - See role-specific overview
2. **Sidebar** - Navigate to different modules
3. **Notifications** - Click bell icon (top right)
4. **Theme Toggle** - Switch between light/dark mode
5. **Profile Menu** - Click avatar (top right)

## 4. Test Role-Based Access

Try logging in with different roles to see how the UI changes:
- Navigation menu items change per role
- Dashboard widgets are different
- Permissions enforced throughout

## 5. Project Structure at a Glance

```
src/
├── features/           # Feature modules
│   ├── auth/          # Login, context
│   └── dashboard/     # 4 role-based dashboards
├── components/
│   ├── layout/        # Sidebar, Header
│   └── ui/            # Reusable UI components
├── data/              # mockData.ts (200+ records)
├── services/          # API layer
├── store/             # Zustand stores
├── types/             # TypeScript definitions
└── App.tsx            # Routes
```

## 6. Building Next Module

To add a new module (e.g., User Management):

### Step 1: Add Types
```typescript
// src/types/index.ts
export interface User {
  // ... add new fields if needed
}
```

### Step 2: Add Mock Data
```typescript
// src/data/mockData.ts
export const mockUsers: User[] = [...]
```

### Step 3: Create Service
```typescript
// src/services/userService.ts
export const userService = {
  getAll: async () => mockFetch(mockUsers),
  create: async (user) => mockCreate(user),
  // ...
}
```

### Step 4: Create Page
```typescript
// src/pages/Users.tsx
export default function UsersPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: userService.getAll,
  })
  // ...
}
```

### Step 5: Add Route
```typescript
// src/App.tsx
<Route path="/users" element={<UsersPage />} />
```

## 7. Key Features

### ✅ Already Working:
- Login with 4 different roles
- Role-based navigation
- Dark/Light mode
- Notifications (with badge)
- 4 unique dashboards
- Responsive design
- Mock API with simulated latency

### 🚧 Ready to Build:
- User Management (CRUD)
- Attendance Module
- Tasks & Assignments
- Leave Management
- Calendar
- Announcements
- Performance Analytics
- Reports
- Settings

## 8. Common Commands

```bash
# Development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 9. Troubleshooting

### Port already in use?
```bash
# Kill process on port 5173 (Windows)
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

### Dependencies not working?
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Build errors?
```bash
# Check TypeScript errors
npx tsc --noEmit
```

## 10. Development Tips

1. **Use TypeScript strictly** - No `any` types
2. **Follow the patterns** - Check existing code for examples
3. **Mock API first** - Build UI before backend integration
4. **Test all 4 states** - Loading, Success, Empty, Error
5. **Mobile first** - Test responsive design
6. **Dark mode** - Check both themes

## 11. What Makes This Project Special?

✨ **Production-Ready Foundation**
- Enterprise-grade architecture
- Type-safe throughout
- Consistent patterns
- Scalable structure

🎨 **Beautiful UI**
- Modern SaaS design
- Smooth animations
- Professional look
- Mobile responsive

🔐 **Secure by Design**
- Role-based access control
- Protected routes
- Type-safe permissions
- Auth state management

📦 **Developer Experience**
- Hot module reload
- TypeScript autocomplete
- Clear folder structure
- Documented patterns

## 12. Next Steps

1. **Explore the code** - Check how dashboards are built
2. **Try all roles** - Login with different accounts
3. **Pick a module** - Start with User Management
4. **Follow patterns** - Use existing code as reference
5. **Build iteratively** - Complete one module before next

---

**Need Help?**
- Check `PROJECT_OVERVIEW.md` for detailed documentation
- Check `IMPLEMENTATION_STATUS.md` for what's done
- Review existing components for patterns
- Look at mock data structure in `src/data/mockData.ts`

**Happy Coding! 🚀**
