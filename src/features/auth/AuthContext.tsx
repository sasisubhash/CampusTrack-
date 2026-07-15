import React, { createContext, useContext } from 'react'
import { useAuthStore } from '@/store/authStore'
import type { User } from '@/types'

interface AuthContextType {
    user: User | null
    login: (token: string, userData: User) => void
    logout: () => void
    updateUser: (userData: Partial<User>) => void
    isLoading: boolean
    isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const { user, isAuthenticated, login: storeLogin, logout: storeLogout, updateUser: storeUpdateUser } = useAuthStore()

    const login = (token: string, userData: User) => {
        storeLogin(userData, token)
    }

    const logout = () => {
        storeLogout()
    }

    const updateUser = (userData: Partial<User>) => {
        storeUpdateUser(userData)
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, updateUser, isLoading: false, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
