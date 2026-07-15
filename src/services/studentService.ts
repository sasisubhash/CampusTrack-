import { mockStudents, mockAttendance, mockPerformance } from '@/data/mockData'
import { mockApiCall, mockUpdate, mockCreate, mockDelete } from './mockApi'
import type { Student, ApiResponse, FilterOptions } from '@/types'

export const studentService = {
  getAll: async (filters?: FilterOptions): Promise<ApiResponse<Student[]>> => {
    return mockApiCall(() => {
      let students = [...mockStudents]

      if (filters?.search) {
        const search = filters.search.toLowerCase()
        students = students.filter(
          (student) =>
            student.firstName.toLowerCase().includes(search) ||
            student.lastName.toLowerCase().includes(search) ||
            student.rollNumber.toLowerCase().includes(search) ||
            student.email.toLowerCase().includes(search)
        )
      }

      if (filters?.department) {
        students = students.filter((s) => s.department === filters.department)
      }

      if (filters?.semester) {
        students = students.filter((s) => s.semester === filters.semester)
      }

      return {
        data: students,
        message: 'Students fetched successfully',
        success: true,
      }
    }, 'Failed to fetch students')
  },

  getById: async (id: string): Promise<ApiResponse<Student>> => {
    return mockApiCall(() => {
      const student = mockStudents.find((s) => s.id === id)

      if (!student) {
        throw new Error('Student not found')
      }

      return {
        data: student,
        message: 'Student fetched successfully',
        success: true,
      }
    }, 'Failed to fetch student')
  },

  create: async (data: Omit<Student, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Student>> => {
    return mockCreate({
      ...data,
      role: 'STUDENT' as const,
      isActive: true,
    } as Student).then((student) => ({
      data: student,
      message: 'Student created successfully',
      success: true,
    }))
  },

  update: async (id: string, data: Partial<Student>): Promise<ApiResponse<Student>> => {
    return mockUpdate({
      ...data,
      id,
      updatedAt: new Date().toISOString(),
    } as Student).then((student) => ({
      data: student,
      message: 'Student updated successfully',
      success: true,
    }))
  },

  delete: async (id: string): Promise<ApiResponse<null>> => {
    return mockDelete(id).then(() => ({
      data: null,
      message: 'Student deleted successfully',
      success: true,
    }))
  },

  toggleStatus: async (id: string, isActive: boolean): Promise<ApiResponse<Student>> => {
    return mockUpdate({
      id,
      isActive,
      updatedAt: new Date().toISOString(),
    } as Student).then((student) => ({
      data: student,
      message: `Student ${isActive ? 'activated' : 'deactivated'} successfully`,
      success: true,
    }))
  },

  getAttendance: async (studentId: string) => {
    return mockApiCall(() => {
      const attendance = mockAttendance.filter((a) => a.studentId === studentId)
      return {
        data: attendance,
        message: 'Attendance fetched successfully',
        success: true,
      }
    }, 'Failed to fetch attendance')
  },

  getPerformance: async (studentId: string) => {
    return mockApiCall(() => {
      const performance = mockPerformance.find((p) => p.studentId === studentId)
      return {
        data: performance || null,
        message: 'Performance fetched successfully',
        success: true,
      }
    }, 'Failed to fetch performance')
  },
}
