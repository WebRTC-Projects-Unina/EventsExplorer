import React from "react";
import { router } from 'expo-router';
import { Button } from 'react-native-paper';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { useSession } from "../hooks/authProvider";
import Toast from "react-native-toast-message";

export default function SignInScreen() {
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const { signIn } = useSession();

    const signInLocal = async () => {
        signIn(username, password).then(() => {
            router.navigate("./admin/event/table", { relativeToDirectory: false })
        }).catch(error => {
            Toast.show({
                type: 'error',
                text1: error.response?.data?.error
            });
        });
    };

    return (
        <View style={styles.container}>
            <View style={styles.form}>
                <View style={styles.inputRow}>
                    <Text style={styles.label}>Username:</Text>
                    <TextInput
                        style={styles.input}
                        value={username}
                        onChangeText={setUsername}
                        placeholder="Enter name"
                    />
                </View>
                <View style={styles.inputRow}>
                    <Text style={styles.label}>Password:</Text>
                    <TextInput
                        secureTextEntry
                        style={styles.input}
                        value={password}
                        onChangeText={setPassword}
                        placeholder="Enter password"
                    />
                </View>
                <View style={styles.buttonRow}>
                    <Button mode="contained" style={styles.actionButton} onPress={() => signInLocal()}>Sign in</Button>
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