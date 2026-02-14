/**
 * Network Status Banner — React Native
 * Animated banner showing offline or slow connection state.
 */

import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNetworkStatus } from '../hooks/useNetworkStatus';

export const NetworkStatusBanner: React.FC = () => {
    const { isOnline, isSlowConnection } = useNetworkStatus();
    const insets = useSafeAreaInsets();
    const translateY = useRef(new Animated.Value(-60)).current;

    const showBanner = !isOnline || isSlowConnection;

    useEffect(() => {
        Animated.timing(translateY, {
            toValue: showBanner ? 0 : -60,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, [showBanner, translateY]);

    const isOffline = !isOnline;

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    paddingTop: insets.top + 4,
                    transform: [{ translateY }],
                    backgroundColor: isOffline ? '#FEE2E2' : '#FEF3C7',
                },
            ]}
            pointerEvents={showBanner ? 'auto' : 'none'}
        >
            <View style={styles.content}>
                <Text style={[styles.icon]}>
                    {isOffline ? '📡' : '🐢'}
                </Text>
                <Text
                    style={[
                        styles.text,
                        { color: isOffline ? '#991B1B' : '#92400E' },
                    ]}
                >
                    {isOffline
                        ? "You're offline — showing cached data"
                        : 'Slow connection — data may take longer'}
                </Text>
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        paddingBottom: 8,
        paddingHorizontal: 16,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    icon: {
        fontSize: 14,
    },
    text: {
        fontSize: 13,
        fontWeight: '500',
    },
});
