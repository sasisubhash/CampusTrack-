import { useAuth } from '@/features/auth/AuthContext'
import { HODDashboard } from '@/features/dashboard/HODDashboard'
import { StaffDashboard } from '@/features/dashboard/StaffDashboard'
import { StudentDashboard } from '@/features/dashboard/StudentDashboard'
import { ParentDashboard } from '@/features/dashboard/ParentDashboard'

export default function Dashboard() {
  const { user } = useAuth()

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  switch (user.role) {
    case 'HOD':
      return <HODDashboard />
    case 'STAFF':
      return <StaffDashboard />
    case 'STUDENT':
      return <StudentDashboard />
    case 'PARENT':
      return <ParentDashboard />
    default:
      return (
        <div className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">Invalid user role</p>
        </div>
      )
  }
}
