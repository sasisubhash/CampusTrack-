import { Link, useLocation, useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
    LogOut,
    ChevronLeft,
    ChevronRight,
    GraduationCap
} from 'lucide-react'
import { useAuth } from '@/features/auth/AuthContext'
import { getNavigationForRole } from '@/config/navigation'

interface SidebarProps {
    isCollapsed: boolean
    toggleSidebar: () => void
    className?: string
}

export function Sidebar({ isCollapsed, toggleSidebar, className }: SidebarProps) {
    const location = useLocation()
    const navigate = useNavigate()
    const { user, logout } = useAuth()
    
    const navItems = user ? getNavigationForRole(user.role) : []
    
    const handleLogout = () => {
        logout()
        navigate('/login')
    }
    
    const getInitials = () => {
        if (!user) return 'U'
        return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    }

    return (
        <div
            className={cn(
                "hidden border-r bg-white dark:bg-slate-950 md:flex flex-col flex-shrink-0 transition-all duration-300 ease-in-out relative z-20",
                isCollapsed ? "w-16" : "w-64",
                className
            )}
        >
            {/* Sidebar Header / Logo */}
            <div className={cn(
                "flex h-16 items-center border-b border-slate-200 dark:border-slate-800 transition-all duration-300 px-4",
                isCollapsed ? "justify-center" : "justify-between"
            )}>
                <Link to="/dashboard" className={cn("flex items-center gap-2 font-semibold", isCollapsed && "justify-center")}>
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary shrink-0">
                        <GraduationCap className="h-5 w-5 text-primary-foreground" />
                    </div>
                    {!isCollapsed && (
                        <span className="text-xl font-bold text-slate-900 dark:text-white tracking-tight animate-in fade-in duration-300">CampusTrack</span>
                    )}
                </Link>

                {!isCollapsed && (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleSidebar}
                        className="h-8 w-8 text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 hidden md:flex"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                )}
            </div>

            {/* Collapsed Toggle Button (Visible only when collapsed) */}
            {isCollapsed && (
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleSidebar}
                    className="absolute -right-3 top-20 h-6 w-6 rounded-full bg-primary text-primary-foreground shadow-md hover:bg-primary/90 z-50 hidden md:flex"
                >
                    <ChevronRight className="h-3 w-3" />
                </Button>
            )}

            {/* Navigation Items */}
            <div className="flex-1 overflow-x-hidden overflow-y-auto py-4">
                <nav className="grid items-start px-2 text-sm font-medium gap-1">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.href
                        return (
                            <Link
                                key={item.href}
                                to={item.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-lg py-2.5 transition-all duration-200 group relative",
                                    isActive
                                        ? "bg-primary text-primary-foreground shadow-sm"
                                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-50",
                                    isCollapsed ? "justify-center px-2" : "px-3"
                                )}
                                title={isCollapsed ? item.label : undefined}
                            >
                                <item.icon className={cn("h-4 w-4 shrink-0 transition-colors", isActive ? "text-primary-foreground" : "text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200")} />

                                {!isCollapsed && (
                                    <span className="animate-in fade-in duration-300 whitespace-nowrap overflow-hidden">
                                        {item.label}
                                    </span>
                                )}

                                {isActive && !isCollapsed && (
                                    <div className="ml-auto w-1 h-1 rounded-full bg-primary-foreground/50" />
                                )}
                            </Link>
                        )
                    })}
                </nav>
            </div>

            {/* User Profile / Footer */}
            <div className="mt-auto p-4 border-t border-slate-200 dark:border-slate-800">
                <div className={cn("flex items-center gap-3 mb-4", isCollapsed ? "justify-center" : "px-2")}>
                    <Avatar className="h-8 w-8 shrink-0 cursor-pointer hover:opacity-80 transition-opacity">
                        <AvatarImage src={user?.avatar} />
                        <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                            {getInitials()}
                        </AvatarFallback>
                    </Avatar>
                    {!isCollapsed && user && (
                        <div className="flex flex-col animate-in fade-in duration-300 min-w-0">
                            <span className="text-sm font-medium text-slate-900 dark:text-white truncate">
                                {user.firstName} {user.lastName}
                            </span>
                            <span className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.role}</span>
                        </div>
                    )}
                </div>
                <Button
                    variant="ghost"
                    onClick={handleLogout}
                    className={cn(
                        "w-full gap-2 text-slate-500 hover:text-red-600 hover:bg-red-50 dark:text-slate-400 dark:hover:text-red-400 dark:hover:bg-red-950/30 transition-colors h-9",
                        isCollapsed ? "justify-center px-0" : "justify-start"
                    )}
                    title={isCollapsed ? "Sign Out" : undefined}
                >
                    <LogOut className="h-4 w-4 shrink-0" />
                    {!isCollapsed && <span>Sign Out</span>}
                </Button>
            </div>
        </div>
    )
}
