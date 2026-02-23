import { create } from 'zustand';
import { homeworkApi, profileApi } from '../../../api/instances';
import { Homework, HomeworkRequest } from '../../../api/models';
import { apiClient } from '../../../services/api/client';

interface HomeworkState {
    isLoading: boolean;
    homeworkItems: Homework[];
    classes: any[];
    subjects: any[];
    fetchHomework: () => Promise<void>;
    fetchMetadata: () => Promise<void>;
    createHomework: (request: Omit<HomeworkRequest, 'teacherId'>) => Promise<void>;
    deleteHomework: (id: number) => Promise<void>;
}

export const useHomeworkStore = create<HomeworkState>((set, get) => ({
    isLoading: false,
    homeworkItems: [],
    classes: [],
    subjects: [],

    fetchHomework: async () => {
        set({ isLoading: true });
        try {
            const response = await homeworkApi.getAllHomework();
            const data = (response as any).data?.data || response.data;
            set({ homeworkItems: data || [] });
        } catch (error) {
            console.error('Fetch homework error:', error);
        } finally {
            set({ isLoading: false });
        }
    },

    fetchMetadata: async () => {
        set({ isLoading: true });
        try {
            // 1. Get Profile to find teacherId
            const profileRes = await profileApi.getCurrentUser();
            const profile = profileRes.data.data;
            const teacherId = (profile as any)?.teacherId;

            if (!teacherId) {
                console.warn('Teacher ID not found in profile');
                return;
            }

            // 2. Fetch Routine to discover classes and subjects
            const routineRes = await apiClient.get('/api/academics/routine', { params: { teacherId } });
            const slots = routineRes.data?.data || routineRes.data || [];

            // 3. Extract unique classes and subjects
            const classMap = new Map();
            const subjectMap = new Map();

            (slots as any[]).forEach((slot: any) => {
                if (slot.classId && slot.className) {
                    classMap.set(slot.classId, {
                        id: slot.classId,
                        name: slot.className,
                    });
                }
                if (slot.subjectId && slot.subjectName) {
                    subjectMap.set(slot.subjectId, {
                        id: slot.subjectId,
                        name: slot.subjectName,
                    });
                }
            });

            set({
                classes: Array.from(classMap.values()),
                subjects: Array.from(subjectMap.values()),
            });
        } catch (error) {
            console.error('Fetch metadata error:', error);
        } finally {
            set({ isLoading: false });
        }
    },

    createHomework: async (request) => {
        set({ isLoading: true });
        try {
            const profileRes = await profileApi.getCurrentUser();
            const teacherId = (profileRes.data.data as any)?.teacherId;

            if (!teacherId) throw new Error('Teacher ID not found');

            await homeworkApi.createHomework({
                homeworkRequest: {
                    ...request,
                    teacherId,
                }
            });
            await get().fetchHomework();
        } catch (error) {
            console.error('Create homework error:', error);
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    deleteHomework: async (id) => {
        set({ isLoading: true });
        try {
            await homeworkApi.deleteHomework({ id });
            await get().fetchHomework();
        } catch (error) {
            console.error('Delete homework error:', error);
        } finally {
            set({ isLoading: false });
        }
    }
}));
