import { useState, useEffect, useRef } from 'react'
import { Bell, Search, Moon, Sun, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useTheme } from '@/components/theme-provider'
import { useAuth } from '@/features/auth/AuthContext'
import { useNotificationStore } from '@/store/notificationStore'
import { useNavigate } from 'react-router-dom'
import { formatDistanceToNow } from 'date-fns'

interface SearchResult {
  id: string
  type: 'student' | 'task' | 'assignment'
  title: string
  subtitle: string
  link: string
}

export function Header() {
    const { theme, setTheme } = useTheme()
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotificationStore()
    
    const [searchQuery, setSearchQuery] = useState('')
    const [searchResults, setSearchResults] = useState<SearchResult[]>([])
    const [isSearching, setIsSearching] = useState(false)
    const [showResults, setShowResults] = useState(false)
    const searchTimeoutRef = useRef<number | undefined>(undefined)
    const searchRef = useRef<HTMLDivElement>(null)

    // Mock search data
    const mockSearchData: SearchResult[] = [
      { id: '1', type: 'student', title: 'Arjun Nair', subtitle: 'CSE - 5th Sem', link: '/students' },
      { id: '2', type: 'student', title: 'Ananya Reddy', subtitle: 'CSE - 5th Sem', link: '/students' },
      { id: '3', type: 'task', title: 'Complete Tree Traversal Exercise', subtitle: 'Data Structures - Due in 2 days', link: '/tasks' },
      { id: '4', type: 'task', title: 'SQL Query Practice', subtitle: 'DBMS - Due tomorrow', link: '/tasks' },
      { id: '5', type: 'assignment', title: 'BST Implementation', subtitle: 'Data Structures - Due July 20', link: '/assignments' },
      { id: '6', type: 'assignment', title: 'Normalization Problems', subtitle: 'DBMS - Due July 22', link: '/assignments' },
    ]

    // Debounced search
    useEffect(() => {
      if (searchQuery.trim()) {
        setIsSearching(true)
        
        if (searchTimeoutRef.current) {
          clearTimeout(searchTimeoutRef.current)
        }

        searchTimeoutRef.current = setTimeout(() => {
          const filtered = mockSearchData.filter(
            item =>
              item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              item.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
          )
          setSearchResults(filtered)
          setIsSearching(false)
          setShowResults(true)
        }, 300)
      } else {
        setSearchResults([])
        setShowResults(false)
        setIsSearching(false)
      }

      return () => {
        if (searchTimeoutRef.current) {
          clearTimeout(searchTimeoutRef.current)
        }
      }
    }, [searchQuery])

    // Close search results when clicking outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
          setShowResults(false)
        }
      }

      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    // Persist theme selection
    useEffect(() => {
      if (theme) {
        localStorage.setItem('campustrack-theme', theme)
      }
    }, [theme])

    const getInitials = () => {
        if (!user) return 'U'
        return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    }
    
    const handleLogout = () => {
        logout()
        navigate('/login')
    }
    
    const handleNotificationClick = (notificationId: string, link?: string) => {
        markAsRead(notificationId)
        if (link) {
            navigate(link)
        }
    }

    const handleSearchResultClick = (result: SearchResult) => {
      setSearchQuery('')
      setShowResults(false)
      navigate(result.link)
    }

    const handleClearSearch = () => {
      setSearchQuery('')
      setShowResults(false)
    }

    const groupedResults = searchResults.reduce((acc, result) => {
      if (!acc[result.type]) {
        acc[result.type] = []
      }
      acc[result.type].push(result)
      return acc
    }, {} as Record<string, SearchResult[]>)

    return (
        <header className="flex h-14 items-center gap-4 border-b bg-white dark:bg-slate-950 px-4 lg:h-[60px] lg:px-6">
            <div className="w-full flex-1 relative" ref={searchRef}>
                <form onSubmit={(e) => e.preventDefault()}>
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search students, tasks, assignments..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full appearance-none bg-muted/50 pl-8 pr-8 shadow-none md:w-2/3 lg:w-1/3 focus-visible:ring-1"
                        />
                        {searchQuery && (
                          <button
                            type="button"
                            onClick={handleClearSearch}
                            className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                    </div>
                </form>

                {/* Search Results Dropdown */}
                {showResults && (
                  <div className="absolute top-full left-0 mt-2 w-full md:w-2/3 lg:w-1/3 bg-background border rounded-lg shadow-lg z-50 max-h-96 overflow-hidden">
                    {isSearching ? (
                      <div className="p-4 text-center text-sm text-muted-foreground">
                        Searching...
                      </div>
                    ) : searchResults.length === 0 ? (
                      <div className="p-4 text-center text-sm text-muted-foreground">
                        No results found for "{searchQuery}"
                      </div>
                    ) : (
                      <ScrollArea className="h-full max-h-96">
                        {Object.entries(groupedResults).map(([type, results]) => (
                          <div key={type} className="p-2">
                            <div className="px-2 py-1 text-xs font-semibold text-muted-foreground uppercase">
                              {type}s
                            </div>
                            {results.map((result) => (
                              <button
                                key={result.id}
                                onClick={() => handleSearchResultClick(result)}
                                className="w-full text-left px-3 py-2 hover:bg-muted rounded-md transition-colors"
                              >
                                <div className="font-medium text-sm">{result.title}</div>
                                <div className="text-xs text-muted-foreground">{result.subtitle}</div>
                              </button>
                            ))}
                          </div>
                        ))}
                      </ScrollArea>
                    )}
                  </div>
                )}
            </div>

            {/* Theme Toggle */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full">
                        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                        <span className="sr-only">Toggle theme</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setTheme("light")}>
                        Light
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("dark")}>
                        Dark
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("system")}>
                        System
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Notifications */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full relative">
                        <Bell className="h-5 w-5 text-muted-foreground" />
                        {unreadCount > 0 && (
                            <Badge 
                                variant="destructive" 
                                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                            >
                                {unreadCount > 9 ? '9+' : unreadCount}
                            </Badge>
                        )}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                    <div className="flex items-center justify-between px-2 py-2">
                        <DropdownMenuLabel className="p-0">Notifications</DropdownMenuLabel>
                        {unreadCount > 0 && (
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-auto py-1 px-2 text-xs"
                                onClick={markAllAsRead}
                            >
                                Mark all read
                            </Button>
                        )}
                    </div>
                    <DropdownMenuSeparator />
                    <ScrollArea className="h-80">
                        {notifications.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-8 text-center">
                                <Bell className="h-8 w-8 text-muted-foreground mb-2" />
                                <p className="text-sm text-muted-foreground">No notifications</p>
                            </div>
                        ) : (
                            <div className="space-y-1">
                                {notifications.map((notification) => (
                                    <DropdownMenuItem
                                        key={notification.id}
                                        className={`cursor-pointer p-3 ${!notification.isRead ? 'bg-muted/50' : ''}`}
                                        onClick={() => handleNotificationClick(notification.id, notification.link)}
                                    >
                                        <div className="flex flex-col gap-1 w-full">
                                            <div className="flex items-start justify-between gap-2">
                                                <p className="text-sm font-medium">{notification.title}</p>
                                                {!notification.isRead && (
                                                    <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-1" />
                                                )}
                                            </div>
                                            <p className="text-xs text-muted-foreground line-clamp-2">
                                                {notification.message}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                            </p>
                                        </div>
                                    </DropdownMenuItem>
                                ))}
                            </div>
                        )}
                    </ScrollArea>
                    <DropdownMenuSeparator />
                    <div className="p-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="w-full"
                        onClick={() => navigate('/notifications')}
                      >
                        View all notifications
                      </Button>
                    </div>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* User Menu */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={user?.avatar} />
                            <AvatarFallback className="bg-primary text-primary-foreground">
                                {getInitials()}
                            </AvatarFallback>
                        </Avatar>
                        <span className="sr-only">Toggle user menu</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                        <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium">
                                {user?.firstName} {user?.lastName}
                            </p>
                            <p className="text-xs text-muted-foreground">{user?.email}</p>
                            <Badge variant="secondary" className="w-fit text-xs mt-1">
                                {user?.role}
                            </Badge>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate('/settings')}>
                        Profile Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/settings')}>
                        Preferences
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600 dark:text-red-400">
                        Logout
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </header>
    )
}
