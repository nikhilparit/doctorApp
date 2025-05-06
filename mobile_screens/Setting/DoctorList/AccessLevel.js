import React, { useState, useMemo, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Box, ScrollView, Stack } from 'native-base';
import { Checkbox } from "react-native-paper";
import CommonStylesheet from "../../../common_stylesheet/CommonStylesheet";
import { useNavigation, useRoute } from "@react-navigation/native";

const AccessLevel = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const onSelect = route.params?.onSelect || (() => { });
    const selectedValues = route.params?.selectedValues || [];
    const [selectAll, setSelectAll] = useState(false);
    const [checkboxes, setCheckboxes] = useState([
        { id: 1, label: "Patient", checked: false },
        { id: 2, label: "Appointments", checked: false },
        { id: 3, label: "Message", checked: false },
        { id: 4, label: "Accounts", checked: false },
        { id: 5, label: "Reports", checked: false },
        { id: 6, label: "Administrator", checked: false },
        { id: 7, label: "Inventory", checked: false },
        { id: 8, label: "LabWork", checked: false },
    ]);

    useEffect(() => {
        const updatedCheckboxes = checkboxes.map(cb => ({
            ...cb,
            checked: selectedValues.includes(cb.label) // Check if label is in selectedValues
        }));
        setCheckboxes(updatedCheckboxes);
        setSelectAll(updatedCheckboxes.every(cb => cb.checked));
    }, []);

    const toggleSelectAll = () => {
        const newState = !selectAll;
        setSelectAll(newState);
        setCheckboxes(checkboxes.map(cb => ({ ...cb, checked: newState })));
    };

    const toggleCheckbox = (id) => {
        const updatedCheckboxes = checkboxes.map(cb =>
            cb.id === id ? { ...cb, checked: !cb.checked } : cb
        );
        setCheckboxes(updatedCheckboxes);
        setSelectAll(updatedCheckboxes.every(cb => cb.checked));
    };

    const selectedAccessLevels = useMemo(() => {
        return checkboxes.filter(cb => cb.checked).map(cb => cb.label);
    }, [checkboxes]);

    function onSave() {
        onSelect(selectedAccessLevels);
        navigation.goBack();
    }

    return (
        <View style={styles.container}>
            <ScrollView>
                <Checkbox.Item
                    label="Clinic Access"
                    status={selectAll ? "checked" : "unchecked"}
                    onPress={toggleSelectAll}
                    color="#2196f3"
                />
                {checkboxes.map(cb => (
                    <Checkbox.Item
                        key={cb.id}
                        label={cb.label}
                        status={cb.checked ? "checked" : "unchecked"}
                        color="#2196f3"
                        onPress={() => toggleCheckbox(cb.id)}
                    />
                ))}
                <Box style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10, marginBottom: 10 }}>
                    <View>
                        <TouchableOpacity onPress={onSave}>
                            <View style={CommonStylesheet.buttonContainersaveatForm}>
                                <Text style={CommonStylesheet.ButtonText}>Save</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </Box>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#ffffff'
    },
    header: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
    },
});

export default AccessLevel;
