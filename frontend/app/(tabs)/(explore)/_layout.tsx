
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { Text } from 'react-native';
import { useSession } from '@/app/hooks/authProvider';
import { Redirect, Stack } from 'expo-router';
import React from 'react';
import { router } from 'expo-router';

export default function EventsLayout() {


    return (

        <Stack >
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="detail" />
        </Stack>

    );
}
