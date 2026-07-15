import { Search, Filter, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { mockSubjects } from '@/data/mockData'

export interface TaskFilterUIFilters {
  search?: string
  subject?: string
  status?: string
  dueDate?: string
}

interface TaskFilterBarProps {
  filters: TaskFilterUIFilters
  onFiltersChange: (filters: TaskFilterUIFilters) => void
  activeFilterCount: number
}

export function TaskFilterBar({
  filters,
  onFiltersChange,
  activeFilterCount,
}: TaskFilterBarProps) {
  const handleSearchChange = (value: string) => {
    onFiltersChange({ ...filters, search: value || undefined })
  }

  const handleSubjectChange = (value: string) => {
    onFiltersChange({ ...filters, subject: value || undefined })
  }

  const handleStatusChange = (value: string) => {
    onFiltersChange({ ...filters, status: value || undefined })
  }

  const handleDueDateChange = (value: string) => {
    onFiltersChange({ ...filters, dueDate: value || undefined })
  }

  const handleClearFilters = () => {
    onFiltersChange({})
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            value={filters.search || ''}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filters
              {activeFilterCount > 0 && (
                <Badge className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-primary text-primary-foreground">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Filter Tasks</DialogTitle>
              <DialogDescription>
                Refine your task search with filters
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Subject</label>
                <Select value={filters.subject || ''} onValueChange={handleSubjectChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="All subjects" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All subjects</SelectItem>
                    {mockSubjects.map((subject) => (
                      <SelectItem key={subject.id} value={subject.id}>
                        {subject.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Status</label>
                <Select value={filters.status || ''} onValueChange={handleStatusChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All statuses</SelectItem>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Due By Date</label>
                <Input
                  type="date"
                  value={filters.dueDate || ''}
                  onChange={(e) => handleDueDateChange(e.target.value)}
                />
              </div>

              {activeFilterCount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearFilters}
                  className="w-full"
                >
                  <X className="h-4 w-4 mr-2" />
                  Clear filters
                </Button>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.search && (
            <Badge variant="secondary" className="cursor-pointer">
              Search: "{filters.search}"
              <X
                className="h-3 w-3 ml-1 hover:text-destructive"
                onClick={() => handleSearchChange('')}
              />
            </Badge>
          )}
          {filters.subject && (
            <Badge variant="secondary" className="cursor-pointer">
              Subject: {mockSubjects.find((s) => s.id === filters.subject)?.name}
              <X
                className="h-3 w-3 ml-1 hover:text-destructive"
                onClick={() => handleSubjectChange('')}
              />
            </Badge>
          )}
          {filters.status && (
            <Badge variant="secondary" className="cursor-pointer">
              Status: {filters.status}
              <X
                className="h-3 w-3 ml-1 hover:text-destructive"
                onClick={() => handleStatusChange('')}
              />
            </Badge>
          )}
          {filters.dueDate && (
            <Badge variant="secondary" className="cursor-pointer">
              Due by: {new Date(filters.dueDate).toLocaleDateString()}
              <X
                className="h-3 w-3 ml-1 hover:text-destructive"
                onClick={() => handleDueDateChange('')}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}
