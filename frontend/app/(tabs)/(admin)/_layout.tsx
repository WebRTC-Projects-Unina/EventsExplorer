import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { Text, View } from 'react-native';
import { SessionProvider, useSession } from '@/hooks/authProvider';
import { Redirect, Slot, Stack } from 'expo-router';
import React, { useEffect } from 'react';
import { router } from 'expo-router';

export default function TestLayout() {
    const { session, isLoading } = useSession();
    useEffect(() => {


    }, [session]);
    if (isLoading) {
        return <Text>Loading...</Text>;
    }
    if (!session) {
        return <Redirect href='/sign-in' />;
    }

    return (
        <SessionProvider>

            <Slot />
        </SessionProvider>

    );
}
