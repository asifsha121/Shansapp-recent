import { View, Text, TouchableWithoutFeedback, StyleSheet } from 'react-native'
import React from 'react'
import { AntDesign } from "@expo/vector-icons";


export default GoBack = ({ title, onPress }) => {
    return (
        <TouchableWithoutFeedback onPress={onPress}>
            <View style={styles.buttonContainer}>
                <View style={styles.buttonContent}>
                    <AntDesign name="left" size={20} color="black" />
                    <Text style={styles.buttonText}>{title}</Text>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    buttonContainer: {
        backgroundColor: "#ffa600",
    },
    buttonContent: {
        flexDirection: "row",
        marginLeft: 10,
        marginBottom: 12,
        alignItems: "center"
    },
    buttonText: {
        marginLeft: 34,
        fontSize: 17,
        color: "white"
    },
})