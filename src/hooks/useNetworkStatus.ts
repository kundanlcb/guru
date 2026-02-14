/**
 * Network Status Hook — React Native
 * Uses @react-native-community/netinfo for reliable connectivity detection.
 */

import { useState, useEffect } from 'react';
import NetInfo, { NetInfoState, NetInfoStateType } from '@react-native-community/netinfo';

export interface NetworkStatus {
    isOnline: boolean;
    isSlowConnection: boolean;
    connectionType: string | null;
}

const SLOW_TYPES: string[] = ['2g', 'slow-2g'];

/**
 * Hook that tracks network connectivity and connection quality.
 * Returns reactive state that updates on network changes.
 */
export function useNetworkStatus(): NetworkStatus {
    const [status, setStatus] = useState<NetworkStatus>({
        isOnline: true, // Assume online initially
        isSlowConnection: false,
        connectionType: null,
    });

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
            const isConnected = state.isConnected ?? true;
            const connectionType = state.type;

            // Detect slow connections based on cellular generation
            let isSlowConnection = false;
            if (state.type === NetInfoStateType.cellular && state.details) {
                const generation = (state.details as any).cellularGeneration;
                if (generation === '2g' || generation === '3g') {
                    isSlowConnection = true;
                }
            }

            setStatus({
                isOnline: isConnected,
                isSlowConnection,
                connectionType,
            });
        });

        return () => unsubscribe();
    }, []);

    return status;
}
