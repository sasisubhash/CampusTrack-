import { useState, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Search } from 'lucide-react'
import type { Student } from '@/types'

interface MarkAttendanceDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  subject: string
  time: string
  students: Student[]
  currentAttendance: Record<string, 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED'>
  onSave: (attendance: Record<string, 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED'>) => Promise<void>
  isLoading?: boolean
  readOnly?: boolean
}

export function MarkAttendanceDialog({
  open,
  onOpenChange,
  subject,
  time,
  students,
  currentAttendance,
  onSave,
  isLoading,
  readOnly,
}: MarkAttendanceDialogProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [attendance, setAttendance] = useState(currentAttendance)

  const filteredStudents = useMemo(() => {
    if (!searchQuery.trim()) return students
    const query = searchQuery.toLowerCase()
    return students.filter(
      (s) =>
        `${s.firstName} ${s.lastName}`.toLowerCase().includes(query) ||
        s.rollNumber.toLowerCase().includes(query) ||
        s.email.toLowerCase().includes(query)
    )
  }, [students, searchQuery])

  const handleStatusChange = (studentId: string, status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED') => {
    if (readOnly) return
    setAttendance((prev) => ({
      ...prev,
      [studentId]: status,
    }))
  }

  const handleMarkAllPresent = () => {
    if (readOnly) return
    const newAttendance: Record<string, 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED'> = {}
    filteredStudents.forEach((student) => {
      newAttendance[student.id] = 'PRESENT'
    })
    setAttendance((prev) => ({
      ...prev,
      ...newAttendance,
    }))
  }

  const handleSave = async () => {
    await onSave(attendance)
    onOpenChange(false)
  }

  const statusColors = {
    PRESENT: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    ABSENT: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    LATE: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    EXCUSED: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  }

  const presentCount = Object.values(attendance).filter((s) => s === 'PRESENT' || s === 'LATE').length
  const totalCount = students.length

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{readOnly ? 'View' : 'Take/Edit'} Attendance — {subject} · {time}</DialogTitle>
          <DialogDescription>
            {presentCount}/{totalCount} students present ({Math.round((presentCount / totalCount) * 100)}%)
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search */}
          <div className="relative flex items-center">
            <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, roll number, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
              disabled={readOnly}
            />
          </div>

          {/* Quick Actions */}
          {!readOnly && (
            <Button
              variant="outline"
              onClick={handleMarkAllPresent}
              size="sm"
              disabled={isLoading}
            >
              Mark all present (filtered)
            </Button>
          )}

          {/* Students Table */}
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Avatar</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Roll Number</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={student.avatar} />
                        <AvatarFallback>
                          {student.firstName[0]}{student.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {student.firstName} {student.lastName}
                        </div>
                        <div className="text-sm text-muted-foreground">{student.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>{student.rollNumber}</TableCell>
                    <TableCell>
                      {readOnly ? (
                        <Badge className={statusColors[attendance[student.id] || 'ABSENT']}>
                          {attendance[student.id] || 'ABSENT'}
                        </Badge>
                      ) : (
                        <div className="flex gap-2">
                          {(['PRESENT', 'ABSENT', 'LATE', 'EXCUSED'] as const).map((status) => (
                            <Badge
                              key={status}
                              variant={attendance[student.id] === status ? 'default' : 'outline'}
                              className={`cursor-pointer ${statusColors[status]}`}
                              onClick={() => handleStatusChange(student.id, status)}
                            >
                              {status[0]}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            {!readOnly && (
              <Button onClick={handleSave} disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save Attendance'}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
