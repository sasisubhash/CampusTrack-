import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, UserCheck, BookOpen, TrendingUp, GraduationCap, Award, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import ReactApexChart from 'react-apexcharts'
import type { ApexOptions } from 'apexcharts'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/components/ui/use-toast'

export function HODDashboard() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [loadingAction, setLoadingAction] = useState<string | null>(null)

  const stats = [
    {
      title: 'Total Students',
      value: '245',
      change: '+12 this month',
      icon: GraduationCap,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
    },
    {
      title: 'Total Staff',
      value: '24',
      change: '+2 this month',
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/20',
    },
    {
      title: 'Avg Attendance',
      value: '89.5%',
      change: '+2.5% from last month',
      icon: UserCheck,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20',
    },
    {
      title: 'Active Courses',
      value: '32',
      change: '8 departments',
      icon: BookOpen,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100 dark:bg-orange-900/20',
    },
    {
      title: 'Top Performers',
      value: '42',
      change: 'Above 90%',
      icon: Award,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/20',
    },
    {
      title: 'Department Score',
      value: '4.2/5',
      change: '+0.3 from last sem',
      icon: TrendingUp,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100 dark:bg-indigo-900/20',
    },
  ]

  // Attendance Trend Chart
  const attendanceTrendOptions: ApexOptions = {
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
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    },
    colors: ['#2563EB', '#10B981', '#F59E0B'],
    legend: { show: true, position: 'top' },
    dataLabels: { enabled: false },
  }

  const attendanceTrendSeries = [
    { name: 'CSE', data: [85, 87, 86, 89, 90, 89] },
    { name: 'ECE', data: [82, 84, 85, 86, 88, 87] },
    { name: 'EEE', data: [80, 81, 83, 84, 85, 86] },
  ]

  // Department Analytics Bar Chart
  const departmentAnalyticsOptions: ApexOptions = {
    chart: {
      type: 'bar',
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
      },
    },
    xaxis: {
      categories: ['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL'],
    },
    colors: ['#2563EB'],
    dataLabels: { enabled: false },
  }

  const departmentAnalyticsSeries = [
    { name: 'Students', data: [85, 62, 48, 35, 15] },
  ]

  const topStudents = [
    { name: 'Ananya Reddy', department: 'CSE', score: 96.5, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=student2' },
    { name: 'Arjun Nair', department: 'CSE', score: 92.5, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=student1' },
    { name: 'Rohan Singh', department: 'CSE', score: 91.2, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=student3' },
  ]

  const topStaff = [
    { name: 'Priya Sharma', department: 'CSE', rating: 4.8, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=staff1' },
    { name: 'Amit Verma', department: 'CSE', rating: 4.6, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=staff2' },
  ]

  const recentActivity = [
    { title: 'New leave request from Arjun Nair', time: '5 min ago', type: 'leave', link: '/leave' },
    { title: 'Staff Priya Sharma submitted monthly report', time: '1 hour ago', type: 'report', link: '/reports' },
    { title: 'Mid-term exam schedule updated', time: '2 hours ago', type: 'exam', link: '/calendar' },
    { title: 'Department meeting scheduled for tomorrow', time: '3 hours ago', type: 'meeting', link: '/calendar' },
  ]

  const handleQuickAction = async (action: string, route: string) => {
    setLoadingAction(action)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800))
    setLoadingAction(null)

    toast({
      title: 'Action initiated',
      description: `Navigating to ${action}...`,
    })
    
    navigate(route)
  }

  const quickActions = [
    { label: 'Add New Staff', route: '/users', icon: Users },
    { label: 'Create Announcement', route: '/announcements', icon: BookOpen },
    { label: 'View Reports', route: '/reports', icon: TrendingUp },
    { label: 'Schedule Meeting', route: '/calendar', icon: Award },
    { label: 'Approve Leaves', route: '/leave?filter=pending', icon: UserCheck },
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, HOD! Here's your department overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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

      {/* Charts Row */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Attendance Trend (6 Months)</CardTitle>
          </CardHeader>
          <CardContent>
            <ReactApexChart
              options={attendanceTrendOptions}
              series={attendanceTrendSeries}
              type="area"
              height={250}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Students by Department</CardTitle>
          </CardHeader>
          <CardContent>
            <ReactApexChart
              options={departmentAnalyticsOptions}
              series={departmentAnalyticsSeries}
              type="bar"
              height={250}
            />
          </CardContent>
        </Card>
      </div>

      {/* Top Performers & Activity */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Activity</CardTitle>
            <Button variant="link" size="sm" onClick={() => navigate('/dashboard')}>
              View all
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 pb-4 border-b last:border-0 last:pb-0 cursor-pointer hover:bg-muted/50 -mx-2 px-2 rounded-lg transition-colors"
                  onClick={() => navigate(activity.link)}
                >
                  <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.title}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {quickActions.map((action) => (
              <Button
                key={action.label}
                variant="ghost"
                className="w-full justify-start px-4 py-2 h-auto"
                onClick={() => handleQuickAction(action.label, action.route)}
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

      {/* Top Students & Staff */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Top Students</CardTitle>
            <Button variant="link" size="sm" onClick={() => navigate('/students')}>
              View all
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topStudents.map((student, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={student.avatar} />
                    <AvatarFallback>{student.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{student.name}</p>
                    <p className="text-xs text-muted-foreground">{student.department}</p>
                  </div>
                  <Badge variant="secondary">{student.score}%</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Top Staff</CardTitle>
            <Button variant="link" size="sm" onClick={() => navigate('/users')}>
              View all
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topStaff.map((staff, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={staff.avatar} />
                    <AvatarFallback>{staff.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{staff.name}</p>
                    <p className="text-xs text-muted-foreground">{staff.department}</p>
                  </div>
                  <Badge variant="secondary">★ {staff.rating}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
