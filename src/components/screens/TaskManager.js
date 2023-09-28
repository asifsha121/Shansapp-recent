import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from "@expo/vector-icons";
import WeekCalendar from '../Calender/WeakCalendar';
import axios from 'axios';
import { baseUrl } from '../../api/const';
import { useIsFocused } from '@react-navigation/native';
import { format } from 'date-fns';
import GoBack from '../NavGoBack/GoBack';



//formate estimated time
const formatEstimatedTime = (estimatedTime) => {
    if (!estimatedTime || typeof estimatedTime !== 'string') {
        return estimatedTime; // Return the original value if it's null or not a string
    }

    const parts = estimatedTime.split(':');
    const hours = parseInt(parts[0]);
    const minutes = parseInt(parts[1]);
    const seconds = parseInt(parts[2]);

    if (!isNaN(hours) || !isNaN(minutes) || !isNaN(seconds)) {
        const formattedHours = hours || 0;
        const formattedMinutes = minutes || 0;
        const formattedSeconds = seconds || 0;

        return `${formattedHours}:${formattedMinutes}:${formattedSeconds} Hrs`;
    }

    return estimatedTime; // Return the original value if parsing fails
};


const TaskManager = () => {

    const isFocused = useIsFocused();
    const [date, setDate] = useState(new Date());
    const [taskData, setTaskData] = useState([]);
    const navigation = useNavigation();

    const formattedDate = date.toISOString().slice(0, 10);
    useEffect(() => {
        if (isFocused) {
            // Refetch data when the screen is in focus
            axios
                .get(`${baseUrl}/viewTaskManagment?date=${formattedDate}`)
                .then((response) => {
                    // Handle the successful response here
                    console.log('API Response:', response.data);
                    // Set the fetched data in the state
                    setTaskData(response.data.data); // Assuming the data is under the 'data' key
                })
                .catch((error) => {
                    // Handle any errors that occurred during the API call
                    console.error('API Error:', error);
                });
        }
    }, [formattedDate, isFocused]);
    // Add formattedDate as a dependency to re-fetch when the date changes

    return (
        <View style={styles.container}>
            <View>
                <GoBack title="Task Manager" onPress={() => navigation.goBack()} />
            </View>
            <WeekCalendar date={date} onChange={(newDate) => setDate(newDate)} />
            {taskData.length === 0 ? (
                <View style={styles.noTasksContainer}>
                    <Text style={styles.noTasksText}>No tasks Added</Text>
                </View>
            ) : (
                <ScrollView style={styles.taskListContainer}>

                    {taskData.map((task, index) => (
                        <TouchableOpacity
                            key={index}
                            onPress={() => {
                                // Navigate to the TaskDetails screen with the task details
                                navigation.navigate('TaskUpdate', { task });
                            }}
                        >
                            <View style={styles.taskContainer} key={index}>
                                <View style={styles.taskContent}>
                                    <View>
                                        <Text style={styles.taskTitle}>{task.title}</Text>
                                        <Text style={styles.taskLabel}>
                                            Deadline{' '}:{' '}
                                            <Text style={styles.deadlineText}>
                                                {format(new Date(task.due_date), 'dd MMM yyyy h:mm a')}
                                            </Text>
                                        </Text>
                                        <Text style={styles.taskLabel}>
                                            Estimated time{' '}:{' '}
                                            <Text style={styles.estimatedTimeText}>
                                                {formatEstimatedTime(task.estimated_time)}
                                            </Text>
                                        </Text>
                                    </View>
                                    <View style={styles.arrowContainer}>
                                        <AntDesign name="arrowright" size={24} color="black" />
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            )}
            <TouchableOpacity
                onPress={() => navigation.navigate('AddTask')}
                style={styles.fab}
            >
                <Text style={styles.fabIcon}>+</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
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
    fab: {
        position: 'absolute',
        width: 56,
        height: 56,
        alignItems: 'center',
        justifyContent: 'center',
        right: 20,
        bottom: 20,
        backgroundColor: '#07d7c7',
        borderRadius: 30,
        ...Platform.select({
            android: {
                elevation: 8,
            },
            ios: {
                shadowColor: 'black',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
            },
        }),
    },
    fabIcon: {
        fontSize: 40,
        color: 'white',
    },
    taskContainer: {
        marginHorizontal: 20,
        padding: 20, // Adjust padding as needed
        backgroundColor: 'white',
        borderWidth: 0.5,
        borderColor: 'lightgray',
        borderRadius: 8,
        marginBottom: 10,
        ...Platform.select({
            android: {
                elevation: 1,
            },
            ios: {
                shadowColor: 'black',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
            },
        }),
    },
    taskContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',

    },
    arrowContainer: {
        marginLeft: 'auto', // Push the arrow to the right
    },
    taskTitle: {
        fontWeight: "900",
        fontSize: 16,
        textTransform: "capitalize"
    },
    taskLabel: {
        fontSize: 17,
        color: "gray",
        fontFamily: "sans-serif",
    },
    noTasksContainer: {
        flex: 1, // Center the content vertically and horizontally
        alignItems: 'center',
        justifyContent: 'center',
    },
    noTasksText: {
        fontSize: 20,
        color: 'gray',
    },
    deadlineText: {
        color: 'black', // Change the color to your desired color

    },
    estimatedTimeText: {
        color: 'black', // Change the color to your desired color
        // fontWeight: 'bold',
    },
    taskListContainer: {
        flex: 1, // Make the task list container take the available space
    },
});

export default TaskManager;