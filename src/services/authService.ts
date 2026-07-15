import { getAllUsers } from '@/data/mockData';
import { mockApiCall } from './mockApi';
import type { User, ApiResponse } from '@/types';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export const authService = {
  login: async (credentials: LoginCredentials): Promise<ApiResponse<LoginResponse>> => {
    return mockApiCall(() => {
      const users = getAllUsers();
      const user = users.find(
        (u) => u.email === credentials.email && u.password === credentials.password
      );

      if (!user) {
        throw new Error('Invalid email or password');
      }

      if (!user.isActive) {
        throw new Error('Account is inactive. Please contact administrator.');
      }

      // Generate a mock JWT token
      const token = `mock-jwt-token-${user.id}-${Date.now()}`;

      return {
        data: { user, token },
        message: 'Login successful',
        success: true,
      };
    }, 'Login failed');
  },

  logout: async (): Promise<ApiResponse<null>> => {
    return mockApiCall(() => ({
      data: null,
      message: 'Logout successful',
      success: true,
    }), 'Logout failed');
  },

  getCurrentUser: async (token: string): Promise<ApiResponse<User>> => {
    return mockApiCall(() => {
      // Extract user ID from token
      const userId = token.split('-')[3];
      const users = getAllUsers();
      const user = users.find((u) => u.id === userId);

      if (!user) {
        throw new Error('User not found');
      }

      return {
        data: user,
        message: 'User fetched successfully',
        success: true,
      };
    }, 'Failed to fetch user');
  },

  changePassword: async (
    userId: string,
    oldPassword: string,
    newPassword: string
  ): Promise<ApiResponse<null>> => {
    return mockApiCall(() => {
      const users = getAllUsers();
      const user = users.find((u) => u.id === userId);

      if (!user) {
        throw new Error('User not found');
      }

      if (user.password !== oldPassword) {
        throw new Error('Current password is incorrect');
      }

      // In a real app, this would update the password in the database
      user.password = newPassword;

      return {
        data: null,
        message: 'Password changed successfully',
        success: true,
      };
    }, 'Failed to change password');
  },
};
