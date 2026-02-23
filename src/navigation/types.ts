import { NavigatorScreenParams } from '@react-navigation/native';

export type AuthStackParamList = {
    Login: undefined;
};

export type AppStackParamList = {
    Auth: NavigatorScreenParams<AuthStackParamList>;
    Home: undefined;
    ClassDetails: { classId: string };
    Notification: undefined;
    NotificationDetail: { notification: any };
    Attendance: { initialTab?: 'self' | 'student' };
    Timetable: undefined;
    Profile: undefined;
    Homework: undefined;
    CreateHomework: undefined;
    MarksEntry: undefined;
    CreateNotice: undefined;
    LeaveDashboard: undefined;
    ApplyLeave: undefined;
    LeaveDetails: { request: any };
};
