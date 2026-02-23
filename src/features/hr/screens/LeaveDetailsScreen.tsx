import React from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    Alert
} from 'react-native';
import { AppHeader } from '../../../components/ui/AppHeader';
import { AppText } from '../../../components/ui/AppText';
import { AppButton } from '../../../components/ui/AppButton';
import { theme } from '../../../theme/tokens';
import { useLeaveStore } from '../store/leaveStore';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Icon } from '../../../components/ui/Icon';
import { LeaveRequest } from '../types';

export const LeaveDetailsScreen = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { request } = route.params as { request: LeaveRequest };
    const { cancelRequest, isLoading } = useLeaveStore();

    const handleCancel = () => {
        Alert.alert(
            'Cancel Leave',
            'Are you sure you want to cancel this leave request?',
            [
                { text: 'No', style: 'cancel' },
                {
                    text: 'Yes, Cancel',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await cancelRequest(request.id);
                            Alert.alert('Success', 'Leave request cancelled.');
                            navigation.goBack();
                        } catch (error: any) {
                            Alert.alert('Error', error.message || 'Failed to cancel request.');
                        }
                    }
                }
            ]
        );
    };

    const statusColors = {
        PENDING: theme.colors.status.warning,
        APPROVED: theme.colors.status.success,
        REJECTED: theme.colors.status.danger,
        CANCELLED: theme.colors.text.tertiary,
    };

    return (
        <View style={styles.container}>
            <AppHeader
                title="Leave Details"
                showBack
                onBackPress={() => navigation.goBack()}
            />

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.card}>
                    <View style={styles.header}>
                        <View>
                            <AppText size="l" weight="bold">{request.leaveType?.name || 'Leave'}</AppText>
                            <AppText size="xs" color={theme.colors.text.tertiary}>Applied on {request.createdAt}</AppText>
                        </View>
                        <View style={[styles.statusBadge, { backgroundColor: statusColors[request.status] + '20' }]}>
                            <AppText size="xs" weight="bold" style={{ color: statusColors[request.status] }}>{request.status}</AppText>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.infoRow}>
                        <Icon name="calendar-outline" size={20} color={theme.colors.primary[600]} />
                        <View style={styles.infoTextContainer}>
                            <AppText size="xs" color={theme.colors.text.secondary}>Duration</AppText>
                            <AppText weight="medium">
                                {request.startDate} {request.endDate !== request.startDate ? ` to ${request.endDate}` : ''}
                                {request.isHalfDay ? ' (Half Day)' : ''}
                            </AppText>
                        </View>
                    </View>

                    <View style={styles.infoRow}>
                        <Icon name="chatbubble-outline" size={20} color={theme.colors.primary[600]} />
                        <View style={styles.infoTextContainer}>
                            <AppText size="xs" color={theme.colors.text.secondary}>Reason</AppText>
                            <AppText>{request.reason}</AppText>
                        </View>
                    </View>

                    {request.status === 'APPROVED' || request.status === 'REJECTED' ? (
                        <View style={styles.approvalSection}>
                            <View style={styles.divider} />
                            <View style={styles.infoRow}>
                                <Icon name="person-outline" size={20} color={theme.colors.text.tertiary} />
                                <View style={styles.infoTextContainer}>
                                    <AppText size="xs" color={theme.colors.text.secondary}>Approver Comments</AppText>
                                    <AppText style={styles.approverComments}>{request.approverComments || 'No comments.'}</AppText>
                                </View>
                            </View>
                        </View>
                    ) : null}
                </View>

                {request.status === 'PENDING' && (
                    <View style={styles.actionContainer}>
                        <AppButton
                            title="Cancel Application"
                            variant="outline"
                            onPress={handleCancel}
                            isLoading={isLoading}
                        />
                    </View>
                )}
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
    card: {
        backgroundColor: theme.colors.surface.card,
        borderRadius: theme.radius.l,
        padding: theme.spacing.l,
        ...theme.shadows.md,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    statusBadge: {
        paddingHorizontal: theme.spacing.s,
        paddingVertical: 4,
        borderRadius: theme.radius.full,
    },
    divider: {
        height: 1,
        backgroundColor: theme.colors.border.soft,
        marginVertical: theme.spacing.l,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: theme.spacing.l,
    },
    infoTextContainer: {
        marginLeft: theme.spacing.m,
        flex: 1,
    },
    approverComments: {
        color: theme.colors.text.primary,
        fontStyle: 'italic',
    },
    actionContainer: {
        marginTop: theme.spacing.xl,
    },
    approvalSection: {
        marginTop: theme.spacing.s,
    }
});
