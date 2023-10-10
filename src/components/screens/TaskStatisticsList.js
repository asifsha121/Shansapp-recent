import { View, Text, StyleSheet, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import GoBack from '../NavGoBack/GoBack'
import { useIsFocused } from '@react-navigation/native'
import { format } from 'date-fns'
import axios from 'axios'
import { baseUrl } from '../../api/const'

const TaskStatisticsList = ({ navigation, route }) => {
    const isFocused = useIsFocused();
    const { userId, type, status } = route.params;

    const [taskData, setTaskData] = useState([]);

    useEffect(() => {
        if (isFocused) {
            // Refetch data when the screen is in focus
            axios
                .get(`${baseUrl}/viewTaskManagment`, {
                    params: { employee_id: userId, type, status },
                })
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
    }, [isFocused, userId, type, status]);

    return (
        <View style={{ flex: 1 }}>
            <GoBack title="Task Manager" onPress={() => navigation.goBack()} />
            <View style={{ marginTop: 20 }}>
            </View>

            {taskData && taskData.length === 0 ? (
                <View style={styles.noTasksContainer}>
                    <Text style={styles.noTasksText}>No tasks are completed</Text>
                </View>
            ) : (
                <ScrollView style={styles.taskListContainer}>

                    {taskData.map((task, index) => (
                        <View style={styles.taskContainer} key={index}>
                            <View style={styles.taskContent}>
                                <View>
                                    <Text style={styles.taskTitle}>{task.title}</Text>
                                    <Text style={styles.taskLabel}>
                                        Created By{' '}:{' '}
                                        <Text style={styles.estimatedTimeText}>
                                            {(task.createdby?.employee_name)}
                                        </Text>
                                    </Text>
                                    <Text style={styles.taskLabel}>
                                        Assignee{' '}:{' '}
                                        <Text style={styles.estimatedTimeText}>
                                            {(task.Assignee?.employees_name)}
                                        </Text>
                                    </Text>
                                    <Text style={styles.taskLabel}>
                                        Status{' '}:{' '}
                                        <Text style={styles.estimatedTimeText}>
                                            {(task.status)}
                                        </Text>
                                    </Text>
                                    <Text style={styles.taskLabel}>

                                        Deadline{' '}:{' '}
                                        <Text style={styles.taskLabel}>
                                            {format(new Date(task.due_date), 'dd MMM yyyy ')}
                                            {task.estimated_time === '10 PM'
                                                ? task.estimated_time
                                                : format(new Date(task.estimated_time), 'hh:mm a')}
                                        </Text>
                                    </Text>
                                </View>
                            </View>
                        </View>

                    ))}
                </ScrollView>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
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
    labelValueContainer: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    label: {
        width: 100, // Adjust as needed to control the label width
        fontWeight: 'bold',
        fontSize: 17,
        color: 'gray',
    },
    value: {
        flex: 1,
        fontSize: 17,
        color: 'black',
    },
});

export default TaskStatisticsList