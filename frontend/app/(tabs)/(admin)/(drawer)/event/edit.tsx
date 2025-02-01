import React, { useState, useEffect } from 'react';
import { Button, useTheme, TextInput, List } from 'react-native-paper';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useLocalSearchParams } from "expo-router";
import LocationService from '../../../../../service/location.service';
import { Event, Location, Tag } from '../../../../../models/event';
import Toast from 'react-native-toast-message';
import EventService from '@/service/event.service';
import TagService from '@/service/tag.service';
import ImageService from '../../../../../service/image.service';
import * as DocumentPicker from 'expo-document-picker';
import { Dropdown, DropdownInputProps, Option } from 'react-native-paper-dropdown';
import DatePicker from '@/components/datepicker.component';


export default function EditEvent() {
    const navigation = useNavigation();
    const params = useLocalSearchParams();
    const { id } = params;
    const [event, setEvent] = useState<Event>();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [selectedDate, setDate] = useState<Date>();
    const [loading, setLoading] = useState(true);
    const [locations, setLocations] = useState<Location[]>([]);
    const [selectedLocationId, setSelectedLocationId] = useState<string>();
    const [selectedDocument, setSelectedDocuments] = useState<any>();
    const theme = useTheme();
    const { getEventById, updateEvent, createEvent } = EventService();
    const { getLocations } = LocationService();
    const { getTags } = TagService();
    const { upload } = ImageService();
    const [results, setResults] = useState<Tag[]>([]);
    const [text, setText] = useState('');
    const [tags, setTags] = useState<Tag[]>([]);
    const addTag = (tag: Tag) => {
        const tagExists = tags.some(o => o.name === tag.name);
        if (!tagExists) {
            tags.push(tag);
        }
        setText('');
    };
    const addNewTag = () => {
        const formattedName = text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
        const matchingTags = results.filter(tag => tag.name === formattedName);
        if (matchingTags.length === 1) {
            addTag(matchingTags[0]);
        }
        else {
            addTag({ name: formattedName });
        }
    }
    const fetchTags = (search: string) => {
        if (search.length < 3) {
            setResults([]);
            return;
        }
        setLoading(true);
        getTags(search).then((result) => {
            setResults(result.data);
            setLoading(false);
        });
    }

    const removeTag = (tagToRemove: any) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    useEffect(() => {
        let title = id == undefined ? "Create event" : "Edit event";
        navigation.setOptions({
            title,
        });
    }, [navigation]);

    useEffect(() => {
        setText("");
        setResults([]);
        getLocations().then(response => {
            setLocations(response.data);
        }).then(() => {
            if (id !== undefined) {
                getEventById(Number(id))
                    .then(response => {
                        setEvent(response.data);
                        setName(response.data.name);
                        setDescription(response.data.description || "");
                        setDate(new Date(response.data.date));
                        setSelectedLocationId(response.data.Location?.id.toString() || "");
                        setTags(response.data.Tags || []);
                        setLoading(false);
                    })
                    .catch(error => {
                        setLoading(false);
                    });
            }
            else {
                const defaultItem: Event = {
                    id: 0,
                    name: '',
                    description: '',
                    date: '',
                    Image: undefined,
                    Location: undefined,
                    Tags: [],
                    locationId: locations.length != 0 ? locations[0].id : 0
                }
                setSelectedLocationId(defaultItem.locationId.toString());
                setName('');
                setTags([]);
                setDate(new Date());
                setDescription('');
                setEvent(defaultItem);
            }

        });
    }, [id]);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchTags(text);
        }, 150);

        return () => clearTimeout(delayDebounceFn);
    }, [text]);

    const mapLocationsToOption = (): Option[] => {
        const options: Option[] = locations.map((location): Option => ({ label: location.name, value: location.id.toString() }));
        return options;
    }

    const uploadFile = async () => {
        DocumentPicker
            .getDocumentAsync({ type: "*/*", copyToCacheDirectory: true })
            .then(response => {
                if (response.assets != null && response.assets.length > 0) {
                    let fileToUpload = {
                        name: response.assets[0].name,
                        uri: response.assets[0].uri,
                        mimetype: response.assets[0].mimeType,
                        filename: response.assets[0].name
                    };
                    setSelectedDocuments(fileToUpload);
                }
            });
    };

    const handleSave = () => {

        if (event != undefined) {
            event.name = name;
            event.description = description;
            event.date = selectedDate?.toISOString() || "";
            event.Location = locations.find(o => o.id == Number(selectedLocationId));
            event.locationId = Number(selectedLocationId);
            event.Tags = tags;
            if (event.id == undefined || event.id == 0) {
                createEvent(event)
                    .then(response => {
                        Toast.show({
                            type: 'success',
                            text1: 'Event successfully created!'
                        });
                        if (selectedDocument != undefined) {
                            uploadImage(response.data.id).then(() => {
                                navigation.goBack();
                            })
                                .catch((error: any) => {
                                    console.log(error);
                                });
                        }

                    })
                    .catch(error => {

                    });
            } else {
                updateEvent(event)
                    .then(response => {
                        if (selectedDocument != undefined) {
                            uploadImage(event.id).then(() => {
                                navigation.goBack();
                            })
                                .catch((error: any) => {
                                    console.log(error);
                                });
                        }
                    })
                    .catch(error => {

                    });
            }
        }
    };

    const uploadImage = (eventId: number) => {
        return upload(selectedDocument, eventId);
    }
    const CustomDropdownInput = ({
        placeholder,
        selectedLabel,
        rightIcon,
    }: DropdownInputProps) => (
        <TextInput
            mode="outlined"
            placeholder={placeholder}
            label="Locations"
            value={selectedLabel}
            style={styles.input}
            textColor={theme.colors.primary}
            right={rightIcon}
        />
    );
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
        tagContainer: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            padding: 5,
            display: 'flex',
            width: '70%',
            borderRadius: 5,
            maxHeight: 130,
            overflowY: 'auto',
            minHeight: 50,
        },
        tag: {
            flexDirection: 'row',
            alignItems: 'center',
            borderColor: theme?.colors.primary,
            borderWidth: 1,
            borderRadius: 15,
            paddingVertical: 5,
            paddingHorizontal: 10,
            margin: 5,
        },
        tagText: {
            color: theme?.colors.primary,
        },
        removeTagText: {
            color: theme?.colors.primary,
            marginLeft: 5,
        }
    });

    return (
        <View style={styles.container}>

            <View style={styles.form}>
                <TextInput
                    style={styles.input}
                    mode='outlined'
                    label="Name"
                    value={name}
                    onChangeText={setName}
                />
                <TextInput
                    style={styles.input}
                    mode='outlined'
                    label="Description"
                    value={description}
                    onChangeText={setDescription}
                />
                <View style={{ marginBottom: 10 }}>

                    <DatePicker
                        initialDate={selectedDate}
                        onDateChange={setDate}
                        theme={theme}
                    />
                </View>
                <Dropdown
                    hideMenuHeader={true}
                    CustomDropdownInput={CustomDropdownInput}
                    mode="outlined"
                    label="Locations"
                    onSelect={setSelectedLocationId}
                    value={selectedLocationId}
                    placeholder="Select Location" options={mapLocationsToOption()}
                />
                <Button onPress={uploadFile} >Upload File</Button>


                <View style={styles.input}>
                    <TextInput
                        mode='outlined'
                        label="Tags"
                        placeholder="Add a tag"
                        value={text}
                        onChangeText={setText}
                        onSubmitEditing={addNewTag}
                        returnKeyType="done"
                        placeholderTextColor="#d5d5d5"
                    />
                    <List.Section style={{ position: "absolute", zIndex: 1000, top: 50, width: "100%", backgroundColor: "white" }}>
                        {results.map((tag) => (
                            <List.Item onPress={() => {
                                addTag(tag)
                            }} theme={theme} title={tag.name} style={{ zIndex: 1 }} />

                        ))}
                    </List.Section>
                    {
                        <View style={styles.tagContainer}>
                            {tags.map((tag) => (
                                <TouchableOpacity key={tag.id} style={styles.tag} onPress={() => removeTag(tag)}>
                                    <Text style={styles.tagText}>{tag.name}</Text>
                                    <Text style={styles.removeTagText}> x</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    }
                    <View style={styles.buttonRow}>
                        <Button mode="contained" onPress={handleSave} >Save</Button>
                        <Button mode="outlined" onPress={() => navigation.goBack()}  >
                            Cancel
                        </Button>
                    </View>
                </View>
            </View>
        </View>
    );
}