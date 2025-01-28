import { Slot, Stack } from 'expo-router';
import React from 'react';
import Toast from 'react-native-toast-message';
import { SessionProvider } from './hooks/authProvider';
import { PaperProvider } from 'react-native-paper';

export default function RootLayout() {

  return (
    <SessionProvider>
      <PaperProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <Toast
          position='bottom'
          bottomOffset={20}
        />
      </PaperProvider>
    </SessionProvider>
  );
}