import { Slot, Stack } from 'expo-router';
import React from 'react';
import Toast from 'react-native-toast-message';
import { SessionProvider } from './hooks/authProvider';
import { DefaultTheme, PaperProvider } from 'react-native-paper';

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: '#9c6b5a',
    accent: '#a98b89',
  },
};

export default function RootLayout() {

  return (
    <SessionProvider>
      <PaperProvider theme={theme}>
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