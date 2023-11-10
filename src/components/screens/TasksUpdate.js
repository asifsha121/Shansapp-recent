import React, { useState, useCallback, useEffect } from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Modal, Button, ScrollView } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import DateTimePicker from '@react-native-community/datetimepicker';
import GoBack from '../NavGoBack/GoBack';
import { format } from 'date-fns';
import { baseUrl } from '../../api/const';
import axios from 'axios';
import * as DocumentPicker from 'expo-document-picker';
import { ActivityIndicator } from "react-native-paper";
import { Audio } from 'expo-av';
import { AntDesign } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import SpeechToText from '../SpeechToText/SpeechToText';
import { languageDropDownData } from '../../constants/constant';
import * as Speech from "expo-speech"

// bottomButtton
const CustomSubmitButton = ({ title, onPress }) => {
    return (
        <View style={styles.submitButtonContainer}>
            <TouchableOpacity onPress={onPress}>
                <View style={styles.submitButtonContent}>
                    <Text style={styles.submitButtonTitle}>{title}</Text>
                </View>
            </TouchableOpacity>
        </View>
    );
};



const dropDownState = [
    { label: 'Closed', value: 'Closed' },
    { label: 'Resolved', value: 'Resolved' },
    { label: 'In Progress', value: 'In Progress' },
    { label: 'Hold', value: 'Hold' },
    { label: 'New', value: 'New' }, // hold resolved closed
];

const dropDownPriority = [
    { label: 'HIGH', value: 'HIGH' },
    { label: 'MEDIUM', value: 'MEDIUM' },
    { label: 'LOW', value: 'LOW' },
];


const employeeUrl = `${baseUrl}/viewEmployees/employee_list/employee_dropdown`;
const imageUploadUrl = `${baseUrl}/fileUpload?folder_name=addTaskUpdates`;
const addTaskUpdatesUrl = `${baseUrl}/updateTaskManagment`;



const TasksUpdate = ({ navigation, route }) => {

    const { task } = route.params;
    const id = task?._id
    const detailTaskurl = `${baseUrl}/viewTaskManagment/${id}`

    const [isFocus, setIsFocus] = useState(false);
    const [openDueDate, setOpenDueDate] = useState(false);
    const [selectedDueDate, setSelectedDueDate] = useState(null);
    const [selectedDueTime, setSelectedDueTime] = useState(null);
    const [openTime, setOpenTime] = useState(false);
    const [employee, setEmployee] = useState([]);
    const [formData, setFormData] = useState({ assignee: null, })

    const [selectedLanguage, setSelectedLanguage] = useState('en-IN');

    console.log("Task Updating Details ......:", task);


    // Add state variables for other fields
    const [status, setStatus] = useState('');
    const [taskTitle, setTaskTitle] = useState('');
    const [priority, setPriority] = useState('');
    const [remarks, setRemarks] = useState('');
    const [description, setDescription] = useState('')
    const [taskStartDateAndTime, setTaskDateAndTime] = useState();
    const [taskDueTime, setTaskDueTime] = useState('')
    const [taskDueDateAndTime, setTaskDueDateAndTime] = useState();

    //checking creator or not while updating details
    const [taskCreatorId, setTaskCreatorId] = useState('')

    //modal
    const [isModalVisible, setIsModalVisible] = useState(false);

    // loadingIndicator
    const [isLoading, setIsLoading] = useState(false)


    // const [isModalVisible, setModalVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    const [adminData, setAdminData] = useState()

    //update container data
    const [taskAddUpdates, setTaskAddUpdates] = useState([]);

    // add updates modal
    // speech to text and change 
    const [taskDetails, setTaskDetails] = useState('');
    // add updates validation
    const [errors, setErrors] = useState({})

    const validateForm = () => {
        const newErrors = {};

        // Validate the taskTitle field (example: required field)
        // if (!selectedImage) {
        //     newErrors.taskTitle = 'Select a image is required';
        // }

        if (!taskDetails) {
            newErrors.taskDetails = 'Update Details field is required';
        }


        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };



    // const toggleModal = () => {
    //   setModalVisible(!isModalVisible);
    // };


    // Define a state variable to hold the audio object
    // const [audio, setAudio] = useState(null);




    console.log("Status", status)
    console.log("TaskTitle", taskTitle)
    // console.log("Assignee", formData.assignee._id)
    console.log("FormData: ", formData)
    console.log("Remarks", remarks)



    // text to speech
    const Speak = () => {
        const textToSay = description
        Speech.speak(textToSay)
    }

    // add updates playback
    const onPlayButtonClick = (audio) => {
        Speech.speak(audio)
    }

    // we can also use this
    // const onPlayButtonClick = (audio) => {
    //     if (audio) {
    //         Speech.speak(audio);
    //     } else {
    //         Speech.speak(description); // Use the description as default if no audio is provided
    //     }
    // }




    // Foramating time  and date 
    const formatTime = (date) => {
        if (date) {
            const hours = date.getHours();
            const minutes = date.getMinutes();
            const formattedHours = hours < 10 ? `0${hours}` : `${hours}`;
            const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
            return `${formattedHours}:${formattedMinutes}`;
        }
        return ''; // Return an empty string if date is null
    };


    // Usage
    const selectedTimeString = formatTime(selectedDueTime);

    const combineDateAndTime = (date, time) => {
        const defaultTime = '22:00';

        if (date) {
            const combinedDateTime = new Date(date);

            if (time) {
                const timeParts = selectedTimeString.split(':'); // Use the formatted time string
                combinedDateTime.setHours(parseInt(timeParts[0]));
                combinedDateTime.setMinutes(parseInt(timeParts[1]));
            } else {
                const defaultTimeParts = defaultTime.split(':');
                combinedDateTime.setHours(parseInt(defaultTimeParts[0]));
                combinedDateTime.setMinutes(parseInt(defaultTimeParts[1]));
            }

            combinedDateTime.setSeconds(0);
            return combinedDateTime;
        }

        return null;
    };


    const combinedDateTime = combineDateAndTime(selectedDueDate, selectedDueTime);

    const fetchAddUpdatesData = async () => {
        try {
            const response = await axios.get(detailTaskurl);
            const taskAddUpdates = response.data.data[0].task_add_update;
            setTaskAddUpdates(taskAddUpdates);
        } catch (error) {
            console.error('Task Details API Error:', error);
        }
    };


    //fetching data to use update contaainer 
    // Call the fetchDetailTaskData function when the component mounts
    useEffect(() => {
        fetchAddUpdatesData();
    }, []);


    //fetching admin Data 
    useEffect(() => {
        const fetchAdminDetails = async () => {
            try {
                const adminDetails = await AsyncStorage.getItem('adminDetails');
                if (adminDetails !== null) {
                    const parsedAdminDetails = JSON.parse(adminDetails);
                    setAdminData(parsedAdminDetails);
                }
            } catch (error) {
                console.log("Error fetching admin details:", error);
            }
        };
        fetchAdminDetails();
    }, []);


    useEffect(() => {
        // Log the adminData whenever it changes
        console.log("adminData:", adminData);
    }, [adminData]);


    console.log('Updates-------------------:', taskDetails);
    const handleSave = async () => {
        const isFormValid = validateForm();
        if (!isFormValid) {
            return;
        }
        console.log('Updates-------------------:', taskDetails);
        console.log('Selected Image:', selectedImage);
        try {

            const addTaskUpdatesData = {
                "task_managment_id": id,
                "create_task_add_update": [
                    {
                        "requested_by": adminData?.related_profile?._id,
                        "requested_by_name": adminData?.related_profile?.name,
                        "updates": taskDetails || null,
                        "image_url": selectedImage || null,
                    }
                ]
            }
            try {
                const response = await axios.put(addTaskUpdatesUrl, addTaskUpdatesData);
                console.log("API Response:", response.data);
                if (response.data.status === 'true') {
                    Toast.show({
                        type: 'success', // Set the type to 'successToast' for success
                        text1: 'Success',
                        text2: 'Add Updates Created',
                        position: 'top',
                    });
                } else {
                    Toast.show({
                        type: 'error', // Set the type to 'errorToast' for failure
                        text1: 'Error',
                        text2: 'Failed to create task',
                        position: 'bottom',
                    });
                    console.log(response);
                }


            } catch (error) {
                console.log("Axios Error:", error);
                // Handle the error, e.g., display an error message to the user
            } finally {
                fetchAddUpdatesData();
            }
            // Clear the input fields
            setTaskDetails('');
            setSelectedImage(null);


        } catch (error) {
            console.log(error)

        }


        // Close the modal
        toggleModal();
    };

    // Step 3: Function to open and close the modal
    const toggleModal = () => {
        setIsModalVisible(!isModalVisible);
    };


    const selectDoc = async () => {
        try {
            setIsLoading(true); // Set loading to true when fetching starts

            const doc = await DocumentPicker.getDocumentAsync({ multiple: false, type: 'image/*' });

            if (!doc.canceled) {
                const fileUri = doc.assets[0].uri;
                const fileName = fileUri.split('/').pop();
                const contentType = `image/${fileName.split('.').pop()}`;

                const fileData = {
                    uri: fileUri,
                    type: contentType,
                    name: fileName,
                };

                const formData = new FormData();
                formData.append('file', fileData);

                const config = {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                };

                const response = await axios.post(imageUploadUrl, formData, config);

                if (response.data && response.data.data) {
                    const uploadUrl = response.data.data;
                    setSelectedImage(uploadUrl);
                    console.log('Upload successful. API response:', uploadUrl);
                } else {
                    console.log('Upload failed. Unexpected API response:', response.data);
                }
            }
        } catch (error) {
            console.log("Error:", error);
        } finally {
            setIsLoading(false); // Set loading to false when fetching is done
        }
    };

    // Set initial state values based on the task details
    useEffect(() => {
        // Parse create_date string into a Date object
        const createDate = new Date(task.create_date);
        const dueDate = new Date(task.due_date)
        const dueTime = new Date(task?.estimated_time)
        const formattedTime =
            task?.estimated_time === '10 PM'
                ? task?.estimated_time
                : format(dueTime, 'hh:mm a');



        // Format the date as yyyy-MM-dd HH:mm
        const formattedCreateDate = format(createDate, 'yyyy-MM-dd hh:mm a');

        //format the due date as yyyy-MM-dd HH:mm
        const formattedDueDate = format(dueDate, 'yyyy-MM-dd');

        // Set the formatted date as the initial value of Start Date
        setTaskDateAndTime(formattedCreateDate);
        setTaskDueDateAndTime(formattedDueDate)
        setTaskDueTime(formattedTime)

        //setStatus(task.status); // Set Status based on task.status
        setTaskTitle(task.title); // Set Task Title based on task.title
        setPriority(task.priority); // Set Priority based on task.priority you can also use this line on placeholder other wise you can set priority in this useEffect 
        //   setRemarks(task.description); // Set Remarks based on task.description
        setDescription(task.description) //
        setStatus(task?.status || "Select Status")
        setRemarks(task?.remarks || "")
        setTaskCreatorId(task?.created_by_id)
    }, [task]);
    //fetching employee details
    useEffect(() => {
        axios.get(employeeUrl).then((res) => {

            const employeeArray = res.data.data.map((item) => ({
                id: item._id,
                name: item.name
            }))
            setEmployee(employeeArray)
        })
    }, [])


    const isTaskCreator = adminData?.related_profile._id === taskCreatorId
    console.log("isTaskCreator---------------:", isTaskCreator)
    // Memoize the onFocus and onBlur event handlers
    const handleFocus = useCallback(() => {
        setIsFocus(true);
    }, []);

    const handleBlur = useCallback(() => {
        setIsFocus(false);
    }, []);


    //handling submit 
    const handleTaskUpdateSubmit = async () => {
        try {
            console.log('Loading.....')
            const updateData = {
                "task_managment_id": id,
                "title": taskTitle,
                "description": description,
                "due_date": combinedDateTime,
                "estimated_time": combinedDateTime,
                "status": status,
                "priority": priority,
                "assignee_id": formData?.assignee?.id || null,
                "assignee": formData?.assignee?.id || null,
                "assignee_name": formData?.assignee?.name || null,
                "remarks": remarks,
                "is_scheduled": true,
                "daily_scheduler": true,
                "weakly_scheduler": [],
                "monthly_scheduler": [],
                "updated_by_name": adminData?.related_profile?.name,
                "updated_by_id": adminData?.related_profile?._id
            }
            console.log("Update Task Data:", updateData)
            const response = await axios.put(addTaskUpdatesUrl, updateData)
            if (response.data.status === 'true') {
                Toast.show({
                    type: 'success', // Set the type to 'successToast' for success
                    text1: 'Success',
                    text2: 'Task Updated Successfully',
                    position: 'bottom',
                });
                navigation.navigate('TaskManager')
            } else {
                Toast.show({
                    type: 'error', // Set the type to 'errorToast' for failure
                    text1: 'Error',
                    text2: 'Failed to create task',
                    position: 'bottom',
                });
                console.log(response);
            }
            console.log(response.data)
            console.log("API Response: ", response.data)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <View style={styles.container}>
            <GoBack title="Task Updates" onPress={() => navigation.goBack()} />
            <ScrollView contentContainerStyle={styles.scrollViewContent}>


                <View style={styles.taskUpdatesContainer}>
                    <View style={styles.statusAndAddContainer}>
                        <View style={styles.statusContainer}>
                            <Text style={styles.label}>Status:</Text>
                            <Dropdown
                                style={[styles.dropdown, isFocus && { borderColor: '#ffa600' }]}
                                data={dropDownState}
                                maxHeight={300}
                                placeholder={status}
                                onFocus={handleFocus}
                                onBlur={handleBlur}
                                labelField="label"
                                valueField="value"
                                value={status}
                                onChange={(item) => {
                                    setStatus(item.value);
                                    // validateStatus(item.value); // Validate the selected status
                                }}
                            />

                        </View>
                        <View style={styles.addButtonContainer}>
                            <TouchableOpacity
                                style={styles.addButton}
                                onPress={toggleModal}
                            >
                                <Text style={styles.addButtonLabel}>Add{' '}Updates</Text>
                            </TouchableOpacity>
                        </View>
                        <Modal visible={isModalVisible} transparent animationType="slide">
                            <View style={styles.modalContainer}>
                                <View style={styles.modalContent}>

                                    <Text style={styles.modalLabel}>Add Updates</Text>
                                    <Dropdown
                                        data={languageDropDownData}
                                        labelField="label"
                                        valueField="value"
                                        value={selectedLanguage}
                                        onChange={(item) => setSelectedLanguage(item.value)}
                                    />
                                    <TextInput
                                        placeholder="Enter your updates"
                                        value={taskDetails}
                                        onChangeText={(text) => setTaskDetails(text)}
                                        multiline
                                        style={[styles.input, styles.textArea]}
                                    />
                                    {errors.taskDetails && <Text style={styles.errorText}>{errors.taskDetails}</Text>}
                                    <SpeechToText setTaskDetails={setTaskDetails} selectedLanguage={selectedLanguage} />
                                    <TouchableOpacity onPress={selectDoc}>
                                        <View style={{ position: 'relative', width: 100, height: 100 }}>
                                            {isLoading && (
                                                <ActivityIndicator
                                                    size="medium"
                                                    color="#0000ff"
                                                    style={{
                                                        position: 'absolute',
                                                        top: '50%',
                                                        left: '50%',
                                                        transform: [{ translateX: -25 }, { translateY: -25 }],
                                                        zIndex: 1,
                                                    }}
                                                />
                                            )}
                                            <Image
                                                source={
                                                    selectedImage
                                                        ? { uri: selectedImage }
                                                        : require('../../../assets/updateTask/image.png')
                                                }
                                                style={{
                                                    width: 100,
                                                    height: 100,
                                                    marginTop: 5,
                                                    marginBottom: 10,
                                                    borderWidth: 1,
                                                    borderColor: "black"
                                                }}
                                            />
                                        </View>
                                    </TouchableOpacity>



                                    {/* Add image selection here */}
                                    {/* Example: <ImagePicker setSelectedImage={setSelectedImage} /> */}
                                    {/* ... (image selection code) */}

                                    <View style={styles.buttonContainer}>
                                        <View style={[styles.roundedButton, { marginRight: 10 }]}>
                                            <Button
                                                title="Cancel"
                                                onPress={toggleModal}
                                                color="#FF5733" // Change button color
                                                // style={{ width: 100, height: 40 }} // Change button width and height
                                                titleStyle={{ fontSize: 16 }} // Change button title style
                                            />
                                        </View>
                                        <View style={[styles.roundedButton]}>
                                            <Button
                                                title="Save"
                                                onPress={handleSave}
                                                color="#4CAF50" // Change button color
                                                titleStyle={{ fontSize: 16 }} // Change button title style
                                            />
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </Modal>
                    </View>

                    <Text style={styles.label}>Task Title:</Text>
                    <TextInput
                        multiline
                        numberOfLines={2}
                        style={[styles.input]}
                        placeholder='Enter Task Title'
                        value={taskTitle}
                        onChangeText={setTaskTitle}
                        editable={isTaskCreator}
                    />

                    <Text style={styles.label}>Assignee:</Text>
                    <Dropdown
                        style={[styles.dropdown, isFocus && { borderColor: '#ffa600' }]}
                        data={employee}
                        search
                        maxHeight={300}
                        labelField="name"
                        valueField="id"
                        // value={task.assignee.employees_name}
                        placeholder={task?.Assignee?.employees_name}
                        searchPlaceholder="Search Customers"
                        onFocus={() => setIsFocus(true)}
                        onBlur={() => setIsFocus(false)}
                        onChange={(item) => {
                            const { name, id } = item; // Destructure the selected item
                            setFormData({ ...formData, assignee: { name, id } }); // Store the name and id in the assignee property
                        }}
                    />
                    <Text style={styles.label}>Start Date:</Text>
                    <View style={[styles.input, { flexDirection: 'row', justifyContent: 'space-between' }]}>
                        <Text>
                            {taskStartDateAndTime ? taskStartDateAndTime : ""}
                            {/* {selectedStartTime ? ` - ${selectedStartTime.toLocaleTimeString()}` : ''}{' '} */}
                        </Text>
                    </View>
                    {/* Due Date */}
                    <Text style={styles.label}>Due Date:</Text>
                    <View style={[styles.input, { flexDirection: 'row', justifyContent: 'space-between' }]}>
                        <Text>
                            {selectedDueDate ? selectedDueDate.toDateString() : taskDueDateAndTime}{'  '}
                            {selectedDueTime ? ` -  ${selectedDueTime.toLocaleTimeString()}` : taskDueTime}{' '}
                        </Text>
                        <View style={{ flexDirection: 'row', alignSelf: "flex-end" }}>
                            {isTaskCreator && (
                                <>
                                    <TouchableOpacity onPress={() => setOpenDueDate(true)}>
                                        <Image source={require("../../../assets/addTask/calendar.png")} style={{ width: 25, height: 25 }} />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => setOpenTime(true)} >
                                        <Image source={require("../../../assets/addTask/time.png")} style={{ width: 25, height: 25, marginLeft: 15 }} />
                                    </TouchableOpacity>
                                </>
                            )}
                        </View>
                    </View>

                    {/* Due Date */}
                    {/* Open calendar when icon is pressed */}
                    {openDueDate && (
                        <DateTimePicker
                            testID="Due Date"
                            value={new Date()}
                            mode="date"
                            onChange={(event, dueSelectedDate) => {
                                if (dueSelectedDate !== undefined) {
                                    setOpenDueDate(false);
                                    setSelectedDueDate(dueSelectedDate);
                                    console.log("Selected Due Date:", dueSelectedDate);
                                }
                            }}
                            display="default"
                        />
                    )}
                    {/* Open time when icon is pressed */}
                    {openTime && (
                        <DateTimePicker
                            testID="Due Time"
                            value={new Date()}
                            mode="time"
                            positiveButton={{ label: 'OK', textColor: 'red' }}
                            negativeButton={{ label: 'Cancel', textColor: 'red' }}
                            is24Hour={true}
                            display="spinner"
                            onChange={(event, dueSelectedTime) => {
                                if (dueSelectedTime !== undefined) {
                                    setOpenTime(false);
                                    setSelectedDueTime(dueSelectedTime);
                                    console.log("Due Selected Time:", dueSelectedTime);
                                }
                            }}
                        />
                    )}
                    <Text style={styles.label}>Priority:</Text>
                    <Dropdown
                        style={[styles.dropdown]}
                        data={dropDownPriority}
                        maxHeight={300}
                        placeholder="Select Priority"
                        labelField="label"
                        valueField="value"
                        value={priority}
                        onChange={(value) => setPriority(value)}
                        disable={!isTaskCreator}
                    />
                    <Text style={styles.label}>Remarks:</Text>
                    <TextInput
                        multiline
                        numberOfLines={4}
                        style={[styles.longText]}
                        placeholder='Enter Remarks'
                        value={remarks}
                        onChangeText={(text) => setRemarks(text)}
                    />
                    <Text style={styles.label}>Description:</Text>
                    <TextInput
                        multiline
                        numberOfLines={4}
                        style={[styles.longText]}
                        placeholder='Enter Task Title'
                        value={description}
                        editable={isTaskCreator}
                        onChangeText={(text) => setDescription(text)}

                    />
                    <Text style={styles.label}>Play Back</Text>
                    <TouchableOpacity onPress={Speak}>
                        <AntDesign name="play" size={24} color="green" />
                    </TouchableOpacity>
                    <View style={styles.updateContainer}>
                        <Text style={styles.updateLabel}>Updates:</Text>
                        {taskAddUpdates.map((update, index) => (
                            <View key={index} style={[styles.updateCard, { flexDirection: 'row' }]}>
                                {update.image_url ? (
                                    <TouchableOpacity onPress={() => navigation.navigate('TaskUpdateFullScreenImage', { imageUrl: update.image_url })}>
                                        <Image source={{ uri: update.image_url }} style={{ width: 100, height: 100, marginLeft: 3 }} />
                                    </TouchableOpacity>
                                ) : (

                                    <Image source={require("../../../assets/updateTask/image.png")} style={{ width: 100, height: 100, marginLeft: 3 }} />

                                )}
                                <View style={styles.cardContent}>
                                    <Text style={{ color: "black", fontSize: 14, maxWidth: "80%" }}>
                                        {update.updates || "No updates available"}
                                    </Text>
                                    <View style={{ flexDirection: 'row', alignItems: "center" }}>

                                        <Text style={{ color: "gray", fontWeight: 600, marginTop: 10 }}>{update?.requested_by_name}</Text>
                                        <TouchableOpacity onPress={() => onPlayButtonClick(update.updates)}>
                                            <AntDesign name="playcircleo" size={24} color="blue" style={{ marginLeft: 70 }} />
                                        </TouchableOpacity>
                                    </View>
                                    <Text style={{ color: "gray", fontWeight: 600, marginTop: 5 }}> {format(new Date(update.create_date), 'dd MMM yyyy h:mm a')}</Text>
                                </View>
                            </View>
                        ))}
                    </View>

                </View>
            </ScrollView>
            <CustomSubmitButton
                title="Update"
                onPress={handleTaskUpdateSubmit}

            />

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    taskUpdatesContainer: {
        padding: 15,
    },
    scrollViewContent: {
        flexGrow: 1,
    },
    input: {
        borderWidth: 0.9,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 6,
        fontSize: 13,
        color: "black",
        fontWeight: "600",
        marginBottom: 8,
    },
    label: {
        color: "#343230",
        fontWeight: "bold",
        fontSize: 16,
        marginBottom: 2,
        marginVertical: 3,
    },
    addButton: {
        backgroundColor: '#07d7c7',
        padding: 10,
        borderRadius: 6,
    },
    addButtonLabel: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
    },
    statusAndAddContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        // justifyContent: "center",
        marginBottom: 10, // Add space between Status and Task Title
    },
    statusContainer: {
        // flex: 1, // Take 50% of the available space for Status,
        width: "60%",
    },
    addButtonContainer: {
        width: "35%", // Add some space between Status and Add button
        marginTop: 20,
    },
    dropdown: {
        borderRadius: 5,
        borderWidth: 0.9,
        paddingHorizontal: 10,
    },
    longText: {
        borderWidth: 0.9,
        paddingHorizontal: 10,
        paddingTop: 0,
        padding: 30,
        fontSize: 18,
        borderRadius: 6,
        fontSize: 13,
        color: "black",
        fontWeight: "600",
    },
    modalContainer: {
        // padding: 50,
        marginVertical: 100,
        marginHorizontal: 25,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "white"
    },
    modalHeader: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    textArea: {
        height: 100,
    },

    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Add a semi-transparent background
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        width: '90%',
        // height: "40%"
    },
    // modalContent: {
    //     backgroundColor: 'white',
    //     padding: 20,
    //     borderRadius: 10,
    //     alignSelf: 'center', // Center horizontally
    //     justifyContent: 'center', // Center vertically
    //     width: '90%', // Adjust the width as needed
    //   },
    modalLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        borderRadius: 30,
        justifyContent: 'space-between',
        marginTop: 15
    },
    roundedButton: {
        flex: 1,
        borderRadius: 10, // Adjust this value to control border radius
        overflow: 'hidden', // This is important to clip the button's content
        // marginHorizontal: 5, // Adjust this for spacing between buttons
    },
    updateContainer: {
        borderWidth: 0.9,
        marginVertical: 10,
        paddingHorizontal: 10,
        // paddingVertical: 65,
        paddingBottom: 15,
        borderRadius: 6,
        fontSize: 13,
        color: "black",
        // alignItems:"flex-start"           
    },
    updateLabel: {
        marginTop: 10,
        color: "#343230",
        fontWeight: "bold",
        fontSize: 16,
        paddingBottom: 15
    },
    updateCard: {
        paddingHorizontal: 10,
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
    }, cardContent: {
        marginHorizontal: 20
    },
    submitButtonContent: {
        padding: 10,
        alignItems: "center",
        backgroundColor: "#ffa600",
        borderRadius: 13,
    },
    submitButtonTitle: {
        fontSize: 15,
        color: "white"
    },
    submitButtonContainer: {
        marginHorizontal: 20,
        marginVertical: 10,
    },
    errorText: {
        color: 'red',
        marginBottom: 1,
    },
});

export default TasksUpdate;