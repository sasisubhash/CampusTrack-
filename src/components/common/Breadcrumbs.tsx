import { ChevronRight, Home } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

const routeNameMap: Record<string, string> = {
  dashboard: 'Dashboard',
  users: 'User Management',
  students: 'Students',
  attendance: 'Attendance',
  tasks: 'Daily Tasks',
  assignments: 'Assignments',
  leave: 'Leave Management',
  calendar: 'Calendar',
  announcements: 'Announcements',
  performance: 'Performance',
  reports: 'Reports',
  settings: 'Settings',
}

export function Breadcrumbs() {
  const location = useLocation()
  const pathnames = location.pathname.split('/').filter((x) => x)

  return (
    <nav className="flex items-center space-x-1 text-sm text-muted-foreground border-b bg-background px-6 py-3">
      <Link
        to="/dashboard"
        className="flex items-center hover:text-foreground transition-colors"
      >
        <Home className="h-4 w-4" />
      </Link>
      
      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join('/')}`
        const isLast = index === pathnames.length - 1
        const label = routeNameMap[value] || value.charAt(0).toUpperCase() + value.slice(1)

        return (
          <div key={to} className="flex items-center">
            <ChevronRight className="h-4 w-4 mx-1" />
            {isLast ? (
              <span className="font-medium text-foreground">{label}</span>
            ) : (
              <Link
                to={to}
                className="hover:text-foreground transition-colors"
              >
                {label}
              </Link>
            )}
          </div>
        )
      })}
    </nav>
  )
}
