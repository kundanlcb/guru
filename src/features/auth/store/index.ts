import { create } from 'zustand';

interface AuthState {
    user: any | null;
    isLoading: boolean;
    requestOtp: (mobile: string) => Promise<void>;
    verifyOtp: (mobile: string, otp: string) => Promise<void>;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isLoading: false,
    requestOtp: async (mobile: string) => {
        set({ isLoading: true });
        // Simulate API call
        return new Promise((resolve) => {
            setTimeout(() => {
                set({ isLoading: false });
                resolve();
            }, 1000);
        });
    },
    verifyOtp: async (mobile: string, otp: string) => {
        set({ isLoading: true });
        return new Promise((resolve) => {
            setTimeout(() => {
                set({ isLoading: false, user: { name: 'Teacher', mobile } });
                resolve();
            }, 1000);
        });
    },
    logout: () => set({ user: null }),
}));
