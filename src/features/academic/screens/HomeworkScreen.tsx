import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { ScreenWrapper } from '../../../components/layout/ScreenWrapper';
import { AppText } from '../../../components/ui/AppText';
import { theme } from '../../../theme/tokens';
import { Icon } from '../../../components/ui/Icon';
import { AppButton } from '../../../components/ui/AppButton';

// Mock Data
const HOMEWORK_DATA = [
    { id: '1', class: '10-A', subject: 'Mathematics', title: 'Algebra Exercises', dueDate: '15 Feb', status: 'pending', submissions: 12, total: 40 },
    { id: '2', class: '9-B', subject: 'Physics', title: 'Chapter 3: Motion', dueDate: '16 Feb', status: 'checked', submissions: 38, total: 38 },
    { id: '3', class: '11-C', subject: 'Math', title: 'Trigonometry', dueDate: '18 Feb', status: 'pending', submissions: 5, total: 35 },
];

export const HomeworkScreen = () => {
    // const navigation = useNavigation(); // Will use for Create/Detail
    const [filter, setFilter] = useState<'pending' | 'checked'>('pending');

    const renderItem = ({ item }: { item: any }) => (
        <TouchableOpacity style={styles.card} activeOpacity={0.8}>
            <View style={styles.cardHeader}>
                <View style={styles.subjectBadge}>
                    <AppText size="xs" weight="bold" color={theme.colors.primary[600]}>{item.subject}</AppText>
                </View>
                <AppText size="xs" color={theme.colors.text.tertiary}>{item.dueDate}</AppText>
            </View>

            <AppText size="l" weight="bold" style={{ marginTop: 8 }}>{item.title}</AppText>
            <AppText size="s" color={theme.colors.text.secondary} style={{ marginTop: 2 }}>{item.class} • {item.submissions}/{item.total} Submitted</AppText>

            <View style={styles.progressContainer}>
                <View style={[styles.progressBar, { width: `${(item.submissions / item.total) * 100}%` }]} />
            </View>

            <View style={styles.cardFooter}>
                <View style={[styles.statusCtx, { backgroundColor: item.status === 'checked' ? theme.colors.status.success + '15' : theme.colors.status.warning + '15' }]}>
                    <AppText size="xs" weight="bold" color={item.status === 'checked' ? theme.colors.status.success : theme.colors.status.warning}>
                        {item.status.toUpperCase()}
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
                    <AppText weight="medium" color={filter === 'pending' ? '#FFF' : theme.colors.text.secondary}>Pending</AppText>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setFilter('checked')} style={[styles.filterChip, filter === 'checked' && styles.activeChip]}>
                    <AppText weight="medium" color={filter === 'checked' ? '#FFF' : theme.colors.text.secondary}>Checked</AppText>
                </TouchableOpacity>
            </View>

            <FlatList
                data={HOMEWORK_DATA.filter(i => i.status === filter)}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
            />

            <TouchableOpacity style={styles.fab} activeOpacity={0.9}>
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
