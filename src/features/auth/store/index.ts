import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authApi } from '../../../api/instances';
import { queryClient } from '../../../lib/queryClient';
import type { User } from '../types';

interface AuthState {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    error: string | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    checkLogin: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isLoading: false,
    isAuthenticated: false,
    error: null,

    login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
            const response = await authApi.authenticateUser({ loginRequest: { email, password } });
            // The API response is directly the AuthTokenResponseDto since authenticateUser returns object in types
            // However, based on sanchalak-be-openapi.json, /api/auth/signin returns object (AuthTokenResponseDto presumably wrapped)
            // Let's check how authenticateUser is typed in api/instances.ts or the response structure.
            // Based on previous verifyOtp, it was response.data.data.

            const data = (response.data as any).data || response.data;

            if (data && data.accessToken) {
                const apiUser = data.user;
                const mappedUser: User = {
                    id: apiUser?.userId || '',
                    name: apiUser?.name || `${apiUser?.firstName || ''} ${apiUser?.lastName || ''}`.trim(),
                    mobile: apiUser?.mobileNumber || '',
                    email: apiUser?.email || email,
                    role: (apiUser?.role as string)?.includes('ADMIN') ? 'admin' : 'teacher',
                };
                await AsyncStorage.setItem('authToken', data.accessToken);
                if (data.refreshToken) await AsyncStorage.setItem('refreshToken', data.refreshToken);
                await AsyncStorage.setItem('user', JSON.stringify(mappedUser));
                set({ user: mappedUser, isAuthenticated: true });
            } else {
                throw new Error('Invalid response from server');
            }
        } catch (error: any) {
            console.error('Login error:', error);
            set({ error: error.response?.data?.message || error.message || 'Login failed' });
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    logout: async () => {
        try {
            const refreshToken = await AsyncStorage.getItem('refreshToken');
            if (refreshToken) {
                await authApi.logout({ refreshTokenRequestDto: { refreshToken } });
            }
        } catch (e) {
            console.error('Logout API error:', e);
        } finally {
            await AsyncStorage.multiRemove(['authToken', 'refreshToken', 'user']);
            queryClient.clear();
            set({ user: null, isAuthenticated: false, error: null });
        }
    },

    checkLogin: async () => {
        set({ isLoading: true });
        try {
            const token = await AsyncStorage.getItem('authToken');
            const userStr = await AsyncStorage.getItem('user');
            if (token && userStr) {
                set({ user: JSON.parse(userStr), isAuthenticated: true });
            }
        } catch (error) {
            console.error('Check login error:', error);
        } finally {
            set({ isLoading: false });
        }
    }
}));
