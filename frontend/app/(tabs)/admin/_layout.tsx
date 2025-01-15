import { Stack } from 'expo-router';

export default function AdminLayout() {
    return (
        <Stack>
            <Stack.Screen name="table" options={{ headerShown: true, title: 'Event overview' }} />
            <Stack.Screen name="edit" />
        </Stack>
    );
}