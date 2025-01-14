import React, { useState, useEffect } from 'react';
import { Button, useTheme } from 'react-native-paper';
import { View, Text, TextInput, StyleSheet, Modal, Pressable } from 'react-native';
import { useNavigation, useRouter, useLocalSearchParams } from "expo-router";
import * as EventService from '../../service/event.service';
import DateTimePicker from 'react-native-ui-datepicker';
import dayjs from 'dayjs';
import { MaterialIcons } from '@expo/vector-icons';
import { Event, Location } from '../../models/event';

export default function EditEvent() {
    const navigation = useNavigation();
    const params = useLocalSearchParams();
    const { id } = params;
    const [event, setEvent] = useState<Event>();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState(dayjs());
    const [location, setLocation] = useState('');
    const [loading, setLoading] = useState(true);

    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const theme = useTheme();

    const toggleVisibility = () => {
        setIsModalVisible(!isModalVisible);
    };

    const onDateChanged = (params: any) => {
        setDate(dayjs(params.date));
        setIsModalVisible(false);
    };
    useEffect(() => {

        EventService.getEventById(Number(id))
            .then(response => {
                setEvent(response.data);
                setName(response.data.name);
                setDescription(response.data.description);
                setDate(dayjs(response.data.date));
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching event:', error);
                setLoading(false);
            });
    }, [id]);

    const handleSave = () => {
        console.log(`Name: ${name} description: ${description} date: ${date}`);
        if (event != undefined) {
            event.name = name;
            event.description = description;
            event.date = date.toISOString();

            EventService.updateEvent(event)
                .then(response => {
                    navigation.goBack();
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        }
    };

    return (
        <View style={styles.container}>
            <Modal animationType="slide" transparent={true} visible={isModalVisible}>
                <View style={styles.overlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.datePickerContainer}>
                            <View style={styles.closeButton}>
                                <Pressable onPress={toggleVisibility} >
                                    <MaterialIcons name="close" color="#000" size={22} />
                                </Pressable>
                            </View>
                            <DateTimePicker
                                mode="single"
                                date={date}
                                firstDayOfWeek={1}
                                onChange={onDateChanged}
                                todayContainerStyle={{
                                    borderWidth: 1,
                                }}
                                headerButtonColor={theme?.colors.primary
                                }
                                selectedItemColor={theme?.colors.primary}
                            />
                        </View>
                    </View>
                </View>
            </Modal>
            <View style={styles.form}>
                <View style={styles.inputRow}>
                    <Text style={styles.label}>Name:</Text>
                    <TextInput
                        style={styles.input}
                        value={name}
                        onChangeText={setName}
                        placeholder="Enter name"
                    />
                </View>
                <View style={styles.inputRow}>
                    <Text style={styles.label}>Description:</Text>
                    <TextInput
                        style={styles.input}
                        value={description}
                        onChangeText={setDescription}
                        placeholder="Enter description"
                    />
                </View>
                <View style={styles.inputRow}>
                    <Text style={styles.label}>Date:</Text>
                    <Text onPress={toggleVisibility} style={styles.input}>{date.format('DD.MM.YYYY')}</Text>
                </View>
                <View style={styles.inputRow}>
                    <Text style={styles.label}>Location:</Text>
                    <TextInput
                        style={styles.input}
                        value={location}
                        onChangeText={setLocation}
                        placeholder="Enter location"
                    />
                </View>
                <View style={styles.buttonRow}>
                    <Button mode="contained" onPress={handleSave} style={styles.actionButton} >Save</Button>
                    <Button mode="outlined" onPress={() => navigation.goBack()} style={styles.actionButton} >
                        Cancel
                    </Button>
                </View>
            </View>
        </View>
    );

}
const styles = StyleSheet.create({
    container: {
        flex: 1,

        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        textAlign: 'center',
        marginBottom: 20,
    },
    form: {
        width: '100%',
        marginTop: 40,
        maxWidth: 400,
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    label: {
        width: '30%',
        fontSize: 16,
        textAlign: 'right',
        marginRight: 10,
    },
    input: {
        width: '65%',
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 5,
        backgroundColor: '#fff',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20,
    },
    actionButton: {
        marginHorizontal: 4,
    },
    closeButton: {
        position: 'absolute',
        color: 'black',
        backgroundColor: 'white',
        top: 0,
        right: 5,
        zIndex: 1,
    },
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    modalContent: {
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,1)',
    },
    datePickerContainer: {
        position: 'relative',
        paddingTop: 20,
    },
});