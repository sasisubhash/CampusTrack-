import type { Department, Semester, UserRole } from '@/types';

// Theme Colors
export const COLORS = {
  primary: '#2563EB',
  background: '#F8FAFC',
  surface: '#FFFFFF',
  border: '#E2E8F0',
  text: {
    primary: '#0F172A',
    secondary: '#64748B',
  },
} as const;

// Departments
export const DEPARTMENTS: { value: Department; label: string }[] = [
  { value: 'CSE', label: 'Computer Science Engineering' },
  { value: 'ECE', label: 'Electronics & Communication Engineering' },
  { value: 'EEE', label: 'Electrical & Electronics Engineering' },
  { value: 'MECH', label: 'Mechanical Engineering' },
  { value: 'CIVIL', label: 'Civil Engineering' },
];

// Semesters
export const SEMESTERS: { value: Semester; label: string }[] = [
  { value: '1', label: 'Semester 1' },
  { value: '2', label: 'Semester 2' },
  { value: '3', label: 'Semester 3' },
  { value: '4', label: 'Semester 4' },
  { value: '5', label: 'Semester 5' },
  { value: '6', label: 'Semester 6' },
  { value: '7', label: 'Semester 7' },
  { value: '8', label: 'Semester 8' },
];

// User Roles
export const USER_ROLES: { value: UserRole; label: string }[] = [
  { value: 'HOD', label: 'HOD (Super Admin)' },
  { value: 'STAFF', label: 'Staff (Admin)' },
  { value: 'STUDENT', label: 'Student (End User)' },
  { value: 'PARENT', label: 'Parent (Viewer)' },
];

// Academic Years
export const ACADEMIC_YEARS = [
  '2023-2024',
  '2024-2025',
  '2025-2026',
  '2026-2027',
];

// Date Formats
export const DATE_FORMAT = 'dd/MM/yyyy';
export const DATE_TIME_FORMAT = 'dd/MM/yyyy HH:mm';
export const TIME_FORMAT = 'HH:mm';

// Pagination
export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

// API Delays (for mock API)
export const API_DELAY = {
  MIN: 300,
  MAX: 800,
};

// Status Colors
export const STATUS_COLORS = {
  PRESENT: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  ABSENT: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  LATE: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  EXCUSED: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  
  PENDING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  COMPLETED: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  
  APPROVED: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  REJECTED: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  PARENT_PENDING: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
  
  SUBMITTED: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  GRADED: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
} as const;

// Performance Thresholds
export const PERFORMANCE_THRESHOLDS = {
  EXCELLENT: 90,
  GOOD: 75,
  AVERAGE: 60,
  POOR: 40,
} as const;

// File Upload
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];
