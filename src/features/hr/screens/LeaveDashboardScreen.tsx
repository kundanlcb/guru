import React, { useEffect } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    FlatList,
    RefreshControl,
    ActivityIndicator
} from 'react-native';
import { AppHeader } from '../../../components/ui/AppHeader';
import { AppText } from '../../../components/ui/AppText';
import { theme } from '../../../theme/tokens';
import { useLeaveStore } from '../store/leaveStore';
import { useNavigation } from '@react-navigation/native';
import { Icon } from '../../../components/ui/Icon';
import { LeaveRequest, LeaveBalance } from '../types';

export const LeaveDashboardScreen = () => {
    const navigation = useNavigation<any>();
    const {
        leaveTypes,
        balances,
        myRequests,
        isLoading,
        fetchInitialData,
        fetchMyRequests
    } = useLeaveStore();

    useEffect(() => {
        fetchInitialData();
        fetchMyRequests();
    }, []);

    const onRefresh = () => {
        fetchInitialData();
        fetchMyRequests();
    };

    const renderBalanceItem = ({ item }: { item: LeaveBalance }) => (
        <View style={styles.balanceCard}>
            <AppText size="xs" color={theme.colors.text.secondary}>{item.leaveType.name}</AppText>
            <View style={styles.balanceRow}>
                <AppText style={styles.balanceValue}>{item.balance}</AppText>
                <AppText size="xs" color={theme.colors.text.tertiary} style={{ alignSelf: 'flex-end', marginBottom: 4 }}> / {item.totalGranted}</AppText>
            </View>
            <AppText size="xs" style={{ color: theme.colors.primary[600] }}>Days Left</AppText>
        </View>
    );

    const renderRequestItem = ({ item }: { item: LeaveRequest }) => {
        const statusColors = {
            PENDING: theme.colors.status.warning,
            APPROVED: theme.colors.status.success,
            REJECTED: theme.colors.status.danger,
            CANCELLED: theme.colors.text.tertiary,
        };

        return (
            <TouchableOpacity
                style={styles.requestItem}
                onPress={() => navigation.navigate('LeaveDetails', { request: item })}
            >
                <View style={styles.requestHeader}>
                    <AppText weight="medium">{item.leaveType.name}</AppText>
                    <View style={[styles.statusBadge, { backgroundColor: statusColors[item.status] + '20' }]}>
                        <AppText size="xs" weight="bold" style={{ color: statusColors[item.status] }}>{item.status}</AppText>
                    </View>
                </View>
                <View style={styles.requestMeta}>
                    <Icon name="calendar-outline" size={14} color={theme.colors.text.tertiary} />
                    <AppText size="xs" color={theme.colors.text.secondary} style={styles.metaText}>
                        {item.startDate} {item.endDate !== item.startDate ? ` - ${item.endDate}` : ''}
                    </AppText>
                    {item.isHalfDay && (
                        <AppText size="xs" weight="medium" style={styles.halfDayTag}>Half Day</AppText>
                    )}
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <AppHeader
                title="Leave Management"
                showBack
                onBackPress={() => navigation.goBack()}
                rightIcon="add-outline"
                onRightPress={() => navigation.navigate('ApplyLeave')}
            />

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl refreshing={isLoading} onRefresh={onRefresh} tintColor={theme.colors.primary[600]} />
                }
            >
                <View style={styles.section}>
                    <AppText size="s" weight="bold" style={styles.sectionTitle}>Leave Balances</AppText>
                    <FlatList
                        data={balances}
                        renderItem={renderBalanceItem}
                        keyExtractor={(item) => item.id.toString()}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.balanceList}
                        ListEmptyComponent={
                            !isLoading ? <AppText size="xs" color={theme.colors.text.tertiary}>No balances found.</AppText> : null
                        }
                    />
                </View>

                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <AppText size="s" weight="bold" style={styles.sectionTitle}>My Applications</AppText>
                    </View>

                    {myRequests.length === 0 ? (
                        <View style={styles.emptyState}>
                            <Icon name="document-text-outline" size={48} color={theme.colors.text.tertiary} />
                            <AppText color="secondary" style={styles.emptyText}>No leave applications yet.</AppText>
                        </View>
                    ) : (
                        myRequests.map((request) => (
                            <React.Fragment key={request.id}>
                                {renderRequestItem({ item: request })}
                            </React.Fragment>
                        ))
                    )}
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
    section: {
        marginBottom: theme.spacing.xl,
    },
    sectionTitle: {
        marginBottom: theme.spacing.m,
    },
    sectionHeader: {
        marginBottom: theme.spacing.s,
    },
    balanceList: {
        paddingRight: theme.spacing.l,
    },
    balanceCard: {
        backgroundColor: theme.colors.surface.card,
        borderRadius: theme.radius.m,
        padding: theme.spacing.m,
        marginRight: theme.spacing.m,
        width: 140,
        ...theme.shadows.sm,
    },
    balanceRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        marginVertical: theme.spacing.xs,
    },
    balanceValue: {
        fontSize: 24,
        fontWeight: '700',
        color: theme.colors.text.primary,
    },
    requestItem: {
        backgroundColor: theme.colors.surface.card,
        borderRadius: theme.radius.m,
        padding: theme.spacing.l,
        marginBottom: theme.spacing.m,
        ...theme.shadows.sm,
    },
    requestHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.s,
    },
    statusBadge: {
        paddingHorizontal: theme.spacing.s,
        paddingVertical: 2,
        borderRadius: theme.radius.full,
    },
    statusText: {
        fontSize: 10,
        fontWeight: '700',
    },
    requestMeta: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    metaText: {
        marginLeft: theme.spacing.xs,
    },
    halfDayTag: {
        marginLeft: theme.spacing.s,
        color: theme.colors.status.warning,
        fontWeight: '600',
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: theme.spacing.3xl,
    },
    emptyText: {
        marginTop: theme.spacing.s,
    }
});
