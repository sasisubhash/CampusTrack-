// Core Types
export type UserRole = 'HOD' | 'STAFF' | 'STUDENT' | 'PARENT';

export type Department = 'CSE' | 'ECE' | 'EEE' | 'MECH' | 'CIVIL';

export type Semester = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8';

export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';

export type TaskStatus = 'PENDING' | 'COMPLETED' | 'LATE';

export type LeaveStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'PARENT_PENDING';

export type AnnouncementType = 'DEPARTMENT' | 'COLLEGE' | 'EMERGENCY';

export type EventType = 'EXAM' | 'WORKSHOP' | 'HOLIDAY' | 'MEETING' | 'ASSIGNMENT_DEADLINE';

// User Types
export interface User {
  id: string;
  email: string;
  password: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  phone: string;
  avatar?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface HOD extends User {
  role: 'HOD';
  department: Department;
  employeeId: string;
}

export interface Staff extends User {
  role: 'STAFF';
  department: Department;
  employeeId: string;
  subjects: string[];
}

export interface Student extends User {
  role: 'STUDENT';
  rollNumber: string;
  department: Department;
  semester: Semester;
  parentId: string;
  academicYear: string;
}

export interface Parent extends User {
  role: 'PARENT';
  childrenIds: string[];
}

// Attendance
export interface Attendance {
  id: string;
  studentId: string;
  subjectId: string;
  date: string;
  status: AttendanceStatus;
  remarks?: string;
  markedBy: string;
  createdAt: string;
}

export interface AttendanceStats {
  totalClasses: number;
  attended: number;
  percentage: number;
  subjectWise: {
    subjectId: string;
    subjectName: string;
    attended: number;
    total: number;
    percentage: number;
  }[];
}

// Tasks & Assignments
export interface DailyTask {
  id: string;
  title: string;
  description: string;
  subjectId: string;
  createdBy: string;
  assignedTo: string[]; // student IDs
  dueDate: string;
  status: TaskStatus;
  attachments?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  subjectId: string;
  createdBy: string;
  assignedTo: string[]; // student IDs
  dueDate: string;
  maxMarks: number;
  attachments?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  studentId: string;
  submittedAt: string;
  attachments: string[];
  remarks?: string;
  marks?: number;
  gradedBy?: string;
  gradedAt?: string;
  status: 'SUBMITTED' | 'GRADED' | 'LATE';
}

// Leave Management
export interface Leave {
  id: string;
  studentId: string;
  studentName?: string;
  type: 'SICK' | 'CASUAL' | 'PERMISSION';
  fromDate: string;
  toDate: string;
  reason: string;
  parentConfirmation: boolean;
  parentConfirmedAt?: string;
  status: LeaveStatus;
  approvedBy?: string;
  approvedAt?: string;
  remarks?: string;
  createdAt: string;
}

// Calendar
export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  type: EventType;
  startDate: string;
  endDate: string;
  department?: Department;
  createdBy: string;
  participants?: string[];
  location?: string;
  createdAt: string;
  updatedAt: string;
}

// Announcements
export interface Announcement {
  id: string;
  title: string;
  content: string;
  type: AnnouncementType;
  department?: Department;
  createdBy: string;
  attachments?: string[];
  isPinned: boolean;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

// Performance
export interface Performance {
  id: string;
  studentId: string;
  semester: Semester;
  academicYear: string;
  attendancePercentage: number;
  assignmentPercentage: number;
  taskCompletionPercentage: number;
  overallPerformance: number;
  subjectWise: {
    subjectId: string;
    subjectName: string;
    attendance: number;
    assignments: number;
    performance: number;
  }[];
  createdAt: string;
  updatedAt: string;
}

// Subject
export interface Subject {
  id: string;
  name: string;
  code: string;
  department: Department;
  semester: Semester;
  credits: number;
  staffId: string;
}

// Notifications
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'INFO' | 'WARNING' | 'SUCCESS' | 'ERROR';
  isRead: boolean;
  link?: string;
  createdAt: string;
}

// Settings
export interface Settings {
  userId: string;
  theme: 'light' | 'dark' | 'system';
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  academicYear: string;
  semester: Semester;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Filter & Sort Types
export interface FilterOptions {
  search?: string;
  department?: Department;
  semester?: Semester;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  role?: UserRole;
}

export interface SortOptions {
  field: string;
  order: 'asc' | 'desc';
}

export interface TableState {
  page: number;
  pageSize: number;
  filters: FilterOptions;
  sort?: SortOptions;
}
