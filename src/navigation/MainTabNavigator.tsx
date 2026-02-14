import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AppTabParamList } from './types';
import { HomeScreen } from '../features/dashboard/screens/HomeScreen';
import { TimetableScreen } from '../features/academic/screens/TimetableScreen';
import { AttendanceScreen } from '../features/academic/screens/AttendanceScreen';
import { ProfileScreen } from '../features/profile/screens/ProfileScreen';
import { Icon } from '../components/ui/Icon';
import { theme } from '../theme/tokens';

const Tab = createBottomTabNavigator<AppTabParamList>();

export const MainTabNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarShowLabel: false,
                tabBarStyle: {
                    height: Platform.OS === 'ios' ? 100 : 84,
                    paddingBottom: Platform.OS === 'ios' ? 32 : 12,
                    paddingTop: 16,
                    backgroundColor: '#FFFFFF',
                    borderTopWidth: 0,
                    elevation: 20,
                    shadowColor: theme.colors.primary[600] || '#5A53D6',
                    shadowOffset: { width: 0, height: -4 },
                    shadowOpacity: 0.1,
                    shadowRadius: 12,
                },
                tabBarIcon: ({ focused }) => {
                    let iconName = 'circle';
                    // Icons based on route
                    if (route.name === 'Home') iconName = 'home';
                    else if (route.name === 'Timetable') iconName = 'calendar';
                    else if (route.name === 'Attendance') iconName = 'check-circle'; // or 'users'
                    else if (route.name === 'Profile') iconName = 'user';

                    const primaryColor = theme.colors.primary[600] || '#5A53D6';

                    return (
                        <View
                            style={[
                                styles.tabItem,
                                focused && {
                                    backgroundColor: primaryColor,
                                    shadowColor: primaryColor,
                                    shadowOffset: { width: 0, height: 4 },
                                    shadowOpacity: 0.3,
                                    shadowRadius: 8,
                                    elevation: 4,
                                },
                            ]}
                        >
                            <Icon
                                name={iconName}
                                size={24}
                                color={focused ? '#FFFFFF' : '#9CA3AF'}
                                library="feather"
                            />
                        </View>
                    );
                },
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Timetable" component={TimetableScreen} />
            <Tab.Screen name="Attendance" component={AttendanceScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
    );
};

const styles = StyleSheet.create({
    tabItem: {
        width: 48,
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 16,
    },
});
