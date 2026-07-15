import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { Breadcrumbs } from '@/components/common/Breadcrumbs'
import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

export function MainLayout() {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
        const saved = localStorage.getItem('campustrack-sidebar-collapsed')
        return saved ? JSON.parse(saved) : false
    })
    const [isMobileOpen, setIsMobileOpen] = useState(false)

    const toggleSidebar = () => {
        setIsSidebarCollapsed(!isSidebarCollapsed)
    }

    // Persist sidebar collapse state
    useEffect(() => {
        localStorage.setItem('campustrack-sidebar-collapsed', JSON.stringify(isSidebarCollapsed))
    }, [isSidebarCollapsed])

    return (
        <div className="flex h-screen !overflow-hidden bg-slate-50 dark:bg-slate-900">
            {/* Desktop Sidebar */}
            <Sidebar isCollapsed={isSidebarCollapsed} toggleSidebar={toggleSidebar} />

            <div className="flex flex-col flex-1 overflow-hidden transition-all duration-300">
                {/* Mobile Header / Trigger */}
                <div className="md:hidden flex items-center px-4 py-3 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
                    <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Menu className="h-6 w-6" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="p-0 bg-white dark:bg-slate-950 border-r-slate-200 dark:border-r-slate-800 w-72">
                            <Sidebar
                                isCollapsed={false}
                                toggleSidebar={() => setIsMobileOpen(false)}
                                className="flex w-full h-full border-r-0"
                            />
                        </SheetContent>
                    </Sheet>
                    <span className="ml-4 font-bold text-lg flex items-center gap-2">
                        <span className="text-primary">CampusTrack</span>
                    </span>
                </div>

                {/* Desktop Header */}
                <div className="hidden md:block">
                    <Header />
                </div>

                {/* Breadcrumbs */}
                <div className="hidden md:block">
                    <Breadcrumbs />
                </div>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-900">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}
