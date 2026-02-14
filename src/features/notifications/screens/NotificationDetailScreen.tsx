import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { ScreenWrapper } from '../../../components/layout/ScreenWrapper';
import { AppText } from '../../../components/ui/AppText';
import { Icon } from '../../../components/ui/Icon';
import { theme } from '../../../theme/tokens';

export const NotificationDetailScreen = () => {
    const route = useRoute<any>();
    const { notification } = route.params;

    let iconName = 'info';
    let iconColor: string = theme.colors.status.info;
    let iconBg: string = theme.colors.status.info + '20';

    if (notification.type === 'academic') {
        iconName = 'book';
        iconColor = theme.colors.primary[600];
        iconBg = theme.colors.primary[100];
    } else if (notification.type === 'finance') {
        iconName = 'dollar-sign';
        iconColor = theme.colors.status.success;
        iconBg = theme.colors.status.success + '20';
    } else if (notification.type === 'system') {
        iconName = 'bell';
        iconColor = theme.colors.status.warning;
        iconBg = theme.colors.status.warning + '20';
    }

    return (
        <ScreenWrapper
            title="Details"
            showBack={true}
            headerAlign="left"
            headerSize="l"
            headerNoBorder
        >
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.header}>
                    <View style={styles.titleRow}>
                        <View style={[styles.iconBox, { backgroundColor: iconBg }]}>
                            <Icon name={iconName} size={24} color={iconColor} library="feather" />
                        </View>
                        <View style={styles.metaContainer}>
                            <AppText size="xs" weight="bold" color={iconColor} style={{ marginBottom: 2 }}>
                                {notification.type.toUpperCase()}
                            </AppText>
                            <AppText size="xs" color={theme.colors.text.tertiary}>
                                {notification.time}
                            </AppText>
                        </View>
                    </View>

                    <AppText size="xxl" weight="bold" color={theme.colors.text.primary} style={{ marginTop: 16, lineHeight: 32 }}>
                        {notification.title}
                    </AppText>
                </View>

                <View style={styles.divider} />

                <View style={styles.content}>
                    <AppText size="m" color={theme.colors.text.secondary} style={{ lineHeight: 24 }}>
                        {notification.description}
                    </AppText>

                    {/* Attachment Section */}
                    {notification.type === 'academic' && (
                        <TouchableOpacity style={styles.attachmentBox}>
                            <View style={[styles.attachmentIcon, { backgroundColor: theme.colors.primary[100] }]}>
                                <Icon name="file-text" size={20} color={theme.colors.primary[600]} library="feather" />
                            </View>
                            <View>
                                <AppText size="m" weight="bold" color={theme.colors.text.primary}>
                                    Attachment.pdf
                                </AppText>
                                <AppText size="s" color={theme.colors.text.tertiary}>
                                    2.4 MB
                                </AppText>
                            </View>
                            <View style={{ flex: 1 }} />
                            <Icon name="download" size={20} color={theme.colors.text.tertiary} library="feather" />
                        </TouchableOpacity>
                    )}
                </View>

            </ScrollView>
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: theme.spacing.xl,
    },
    header: {
        marginBottom: 24,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconBox: {
        width: 48,
        height: 48,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    metaContainer: {
        justifyContent: 'center',
    },
    divider: {
        height: 1,
        backgroundColor: theme.colors.border.soft,
        marginBottom: 24,
    },
    content: {
        gap: 16,
    },
    attachmentBox: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        backgroundColor: theme.colors.surface.default,
        borderRadius: 12,
        marginTop: 24,
        borderWidth: 1,
        borderColor: theme.colors.border.soft,
    },
    attachmentIcon: {
        width: 40,
        height: 40,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    }
});
