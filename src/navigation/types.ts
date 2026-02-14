import { NavigatorScreenParams } from '@react-navigation/native';

export type AuthStackParamList = {
    Login: undefined;
    OtpVerify: { phoneNumber: string };
};

export type AppStackParamList = {
    Auth: NavigatorScreenParams<AuthStackParamList>;
    Home: undefined;
    Attendance: { initialTab?: 'self' | 'student' };
    Timetable: undefined;
    Profile: undefined;
    Homework: undefined;

    // Dashboard & Features
    Notification: undefined;
    NotificationDetail: { notification: any };
    ClassDetails: { classId: string };
};

export type AppTabParamList = {
    Home: undefined;
    Timetable: undefined;
    Attendance: undefined;
    Profile: undefined;
};
