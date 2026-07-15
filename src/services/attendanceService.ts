import { mockAttendance, mockSubjects } from '@/data/mockData'
import { mockApiCall, mockUpdate, mockDelete } from './mockApi'
import type { Attendance, ApiResponse, AttendanceStats } from '@/types'

export const attendanceService = {
  getAll: async (filters?: {
    studentId?: string
    subjectId?: string
    date?: string
    dateFrom?: string
    dateTo?: string
  }): Promise<ApiResponse<Attendance[]>> => {
    return mockApiCall(() => {
      let attendance = [...mockAttendance]

      if (filters?.studentId) {
        attendance = attendance.filter((a) => a.studentId === filters.studentId)
      }

      if (filters?.subjectId) {
        attendance = attendance.filter((a) => a.subjectId === filters.subjectId)
      }

      if (filters?.date) {
        attendance = attendance.filter((a) => a.date === filters.date)
      }

      if (filters?.dateFrom) {
        attendance = attendance.filter((a) => a.date >= filters.dateFrom!)
      }

      if (filters?.dateTo) {
        attendance = attendance.filter((a) => a.date <= filters.dateTo!)
      }

      return {
        data: attendance,
        message: 'Attendance records fetched successfully',
        success: true,
      }
    }, 'Failed to fetch attendance')
  },

  getStats: async (studentId: string): Promise<ApiResponse<AttendanceStats>> => {
    return mockApiCall(() => {
      const studentAttendance = mockAttendance.filter((a) => a.studentId === studentId)
      const subjects = mockSubjects

      const subjectWise = subjects.map((subject) => {
        const subjectAttendance = studentAttendance.filter(
          (a) => a.subjectId === subject.id
        )
        const attended = subjectAttendance.filter(
          (a) => a.status === 'PRESENT' || a.status === 'LATE'
        ).length
        const total = subjectAttendance.length

        return {
          subjectId: subject.id,
          subjectName: subject.name,
          attended,
          total,
          percentage: total > 0 ? Math.round((attended / total) * 100) : 0,
        }
      })

      const totalClasses = studentAttendance.length
      const attended = studentAttendance.filter(
        (a) => a.status === 'PRESENT' || a.status === 'LATE'
      ).length

      return {
        data: {
          totalClasses,
          attended,
          percentage: totalClasses > 0 ? Math.round((attended / totalClasses) * 100) : 0,
          subjectWise,
        },
        message: 'Attendance stats fetched successfully',
        success: true,
      }
    }, 'Failed to fetch attendance stats')
  },

  markAttendance: async (data: {
    studentIds: string[]
    subjectId: string
    date: string
    status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED'
    markedBy: string
    remarks?: string
  }): Promise<ApiResponse<Attendance[]>> => {
    return mockApiCall(() => {
      const attendanceRecords: Attendance[] = data.studentIds.map((studentId) => ({
        id: `att-${Date.now()}-${studentId}`,
        studentId,
        subjectId: data.subjectId,
        date: data.date,
        status: data.status,
        remarks: data.remarks,
        markedBy: data.markedBy,
        createdAt: new Date().toISOString(),
      }))

      return {
        data: attendanceRecords,
        message: 'Attendance marked successfully',
        success: true,
      }
    }, 'Failed to mark attendance')
  },

  update: async (id: string, data: Partial<Attendance>): Promise<ApiResponse<Attendance>> => {
    return mockUpdate({
      ...data,
      id,
    } as Attendance).then((attendance) => ({
      data: attendance,
      message: 'Attendance updated successfully',
      success: true,
    }))
  },

  delete: async (id: string): Promise<ApiResponse<null>> => {
    return mockDelete(id).then(() => ({
      data: null,
      message: 'Attendance deleted successfully',
      success: true,
    }))
  },

  exportToPDF: async (_filters: any): Promise<ApiResponse<Blob>> => {
    return mockApiCall(() => {
      // Mock PDF blob
      const blob = new Blob(['Mock PDF Content'], { type: 'application/pdf' })
      return {
        data: blob,
        message: 'PDF exported successfully',
        success: true,
      }
    }, 'Failed to export PDF')
  },

  exportToExcel: async (_filters: any): Promise<ApiResponse<Blob>> => {
    return mockApiCall(() => {
      // Mock Excel blob
      const blob = new Blob(['Mock Excel Content'], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      })
      return {
        data: blob,
        message: 'Excel exported successfully',
        success: true,
      }
    }, 'Failed to export Excel')
  },
}
