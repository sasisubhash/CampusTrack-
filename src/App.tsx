import { Routes, Route, Navigate } from 'react-router-dom'
import { MainLayout } from '@/components/layout/MainLayout'
import LoginPage from '@/features/auth/LoginPage'
import { ProtectedRoute } from '@/features/auth/ProtectedRoute'
import { AuthProvider } from '@/features/auth/AuthContext'
import { Toaster } from '@/components/ui/toaster'
import Dashboard from '@/pages/Dashboard'
import UsersPage from '@/pages/Users'
import StudentsPage from '@/pages/Students'
import AttendancePage from '@/pages/Attendance'
import TasksPage from '@/pages/Tasks'
import AssignmentsPage from '@/pages/Assignments'
import LeavePage from '@/pages/Leave'
import CalendarPage from '@/pages/CalendarPage'
import AnnouncementsPage from '@/pages/Announcements'
import PerformancePage from '@/pages/Performance'
import ReportsPage from '@/pages/Reports'
import SettingsPage from '@/pages/Settings'


function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/students" element={<StudentsPage />} />
            <Route path="/attendance" element={<AttendancePage />} />
            <Route path="/tasks" element={<TasksPage />} />
            <Route path="/assignments" element={<AssignmentsPage />} />
            <Route path="/leave" element={<LeavePage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/announcements" element={<AnnouncementsPage />} />
            <Route path="/performance" element={<PerformancePage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
      <Toaster />
    </AuthProvider>
  )
}

export default App
