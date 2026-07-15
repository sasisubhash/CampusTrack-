import { mockAssignments, mockStudents } from '@/data/mockData'
import { mockApiCall } from './mockApi'
import type { Assignment, ApiResponse } from '@/types'

export interface AssignmentSubmission {
  id: string
  studentId: string
  studentName: string
  submittedAt: string
  fileName: string
  status: 'SUBMITTED' | 'GRADED' | 'LATE'
  marks?: number
  maxMarks: number
  feedback?: string
}

export interface AssignmentFilterOptions {
  search?: string
  subjectId?: string
  status?: string
}

export const assignmentService = {
  getAll: async (filters?: AssignmentFilterOptions): Promise<ApiResponse<Assignment[]>> => {
    return mockApiCall(() => {
      let assignments = [...mockAssignments]

      if (filters?.search) {
        const search = filters.search.toLowerCase()
        assignments = assignments.filter(
          (a) =>
            a.title.toLowerCase().includes(search) ||
            a.description.toLowerCase().includes(search)
        )
      }

      if (filters?.subjectId) {
        assignments = assignments.filter((a) => a.subjectId === filters.subjectId)
      }

      return {
        data: assignments,
        message: 'Assignments fetched successfully',
        success: true,
      }
    }, 'Failed to fetch assignments')
  },

  getById: async (id: string): Promise<ApiResponse<Assignment>> => {
    return mockApiCall(() => {
      const assignment = mockAssignments.find((a) => a.id === id)

      if (!assignment) {
        throw new Error('Assignment not found')
      }

      return {
        data: assignment,
        message: 'Assignment fetched successfully',
        success: true,
      }
    }, 'Failed to fetch assignment')
  },

  create: async (
    data: Omit<Assignment, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<ApiResponse<Assignment>> => {
    return mockApiCall(() => {
      const newAssignment: Assignment = {
        ...data,
        id: `assign-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      mockAssignments.push(newAssignment)

      return {
        data: newAssignment,
        message: 'Assignment created successfully',
        success: true,
      }
    }, 'Failed to create assignment')
  },

  update: async (
    id: string,
    data: Partial<Omit<Assignment, 'id' | 'createdAt'>>
  ): Promise<ApiResponse<Assignment>> => {
    return mockApiCall(() => {
      const assignmentIndex = mockAssignments.findIndex((a) => a.id === id)

      if (assignmentIndex === -1) {
        throw new Error('Assignment not found')
      }

      const updatedAssignment: Assignment = {
        ...mockAssignments[assignmentIndex],
        ...data,
        id: mockAssignments[assignmentIndex].id,
        createdAt: mockAssignments[assignmentIndex].createdAt,
        updatedAt: new Date().toISOString(),
      }

      mockAssignments[assignmentIndex] = updatedAssignment

      return {
        data: updatedAssignment,
        message: 'Assignment updated successfully',
        success: true,
      }
    }, 'Failed to update assignment')
  },

  delete: async (id: string): Promise<ApiResponse<void>> => {
    return mockApiCall(() => {
      const assignmentIndex = mockAssignments.findIndex((a) => a.id === id)

      if (assignmentIndex === -1) {
        throw new Error('Assignment not found')
      }

      mockAssignments.splice(assignmentIndex, 1)

      return {
        data: undefined,
        message: 'Assignment deleted successfully',
        success: true,
      }
    }, 'Failed to delete assignment')
  },

  getSubmissions: async (assignmentId: string): Promise<ApiResponse<AssignmentSubmission[]>> => {
    return mockApiCall(() => {
      const assignment = mockAssignments.find((a) => a.id === assignmentId)

      if (!assignment) {
        throw new Error('Assignment not found')
      }

      const submissions: AssignmentSubmission[] = assignment.assignedTo.map((studentId, idx) => {
        const student = mockStudents.find((s) => s.id === studentId)
        // Mock: 70% submission rate
        const hasSubmitted = Math.random() > 0.3
        const submittedAt = hasSubmitted
          ? new Date(Date.now() - Math.random() * 86400000 * 5).toISOString()
          : ''
        const isLate = hasSubmitted && new Date(submittedAt) > new Date(assignment.dueDate)
        
        // Mock: 80% graded of submitted
        const isGraded = hasSubmitted && Math.random() > 0.2
        const marks = isGraded ? Math.floor(Math.random() * assignment.maxMarks) : undefined

        const status: 'SUBMITTED' | 'GRADED' | 'LATE' = !hasSubmitted 
          ? 'SUBMITTED' 
          : isGraded 
            ? 'GRADED' 
            : isLate 
              ? 'LATE'
              : 'SUBMITTED'

        return {
          id: `submission-${studentId}-${assignmentId}`,
          studentId,
          studentName: student ? `${student.firstName} ${student.lastName}` : 'Unknown',
          submittedAt,
          fileName: hasSubmitted ? `assignment-${idx + 1}.pdf` : '',
          status,
          marks,
          maxMarks: assignment.maxMarks,
          feedback: isGraded ? 'Good work! Well done.' : undefined,
        }
      }).filter((s) => s.submittedAt) // Only return submitted ones

      return {
        data: submissions,
        message: 'Submissions fetched successfully',
        success: true,
      }
    }, 'Failed to fetch submissions')
  },

  submit: async (
    _assignmentId: string,
    _studentId: string,
    _fileName: string,
    _comment?: string
  ): Promise<ApiResponse<void>> => {
    return mockApiCall(() => {
      // In real app, would update assignment submission status
      return {
        data: undefined,
        message: 'Assignment submitted successfully',
        success: true,
      }
    }, 'Failed to submit assignment')
  },

  gradeSubmission: async (
    _assignmentId: string,
    _studentId: string,
    _marks: number,
    _feedback: string
  ): Promise<ApiResponse<void>> => {
    return mockApiCall(() => {
      return {
        data: undefined,
        message: 'Submission graded successfully',
        success: true,
      }
    }, 'Failed to grade submission')
  },
}
