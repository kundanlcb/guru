import { create } from 'zustand';

interface AttendanceState {
    selfStatus: 'in' | 'out';
    lastCheckIn: string | null;
    lastCheckOut: string | null;
    selfHistory: any[];
    toggleSelfStatus: () => Promise<void>;

    // Student Attendance
    classes: string[];
    selectedClass: string | null;
    setSelectedClass: (id: string) => void;
    students: any[];
    markStudent: (studentId: string, status: 'P' | 'A' | 'L') => void;
    submitAttendance: () => Promise<void>;
}

export const useAttendanceStore = create<AttendanceState>((set, get) => ({
    selfStatus: 'out',
    lastCheckIn: null,
    lastCheckOut: null,
    selfHistory: [
        { date: '14 Feb', checkIn: '08:55 AM', checkOut: '04:10 PM', status: 'Present' },
        { date: '13 Feb', checkIn: '09:00 AM', checkOut: '04:00 PM', status: 'Present' },
    ],
    toggleSelfStatus: async () => {
        const { selfStatus } = get();
        const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        if (selfStatus === 'out') {
            set({ selfStatus: 'in', lastCheckIn: now });
        } else {
            set({ selfStatus: 'out', lastCheckOut: now });
        }
    },

    classes: ['10-A', '9-B', '11-C'],
    selectedClass: '10-A',
    setSelectedClass: (id) => set({ selectedClass: id }),
    students: [
        { id: '1', name: 'Aarav Patel', roll: '101', status: 'P' },
        { id: '2', name: 'Ishaan Kumar', roll: '102', status: 'P' },
        { id: '3', name: 'Riya Singh', roll: '103', status: 'A' },
        { id: '4', name: 'Ananya Gupta', roll: '104', status: 'P' },
        { id: '5', name: 'Vivaan Shah', roll: '105', status: 'P' },
    ],
    markStudent: (studentId, status) => {
        set((state) => ({
            students: state.students.map(s => s.id === studentId ? { ...s, status } : s)
        }));
    },
    submitAttendance: async () => {
        // Mock submit
    }
}));
