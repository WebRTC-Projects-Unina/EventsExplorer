import { Text, View, StyleSheet, Button } from 'react-native';
import Snackbar from 'react-native-snackbar';
import Toast from 'react-native-toast-message';

export default function AboutScreen() {
    const showToast = () => {
        Snackbar.show({
            text: 'Hello world',
            duration: Snackbar.LENGTH_SHORT,
        });
    }


    return (
        <View style={styles.container}>
            <Text style={styles.text}>Site for upcoming events!</Text>
            <Button
                title='Show toast'
                onPress={showToast}
            />
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
