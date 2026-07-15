import { useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface DayAttendance {
  date: Date
  percentage: number
  studentsPresent: number
  totalStudents: number
}

interface MonthlyAttendanceCalendarProps {
  year: number
  month: number
  onMonthChange: (year: number, month: number) => void
  attendanceData: Record<string, { present: number; total: number }>
}

export function MonthlyAttendanceCalendar({
  year,
  month,
  onMonthChange,
  attendanceData,
}: MonthlyAttendanceCalendarProps) {
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDayOfMonth = new Date(year, month, 1).getDay()

  const days = useMemo(() => {
    const result: (DayAttendance | null)[] = []

    // Add empty cells for days before the first day
    for (let i = 0; i < firstDayOfMonth; i++) {
      result.push(null)
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day)
      const dateStr = date.toISOString().split('T')[0]
      const data = attendanceData[dateStr]

      result.push({
        date,
        percentage: data ? Math.round((data.present / data.total) * 100) : 0,
        studentsPresent: data?.present || 0,
        totalStudents: data?.total || 0,
      })
    }

    return result
  }, [year, month, daysInMonth, firstDayOfMonth, attendanceData])

  const handlePrevMonth = () => {
    if (month === 0) {
      onMonthChange(year - 1, 11)
    } else {
      onMonthChange(year, month - 1)
    }
  }

  const handleNextMonth = () => {
    if (month === 11) {
      onMonthChange(year + 1, 0)
    } else {
      onMonthChange(year, month + 1)
    }
  }

  const getColorClass = (percentage: number) => {
    if (percentage === 0) return 'bg-muted text-muted-foreground'
    if (percentage >= 90) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
    if (percentage >= 75) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
    return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
  }

  const monthName = new Date(year, month, 1).toLocaleString('default', { month: 'long', year: 'numeric' })

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>{monthName}</CardTitle>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handlePrevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Legend */}
          <div className="flex gap-4 flex-wrap text-xs">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-green-100 dark:bg-green-900" />
              <span>≥90%</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-yellow-100 dark:bg-yellow-900" />
              <span>75-89%</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-red-100 dark:bg-red-900" />
              <span>&lt;75%</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-muted" />
              <span>No data</span>
            </div>
          </div>

          {/* Calendar Grid */}
          <div>
            {/* Weekday headers */}
            <div className="grid grid-cols-7 gap-2 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="text-xs font-semibold text-center text-muted-foreground">
                  {day}
                </div>
              ))}
            </div>

            {/* Days */}
            <div className="grid grid-cols-7 gap-2">
              {days.map((day, index) => (
                <div
                  key={index}
                  className={`aspect-square rounded-lg flex flex-col items-center justify-center text-xs font-medium ${
                    day ? getColorClass(day.percentage) : 'bg-transparent'
                  }`}
                  title={
                    day
                      ? `${day.studentsPresent}/${day.totalStudents} present (${day.percentage}%)`
                      : undefined
                  }
                >
                  {day && (
                    <>
                      <span>{day.date.getDate()}</span>
                      {day.totalStudents > 0 && <span className="text-xs opacity-75">{day.percentage}%</span>}
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
