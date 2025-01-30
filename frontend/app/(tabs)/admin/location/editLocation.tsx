import React, { useState, useEffect, useLayoutEffect } from 'react';
import { Button, TextInput } from 'react-native-paper';
import { View, StyleSheet } from 'react-native';
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
    const [longitude, setLongitude] = useState<Number>();
    const [latitude, setLatitude] = useState<Number>();

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
                    setLongitude(response.data.longitude);
                    setLatitude(response.data.latitude);
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
                <TextInput
                    mode='outlined'
                    label="Name"
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                    placeholder="Enter name"
                />
                <TextInput
                    mode='outlined'
                    label="Latitude"
                    style={styles.input}
                    value={latitude?.toString()}
                    onChangeText={(value) => {
                        const numericValue = value.replace(/[^0-9.]/g, "");
                        setLatitude(Number(numericValue));
                    }}
                    placeholder="Enter Latitude"
                />
                <TextInput
                    mode='outlined'
                    label="Longitude"
                    style={styles.input}
                    value={longitude?.toString()}
                    onChangeText={(value) => {
                        const numericValue = value.replace(/[^0-9.]/g, "");
                        setLongitude(Number(numericValue));
                    }}
                    placeholder="Enter Longitude"
                />
                <TextInput
                    mode='outlined'
                    label="Website"
                    style={styles.input}
                    value={website}
                    onChangeText={setWebsite}
                    placeholder="Enter website"
                />
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

    form: {
        flex: 1,
        width: '100%',
        marginTop: 5,
        maxWidth: 600,
    },
    input: {
        width: "100%",
        marginBottom: 10
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