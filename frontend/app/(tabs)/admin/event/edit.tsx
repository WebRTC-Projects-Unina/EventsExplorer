import React, { useState, useEffect, useLayoutEffect, useCallback, useRef } from 'react';
import { Button, useTheme, TextInput, List } from 'react-native-paper';
import { View, Text, StyleSheet, Modal, Pressable, ScrollView, TouchableOpacity, ActivityIndicator, Dimensions, GestureResponderEvent } from 'react-native';
import { useNavigation, useLocalSearchParams } from "expo-router";
import LocationService from '../../../service/location.service';
import DateTimePicker from 'react-native-ui-datepicker';
import dayjs from 'dayjs';
import { MaterialIcons } from '@expo/vector-icons';
import { Event, Location, Tag } from '../../../models/event';
import Toast from 'react-native-toast-message';
import EventService from '@/app/service/event.service';
import TagService from '@/app/service/tag.service';
import { Dropdown, DropdownInputProps, Option } from 'react-native-paper-dropdown';


export default function EditEvent() {
    const navigation = useNavigation();
    const params = useLocalSearchParams();
    const { id } = params;
    const [event, setEvent] = useState<Event>();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState(dayjs());
    const [loading, setLoading] = useState(true);
    const [locations, setLocations] = useState<Location[]>([]);
    const [selectedLocationId, setSelectedLocationId] = useState<string>();
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const theme = useTheme();
    const { getEventById, updateEvent, createEvent } = EventService();
    const { getLocations } = LocationService();
    const { getTags } = TagService();
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

    const toggleVisibility = () => {
        setIsModalVisible(!isModalVisible);
    };

    const onDateChanged = (params: any) => {
        setDate(dayjs(params.date));
        setIsModalVisible(false);
    };
    useLayoutEffect(() => {
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
                        setDate(dayjs(response.data.date));
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
                setDate(dayjs(new Date()));
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

    const handleSave = () => {

        if (event != undefined) {
            event.name = name;
            event.description = description;
            event.date = date.toISOString();
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
                        navigation.goBack();
                    })
                    .catch(error => {

                    });
            } else {
                updateEvent(event)
                    .then(response => {
                        navigation.goBack();
                    })
                    .catch(error => {

                    });
            }
        }
    };
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
        //Modal
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
        closeButton: {
            position: 'absolute',
            color: 'black',
            backgroundColor: 'white',
            top: 0,
            right: 5,
            zIndex: 1,
        },
        //




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
                    value={name}
                    onChangeText={setName}
                />
                <TextInput
                    mode='outlined'
                    label="Date"
                    onTouchStart={toggleVisibility}
                    onPointerDown={toggleVisibility}
                    style={styles.input}
                    value={date.format('DD.MM.YYYY')} />
                <Dropdown
                    CustomDropdownInput={CustomDropdownInput}
                    mode="outlined"
                    label="Locations"
                    onSelect={setSelectedLocationId}
                    value={selectedLocationId}
                    placeholder="Select Location" options={mapLocationsToOption()}
                />
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
        </View >
    );

}
