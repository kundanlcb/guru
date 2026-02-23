import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    TextInput,
    Alert,
    Switch
} from 'react-native';
import { AppHeader } from '../../../components/ui/AppHeader';
import { AppText } from '../../../components/ui/AppText';
import { AppButton } from '../../../components/ui/AppButton';
import { Dropdown } from '../../../components/ui/Dropdown';
import { DatePicker } from '../../../components/ui/DatePicker';
import { theme } from '../../../theme/tokens';
import { useLeaveStore } from '../store/leaveStore';
import { useNavigation } from '@react-navigation/native';

export const ApplyLeaveScreen = () => {
    const navigation = useNavigation<any>();
    const { leaveTypes, applyLeave, isLoading } = useLeaveStore();

    const [formData, setFormData] = useState({
        leaveTypeId: null as number | null,
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
        isHalfDay: false,
        reason: ''
    });

    const handleSubmit = async () => {
        if (!formData.leaveTypeId) {
            Alert.alert('Error', 'Please select a leave type.');
            return;
        }
        if (!formData.reason.trim()) {
            Alert.alert('Error', 'Please provide a reason for leave.');
            return;
        }

        try {
            await applyLeave({
                leaveType: { id: formData.leaveTypeId },
                startDate: formData.startDate,
                endDate: formData.isHalfDay ? formData.startDate : formData.endDate,
                isHalfDay: formData.isHalfDay,
                reason: formData.reason
            });
            Alert.alert('Success', 'Leave application submitted successfully.', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Failed to submit leave application.');
        }
    };

    const typeOptions = leaveTypes.map(t => ({ label: t.name, value: t.id }));

    return (
        <View style={styles.container}>
            <AppHeader
                title="Apply Leave"
                showBack
                onBackPress={() => navigation.goBack()}
            />

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.formContainer}>
                    <AppText weight="medium" style={styles.label}>Leave Type</AppText>
                    <Dropdown
                        options={typeOptions}
                        value={formData.leaveTypeId}
                        onSelect={(val) => setFormData({ ...formData, leaveTypeId: val })}
                        placeholder="Select Leave Type"
                    />

                    <View style={styles.spacer} />

                    <View style={styles.halfDayRow}>
                        <AppText weight="medium">Half Day Leave?</AppText>
                        <Switch
                            value={formData.isHalfDay}
                            onValueChange={(val) => setFormData({ ...formData, isHalfDay: val })}
                            trackColor={{ false: theme.colors.border.default, true: theme.colors.primary[200] }}
                            thumbColor={formData.isHalfDay ? theme.colors.primary[600] : '#f4f3f4'}
                        />
                    </View>

                    <View style={styles.spacer} />

                    <View style={styles.row}>
                        <View style={styles.col}>
                            <AppText weight="medium" style={styles.label}>Start Date</AppText>
                            <DatePicker
                                value={formData.startDate}
                                onChange={(date) => setFormData({ ...formData, startDate: date })}
                            />
                        </View>
                        {!formData.isHalfDay && (
                            <View style={styles.col}>
                                <AppText weight="medium" style={styles.label}>End Date</AppText>
                                <DatePicker
                                    value={formData.endDate}
                                    onChange={(date) => setFormData({ ...formData, endDate: date })}
                                />
                            </View>
                        )}
                    </View>

                    <View style={styles.spacer} />

                    <AppText weight="medium" style={styles.label}>Reason</AppText>
                    <TextInput
                        style={styles.textArea}
                        placeholder="Enter reason for leave..."
                        placeholderTextColor={theme.colors.text.tertiary}
                        multiline
                        numberOfLines={4}
                        value={formData.reason}
                        onChangeText={(text) => setFormData({ ...formData, reason: text })}
                    />

                    <View style={styles.spacerxl} />

                    <AppButton
                        title="Submit Application"
                        onPress={handleSubmit}
                        isLoading={isLoading}
                    />
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.surface.app,
    },
    scrollContent: {
        padding: theme.spacing.l,
    },
    formContainer: {
        backgroundColor: theme.colors.surface.card,
        borderRadius: theme.radius.l,
        padding: theme.spacing.l,
        ...theme.shadows.md,
    },
    label: {
        marginBottom: theme.spacing.s,
        color: theme.colors.text.primary,
    },
    spacer: {
        height: theme.spacing.m,
    },
    spacerxl: {
        height: theme.spacing.xl,
    },
    row: {
        flexDirection: 'row',
        gap: theme.spacing.m,
    },
    col: {
        flex: 1,
    },
    textArea: {
        backgroundColor: theme.colors.surface.soft,
        borderRadius: theme.radius.m,
        padding: theme.spacing.m,
        color: theme.colors.text.primary,
        borderWidth: 1,
        borderColor: theme.colors.border.soft,
        textAlignVertical: 'top',
        height: 100,
    },
    halfDayRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: theme.spacing.xs,
    }
});
