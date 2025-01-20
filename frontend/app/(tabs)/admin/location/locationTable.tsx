import { useFocusEffect, useNavigation, router } from 'expo-router';
import { useLayoutEffect, useState } from 'react';
import { InteractionManager, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { DataTable, Button, IconButton } from 'react-native-paper';
import { Location } from '../../../models/event';
import LocationService from '@/app/service/location.service';
import React from 'react';

export default function LocationTable() {
    const navigation = useNavigation();
    const [locations, setLocations] = useState<Location[]>([]);
    const { getLocations, deleteLocation } = LocationService();
    const [loading, setLoading] = useState(false);

    useLayoutEffect(() => {
        let title = "Locations";
        navigation.setOptions({
            title
        });
    }, [navigation]);
    useFocusEffect(
        React.useCallback(() => {
            const task = InteractionManager.runAfterInteractions(() => {
                getLocationsFromServer();
            });

            return () => task.cancel();
        }, [])
    );
    const getLocationsFromServer = () => {
        setLoading(true);
        getLocations().then((response) => {
            setLocations(response.data);
            setLoading(false);

        }).catch((error) => {
            console.log(error.response.error);
        }).finally(() => {
            setLoading(false);
        });
    }

    const handleEdit = (id: number) => {
        router.push({ pathname: "./editLocation", params: { id } });
    };
    const handleDelete = async (id: number) => {
        deleteLocation(id).then(() => {
            console.log("successful deleted");
            getLocationsFromServer();
            //todo reload
        }).catch((error) => {
            console.log(error.response.status + ' ' + error.response.data.error);
        });
    };

    const handleCreate = async () => {
        //todo navigate to create page

        router.push('./editLocation');
    };



    return (
        <View style={styles.container}>
            <ScrollView>
                <DataTable>
                    <DataTable.Header>
                        <DataTable.Title>Name</DataTable.Title>
                        <DataTable.Title>Actions</DataTable.Title>
                    </DataTable.Header>

                    {locations.map((location) => (
                        <DataTable.Row key={location.id}>
                            <DataTable.Cell>{location.name}</DataTable.Cell>
                            <DataTable.Cell>
                                <Button mode="contained" onPress={() => handleEdit(location.id)} style={styles.actionButton}>
                                    Edit
                                </Button>
                                <Button mode="outlined" onPress={() => handleDelete(location.id)} style={styles.actionButton}>
                                    Delete
                                </Button>
                            </DataTable.Cell>
                        </DataTable.Row>
                    ))}
                </DataTable>
            </ScrollView>
            <TouchableOpacity style={styles.fab} onPress={handleCreate}>
                <IconButton icon="plus" size={24} iconColor='#fff' />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    actionButton: {
        marginHorizontal: 4,
    },
    fab: {
        position: 'absolute',
        right: 16,
        bottom: 16,
        backgroundColor: '#6200ea',
        borderRadius: 28,
        width: 56,
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
});


