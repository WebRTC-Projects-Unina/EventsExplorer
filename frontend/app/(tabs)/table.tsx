import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { DataTable, Button, IconButton } from 'react-native-paper';
import * as EventService from '../service/event.service';
import { format } from 'date-fns';
import Toast from 'react-native-toast-message';
import { ScrollView } from 'react-native-gesture-handler';
import { Event, Location } from '../models/event';

const EventTable = () => {
    const [events, setEvents] = useState<Event[]>([]);
    useEffect(() => {
        getEvents();
    }, []);
    const handleEdit = (id: string) => {
        console.log(`Edit event with ID: ${id}`);
        Toast.show({ type: 'success', text1: 'Success', text2: `Event with ID: ${id} deleted successfully` });

    };

    const handleDelete = async (id: string) => {

        EventService.deleteEvent(Number(id)).then(() => {
            console.log("successful deleted");
            Toast.show({ type: 'success', text1: 'Success', text2: `Event with ID: ${id} deleted successfully` });
        }).catch((error) => {
            Toast.show({ type: 'error', text1: 'Error' + error.response.status, text2: error.response.data.error });
            console.log(error.response.status + ' ' + error.response.data.error);
        });
    };

    const formatDate = (isoDate: string) => {
        const date = new Date(isoDate);
        return format(date, 'dd.MM.yyyy');
    };

    const handleCreate = () => {
        console.log('Create new event');
    };
    const getEvents = async () => {

        EventService.getEvents().then((response) => {
            setEvents(response.data);
        }).catch((error) => {
            Toast.show({ type: 'error', text1: 'Error' + error.response.status, text2: error.response.data.error });

            console.log(error.response.error);
        });
    };


    return (
        <View style={styles.container}>
            <ScrollView>
                <DataTable>
                    <DataTable.Header>
                        <DataTable.Title>Name</DataTable.Title>
                        <DataTable.Title>Description</DataTable.Title>
                        <DataTable.Title>Location ID</DataTable.Title>
                        <DataTable.Title>Date</DataTable.Title>
                        <DataTable.Title>Actions</DataTable.Title>
                    </DataTable.Header>

                    {events.map((event) => (
                        <DataTable.Row key={event.id}>
                            <DataTable.Cell>{event.name}</DataTable.Cell>
                            <DataTable.Cell>{event.description}</DataTable.Cell>
                            <DataTable.Cell>{event.Location?.name}</DataTable.Cell>
                            <DataTable.Cell>{formatDate(event.date)}</DataTable.Cell>
                            <DataTable.Cell>
                                <Button mode="contained" onPress={() => handleEdit(event.id)} style={styles.actionButton}>
                                    Edit
                                </Button>
                                <Button mode="outlined" onPress={() => handleDelete(event.id)} style={styles.actionButton}>
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

export default EventTable;
