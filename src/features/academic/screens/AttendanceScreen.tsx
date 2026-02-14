import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { ScreenWrapper } from '../../../components/layout/ScreenWrapper';
import { AppText } from '../../../components/ui/AppText';
import { theme } from '../../../theme/tokens';
import { useAttendanceStore } from '../store/attendanceStore';
import { Icon } from '../../../components/ui/Icon';
import { AppButton } from '../../../components/ui/AppButton';

export const AttendanceScreen = () => {
    const route = useRoute<any>();
    const { initialTab } = route.params || { initialTab: 'self' };
    const mode = initialTab as 'self' | 'student';

    const {
        selfStatus, lastCheckIn, lastCheckOut, toggleSelfStatus, selfHistory,
        classes, selectedClass, setSelectedClass, students, markStudent, submitAttendance
    } = useAttendanceStore();

    const renderSelfAttendance = () => (
        <View style={styles.tabContent}>
            <View style={styles.checkCard}>
                <View style={styles.checkIconContainer}>
                    <Icon name={selfStatus === 'in' ? "log-out" : "log-in"} size={32} color="#FFF" library="feather" />
                </View>
                <AppText size="l" weight="bold" style={{ marginTop: 16 }}>
                    {selfStatus === 'in' ? 'You are Checked In' : 'You are Checked Out'}
                </AppText>
                <AppText color={theme.colors.text.secondary} style={{ marginTop: 4 }}>
                    {selfStatus === 'in' ? `Since ${lastCheckIn}` : 'Check in to start your day'}
                </AppText>

                <AppButton
                    title={selfStatus === 'in' ? "Check Out" : "Check In"}
                    onPress={toggleSelfStatus}
                    style={{ marginTop: 24, width: '100%' }}
                    variant={selfStatus === 'in' ? 'outline' : 'primary'}
                />
            </View>

            <AppText size="l" weight="bold" style={{ marginVertical: 16 }}>Recent History</AppText>
            {selfHistory.map((item, index) => (
                <View key={index} style={styles.historyItem}>
                    <View>
                        <AppText weight="bold">{item.date}</AppText>
                        <AppText size="s" color={theme.colors.text.secondary} style={{ marginTop: 2 }}>{item.status}</AppText>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                        <AppText size="s" color={theme.colors.status.success}>In: {item.checkIn}</AppText>
                        <AppText size="s" color={theme.colors.status.danger}>Out: {item.checkOut}</AppText>
                    </View>
                </View>
            ))}
        </View>
    );

    const renderStudentAttendance = () => (
        <View style={styles.tabContent}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
                {classes.map(cls => (
                    <TouchableOpacity
                        key={cls}
                        style={[styles.classChip, selectedClass === cls && styles.activeClassChip]}
                        onPress={() => setSelectedClass(cls)}
                    >
                        <AppText color={selectedClass === cls ? '#FFF' : theme.colors.text.primary} weight="medium">{cls}</AppText>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <View style={styles.studentListHeader}>
                <AppText weight="bold">Student Name</AppText>
                <AppText weight="bold">Status</AppText>
            </View>

            {students.map(student => (
                <View key={student.id} style={styles.studentRow}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={styles.avatar}>
                            <AppText size="s" weight="bold" color="#FFF">{student.id}</AppText>
                        </View>
                        <View style={{ marginLeft: 12 }}>
                            <AppText weight="medium">{student.name}</AppText>
                            <AppText size="s" color={theme.colors.text.secondary}>Roll No: {student.roll}</AppText>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        {['P', 'A', 'L'].map((status) => (
                            <TouchableOpacity
                                key={status}
                                onPress={() => markStudent(student.id, status as any)}
                                style={[
                                    styles.statusBtn,
                                    student.status === status && {
                                        backgroundColor:
                                            status === 'P' ? theme.colors.status.success :
                                                status === 'A' ? theme.colors.status.danger : theme.colors.status.warning
                                    }
                                ]}
                            >
                                <AppText
                                    size="xs"
                                    color={student.status === status ? '#FFF' : theme.colors.text.primary}
                                    weight="bold"
                                >
                                    {status}
                                </AppText>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            ))}

            <AppButton title="Submit Attendance" onPress={submitAttendance} style={{ marginTop: 24 }} />
        </View>
    );

    return (
        <ScreenWrapper
            title={mode === 'self' ? 'Self Attendance' : 'Student Attendance'}
            headerNoBorder
            showBack
            headerAlign="left"
            headerSize="xxl"
        >
            <View style={styles.container}>
                <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
                    {mode === 'self' ? renderSelfAttendance() : renderStudentAttendance()}
                </ScrollView>
            </View>
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    // Removed tabs styles
    tabContent: {
        padding: 16,
    },
    checkCard: {
        backgroundColor: '#FFF',
        borderRadius: 24,
        padding: 24,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: theme.colors.border.soft,
    },
    checkIconContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: theme.colors.primary[600],
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: theme.colors.primary[600],
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    historyItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 16,
        backgroundColor: '#FFF',
        borderRadius: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: theme.colors.border.soft,
    },
    classChip: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: '#FFF',
        borderRadius: 20,
        marginRight: 12,
        borderWidth: 1,
        borderColor: theme.colors.border.soft,
    },
    activeClassChip: {
        backgroundColor: theme.colors.primary[600],
        borderColor: theme.colors.primary[600],
    },
    studentListHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
        marginTop: 8,
    },
    studentRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border.soft,
    },
    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: theme.colors.text.tertiary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    statusBtn: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.surface.app,
        marginLeft: 8,
    }
});
