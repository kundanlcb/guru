import React from 'react';
import { Text, TextProps, StyleSheet, TextStyle } from 'react-native';
import { theme } from '../../theme';

interface AppTextProps extends TextProps {
    children: React.ReactNode;
    size?: keyof typeof theme.typography.size;
    weight?: keyof typeof theme.typography.weight;
    color?: string;
    align?: 'auto' | 'left' | 'right' | 'center' | 'justify';
}

export const AppText: React.FC<AppTextProps> = ({
    children,
    size = 'm',
    weight = 'regular',
    color = theme.colors.text.primary,
    align,
    style,
    ...props
}) => {
    const textStyle: TextStyle = {
        fontSize: theme.typography.size[size],
        fontWeight: theme.typography.weight[weight],
        color: color,
        textAlign: align,
    };

    return (
        <Text style={[styles.text, textStyle, style]} {...props}>
            {children}
        </Text>
    );
};

const styles = StyleSheet.create({
    text: {
        // Default font family can be set here if we add custom fonts later
    },
});
