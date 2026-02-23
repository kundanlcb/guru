import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginScreen } from '../features/auth/screens/LoginScreen';
import { HomeScreen } from '../features/dashboard/screens/HomeScreen';
import { TimetableScreen } from '../features/academic/screens/TimetableScreen';
import { AttendanceScreen } from '../features/academic/screens/AttendanceScreen';
import { ProfileScreen } from '../features/profile/screens/ProfileScreen';
import { HomeworkScreen } from '../features/academic/screens/HomeworkScreen';
import { CreateHomeworkScreen } from '../features/academic/screens/CreateHomeworkScreen';
import { NotificationScreen } from '../features/notifications/screens/NotificationScreen';
import { NotificationDetailScreen } from '../features/notifications/screens/NotificationDetailScreen';
import { AppStackParamList, AuthStackParamList } from './types';
import { useAuthStore } from '../features/auth/store';
import { theme } from '../theme/tokens';
import { ActivityIndicator, View } from 'react-native';

const Stack = createNativeStackNavigator<AppStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();

const AuthNavigator = () => {
    return (
        <AuthStack.Navigator screenOptions={{ headerShown: false }}>
            <AuthStack.Screen name="Login" component={LoginScreen} />
        </AuthStack.Navigator>
    );
};
import { MarksEntryScreen } from '../features/academic/screens/MarksEntryScreen';
import { CreateNoticeScreen } from '../features/academic/screens/CreateNoticeScreen';
import { LeaveDashboardScreen } from '../features/hr/screens/LeaveDashboardScreen';
import { ApplyLeaveScreen } from '../features/hr/screens/ApplyLeaveScreen';
import { LeaveDetailsScreen } from '../features/hr/screens/LeaveDetailsScreen';

export const AppNavigator = () => {
    const { isAuthenticated, isLoading, checkLogin } = useAuthStore();

    React.useEffect(() => {
        checkLogin();
    }, []);

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF' }}>
                <ActivityIndicator size="large" color={theme.colors.primary[600]} />
            </View>
        );
    }

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {!isAuthenticated ? (
                    <Stack.Screen name="Auth" component={AuthNavigator} />
                ) : (
                    <>
                        <Stack.Screen name="Home" component={HomeScreen} />
                        <Stack.Screen name="Attendance" component={AttendanceScreen} />
                        <Stack.Screen name="Timetable" component={TimetableScreen} />
                        <Stack.Screen name="Profile" component={ProfileScreen} />
                        <Stack.Screen name="Homework" component={HomeworkScreen} />
                        <Stack.Screen name="CreateHomework" component={CreateHomeworkScreen} />
                        <Stack.Screen name="MarksEntry" component={MarksEntryScreen} />
                        <Stack.Screen name="CreateNotice" component={CreateNoticeScreen} />
                        <Stack.Screen name="Notification" component={NotificationScreen} />
                        <Stack.Screen name="NotificationDetail" component={NotificationDetailScreen} />
                        <Stack.Screen name="LeaveDashboard" component={LeaveDashboardScreen} />
                        <Stack.Screen name="ApplyLeave" component={ApplyLeaveScreen} />
                        <Stack.Screen name="LeaveDetails" component={LeaveDetailsScreen} />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};
