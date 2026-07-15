import { MoreHorizontal } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent } from '@/components/ui/card'
import type { Student } from '@/types'

interface StudentCardProps {
  student: Student
  isSelected: boolean
  onSelect: (checked: boolean) => void
  onMenuClick: () => void
  onClick: () => void
}

export function StudentCard({ student, isSelected, onSelect, onMenuClick, onClick }: StudentCardProps) {
  return (
    <Card 
      className={`hover:shadow-md transition-shadow cursor-pointer ${isSelected ? 'border-primary' : ''}`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Checkbox
            checked={isSelected}
            onCheckedChange={onSelect}
            className="mt-1"
            onClick={(e) => e.stopPropagation()}
          />
          
          <Avatar className="h-12 w-12">
            <AvatarImage src={student.avatar} />
            <AvatarFallback>
              {student.firstName[0]}{student.lastName[0]}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="font-semibold truncate">
                  {student.firstName} {student.lastName}
                </h3>
                <p className="text-sm text-muted-foreground">{student.rollNumber}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 flex-shrink-0"
                onClick={(e) => {
                  e.stopPropagation()
                  onMenuClick()
                }}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <Badge variant="secondary">{student.department}</Badge>
              <Badge variant="outline">Sem {student.semester}</Badge>
              <Badge variant={student.isActive ? 'default' : 'secondary'}>
                {student.isActive ? 'Active' : 'Inactive'}
              </Badge>
            </div>

            <p className="text-sm text-muted-foreground mt-2 truncate">{student.email}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
