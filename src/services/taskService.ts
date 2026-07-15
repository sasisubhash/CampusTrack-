import { mockDailyTasks, mockStudents } from '@/data/mockData'
import { mockApiCall } from './mockApi'
import type { DailyTask, ApiResponse } from '@/types'

export interface TaskFilterOptions {
  search?: string
  subjectId?: string
  status?: string
  dueDateBefore?: string
}

export interface TaskSubmission {
  studentId: string
  studentName: string
  status: 'COMPLETED' | 'PENDING' | 'LATE'
  completedDate?: string
}

export const taskService = {
  getAll: async (filters?: TaskFilterOptions): Promise<ApiResponse<DailyTask[]>> => {
    return mockApiCall(() => {
      let tasks = [...mockDailyTasks]

      if (filters?.search) {
        const search = filters.search.toLowerCase()
        tasks = tasks.filter(
          (task) =>
            task.title.toLowerCase().includes(search) ||
            task.description.toLowerCase().includes(search)
        )
      }

      if (filters?.subjectId) {
        tasks = tasks.filter((t) => t.subjectId === filters.subjectId)
      }

      if (filters?.status) {
        tasks = tasks.filter((t) => t.status === filters.status)
      }

      if (filters?.dueDateBefore) {
        const dueDate = new Date(filters.dueDateBefore)
        tasks = tasks.filter((t) => new Date(t.dueDate) <= dueDate)
      }

      return {
        data: tasks,
        message: 'Tasks fetched successfully',
        success: true,
      }
    }, 'Failed to fetch tasks')
  },

  getById: async (id: string): Promise<ApiResponse<DailyTask>> => {
    return mockApiCall(() => {
      const task = mockDailyTasks.find((t) => t.id === id)

      if (!task) {
        throw new Error('Task not found')
      }

      return {
        data: task,
        message: 'Task fetched successfully',
        success: true,
      }
    }, 'Failed to fetch task')
  },

  create: async (
    data: Omit<DailyTask, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<ApiResponse<DailyTask>> => {
    return mockApiCall(() => {
      const newTask: DailyTask = {
        ...data,
        id: `task-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      mockDailyTasks.push(newTask)

      return {
        data: newTask,
        message: 'Task created successfully',
        success: true,
      }
    }, 'Failed to create task')
  },

  update: async (
    id: string,
    data: Partial<Omit<DailyTask, 'id' | 'createdAt'>>
  ): Promise<ApiResponse<DailyTask>> => {
    return mockApiCall(() => {
      const taskIndex = mockDailyTasks.findIndex((t) => t.id === id)

      if (taskIndex === -1) {
        throw new Error('Task not found')
      }

      const updatedTask: DailyTask = {
        ...mockDailyTasks[taskIndex],
        ...data,
        id: mockDailyTasks[taskIndex].id,
        createdAt: mockDailyTasks[taskIndex].createdAt,
        updatedAt: new Date().toISOString(),
      }

      mockDailyTasks[taskIndex] = updatedTask

      return {
        data: updatedTask,
        message: 'Task updated successfully',
        success: true,
      }
    }, 'Failed to update task')
  },

  delete: async (id: string): Promise<ApiResponse<void>> => {
    return mockApiCall(() => {
      const taskIndex = mockDailyTasks.findIndex((t) => t.id === id)

      if (taskIndex === -1) {
        throw new Error('Task not found')
      }

      mockDailyTasks.splice(taskIndex, 1)

      return {
        data: undefined,
        message: 'Task deleted successfully',
        success: true,
      }
    }, 'Failed to delete task')
  },

  getSubmissions: async (taskId: string): Promise<ApiResponse<TaskSubmission[]>> => {
    return mockApiCall(() => {
      const task = mockDailyTasks.find((t) => t.id === taskId)

      if (!task) {
        throw new Error('Task not found')
      }

      const submissions: TaskSubmission[] = task.assignedTo.map((studentId) => {
        const student = mockStudents.find((s) => s.id === studentId)
        // Mock: 60% completion rate
        const isCompleted = Math.random() > 0.4
        const completedDate = isCompleted
          ? new Date(Date.now() - Math.random() * 86400000).toISOString()
          : undefined

        return {
          studentId,
          studentName: student ? `${student.firstName} ${student.lastName}` : 'Unknown',
          status: isCompleted
            ? new Date(completedDate!) > new Date(task.dueDate)
              ? 'LATE'
              : 'COMPLETED'
            : 'PENDING',
          completedDate,
        }
      })

      return {
        data: submissions,
        message: 'Submissions fetched successfully',
        success: true,
      }
    }, 'Failed to fetch submissions')
  },
}
