import { create } from 'zustand';
import { academicApi, routineApi, attendanceApi } from '../../../api/instances';
import { ExamTerm, ExamSchedule, ReportCardDto } from '../../../api/models';
import axios from 'axios';
import { apiClient } from '../../../services/api/client';

interface MarksState {
    terms: ExamTerm[];
    classes: any[];
    subjects: any[];
    schedules: ExamSchedule[];
    students: any[];
    marks: Record<number, number>;
    isLoading: boolean;

    fetchMetadata: () => Promise<void>;
    fetchSchedules: (termId: number, classId: number) => Promise<void>;
    fetchStudents: (classId: number) => Promise<void>;
    setMark: (studentId: number, score: number) => void;
    submitMarks: (termId: number, classId: number, subjectId: number) => Promise<boolean>;
}

export const useMarksStore = create<MarksState>((set, get) => ({
    terms: [],
    classes: [],
    subjects: [],
    schedules: [],
    students: [],
    marks: {},
    isLoading: false,

    fetchMetadata: async () => {
        set({ isLoading: true });
        try {
            const [termsRes, routineRes] = await Promise.all([
                academicApi.getAllTerms(),
                apiClient.get('/api/academics/routine')
            ]);

            const slots = (routineRes as any).data?.data || routineRes.data || [];

            // Unique classes and subjects
            const classesMap = new Map();
            const subjectsMap = new Map();

            slots.forEach((s: any) => {
                if (s.classId) classesMap.set(s.classId, { id: s.classId, name: s.className });
                if (s.subjectId) subjectsMap.set(s.subjectId, { id: s.subjectId, name: s.subjectName });
            });

            set({
                terms: termsRes.data,
                classes: Array.from(classesMap.values()),
                subjects: Array.from(subjectsMap.values())
            });
        } catch (error) {
            console.error('Fetch marks metadata error:', error);
        } finally {
            set({ isLoading: false });
        }
    },

    fetchSchedules: async (termId, classId) => {
        set({ isLoading: true });
        try {
            // Re-using the getSchedules with query params if available
            const res = await (academicApi as any).getSchedules({ examTermId: termId, classId });
            set({ schedules: res.data || [] });
        } catch (error) {
            console.error('Fetch schedules error:', error);
        } finally {
            set({ isLoading: false });
        }
    },

    fetchStudents: async (classId) => {
        set({ isLoading: true });
        try {
            const today = new Date().toISOString().split('T')[0];
            const res = await apiClient.get(`/api/attendance/sheet/${classId}`, { params: { date: today } });
            const data = res.data?.data || res.data;
            set({ students: data?.students || data || [] });
        } catch (error) {
            console.error('Fetch students error:', error);
        } finally {
            set({ isLoading: false });
        }
    },

    setMark: (studentId, score) => {
        set(state => ({
            marks: { ...state.marks, [studentId]: score }
        }));
    },

    submitMarks: async (termId, classId, subjectId) => {
        set({ isLoading: true });
        try {
            const { marks } = get();
            const payload = {
                examTermId: termId,
                classId: classId,
                subjectId: subjectId,
                marks: Object.entries(marks).map(([studentId, score]) => ({
                    studentId: Number(studentId),
                    marksObtained: score,
                    remarks: ''
                }))
            };

            // Using direct axios for the missing bulk endpoint
            const res = await (academicApi as any).saveBulkStudentMarks ?
                await (academicApi as any).saveBulkStudentMarks({ bulkMarkEntryRequest: payload }) :
                await axios.post(`${(academicApi as any).configuration?.basePath || ''}/api/academic/marks/bulk`, payload);

            if (res.status === 200 || res.status === 201) {
                set({ marks: {} });
                return true;
            }
            return false;
        } catch (error) {
            console.error('Submit marks error:', error);
            return false;
        } finally {
            set({ isLoading: false });
        }
    }
}));
