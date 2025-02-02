import { router } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { Button, useTheme, TextInput, List } from 'react-native-paper';

import Toast from "react-native-toast-message";
import { useSession } from "@/hooks/authProvider";
import { useState } from 'react';

export default function SignInScreen() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { signIn } = useSession();

    const signInLocal = () => {
        signIn(username, password).then((login) => {
            router.replace("/(tabs)/(admin)/(drawer)");

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
                <TextInput
                    style={styles.input}
                    mode='outlined'
                    label="User"
                    placeholder="Enter username"
                    value={username}
                    onChangeText={setUsername}
                />
                <TextInput
                    mode='outlined'
                    secureTextEntry
                    style={styles.input}
                    value={password}
                    label="Password"
                    onChangeText={setPassword}
                    placeholder="Enter password"
                />
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
        flex: 1,
        width: '100%',
        marginTop: 5,
        maxWidth: 600,
    },
    input: {
        width: "100%",
        marginBottom: 10
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
    // input: {
    //     width: '65%',
    //     borderWidth: 1,
    //     borderColor: '#ccc',
    //     padding: 10,
    //     borderRadius: 5,
    //     backgroundColor: '#fff',
    // },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20,
    },
    actionButton: {
        marginHorizontal: 4,
    }
});