import { useState, useMemo } from 'react'
import { Plus, Pin, MoreVertical, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuth } from '@/features/auth/AuthContext'
import { useToast } from '@/hooks/use-toast'
import { useNotificationStore } from '@/store/notificationStore'
import { EmptyState } from '@/components/common/EmptyState'
import { CreateAnnouncementDialog } from '@/components/announcements/CreateAnnouncementDialog'
import { AnnouncementDetailDialog } from '@/components/announcements/AnnouncementDetailDialog'
import type { Announcement } from '@/types'

// Mock announcements with read state
const mockAnnouncements: (Announcement & { isRead?: boolean })[] = [
  {
    id: '1',
    title: 'Mid-Term Exam Schedule Released',
    content:
      'The mid-term examination schedule for all departments has been released. Please check the academic calendar for details.',
    type: 'COLLEGE',
    isPinned: true,
    isRead: false,
    createdBy: 'hod-1',
    createdAt: '2026-07-10T00:00:00Z',
    updatedAt: '2026-07-10T00:00:00Z',
  },
  {
    id: '2',
    title: 'AI/ML Workshop Registration Open',
    content:
      'Registration is now open for the upcoming AI/ML workshop. Limited seats available. Register before July 15th.',
    type: 'DEPARTMENT',
    department: 'CSE',
    isPinned: true,
    isRead: true,
    createdBy: 'staff-1',
    createdAt: '2026-07-11T00:00:00Z',
    updatedAt: '2026-07-11T00:00:00Z',
  },
  {
    id: '3',
    title: 'Emergency: Campus Closed Tomorrow',
    content:
      'Due to heavy rainfall warning, the campus will remain closed tomorrow (July 14th). All classes are postponed.',
    type: 'EMERGENCY',
    isPinned: false,
    isRead: true,
    createdBy: 'hod-1',
    createdAt: '2026-07-13T18:00:00Z',
    updatedAt: '2026-07-13T18:00:00Z',
  },
]

const PAGINATION_LIMIT = 8

export default function AnnouncementsPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const { addNotification } = useNotificationStore()

  const canEdit = user?.role === 'HOD' || user?.role === 'STAFF'

  // State
  const [announcements, setAnnouncements] = useState<
    (Announcement & { isRead?: boolean })[]
  >(mockAnnouncements)
  const [readStates, setReadStates] = useState<Record<string, boolean>>(
    Object.fromEntries(mockAnnouncements.map((a) => [a.id, a.isRead ?? true]))
  )
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<string>('')
  const [filterDepartment, setFilterDepartment] = useState<string>('')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<
    (Announcement & { isRead?: boolean }) | null
  >(null)
  const [currentPage, setCurrentPage] = useState(1)

  // Get unique departments
  const departments = useMemo(() => {
    const depts = new Set(
      announcements
        .filter((a) => a.department && a.type === 'DEPARTMENT')
        .map((a) => a.department)
    )
    return Array.from(depts).sort()
  }, [announcements])

  // Filter announcements
  const filteredAnnouncements = useMemo(() => {
    let result = [...announcements]

    // Search by title
    if (searchQuery.trim()) {
      result = result.filter((a) =>
        a.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Filter by type
    if (filterType) {
      result = result.filter((a) => a.type === filterType)
    }

    // Filter by department (only for DEPARTMENT type)
    if (filterDepartment) {
      result = result.filter((a) => a.department === filterDepartment)
    }

    // Sort: pinned first, then by date descending
    return result.sort(
      (a, b) =>
        (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0) ||
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  }, [announcements, searchQuery, filterType, filterDepartment])

  // Pagination
  const paginatedAnnouncements = useMemo(() => {
    const startIdx = (currentPage - 1) * PAGINATION_LIMIT
    const endIdx = startIdx + PAGINATION_LIMIT
    return filteredAnnouncements.slice(startIdx, endIdx)
  }, [filteredAnnouncements, currentPage])

  const totalPages = Math.ceil(filteredAnnouncements.length / PAGINATION_LIMIT)

  // Active filter count
  const activeFilterCount = [searchQuery, filterType, filterDepartment].filter(Boolean).length

  // Event handlers
  const handleCreateAnnouncement = async (
    data: Partial<Announcement>
  ) => {
    try {
      const newAnnouncement: Announcement & { isRead?: boolean } = {
        id: `ann-${Date.now()}`,
        title: data.title || '',
        content: data.content || '',
        type: data.type || 'COLLEGE',
        department: data.department,
        isPinned: false,
        isRead: false,
        createdBy: user?.id || 'user-1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      setAnnouncements([newAnnouncement, ...announcements])
      setReadStates({ ...readStates, [newAnnouncement.id]: false })

      // Add to notification bell
      addNotification({
        id: `notif-${Date.now()}`,
        userId: user?.id || 'user-1',
        title: newAnnouncement.title,
        message: newAnnouncement.content,
        type: 'INFO',
        isRead: false,
        createdAt: new Date().toISOString(),
      })

      toast({
        title: 'Success',
        description: 'Announcement created successfully',
      })
      setIsCreateDialogOpen(false)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create announcement',
        variant: 'destructive',
      })
    }
  }

  const handleViewAnnouncement = (announcement: Announcement & { isRead?: boolean }) => {
    setSelectedAnnouncement(announcement)
    setIsDetailDialogOpen(true)
    // Mark as read
    setReadStates({ ...readStates, [announcement.id]: true })
  }

  const handleEditAnnouncement = async (updatedData: Partial<Announcement>) => {
    if (!selectedAnnouncement) return
    try {
      setAnnouncements(
        announcements.map((a) =>
          a.id === selectedAnnouncement.id
            ? {
                ...a,
                ...updatedData,
                updatedAt: new Date().toISOString(),
              }
            : a
        )
      )
      toast({
        title: 'Success',
        description: 'Announcement updated successfully',
      })
      setIsDetailDialogOpen(false)
      setSelectedAnnouncement(null)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update announcement',
        variant: 'destructive',
      })
    }
  }

  const handleDeleteAnnouncement = async () => {
    if (!selectedAnnouncement) return
    try {
      setAnnouncements(announcements.filter((a) => a.id !== selectedAnnouncement.id))
      const newReadStates = { ...readStates }
      delete newReadStates[selectedAnnouncement.id]
      setReadStates(newReadStates)
      toast({
        title: 'Success',
        description: 'Announcement deleted successfully',
      })
      setIsDeleteDialogOpen(false)
      setIsDetailDialogOpen(false)
      setSelectedAnnouncement(null)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete announcement',
        variant: 'destructive',
      })
    }
  }

  const handleTogglePin = (announcement: Announcement & { isRead?: boolean }) => {
    setAnnouncements(
      announcements.map((a) =>
        a.id === announcement.id ? { ...a, isPinned: !a.isPinned } : a
      )
    )
    toast({
      title: 'Success',
      description: announcement.isPinned ? 'Announcement unpinned' : 'Announcement pinned',
    })
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'EMERGENCY':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      case 'COLLEGE':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      case 'DEPARTMENT':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Announcements</h1>
          <p className="text-muted-foreground">View important notices and announcements</p>
        </div>
        {canEdit && (
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Announcement
          </Button>
        )}
      </div>

      {/* Filters */}
      {(announcements.length > 0 || activeFilterCount > 0) && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex gap-2 flex-wrap">
                <Input
                  placeholder="Search announcements..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="max-w-sm"
                />
                <select
                  value={filterType}
                  onChange={(e) => {
                    setFilterType(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="px-3 py-2 border rounded-md bg-background text-foreground"
                >
                  <option value="">All Types</option>
                  <option value="COLLEGE">College</option>
                  <option value="DEPARTMENT">Department</option>
                  <option value="EMERGENCY">Emergency</option>
                </select>

                {filterType === 'DEPARTMENT' && departments.length > 0 && (
                  <select
                    value={filterDepartment}
                    onChange={(e) => {
                      setFilterDepartment(e.target.value)
                      setCurrentPage(1)
                    }}
                    className="px-3 py-2 border rounded-md bg-background text-foreground"
                  >
                    <option value="">All Departments</option>
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                )}

                {activeFilterCount > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSearchQuery('')
                      setFilterType('')
                      setFilterDepartment('')
                      setCurrentPage(1)
                    }}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Clear
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Announcements List */}
      <div className="space-y-4">
        {paginatedAnnouncements.length === 0 ? (
          <EmptyState
            icon={Plus}
            title="No announcements"
            description={
              activeFilterCount > 0 ? 'Try adjusting your filters' : 'No announcements yet'
            }
          />
        ) : (
          <>
            {paginatedAnnouncements.map((announcement) => {
              const isRead = readStates[announcement.id]

              return (
                <button
                  key={announcement.id}
                  onClick={() => handleViewAnnouncement(announcement)}
                  className="w-full text-left"
                >
                  <Card
                    className={`transition-all cursor-pointer hover:shadow-md ${
                      announcement.isPinned
                        ? 'border-primary shadow-md'
                        : isRead
                          ? 'hover:shadow-md'
                          : 'border-l-4 border-l-primary shadow-md'
                    } ${isRead ? 'opacity-75' : ''}`}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-2 flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            {announcement.isPinned && (
                              <Pin className="h-4 w-4 text-primary fill-primary flex-shrink-0" />
                            )}
                            <CardTitle
                              className={`text-xl line-clamp-2 ${
                                !isRead ? 'font-bold' : ''
                              }`}
                            >
                              {announcement.title}
                            </CardTitle>
                          </div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge className={getTypeColor(announcement.type)} variant="secondary">
                              {announcement.type}
                            </Badge>
                            {announcement.department && (
                              <Badge variant="outline">{announcement.department}</Badge>
                            )}
                            <span className="text-xs text-muted-foreground">
                              {new Date(announcement.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        {/* Actions Menu */}
                        {canEdit && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setSelectedAnnouncement(announcement)
                                  setIsDetailDialogOpen(true)
                                }}
                              >
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleTogglePin(announcement)
                                }}
                              >
                                {announcement.isPinned ? 'Unpin' : 'Pin'}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setSelectedAnnouncement(announcement)
                                  setIsDeleteDialogOpen(true)
                                }}
                                className="text-red-600"
                              >
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className={`line-clamp-2 ${isRead ? 'text-muted-foreground' : ''}`}>
                        {announcement.content}
                      </p>
                    </CardContent>
                  </Card>
                </button>
              )
            })}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-4">
                <p className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Dialogs */}
      <CreateAnnouncementDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={handleCreateAnnouncement}
      />

      {selectedAnnouncement && (
        <>
          <AnnouncementDetailDialog
            open={isDetailDialogOpen}
            onOpenChange={setIsDetailDialogOpen}
            announcement={selectedAnnouncement}
            canEdit={canEdit}
            onEdit={handleEditAnnouncement}
            onDelete={() => setIsDeleteDialogOpen(true)}
          />

          <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Announcement?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently remove "{selectedAnnouncement.title}". This action cannot be
                  undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteAnnouncement}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}
    </div>
  )
}
