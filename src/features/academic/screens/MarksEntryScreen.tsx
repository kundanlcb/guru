import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TextInput, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { ScreenWrapper } from '../../../components/layout/ScreenWrapper';
import { AppText } from '../../../components/ui/AppText';
import { Icon } from '../../../components/ui/Icon';
import { theme } from '../../../theme/tokens';
import { useMarksStore } from '../store/marksStore';

export const MarksEntryScreen = () => {
    const {
        terms, classes, subjects, students, marks, isLoading,
        fetchMetadata, fetchStudents, setMark, submitMarks
    } = useMarksStore();

    const [selectedTerm, setSelectedTerm] = useState<number | null>(null);
    const [selectedClass, setSelectedClass] = useState<number | null>(null);
    const [selectedSubject, setSelectedSubject] = useState<number | null>(null);

    useEffect(() => {
        fetchMetadata();
    }, []);

    useEffect(() => {
        if (selectedClass) {
            fetchStudents(selectedClass);
        }
    }, [selectedClass]);

    const handleSubmit = async () => {
        if (!selectedTerm || !selectedClass || !selectedSubject) {
            Alert.alert('Error', 'Please select term, class and subject');
            return;
        }

        const success = await submitMarks(selectedTerm, selectedClass, selectedSubject);
        if (success) {
            Alert.alert('Success', 'Marks submitted successfully');
        } else {
            Alert.alert('Error', 'Failed to submit marks');
        }
    };

    const renderHeader = () => (
        <View style={styles.headerFilters}>
            <View style={styles.dropdownContainer}>
                <AppText size="s" weight="bold" color={theme.colors.text.secondary}>Term</AppText>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
                    {terms.map(term => (
                        <TouchableOpacity
                            key={term.id}
                            style={[styles.chip, selectedTerm === term.id && styles.chipActive]}
                            onPress={() => setSelectedTerm(term.id || null)}
                        >
                            <AppText size="xs" color={selectedTerm === term.id ? '#FFF' : theme.colors.text.primary}>
                                {term.name}
                            </AppText>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <View style={styles.dropdownContainer}>
                <AppText size="s" weight="bold" color={theme.colors.text.secondary}>Class</AppText>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
                    {classes.map(cls => (
                        <TouchableOpacity
                            key={cls.id}
                            style={[styles.chip, selectedClass === cls.id && styles.chipActive]}
                            onPress={() => setSelectedClass(cls.id)}
                        >
                            <AppText size="xs" color={selectedClass === cls.id ? '#FFF' : theme.colors.text.primary}>
                                {cls.name}
                            </AppText>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <View style={styles.dropdownContainer}>
                <AppText size="s" weight="bold" color={theme.colors.text.secondary}>Subject</AppText>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
                    {subjects.map(sub => (
                        <TouchableOpacity
                            key={sub.id}
                            style={[styles.chip, selectedSubject === sub.id && styles.chipActive]}
                            onPress={() => setSelectedSubject(sub.id)}
                        >
                            <AppText size="xs" color={selectedSubject === sub.id ? '#FFF' : theme.colors.text.primary}>
                                {sub.name}
                            </AppText>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
        </View>
    );

    const renderStudent = ({ item }: { item: any }) => (
        <View style={styles.studentCard}>
            <View style={styles.studentInfo}>
                <AppText weight="bold">{item.firstName} {item.lastName}</AppText>
                <AppText size="xs" color={theme.colors.text.tertiary}>Roll: {item.rollNo || 'N/A'}</AppText>
            </View>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.marksInput}
                    keyboardType="numeric"
                    placeholder="0"
                    value={marks[item.id]?.toString() || ''}
                    onChangeText={(val) => setMark(item.id, Number(val))}
                />
                <AppText size="xs" style={{ marginLeft: 8 }}>/ 100</AppText>
            </View>
        </View>
    );

    return (
        <ScreenWrapper title="Marks Entry" showBack headerAlign="left">
            <FlatList
                data={students}
                keyExtractor={item => item.id.toString()}
                renderItem={renderStudent}
                ListHeaderComponent={renderHeader}
                contentContainerStyle={styles.list}
                ListEmptyComponent={
                    isLoading ? (
                        <ActivityIndicator size="large" color={theme.colors.primary[600]} style={{ marginTop: 40 }} />
                    ) : (
                        <View style={styles.empty}>
                            <AppText color={theme.colors.text.tertiary}>Select filters to view students</AppText>
                        </View>
                    )
                }
            />

            <TouchableOpacity
                style={[styles.submitButton, (!selectedTerm || !selectedClass || !selectedSubject) && styles.submitButtonDisabled]}
                onPress={handleSubmit}
                disabled={isLoading}
            >
                {isLoading ? (
                    <ActivityIndicator color="#FFF" />
                ) : (
                    <AppText weight="bold" color="#FFF">Submit Marks</AppText>
                )}
            </TouchableOpacity>
        </ScreenWrapper>
    );
};


const styles = StyleSheet.create({
    list: {
        padding: theme.spacing.l,
    },
    headerFilters: {
        marginBottom: theme.spacing.xl,
    },
    dropdownContainer: {
        marginBottom: theme.spacing.m,
    },
    chipScroll: {
        marginTop: 8,
    },
    chip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: theme.colors.surface.background,
        marginRight: 8,
        borderWidth: 1,
        borderColor: theme.colors.border.soft,
    },
    chipActive: {
        backgroundColor: theme.colors.primary[600],
        borderColor: theme.colors.primary[600],
    },
    studentCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: theme.spacing.m,
        backgroundColor: '#FFF',
        borderRadius: 12,
        marginBottom: theme.spacing.s,
        borderWidth: 1,
        borderColor: theme.colors.border.soft,
    },
    studentInfo: {
        flex: 1,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    marksInput: {
        width: 60,
        height: 40,
        borderWidth: 1,
        borderColor: theme.colors.border.soft,
        borderRadius: 8,
        textAlign: 'center',
        fontWeight: 'bold',
        color: theme.colors.text.primary,
        backgroundColor: theme.colors.surface.background,
    },
    submitButton: {
        margin: theme.spacing.l,
        backgroundColor: theme.colors.primary[600],
        height: 56,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: theme.colors.primary[600],
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    submitButtonDisabled: {
        backgroundColor: theme.colors.text.disabled,
        shadowOpacity: 0,
        elevation: 0,
    },
    empty: {
        alignItems: 'center',
        marginTop: 100,
    }
});
