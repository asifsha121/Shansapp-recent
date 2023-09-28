import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Agenda } from 'react-native-calendars';

const HorizontalCalendar = () => {
    return (
        <View style={styles.container}>
        <Agenda
            // Customize the appearance and behavior of the agenda calendar here
            // For more options, check the documentation: https://github.com/wix/react-native-calendars
            items={{
            '2023-09-08': [{ name: 'Event 1', time: '10:00 AM' }],
            
            // Add your agenda items here, with date as the key and an array of events for that date
            }}
            renderItem={(item) => (
            <View style={styles.agendaItem}>
                <Text>{item.name}</Text>
                <Text>{item.time}</Text>
            </View>
            )}
        />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    agendaItem: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
});

export default HorizontalCalendar;
