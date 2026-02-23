import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScreenWrapper } from '../../../components/layout/ScreenWrapper';
import { AppText } from '../../../components/ui/AppText';
import { AppButton } from '../../../components/ui/AppButton';
import { theme } from '../../../theme/tokens';
import { useHomeworkStore } from '../store/homeworkStore';

export const CreateHomeworkScreen = () => {
    const navigation = useNavigation();
    const { classes, subjects, isLoading, fetchMetadata, createHomework } = useHomeworkStore();

    const [selectedClass, setSelectedClass] = useState<any>(null);
    const [selectedSubject, setSelectedSubject] = useState<any>(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState(new Date(Date.now() + 86400000).toISOString().split('T')[0]); // Default to tomorrow

    useEffect(() => {
        fetchMetadata();
    }, []);

    const handleSubmit = async () => {
        if (!selectedClass || !selectedSubject || !title || !dueDate) {
            Alert.alert('Error', 'Please fill all required fields');
            return;
        }

        try {
            await createHomework({
                classId: selectedClass.id,
                subjectId: selectedSubject.id,
                title,
                description,
                dueDate,
            });
            Alert.alert('Success', 'Homework assigned successfully');
            navigation.goBack();
        } catch (error) {
            Alert.alert('Error', 'Failed to assign homework');
        }
    };

    if (isLoading && classes.length === 0) {
        return (
            <ScreenWrapper title="Assign Homework" showBack>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={theme.colors.primary[600]} />
                </View>
            </ScreenWrapper>
        );
    }

    return (
        <ScreenWrapper title="Assign Homework" showBack headerNoBorder>
            <ScrollView style={styles.container} contentContainerStyle={styles.content}>
                <AppText weight="bold" style={styles.label}>Select Class *</AppText>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
                    {classes.map(cls => (
                        <TouchableOpacity
                            key={cls.id}
                            style={[styles.chip, selectedClass?.id === cls.id && styles.activeChip]}
                            onPress={() => setSelectedClass(cls)}
                        >
                            <AppText color={selectedClass?.id === cls.id ? '#FFF' : theme.colors.text.primary} weight="medium">
                                {cls.name}
                            </AppText>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                <AppText weight="bold" style={styles.label}>Select Subject *</AppText>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
                    {subjects.map(sub => (
                        <TouchableOpacity
                            key={sub.id}
                            style={[styles.chip, selectedSubject?.id === sub.id && styles.activeChip]}
                            onPress={() => setSelectedSubject(sub)}
                        >
                            <AppText color={selectedSubject?.id === sub.id ? '#FFF' : theme.colors.text.primary} weight="medium">
                                {sub.name}
                            </AppText>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                <AppText weight="bold" style={styles.label}>Homework Title *</AppText>
                <TextInput
                    style={styles.input}
                    placeholder="Enter title (e.g. Chapter 5 Exercises)"
                    value={title}
                    onChangeText={setTitle}
                    placeholderTextColor={theme.colors.text.tertiary}
                />

                <AppText weight="bold" style={styles.label}>Description</AppText>
                <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Enter instructions..."
                    value={description}
                    onChangeText={setDescription}
                    multiline
                    numberOfLines={4}
                    placeholderTextColor={theme.colors.text.tertiary}
                    textAlignVertical="top"
                />

                <AppText weight="bold" style={styles.label}>Due Date (YYYY-MM-DD) *</AppText>
                <TextInput
                    style={styles.input}
                    placeholder="YYYY-MM-DD"
                    value={dueDate}
                    onChangeText={setDueDate}
                    placeholderTextColor={theme.colors.text.tertiary}
                />

                <AppButton
                    title="Assign Homework"
                    onPress={handleSubmit}
                    isLoading={isLoading}
                    style={styles.submitBtn}
                />
            </ScrollView>
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        padding: 20,
        paddingBottom: 40,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
        marginTop: 16,
        color: theme.colors.text.primary,
    },
    chipScroll: {
        flexGrow: 0,
        marginBottom: 8,
    },
    chip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#FFF',
        marginRight: 8,
        borderWidth: 1,
        borderColor: theme.colors.border.soft,
    },
    activeChip: {
        backgroundColor: theme.colors.primary[600],
        borderColor: theme.colors.primary[600],
    },
    input: {
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: theme.colors.border.soft,
        borderRadius: 12,
        padding: 12,
        fontSize: 16,
        color: theme.colors.text.primary,
    },
    textArea: {
        height: 120,
    },
    submitBtn: {
        marginTop: 32,
    }
});
