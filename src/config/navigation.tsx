import {
  LayoutDashboard,
  Users,
  Calendar,
  ClipboardList,
  FileText,
  UserCheck,
  BookOpen,
  Bell,
  BarChart3,
  Settings,
  GraduationCap,
} from 'lucide-react';
import type { UserRole } from '@/types';

export interface NavItem {
  icon: React.ElementType;
  label: string;
  href: string;
  roles: UserRole[];
}

export const navigationItems: NavItem[] = [
  {
    icon: LayoutDashboard,
    label: 'Dashboard',
    href: '/dashboard',
    roles: ['HOD', 'STAFF', 'STUDENT', 'PARENT'],
  },
  {
    icon: Users,
    label: 'User Management',
    href: '/users',
    roles: ['HOD'],
  },
  {
    icon: GraduationCap,
    label: 'Students',
    href: '/students',
    roles: ['HOD', 'STAFF', 'STUDENT', 'PARENT'],
  },
  {
    icon: UserCheck,
    label: 'Attendance',
    href: '/attendance',
    roles: ['HOD', 'STAFF', 'STUDENT', 'PARENT'],
  },
  {
    icon: ClipboardList,
    label: 'Daily Tasks',
    href: '/tasks',
    roles: ['HOD', 'STAFF', 'STUDENT', 'PARENT'],
  },
  {
    icon: BookOpen,
    label: 'Assignments',
    href: '/assignments',
    roles: ['HOD', 'STAFF', 'STUDENT', 'PARENT'],
  },
  {
    icon: FileText,
    label: 'Leave Management',
    href: '/leave',
    roles: ['HOD', 'STAFF', 'STUDENT', 'PARENT'],
  },
  {
    icon: Calendar,
    label: 'Calendar',
    href: '/calendar',
    roles: ['HOD', 'STAFF', 'STUDENT', 'PARENT'],
  },
  {
    icon: Bell,
    label: 'Announcements',
    href: '/announcements',
    roles: ['HOD', 'STAFF', 'STUDENT', 'PARENT'],
  },
  {
    icon: BarChart3,
    label: 'Performance',
    href: '/performance',
    roles: ['HOD', 'STAFF', 'STUDENT', 'PARENT'],
  },
  {
    icon: FileText,
    label: 'Reports',
    href: '/reports',
    roles: ['HOD', 'STAFF'],
  },
  {
    icon: Settings,
    label: 'Settings',
    href: '/settings',
    roles: ['HOD', 'STAFF', 'STUDENT', 'PARENT'],
  },
];

export const getNavigationForRole = (role: UserRole): NavItem[] => {
  return navigationItems.filter((item) => item.roles.includes(role));
};
