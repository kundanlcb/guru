import { apiClient } from '../../../services/api/client';
import { LeaveRequest, LeaveBalance, LeaveType } from '../types';

export const leaveService = {
    getLeaveTypes: async () => {
        const response = await apiClient.get('/api/hr/leave-policies/types');
        return response.data?.data || response.data;
    },

    getLeaveBalances: async (userId: string | number, academicYear: string = '2024-2025') => {
        const response = await apiClient.get(`/api/hr/leave-policies/balances/${userId}`, {
            params: { academicYear }
        });
        return response.data?.data || response.data;
    },

    applyLeave: async (data: Partial<LeaveRequest>) => {
        const response = await apiClient.post('/api/hr/leaves/apply', data);
        return response.data?.data || response.data;
    },

    getMyRequests: async () => {
        const response = await apiClient.get('/api/hr/leaves/my');
        return response.data?.data || response.data;
    },

    cancelRequest: async (id: number) => {
        const response = await apiClient.delete(`/api/hr/leaves/${id}/cancel`);
        return response.data;
    }
};
