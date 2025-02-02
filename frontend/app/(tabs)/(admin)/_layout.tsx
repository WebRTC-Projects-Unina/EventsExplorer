import { Text } from 'react-native';
import { useSession } from '@/hooks/authProvider';
import { Slot } from 'expo-router';
import { router } from 'expo-router';

export default function TestLayout() {
    const { session, isLoading } = useSession();
    if (isLoading) {
        return <Text>Loading...</Text>;
    }
    if (!session) {
        router.replace("/(tabs)/sign-in");
    }

    return (
        <Slot />
    );
}
