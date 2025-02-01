import React, { PropsWithChildren, useEffect, useState } from "react";
import { Text, View, FlatList, StyleSheet, Modal, TouchableOpacity, ImageBackground, useWindowDimensions } from "react-native";
import { format } from 'date-fns';
import EventService from '../../../service/event.service';
import { Event, Location, Tag } from '../../../models/event';
import FilterComponent from "../../../components/filter.component";
import LocationService from "../../../service/location.service";
import { Search } from "../../../models/search";
import { router, useFocusEffect, useNavigation } from 'expo-router';
import { Icon, useTheme } from "react-native-paper";
import { navigate } from "expo-router/build/global-state/routing";
import { formatDate } from "@/utils/dateFunctions";

export default function Index() {

  const API_URL = process.env.EXPO_PUBLIC_API_URL;
  const images = API_URL + "/images/";
  const theme = useTheme();
  const { getEvents } = EventService();
  const { getLocations } = LocationService();
  const [isLoading, setLoading] = useState(true);
  const [events, setEvents] = useState<Event[]>([]);
  const [filter, setFilter] = useState<Search>();
  const [locations, setLocations] = useState<Location[]>([]);
  const { width } = useWindowDimensions();

  const styles = StyleSheet.create({
    eventCard: {
      margin: 10,
      overflow: "hidden",
      elevation: 5,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 3,
      backgroundColor: "#f3f3f3",
      width: 300,
      marginBottom: 10,
    },
    imageBackground: {
      height: 150,
      width: "100%",
      justifyContent: "flex-end",
    },
    overlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "rgba(0, 0, 0, 0.3)",
    },
    eventName: {
      color: theme.colors.onPrimary,
      fontSize: 16,
      fontWeight: "bold",
      padding: 8,
      backgroundColor: theme.colors.primary,
      textAlign: "left",
    },
    eventDetails: {
      padding: 10,
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
  });

  const minCols = 2;

  const calcNumColumns = (width: number) => {
    const cols = width / styles.eventCard.width;
    const colsFloor = Math.floor(cols) > minCols ? Math.floor(cols) : minCols;
    const colsMinusMargin = cols - 2 * colsFloor * styles.eventCard.margin;
    if (colsMinusMargin < colsFloor && colsFloor > minCols) return colsFloor - 1;
    else return colsFloor;
  };
  const [numberOfColumns, setNumberOfColumns] = useState(calcNumColumns(width));
  const openInNewTab = (url: string): void => {
    console.log(url);
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
    if (newWindow) newWindow.opener = null
  }

  useEffect(() => {
    setNumberOfColumns(calcNumColumns(width));
  }, [width]);

  useEffect(() => {
    setLoading(true);
    getEvents(filter).then((response) => {
      response.data.map((o) => {
        if (o.Image == undefined)
          o.Image = { filename: images + "noflyer.png" };
      });
      setEvents(response.data);
    }).catch((error) => {
      console.log(error.response?.error);
    }).finally(() => {
      setLoading(false);
    });

  }, [filter]);


  useEffect(() => {
    setLoading(true);
    getLocations().then((response) => {
      response.data.unshift({ id: 0, name: "All", latitude: 0, longitude: 0, website: "" });
      setLocations(response.data);
      setLoading(false);
    });
  }, []);

  const handleFilters = (filters: Search) => {
    setFilter(filters);
  };
  const onTag = (tag: Tag) => {
    console.log(tag);

    setFilter({ tag: tag.id, date: undefined, location: undefined, text: undefined });
  }

  const handleOnEventClick = (id: number) => {
    router.navigate({
      pathname: '/event/[id]',
      params: { id: id },
    });
  };

  const renderEvent = ({ item }: any) => (
    <View style={styles.eventCard} key={item.id}>
      <TouchableOpacity onPress={() => handleOnEventClick(item.id)}>
        <ImageBackground
          source={{ uri: item.Image?.filename }}
          style={styles.imageBackground}
        >
          <View style={styles.overlay} />
          <Text style={styles.eventName}>{item.name}</Text>
        </ImageBackground>
      </TouchableOpacity>

      <View style={styles.eventDetails}>
        <Text style={styles.eventDate}>
          <Icon size={14} source="calendar" />
          {formatDate(item.date)}
        </Text>
        <TouchableOpacity style={styles.eventLocation} onPress={() => {
          openInNewTab(`http://www.openstreetmap.org/?mlat=${item.Location.latitude}&mlon=${item.Location.longitude}&zoom=12`);
        }}>
          <Icon size={14} source="map-marker" />
          <Text>
            {item.Location?.name}
          </Text>
        </TouchableOpacity>
        <View style={styles.tagContainer}>
          {item.Tags.map((tag: Tag) => (
            <TouchableOpacity key={tag.id} style={styles.tag} onPress={() => onTag(tag)}>
              <Text style={styles.tagText}>{tag.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
  return (
    <View style={{ height: "90%" }}>
      <View style={{ marginBottom: 10, alignItems: "center" }}>
        <FilterComponent locations={locations} onApplyFilters={handleFilters} />
      </View>
      <FlatList
        key={numberOfColumns}
        contentContainerStyle={{ padding: 10, justifyContent: "center", width: "100%", alignItems: "center" }}
        data={events}
        renderItem={renderEvent}
        keyExtractor={(item) => item.id.toString()}
        numColumns={numberOfColumns}
      />
    </View>
  );
}