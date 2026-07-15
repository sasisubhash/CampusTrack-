import { useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, X } from 'lucide-react'
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
import { useAuth } from '@/features/auth/AuthContext'
import { useToast } from '@/hooks/use-toast'
import { EmptyState } from '@/components/common/EmptyState'
import { CreateEventDialog } from '@/components/calendar/CreateEventDialog'
import { EventDetailDialog } from '@/components/calendar/EventDetailDialog'
import { CalendarGrid } from '@/components/calendar/CalendarGrid'
import type { CalendarEvent } from '@/types'

// Mock calendar events
const mockEvents: CalendarEvent[] = [
  {
    id: '1',
    title: 'Mid-Term Examinations',
    type: 'EXAM',
    startDate: '2026-07-20',
    endDate: '2026-07-25',
    department: 'CSE',
    description: 'Mid-term exams for CSE department',
    createdBy: 'hod-1',
    createdAt: '2026-07-01T10:00:00',
    updatedAt: '2026-07-01T10:00:00',
  },
  {
    id: '2',
    title: 'AI/ML Workshop',
    type: 'WORKSHOP',
    startDate: '2026-07-18',
    endDate: '2026-07-18',
    department: 'CSE',
    description: 'Advanced AI and Machine Learning workshop',
    createdBy: 'staff-1',
    createdAt: '2026-07-10T14:30:00',
    updatedAt: '2026-07-10T14:30:00',
  },
  {
    id: '3',
    title: 'Independence Day',
    type: 'HOLIDAY',
    startDate: '2026-08-15',
    endDate: '2026-08-15',
    description: 'National holiday',
    createdBy: 'hod-1',
    createdAt: '2026-06-01T09:00:00',
    updatedAt: '2026-06-01T09:00:00',
  },
]

export default function CalendarPage() {
  const { user } = useAuth()
  const { toast } = useToast()

  const isStaffOrHOD = user?.role === 'STAFF' || user?.role === 'HOD'
  const canEditEvents = isStaffOrHOD

  // State
  const [events, setEvents] = useState<CalendarEvent[]>(mockEvents)
  const [currentDate, setCurrentDate] = useState(new Date(2026, 6, 14)) // July 14, 2026
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<string>('')
  const [filterDepartment, setFilterDepartment] = useState<string>('')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  // Filter events
  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      if (searchQuery.trim()) {
        if (!event.title.toLowerCase().includes(searchQuery.toLowerCase())) {
          return false
        }
      }
      if (filterType && event.type !== filterType) {
        return false
      }
      if (filterDepartment && event.department !== filterDepartment) {
        return false
      }
      return true
    })
  }, [events, searchQuery, filterType, filterDepartment])

  // Get unique departments for filter
  const departments = useMemo(() => {
    const depts = new Set(events.filter((e) => e.department).map((e) => e.department))
    return Array.from(depts)
  }, [events])

  // Month navigation
  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  const handleToday = () => {
    const today = new Date(2026, 6, 14) // Simulated today
    setCurrentDate(today)
  }

  const monthName = currentDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  })

  // Event handlers
  const handleCreateEvent = async (data: Partial<CalendarEvent>) => {
    try {
      const newEvent: CalendarEvent = {
        id: `event-${Date.now()}`,
        title: data.title || '',
        type: data.type || 'MEETING',
        startDate: data.startDate || '',
        endDate: data.endDate || '',
        description: data.description,
        department: data.department,
        createdBy: user?.id || 'user-1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      setEvents([...events, newEvent])
      toast({
        title: 'Success',
        description: `Event "${newEvent.title}" created successfully`,
      })
      setIsCreateDialogOpen(false)
      setSelectedDate(null)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create event',
        variant: 'destructive',
      })
    }
  }

  const handleViewEvent = (event: CalendarEvent) => {
    setSelectedEvent(event)
    setIsDetailDialogOpen(true)
  }

  const handleEditEvent = async (updatedData: Partial<CalendarEvent>) => {
    if (!selectedEvent) return
    try {
      setEvents(
        events.map((e) =>
          e.id === selectedEvent.id
            ? {
                ...e,
                ...updatedData,
                updatedAt: new Date().toISOString(),
              }
            : e
        )
      )
      toast({
        title: 'Success',
        description: 'Event updated successfully',
      })
      setIsDetailDialogOpen(false)
      setSelectedEvent(null)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update event',
        variant: 'destructive',
      })
    }
  }

  const handleDeleteEvent = async () => {
    if (!selectedEvent) return
    try {
      setEvents(events.filter((e) => e.id !== selectedEvent.id))
      toast({
        title: 'Success',
        description: 'Event deleted successfully',
      })
      setIsDeleteDialogOpen(false)
      setIsDetailDialogOpen(false)
      setSelectedEvent(null)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete event',
        variant: 'destructive',
      })
    }
  }

  const handleCreateFromDate = (date: Date) => {
    setSelectedDate(date)
    setIsCreateDialogOpen(true)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
          <p className="text-muted-foreground">View and manage academic events</p>
        </div>
        {canEditEvents && (
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Event
          </Button>
        )}
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-4">
        {/* Calendar Grid */}
        <Card className="lg:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                {monthName}
              </CardTitle>
            </div>
            <div className="flex items-center gap-2">
              {/* View Toggle */}
              <div className="flex gap-1 border rounded-md p-1 bg-muted">
                {(['month', 'week', 'day'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                      viewMode === mode
                        ? 'bg-background text-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {mode.charAt(0).toUpperCase() + mode.slice(1)}
                  </button>
                ))}
              </div>

              {/* Navigation */}
              <Button variant="outline" size="icon" onClick={handlePrevMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={handleToday}>
                Today
              </Button>
              <Button variant="outline" size="icon" onClick={handleNextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent>
            {filteredEvents.length === 0 && (searchQuery || filterType || filterDepartment) ? (
              <EmptyState
                icon={CalendarIcon}
                title="No events found"
                description="Try adjusting your filters"
              />
            ) : (
              <CalendarGrid
                currentDate={currentDate}
                events={filteredEvents}
                onDateClick={handleCreateFromDate}
                onEventClick={handleViewEvent}
              />
            )}
          </CardContent>
        </Card>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Search & Filter */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Filter Events</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="text-sm"
              />

              <div>
                <label className="text-sm font-medium mb-2 block">Type</label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md bg-background text-sm"
                >
                  <option value="">All Types</option>
                  <option value="EXAM">Exam</option>
                  <option value="WORKSHOP">Workshop</option>
                  <option value="HOLIDAY">Holiday</option>
                  <option value="MEETING">Meeting</option>
                  <option value="ASSIGNMENT_DEADLINE">Assignment Deadline</option>
                </select>
              </div>

              {departments.length > 0 && (
                <div>
                  <label className="text-sm font-medium mb-2 block">Department</label>
                  <select
                    value={filterDepartment}
                    onChange={(e) => setFilterDepartment(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md bg-background text-sm"
                  >
                    <option value="">All Departments</option>
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {(searchQuery || filterType || filterDepartment) && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    setSearchQuery('')
                    setFilterType('')
                    setFilterDepartment('')
                  }}
                >
                  <X className="h-3 w-3 mr-1" />
                  Clear Filters
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Upcoming Events
                {filteredEvents.length > 0 && (
                  <span className="text-xs font-normal text-muted-foreground ml-2">
                    ({filteredEvents.length})
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {filteredEvents.length === 0 ? (
                <p className="text-sm text-muted-foreground">No upcoming events</p>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {filteredEvents
                    .sort(
                      (a, b) =>
                        new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
                    )
                    .map((event) => (
                      <button
                        key={event.id}
                        onClick={() => handleViewEvent(event)}
                        className="w-full text-left p-3 rounded-lg border hover:bg-muted/50 transition-colors space-y-2"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-medium text-sm leading-tight line-clamp-2">
                            {event.title}
                          </h4>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge
                            className={getEventTypeColor(event.type)}
                            variant="secondary"
                          >
                            {event.type.replace(/_/g, ' ')}
                          </Badge>
                          {event.department && (
                            <Badge variant="outline" className="text-xs">
                              {event.department}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {new Date(event.startDate).toLocaleDateString()}
                          {event.startDate !== event.endDate &&
                            ` - ${new Date(event.endDate).toLocaleDateString()}`}
                        </p>
                      </button>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Dialogs */}
      <CreateEventDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={handleCreateEvent}
        prefilledDate={selectedDate}
      />

      {selectedEvent && (
        <>
          <EventDetailDialog
            open={isDetailDialogOpen}
            onOpenChange={setIsDetailDialogOpen}
            event={selectedEvent}
            onEdit={canEditEvents ? handleEditEvent : undefined}
            onDelete={canEditEvents ? () => setIsDeleteDialogOpen(true) : undefined}
          />

          <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Event?</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete "{selectedEvent.title}"? This action cannot be
                  undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteEvent}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Delete Event
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}
    </div>
  )
}

function getEventTypeColor(type: string) {
  switch (type) {
    case 'EXAM':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    case 'WORKSHOP':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
    case 'HOLIDAY':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
    case 'MEETING':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
    case 'ASSIGNMENT_DEADLINE':
      return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
  }
}
