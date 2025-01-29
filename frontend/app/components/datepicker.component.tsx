import React, { useState } from "react";
import { Modal, View, StyleSheet, Pressable, Text } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { TextInput } from 'react-native-paper';

import DateTimePicker from 'react-native-ui-datepicker';
import dayjs, { Dayjs } from 'dayjs';
interface DatePickerProps {
    initialDate?: Date;
    onDateChange: (date: Date) => void;
    theme?: {
        colors: {
            primary: string;
        };
    };
}

const DatePicker: React.FC<DatePickerProps> = ({ initialDate = new Date(), onDateChange, theme }) => {
    const [isModalVisible, setModalVisible] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date>(initialDate);

    const toggleVisibility = () => setModalVisible(!isModalVisible);

    const handleDateChange = (params: any) => {
        if (params.date) {
            setSelectedDate(params.date);
            onDateChange(params.date);
        }
        setModalVisible(false);
    };
    return (
        <View>

            <TextInput
                mode='outlined'
                label="Date"
                onTouchStart={toggleVisibility}
                onPointerDown={toggleVisibility}
                value={dayjs(selectedDate).format('DD.MM.YYYY')} />
            <Modal animationType="slide" transparent={true} visible={isModalVisible}>
                <View style={styles.overlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.datePickerContainer}>
                            <View style={styles.closeButton}>
                                <Pressable onPress={toggleVisibility}>
                                    <MaterialIcons name="close" color="#000" size={22} />
                                </Pressable>
                            </View>
                            <DateTimePicker
                                mode="single"
                                date={selectedDate}
                                firstDayOfWeek={1}
                                onChange={handleDateChange}
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
        </View>
    );
};

const styles = StyleSheet.create({
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
});

export default DatePicker;
