import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, ClipboardCheck, BookOpen, Clock, CheckCircle2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import ReactApexChart from 'react-apexcharts'
import type { ApexOptions } from 'apexcharts'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'

export function StaffDashboard() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [selectedClass, setSelectedClass] = useState<string>('')
  const [isMarkingAttendance, setIsMarkingAttendance] = useState(false)
  const [loadingAction, setLoadingAction] = useState<string | null>(null)

  const stats = [
    {
      title: 'Total Students',
      value: '85',
      change: 'Under your supervision',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
    },
    {
      title: "Today's Classes",
      value: '4',
      change: '2 completed, 2 remaining',
      icon: BookOpen,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/20',
    },
    {
      title: 'Pending Assignments',
      value: '12',
      change: 'To be graded',
      icon: ClipboardCheck,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100 dark:bg-orange-900/20',
    },
    {
      title: 'Leave Requests',
      value: '3',
      change: 'Awaiting approval',
      icon: Clock,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20',
    },
  ]

  const todaySchedule = [
    { id: '1', time: '09:00 AM', subject: 'Data Structures', class: 'CSE - 5th Sem', status: 'completed' },
    { id: '2', time: '11:00 AM', subject: 'DBMS', class: 'CSE - 5th Sem', status: 'completed' },
    { id: '3', time: '02:00 PM', subject: 'Data Structures Lab', class: 'CSE - 5th Sem', status: 'upcoming' },
    { id: '4', time: '04:00 PM', subject: 'DBMS Lab', class: 'CSE - 5th Sem', status: 'upcoming' },
  ]

  // Student Progress Chart
  const studentProgressOptions: ApexOptions = {
    chart: {
      type: 'line',
      toolbar: { show: false },
    },
    stroke: { curve: 'smooth', width: 3 },
    xaxis: {
      categories: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    },
    colors: ['#2563EB', '#10B981'],
    legend: { show: true, position: 'top' },
    dataLabels: { enabled: false },
  }

  const studentProgressSeries = [
    { name: 'Assignment Submission', data: [75, 80, 85, 90] },
    { name: 'Average Attendance', data: [82, 85, 84, 88] },
  ]

  const handleQuickAttendance = async () => {
    if (!selectedClass) {
      toast({
        variant: 'destructive',
        title: 'Select a class',
        description: 'Please select a class to mark attendance',
      })
      return
    }

    setIsMarkingAttendance(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsMarkingAttendance(false)
    
    toast({
      title: 'Success',
      description: 'Navigating to attendance marking...',
    })
    navigate('/attendance')
  }

  const handleScheduleClick = (scheduleId: string) => {
    const schedule = todaySchedule.find(s => s.id === scheduleId)
    if (schedule?.status === 'upcoming') {
      navigate('/attendance')
    }
  }

  const handleQuickAction = async (action: string) => {
    setLoadingAction(action)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800))
    setLoadingAction(null)

    switch (action) {
      case 'Mark Attendance':
        navigate('/attendance')
        break
      case 'Create Assignment':
        navigate('/assignments')
        break
      case 'Post Announcement':
        navigate('/announcements')
        break
      case 'Grade Submissions':
        navigate('/assignments?filter=submitted')
        break
      case 'Approve Leave Requests':
        navigate('/leave?filter=pending')
        break
    }

    toast({
      title: 'Action completed',
      description: `Navigating to ${action}...`,
    })
  }

  const quickActions = [
    { label: 'Mark Attendance', icon: CheckCircle2 },
    { label: 'Create Assignment', icon: BookOpen },
    { label: 'Post Announcement', icon: Users },
    { label: 'Grade Submissions', icon: ClipboardCheck },
    { label: 'Approve Leave Requests', icon: Clock },
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's your teaching overview.</p>
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

      {/* Quick Attendance Entry Widget */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Attendance Entry</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3">
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger className="w-full sm:w-[300px]">
                <SelectValue placeholder="Select a class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ds-5th">Data Structures - CSE 5th Sem</SelectItem>
                <SelectItem value="dbms-5th">DBMS - CSE 5th Sem</SelectItem>
                <SelectItem value="ds-lab">Data Structures Lab - CSE 5th Sem</SelectItem>
                <SelectItem value="dbms-lab">DBMS Lab - CSE 5th Sem</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              onClick={handleQuickAttendance} 
              disabled={isMarkingAttendance}
              className="w-full sm:w-auto"
            >
              {isMarkingAttendance ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Mark Attendance
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Student Progress Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Class Progress Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <ReactApexChart
            options={studentProgressOptions}
            series={studentProgressSeries}
            type="line"
            height={250}
          />
        </CardContent>
      </Card>

      {/* Today's Schedule & Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Today's Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {todaySchedule.map((schedule) => (
                <div 
                  key={schedule.id} 
                  className={`flex items-center gap-4 pb-4 border-b last:border-0 last:pb-0 ${
                    schedule.status === 'upcoming' ? 'cursor-pointer hover:bg-muted/50 -mx-2 px-2 rounded-lg transition-colors' : ''
                  }`}
                  onClick={() => handleScheduleClick(schedule.id)}
                >
                  <div className="text-sm font-medium text-muted-foreground w-20">{schedule.time}</div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{schedule.subject}</p>
                    <p className="text-xs text-muted-foreground">{schedule.class}</p>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      schedule.status === 'completed'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                        : 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                    }`}
                  >
                    {schedule.status}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {quickActions.map((action) => (
              <Button
                key={action.label}
                variant="ghost"
                className="w-full justify-start px-4 py-2 h-auto"
                onClick={() => handleQuickAction(action.label)}
                disabled={loadingAction === action.label}
              >
                {loadingAction === action.label ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <action.icon className="mr-2 h-4 w-4" />
                )}
                {action.label}
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
