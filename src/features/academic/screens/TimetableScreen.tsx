import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { ScreenWrapper } from '../../../components/layout/ScreenWrapper';
import { AppText } from '../../../components/ui/AppText';
import { Icon } from '../../../components/ui/Icon';
import { theme } from '../../../theme/tokens';
import { useTimetableStore } from '../store/timetableStore';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const CATEGORY_COLORS = {
    science: { bg: '#E0F2FE', text: '#0C4A6E', primary: '#5A53D6', iconBg: '#5A53D6' },
    math: { bg: '#FFEDD5', text: '#7C2D12', primary: '#5A53D6', iconBg: '#5A53D6' },
    arts: { bg: '#F3E8FF', text: '#581C87', primary: '#5A53D6', iconBg: '#5A53D6' },
    lang: { bg: '#E0E7FF', text: '#312E81', primary: '#5A53D6', iconBg: '#5A53D6' },
    bio: { bg: '#E2FBE9', text: '#064E3B', primary: '#16A34A', iconBg: '#15803D' },
    break: { bg: '#F5F5F5', text: '#525252', primary: '#737373', iconBg: '#737373' },
};

export const TimetableScreen = () => {
    const { schedule, isLoading, fetchSchedule } = useTimetableStore();
    const [selectedDay, setSelectedDay] = useState('Mon');

    React.useEffect(() => {
        fetchSchedule();
    }, []);

    const getSubjectIcon = (subject: string): string => {
        const lowerSubject = subject.toLowerCase();
        if (lowerSubject.includes('math')) return 'divide-circle';
        if (lowerSubject.includes('science') || lowerSubject.includes('physics') || lowerSubject.includes('chemistry')) return 'hexagon';
        if (lowerSubject.includes('bio')) return 'activity';
        if (lowerSubject.includes('geography') || lowerSubject.includes('history')) return 'globe';
        if (lowerSubject.includes('english') || lowerSubject.includes('lang')) return 'book-open';
        if (lowerSubject.includes('computer') || lowerSubject.includes('tech')) return 'monitor';
        if (lowerSubject.includes('sport') || lowerSubject.includes('gym')) return 'dribbble';
        if (lowerSubject.includes('art') || lowerSubject.includes('music')) return 'music';
        return 'book';
    };

    return (
        <ScreenWrapper
            title="Timetable"
            showBack
            headerAlign="left"
            headerSize="xxl"
            headerNoBorder
        >
            <View style={styles.container}>
                {/* Day Strip */}
                <View style={styles.dateStripContainer}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dateScroll}>
                        {DAYS.map((day) => {
                            const isSelected = selectedDay === day;
                            return (
                                <TouchableOpacity
                                    key={day}
                                    style={[styles.dateItem, isSelected && styles.dateItemActive]}
                                    onPress={() => setSelectedDay(day)}
                                >
                                    <AppText
                                        size="m"
                                        weight="bold"
                                        color={isSelected ? '#FFF' : theme.colors.text.primary}
                                    >
                                        {day}
                                    </AppText>
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>
                </View>

                {/* Timeline */}
                <ScrollView
                    contentContainerStyle={styles.timelineContent}
                    refreshControl={
                        <RefreshControl refreshing={isLoading} onRefresh={fetchSchedule} tintColor={theme.colors.primary[600]} />
                    }
                >
                    {schedule[selectedDay]?.map((item, index, arr) => {
                        const colors = CATEGORY_COLORS[item.category as keyof typeof CATEGORY_COLORS] || CATEGORY_COLORS.break;
                        const isActive = item.isActive;
                        const isLast = index === arr.length - 1;

                        const cardBg = isActive ? colors.bg : '#FFFFFF';
                        const subjectColor = isActive ? colors.text : colors.primary;
                        const secondaryColor = isActive ? colors.text : theme.colors.text.secondary;

                        return (
                            <View key={index} style={styles.timelineRow}>
                                {/* Time Column */}
                                <View style={styles.timeColumn}>
                                    <AppText
                                        size="m"
                                        weight="bold"
                                        color={isActive ? theme.colors.primary[600] : theme.colors.text.primary}
                                        style={{ marginBottom: 4 }}
                                    >
                                        {item.startTime}
                                    </AppText>
                                    <AppText size="s" color={theme.colors.text.tertiary}>
                                        {item.endTime}
                                    </AppText>
                                </View>

                                {/* Timeline Decoration */}
                                <View style={styles.timelineDecoration}>
                                    {index !== 0 && <View style={styles.timelineLineTop} />}
                                    {!isLast && <View style={styles.timelineLineBottom} />}
                                    <View style={[styles.timelineDot, {
                                        backgroundColor: isActive ? theme.colors.primary[600] : theme.colors.text.disabled,
                                        borderColor: isActive ? theme.colors.primary[100] : theme.colors.surface.background,
                                    }]} />
                                </View>

                                {/* Card Column */}
                                <View style={styles.cardContainer}>
                                    <View style={[
                                        styles.cardContent,
                                        { backgroundColor: cardBg }
                                    ]}>
                                        <View style={styles.cardHeader}>
                                            <AppText
                                                size="l"
                                                weight="bold"
                                                color={subjectColor}
                                                style={{ flex: 1 }}
                                            >
                                                {item.class}
                                            </AppText>

                                            <View style={styles.headerRight}>
                                                {isActive && <View style={styles.activeDot} />}

                                                <View style={[styles.subjectIconBox]}>
                                                    <Icon
                                                        name={getSubjectIcon(item.subject)}
                                                        library="feather"
                                                        size={18}
                                                        color={subjectColor}
                                                    />
                                                </View>
                                            </View>
                                        </View>

                                        <View style={styles.detailRow}>
                                            <View style={[styles.iconPlaceholder, { backgroundColor: isActive ? colors.iconBg : theme.colors.primary[100] }]}>
                                                <Icon name="book" size={14} color={isActive ? '#FFF' : theme.colors.primary[600]} library="feather" />
                                            </View>
                                            <AppText
                                                size="s"
                                                color={secondaryColor}
                                                style={{ opacity: isActive ? 0.9 : 1, marginRight: 16 }}
                                            >
                                                {item.subject}
                                            </AppText>

                                            <View style={[styles.iconPlaceholder, { backgroundColor: isActive ? colors.iconBg : theme.colors.primary[100], marginLeft: 'auto' }]}>
                                                <Icon name="map-pin" size={14} color={isActive ? '#FFF' : theme.colors.primary[600]} library="feather" />
                                            </View>
                                            <AppText
                                                size="s"
                                                color={secondaryColor}
                                                style={{ opacity: isActive ? 0.9 : 1 }}
                                            >
                                                {item.room}
                                            </AppText>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        );
                    })}
                    {(!schedule[selectedDay] || schedule[selectedDay].length === 0) && !isLoading && (
                        <View style={styles.emptyState}>
                            <AppText color={theme.colors.text.secondary}>No schedule for this day</AppText>
                        </View>
                    )}
                </ScrollView>
            </View>
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    dateStripContainer: {
        paddingVertical: theme.spacing.m,
    },
    dateScroll: {
        paddingHorizontal: theme.spacing.l,
        gap: theme.spacing.m,
    },
    dateItem: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 64,
        height: 48,
        borderRadius: 14,
        backgroundColor: 'transparent',
    },
    dateItemActive: {
        backgroundColor: theme.colors.primary[600],
        shadowColor: theme.colors.primary[600],
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    timelineContent: {
        paddingHorizontal: theme.spacing.l,
        paddingBottom: 100,
        paddingTop: theme.spacing.m,
    },
    timelineRow: {
        flexDirection: 'row',
        marginBottom: theme.spacing.l,
    },
    timeColumn: {
        width: 60,
        justifyContent: 'center',
    },
    timelineDecoration: {
        width: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: theme.spacing.s,
        position: 'relative',
    },
    timelineLineTop: {
        position: 'absolute',
        top: 0,
        bottom: '50%',
        width: 2,
        backgroundColor: theme.colors.border.soft,
        left: 11,
    },
    timelineLineBottom: {
        position: 'absolute',
        top: '50%',
        bottom: -theme.spacing.l,
        width: 2,
        backgroundColor: theme.colors.border.soft,
        left: 11,
    },
    timelineDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        borderWidth: 2,
        zIndex: 1,
    },
    cardContainer: {
        flex: 1,
        minHeight: 110,
        backgroundColor: 'transparent',
    },
    cardContent: {
        flex: 1,
        borderRadius: 16,
        padding: theme.spacing.l,
        justifyContent: 'center',
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: theme.colors.border.soft,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.m,
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    subjectIconBox: {
        width: 28,
        height: 28,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 8,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    activeDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: theme.colors.primary[600],
        marginRight: 4,
    },
    iconPlaceholder: {
        width: 24,
        height: 24,
        borderRadius: 12,
        marginRight: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyState: {
        padding: theme.spacing.xl,
        alignItems: 'center',
    }
});
