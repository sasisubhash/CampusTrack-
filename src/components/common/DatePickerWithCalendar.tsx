import { useState, useRef, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface DatePickerWithCalendarProps {
  date: Date
  onDateChange: (date: Date) => void
}

export function DatePickerWithCalendar({ date, onDateChange }: DatePickerWithCalendarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [displayMonth, setDisplayMonth] = useState(date.getMonth())
  const [displayYear, setDisplayYear] = useState(date.getFullYear())
  const containerRef = useRef<HTMLDivElement>(null)

  // Close picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay()
  }

  const handlePrevMonth = () => {
    if (displayMonth === 0) {
      setDisplayMonth(11)
      setDisplayYear(displayYear - 1)
    } else {
      setDisplayMonth(displayMonth - 1)
    }
  }

  const handleNextMonth = () => {
    if (displayMonth === 11) {
      setDisplayMonth(0)
      setDisplayYear(displayYear + 1)
    } else {
      setDisplayMonth(displayMonth + 1)
    }
  }

  const handleSelectDate = (day: number) => {
    const newDate = new Date(displayYear, displayMonth, day)
    onDateChange(newDate)
    setIsOpen(false)
  }

  const daysInMonth = getDaysInMonth(displayMonth, displayYear)
  const firstDay = getFirstDayOfMonth(displayMonth, displayYear)
  const days = []

  // Empty cells for days before month starts
  for (let i = 0; i < firstDay; i++) {
    days.push(null)
  }

  // Days of the month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i)
  }

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const isToday = (day: number) => {
    const today = new Date()
    return (
      day === today.getDate() &&
      displayMonth === today.getMonth() &&
      displayYear === today.getFullYear()
    )
  }

  const isSelected = (day: number) => {
    return (
      day === date.getDate() &&
      displayMonth === date.getMonth() &&
      displayYear === date.getFullYear()
    )
  }

  return (
    <div className="relative" ref={containerRef}>
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="gap-2 min-w-max"
      >
        <Calendar className="h-4 w-4" />
        {date.toLocaleDateString()}
      </Button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 z-50 p-4 w-80 rounded-lg border bg-card shadow-lg">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePrevMonth}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="text-center">
              <div className="font-semibold">
                {monthNames[displayMonth]} {displayYear}
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleNextMonth}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
              <div key={day} className="text-center text-xs font-semibold text-muted-foreground h-8 flex items-center justify-center">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar days */}
          <div className="grid grid-cols-7 gap-1 mb-4">
            {days.map((day, idx) => (
              <div key={idx}>
                {day ? (
                  <Button
                    variant={isSelected(day) ? 'default' : isToday(day) ? 'outline' : 'ghost'}
                    size="sm"
                    onClick={() => handleSelectDate(day)}
                    className="h-8 w-8 p-0 text-sm"
                  >
                    {day}
                  </Button>
                ) : (
                  <div className="h-8 w-8" />
                )}
              </div>
            ))}
          </div>

          {/* Today button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const today = new Date()
              setDisplayMonth(today.getMonth())
              setDisplayYear(today.getFullYear())
              onDateChange(today)
              setIsOpen(false)
            }}
            className="w-full"
          >
            Today
          </Button>
        </div>
      )}
    </div>
  )
}
