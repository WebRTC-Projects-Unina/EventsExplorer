import { useNavigation } from 'expo-router';
import { useLayoutEffect } from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';

export default function LocationTable() {
    const navigation = useNavigation();

    useLayoutEffect(() => {
        let title = "Locations";
        navigation.setOptions({
            title
        });
    }, [navigation]);
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Locations!</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        color: '#fff',
    },
});
