/**
 * Attendance Hooks — Guru (Teacher App)
 * TanStack Query hooks for attendance data with mutations for marking.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { attendanceApi } from '../../../api/instances';

/**
 * Fetch attendance sheet for a specific class on a date
 */
export const useClassAttendance = (classId?: string, date?: string) => {
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['attendance', 'class', classId, date],
        queryFn: async () => {
            const response = await attendanceApi.getClassAttendanceSheet({
                classId: Number(classId!),
                date: date!,
            });
            return response.data;
        },
        enabled: !!classId && !!date,
        staleTime: 1 * 60 * 1000,
    });

    return {
        sheet: data ?? null,
        isLoading,
        error: error?.message ?? null,
        refetch,
    };
};

/**
 * Fetch attendance statistics for a class
 */
export const useClassAttendanceStats = (classId?: string, startDate?: string, endDate?: string) => {
    const { data, isLoading, error } = useQuery({
        queryKey: ['attendance', 'stats', classId, startDate, endDate],
        queryFn: async () => {
            const response = await attendanceApi.getClassAttendanceStatistics({
                classId: Number(classId!),
                startDate: startDate!,
                endDate: endDate!,
            });
            return response.data;
        },
        enabled: !!classId && !!startDate && !!endDate,
        staleTime: 5 * 60 * 1000,
    });

    return {
        stats: data ?? null,
        isLoading,
        error: error?.message ?? null,
    };
};

/**
 * Mutation: Submit bulk attendance
 */
export const useMarkAttendance = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async (payload: {
            classId: string;
            date: string;
            records: Array<{ studentId: string; status: string }>;
        }) => {
            const response = await attendanceApi.markBulkAttendance({
                bulkMarkAttendanceRequest: {
                    classId: Number(payload.classId),
                    date: payload.date,
                    attendances: payload.records.map(r => ({
                        studentId: Number(r.studentId),
                        status: r.status as any,
                    })),
                },
            });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['attendance'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard'] });
        },
    });

    return {
        markAttendance: mutation.mutateAsync,
        isPending: mutation.isPending,
        error: mutation.error?.message ?? null,
    };
};
