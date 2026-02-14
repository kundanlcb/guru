/**
 * Mutation Toast Hook — React Native
 * Subscribes to TanStack Query's MutationCache to show feedback
 * on offline/online mutation state transitions via Alert.
 *
 * Usage: Call `useMutationToast()` once in your root App component.
 */

import { useEffect, useRef } from 'react';
import { Alert, Platform, ToastAndroid } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';

function showToast(message: string) {
    if (Platform.OS === 'android') {
        ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
        // iOS: Use a non-blocking alert
        Alert.alert('', message, [{ text: 'OK' }], { cancelable: true });
    }
}

export function useMutationToast() {
    const queryClient = useQueryClient();
    const shownRef = useRef<Set<string>>(new Set());

    useEffect(() => {
        const cache = queryClient.getMutationCache();
        const unsubscribe = cache.subscribe((event) => {
            const mutation = event.mutation;
            if (!mutation) return;

            const id = String(mutation.mutationId);
            const state = mutation.state;

            // Only show toasts for mutations that have a mutationKey
            const key = mutation.options.mutationKey;
            if (!key || key.length === 0) return;

            const label = String(key[key.length - 1] ?? 'Changes');

            if (state.isPaused && !shownRef.current.has(`paused-${id}`)) {
                shownRef.current.add(`paused-${id}`);
                showToast(`${label} saved locally — will sync when online`);
            }

            if (state.status === 'success' && !shownRef.current.has(`success-${id}`)) {
                shownRef.current.add(`success-${id}`);
                if (shownRef.current.has(`paused-${id}`)) {
                    showToast(`${label} synced ✓`);
                }
            }

            if (state.status === 'error' && !shownRef.current.has(`error-${id}`)) {
                shownRef.current.add(`error-${id}`);
                showToast(`${label} failed — please retry`);
            }
        });

        return () => unsubscribe();
    }, [queryClient]);
}
