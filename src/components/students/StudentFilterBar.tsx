import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DEPARTMENTS, SEMESTERS } from '@/constants'

export interface StudentFilters {
  department?: string
  semester?: string
  status?: string
}

interface StudentFilterBarProps {
  filters: StudentFilters
  onFiltersChange: (filters: StudentFilters) => void
  onClearFilters: () => void
}

export function StudentFilterBar({ filters, onFiltersChange, onClearFilters }: StudentFilterBarProps) {
  const hasActiveFilters = Object.values(filters).some(v => v !== undefined && v !== '')

  const handleFilterChange = (key: keyof StudentFilters, value: string | undefined) => {
    onFiltersChange({
      ...filters,
      [key]: value === 'all' ? undefined : value,
    })
  }

  return (
    <div className="flex flex-wrap items-center gap-3 p-4 bg-muted/50 rounded-lg border">
      <span className="text-sm font-medium text-muted-foreground">Filters:</span>
      
      <Select
        value={filters.department || 'all'}
        onValueChange={(value) => handleFilterChange('department', value)}
      >
        <SelectTrigger className="w-[180px] h-9 bg-background">
          <SelectValue placeholder="Department" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Departments</SelectItem>
          {DEPARTMENTS.map((dept) => (
            <SelectItem key={dept.value} value={dept.value}>
              {dept.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.semester || 'all'}
        onValueChange={(value) => handleFilterChange('semester', value)}
      >
        <SelectTrigger className="w-[140px] h-9 bg-background">
          <SelectValue placeholder="Semester" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Semesters</SelectItem>
          {SEMESTERS.map((sem) => (
            <SelectItem key={sem.value} value={sem.value}>
              {sem.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.status || 'all'}
        onValueChange={(value) => handleFilterChange('status', value)}
      >
        <SelectTrigger className="w-[140px] h-9 bg-background">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="inactive">Inactive</SelectItem>
        </SelectContent>
      </Select>

      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearFilters}
          className="h-9 text-muted-foreground hover:text-foreground"
        >
          <X className="mr-2 h-4 w-4" />
          Clear filters
        </Button>
      )}
    </div>
  )
}
