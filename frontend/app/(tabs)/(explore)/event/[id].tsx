import { useEffect, useState } from "react";
import EventService from "../../../service/event.service";
import { Event, Tag } from '../../../models/event';
import { useLocalSearchParams } from "expo-router";
import { Text, View, StyleSheet, TouchableOpacity, Image, Dimensions } from "react-native";
import { Icon, useTheme } from "react-native-paper";
import { calculateDate, formatDate } from "@/app/utils/dateFunctions";

export default function EventDetail() {
    const API_URL = process.env.EXPO_PUBLIC_API_URL;
    const images = API_URL + "/images/";
    const theme = useTheme();
    const { id } = useLocalSearchParams();
    const { getEventById } = EventService();
    const [event, setEvent] = useState<Event>();
    const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
    const screenWidth = Dimensions.get("window").width;
    const targetWidth = screenWidth * 0.5;

    useEffect(() => {
        Image.getSize(event?.Image?.filename || "", (width, height) => {
            const aspectRatio = width / height;
            setImageSize({
                width: targetWidth,
                height: targetWidth / aspectRatio,
            });
        });
    }, [targetWidth, event]);

    useEffect(() => {
        getEventById(Number(id)).then((response) => {
            response.data.Image = { filename: images + "noflyer.png" };
            setEvent(response.data);
        }).catch((error) => {
            console.log(error.response?.error);
        }).finally(() => {
        });

    }, []);

    const openInNewTab = (url: string): void => {
        const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
        if (newWindow) newWindow.opener = null
    }

    const onTag = (tag: Tag) => {
        console.log(tag);
    }

    const styles = StyleSheet.create({
        right: {
            maxWidth: 300,
            borderColor: "#d5d5d5",
            borderWidth: 1,
            flex: 1,
            padding: 15,
            alignItems: 'flex-start',
            marginLeft: 10
        },
        image: {

        },
        eventDetails: {
            borderColor: "black",
            borderWidth: 1,
            backgroundColor: "#d5d5d5",
        },
        eventName: {
            color: theme.colors.onPrimary,
            fontSize: 16,
            fontWeight: "bold",
            padding: 8,
            backgroundColor: theme.colors.primary,
            textAlign: "left",
        },

        eventDate: {
            fontSize: 14,
            color: "#555",
            paddingRight: 5,
            marginRight: 5,
            marginBottom: 5,
        },
        eventLocation: {
            fontSize: 14,
            fontWeight: "bold",
            color: "#333",
            flexDirection: "row",
            marginBottom: 5,
        },
        tagContainer: {
            marginTop: 10,
            flexDirection: "row",
            flexWrap: "wrap",
        },
        tag: {
            flexDirection: 'row',
            alignItems: 'center',
            borderColor: theme?.colors.primary,
            borderWidth: 1,
            paddingVertical: 2.5,
            paddingHorizontal: 5,
            margin: 2.5,
        },
        tagText: {
            fontSize: 12,
            color: theme?.colors.primary,
        },
        left: {
            flex: 2, // Left part takes half the width
            alignItems: 'flex-start',
            marginRight: 10,
        },
        splitContainer: {
            marginTop: 20,
            flexDirection: "row", // Align items in a horizontal row
            justifyContent: "center", // Center horizontally
            alignItems: "flex-start", // Center vertically
            width: "80%", // Adjust width of the split section
        },
        link: {
            textDecorationStyle: "dotted",
            color: theme.colors.primary
        }
    });

    return (
        <View style={{ alignItems: "center", overflow: "scroll", height: "100%" }}>
            <Text style={{ fontSize: 35, marginTop: 5 }}>{event?.name}</Text>
            <View style={styles.splitContainer}>
                <View style={styles.left}>
                    <Image
                        style={[styles.image, { width: imageSize.width, height: imageSize.height }]}
                        resizeMode="contain"
                        source={{ uri: event?.Image?.filename }}
                    >
                    </Image>
                    <View style={{ marginTop: 20 }}>
                        <Text>{event?.description}</Text>
                    </View>

                </View>
                <View style={styles.right}>
                    <Text style={styles.eventDate}>
                        <Icon size={14} source="calendar" />
                        {formatDate(event?.date)}
                    </Text>
                    <Text style={styles.eventDate}>
                        {calculateDate(event?.date)}
                    </Text>
                    <TouchableOpacity style={styles.eventLocation} onPress={() => {
                        openInNewTab(`http://www.openstreetmap.org/?mlat=${event?.Location?.latitude}&mlon=${event?.Location?.longitude}&zoom=12`);
                    }}>
                        <Icon size={14} source="map-marker" />
                        <Text style={styles.link}>
                            {event?.Location?.name}
                        </Text>
                    </TouchableOpacity>
                    <View style={styles.tagContainer}>
                        {event?.Tags.map((tag: Tag) => (
                            <TouchableOpacity key={tag.id} style={styles.tag} onPress={() => onTag(tag)}>
                                <Text style={styles.tagText}>{tag.name}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </View>
        </View>);
}