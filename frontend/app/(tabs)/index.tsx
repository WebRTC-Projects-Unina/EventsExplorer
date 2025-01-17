import React, { PropsWithChildren, SetStateAction, useEffect, useState } from "react";
import { Image, type ImageSource } from "expo-image";
import { Text, View, FlatList, ActivityIndicator, StyleSheet, Modal, Button, TouchableOpacity, Pressable, Dimensions } from "react-native";
import { format } from 'date-fns';
import EventService from '../service/event.service';
import { MaterialIcons } from "@expo/vector-icons";
import { Event, Location } from '../models/event';

type Props = PropsWithChildren<{
  isVisible: boolean;
  onClose: () => void;
}>;

export default function Index() {

  const defaultItem: Event = {
    id: '',
    name: '',
    description: '',
    date: '',
    Image: undefined,
    Location: undefined,
    locationId: ''
  }
  const API_URL = process.env.EXPO_PUBLIC_API_URL;
  const images = API_URL + "/images/";
  const { getEvents, deleteEvent, getEventById, updateEvent } = EventService();

  const [isLoading, setLoading] = useState(true);
  const [events, setEvents] = useState<Event[]>([]);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<Event>(defaultItem);

  const onShowDetails = (item: Event) => {

    setSelectedItem(item);
    setIsModalVisible(true);
  };

  const onModalClose = () => {
    setIsModalVisible(false);
  };

  useEffect(() => {
    setLoading(true);
    getEvents().then((response) => {
      setEvents(response.data);
    }).catch((error) => {
      console.log(error.response.error);
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    return format(date, 'dd.MM.yyyy');
  };
  const [active, setactive] = useState(false);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#000',
    },
    element: {
      flexDirection: 'row',
      justifyContent: 'center',
      width: '100%',
      padding: 5,
      backgroundColor: '#fff',
      borderRadius: 8,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 4,
      elevation: 3,
      marginTop: 5,
      marginBottom: 5
    },
    header: {
      fontWeight: 900
    },
    leftSection: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 10,
      borderRightWidth: 1,
      borderRightColor: '#ccc',
    },
    dateText: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#333',
    },
    rightSection: {
      flex: 3,
      justifyContent: 'center',
      padding: 10,
    },
    titleText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#000',
      marginBottom: 5,
    },
    descriptionText: {
      fontSize: 14,
      color: '#666',
    },
    text: {
      color: '#fff',
    },
    button: {
      fontSize: 20,
      textDecorationLine: 'underline',
      color: '#fff',
    },
    flatListWrapper: {
      justifyContent: 'center',
      flexGrow: 1
    },
    flatList: {
      width: '95%',
    },
    View: {
      backgroundColor: "white",
      height: 140,
      width: 250,
      borderRadius: 15,
      alignItems: "center",
      justifyContent: "center",
      borderColor: "black",
      borderWidth: 2,
    },
    modalContent: {

      alignItems: 'center'
    },
    image: {
      borderRadius: 18,
      width: 320,
      height: 440,
    },
    smallImage: {
      width: 50,
      height: 50
    },
    overlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    closeButton: {
      justifyContent: "flex-end"

    }
  });

  return (
    <View style={styles.container}>
      <Modal animationType="slide" transparent={true} visible={isModalVisible}>
        <View style={styles.overlay}>
          <View style={styles.modalContent}>
            <View style={styles.closeButton}>
              <Pressable onPress={onModalClose} >
                <MaterialIcons name="close" color="#fff" size={22} />
              </Pressable>
            </View>
            <Image style={styles.image} source={selectedItem.Image?.filename} />
          </View>
        </View>
      </Modal>
      <FlatList
        style={styles.flatList}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.flatListWrapper}
        data={events}
        keyExtractor={({ id }) => id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.element} onPress={() => onShowDetails(item)}
          >
            <View style={styles.leftSection}>
              <Image style={styles.smallImage} source={selectedItem.Image?.filename} />

              <Text style={styles.dateText}>{formatDate(item.date)}</Text>
            </View>
            <View style={styles.rightSection}>
              <Text style={styles.header}>
                {item.name}
              </Text>
              <Text>{item.description}</Text>
              <Text>{item.Location?.name}</Text>
            </View>

          </TouchableOpacity>

        )}
      />
    </View>
  );
}
