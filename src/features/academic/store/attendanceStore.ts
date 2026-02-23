import { create } from 'zustand';
import { attendanceApi, routineApi, profileApi } from '../../../api/instances';
import { StudentAttendanceStatusStatusEnum } from '../../../api/models';
import { apiClient } from '../../../services/api/client';

interface AttendanceState {
    isLoading: boolean;
    selfStatus: 'in' | 'out';
    lastCheckIn: string | null;
    lastCheckOut: string | null;
    selfHistory: any[];
    fetchSelfHistory: () => Promise<void>;
    toggleSelfStatus: () => Promise<void>;

    // Student Attendance
    classes: any[];
    subjects: any[];
    selectedClass: any | null;
    selectedSubject: any | null;
    selectedDate: string;
    students: any[];
    fetchClasses: () => Promise<void>;
    setSelectedClass: (cls: any) => void;
    setSelectedSubject: (sub: any) => void;
    setSelectedDate: (date: string) => void;
    fetchStudents: (classId: number, date?: string) => Promise<void>;
    markStudent: (studentId: number, status: 'P' | 'A' | 'L') => void;
    submitAttendance: () => Promise<void>;
}

export const useAttendanceStore = create<AttendanceState>((set, get) => ({
    isLoading: false,
    selfStatus: 'out',
    lastCheckIn: null,
    lastCheckOut: null,
    selfHistory: [],

    fetchSelfHistory: async () => {
        // Self-attendance history for teachers is not explicitly in the backend yet.
        // We simulate it or clear it for now.
        set({ selfHistory: [] });
    },

    toggleSelfStatus: async () => {
        // Mock toggle as backend lacks teacher check-in/out
        const { selfStatus } = get();
        const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        if (selfStatus === 'out') {
            set({
                selfStatus: 'in',
                lastCheckIn: now,
                lastCheckOut: null
            });
        } else {
            set({
                selfStatus: 'out',
                lastCheckOut: now
            });
        }
    },

    classes: [],
    subjects: [],
    selectedClass: null,
    selectedSubject: null,
    selectedDate: new Date().toISOString().split('T')[0],
    students: [],

    fetchClasses: async () => {
        set({ isLoading: true });
        try {
            // 1. Get Profile to find teacherId
            const profileRes = await profileApi.getCurrentUser();
            const profile = profileRes.data.data;
            const teacherId = (profile as any)?.teacherId;

            if (!teacherId) {
                console.warn('Teacher ID not found in profile');
                set({ classes: [] });
                return;
            }

            // 2. Fetch Routine to discover classes for teacher using raw client
            const routineRes = await apiClient.get('/api/academics/routine', { params: { teacherId } });
            const slots = routineRes.data?.data || routineRes.data || [];

            // 3. Extract unique classes and subjects
            const classMap = new Map();
            const subjectMap = new Map();
            (slots as any[]).forEach((slot: any) => {
                if (slot.classId && slot.className) {
                    classMap.set(slot.classId, {
                        id: slot.classId,
                        className: slot.className,
                        section: slot.section || ''
                    });
                }
                if (slot.subjectId && slot.subjectName) {
                    subjectMap.set(slot.subjectId, {
                        id: slot.subjectId,
                        name: slot.subjectName
                    });
                }
            });

            const uniqueClasses = Array.from(classMap.values());
            const uniqueSubjects = Array.from(subjectMap.values());
            set({ classes: uniqueClasses, subjects: uniqueSubjects });

            if (uniqueClasses.length > 0 && !get().selectedClass) {
                get().setSelectedClass(uniqueClasses[0]);
            }
            if (uniqueSubjects.length > 0 && !get().selectedSubject) {
                set({ selectedSubject: uniqueSubjects[0] });
            }
        } catch (error) {
            console.error('Fetch classes error:', error);
        } finally {
            set({ isLoading: false });
        }
    },

    setSelectedClass: (cls) => {
        set({ selectedClass: cls });
        if (cls?.id) {
            get().fetchStudents(cls.id, get().selectedDate);
        }
    },

    setSelectedSubject: (sub) => {
        set({ selectedSubject: sub });
    },

    setSelectedDate: (date) => {
        set({ selectedDate: date });
        const { selectedClass } = get();
        if (selectedClass?.id) {
            get().fetchStudents(selectedClass.id, date);
        }
    },

    fetchStudents: async (classId, dateParam) => {
        set({ isLoading: true });
        try {
            // Use getClassAttendanceSheet for selected date
            const date = dateParam || get().selectedDate || new Date().toISOString().split('T')[0];
            const response = await apiClient.get(`/api/attendance/sheet/${classId}`, { params: { date } });
            const data = response.data?.data || response.data;

            if (data && data.students) {
                const mappedStudents = data.students.map((s: any) => ({
                    id: s.studentId,
                    name: s.studentName,
                    roll: s.rollNumber,
                    status: s.status === 'PRESENT' ? 'P' : s.status === 'ABSENT' ? 'A' : 'L'
                }));
                set({ students: mappedStudents });
            }
        } catch (error) {
            console.error('Fetch students error:', error);
        } finally {
            set({ isLoading: false });
        }
    },

    markStudent: (studentId, status) => {
        set((state) => ({
            students: state.students.map(s => s.id === studentId ? { ...s, status } : s)
        }));
    },

    submitAttendance: async () => {
        const { students, selectedClass } = get();
        if (!selectedClass) return;

        set({ isLoading: true });
        try {
            const records = students.map(s => ({
                studentId: s.id,
                status: (s.status === 'P' ? StudentAttendanceStatusStatusEnum.Present :
                    s.status === 'A' ? StudentAttendanceStatusStatusEnum.Absent :
                        StudentAttendanceStatusStatusEnum.Late) as StudentAttendanceStatusStatusEnum
            }));

            await apiClient.post('/api/attendance/bulk', {
                classId: selectedClass.id,
                date: get().selectedDate || new Date().toISOString().split('T')[0],
                attendances: records
            });
        } catch (error) {
            console.error('Submit attendance error:', error);
            throw error;
        } finally {
            set({ isLoading: false });
        }
    }
}));
