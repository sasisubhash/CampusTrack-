import { MoreHorizontal } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent } from '@/components/ui/card'
import type { User } from '@/types'

interface UserCardProps {
  user: User
  isSelected: boolean
  onSelect: (checked: boolean) => void
  onMenuClick: () => void
}

export function UserCard({ user, isSelected, onSelect, onMenuClick }: UserCardProps) {
  const roleColors = {
    HOD: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    STAFF: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    STUDENT: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    PARENT: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
  }

  return (
    <Card className={isSelected ? 'border-primary' : ''}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Checkbox
            checked={isSelected}
            onCheckedChange={onSelect}
            className="mt-1"
          />
          
          <Avatar className="h-12 w-12">
            <AvatarImage src={user.avatar} />
            <AvatarFallback>
              {user.firstName[0]}{user.lastName[0]}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="font-semibold truncate">
                  {user.firstName} {user.lastName}
                </h3>
                <p className="text-sm text-muted-foreground truncate">{user.email}</p>
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

            <div className="flex items-center gap-2 mt-2">
              <Badge className={roleColors[user.role]} variant="secondary">
                {user.role}
              </Badge>
              <Badge variant={user.isActive ? 'default' : 'secondary'}>
                {user.isActive ? 'Active' : 'Inactive'}
              </Badge>
            </div>

            <p className="text-sm text-muted-foreground mt-2">{user.phone}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
