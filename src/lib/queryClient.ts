/**
 * Query Client Configuration — Guru (Teacher App)
 * Central TanStack Query client with offline-first defaults.
 */

import { QueryClient } from '@tanstack/react-query';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000,          // 5 min fresh window
            gcTime: 24 * 60 * 60 * 1000,       // 24 hr cache retention
            retry: 2,
            retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30_000),
            networkMode: 'offlineFirst',
            refetchOnReconnect: true,
        },
        mutations: {
            retry: 3,
            retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30_000),
            networkMode: 'offlineFirst',
        },
    },
});

export const asyncPersister = createAsyncStoragePersister({
    storage: AsyncStorage,
    key: 'guru-query-cache',
    throttleTime: 1000,
});
