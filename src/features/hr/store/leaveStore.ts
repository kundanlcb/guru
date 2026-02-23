import { create } from 'zustand';
import { leaveService } from '../services/leaveService';
import { LeaveRequest, LeaveBalance, LeaveType } from '../types';
import { useAuthStore } from '../../auth/store';

interface LeaveState {
    isLoading: boolean;
    leaveTypes: LeaveType[];
    balances: LeaveBalance[];
    myRequests: LeaveRequest[];

    fetchInitialData: () => Promise<void>;
    fetchMyRequests: () => Promise<void>;
    applyLeave: (data: Partial<LeaveRequest>) => Promise<void>;
    cancelRequest: (id: number) => Promise<void>;
}

export const useLeaveStore = create<LeaveState>((set, get) => ({
    isLoading: false,
    leaveTypes: [],
    balances: [],
    myRequests: [],

    fetchInitialData: async () => {
        const user = useAuthStore.getState().user;
        if (!user?.id) return;

        set({ isLoading: true });
        try {
            const [types, balances] = await Promise.all([
                leaveService.getLeaveTypes(),
                leaveService.getLeaveBalances(user.id)
            ]);
            set({ leaveTypes: types, balances: balances });
        } catch (error) {
            console.error('Fetch leave initial data error:', error);
        } finally {
            set({ isLoading: false });
        }
    },

    fetchMyRequests: async () => {
        set({ isLoading: true });
        try {
            const requests = await leaveService.getMyRequests();
            set({ myRequests: requests });
        } catch (error) {
            console.error('Fetch my requests error:', error);
        } finally {
            set({ isLoading: false });
        }
    },

    applyLeave: async (data) => {
        set({ isLoading: true });
        try {
            const user = useAuthStore.getState().user;
            await leaveService.applyLeave({ ...data, requesterId: user?.id as any });
            await get().fetchMyRequests();
            await get().fetchInitialData(); // Refresh balances
        } catch (error) {
            console.error('Apply leave error:', error);
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    cancelRequest: async (id) => {
        set({ isLoading: true });
        try {
            await leaveService.cancelRequest(id);
            await get().fetchMyRequests();
            await get().fetchInitialData(); // Refund balance
        } catch (error) {
            console.error('Cancel request error:', error);
            throw error;
        } finally {
            set({ isLoading: false });
        }
    }
}));
