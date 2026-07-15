import { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { ColumnDef } from '@tanstack/react-table'
import { MoreHorizontal, Eye, Trash2, ArrowUpDown, Download, Search, Calendar, TrendingUp, ChevronDown } from 'lucide-react'
import ReactApexChart from 'react-apexcharts'
import type { ApexOptions } from 'apexcharts'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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
import { DataTable } from '@/components/common/DataTable'
import { EmptyState } from '@/components/common/EmptyState'
import { ErrorState } from '@/components/common/ErrorState'
import { AttendanceTableSkeleton } from '@/components/attendance/AttendanceTableSkeleton'
import { MarkAttendanceDialog } from '@/components/attendance/MarkAttendanceDialog'
import { MonthlyAttendanceCalendar } from '@/components/attendance/MonthlyAttendanceCalendar'
import { DatePickerWithCalendar } from '@/components/common/DatePickerWithCalendar'
import { attendanceService } from '@/services/attendanceService'
import { studentService } from '@/services/studentService'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/features/auth/AuthContext'
import type { Student } from '@/types'

interface ClassSession {
  id: string
  subject: string
  time: string
  present: number
  total: number
  marked: boolean
  staffName: string
}

export default function AttendanceEnhancedPage() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  const [activeTab, setActiveTab] = useState('daily')
  const [isMarkDialogOpen, setIsMarkDialogOpen] = useState(false)
  const [selectedClass, setSelectedClass] = useState<ClassSession | null>(null)
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const handleOpenRoster = (classSession: ClassSession) => {
    setSelectedClass(classSession)
    setIsMarkDialogOpen(true)
  }

  const queryClient = useQueryClient()
  const { toast } = useToast()
  const { user: currentUser } = useAuth()

  // Check if user can edit (Staff role)
  const canEdit = currentUser?.role === 'STAFF' || currentUser?.role === 'HOD'

  // Fetch attendance data
  const { isLoading: isLoadingAttendance, error: attendanceError, refetch: refetchAttendance } = useQuery({
    queryKey: ['attendance', selectedDate.toISOString().split('T')[0]],
    queryFn: () =>
      attendanceService.getAll({
        date: selectedDate.toISOString().split('T')[0],
      }),
  })

  // Fetch students
  const { data: studentsData } = useQuery({
    queryKey: ['students'],
    queryFn: () => studentService.getAll(),
  })

  // Mutations
  const markAttendanceMutation = useMutation({
    mutationFn: async (attendanceMap: Record<string, 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED'>) => {
      if (!selectedClass) return
      // Mock marking attendance
      return attendanceService.markAttendance({
        studentIds: Object.keys(attendanceMap),
        subjectId: selectedClass.id,
        date: selectedDate.toISOString().split('T')[0],
        status: 'PRESENT',
        markedBy: currentUser?.id || 'current-user',
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] })
      toast({
        title: 'Success',
        description: 'Attendance marked successfully',
      })
      setIsMarkDialogOpen(false)
      setSelectedClass(null)
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      })
    },
  })

  const resetAttendanceMutation = useMutation({
    mutationFn: async () => {
      if (!selectedClass) return
      // Mock reset attendance
      return attendanceService.delete(selectedClass.id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] })
      toast({
        title: 'Success',
        description: 'Attendance reset successfully',
      })
      setIsResetDialogOpen(false)
      setSelectedClass(null)
    },
  })

  // Mock class sessions for the day
  const classSessions: ClassSession[] = [
    {
      id: 'class-1',
      subject: 'Data Structures',
      time: '09:00 AM',
      present: 42,
      total: 45,
      marked: true,
      staffName: 'Priya Sharma',
    },
    {
      id: 'class-2',
      subject: 'DBMS',
      time: '11:00 AM',
      present: 40,
      total: 45,
      marked: true,
      staffName: 'Amit Verma',
    },
    {
      id: 'class-3',
      subject: 'Operating Systems',
      time: '02:00 PM',
      present: 38,
      total: 45,
      marked: false,
      staffName: 'Sneha Patel',
    },
  ]

  const filteredClasses = useMemo(() => {
    if (!searchQuery.trim()) return classSessions
    return classSessions.filter((c) =>
      c.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.staffName.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [searchQuery])

  const stats = useMemo(() => {
    const totalPresent = classSessions.reduce((sum, c) => sum + c.present, 0)
    const totalStudents = classSessions.reduce((sum, c) => sum + c.total, 0)
    const markedCount = classSessions.filter((c) => c.marked).length

    return {
      overall: totalStudents > 0 ? Math.round((totalPresent / totalStudents) * 100) : 0,
      presentToday: totalPresent,
      totalToday: totalStudents,
      classesMarked: markedCount,
    }
  }, [])

  const students = (studentsData?.data || []) as Student[]

  const handleOpenMarkDialog = (classSession: ClassSession) => {
    setSelectedClass(classSession)
    setIsMarkDialogOpen(true)
  }

  const handleSaveAttendance = async (attendance: Record<string, 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED'>) => {
    await markAttendanceMutation.mutateAsync(attendance)
  }

  const handleResetAttendance = async () => {
    await resetAttendanceMutation.mutateAsync()
  }

  // Export handlers
  const handleExportPDF = async () => {
    try {
      toast({
        title: 'Exporting...',
        description: 'Generating PDF file',
      })
      // Simulate download delay
      await new Promise((resolve) => setTimeout(resolve, 1500))
      // Mock: Create a blob and trigger download
      const content = generatePDFContent(filteredClasses, selectedDate)
      const blob = new Blob([content], { type: 'application/pdf' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `attendance-${selectedDate.toISOString().split('T')[0]}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast({
        title: 'Success',
        description: 'PDF exported successfully',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to export PDF',
        variant: 'destructive',
      })
    }
  }

  const handleExportExcel = async () => {
    try {
      toast({
        title: 'Exporting...',
        description: 'Generating Excel file',
      })
      // Simulate download delay
      await new Promise((resolve) => setTimeout(resolve, 1500))
      // Mock: Create CSV and trigger download
      const csvContent = generateExcelContent(filteredClasses)
      const blob = new Blob([csvContent], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `attendance-${selectedDate.toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast({
        title: 'Success',
        description: 'Excel file exported successfully',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to export Excel',
        variant: 'destructive',
      })
    }
  }

  // Helper functions for export
  const generatePDFContent = (classes: ClassSession[], date: Date) => {
    let content = `ATTENDANCE REPORT - ${date.toLocaleDateString()}\n\n`
    content += 'Subject\t\tTime\t\tStaff\t\tPresent/Total\n'
    content += '='.repeat(80) + '\n'
    classes.forEach((c) => {
      content += `${c.subject}\t${c.time}\t${c.staffName}\t${c.present}/${c.total}\n`
    })
    return content
  }

  const generateExcelContent = (classes: ClassSession[]) => {
    let csv = 'Subject,Time,Staff,Present,Total,Percentage\n'
    classes.forEach((c) => {
      const percentage = Math.round((c.present / c.total) * 100)
      csv += `"${c.subject}","${c.time}","${c.staffName}",${c.present},${c.total},${percentage}%\n`
    })
    return csv
  }

  // Chart Configuration
  const attendanceTrendOptions: ApexOptions = {
    chart: {
      type: 'line',
      toolbar: { show: false },
      sparkline: { enabled: false },
    },
    colors: ['#2563EB'],
    stroke: { curve: 'smooth', width: 2 },
    xaxis: {
      categories: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
    },
    yaxis: {
      title: { text: 'Attendance %' },
      min: 0,
      max: 100,
    },
    grid: { show: true },
    tooltip: {
      theme: 'dark',
    },
  }

  const attendanceTrendSeries = [
    {
      name: 'Attendance %',
      data: [85, 87, 88, 86, 89, 87, 90],
    },
  ]

  const subjectComparisonOptions: ApexOptions = {
    chart: {
      type: 'bar',
      toolbar: { show: false },
    },
    colors: ['#2563EB'],
    xaxis: {
      categories: ['Data Structures', 'DBMS', 'Operating Systems'],
    },
    yaxis: {
      title: { text: 'Average Attendance %' },
      min: 0,
      max: 100,
    },
    grid: { show: true },
    tooltip: {
      theme: 'dark',
    },
  }

  const subjectComparisonSeries = [
    {
      name: 'Average Attendance %',
      data: [93, 89, 84],
    },
  ]

  const subjectColumns: ColumnDef<ClassSession>[] = [
    {
      accessorKey: 'subject',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Subject
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: 'time',
      header: 'Time',
    },
    {
      accessorKey: 'staffName',
      header: 'Staff',
    },
    {
      accessorKey: 'total',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Classes Held
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: 'present',
      header: 'Average Attendance %',
      cell: ({ row }) => {
        const present = row.original.present
        const total = row.original.total
        const percentage = total > 0 ? Math.round((present / total) * 100) : 0
        return (
          <Badge
            variant={percentage >= 75 ? 'default' : 'secondary'}
          >
            {percentage}%
          </Badge>
        )
      },
    },
    {
      id: 'trend',
      header: 'Trend',
      cell: () => <TrendingUp className="h-4 w-4 text-green-600" />,
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => handleOpenRoster(row.original)}>
              <Eye className="mr-2 h-4 w-4" />
              View Roster
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleOpenMarkDialog(row.original)}>
              <Eye className="mr-2 h-4 w-4" />
              Edit Attendance
            </DropdownMenuItem>
            {row.original.marked && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-600"
                  onClick={() => {
                    setSelectedClass(row.original)
                    setIsResetDialogOpen(true)
                  }}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Reset
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  if (isLoadingAttendance) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Attendance</h1>
          <p className="text-muted-foreground">Mark and manage student attendance</p>
        </div>
        <AttendanceTableSkeleton />
      </div>
    )
  }

  if (attendanceError) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Attendance</h1>
          <p className="text-muted-foreground">Mark and manage student attendance</p>
        </div>
        <ErrorState
          message="Failed to load attendance. Please try again."
          onRetry={() => refetchAttendance()}
        />
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Attendance</h1>
          <p className="text-muted-foreground">Mark and manage student attendance</p>
        </div>
        <div className="flex gap-2">
          {/* Themed Date Picker */}
          <DatePickerWithCalendar
            date={selectedDate}
            onDateChange={setSelectedDate}
          />

          {/* Export Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Export Format</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleExportPDF}>
                Export as PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExportExcel}>
                Export as Excel
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Attendance</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.overall}%</div>
            <p className="text-xs text-muted-foreground">Today's average</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Present Today</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.presentToday}/{stats.totalToday}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalToday - stats.presentToday} absent
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Classes Marked</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.classesMarked}/{classSessions.length}</div>
            <p className="text-xs text-muted-foreground">
              {classSessions.length - stats.classesMarked} pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{classSessions.length}</div>
            <p className="text-xs text-muted-foreground">Across all departments</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="daily">Daily</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
          <TabsTrigger value="subject">Subject-wise</TabsTrigger>
        </TabsList>

        {/* Daily Tab */}
        <TabsContent value="daily" className="space-y-4">
          {/* Search */}
          <div className="relative flex items-center max-w-sm">
            <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by subject or staff..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>

          {/* Today's Classes */}
          {filteredClasses.length === 0 ? (
            <EmptyState
              icon={Calendar}
              title="No classes found"
              description="Try adjusting your search"
            />
          ) : (
            <div className="space-y-3">
              {filteredClasses.map((classSession) => (
                <Card
                  key={classSession.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleOpenMarkDialog(classSession)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{classSession.subject}</h4>
                        <p className="text-sm text-muted-foreground">{classSession.time}</p>
                        <p className="text-sm text-muted-foreground">Staff: {classSession.staffName}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="font-semibold">
                            {classSession.present}/{classSession.total}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {Math.round((classSession.present / classSession.total) * 100)}%
                          </div>
                        </div>
                        <Badge variant={classSession.marked ? 'default' : 'secondary'}>
                          {classSession.marked ? 'Marked' : 'Pending'}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Monthly Tab */}
        <TabsContent value="monthly">
          <MonthlyAttendanceCalendar
            year={currentYear}
            month={currentMonth}
            onMonthChange={(year, month) => {
              setCurrentYear(year)
              setCurrentMonth(month)
            }}
            attendanceData={{
              '2026-07-01': { present: 168, total: 210 },
              '2026-07-02': { present: 180, total: 210 },
              '2026-07-03': { present: 190, total: 210 },
              '2026-07-04': { present: 155, total: 210 },
              '2026-07-07': { present: 185, total: 210 },
              '2026-07-08': { present: 188, total: 210 },
              '2026-07-09': { present: 192, total: 210 },
              '2026-07-10': { present: 175, total: 210 },
              '2026-07-11': { present: 187, total: 210 },
              '2026-07-14': { present: 187, total: 210 },
            }}
          />
        </TabsContent>

        {/* Subject-wise Tab */}
        <TabsContent value="subject" className="space-y-4">
          {/* Search */}
          <div className="relative flex items-center max-w-sm">
            <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by subject or staff..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>

          <div className="rounded-lg border bg-card">
            <DataTable
              columns={subjectColumns}
              data={filteredClasses}
            />
          </div>
        </TabsContent>
      </Tabs>

      {/* Charts Section */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Attendance Trend (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <ReactApexChart
              options={attendanceTrendOptions}
              series={attendanceTrendSeries}
              type="line"
              height={300}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Subject-wise Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <ReactApexChart
              options={subjectComparisonOptions}
              series={subjectComparisonSeries}
              type="bar"
              height={300}
            />
          </CardContent>
        </Card>
      </div>

      {/* Mark Attendance Dialog */}
      {selectedClass && (
        <MarkAttendanceDialog
          open={isMarkDialogOpen}
          onOpenChange={setIsMarkDialogOpen}
          subject={selectedClass.subject}
          time={selectedClass.time}
          students={students}
          currentAttendance={{}}
          onSave={handleSaveAttendance}
          isLoading={markAttendanceMutation.isPending}
          readOnly={!canEdit}
        />
      )}

      {/* Reset Confirmation Dialog */}
      <AlertDialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset Attendance?</AlertDialogTitle>
            <AlertDialogDescription>
              This will clear attendance records for {selectedClass?.subject}. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleResetAttendance()}
              className="bg-red-600 hover:bg-red-700"
            >
              Reset
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}