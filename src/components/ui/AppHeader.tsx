import React from 'react';
import { View, StyleSheet, TouchableOpacity, StyleProp, ViewStyle, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from './AppText';
import { Icon, IconLibrary, AppIcons } from './Icon';
import { theme } from '../../theme/tokens';

interface AppHeaderProps {
    title?: string;
    showBack?: boolean;
    onBackPress?: () => void;

    rightIcon?: string;
    rightIconLibrary?: IconLibrary;
    onRightPress?: () => void;
    rightBadge?: number;
    rightElement?: React.ReactNode;

    leftIcon?: string;
    leftIconLibrary?: IconLibrary;
    onLeftPress?: () => void;

    style?: StyleProp<ViewStyle>;
    transparent?: boolean;
    premium?: boolean;

    align?: 'center' | 'left';
    size?: 'l' | 'xl' | 'xxl';
    noBorder?: boolean;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
    title,
    showBack,
    onBackPress,
    rightIcon,
    rightIconLibrary = 'feather',
    onRightPress,
    rightBadge,
    rightElement,
    leftIcon,
    leftIconLibrary = 'feather',
    onLeftPress,
    style,
    transparent = false,
    premium = false,
    align = 'center',
    size = 'l',
    noBorder = false,
}) => {
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();

    const handleBack = () => {
        if (onBackPress) {
            onBackPress();
        } else if (navigation.canGoBack()) {
            navigation.goBack();
        }
    };

    const effectiveLeftIcon = leftIcon || (showBack ? AppIcons.back.name : undefined);
    const effectiveLeftLibrary = leftIcon ? leftIconLibrary : (showBack ? AppIcons.back.library : 'feather');
    const handleLeftPress = onLeftPress || (showBack ? handleBack : undefined);

    const containerStyle: any = [
        styles.container,
        { paddingTop: theme.spacing.s },
        transparent ? styles.transparent : (premium ? styles.premium : styles.default),
        noBorder && styles.noBorder,
        style,
    ];

    const contentColor = premium ? theme.colors.premium?.textTitle || '#B4922B' : theme.colors.text.primary;

    const titleSize = size === 'xxl' ? 24 : size === 'xl' ? 20 : 18;
    const titleWeight = size === 'xxl' ? 'bold' : 'bold';

    return (
        <View style={containerStyle}>
            <View style={[styles.leftSection, align === 'left' && styles.leftSectioncollapsed]}>
                {effectiveLeftIcon && (
                    <TouchableOpacity
                        onPress={handleLeftPress}
                        style={styles.iconButton}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <Icon
                            name={effectiveLeftIcon}
                            library={effectiveLeftLibrary}
                            size={24}
                            color={contentColor}
                        />
                    </TouchableOpacity>
                )}
            </View>

            <View style={[styles.titleSection, align === 'left' && styles.titleSectionLeft]}>
                {title && (
                    <AppText
                        size="l"
                        weight={titleWeight}
                        style={{
                            color: contentColor,
                            fontSize: titleSize,
                            textAlign: align,
                        }}
                        numberOfLines={1}
                        align={align}
                    >
                        {title}
                    </AppText>
                )}
            </View>

            <View style={styles.rightSection}>
                {rightElement ? (
                    rightElement
                ) : rightIcon && (
                    <TouchableOpacity
                        onPress={onRightPress}
                        style={styles.iconButton}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <View>
                            <Icon
                                name={rightIcon}
                                library={rightIconLibrary}
                                size={24}
                                color={contentColor}
                            />
                            {rightBadge && rightBadge > 0 ? (
                                <View style={[styles.badge, premium && styles.premiumBadge]}>
                                    <Text style={[
                                        styles.badgeText,
                                        premium && { color: theme.colors.premium?.badgeText || '#FFF' }
                                    ]}>
                                        {rightBadge > 99 ? '99+' : rightBadge}
                                    </Text>
                                </View>
                            ) : null}
                        </View>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.m,
        paddingBottom: theme.spacing.m,
        minHeight: 56,
    },
    default: {
        backgroundColor: theme.colors.surface.app,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border.soft,
    },
    noBorder: {
        borderBottomWidth: 0,
        elevation: 0,
        shadowOpacity: 0,
    },
    premium: {
        backgroundColor: theme.colors.premium?.background || '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.premium?.border || '#E0E0E0',
    },
    transparent: {
        backgroundColor: 'transparent',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
    },
    leftSection: {
        width: 48,
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    leftSectioncollapsed: {
        width: 'auto',
        marginRight: 8,
    },
    titleSection: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    titleSectionLeft: {
        alignItems: 'flex-start',
        paddingLeft: 0,
    },
    rightSection: {
        width: 48,
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    iconButton: {
        padding: 4,
    },
    badge: {
        position: 'absolute',
        top: -4,
        right: -4,
        backgroundColor: theme.colors.status?.danger || 'red',
        borderRadius: 10,
        minWidth: 16,
        height: 16,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 2,
        borderWidth: 1.5,
        borderColor: theme.colors.surface.card,
    },
    premiumBadge: {
        backgroundColor: theme.colors.premium?.badge || 'gold',
        borderColor: theme.colors.premium?.card || '#FFF',
    },
    badgeText: {
        color: '#FFF',
        fontSize: 8,
        fontWeight: 'bold',
    },
});
