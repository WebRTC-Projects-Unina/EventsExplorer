import React, { useState, useEffect } from 'react';
import { Button } from 'react-native-paper';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { useNavigation, useRouter, useLocalSearchParams } from "expo-router";
import * as EventService from '../../service/event.service';

export default function EditEvent() {
    const navigation = useNavigation();
    const router = useRouter();
    const params = useLocalSearchParams();
    const { id } = params;
    const [event, setEvent] = useState(null);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [location, setLocation] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch event details from the API
        EventService.getEventById(Number(id))
            //.then(response => response.data))
            .then(response => {
                //setEvent(response.data);
                setName(response.data.name);
                setDescription(response.data.description);
                setDate(response.data.date);
                //setLocation(response.data.location);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching event:', error);
                setLoading(false);
            });
    }, [id]);

    const handleSave = () => {
        console.log(`Name: ${name} description: ${description} date: ${date}`);
        // Make API call here
        // fetch('https://api.example.com/events/' + event.id, {
        //   method: 'PUT',
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        //   body: JSON.stringify({ name, description, date, location }),
        // })
        //   .then(response => response.json())
        //   .then(data => {
        //     console.log('Success:', data);
        //     navigation.goBack();
        //   })
        //   .catch(error => {
        //     console.error('Error:', error);
        //   });
    };

    return (
        <View style={styles.container}>
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
                    <TextInput
                        style={styles.input}
                        value={date}
                        onChangeText={setDate}
                        placeholder="Enter date"
                    />
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
});