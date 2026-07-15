import { useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { UserCheck, ClipboardList, BookOpen, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import ReactApexChart from 'react-apexcharts'
import type { ApexOptions } from 'apexcharts'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import type { EventClickArg } from '@fullcalendar/core'

export function StudentDashboard() {
  const navigate = useNavigate()
  const calendarRef = useRef<FullCalendar>(null)

  const stats = [
    {
      title: 'Attendance',
      value: '85%',
      change: '17/20 classes',
      icon: UserCheck,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/20',
    },
    {
      title: 'Pending Tasks',
      value: '3',
      change: '2 due this week',
      icon: ClipboardList,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100 dark:bg-orange-900/20',
    },
    {
      title: 'Assignments',
      value: '2',
      change: '1 submitted, 1 pending',
      icon: BookOpen,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
    },
    {
      title: 'Performance',
      value: '87.6%',
      change: '+3.2% from last month',
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20',
    },
  ]

  const pendingTasks = [
    {
      id: '1',
      title: 'Complete Tree Traversal Exercise',
      subject: 'Data Structures',
      due: 'Due in 2 days',
      priority: 'high',
    },
    {
      id: '2',
      title: 'SQL Query Practice',
      subject: 'DBMS',
      due: 'Due tomorrow',
      priority: 'high',
    },
    {
      id: '3',
      title: 'Process Scheduling Algorithms',
      subject: 'Operating Systems',
      due: 'Due in 3 days',
      priority: 'medium',
    },
  ]

  const upcomingEvents = [
    { id: '1', title: 'Mid-Term Examinations', date: 'July 20-25', type: 'exam' },
    { id: '2', title: 'AI/ML Workshop', date: 'July 18', type: 'workshop' },
    { id: '3', title: 'Department Meeting', date: 'July 15', type: 'meeting' },
    { id: '4', title: 'BST Implementation Due', date: 'July 20', type: 'assignment' },
  ]

  // Performance Trend Chart
  const performanceOptions: ApexOptions = {
    chart: {
      type: 'area',
      toolbar: { show: false },
      sparkline: { enabled: false },
    },
    stroke: { curve: 'smooth', width: 2 },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.1,
      },
    },
    xaxis: {
      categories: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    },
    colors: ['#2563EB'],
    dataLabels: { enabled: false },
    yaxis: {
      min: 0,
      max: 100,
    },
  }

  const performanceSeries = [
    { name: 'Performance %', data: [82, 85, 87, 88] },
  ]

  // Calendar Events
  const calendarEvents = [
    {
      title: 'Mid-Term Exams',
      start: '2026-07-20',
      end: '2026-07-25',
      color: '#EF4444',
    },
    {
      title: 'AI/ML Workshop',
      start: '2026-07-18',
      color: '#10B981',
    },
    {
      title: 'Department Meeting',
      start: '2026-07-15',
      color: '#F59E0B',
    },
    {
      title: 'Assignment Due',
      start: '2026-07-20',
      color: '#8B5CF6',
    },
  ]

  const handleEventClick = (_clickInfo: EventClickArg) => {
    navigate('/calendar')
  }

  const handleTaskClick = (_taskId: string) => {
    navigate('/tasks')
  }

  const handleEventItemClick = (_eventId: string) => {
    navigate('/calendar')
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's your academic overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Performance Chart */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Performance Trend</CardTitle>
          <Button variant="link" size="sm" onClick={() => navigate('/performance')}>
            View details
          </Button>
        </CardHeader>
        <CardContent>
          <ReactApexChart
            options={performanceOptions}
            series={performanceSeries}
            type="area"
            height={200}
          />
        </CardContent>
      </Card>

      {/* Calendar & Pending Tasks */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Calendar</CardTitle>
            <Button variant="link" size="sm" onClick={() => navigate('/calendar')}>
              View full
            </Button>
          </CardHeader>
          <CardContent>
            <div className="calendar-mini">
              <FullCalendar
                ref={calendarRef}
                plugins={[dayGridPlugin]}
                initialView="dayGridMonth"
                events={calendarEvents}
                height="auto"
                headerToolbar={{
                  left: 'prev',
                  center: 'title',
                  right: 'next',
                }}
                eventClick={handleEventClick}
                eventDisplay="block"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Pending Tasks</CardTitle>
            <Button variant="link" size="sm" onClick={() => navigate('/tasks')}>
              View all
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingTasks.map((task) => (
                <div 
                  key={task.id} 
                  className="flex items-start gap-4 pb-4 border-b last:border-0 last:pb-0 cursor-pointer hover:bg-muted/50 -mx-2 px-2 rounded-lg transition-colors"
                  onClick={() => handleTaskClick(task.id)}
                >
                  <div
                    className={`h-2 w-2 rounded-full mt-2 ${
                      task.priority === 'high' ? 'bg-red-500' : 'bg-yellow-500'
                    }`}
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{task.title}</p>
                    <p className="text-xs text-muted-foreground">{task.subject}</p>
                    <p className="text-xs text-muted-foreground mt-1">{task.due}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Events */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Upcoming Events</CardTitle>
          <Button variant="link" size="sm" onClick={() => navigate('/calendar')}>
            View all
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {upcomingEvents.map((event) => (
              <div 
                key={event.id} 
                className="flex items-start gap-4 pb-4 border-b last:border-0 last:pb-0 cursor-pointer hover:bg-muted/50 -mx-2 px-2 rounded-lg transition-colors"
                onClick={() => handleEventItemClick(event.id)}
              >
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-primary">{event.date.split(' ')[1]?.slice(0, 2) || event.date.slice(-2)}</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{event.title}</p>
                  <p className="text-xs text-muted-foreground">{event.date}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
