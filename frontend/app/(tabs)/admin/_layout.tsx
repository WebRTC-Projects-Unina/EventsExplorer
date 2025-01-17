import { useSession } from '@/app/hooks/authProvider';
import { Stack, Redirect } from 'expo-router';
import { Text } from 'react-native';
import React from 'react';
import { router } from 'expo-router';


export default function AdminLayout() {
    const { session, isLoading } = useSession();

    if (isLoading) {
        return <Text>Loading...</Text>;
    }
    if (session == null) {

        return <Redirect href='../sign-in' />;
    }
    console.log(session);
    router.navigate('/(tabs)/admin/table');

    return (
        <Stack>
            <Stack.Screen name="table" options={{ headerShown: true, title: 'Event overview' }} />
            <Stack.Screen name="edit" />
        </Stack>
    );
}