import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { Location } from '../models/event';
import { Search } from "../models/search";
import { Button, useTheme, TextInput, List } from 'react-native-paper';
import { Dropdown, DropdownInputProps, Option } from 'react-native-paper-dropdown';
import DatePicker from "./datepicker.component";

interface FilterProps {
  locations: Location[];
  onApplyFilters: (filters: Search) => void;
}

const FilterComponent: React.FC<FilterProps> = ({ locations, onApplyFilters }) => {
  const [name, setName] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(2024, 10, 24));
  const [location, setLocation] = useState<Number>();
  const theme = useTheme();

  useEffect(() => {

    if (location == 0) {
      setLocation(undefined);
    }

    onApplyFilters({ date: selectedDate, text: name, location: location, tag: undefined });
  }, [name, selectedDate, location]);

  const mapLocationsToOption = (): Option[] => {
    const options: Option[] = locations.map((location): Option => ({ label: location.name, value: location.id.toString() }));
    return options;
  }
  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
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
      theme={theme}
      selectionColor="white"
      right={rightIcon}
    />
  );

  return (
    <View style={styles.container}>

      <TextInput
        style={styles.input}
        mode='outlined'
        placeholder="Search for name or description"
        label="Text"
        value={name}
        onChangeText={setName}
      />
      <View style={{ marginRight: 5 }}>
        <DatePicker
          initialDate={selectedDate}
          onDateChange={handleDateChange}
          theme={theme}
        />
      </View>

      <Dropdown

        CustomDropdownInput={CustomDropdownInput}
        mode="outlined"
        label="Locations"
        hideMenuHeader={true}
        onSelect={(value) => {
          setLocation(Number(value));
        }}
        value={location?.toString()}
        placeholder="Select Location" options={mapLocationsToOption()}
      />
      <Button mode="contained" >Clear</Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 5,
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  filterItem: {
    flex: 1,
    marginHorizontal: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 4,
  },
  input: {
    padding: 0,
    marginRight: 5,
  },


  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
  },
  picker: {
    height: 40,
    width: "100%",
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginLeft: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default FilterComponent;
