import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { X, SlidersHorizontal } from 'lucide-react'
import type { AssignmentFilters } from '@/pages/Assignments'

interface AssignmentFilterBarProps {
  filters: AssignmentFilters
  onFiltersChange: (filters: AssignmentFilters) => void
  activeFilterCount: number
}

const SUBJECTS = [
  { id: 'cse-1', name: 'Data Structures' },
  { id: 'cse-2', name: 'DBMS' },
  { id: 'cse-3', name: 'Web Development' },
  { id: 'cse-4', name: 'Algorithms' },
]

const STATUSES = [
  { value: 'PENDING', label: 'Pending' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'GRADED', label: 'Graded' },
]

export function AssignmentFilterBar({
  filters,
  onFiltersChange,
  activeFilterCount,
}: AssignmentFilterBarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [localFilters, setLocalFilters] = useState<AssignmentFilters>(filters)

  const handleSearchChange = (value: string) => {
    const newFilters = { ...localFilters, search: value }
    setLocalFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const handleFilterChange = (key: keyof AssignmentFilters, value: string) => {
    const newFilters = {
      ...localFilters,
      [key]: value || undefined,
    }
    setLocalFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const handleClearFilters = () => {
    setLocalFilters({})
    onFiltersChange({})
    setIsOpen(false)
  }

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div>
        <Input
          placeholder="Search assignments by title or description..."
          value={filters.search || ''}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="w-full"
        />
      </div>

      {/* Filters Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="gap-2">
            <SlidersHorizontal className="h-4 w-4" />
            Filters
            {activeFilterCount > 0 && (
              <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs font-semibold text-white bg-blue-600 rounded-full">
                {activeFilterCount}
              </span>
            )}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Filters</DialogTitle>
            <DialogDescription>Filter assignments by subject and status</DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Subject Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Subject</label>
              <Select
                value={filters.subject || ''}
                onValueChange={(value) => handleFilterChange('subject', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Subjects" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Subjects</SelectItem>
                  {SUBJECTS.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Status Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select
                value={filters.status || ''}
                onValueChange={(value) => handleFilterChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Statuses</SelectItem>
                  {STATUSES.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Active Filters */}
            {activeFilterCount > 0 && (
              <div className="pt-4 border-t space-y-2">
                <p className="text-sm font-medium">Active Filters:</p>
                <div className="flex flex-wrap gap-2">
                  {filters.subject && (
                    <div className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">
                      <span>
                        {SUBJECTS.find((s) => s.id === filters.subject)?.name || filters.subject}
                      </span>
                      <button
                        onClick={() => handleFilterChange('subject', '')}
                        className="ml-1 hover:opacity-70"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                  {filters.status && (
                    <div className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">
                      <span>
                        {STATUSES.find((s) => s.value === filters.status)?.label || filters.status}
                      </span>
                      <button
                        onClick={() => handleFilterChange('status', '')}
                        className="ml-1 hover:opacity-70"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearFilters}
                  className="w-full mt-2"
                >
                  Clear All Filters
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
