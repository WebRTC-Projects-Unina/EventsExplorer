import React, { useEffect, useLayoutEffect, useState } from 'react';
import { InteractionManager, StyleSheet, TouchableOpacity, View } from 'react-native';
import { DataTable, Button, IconButton } from 'react-native-paper';
import EventService from '../../../service/event.service';
import { format, setDate } from 'date-fns';
import { ScrollView } from 'react-native-gesture-handler';
import { Event } from '../../../models/event';
import { router, useFocusEffect, useNavigation } from 'expo-router';
import { useSession } from '@/app/hooks/authProvider';

const EventTable = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(false);
    const { signOut } = useSession();
    const navigation = useNavigation();

    const { getEvents, deleteEvent, getEventById, updateEvent } = EventService();
    useEffect(() => {
        //signOut();
        // getEventsFromServer();

    }, []);
    useLayoutEffect(() => {
        let title = "Event overview";
        navigation.setOptions({
            title
        });
    }, [navigation]);
    useFocusEffect(
        React.useCallback(() => {
            const task = InteractionManager.runAfterInteractions(() => {
                getEventsFromServer();
            });

            return () => task.cancel();
        }, [])
    );

    const getEventsFromServer = () => {
        setLoading(true);
        getEvents({}).then((response) => {
            setEvents(response.data);
            setLoading(false);

        }).catch((error) => {
            console.log(error.response.error);
        }).finally(() => {
            setLoading(false);
        });
    }

    const handleEdit = (id: string) => {
        router.push({ pathname: './(tabs)/admin/edit', params: { id } });
    };
    const handleDelete = async (id: string) => {
        deleteEvent(Number(id)).then(() => {
            console.log("successful deleted");
            getEventsFromServer();
        }).catch((error) => {
            console.log(error.response.status + ' ' + error.response.data.error);
        });
    };

    const formatDate = (isoDate: string) => {
        const date = new Date(isoDate);
        return format(date, 'dd.MM.yyyy');
    };

    const handleCreate = () => {
        console.log('Create new event');
        router.push('./(tabs)/admin/edit');

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
