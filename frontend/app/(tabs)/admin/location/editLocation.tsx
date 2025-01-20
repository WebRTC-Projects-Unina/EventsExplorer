import React, { useState, useEffect, useLayoutEffect } from 'react';
import { Button, useTheme } from 'react-native-paper';
import { View, Text, TextInput, StyleSheet, Modal, Pressable } from 'react-native';
import { useNavigation, useLocalSearchParams, router } from "expo-router";
import LocationService from '../../../service/location.service';
import { Location } from '../../../models/event';
import Toast from 'react-native-toast-message';

export default function EditEvent() {
    const navigation = useNavigation();
    const params = useLocalSearchParams();
    const { id } = params;
    const [location, setLocation] = useState<Location>();
    const [name, setName] = useState('');
    const [website, setWebsite] = useState('');
    const [loading, setLoading] = useState(true);
    const { getLocationById, createLocation, updateLocation } = LocationService();

    useLayoutEffect(() => {
        let title = id == undefined ? "Create location" : "Edit location";
        navigation.setOptions({
            title,
        });
    }, [navigation]);
    useEffect(() => {
        if (id !== undefined) {
            getLocationById(Number(id))
                .then(response => {
                    setLocation(response.data);
                    setName(response.data.name);
                    setWebsite(response.data.website);
                    setLoading(false);
                })
                .catch(error => {
                    setLoading(false);
                });
        }
        else {
            const defaultItem: Location = {
                id: 0,
                name: '',
                website: '',
                longitude: 1.0,
                latitude: 1.0
            }
            setLocation(defaultItem);
        }
    }, [id]);

    const handleSave = () => {
        if (location != undefined) {
            location.name = name;
            location.website = website;
            if (location.id == undefined || location.id == 0) {
                createLocation(location)
                    .then(response => {
                        Toast.show({
                            type: 'success',
                            text1: 'Location successfully created!'
                        });
                        router.back();
                    })
                    .catch(error => {

                    });
            } else {
                updateLocation(location)
                    .then(response => {
                        router.back();
                    })
                    .catch(error => {

                    });
            }
        }
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
                        value={website}
                        onChangeText={setWebsite}
                        placeholder="Enter website"
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
    }
});