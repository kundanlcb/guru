/**
 * Homework Hooks — Guru (Teacher App)
 * TanStack Query hooks for homework fetching and management.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { homeworkApi } from '../../../api/instances';

/**
 * Fetch all homework (teacher sees all assigned homework)
 */
export const useHomework = () => {
    const queryClient = useQueryClient();

    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['homework'],
        queryFn: async () => {
            const response = await homeworkApi.getAllHomework();
            return response.data ?? [];
        },
        staleTime: 5 * 60 * 1000,
    });

    const createMutation = useMutation({
        mutationFn: async (payload: {
            classId: string;
            subjectId: string;
            title: string;
            description?: string;
            dueDate: string;
        }) => {
            const response = await homeworkApi.createHomework({
                homeworkRequest: payload as any,
            });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['homework'] });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            await homeworkApi.deleteHomework({ id: Number(id) });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['homework'] });
        },
    });

    return {
        homeworkList: data ?? [],
        isLoading,
        error: error?.message ?? null,
        refetch,
        createHomework: createMutation.mutateAsync,
        isCreating: createMutation.isPending,
        deleteHomework: deleteMutation.mutateAsync,
        isDeleting: deleteMutation.isPending,
    };
};
