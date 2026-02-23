import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { ScreenWrapper } from '../../../components/layout/ScreenWrapper';
import { AppText } from '../../../components/ui/AppText';
import { theme } from '../../../theme/tokens';
import { useAttendanceStore } from '../store/attendanceStore';
import { Icon } from '../../../components/ui/Icon';
import { AppButton } from '../../../components/ui/AppButton';
import { Dropdown } from '../../../components/ui/Dropdown';
import { DatePicker } from '../../../components/ui/DatePicker';

export const AttendanceScreen = () => {
    const route = useRoute<any>();
    const { initialTab } = route.params || { initialTab: 'self' };
    const mode = initialTab as 'self' | 'student';

    const {
        isLoading, selfStatus, lastCheckIn, lastCheckOut, toggleSelfStatus, selfHistory, fetchSelfHistory,
        classes, subjects, selectedClass, setSelectedClass, selectedSubject, setSelectedSubject,
        selectedDate, setSelectedDate, students, markStudent, submitAttendance, fetchClasses
    } = useAttendanceStore();

    const [dateInput, setDateInput] = useState(selectedDate || new Date().toISOString().split('T')[0]);

    React.useEffect(() => {
        if (mode === 'self') {
            fetchSelfHistory();
        } else {
            fetchClasses();
        }
    }, [mode]);

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
                    {selfStatus === 'in' ? `Since ${lastCheckIn || '--:--'}` : 'Check in to start your day'}
                </AppText>

                <AppButton
                    title={selfStatus === 'in' ? "Check Out" : "Check In"}
                    onPress={toggleSelfStatus}
                    isLoading={isLoading}
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
                        <AppText size="s" color={theme.colors.status.success}>In: {item.checkIn || '--:--'}</AppText>
                        <AppText size="s" color={theme.colors.status.danger}>Out: {item.checkOut || '--:--'}</AppText>
                    </View>
                </View>
            ))}
        </View>
    );

    const renderStudentAttendance = () => (
        <View style={styles.tabContent}>
            {classes.length > 0 ? (
                <>
                    <View style={styles.topRow}>
                        <Dropdown
                            label="Class"
                            placeholder="Select"
                            value={selectedClass?.id}
                            options={classes.map(c => ({ label: `${c.className} ${c.section ? `(${c.section})` : ''}`.trim(), value: c.id }))}
                            onSelect={(val) => {
                                const cls = classes.find(c => c.id === val);
                                if (cls) setSelectedClass(cls);
                            }}
                            style={{ flex: 1 }}
                        />
                        <Dropdown
                            label="Subject"
                            placeholder="Select"
                            value={selectedSubject?.id}
                            options={subjects.map(s => ({ label: s.name, value: s.id }))}
                            onSelect={(val) => {
                                const sub = subjects.find(s => s.id === val);
                                if (sub) setSelectedSubject(sub);
                            }}
                            style={{ flex: 1 }}
                        />
                        <TouchableOpacity
                            style={styles.reloadBtn}
                            onPress={() => fetchClasses()}
                            disabled={isLoading}
                        >
                            <Icon name="refresh-cw" size={20} color="#FFF" library="feather" />
                        </TouchableOpacity>
                    </View>

                    {(!selectedClass || !selectedSubject) ? (
                        <View style={styles.emptyState}>
                            <Icon name="clipboard" size={48} color={theme.colors.border.default} library="feather" />
                            <AppText color={theme.colors.text.secondary} style={{ marginTop: 16, textAlign: 'center' }}>
                                Select class and subject to mark attendance
                            </AppText>
                        </View>
                    ) : (
                        <>

                            <View style={styles.dateSelectorContainer}>
                                <DatePicker
                                    label="Date"
                                    value={dateInput}
                                    onChange={setDateInput}
                                    style={{ flex: 1, marginRight: 12 }}
                                />
                                <AppButton
                                    title="Load"
                                    onPress={() => setSelectedDate(dateInput)}
                                    isLoading={isLoading}
                                    disabled={isLoading || !selectedClass}
                                    variant="outline"
                                    style={{ width: 'auto', minWidth: 100, alignSelf: 'flex-end', height: 48, paddingHorizontal: 24, justifyContent: 'center' }}
                                />
                            </View>

                            {students.length > 0 && (
                                <View style={styles.statsContainer}>
                                    <View style={styles.statBox}>
                                        <AppText size="xs" color={theme.colors.text.secondary}>Total</AppText>
                                        <AppText size="l" weight="bold">{students.length}</AppText>
                                    </View>
                                    <View style={[styles.statBox, { backgroundColor: theme.colors.status.success + '1A' }]}>
                                        <AppText size="xs" color={theme.colors.status.success}>Present</AppText>
                                        <AppText size="l" weight="bold" color={theme.colors.status.success}>
                                            {students.filter(s => s.status === 'P').length}
                                        </AppText>
                                    </View>
                                    <View style={[styles.statBox, { backgroundColor: theme.colors.status.danger + '1A' }]}>
                                        <AppText size="xs" color={theme.colors.status.danger}>Absent</AppText>
                                        <AppText size="l" weight="bold" color={theme.colors.status.danger}>
                                            {students.filter(s => s.status === 'A').length}
                                        </AppText>
                                    </View>
                                    <View style={[styles.statBox, { backgroundColor: theme.colors.status.warning + '1A' }]}>
                                        <AppText size="xs" color={theme.colors.status.warning}>Late</AppText>
                                        <AppText size="l" weight="bold" color={theme.colors.status.warning}>
                                            {students.filter(s => s.status === 'L').length}
                                        </AppText>
                                    </View>
                                </View>
                            )}

                            {students.length > 0 && (
                                <View style={styles.studentListHeader}>
                                    <AppText weight="bold">Student Name</AppText>
                                    <AppText weight="bold">Status</AppText>
                                </View>
                            )}

                            {students.length > 0 ? (
                                students.map(student => (
                                    <View key={student.id} style={styles.studentRow}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                                            <View style={styles.avatar}>
                                                <AppText size="xs" weight="bold" color="#FFF">
                                                    {student.roll || student.id.toString().slice(-2)}
                                                </AppText>
                                            </View>
                                            <View style={{ marginLeft: 12, flex: 1 }}>
                                                <AppText weight="medium" numberOfLines={1}>{student.name}</AppText>
                                                <AppText size="s" color={theme.colors.text.secondary}>Roll No: {student.roll || 'N/A'}</AppText>
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
                                ))
                            ) : (
                                <View style={styles.emptyState}>
                                    <Icon name="users" size={48} color={theme.colors.border.default} library="feather" />
                                    <AppText color={theme.colors.text.secondary} style={{ marginTop: 16, textAlign: 'center' }}>
                                        No students found for this class on this date.
                                    </AppText>
                                </View>
                            )}

                            {students.length > 0 && (
                                <AppButton
                                    title="Submit Attendance"
                                    onPress={submitAttendance}
                                    isLoading={isLoading}
                                    style={{ marginTop: 24 }}
                                />
                            )}
                        </>
                    )}
                </>
            ) : (
                <View style={{ padding: 40, alignItems: 'center' }}>
                    <AppText color={theme.colors.text.secondary}>No classes assigned to you.</AppText>
                </View>
            )}
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
    topRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 16,
        alignItems: 'flex-start',
    },
    reloadBtn: {
        width: 52,
        height: 52,
        marginTop: 22,
        borderRadius: 16,
        backgroundColor: theme.colors.primary[600],
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
        marginTop: 40,
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
    },
    input: {
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: theme.colors.border.soft,
        borderRadius: 12,
        padding: 12,
        height: 48,
        fontSize: 16,
        color: theme.colors.text.primary,
    },
    dateSelectorContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        marginBottom: 8,
        color: theme.colors.text.primary,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    statBox: {
        flex: 1,
        backgroundColor: theme.colors.surface.background,
        padding: 12,
        borderRadius: 12,
        alignItems: 'center',
        marginHorizontal: 4,
        borderWidth: 1,
        borderColor: theme.colors.border.soft,
    }
});
