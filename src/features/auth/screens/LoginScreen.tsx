import React, { useState } from 'react';
import { View, StyleSheet, Alert, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScreenWrapper } from '../../../components/layout/ScreenWrapper';
import { AppText } from '../../../components/ui/AppText';
import { AppButton } from '../../../components/ui/AppButton';
import { useAuthStore } from '../store';
import { theme } from '../../../theme/tokens';
import Feather from 'react-native-vector-icons/Feather';

export const LoginScreen = () => {
    const navigation = useNavigation<any>();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [validationError, setValidationError] = useState('');
    const [focusedField, setFocusedField] = useState<'email' | 'password' | null>(null);

    const { login, isLoading } = useAuthStore();

    const handleLogin = async () => {
        if (!email || !password) {
            setValidationError('Please enter both email and password');
            return;
        }
        setValidationError('');

        try {
            await login(email, password);
            navigation.reset({
                index: 0,
                routes: [{ name: 'Home' }],
            });
        } catch (e: any) {
            Alert.alert('Error', e.message || 'Login failed');
        }
    };

    return (
        <ScreenWrapper style={styles.container}>
            <View style={styles.content}>
                <View style={styles.header}>
                    <View style={styles.logoPlaceholder}>
                        <Feather name="book-open" size={40} color={theme.colors.primary[600]} />
                    </View>
                    <AppText size="xxl" weight="bold" align="center" style={styles.title}>
                        Welcome to Guru
                    </AppText>
                    <AppText size="m" color={theme.colors.text.secondary} align="center" style={styles.subtitle}>
                        Sign in to your teacher account
                    </AppText>
                </View>

                <View style={styles.form}>
                    {/* Email Input */}
                    <View style={[
                        styles.inputContainer,
                        focusedField === 'email' && styles.inputFocused,
                        !!validationError && !email && styles.inputError
                    ]}>
                        <View style={styles.iconContainer}>
                            <Feather
                                name="mail"
                                size={20}
                                color={focusedField === 'email' ? theme.colors.primary[600] : theme.colors.text.tertiary}
                            />
                        </View>
                        <TextInput
                            style={styles.input}
                            placeholder="Email Address"
                            placeholderTextColor={theme.colors.text.tertiary}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            value={email}
                            onChangeText={(text) => {
                                setEmail(text);
                                if (validationError) setValidationError('');
                            }}
                            onFocus={() => setFocusedField('email')}
                            onBlur={() => setFocusedField(null)}
                        />
                    </View>

                    {/* Password Input */}
                    <View style={[
                        styles.inputContainer,
                        focusedField === 'password' && styles.inputFocused,
                        !!validationError && !password && styles.inputError
                    ]}>
                        <View style={styles.iconContainer}>
                            <Feather
                                name="lock"
                                size={20}
                                color={focusedField === 'password' ? theme.colors.primary[600] : theme.colors.text.tertiary}
                            />
                        </View>
                        <TextInput
                            style={styles.input}
                            placeholder="Password"
                            placeholderTextColor={theme.colors.text.tertiary}
                            secureTextEntry
                            value={password}
                            onChangeText={(text) => {
                                setPassword(text);
                                if (validationError) setValidationError('');
                            }}
                            onFocus={() => setFocusedField('password')}
                            onBlur={() => setFocusedField(null)}
                        />
                    </View>

                    {validationError ? (
                        <AppText size="xs" color={theme.colors.status.danger} style={styles.errorText}>
                            {validationError}
                        </AppText>
                    ) : null}

                    <AppButton
                        title="Sign In"
                        onPress={handleLogin}
                        isLoading={isLoading}
                        variant="primary"
                        disabled={isLoading}
                        style={styles.button}
                    />
                </View>
            </View>
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: theme.colors.surface.card,
    },
    content: {
        flex: 1,
        padding: theme.spacing.xl,
        justifyContent: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: theme.spacing.xxl,
    },
    logoPlaceholder: {
        width: 80,
        height: 80,
        backgroundColor: theme.colors.primary[50], // Soft purple bg, simpler
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: theme.spacing.xl,
    },
    title: {
        marginBottom: theme.spacing.xs,
        color: theme.colors.text.primary,
    },
    subtitle: {
        paddingHorizontal: theme.spacing.l,
        opacity: 0.8,
    },
    form: {
        marginBottom: theme.spacing.xxl,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.surface.app,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'transparent',
        paddingHorizontal: theme.spacing.l,
        height: 56,
        marginBottom: theme.spacing.s,
    },
    inputFocused: {
        borderColor: theme.colors.primary[600],
        backgroundColor: theme.colors.surface.card,
    },
    inputError: {
        borderColor: theme.colors.status.danger,
    },
    iconContainer: {
        marginRight: theme.spacing.s,
        width: 24,
        alignItems: 'center',
    },
    prefix: {
        fontSize: theme.typography.size.l,
        color: theme.colors.text.primary,
        fontWeight: '600',
    },
    verticalDivider: {
        width: 1,
        height: 20,
        backgroundColor: theme.colors.text.tertiary,
        opacity: 0.5,
        marginHorizontal: theme.spacing.m,
    },
    input: {
        flex: 1,
        fontSize: theme.typography.size.l,
        color: theme.colors.text.primary,
        fontFamily: theme.typography.fontFamily?.primary?.regular,
        height: '100%',
        letterSpacing: 0.5,
    },
    errorText: {
        marginBottom: theme.spacing.m,
        marginLeft: theme.spacing.xs,
    },
    button: {
        marginTop: theme.spacing.m,
        height: 56,
        borderRadius: 14,
        shadowColor: theme.colors.primary[600],
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    buttonVisualDisabled: {
        opacity: 0.5,
        shadowOpacity: 0.1,
        elevation: 1,
        backgroundColor: theme.colors.primary[600],
    }
});
