import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { queryClient, asyncPersister } from './src/lib/queryClient';
import { AppNavigator } from './src/navigation/AppNavigator';
import { NetworkStatusBanner } from './src/components/NetworkStatusBanner';

const App = (): React.JSX.Element => {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister: asyncPersister }}
      onSuccess={() => {
        queryClient.resumePausedMutations();
      }}
    >
      <SafeAreaProvider>
        <NetworkStatusBanner />
        <AppNavigator />
      </SafeAreaProvider>
    </PersistQueryClientProvider>
  );
};

export default App;
