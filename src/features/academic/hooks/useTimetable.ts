/**
 * Timetable Hook — Guru (Teacher App)
 * TanStack Query hook for fetching routine/timetable for a class.
 */

import { useQuery } from '@tanstack/react-query';
import { routineApi } from '../../../api/instances';

export const useTimetable = (classId?: string) => {
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['timetable', classId],
        queryFn: async () => {
            const response = await routineApi.getRoutine({ classId: Number(classId!) });
            return response.data ?? [];
        },
        enabled: !!classId,
        staleTime: 30 * 60 * 1000,
    });

    return {
        timetable: data ?? [],
        isLoading,
        error: error?.message ?? null,
        refetch,
    };
};
