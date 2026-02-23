import { create } from 'zustand';
import { profileApi } from '../../../api/instances';
import { RoutineResponse, RoutineResponseDayOfWeekEnum } from '../../../api/models';
import { apiClient } from '../../../services/api/client';

export interface FormattedScheduleItem {
    startTime: string;
    endTime: string;
    subject: string;
    class: string;
    room: string;
    category: string;
    isActive?: boolean;
}

interface TimetableState {
    isLoading: boolean;
    schedule: Record<string, FormattedScheduleItem[]>;
    fetchSchedule: () => Promise<void>;
}

const formatTime = (time: any) => {
    if (!time) return '--:--';
    const h = String(time.hour || 0).padStart(2, '0');
    const m = String(time.minute || 0).padStart(2, '0');
    return `${h}:${m}`;
};

const getCategory = (subject: string): string => {
    const s = subject.toLowerCase();
    if (s.includes('math')) return 'math';
    if (s.includes('phy') || s.includes('chem') || s.includes('sci')) return 'science';
    if (s.includes('bio')) return 'bio';
    if (s.includes('art') || s.includes('music')) return 'arts';
    if (s.includes('eng') || s.includes('hindi') || s.includes('lang')) return 'lang';
    if (s.includes('break') || s.includes('lunch')) return 'break';
    return 'science';
};

const DAY_MAP: Record<string, string> = {
    'MONDAY': 'Mon',
    'TUESDAY': 'Tue',
    'WEDNESDAY': 'Wed',
    'THURSDAY': 'Thu',
    'FRIDAY': 'Fri',
    'SATURDAY': 'Sat',
    'SUNDAY': 'Sun',
};

export const useTimetableStore = create<TimetableState>((set) => ({
    isLoading: false,
    schedule: {},

    fetchSchedule: async () => {
        set({ isLoading: true });
        try {
            // 1. Get teacherId from profile
            const profileRes = await profileApi.getCurrentUser();
            const teacherId = (profileRes.data.data as any)?.teacherId;

            if (!teacherId) {
                console.warn('Teacher ID not found in profile');
                set({ schedule: {} });
                return;
            }

            // 2. Fetch Routine
            const routineRes = await apiClient.get('/api/academics/routine', { params: { teacherId } });
            const slots = routineRes.data?.data || routineRes.data || [];

            // 3. Group and format
            const grouped: Record<string, FormattedScheduleItem[]> = {};

            (slots as RoutineResponse[]).forEach(slot => {
                const day = slot.dayOfWeek ? DAY_MAP[slot.dayOfWeek] : 'Unknown';
                if (!day) return;

                if (!grouped[day]) grouped[day] = [];

                grouped[day].push({
                    startTime: formatTime(slot.startTime),
                    endTime: formatTime(slot.endTime),
                    subject: slot.subjectName || 'Unknown Subject',
                    class: slot.className || 'Unknown Class',
                    room: 'Room TBD', // Room not yet in RoutineResponse
                    category: getCategory(slot.subjectName || ''),
                });
            });

            // Sort periods if necessary
            Object.keys(grouped).forEach(day => {
                grouped[day].sort((a, b) => a.startTime.localeCompare(b.startTime));
            });

            set({ schedule: grouped });
        } catch (error) {
            console.error('Fetch schedule error:', error);
        } finally {
            set({ isLoading: false });
        }
    }
}));
