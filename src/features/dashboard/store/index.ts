import { create } from 'zustand';

export interface ClassSession {
    id: string;
    className: string; // e.g., "10-A"
    subject: string;   // e.g., "Mathematics"
    time: string;      // e.g., "09:00 AM - 10:00 AM"
    room: string;      // e.g., "Room 101"
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
    isLoading: boolean;
    refreshDashboard: () => Promise<void>;
}

export const useDashboardStore = create<DashboardState>((set) => ({
    todayClasses: [
        { id: '1', className: '10-A', subject: 'Mathematics', time: '09:00 - 10:00', room: 'Room 101', status: 'completed' },
        { id: '2', className: '9-B', subject: 'Physics', time: '10:30 - 11:30', room: 'Lab 2', status: 'ongoing' },
        { id: '3', className: '11-C', subject: 'Math', time: '13:00 - 14:00', room: 'Room 104', status: 'upcoming' },
    ],
    pendingTasks: [
        { id: '1', title: 'Mark Attendance', subtitle: 'Class 9-B • Physics', type: 'attendance' },
        { id: '2', title: 'Check Homework', subtitle: 'Class 10-A • Algebra Assignment', type: 'homework', dueDate: 'Today' },
        { id: '3', title: 'Enter Marks', subtitle: 'Class 11-C • Mid-Term', type: 'marks' },
    ],
    isLoading: false,
    refreshDashboard: async () => {
        set({ isLoading: true });
        // Simulate API fetch
        setTimeout(() => set({ isLoading: false }), 1000);
    },
}));
