import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { UserCheck, TrendingUp, Bell, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import ReactApexChart from 'react-apexcharts'
import type { ApexOptions } from 'apexcharts'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export function ParentDashboard() {
  const navigate = useNavigate()
  const [selectedChild, setSelectedChild] = useState('child1')

  // Simulating multiple children
  const children = [
    { id: 'child1', name: 'Arjun Nair', class: 'CSE - 5th Sem' },
    { id: 'child2', name: 'Ananya Nair', class: 'ECE - 3rd Sem' },
  ]

  const stats = [
    {
      title: "Child's Attendance",
      value: '85%',
      change: '17/20 classes this month',
      icon: UserCheck,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/20',
    },
    {
      title: 'Performance',
      value: '87.6%',
      change: 'Above average',
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
    },
    {
      title: 'Pending Tasks',
      value: '3',
      change: '2 due this week',
      icon: Bell,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100 dark:bg-orange-900/20',
    },
    {
      title: 'Upcoming Events',
      value: '4',
      change: 'Next 7 days',
      icon: Calendar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20',
    },
  ]

  const subjects = [
    { subject: 'Data Structures', attendance: 90, performance: 92.5, grade: 'A' },
    { subject: 'DBMS', attendance: 85, performance: 86.5, grade: 'B+' },
    { subject: 'Operating Systems', attendance: 80, performance: 83.5, grade: 'B' },
    { subject: 'Computer Networks', attendance: 85, performance: 88, grade: 'B+' },
  ]

  const announcements = [
    {
      id: '1',
      title: 'Mid-Term Exam Schedule Released',
      date: 'July 10, 2026',
      type: 'COLLEGE',
      important: true,
    },
    {
      id: '2',
      title: 'AI/ML Workshop Registration Open',
      date: 'July 11, 2026',
      type: 'DEPARTMENT',
      important: false,
    },
    {
      id: '3',
      title: 'Campus Closed Tomorrow',
      date: 'July 13, 2026',
      type: 'EMERGENCY',
      important: true,
    },
  ]

  // Attendance Trend Chart
  const attendanceOptions: ApexOptions = {
    chart: {
      type: 'line',
      toolbar: { show: false },
    },
    stroke: { curve: 'smooth', width: 3 },
    xaxis: {
      categories: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    },
    colors: ['#10B981'],
    dataLabels: { enabled: false },
    yaxis: {
      min: 0,
      max: 100,
      labels: {
        formatter: (value) => `${value}%`,
      },
    },
  }

  const attendanceSeries = [
    { name: 'Attendance %', data: [82, 85, 84, 85] },
  ]

  const handleAnnouncementClick = (_announcementId: string) => {
    navigate('/announcements')
  }

  const handleChildChange = (childId: string) => {
    setSelectedChild(childId)
    // In a real app, this would fetch data for the selected child
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header with Child Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Track your child's academic progress and activities.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Viewing:</span>
          <Select value={selectedChild} onValueChange={handleChildChange}>
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {children.map((child) => (
                <SelectItem key={child.id} value={child.id}>
                  {child.name} ({child.class})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
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

      {/* Attendance Trend Chart */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Attendance Trend</CardTitle>
          <Button variant="link" size="sm" onClick={() => navigate('/attendance')}>
            View details
          </Button>
        </CardHeader>
        <CardContent>
          <ReactApexChart
            options={attendanceOptions}
            series={attendanceSeries}
            type="line"
            height={200}
          />
        </CardContent>
      </Card>

      {/* Subject-wise Performance & Recent Announcements */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Subject-wise Performance</CardTitle>
            <Button variant="link" size="sm" onClick={() => navigate('/performance')}>
              View all
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {subjects.map((subject, i) => (
                <div key={i} className="pb-4 border-b last:border-0 last:pb-0">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium">{subject.subject}</p>
                    <span className="text-sm font-bold text-primary">{subject.grade}</span>
                  </div>
                  <div className="flex gap-4 text-xs text-muted-foreground">
                    <span>Attendance: {subject.attendance}%</span>
                    <span>•</span>
                    <span>Score: {subject.performance}%</span>
                  </div>
                  <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${subject.performance}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Announcements</CardTitle>
            <Button variant="link" size="sm" onClick={() => navigate('/announcements')}>
              View all
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {announcements.map((announcement) => (
                <div 
                  key={announcement.id} 
                  className="flex items-start gap-4 pb-4 border-b last:border-0 last:pb-0 cursor-pointer hover:bg-muted/50 -mx-2 px-2 rounded-lg transition-colors"
                  onClick={() => handleAnnouncementClick(announcement.id)}
                >
                  <div
                    className={`h-2 w-2 rounded-full mt-2 ${
                      announcement.important ? 'bg-red-500' : 'bg-blue-500'
                    }`}
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{announcement.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground">{announcement.date}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-muted">{announcement.type}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
