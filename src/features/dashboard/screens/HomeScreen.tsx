import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { ScreenWrapper } from '../../../components/layout/ScreenWrapper';
import { AppText } from '../../../components/ui/AppText';
import { theme } from '../../../theme/tokens';
import { useDashboardStore } from '../store';
import { Icon } from '../../../components/ui/Icon';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../../auth/store';
import { CATEGORY_COLORS } from '../../academic/screens/TimetableScreen';

import { PromoBanner } from '../components/PromoBanner';

export const HomeScreen = () => {
    const navigation = useNavigation<any>();
    const { user } = useAuthStore();
    const { todayClasses, pendingTasks, isLoading, refreshDashboard } = useDashboardStore();

    // Mock bus active state (false for now to show banner)
    const isBusActive = false;

    useEffect(() => {
        refreshDashboard();
    }, []);

    const getCategoryColor = (subject: string) => {
        const lowerSubject = subject.toLowerCase();
        if (lowerSubject.includes('math')) return CATEGORY_COLORS.math;
        if (lowerSubject.includes('science') || lowerSubject.includes('physics')) return CATEGORY_COLORS.science;
        if (lowerSubject.includes('arts') || lowerSubject.includes('history')) return CATEGORY_COLORS.arts;
        if (lowerSubject.includes('english')) return CATEGORY_COLORS.lang;
        if (lowerSubject.includes('bio')) return CATEGORY_COLORS.bio;
        return CATEGORY_COLORS.science; // Default
    };

    const renderQuickAction = (title: string, icon: string, color: string, onPress: () => void, subtitle?: string) => (
        <TouchableOpacity style={styles.actionCard} onPress={onPress} activeOpacity={0.8}>
            <View style={[styles.actionIcon, { backgroundColor: color + '15' }]}>
                <Icon name={icon} size={28} color={color} library="feather" />
            </View>
            <View style={{ marginTop: 12 }}>
                <AppText size="m" weight="bold" color={theme.colors.text.primary}>{title}</AppText>
                {subtitle && <AppText size="xs" color={theme.colors.text.tertiary} style={{ marginTop: 2 }}>{subtitle}</AppText>}
            </View>
        </TouchableOpacity>
    );

    const renderTaskItem = (item: any) => {
        let iconName: string = 'check-circle';
        let iconColor: string = theme.colors.status.info;

        if (item.type === 'attendance') {
            iconName = 'users';
            iconColor = theme.colors.primary[600];
        } else if (item.type === 'homework') {
            iconName = 'book-open';
            iconColor = theme.colors.status.warning;
        } else if (item.type === 'marks') {
            iconName = 'bar-chart-2';
            iconColor = theme.colors.status.success;
        }

        return (
            <TouchableOpacity
                key={item.id}
                style={styles.taskItem}
                onPress={() => {
                    if (item.type === 'attendance') navigation.navigate('Attendance');
                    else if (item.type === 'homework') navigation.navigate('Homework');
                }}
                activeOpacity={0.7}
            >
                <View style={[styles.taskIconBox, { backgroundColor: iconColor + '15' }]}>
                    <Icon name={iconName} size={20} color={iconColor} library="feather" />
                </View>
                <View style={{ flex: 1, marginLeft: 16 }}>
                    <AppText size="m" weight="semibold" color={theme.colors.text.primary}>{item.title}</AppText>
                    <AppText size="s" color={theme.colors.text.secondary} style={{ marginTop: 2 }}>{item.subtitle}</AppText>
                </View>
                {item.dueDate && (
                    <View style={styles.dueBadge}>
                        <AppText size="xs" color={theme.colors.status.danger} weight="bold">{item.dueDate}</AppText>
                    </View>
                )}
                <Icon name="chevron-right" size={20} color={theme.colors.text.tertiary} library="feather" />
            </TouchableOpacity>
        );
    }

    return (
        <ScreenWrapper
            scrollable
            isLoading={isLoading}
            backgroundColor="#F8F9FC"
            statusBarColor="#F8F9FC"
            statusBarStyle="dark-content"
        >
            {/* Clean Header */}
            <View style={styles.header}>
                <View>
                    <AppText size="s" color={theme.colors.text.secondary} style={{ marginBottom: 4 }}>
                        Good Morning!
                    </AppText>
                    <AppText size="xxl" weight="bold" style={{ fontSize: 26, lineHeight: 32 }}>
                        {user?.name || 'Priya Sharma'}
                    </AppText>
                </View>
                <View style={styles.headerActions}>
                    <TouchableOpacity
                        style={styles.iconButton}
                        onPress={() => navigation.navigate('Notification')}
                    >
                        <Icon name="bell" library="feather" size={24} color={theme.colors.text.primary} />
                        <View style={styles.badge} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.profileButton} onPress={() => navigation.navigate('Profile')}>
                        <Icon name="user" size={24} color={theme.colors.primary[600]} library="feather" />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.contentContainer}>
                {/* Promo Banner */}
                <PromoBanner />
                {/* Classes Section - Vertical Timeline */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <AppText size="l" weight="bold">Today's Classes</AppText>
                        <TouchableOpacity onPress={() => navigation.navigate('Timetable')}>
                            <AppText size="s" weight="bold" color={theme.colors.primary[600]}>See All</AppText>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.timelineContainer}>
                        {todayClasses.map((item, index) => {
                            const isLast = index === todayClasses.length - 1;
                            const colors = getCategoryColor(item.subject);
                            let startTime = item.time.split(' - ')[0];
                            let endTime = item.time.split(' - ')[1];
                            const isActive = item.status === 'ongoing';

                            return (
                                <View key={item.id} style={styles.timelineItem}>
                                    {/* Time Column */}
                                    <View style={styles.timeColumn}>
                                        <AppText size="s" weight="bold" color={theme.colors.text.primary}>{startTime}</AppText>
                                        <AppText size="xs" color={theme.colors.text.tertiary}>{endTime}</AppText>
                                    </View>

                                    {/* Decoration */}
                                    <View style={styles.timelineDecoration}>
                                        {index !== 0 && <View style={styles.timelineLineTop} />}
                                        {!isLast && <View style={styles.timelineLineBottom} />}
                                        <View style={[styles.timelineDot, { backgroundColor: colors.primary, borderColor: colors.primary }]} />
                                    </View>

                                    {/* Card */}
                                    <View style={[styles.card, { backgroundColor: '#F8FAFC' }]}>
                                        <View style={styles.cardHeader}>
                                            <AppText size="m" weight="bold" color={theme.colors.text.primary} numberOfLines={1}>{item.subject}</AppText>
                                            {isActive && (
                                                <View style={styles.liveBadge}>
                                                    <AppText size="xs" color="#FFF" weight="bold">LIVE</AppText>
                                                </View>
                                            )}
                                        </View>
                                        <AppText size="s" color={theme.colors.text.secondary} style={{ marginTop: 2 }}>
                                            {item.className} • {item.room}
                                        </AppText>
                                    </View>
                                </View>
                            );
                        })}
                    </View>
                </View>

                {/* Quick Actions Grid */}
                <View style={styles.section}>
                    <AppText size="l" weight="bold" style={{ marginBottom: 16 }}>Quick Actions</AppText>
                    <View style={styles.grid}>
                        {renderQuickAction(
                            'Self Attd.',
                            'user-check',
                            theme.colors.primary[600],
                            () => navigation.navigate('Attendance', { initialTab: 'self' }),
                            'Check In/Out'
                        )}
                        {renderQuickAction(
                            'Students',
                            'users',
                            theme.colors.status.success,
                            () => navigation.navigate('Attendance', { initialTab: 'student' }),
                            'Mark Attendance'
                        )}
                        {renderQuickAction(
                            'Homework',
                            'book',
                            theme.colors.status.warning,
                            () => navigation.navigate('Homework'),
                            'Assign & Check'
                        )}
                        {renderQuickAction(
                            'Timetable',
                            'calendar',
                            theme.colors.status.info,
                            () => navigation.navigate('Timetable'),
                            'Weekly Schedule'
                        )}
                    </View>
                </View>

                {/* Pending Tasks */}
                <View style={[styles.section, { paddingBottom: 40 }]}>
                    <View style={styles.sectionHeader}>
                        <AppText size="l" weight="bold">Pending Tasks</AppText>
                        <View style={styles.badgeCount}>
                            <AppText size="xs" color="#FFF" weight="bold">{pendingTasks.length}</AppText>
                        </View>
                    </View>
                    <View>
                        {pendingTasks.map(renderTaskItem)}
                    </View>
                </View>
            </View>
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    header: {
        paddingHorizontal: theme.spacing.xl,
        paddingTop: 0, // Removed top padding completely
        paddingBottom: theme.spacing.l,
        backgroundColor: '#F8F9FC', // Match app background
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    iconButton: {
        position: 'relative',
        padding: 4,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    badge: {
        position: 'absolute',
        top: 6,
        right: 6,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: theme.colors.status.danger,
        borderWidth: 1.5,
        borderColor: '#F8F9FC',
    },
    profileButton: {
        width: 48,
        height: 48,
        borderRadius: 16,
        backgroundColor: theme.colors.surface.app,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: theme.colors.border.soft,
    },
    contentContainer: {
        paddingHorizontal: theme.spacing.xl,
        paddingTop: 0, // Reduced from 24
    },
    section: {
        marginBottom: 24,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    actionCard: {
        width: '48%',
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 16,
        marginBottom: 16,
        ...theme.shadows.sm,
        borderWidth: 1,
        borderColor: theme.colors.border.soft,
    },
    actionIcon: {
        width: 56,
        height: 56,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    taskItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        padding: 16,
        borderRadius: 20,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#F0F0F0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.02,
        shadowRadius: 2,
        elevation: 1,
    },
    taskIconBox: {
        width: 48,
        height: 48,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    dueBadge: {
        backgroundColor: '#FEF2F2',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
        marginRight: 8,
    },
    badgeCount: {
        backgroundColor: theme.colors.primary[600],
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12,
        marginLeft: 8,
    },
    // Timeline Styles
    timelineContainer: {
        marginBottom: theme.spacing.m,
    },
    timelineItem: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    timeColumn: {
        width: 55,
        alignItems: 'flex-end',
        justifyContent: 'center', // Center vertically
        marginRight: 8,
    },
    timelineDecoration: {
        width: 20,
        alignItems: 'center',
        justifyContent: 'center', // Center vertically
        marginRight: 8,
    },
    timelineLineTop: {
        position: 'absolute',
        top: 0,
        bottom: '50%',
        width: 2,
        backgroundColor: theme.colors.border.soft,
    },
    timelineLineBottom: {
        position: 'absolute',
        top: '50%',
        bottom: -16, // Extend to cover card margin
        width: 2,
        backgroundColor: theme.colors.border.soft,
    },
    timelineDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        borderWidth: 2,
        marginTop: 0, // Remove margin, centered by flexbox
        backgroundColor: theme.colors.surface.default,
        zIndex: 1,
    },
    card: {
        flex: 1,
        borderRadius: 16,
        padding: 12,
        marginBottom: 0,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    liveBadge: {
        backgroundColor: theme.colors.status.danger,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
});
