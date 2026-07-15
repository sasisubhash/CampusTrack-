import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Download,
  FileText,
  Filter,
  X,
  MoreVertical,
  Search,
  Loader2,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'

// Mock report data
const mockReports = [
  {
    id: '1',
    name: 'Monthly Attendance Report',
    type: 'Attendance',
    period: 'June 2026',
    generatedOn: '2026-07-01',
    format: 'PDF',
    semester: 5,
    quarter: 'Q2',
  },
  {
    id: '2',
    name: 'Student Performance Report',
    type: 'Performance',
    period: 'Semester 5',
    generatedOn: '2026-07-05',
    format: 'Excel',
    semester: 5,
    quarter: 'Q2',
  },
  {
    id: '3',
    name: 'Leave Summary Report',
    type: 'Leave',
    period: 'Q2 2026',
    generatedOn: '2026-07-08',
    format: 'PDF',
    semester: 5,
    quarter: 'Q2',
  },
]

const mockClasses = ['CSE-A', 'CSE-B', 'ECE-A', 'ECE-B', 'EEE-A', 'MECH-A']

export default function ReportsPage() {
  const { toast } = useToast()

  // State
  const [reports, setReports] = useState(mockReports)
  const [showFiltersPanel, setShowFiltersPanel] = useState(false)
  const [showGenerateModal, setShowGenerateModal] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [selectedReportType, setSelectedReportType] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  // Filters
  const [filterDateFrom, setFilterDateFrom] = useState('2026-06-01')
  const [filterDateTo, setFilterDateTo] = useState('2026-07-31')
  const [filterTypes, setFilterTypes] = useState<string[]>([])
  const [filterFormat, setFilterFormat] = useState<string>('')
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'type'>('newest')

  // Generate modal state
  const [generateDateFrom, setGenerateDateFrom] = useState('')
  const [generateDateTo, setGenerateDateTo] = useState('')
  const [generateClass, setGenerateClass] = useState('')
  const [generateFormat, setGenerateFormat] = useState('PDF')

  // Filter reports
  const filteredReports = useMemo(() => {
    let filtered = [...reports]

    // Date range filter
    if (filterDateFrom) {
      filtered = filtered.filter((r) => new Date(r.generatedOn) >= new Date(filterDateFrom))
    }
    if (filterDateTo) {
      filtered = filtered.filter((r) => new Date(r.generatedOn) <= new Date(filterDateTo))
    }

    // Report type filter
    if (filterTypes.length > 0) {
      filtered = filtered.filter((r) => filterTypes.includes(r.type))
    }

    // Format filter
    if (filterFormat) {
      filtered = filtered.filter((r) => r.format === filterFormat)
    }

    // Search query
    if (searchQuery.trim()) {
      filtered = filtered.filter((r) =>
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.type.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Sorting
    if (sortOrder === 'newest') {
      filtered.sort((a, b) => new Date(b.generatedOn).getTime() - new Date(a.generatedOn).getTime())
    } else if (sortOrder === 'oldest') {
      filtered.sort((a, b) => new Date(a.generatedOn).getTime() - new Date(b.generatedOn).getTime())
    } else if (sortOrder === 'type') {
      filtered.sort((a, b) => a.type.localeCompare(b.type))
    }

    return filtered
  }, [reports, filterDateFrom, filterDateTo, filterTypes, filterFormat, searchQuery, sortOrder])

  // Clear all filters
  const clearFilters = () => {
    setFilterDateFrom('')
    setFilterDateTo('')
    setFilterTypes([])
    setFilterFormat('')
  }

  // Handle report type card click
  const handleReportTypeClick = (type: string) => {
    setSelectedReportType(type)
    setShowGenerateModal(true)
  }

  // Handle generate report
  const handleGenerateReport = async () => {
    setIsGenerating(true)
    // Simulate loading
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const newReport = {
      id: `report-${Date.now()}`,
      name: `${selectedReportType} Report - ${new Date().toLocaleDateString()}`,
      type: selectedReportType || 'Attendance',
      period: generateClass || 'All Classes',
      generatedOn: new Date().toISOString().split('T')[0],
      format: generateFormat,
      semester: 5,
      quarter: 'Q2',
    }

    setReports([newReport, ...reports])
    setShowGenerateModal(false)
    setIsGenerating(false)
    setGenerateClass('')
    setGenerateDateFrom('')
    setGenerateDateTo('')

    toast({
      title: 'Success',
      description: `${selectedReportType} report generated successfully`,
    })
  }

  // Handle delete report
  const handleDeleteReport = (id: string) => {
    setReports(reports.filter((r) => r.id !== id))
    toast({
      title: 'Success',
      description: 'Report deleted',
    })
  }

  // Handle export PDF
  const handleExportPDF = (reportName: string, type: string) => {
    const pdfContent = `
${reportName}
Type: ${type}
Generated on: ${new Date().toLocaleDateString()}

Report Data:
Lorem ipsum dolor sit amet, consectetur adipiscing elit.
This is a mock PDF export containing report data.
    `.trim()

    const blob = new Blob([pdfContent], { type: 'text/plain' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${reportName}.txt`
    a.click()
    window.URL.revokeObjectURL(url)

    toast({
      title: 'Success',
      description: 'PDF exported successfully',
    })
  }

  // Handle export Excel
  const handleExportExcel = (reportName: string, type: string) => {
    const csvContent = `Report Name,Type,Generated Date
"${reportName}","${type}","${new Date().toLocaleDateString()}"
,
Data Row 1,Value 1,Value 2
Data Row 2,Value 3,Value 4
Data Row 3,Value 5,Value 6`

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${reportName}.csv`
    a.click()
    window.URL.revokeObjectURL(url)

    toast({
      title: 'Success',
      description: 'Excel exported successfully',
    })
  }

  // Get type color
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Attendance':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      case 'Performance':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'Leave':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300'
      case 'Assignments':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  const hasActiveFilters =
    filterDateFrom || filterDateTo || filterTypes.length > 0 || filterFormat

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground">Generate and download reports</p>
        </div>
        <Button
          variant="outline"
          onClick={() => setShowFiltersPanel(!showFiltersPanel)}
        >
          <Filter className="mr-2 h-4 w-4" />
          Filters
        </Button>
      </div>

      {/* Filters Panel */}
      {showFiltersPanel && (
        <Card className="bg-muted/50">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-4">
                {/* Date From */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">From Date</label>
                  <input
                    type="date"
                    value={filterDateFrom}
                    onChange={(e) => setFilterDateFrom(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md bg-background text-sm"
                  />
                </div>

                {/* Date To */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">To Date</label>
                  <input
                    type="date"
                    value={filterDateTo}
                    onChange={(e) => setFilterDateTo(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md bg-background text-sm"
                  />
                </div>

                {/* Report Type */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Report Type</label>
                  <select
                    multiple
                    value={filterTypes}
                    onChange={(e) =>
                      setFilterTypes(
                        Array.from(e.target.selectedOptions, (option) => option.value)
                      )
                    }
                    className="w-full px-3 py-2 border rounded-md bg-background text-sm"
                  >
                    <option value="Attendance">Attendance</option>
                    <option value="Performance">Performance</option>
                    <option value="Leave">Leave</option>
                    <option value="Assignments">Assignments</option>
                  </select>
                </div>

                {/* Format */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Format</label>
                  <select
                    value={filterFormat}
                    onChange={(e) => setFilterFormat(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md bg-background text-sm"
                  >
                    <option value="">All Formats</option>
                    <option value="PDF">PDF</option>
                    <option value="Excel">Excel</option>
                  </select>
                </div>
              </div>

              {/* Filter Actions */}
              <div className="flex gap-2 pt-2">
                {hasActiveFilters && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearFilters}
                  >
                    <X className="h-3 w-3 mr-1" />
                    Clear Filters
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Report Type Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        {['Attendance', 'Performance', 'Leave', 'Assignments'].map((type) => (
          <Card
            key={type}
            onClick={() => handleReportTypeClick(type)}
            className="cursor-pointer hover:shadow-lg hover:border-primary/50 transition-all"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{type}</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                {type === 'Attendance' && 'Generate attendance reports'}
                {type === 'Performance' && 'Student performance reports'}
                {type === 'Leave' && 'Leave summary reports'}
                {type === 'Assignments' && 'Assignment reports'}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Reports */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div className="space-y-1">
            <CardTitle>
              Recent Reports{' '}
              <Badge variant="secondary" className="ml-2">
                {filteredReports.length}
              </Badge>
            </CardTitle>
          </div>
          <div className="flex gap-2">
            {/* Sort */}
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as any)}
              className="px-3 py-1 text-sm border rounded-md bg-background"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="type">By Type</option>
            </select>
          </div>
        </CardHeader>

        <CardContent>
          {/* Search */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search reports..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          {/* Loading State */}
          {false && (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 bg-muted rounded-lg animate-pulse" />
              ))}
            </div>
          )}

          {/* Error State */}
          {hasError && (
            <div className="text-center py-8 space-y-4">
              <p className="text-muted-foreground">Failed to load reports</p>
              <Button
                variant="outline"
                onClick={() => setHasError(false)}
              >
                Retry
              </Button>
            </div>
          )}

          {/* Empty State */}
          {!false && !hasError && filteredReports.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No reports generated yet. Click a report type above to get started.
            </div>
          )}

          {/* Reports List */}
          {!false && !hasError && filteredReports.length > 0 && (
            <div className="space-y-4">
              {filteredReports.map((report) => (
                <div
                  key={report.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-medium truncate">{report.name}</h4>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <Badge
                          className={getTypeColor(report.type)}
                          variant="secondary"
                        >
                          {report.type}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {report.period}
                        </span>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground">
                          Generated on{' '}
                          {new Date(report.generatedOn).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 flex-shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleExportPDF(report.name, report.type)}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      PDF
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleExportExcel(report.name, report.type)}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Excel
                    </Button>

                    {/* Menu */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleDeleteReport(report.id)}
                          className="text-red-600"
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Generate Report Modal */}
      <Dialog open={showGenerateModal} onOpenChange={setShowGenerateModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Generate {selectedReportType} Report</DialogTitle>
            <DialogDescription>
              Configure and generate a new report
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Report Type (pre-filled) */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Report Type</label>
              <input
                type="text"
                value={selectedReportType || ''}
                disabled
                className="w-full px-3 py-2 border rounded-md bg-muted text-sm"
              />
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="text-sm font-medium">From Date</label>
                <input
                  type="date"
                  value={generateDateFrom}
                  onChange={(e) => setGenerateDateFrom(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md bg-background text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">To Date</label>
                <input
                  type="date"
                  value={generateDateTo}
                  onChange={(e) => setGenerateDateTo(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md bg-background text-sm"
                />
              </div>
            </div>

            {/* Class Selector */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Class/Section</label>
              <Select value={generateClass} onValueChange={setGenerateClass}>
                <SelectTrigger>
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  {mockClasses.map((cls) => (
                    <SelectItem key={cls} value={cls}>
                      {cls}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Format Toggle */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Format</label>
              <div className="flex gap-2">
                {['PDF', 'Excel'].map((format) => (
                  <Button
                    key={format}
                    variant={generateFormat === format ? 'default' : 'outline'}
                    size="sm"
                    className="flex-1"
                    onClick={() => setGenerateFormat(format)}
                  >
                    {format}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowGenerateModal(false)}
              disabled={isGenerating}
            >
              Cancel
            </Button>
            <Button onClick={handleGenerateReport} disabled={isGenerating}>
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                'Generate Report'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
