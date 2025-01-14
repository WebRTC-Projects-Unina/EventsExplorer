import { Tabs } from 'expo-router';

import Ionicons from '@expo/vector-icons/Ionicons';


export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: '#ffffff',
                headerStyle: {
                    backgroundColor: '#000',
                },
                headerShadowVisible: false,
                headerTintColor: '#fff',
                tabBarStyle: {
                    backgroundColor: '#000',
                },
            }}
        >

            <Tabs.Screen
                name="index"
                options={{
                    title: 'Explore',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? 'search' : 'search-outline'} color={color} size={24} />
                    ),
                }}
            />
            <Tabs.Screen
                name="about"
                options={{
                    title: 'Map',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? 'compass' : 'compass-outline'} color={color} size={24} />
                    ),
                }}
            />
            <Tabs.Screen
                name="admin"
                options={{
                    title: 'Admin area',
                    tabBarLabel: 'Admin',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? 'create' : 'create-outline'} color={color} size={24} />
                    ),
                }}
            />
        </Tabs>
    );
}
