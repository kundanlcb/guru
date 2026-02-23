import { create } from 'zustand';
import { profileApi } from '../../../api/instances';

export interface ClassSession {
    id: string;
    className: string;
    subject: string;
    time: string;
    room: string;
    status: 'upcoming' | 'ongoing' | 'completed';
}

export interface PendingTask {
    id: string;
    title: string;
    subtitle: string;
    type: 'attendance' | 'homework' | 'marks';
    dueDate?: string;
}

interface DashboardState {
    todayClasses: ClassSession[];
    pendingTasks: PendingTask[];
    summaries: {
        attendance?: any;
        homework?: any;
        exam?: any;
    };
    isLoading: boolean;
    refreshDashboard: () => Promise<void>;
}

export const useDashboardStore = create<DashboardState>((set) => ({
    todayClasses: [],
    pendingTasks: [],
    summaries: {},
    isLoading: false,
    refreshDashboard: async () => {
        set({ isLoading: true });
        try {
            const [timetableRes, dashboardRes] = await Promise.all([
                profileApi.getTimetable(),
                profileApi.getDashboard()
            ]);

            const timetableData = timetableRes.data.data;
            const dashboardData = dashboardRes.data.data;

            // 1. Process Timetable
            if (timetableData && timetableData.weeklySchedule) {
                const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
                const today = days[new Date().getDay()];
                const todayPeriods = timetableData.weeklySchedule[today as keyof typeof timetableData.weeklySchedule] || [];

                const mappedClasses: ClassSession[] = todayPeriods.map((p, index) => ({
                    id: `${today}-${index}`,
                    className: p.className || '',
                    subject: p.subjectName || '',
                    time: `${p.startTime} - ${p.endTime}`,
                    room: p.roomNumber || 'Room TBD',
                    status: index === 0 ? 'completed' : index === 1 ? 'ongoing' : 'upcoming'
                }));
                set({ todayClasses: mappedClasses });
            }

            // 2. Process Dashboard Summary & Derive Tasks
            if (dashboardData) {
                const tasks: PendingTask[] = [];

                if (dashboardData.attendanceSummary) {
                    tasks.push({
                        id: 'task-att',
                        title: 'Mark Attendance',
                        subtitle: `Last marked: ${dashboardData.attendanceSummary.lastMarkedDate || 'Never'}`,
                        type: 'attendance'
                    });
                }

                if (dashboardData.homeworkSummary && (dashboardData.homeworkSummary.pendingCount ?? 0) > 0) {
                    tasks.push({
                        id: 'task-hw',
                        title: 'Check Homework',
                        subtitle: `${dashboardData.homeworkSummary.pendingCount} pending submissions`,
                        type: 'homework',
                        dueDate: 'Soon'
                    });
                }

                set({
                    summaries: {
                        attendance: dashboardData.attendanceSummary,
                        homework: dashboardData.homeworkSummary,
                        exam: dashboardData.nextExam
                    },
                    pendingTasks: tasks
                });
            }
        } catch (error) {
            console.error('Refresh dashboard error:', error);
        } finally {
            set({ isLoading: false });
        }
    },
}));
