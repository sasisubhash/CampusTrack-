import { getAllUsers } from '@/data/mockData'
import { mockApiCall, mockCreate, mockUpdate, mockDelete } from './mockApi'
import type { User, ApiResponse, PaginatedResponse, FilterOptions } from '@/types'

export const userService = {
  getAll: async (filters?: FilterOptions): Promise<ApiResponse<PaginatedResponse<User>>> => {
    return mockApiCall(() => {
      let users = getAllUsers()

      // Apply filters
      if (filters?.search) {
        const search = filters.search.toLowerCase()
        users = users.filter(
          (user) =>
            user.firstName.toLowerCase().includes(search) ||
            user.lastName.toLowerCase().includes(search) ||
            user.email.toLowerCase().includes(search)
        )
      }

      if (filters?.role) {
        users = users.filter((user) => user.role === filters.role)
      }

      if (filters?.status !== undefined) {
        const isActive = filters.status === 'active'
        users = users.filter((user) => user.isActive === isActive)
      }

      return {
        data: {
          data: users,
          total: users.length,
          page: 1,
          pageSize: users.length,
          totalPages: 1,
        },
        message: 'Users fetched successfully',
        success: true,
      }
    }, 'Failed to fetch users')
  },

  getById: async (id: string): Promise<ApiResponse<User>> => {
    return mockApiCall(() => {
      const users = getAllUsers()
      const user = users.find((u) => u.id === id)

      if (!user) {
        throw new Error('User not found')
      }

      return {
        data: user,
        message: 'User fetched successfully',
        success: true,
      }
    }, 'Failed to fetch user')
  },

  create: async (userData: Partial<User>): Promise<ApiResponse<User>> => {
    return mockCreate({
      ...userData,
      id: `user-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as User).then((user) => ({
      data: user,
      message: 'User created successfully',
      success: true,
    }))
  },

  update: async (id: string, userData: Partial<User>): Promise<ApiResponse<User>> => {
    return mockUpdate({
      ...userData,
      id,
      updatedAt: new Date().toISOString(),
    } as User).then((user) => ({
      data: user,
      message: 'User updated successfully',
      success: true,
    }))
  },

  delete: async (id: string): Promise<ApiResponse<null>> => {
    return mockDelete(id).then(() => ({
      data: null,
      message: 'User deleted successfully',
      success: true,
    }))
  },

  toggleStatus: async (id: string, isActive: boolean): Promise<ApiResponse<User>> => {
    return mockUpdate({
      id,
      isActive,
      updatedAt: new Date().toISOString(),
    } as User).then((user) => ({
      data: user,
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
      success: true,
    }))
  },

  resetPassword: async (_id: string): Promise<ApiResponse<null>> => {
    return mockApiCall(() => ({
      data: null,
      message: 'Password reset email sent successfully',
      success: true,
    }), 'Failed to reset password')
  },
}
