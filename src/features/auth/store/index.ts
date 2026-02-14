import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authApi } from '../../../api/instances';

interface AuthState {
    user: any | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    error: string | null;
    requestOtp: (mobile: string) => Promise<void>;
    verifyOtp: (mobile: string, otp: string) => Promise<void>;
    logout: () => Promise<void>;
    checkLogin: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isLoading: false,
    isAuthenticated: false,
    error: null,

    requestOtp: async (mobile: string) => {
        set({ isLoading: true, error: null });
        try {
            await authApi.requestOtp({ otpRequestDto: { mobileNumber: mobile } });
        } catch (error: any) {
            console.error('Request OTP error:', error);
            set({ error: error.message || 'Failed to send OTP' });
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    verifyOtp: async (mobile: string, otp: string) => {
        set({ isLoading: true, error: null });
        try {
            const response = await authApi.verifyOtp({ otpVerifyDto: { mobileNumber: mobile, otp } });
            const data = response.data.data;

            if (data && data.accessToken) {
                const user = data.user;
                await AsyncStorage.setItem('authToken', data.accessToken);
                if (user) {
                    await AsyncStorage.setItem('user', JSON.stringify(user));
                }
                set({ user, isAuthenticated: true });
            } else {
                throw new Error('Invalid response from server');
            }
        } catch (error: any) {
            console.error('Verify OTP error:', error);
            set({ error: error.message || 'Verification failed' });
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    logout: async () => {
        try {
            // Optional: Call logout API
            // const token = await AsyncStorage.getItem('authToken');
            // if (token) await authApi.logout({ refreshTokenRequestDto: { refreshToken: token } });
        } catch (e) {
            console.error(e);
        } finally {
            await AsyncStorage.multiRemove(['authToken', 'user']);
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
