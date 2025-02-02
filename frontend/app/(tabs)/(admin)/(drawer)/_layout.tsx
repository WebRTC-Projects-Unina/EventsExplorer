import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';

export default function AdminLayout() {

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
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
                <Drawer.Screen
                    name="index"
                    options={{
                        drawerLabel: undefined,
                        drawerItemStyle: { display: 'none' }
                    }}
                />
                <Drawer.Screen
                    name="logout"
                    options={{
                        drawerLabel: 'Logout',
                        title: 'Logout',
                    }}
                />

            </Drawer>
        </GestureHandlerRootView>
    );
}
