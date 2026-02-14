import React from 'react';
import { TouchableOpacity, TouchableOpacityProps, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { AppText } from './AppText';
import { theme } from '../../theme';

interface AppButtonProps extends TouchableOpacityProps {
    title: string;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    isLoading?: boolean;
    textStyle?: TextStyle;
}

export const AppButton: React.FC<AppButtonProps> = ({
    title,
    variant = 'primary',
    isLoading = false,
    style,
    textStyle,
    disabled,
    ...props
}) => {
    const getBackgroundColor = () => {
        if (disabled) return theme.colors.border.default;
        switch (variant) {
            case 'primary': return theme.colors.primary[600];
            case 'secondary': return theme.colors.primary[100];
            case 'outline': return 'transparent';
            case 'ghost': return 'transparent';
            default: return theme.colors.primary[600];
        }
    };

    const getTextColor = () => {
        if (disabled) return theme.colors.text.tertiary;
        switch (variant) {
            case 'primary': return theme.colors.text.inverse;
            case 'secondary': return theme.colors.primary[600];
            case 'outline': return theme.colors.primary[600];
            case 'ghost': return theme.colors.primary[600];
            default: return theme.colors.text.inverse;
        }
    };

    const containerStyle: ViewStyle = {
        backgroundColor: getBackgroundColor(),
        borderWidth: variant === 'outline' ? 1 : 0,
        borderColor: variant === 'outline' ? theme.colors.primary[600] : undefined,
    };

    return (
        <TouchableOpacity
            style={[styles.container, containerStyle, style]}
            disabled={disabled || isLoading}
            activeOpacity={0.8}
            {...props}
        >
            {isLoading ? (
                <ActivityIndicator color={getTextColor()} />
            ) : (
                <AppText weight="bold" color={getTextColor()} style={textStyle}>
                    {title}
                </AppText>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 48,
        borderRadius: theme.radius.m,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: theme.spacing.l,
        width: '100%',
    },
});
