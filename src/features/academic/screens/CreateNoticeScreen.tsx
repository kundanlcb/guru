import React, { useState } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScreenWrapper } from '../../../components/layout/ScreenWrapper';
import { AppText } from '../../../components/ui/AppText';
import { Icon } from '../../../components/ui/Icon';
import { theme } from '../../../theme/tokens';
import { useNoticeStore } from '../store/noticeStore';

const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH'];
const TARGET_ROLES = ['PARENT', 'STUDENT', 'TEACHER', 'ALL'];

export const CreateNoticeScreen = () => {
    const navigation = useNavigation();
    const { createNotice, isLoading } = useNoticeStore();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [priority, setPriority] = useState('MEDIUM');
    const [targetRole, setTargetRole] = useState('ALL');

    const handleSubmit = async () => {
        if (!title.trim() || !content.trim()) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }

        const success = await createNotice({
            title,
            content,
            priority,
            targetRole
        });

        if (success) {
            Alert.alert('Success', 'Notice created successfully');
            navigation.goBack();
        } else {
            Alert.alert('Error', 'Failed to create notice');
        }
    };

    return (
        <ScreenWrapper title="Create Notice" showBack headerAlign="left">
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.formGroup}>
                    <AppText size="s" weight="bold" color={theme.colors.text.secondary}>Title *</AppText>
                    <TextInput
                        style={styles.input}
                        placeholder="Notice Title"
                        value={title}
                        onChangeText={setTitle}
                    />
                </View>

                <View style={styles.formGroup}>
                    <AppText size="s" weight="bold" color={theme.colors.text.secondary}>Content *</AppText>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        placeholder="Notice Content"
                        multiline
                        numberOfLines={6}
                        value={content}
                        onChangeText={setContent}
                    />
                </View>

                <View style={styles.formGroup}>
                    <AppText size="s" weight="bold" color={theme.colors.text.secondary}>Priority</AppText>
                    <View style={styles.chipRow}>
                        {PRIORITIES.map(p => (
                            <TouchableOpacity
                                key={p}
                                style={[styles.chip, priority === p && styles.chipActive]}
                                onPress={() => setPriority(p)}
                            >
                                <AppText size="xs" color={priority === p ? '#FFF' : theme.colors.text.primary}>
                                    {p}
                                </AppText>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <View style={styles.formGroup}>
                    <AppText size="s" weight="bold" color={theme.colors.text.secondary}>Target Audience</AppText>
                    <View style={styles.chipRow}>
                        {TARGET_ROLES.map(r => (
                            <TouchableOpacity
                                key={r}
                                style={[styles.chip, targetRole === r && styles.chipActive]}
                                onPress={() => setTargetRole(r)}
                            >
                                <AppText size="xs" color={targetRole === r ? '#FFF' : theme.colors.text.primary}>
                                    {r}
                                </AppText>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <TouchableOpacity
                    style={[styles.submitButton, (!title.trim() || !content.trim()) && styles.submitButtonDisabled]}
                    onPress={handleSubmit}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator color="#FFF" />
                    ) : (
                        <AppText weight="bold" color="#FFF">Post Notice</AppText>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: theme.spacing.l,
    },
    formGroup: {
        marginBottom: theme.spacing.xl,
    },
    input: {
        marginTop: 8,
        borderWidth: 1,
        borderColor: theme.colors.border.soft,
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        color: theme.colors.text.primary,
        backgroundColor: '#FFF',
    },
    textArea: {
        height: 120,
        textAlignVertical: 'top',
    },
    chipRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginTop: 8,
    },
    chip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: theme.colors.surface.background,
        borderWidth: 1,
        borderColor: theme.colors.border.soft,
    },
    chipActive: {
        backgroundColor: theme.colors.primary[600],
        borderColor: theme.colors.primary[600],
    },
    submitButton: {
        marginTop: theme.spacing.l,
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
    }
});
