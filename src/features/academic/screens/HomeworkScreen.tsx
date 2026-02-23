import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, FlatList, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScreenWrapper } from '../../../components/layout/ScreenWrapper';
import { AppText } from '../../../components/ui/AppText';
import { theme } from '../../../theme/tokens';
import { Icon } from '../../../components/ui/Icon';
import { useHomeworkStore } from '../store/homeworkStore';

export const HomeworkScreen = () => {
    const navigation = useNavigation<any>();
    const { homeworkItems, isLoading, fetchHomework } = useHomeworkStore();
    const [filter, setFilter] = useState<'pending' | 'checked'>('pending');

    useEffect(() => {
        fetchHomework();
    }, []);

    const renderItem = ({ item }: { item: any }) => (
        <TouchableOpacity
            style={styles.card}
            activeOpacity={0.8}
            onPress={() => {
                // navigation.navigate('HomeworkDetail', { homeworkId: item.id });
            }}
        >
            <View style={styles.cardHeader}>
                <View style={styles.subjectBadge}>
                    <AppText size="xs" weight="bold" color={theme.colors.primary[600]}>
                        {item.subject?.name || 'Subject'}
                    </AppText>
                </View>
                <AppText size="xs" color={theme.colors.text.tertiary}>
                    {item.dueDate ? new Date(item.dueDate).toLocaleDateString() : 'No Date'}
                </AppText>
            </View>

            <AppText size="l" weight="bold" style={{ marginTop: 8 }}>{item.title}</AppText>
            <AppText size="s" color={theme.colors.text.secondary} style={{ marginTop: 2 }}>
                {item.studentClass?.name || 'Class'}
            </AppText>

            <View style={styles.cardFooter}>
                <View style={[
                    styles.statusCtx,
                    { backgroundColor: theme.colors.status.warning + '15' }
                ]}>
                    <AppText size="xs" weight="bold" color={theme.colors.status.warning}>
                        PENDING
                    </AppText>
                </View>
                <Icon name="chevron-right" size={20} color={theme.colors.text.tertiary} library="feather" />
            </View>
        </TouchableOpacity>
    );

    return (
        <ScreenWrapper title="Homework" showBack headerNoBorder headerAlign="left" headerSize="xxl">
            <View style={styles.filterContainer}>
                <TouchableOpacity onPress={() => setFilter('pending')} style={[styles.filterChip, filter === 'pending' && styles.activeChip]}>
                    <AppText weight="medium" color={filter === 'pending' ? '#FFF' : theme.colors.text.secondary}>Active</AppText>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setFilter('checked')} style={[styles.filterChip, filter === 'checked' && styles.activeChip]}>
                    <AppText weight="medium" color={filter === 'checked' ? '#FFF' : theme.colors.text.secondary}>Past</AppText>
                </TouchableOpacity>
            </View>

            <FlatList
                data={homeworkItems}
                renderItem={renderItem}
                keyExtractor={item => item.id?.toString() || Math.random().toString()}
                contentContainerStyle={styles.listContent}
                refreshControl={
                    <RefreshControl refreshing={isLoading} onRefresh={fetchHomework} tintColor={theme.colors.primary[600]} />
                }
                ListEmptyComponent={
                    isLoading ? null : (
                        <View style={{ padding: 40, alignItems: 'center' }}>
                            <AppText color={theme.colors.text.secondary}>No homework found.</AppText>
                        </View>
                    )
                }
            />

            <TouchableOpacity
                style={styles.fab}
                activeOpacity={0.9}
                onPress={() => navigation.navigate('CreateHomework')}
            >
                <Icon name="plus" size={24} color="#FFF" library="feather" />
            </TouchableOpacity>
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    filterContainer: {
        flexDirection: 'row',
        paddingHorizontal: theme.spacing.xl,
        marginBottom: 16,
    },
    filterChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#FFF',
        marginRight: 8,
        borderWidth: 1,
        borderColor: theme.colors.border.soft,
    },
    activeChip: {
        backgroundColor: theme.colors.text.primary,
        borderColor: theme.colors.text.primary,
    },
    listContent: {
        paddingHorizontal: theme.spacing.xl,
        paddingBottom: 100,
    },
    card: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        ...theme.shadows.sm,
        borderWidth: 1,
        borderColor: theme.colors.border.soft,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    subjectBadge: {
        backgroundColor: theme.colors.primary[50],
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    progressContainer: {
        height: 6,
        backgroundColor: theme.colors.surface.app,
        borderRadius: 3,
        marginTop: 12,
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
        backgroundColor: theme.colors.primary[600],
        borderRadius: 3,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 16,
    },
    statusCtx: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    fab: {
        position: 'absolute',
        bottom: 32,
        right: 24,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: theme.colors.primary[600],
        justifyContent: 'center',
        alignItems: 'center',
        ...theme.shadows.md,
        elevation: 6,
    },
});
