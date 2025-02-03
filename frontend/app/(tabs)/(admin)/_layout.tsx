import { Text } from 'react-native';
import { useSession } from '@/hooks/authProvider';
import { Slot } from 'expo-router';
import { router } from 'expo-router';
import { useEffect } from 'react';

export default function TestLayout() {
    const { session, isLoading } = useSession();

    useEffect(() => {
        if (!session) {
            router.replace("/(tabs)/sign-in");
        }
    }, [session]);

    if (isLoading) {
        return <Text>Loading...</Text>;
    }

    return (
        <Slot />
    );
}
