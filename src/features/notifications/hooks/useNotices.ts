/**
 * Notices Hook — Guru (Teacher App)
 * TanStack Query hooks for fetching school notices.
 */

import { useQuery } from '@tanstack/react-query';
import { noticeApi } from '../../../api/instances';

export const useNotices = () => {
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['notices'],
        queryFn: async () => {
            const response = await noticeApi.getNotices({});
            return response.data;
        },
        staleTime: 5 * 60 * 1000,
    });

    return {
        notices: data ?? null,
        isLoading,
        error: error?.message ?? null,
        refetch,
    };
};

export const useNoticeDetail = (noticeId?: string) => {
    const { data, isLoading, error } = useQuery({
        queryKey: ['notices', noticeId],
        queryFn: async () => {
            const response = await noticeApi.getNoticeDetails({ id: Number(noticeId!) });
            return response.data;
        },
        enabled: !!noticeId,
        staleTime: 10 * 60 * 1000,
    });

    return {
        notice: data ?? null,
        isLoading,
        error: error?.message ?? null,
    };
};
