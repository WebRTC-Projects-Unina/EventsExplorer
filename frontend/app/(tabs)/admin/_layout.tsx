import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { Text } from 'react-native';
import { useSession } from '@/app/hooks/authProvider';
import { Redirect } from 'expo-router';
import React from 'react';
import { router } from 'expo-router';

export default function AdminLayout() {
    const { session, isLoading } = useSession();

    if (isLoading) {
        return <Text>Loading...</Text>;
    }
    if (session == null) {
        return <Redirect href='../../sign-in' />;
    }
    router.push("/admin/event/table");

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            {/* initialRouteName='event/table' */}
            <Drawer initialRouteName="event/table" backBehavior="history">
                <Drawer.Screen
                    name="event/table"
                    options={{
                        drawerLabel: 'Events',
                        title: 'Events',
                    }}
                />
                <Drawer.Screen
                    name="event/edit"
                    options={{
                        drawerLabel: undefined,
                        drawerItemStyle: { display: 'none' }
                    }}
                />
                <Drawer.Screen
                    name="location/editLocation"
                    options={{
                        drawerLabel: undefined,
                        drawerItemStyle: { display: 'none' }
                    }}
                />
                <Drawer.Screen
                    name="location/locationTable"
                    options={{
                        drawerLabel: 'Locations',
                        title: 'Locations',
                    }}
                />
            </Drawer>
        </GestureHandlerRootView>
    );
}
