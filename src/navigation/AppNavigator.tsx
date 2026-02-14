import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginScreen } from '../features/auth/screens/LoginScreen';
import { OtpVerifyScreen } from '../features/auth/screens/OtpVerifyScreen';
import { HomeScreen } from '../features/dashboard/screens/HomeScreen';
import { TimetableScreen } from '../features/academic/screens/TimetableScreen';
import { AttendanceScreen } from '../features/academic/screens/AttendanceScreen';
import { ProfileScreen } from '../features/profile/screens/ProfileScreen';
import { HomeworkScreen } from '../features/academic/screens/HomeworkScreen';
import { NotificationScreen } from '../features/notifications/screens/NotificationScreen';
import { NotificationDetailScreen } from '../features/notifications/screens/NotificationDetailScreen';
import { AppStackParamList, AuthStackParamList } from './types';

const Stack = createNativeStackNavigator<AppStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();

const AuthNavigator = () => {
    return (
        <AuthStack.Navigator screenOptions={{ headerShown: false }}>
            <AuthStack.Screen name="Login" component={LoginScreen} />
            <AuthStack.Screen name="OtpVerify" component={OtpVerifyScreen} />
        </AuthStack.Navigator>
    );
};

export const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Auth" component={AuthNavigator} />
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="Attendance" component={AttendanceScreen} />
                <Stack.Screen name="Timetable" component={TimetableScreen} />
                <Stack.Screen name="Profile" component={ProfileScreen} />
                <Stack.Screen name="Homework" component={HomeworkScreen} />
                <Stack.Screen name="Notification" component={NotificationScreen} />
                <Stack.Screen name="NotificationDetail" component={NotificationDetailScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};
