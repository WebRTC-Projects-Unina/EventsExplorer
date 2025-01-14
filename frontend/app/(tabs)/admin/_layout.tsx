import { Stack } from 'expo-router';
import Toast from 'react-native-toast-message';
export default function AdminLayout() {
    return (
        <Stack>
            <Stack.Screen name="table" options={{ headerShown: true, title: 'Event overview' }} />
            <Stack.Screen name="edit" options={{ headerShown: true, title: 'Edit event' }} />
        </Stack>
    );
}