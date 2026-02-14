/**
 * Dashboard Hooks — Guru (Teacher App)
 * TanStack Query hooks for dashboard data fetching.
 */

import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../../../api/instances';

export const useDashboard = () => {
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['dashboard'],
        queryFn: async () => {
            const response = await dashboardApi.getDashboardStats();
            return response.data;
        },
        staleTime: 2 * 60 * 1000,
    });

    return {
        dashboard: data ?? null,
        isLoading,
        error: error?.message ?? null,
        refetch,
    };
};
