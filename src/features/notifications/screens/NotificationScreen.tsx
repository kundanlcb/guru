import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScreenWrapper } from '../../../components/layout/ScreenWrapper';
import { AppText } from '../../../components/ui/AppText';
import { Icon } from '../../../components/ui/Icon';
import { theme } from '../../../theme/tokens';
import { useNoticeStore } from '../../academic/store/noticeStore';

const FILTERS = ['All', 'High', 'Medium', 'Low'];

export const NotificationScreen = () => {
    const navigation = useNavigation<any>();
    const { notices, isLoading, fetchNotices } = useNoticeStore();
    const [activeFilter, setActiveFilter] = useState('All');

    useEffect(() => {
        fetchNotices();
    }, []);

    const filteredNotifications = notices.filter(item => {
        if (activeFilter === 'All') return true;
        return item.priority === activeFilter.toUpperCase();
    });

    const renderItem = ({ item }: { item: any }) => {
        let iconName = 'bell';
        let iconColor: string = theme.colors.status.warning;
        let iconBg: string = theme.colors.status.warning + '20';

        if (item.priority === 'HIGH') {
            iconColor = theme.colors.status.danger;
            iconBg = theme.colors.status.danger + '20';
        } else if (item.priority === 'LOW') {
            iconColor = theme.colors.status.success;
            iconBg = theme.colors.status.success + '20';
        }

        return (
            <TouchableOpacity
                style={styles.notificationItem}
                onPress={() => Alert.alert(item.title, item.content)}
            >
                <View style={[styles.iconBox, { backgroundColor: iconBg }]}>
                    <Icon name={iconName} size={20} color={iconColor} library="feather" />
                </View>
                <View style={styles.contentBox}>
                    <View style={styles.headerRow}>
                        <AppText size="m" weight="bold" color={theme.colors.text.primary} style={{ flex: 1 }}>
                            {item.title}
                        </AppText>
                        <AppText size="xs" color={theme.colors.text.tertiary}>
                            {item.publishDate ? new Date(item.publishDate).toLocaleDateString() : ''}
                        </AppText>
                    </View>
                    <AppText size="s" color={theme.colors.text.secondary} numberOfLines={2} style={{ marginTop: 4 }}>
                        {item.content}
                    </AppText>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <ScreenWrapper
            title="Notifications"
            showBack={true}
            headerAlign="left"
            headerSize="l"
            headerNoBorder
        >
            <View style={styles.container}>
                {/* Filters Row with Create Button */}
                <View style={styles.topRow}>
                    <FlatList
                        horizontal
                        data={FILTERS}
                        keyExtractor={(item) => item}
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.filterList}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={[styles.filterChip, activeFilter === item && styles.activeFilterChip]}
                                onPress={() => setActiveFilter(item)}
                            >
                                <AppText
                                    size="s"
                                    weight="medium"
                                    color={activeFilter === item ? '#FFF' : theme.colors.text.secondary}
                                >
                                    {item}
                                </AppText>
                            </TouchableOpacity>
                        )}
                        style={{ flex: 1 }}
                    />

                    <TouchableOpacity
                        style={styles.createBtn}
                        onPress={() => navigation.navigate('CreateNotice')}
                    >
                        <Icon name="plus" size={20} color="#FFF" library="feather" />
                    </TouchableOpacity>
                </View>

                {/* Notification List */}
                <FlatList
                    data={filteredNotifications}
                    keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContent}
                    refreshControl={
                        <RefreshControl refreshing={isLoading} onRefresh={fetchNotices} />
                    }
                    ListEmptyComponent={
                        isLoading ? (
                            <ActivityIndicator size="large" color={theme.colors.primary[600]} style={{ marginTop: 50 }} />
                        ) : (
                            <View style={styles.emptyState}>
                                <Icon name="bell-off" size={48} color={theme.colors.text.disabled} library="feather" />
                                <AppText size="m" color={theme.colors.text.secondary} style={{ marginTop: 16 }}>
                                    No notices found
                                </AppText>
                            </View>
                        )
                    }
                />
            </View>
        </ScreenWrapper>
    );
};

import { Alert } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.surface.background,
    },
    topRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: theme.spacing.m,
        paddingRight: theme.spacing.l,
    },
    createBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: theme.colors.primary[600],
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 8,
    },
    filterContainer: {
        paddingVertical: theme.spacing.m,
    },
    filterList: {
        paddingHorizontal: theme.spacing.l,
        gap: 8,
    },
    filterChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: theme.colors.surface.default,
        borderWidth: 1,
        borderColor: theme.colors.border.soft,
    },
    activeFilterChip: {
        backgroundColor: theme.colors.primary[600],
        borderColor: theme.colors.primary[600],
    },
    listContent: {
        padding: theme.spacing.l,
        paddingTop: 0,
    },
    notificationItem: {
        flexDirection: 'row',
        padding: 16,
        backgroundColor: theme.colors.surface.default,
        borderRadius: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: theme.colors.border.soft,
    },
    unreadItem: {
        backgroundColor: theme.colors.primary[100] + '40', // Very subtle tint
        borderColor: theme.colors.primary[200],
    },
    iconBox: {
        width: 48,
        height: 48,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
        position: 'relative',
    },
    unreadDot: {
        position: 'absolute',
        top: -2,
        right: -2,
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: theme.colors.status.danger,
        borderWidth: 2,
        borderColor: theme.colors.surface.default,
    },
    contentBox: {
        flex: 1,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 100,
    }
});
