import { useState, useMemo } from 'react'
import { TrendingUp, Award, AlertTriangle, ChevronDown, ChevronUp, Download, Settings2 } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useToast } from '@/hooks/use-toast'

// Mock data
const mockPerformanceData = {
  overall: 87.6,
  attendance: 85,
  assignments: 90,
  tasks: 88,
  sparklineData: [
    { week: 'W1', score: 82 },
    { week: 'W2', score: 84 },
    { week: 'W3', score: 85 },
    { week: 'W4', score: 86 },
    { week: 'W5', score: 87 },
    { week: 'W6', score: 87.6 },
  ],
  subjectWise: [
    {
      id: 1,
      subject: 'Data Structures',
      attendance: 90,
      assignments: 95,
      performance: 92.5,
      classAverage: 85,
      assignmentScores: [95, 92, 98, 95],
      attendanceDates: ['2026-07-01', '2026-07-02', '2026-07-04', '2026-07-05'],
    },
    {
      id: 2,
      subject: 'DBMS',
      attendance: 85,
      assignments: 88,
      performance: 86.5,
      classAverage: 82,
      assignmentScores: [85, 88, 90, 87],
      attendanceDates: ['2026-07-01', '2026-07-03', '2026-07-04', '2026-07-06'],
    },
    {
      id: 3,
      subject: 'Operating Systems',
      attendance: 80,
      assignments: 87,
      performance: 83.5,
      classAverage: 80,
      assignmentScores: [82, 85, 88, 85],
      attendanceDates: ['2026-07-02', '2026-07-04', '2026-07-05'],
    },
    {
      id: 4,
      subject: 'Computer Networks',
      attendance: 85,
      assignments: 90,
      performance: 87.5,
      classAverage: 84,
      assignmentScores: [88, 90, 92, 88],
      attendanceDates: ['2026-07-01', '2026-07-02', '2026-07-03', '2026-07-05', '2026-07-06'],
    },
    {
      id: 5,
      subject: 'Web Development',
      attendance: 70,
      assignments: 72,
      performance: 71,
      classAverage: 78,
      assignmentScores: [68, 70, 75, 72],
      attendanceDates: ['2026-07-02', '2026-07-05'],
    },
  ],
}

const mockStudents = ['Rahul Kumar', 'Priya Sharma', 'Amit Patel', 'Neha Singh']

export default function PerformancePage() {
  const { toast } = useToast()

  // State
  const [timePeriod, setTimePeriod] = useState<'week' | 'month' | 'semester' | 'custom'>('month')
  const [selectedStudent, setSelectedStudent] = useState('Rahul Kumar')
  const [needsAttention, setNeedsAttention] = useState(false)
  const [expandedSubjects, setExpandedSubjects] = useState<number[]>([])
  const [sortBy, setSortBy] = useState<'high-low' | 'low-high' | 'alphabetical'>('high-low')
  const [showClassAverage, setShowClassAverage] = useState(false)

  // Filter and sort subjects
  const filteredAndSortedSubjects = useMemo(() => {
    let filtered = [...mockPerformanceData.subjectWise]

    // Apply needs attention filter
    if (needsAttention) {
      filtered = filtered.filter((s) => s.performance < 75)
    }

    // Apply sorting
    if (sortBy === 'high-low') {
      filtered.sort((a, b) => b.performance - a.performance)
    } else if (sortBy === 'low-high') {
      filtered.sort((a, b) => a.performance - b.performance)
    } else if (sortBy === 'alphabetical') {
      filtered.sort((a, b) => a.subject.localeCompare(b.subject))
    }

    return filtered
  }, [needsAttention, sortBy])

  // Get performance badge
  const getPerformanceBadge = (performance: number) => {
    if (performance >= 90) {
      return (
        <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
          <Award className="h-3 w-3 mr-1" />
          Excellent
        </Badge>
      )
    } else if (performance >= 75) {
      return (
        <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
          Good
        </Badge>
      )
    } else {
      return (
        <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
          <AlertTriangle className="h-3 w-3 mr-1" />
          Needs Improvement
        </Badge>
      )
    }
  }

  // Get bar color based on performance
  const getBarColor = (performance: number) => {
    if (performance >= 90) return '#22c55e'
    if (performance >= 75) return '#3b82f6'
    return '#ef4444'
  }

  // Toggle subject expansion
  const toggleSubjectExpand = (subjectId: number) => {
    setExpandedSubjects((prev) =>
      prev.includes(subjectId) ? prev.filter((id) => id !== subjectId) : [...prev, subjectId]
    )
  }

  // Export as CSV
  const handleExportCSV = () => {
    const headers = ['Subject', 'Performance %', 'Attendance %', 'Assignments %', 'Status']
    const rows = filteredAndSortedSubjects.map((s) => [
      s.subject,
      s.performance,
      s.attendance,
      s.assignments,
      s.performance >= 90 ? 'Excellent' : s.performance >= 75 ? 'Good' : 'Needs Improvement',
    ])

    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `performance-report-${selectedStudent}-${timePeriod}.csv`
    a.click()
    window.URL.revokeObjectURL(url)

    toast({
      title: 'Success',
      description: 'Report exported as CSV',
    })
  }

  // Export as PDF (simple text-based approach)
  const handleExportPDF = () => {
    try {
      const pdfContent = `
PERFORMANCE REPORT
Student: ${selectedStudent}
Period: ${timePeriod.charAt(0).toUpperCase() + timePeriod.slice(1)}
Date: ${new Date().toLocaleDateString()}

OVERALL PERFORMANCE
Overall Score: ${mockPerformanceData.overall}%
Attendance: ${mockPerformanceData.attendance}%
Assignments: ${mockPerformanceData.assignments}%
Tasks: ${mockPerformanceData.tasks}%

SUBJECT-WISE PERFORMANCE
${filteredAndSortedSubjects
  .map(
    (s) =>
      `\n${s.subject}
Performance: ${s.performance}%
Attendance: ${s.attendance}%
Assignments: ${s.assignments}%
Class Average: ${s.classAverage}%`
  )
  .join('\n')}
      `.trim()

      const blob = new Blob([pdfContent], { type: 'text/plain' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `performance-report-${selectedStudent}-${timePeriod}.txt`
      a.click()
      window.URL.revokeObjectURL(url)

      toast({
        title: 'Success',
        description: 'Report exported as TXT (PDF-style)',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to export report',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Performance Analytics</h1>
          <p className="text-muted-foreground">Track your academic performance</p>
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleExportCSV}>Export as CSV</DropdownMenuItem>
              <DropdownMenuItem onClick={handleExportPDF}>Export as PDF</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Filters Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4 items-center">
            <Settings2 className="h-4 w-4 text-muted-foreground" />

            {/* Time Period Dropdown */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-muted-foreground">Time Period</label>
              <select
                value={timePeriod}
                onChange={(e) => setTimePeriod(e.target.value as any)}
                className="px-3 py-2 border rounded-md bg-background text-sm"
              >
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="semester">This Semester</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>

            {/* Student Selector */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-muted-foreground">Student</label>
              <select
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
                className="px-3 py-2 border rounded-md bg-background text-sm"
              >
                {mockStudents.map((student) => (
                  <option key={student} value={student}>
                    {student}
                  </option>
                ))}
              </select>
            </div>

            {/* Needs Attention Toggle */}
            <div className="flex items-end gap-2 h-full">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={needsAttention}
                  onChange={(e) => setNeedsAttention(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm font-medium">Needs Attention Only</span>
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stat Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        {/* Overall Card with Sparkline */}
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-2xl font-bold">{mockPerformanceData.overall}%</div>
            <p className="text-xs text-muted-foreground">+3.2% from last month</p>

            {/* Sparkline */}
            <div className="h-12 w-full -mx-2">
              <ResponsiveContainer width="100%" height={48}>
                <LineChart data={mockPerformanceData.sparklineData} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="transparent" />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#22c55e"
                    dot={false}
                    strokeWidth={2}
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Attendance Card */}
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockPerformanceData.attendance}%</div>
            <p className="text-xs text-muted-foreground">17/20 classes</p>
            <div className="mt-3 h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full"
                style={{ width: `${mockPerformanceData.attendance}%` }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Assignments Card */}
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assignments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockPerformanceData.assignments}%</div>
            <p className="text-xs text-muted-foreground">9/10 submitted</p>
            <div className="mt-3 h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-500 rounded-full"
                style={{ width: `${mockPerformanceData.assignments}%` }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Tasks Card */}
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockPerformanceData.tasks}%</div>
            <p className="text-xs text-muted-foreground">22/25 completed</p>
            <div className="mt-3 h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-orange-500 rounded-full"
                style={{ width: `${mockPerformanceData.tasks}%` }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Subject-wise Performance */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle>Subject-wise Performance</CardTitle>
          <div className="flex gap-2">
            {/* Sort Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  Sort: {sortBy === 'high-low' ? 'High-Low' : sortBy === 'low-high' ? 'Low-High' : 'A-Z'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setSortBy('high-low')}>High to Low</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('low-high')}>Low to High</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('alphabetical')}>Alphabetical</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Compare Toggle */}
            <Button
              variant={showClassAverage ? 'default' : 'outline'}
              size="sm"
              onClick={() => setShowClassAverage(!showClassAverage)}
            >
              {showClassAverage ? 'Comparing' : 'Compare'}
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            {filteredAndSortedSubjects.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No subjects found matching your filters.
              </div>
            ) : (
              filteredAndSortedSubjects.map((subject) => {
                const isExpanded = expandedSubjects.includes(subject.id)

                return (
                  <div key={subject.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                    {/* Header (Clickable) */}
                    <button
                      onClick={() => toggleSubjectExpand(subject.id)}
                      className="w-full text-left flex items-center justify-between gap-4"
                    >
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium flex items-center gap-2">
                            {subject.subject}
                            {isExpanded ? (
                              <ChevronUp className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <ChevronDown className="h-4 w-4 text-muted-foreground" />
                            )}
                          </h4>
                          <div className="text-right flex items-center gap-3">
                            <div className="text-2xl font-bold">{subject.performance}%</div>
                            {getPerformanceBadge(subject.performance)}
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span title={`Attendance: ${subject.attendance}%`}>Attendance: {subject.attendance}%</span>
                          <span>•</span>
                          <span title={`Assignments: ${subject.assignments}%`}>Assignments: {subject.assignments}%</span>
                        </div>

                        {/* Progress Bar with Class Average Comparison */}
                        <div className="space-y-1">
                          <div className="h-2 bg-muted rounded-full overflow-hidden relative">
                            <div
                              className="h-full rounded-full transition-all absolute"
                              style={{
                                width: `${subject.performance}%`,
                                backgroundColor: getBarColor(subject.performance),
                              }}
                              title={`Your performance: ${subject.performance}%`}
                            />
                            {showClassAverage && (
                              <div
                                className="h-full rounded-full transition-all absolute opacity-40 border-2 border-dashed"
                                style={{
                                  width: `${subject.classAverage}%`,
                                  borderColor: 'currentColor',
                                }}
                                title={`Class average: ${subject.classAverage}%`}
                              />
                            )}
                          </div>
                          {showClassAverage && (
                            <div className="text-xs text-muted-foreground flex justify-between">
                              <span>Your: {subject.performance}%</span>
                              <span>Class Avg: {subject.classAverage}%</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </button>

                    {/* Expanded Content */}
                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t space-y-4">
                        {/* Assignment Scores */}
                        <div>
                          <h5 className="text-sm font-semibold mb-2">Recent Assignment Scores</h5>
                          <div className="flex gap-2">
                            {subject.assignmentScores.map((score, idx) => (
                              <div
                                key={idx}
                                className="flex-1 text-center p-2 rounded bg-muted"
                              >
                                <div className="text-lg font-bold">{score}</div>
                                <div className="text-xs text-muted-foreground">A{idx + 1}</div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Attendance Dates */}
                        <div>
                          <h5 className="text-sm font-semibold mb-2">Recent Attendance</h5>
                          <div className="flex flex-wrap gap-2">
                            {subject.attendanceDates.slice(0, 5).map((date, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {new Date(date).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                })}
                              </Badge>
                            ))}
                            {subject.attendanceDates.length > 5 && (
                              <Badge variant="secondary" className="text-xs">
                                +{subject.attendanceDates.length - 5} more
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Mini Chart */}
                        <div>
                          <h5 className="text-sm font-semibold mb-2">Trend</h5>
                          <div className="h-24 w-full">
                            <ResponsiveContainer width="100%" height={96}>
                              <BarChart
                                data={subject.assignmentScores.map((score, idx) => ({
                                  name: `A${idx + 1}`,
                                  score,
                                }))}
                              >
                                <CartesianGrid strokeDasharray="3 3" stroke="transparent" />
                                <XAxis dataKey="name" stroke="var(--muted-foreground)" />
                                <YAxis stroke="var(--muted-foreground)" />
                                <Bar dataKey="score" fill={getBarColor(subject.performance)} />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
