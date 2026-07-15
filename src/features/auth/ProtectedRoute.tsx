import { Navigate, useLocation, Outlet } from 'react-router-dom'
import { useAuth } from './AuthContext'

export function ProtectedRoute() {
    const { isAuthenticated, isLoading } = useAuth()
    const location = useLocation()

    if (isLoading) {
        console.log('ProtectedRoute: isLoading is true')
        return <div className="flex h-screen items-center justify-center">Loading...</div>
    }

    if (!isAuthenticated) {
        console.log('ProtectedRoute: User not authenticated, redirecting to login')
        return <Navigate to="/login" state={{ from: location }} replace />
    }

    console.log('ProtectedRoute: Authenticated, rendering outlet')
    return <Outlet />
}
