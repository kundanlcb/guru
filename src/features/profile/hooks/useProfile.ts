/**
 * Profile Hook — Guru (Teacher App)
 * TanStack Query hook for fetching teacher profile.
 */

import { useQuery } from '@tanstack/react-query';
import { profileApi } from '../../../api/instances';

export const useProfile = () => {
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['profile'],
        queryFn: async () => {
            const response = await profileApi.getCurrentUser();
            return response.data;
        },
        staleTime: 10 * 60 * 1000,
    });

    return {
        profile: data ?? null,
        isLoading,
        error: error?.message ?? null,
        refetch,
    };
};
