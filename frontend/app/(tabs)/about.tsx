import { Text, View, StyleSheet, Button } from 'react-native';

export default function MapScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Site for explore events on an interactive map!</Text>
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
