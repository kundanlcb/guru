import React from 'react';
import {
    View,
    StyleSheet,
    StatusBar,
    ScrollView,
    ViewProps,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../../theme/tokens';
import { AppHeader } from '../ui/AppHeader';

interface ScreenWrapperProps extends ViewProps {
    children: React.ReactNode;
    scrollable?: boolean;
    contentContainerStyle?: ViewProps['style'];
    isLoading?: boolean;
    title?: string;
    showBack?: boolean;
    headerRight?: React.ReactNode;
    headerAlign?: 'center' | 'left';
    headerSize?: 'l' | 'xl' | 'xxl';
    headerNoBorder?: boolean;
    backgroundColor?: string;
    statusBarColor?: string;
    statusBarStyle?: 'default' | 'light-content' | 'dark-content';
}

export const ScreenWrapper: React.FC<ScreenWrapperProps> = ({
    children,
    scrollable = false,
    style,
    contentContainerStyle,
    isLoading = false,
    title,
    showBack,
    headerRight,
    headerAlign,
    headerSize,
    headerNoBorder,
    backgroundColor = theme.colors.surface.background,
    statusBarColor = theme.colors.surface.default,
    statusBarStyle = 'dark-content',
    ...props
}) => {
    const ContentWrapper = scrollable ? ScrollView : View;
    // Cast ScrollView to any to avoid strict type mismatch with ViewProps
    const WrapperComponent = ContentWrapper as any;

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor }]} edges={['top', 'left', 'right']}>
            <StatusBar
                backgroundColor={statusBarColor}
                barStyle={statusBarStyle}
            />

            {title && (
                <AppHeader
                    title={title}
                    showBack={showBack}
                    rightElement={headerRight}
                    align={headerAlign}
                    size={headerSize}
                    noBorder={headerNoBorder}
                />
            )}

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={styles.flex}
            >
                <WrapperComponent
                    style={[styles.container, style]}
                    contentContainerStyle={[
                        scrollable && styles.scrollContent,
                        contentContainerStyle,
                    ]}
                    {...props}
                >
                    {children}
                </WrapperComponent>
            </KeyboardAvoidingView>

            {isLoading && (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="large" color={theme.colors.primary[600]} />
                </View>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: theme.colors.surface.background,
    },
    flex: {
        flex: 1,
    },
    container: {
        flex: 1,
        backgroundColor: theme.colors.surface.background,
    },
    scrollContent: {
        flexGrow: 1,
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
});
