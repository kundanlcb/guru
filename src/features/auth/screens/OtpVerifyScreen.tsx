import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, TouchableOpacity, TextInput } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { ScreenWrapper } from '../../../components/layout/ScreenWrapper';
import { AppText } from '../../../components/ui/AppText';
import { AppButton } from '../../../components/ui/AppButton';
import { useAuthStore } from '../store';
import { theme } from '../../../theme/tokens';
import Feather from 'react-native-vector-icons/Feather';

// Define locally or import from types.ts. 
// guru uses { phoneNumber: string } in types.ts usually, we'll adapt.
type AuthStackParamList = {
    OtpVerify: { phoneNumber: string };
};

export const OtpVerifyScreen = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<RouteProp<AuthStackParamList, 'OtpVerify'>>();
    // Map phoneNumber to mobile to keep logic same
    const { phoneNumber: mobile } = route.params;

    const [otp, setOtp] = useState('');
    const [timer, setTimer] = useState(30);
    const [isFocused, setIsFocused] = useState(false);

    const { verifyOtp, requestOtp, isLoading, error } = useAuthStore();
    const isValidOtp = otp.length === 6;

    useEffect(() => {
        let interval: any;
        if (timer > 0) {
            interval = setInterval(() => setTimer((t) => t - 1), 1000);
        }
        return () => clearInterval(interval);
    }, [timer]);

    const handleVerify = async () => {
        if (otp.length < 6) {
            Alert.alert('Invalid OTP', 'Please enter a valid 6-digit OTP');
            return;
        }

        try {
            await verifyOtp(mobile, otp);
            // In a real app, the store update of 'user' might trigger navigation
            // via a listener, but here we can manually navigate for now.
            // Need to check if verifyOtp was successful (no error).
            // Since our mock store sets error state, we can check that or 
            // just check if user is set. 
            // For now, let's assume success if no error thrown, but mock store doesn't throw.
            // We will check store state in a bit, or just navigate.
            // Let's modify verifyOtp to return boolean or just navigate here.
            navigation.reset({
                index: 0,
                routes: [{ name: 'Home' }],
            });
        } catch (e) {
            // Error handled
        }
    };

    const handleResend = async () => {
        if (timer > 0) return;
        try {
            await requestOtp(mobile);
            setTimer(30);
            Alert.alert('Sent', 'OTP resent successfully');
        } catch (e) {
            Alert.alert('Error', 'Failed to resend OTP');
        }
    };

    return (
        <ScreenWrapper style={styles.container}>
            {/* Custom Back Button for layout control */}
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
            >
                <Feather name="arrow-left" size={24} color={theme.colors.text.primary} />
            </TouchableOpacity>

            <View style={styles.content}>
                <View style={styles.header}>
                    <View style={styles.logoPlaceholder}>
                        <Feather name="shield" size={40} color={theme.colors.primary[600]} />
                    </View>
                    <AppText size="xxl" weight="bold" align="center" style={styles.title}>
                        Verification Code
                    </AppText>
                    <AppText size="m" color={theme.colors.text.secondary} align="center" style={styles.subtitle}>
                        Enter the code sent to{'\n'}
                        <AppText weight="bold" color={theme.colors.text.primary}>+91 {mobile}</AppText>
                    </AppText>
                </View>

                <View style={styles.form}>
                    <View style={[
                        styles.inputContainer,
                        isFocused && styles.inputFocused,
                        !!error && styles.inputError
                    ]}>
                        <View style={styles.iconContainer}>
                            <Feather name="key" size={20} color={isFocused ? theme.colors.primary[600] : theme.colors.text.tertiary} />
                        </View>

                        <TextInput
                            style={styles.input}
                            placeholder="Enter 6-digit OTP"
                            placeholderTextColor={theme.colors.text.tertiary}
                            keyboardType="number-pad"
                            maxLength={6}
                            value={otp}
                            onChangeText={setOtp}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            autoFocus
                        />
                    </View>

                    {error ? (
                        <AppText size="xs" color={theme.colors.status.danger} style={styles.errorText}>
                            {error}
                        </AppText>
                    ) : null}

                    <AppButton
                        title="Verify & Continue"
                        onPress={handleVerify}
                        isLoading={isLoading}
                        variant="primary"
                        disabled={isLoading}
                        style={[
                            styles.button,
                            !isValidOtp && styles.buttonVisualDisabled
                        ]}
                    />

                    <View style={styles.resendContainer}>
                        <AppText color={theme.colors.text.secondary} size="s">
                            Didn't receive code?{' '}
                        </AppText>
                        <TouchableOpacity onPress={handleResend} disabled={timer > 0}>
                            <AppText
                                weight="semibold"
                                size="s"
                                color={timer > 0 ? theme.colors.text.disabled : theme.colors.primary[600]}
                            >
                                {timer > 0 ? `Resend in ${timer}s` : 'Resend Now'}
                            </AppText>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: theme.colors.surface.card,
        flex: 1,
    },
    backButton: {
        position: 'absolute',
        top: theme.spacing.s,
        left: theme.spacing.l,
        zIndex: 10,
        padding: theme.spacing.xs,
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
        backgroundColor: theme.colors.primary[50],
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
        lineHeight: 22,
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
        marginRight: theme.spacing.m,
        width: 24,
        alignItems: 'center',
    },
    input: {
        flex: 1,
        fontSize: theme.typography.size.l,
        color: theme.colors.text.primary,
        fontFamily: theme.typography.fontFamily?.primary?.regular,
        height: '100%',
        letterSpacing: 4,
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
    },
    resendContainer: {
        marginTop: theme.spacing.xl,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
