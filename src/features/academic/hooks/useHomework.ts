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

    // --- Mutation: Create homework (optimistic) ---
    const createMutation = useMutation({
        mutationKey: ['homework', 'create'],
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
        onMutate: async (payload) => {
            await queryClient.cancelQueries({ queryKey: ['homework'] });
            const previous = queryClient.getQueryData(['homework']);
            const temp = {
                id: `temp-${Date.now()}`,
                ...payload,
                createdAt: new Date().toISOString(),
            };
            queryClient.setQueryData(['homework'], (old: any) => [
                ...(Array.isArray(old) ? old : []),
                temp,
            ]);
            return { previous };
        },
        onError: (_err, _data, context) => {
            queryClient.setQueryData(['homework'], context?.previous);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['homework'] });
        },
    });

    // --- Mutation: Delete homework (optimistic) ---
    const deleteMutation = useMutation({
        mutationKey: ['homework', 'delete'],
        mutationFn: async (id: string) => {
            await homeworkApi.deleteHomework({ id: Number(id) });
        },
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: ['homework'] });
            const previous = queryClient.getQueryData(['homework']);
            queryClient.setQueryData(['homework'], (old: any) =>
                Array.isArray(old) ? old.filter((h: any) => h.id !== id && h.id !== Number(id)) : [],
            );
            return { previous };
        },
        onError: (_err, _id, context) => {
            queryClient.setQueryData(['homework'], context?.previous);
        },
        onSettled: () => {
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
