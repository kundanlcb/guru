import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScreenWrapper } from '../../../components/layout/ScreenWrapper';
import { AppText } from '../../../components/ui/AppText';
import { Icon } from '../../../components/ui/Icon';
import { useAuthStore } from '../../auth/store';
import { theme } from '../../../theme/tokens';

const MENU_ITEMS = [
    { id: '1', title: 'Start a class', icon: 'play-circle' },
    { id: '2', title: 'Attendance', icon: 'clipboard' },
    { id: '3', title: 'Settings', icon: 'settings' },
    { id: '4', title: 'Payslip', icon: 'file-text' },
    { id: '5', title: 'Help Center', icon: 'help-circle' },
    { id: '6', title: 'Privacy Policy', icon: 'shield' },
];

export const ProfileScreen = () => {
    const { logout, user } = useAuthStore();
    const navigation = useNavigation<any>();

    return (
        <ScreenWrapper
            title="Profile"
            showBack={true}
            scrollable
            contentContainerStyle={{ paddingBottom: 100 }}
            headerAlign="left"
            headerSize="xxl"
            headerNoBorder
        >
            <View style={styles.profileInfoSection}>
                <View style={styles.avatarContainer}>
                    <Image
                        source={{ uri: 'https://ui-avatars.com/api/?name=Priya+Sharma&background=random&size=200' }}
                        style={styles.avatar}
                    />
                    <View style={styles.editBadge}>
                        <Icon name="edit-2" library="feather" size={12} color="#FFF" />
                    </View>
                </View>
                <View style={styles.infoContainer}>
                    <AppText size="l" weight="bold" style={styles.name}>{user?.name || 'Priya Sharma'}</AppText>
                    <AppText size="s" color={theme.colors.text.secondary} style={{ marginBottom: 4 }}>Senior Teacher</AppText>
                    <AppText size="s" color={theme.colors.text.tertiary}>Mathematics • Class 10</AppText>
                </View>
            </View>

            <View style={styles.statsRow}>
                <View style={styles.statItem}>
                    <View style={[styles.statIconBox, { backgroundColor: theme.colors.status.info + '20' }]}>
                        <Icon name="book-open" library="feather" size={20} color={theme.colors.status.info} />
                    </View>
                    <AppText size="l" weight="bold" color={theme.colors.text.primary} style={{ marginTop: 4 }}>5</AppText>
                    <AppText size="xs" color={theme.colors.text.secondary}>Classes</AppText>
                </View>
                <View style={styles.divider} />
                <View style={styles.statItem}>
                    <View style={[styles.statIconBox, { backgroundColor: theme.colors.primary[100] }]}>
                        <Icon name="users" library="feather" size={20} color={theme.colors.primary[600]} />
                    </View>
                    <AppText size="l" weight="bold" color={theme.colors.text.primary} style={{ marginTop: 4 }}>140</AppText>
                    <AppText size="xs" color={theme.colors.text.secondary}>Students</AppText>
                </View>
                <View style={styles.divider} />
                <View style={styles.statItem}>
                    <View style={[styles.statIconBox, { backgroundColor: theme.colors.status.success + '20' }]}>
                        <Icon name="check-circle" library="feather" size={20} color={theme.colors.status.success} />
                    </View>
                    <AppText size="l" weight="bold" color={theme.colors.text.primary} style={{ marginTop: 4 }}>98%</AppText>
                    <AppText size="xs" color={theme.colors.text.secondary}>Present</AppText>
                </View>
            </View>

            <View style={styles.menuContainer}>
                {MENU_ITEMS.map((item) => (
                    <TouchableOpacity
                        key={item.id}
                        style={styles.menuItem}
                        onPress={() => {
                            if (item.title === 'Attendance') {
                                navigation.navigate('Attendance');
                            }
                            // Add other navigation handlers as needed
                        }}
                    >
                        <View style={styles.menuIconBox}>
                            <Icon name={item.icon} library="feather" size={20} color={theme.colors.text.primary} />
                        </View>
                        <AppText size="m" style={styles.menuText}>{item.title}</AppText>
                        <Icon name="chevron-right" library="feather" size={20} color={theme.colors.text.tertiary} />
                    </TouchableOpacity>
                ))}

                <TouchableOpacity style={styles.menuItem} onPress={() => {
                    logout();
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'Auth' }], // Assuming Auth is the stack name
                    });
                }}>
                    <View style={[styles.menuIconBox, { backgroundColor: theme.colors.status.danger + '10' }]}>
                        <Icon name="log-out" library="feather" size={20} color={theme.colors.status.danger} />
                    </View>
                    <AppText size="m" style={[styles.menuText, { color: theme.colors.status.danger }]}>Logout</AppText>
                </TouchableOpacity>
            </View>

            <View style={styles.footer}>
                <AppText size="xs" color={theme.colors.text.tertiary} align="center" style={{ marginTop: 16 }}>
                    Version 1.0.0
                </AppText>
            </View>
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    profileInfoSection: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: theme.spacing.l,
        paddingHorizontal: theme.spacing.l,
    },
    avatarContainer: {
        position: 'relative',
        marginRight: theme.spacing.l,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 3,
        borderColor: '#FFF', // Using white for border as per design usually
    },
    editBadge: {
        position: 'absolute',
        bottom: 0,
        right: -4,
        backgroundColor: theme.colors.primary[600],
        width: 24,
        height: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#FFF',
    },
    infoContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    name: {
        marginBottom: 2,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        backgroundColor: '#FFF',
        marginHorizontal: theme.spacing.l,
        padding: theme.spacing.l,
        borderRadius: 16,
        marginBottom: theme.spacing.xl,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
        borderWidth: 1,
        borderColor: theme.colors.border.soft,
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
    },
    statIconBox: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 4,
    },
    divider: {
        width: 1,
        height: 40,
        backgroundColor: theme.colors.border.soft,
        marginHorizontal: 4,
        alignSelf: 'center',
    },
    menuContainer: {
        paddingHorizontal: theme.spacing.l,
        marginBottom: theme.spacing.xl,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: theme.spacing.m,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border.soft,
    },
    menuIconBox: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: theme.colors.surface.app, // using surface.app (light grey)
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: theme.spacing.m,
    },
    menuText: {
        flex: 1,
        fontWeight: '500', // Medium weight
        color: theme.colors.text.primary,
    },
    footer: {
        paddingHorizontal: theme.spacing.l,
    },
});
