import { useSession } from '@/hooks/authProvider';
import { Redirect } from 'expo-router';
import { Text, View, StyleSheet, Button } from 'react-native';

export default function Index() {
    return <Redirect href={"/(tabs)/(admin)/(drawer)/event/table"} />
}


