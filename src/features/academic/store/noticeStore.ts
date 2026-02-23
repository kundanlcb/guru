import { create } from 'zustand';
import { noticeApi } from '../../../api/instances';
import { NoticeDto, NoticeRequest } from '../../../api/models';

interface NoticeState {
    notices: NoticeDto[];
    isLoading: boolean;
    fetchNotices: () => Promise<void>;
    createNotice: (request: NoticeRequest) => Promise<boolean>;
    deleteNotice: (id: number) => Promise<boolean>;
}

export const useNoticeStore = create<NoticeState>((set, get) => ({
    notices: [],
    isLoading: false,

    fetchNotices: async () => {
        set({ isLoading: true });
        try {
            const res = await noticeApi.getNotices({});
            const data = (res.data as any).data || res.data;
            set({ notices: data.notices || [] });
        } catch (error) {
            console.error('Fetch notices error:', error);
        } finally {
            set({ isLoading: false });
        }
    },

    createNotice: async (request) => {
        set({ isLoading: true });
        try {
            const res = await noticeApi.createNotice({ noticeRequest: request });
            if (res.status === 200 || res.status === 201) {
                await get().fetchNotices();
                return true;
            }
            return false;
        } catch (error) {
            console.error('Create notice error:', error);
            return false;
        } finally {
            set({ isLoading: false });
        }
    },

    deleteNotice: async (id) => {
        set({ isLoading: true });
        try {
            const res = await noticeApi.deleteNotice({ id });
            if (res.status === 200 || res.status === 204) {
                await get().fetchNotices();
                return true;
            }
            return false;
        } catch (error) {
            console.error('Delete notice error:', error);
            return false;
        } finally {
            set({ isLoading: false });
        }
    }
}));
