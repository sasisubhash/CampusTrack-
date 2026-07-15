import { useMemo } from 'react'
import type { CalendarEvent } from '@/types'

interface CalendarGridProps {
  currentDate: Date
  events: CalendarEvent[]
  onDateClick: (date: Date) => void
  onEventClick: (event: CalendarEvent) => void
}

function getEventTypeColor(type: string) {
  switch (type) {
    case 'EXAM':
      return 'bg-red-500'
    case 'WORKSHOP':
      return 'bg-purple-500'
    case 'HOLIDAY':
      return 'bg-green-500'
    case 'MEETING':
      return 'bg-blue-500'
    case 'ASSIGNMENT_DEADLINE':
      return 'bg-amber-500'
    default:
      return 'bg-gray-500'
  }
}

export function CalendarGrid({
  currentDate,
  events,
  onDateClick,
  onEventClick,
}: CalendarGridProps) {
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const today = new Date(2026, 6, 14) // Simulated today

  // Get first day of month and total days
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const daysInPrevMonth = new Date(year, month, 0).getDate()

  // Create array of all days to display
  const calendarDays = []
  for (let i = firstDay - 1; i >= 0; i--) {
    calendarDays.push({
      day: daysInPrevMonth - i,
      isCurrentMonth: false,
      isToday: false,
    })
  }

  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(year, month, i)
    calendarDays.push({
      day: i,
      isCurrentMonth: true,
      isToday:
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear(),
      date,
    })
  }

  const remainingDays = 42 - calendarDays.length
  for (let i = 1; i <= remainingDays; i++) {
    calendarDays.push({
      day: i,
      isCurrentMonth: false,
      isToday: false,
    })
  }

  // Get events for each day
  const eventsByDate = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>()

    events.forEach((event) => {
      const startDate = new Date(event.startDate)
      const endDate = new Date(event.endDate)

      for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        const dateKey = d.toISOString().split('T')[0]
        if (!map.has(dateKey)) {
          map.set(dateKey, [])
        }
        map.get(dateKey)?.push(event)
      }
    })

    return map
  }, [events])

  return (
    <div className="space-y-2">
      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="text-center font-semibold text-muted-foreground text-xs p-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1 auto-rows-max">
        {calendarDays.map((calDay, idx) => {
          const dateKey = calDay.isCurrentMonth && calDay.date
            ? calDay.date.toISOString().split('T')[0]
            : null
          const dayEvents = dateKey ? eventsByDate.get(dateKey) || [] : []
          const displayEvents = dayEvents.slice(0, 2)
          const remainingCount = Math.max(0, dayEvents.length - 2)

          return (
            <button
              key={idx}
              onClick={() => {
                if (calDay.isCurrentMonth && calDay.date) {
                  onDateClick(calDay.date)
                }
              }}
              disabled={!calDay.isCurrentMonth}
              className={`min-h-24 p-2 rounded-lg border transition-colors ${
                calDay.isCurrentMonth
                  ? calDay.isToday
                    ? 'bg-primary text-primary-foreground border-primary font-bold'
                    : 'bg-card hover:bg-muted cursor-pointer border-border'
                  : 'bg-muted/30 text-muted-foreground border-transparent'
              }`}
            >
              <div className="flex flex-col h-full">
                <div className="text-sm font-semibold mb-1">{calDay.day}</div>
                <div className="flex-1 space-y-0.5 min-w-0">
                  {displayEvents.map((event) => (
                    <button
                      key={event.id}
                      onClick={(e) => {
                        e.stopPropagation()
                        onEventClick(event)
                      }}
                      className={`w-full text-left text-xs px-1 py-0.5 rounded line-clamp-1 ${getEventTypeColor(event.type)} text-white hover:opacity-90 transition-opacity`}
                      title={event.title}
                    >
                      {event.title}
                    </button>
                  ))}
                  {remainingCount > 0 && (
                    <div className="text-xs px-1 py-0.5 text-muted-foreground">
                      +{remainingCount} more
                    </div>
                  )}
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
