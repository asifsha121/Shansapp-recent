import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, ScrollView, Button } from 'react-native'
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Voice from '@react-native-voice/voice';
import { Dropdown } from 'react-native-element-dropdown';
import { baseUrl } from '../../api/const';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import GoBack from '../NavGoBack/GoBack';
import * as Speech from 'expo-speech';


const dropDownData = [
  { label: 'HIGH', value: 'HIGH' },
  { label: 'MEDIUM', value: 'MEDIUM' },
  { label: 'LOW', value: 'LOW' },
];

const languageDropDownData = [
  { label: "English (India)", value: "en-IN" },
  { label: "Malayalam (India)", value: "ml-IN" },
  { label: "Tamil (India)", value: "ta-IN" },

]

const employeeUrl = `${baseUrl}/viewEmployees/employee_list/employee_dropdown`;
const addTaskUrl = `${baseUrl}/createTaskManagment`
// const audioUploadUrl = `${baseUrl}/fileUpload?folder_name=addTaskAudio`;

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


const AddTask = () => {
  let [started, setStarted] = useState(false);
  let [results, setResults] = useState([]);
  const [taskDetails, setTaskDetails] = useState('');
  const [value, setValue] = useState(null);
  const [openDate, setOpenDate] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [openTime, setOpenTime] = useState(false);
  const [employee, setEmployee] = useState([]);
  const [isFocus, setIsFocus] = useState(false);
  const [adminData, setAdminData] = useState()
  const [selectedLanguage, setSelectedLanguage] = useState("en-IN")
  const [formData, setFormData] = useState({
    assignee: null, // Initialize with null or a default value
    priority: null, // Initialize with null or a default value
    taskTitle: '', // Initialize with null or a default value
  });
  //validation
  const [errors, setErrors] = useState({})


  // text to speech
  const speak = () => {
    const textToSay = taskDetails
    Speech.speak(textToSay)
  }


  const validateForm = () => {
    const newErrors = {};

    // Validate the taskTitle field (example: required field)
    if (!formData.taskTitle) {
      newErrors.taskTitle = 'Task Title is required';
    }

    if (!formData.priority) {
      newErrors.priority = 'Priority field is required';
    }

    if (!formData.assignee) {
      newErrors.assignee = 'Assignee field is required';
    }
    if (!taskDetails) {
      newErrors.taskDetails = 'Task Details field is required';
    }
    if (!selectedDate) {
      newErrors.selectedDate = 'Select Date';
    }
    if (!selectedTime) {
      newErrors.selectedTime = 'Time field is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const navigation = useNavigation()

  useEffect(() => {
    Voice.onSpeechError = onSpeechError;
    Voice.onSpeechResults = onSpeechResults;

    return () => {
      Voice.destroy().then(Voice.removeAllListeners)
    }
  }, [])

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

  console.log("Employeee details ", employee)


  const startSpeechToText = async () => {
    try {
      console.log("i am commit to speech to text")
      await Voice.start(selectedLanguage);
      setStarted(true);
    } catch (error) {
      console.log(error);
    }
  };

  const stopSpeechToText = async () => {
    await Voice.stop()
    setStarted(false)
  }

  const onSpeechResults = (result) => {
    console.log("onspeech results")
    console.log(result)
    const recognizedText = result.value.join(' ');

    // Split the recognized text into words
    const words = recognizedText.split(' ');

    // Create a Set to store unique words
    const uniqueWordsSet = new Set(words);

    // Convert the Set back to an array of unique words
    const uniqueWordsArray = Array.from(uniqueWordsSet);

    // Set taskDetails to the unique words
    setResults(uniqueWordsArray);
    // Update the task details with the speech results
    setTaskDetails((prevTaskDetails) => prevTaskDetails + ' ' + uniqueWordsArray.join(' '));
  };

  const onSpeechError = (error) => {
    console.log(error)
  }


  console.log("FormData: ", formData)
  console.log("taskDetails: ", taskDetails)
  console.log("selectedDate", selectedDate)
  console.log("selectedTime", selectedTime)
  console.log("Admindata: ", adminData)


  // Handle submiting
  const handleSubmit = async () => {
    const isFormValid = validateForm();
    if (!isFormValid) {
      return;
    }
    try {
      console.log("Loading......");
      const addTaskData = {
        "title": formData.taskTitle,
        "description": taskDetails,
        "status": "New",
        "due_date": selectedDate,
        "estimated_time": selectedTime,
        "priority": formData?.priority?.value || null,
        "assignee_id": formData?.assignee?.id || null,
        "created_by_id": adminData?.related_profile?._id,
        "created_by_name": adminData?.related_profile?.name || null,
        "warehouse_id": adminData?.warehouse_id || null,
        "is_scheduled": true,
        "daily_scheduler": true,
        "document": [],
        "participants": [],
        "watchers": [],
        "audio_url": null,
        "assignee": [
          formData?.assignee?.id || null,
        ]
      };
      const response = await axios.post(addTaskUrl, addTaskData);
      console.log(response.data);
      if (response.data.success === 'true') {
        // Task created successfully, show a success message
        Toast.show({
          type: 'invoiceSuccessToast',
          text1: 'Success',
          text2: 'Task Created Successfully',
          position: 'bottom',
        });
        navigation.navigate('TaskManager');
      } else {
        // Task creation failed, show an error message
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Failed to create task',
          position: 'bottom',
        });
        console.log(response);
      }
    } catch (error) {
      console.log(error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'An error occurred',
        position: 'bottom',
      });
    }
  };

  return (
    <View style={styles.container}>
      <View>
        <GoBack title="Add Task" onPress={() => navigation.goBack()} />
      </View>
      <ScrollView style={{ flex: 1 }}>

        <View style={styles.taskContainer}>
          <Text style={styles.label}>Task Title:</Text>
          <TextInput
            multiline
            numberOfLines={2}
            style={[styles.input, errors.taskTitle && styles.errorInput]}
            placeholder='Enter Task Title'
            value={formData.taskTitle}
            onChangeText={(text) => setFormData({ ...formData, taskTitle: text })}
          />
          {errors.taskTitle && <Text style={styles.errorText}>{errors.taskTitle}</Text>}
          {/* Dropdown select assignee */}
          <Text style={styles.label}>Assignee:</Text>
          <Dropdown
            style={[styles.dropdown, errors.assignee && styles.errorInput, isFocus && { borderColor: '#ffa600' }]}
            data={employee}
            search
            maxHeight={300}
            labelField="name"
            valueField="id"
            placeholder="Select Assignee"
            searchPlaceholder="Search Customers"
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            onChange={(item) => {
              const { name, id } = item; // Destructure the selected item
              setFormData({ ...formData, assignee: { name, id } }); // Store the name and id in the assignee property
            }}
          />
          {errors.assignee && <Text style={styles.errorText}>{errors.assignee}</Text>}
          <Text style={styles.label}>Language Support:</Text>
          <Dropdown
            style={[styles.dropdown, isFocus && { borderColor: '#ffa600' }]}
            data={languageDropDownData}
            maxHeight={300}
            labelField="label"
            valueField="value"
            value={selectedLanguage}
            // placeholder="English (India)"
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            onChange={(item) => setSelectedLanguage(item.value)}
          />
          <Text style={styles.label}>Enter Task:</Text>
          <TextInput
            multiline
            numberOfLines={4}
            style={[styles.taskInput, errors.taskDetails && styles.errorInput]}
            placeholder='Enter Task Details'
            value={taskDetails}
            onChangeText={(text) => setTaskDetails(text)}
          />
          {errors.taskDetails && <Text style={styles.errorText}>{errors.taskDetails}</Text>}

          <View style={styles.alignRight}>
            {!started ? (
              <TouchableOpacity onPress={startSpeechToText}>
                {/* <Text>Start Speech to Text</Text> */}
                <Image source={require("../../../assets/addTask/start-recorder.png")} style={{ width: 38, height: 35, alignSelf: "center" }} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={stopSpeechToText}>
                <Image source={require("../../../assets/addTask/stop-recorder.png")} style={{ width: 38, height: 35, alignSelf: "center" }} />
              </TouchableOpacity>
            )}
          </View>
          {taskDetails.length > 0 ? <TouchableOpacity style={{ padding: 10, borderColor: "red", backgroundColor: "#FF5733", borderRadius: 15, width: "50%", alignItems: 'center', alignSelf: "center" }} onPress={speak}>
            <Text style={{ color: "white" }}>Press To Hear Task</Text>
          </TouchableOpacity> : ""}
          <Text style={styles.label}>Due Date & Time:</Text>
          <View style={[styles.input, errors.selectedDate && styles.errorInput, errors.selectedTime && styles.errorInput, { flexDirection: 'row', justifyContent: 'space-between' }]}>
            <Text>
              {selectedDate ? selectedDate.toDateString() + (selectedTime ? "" : " - 10 PM") : 'Select a date & time'}
              {selectedTime ? ` - ${selectedTime.toLocaleTimeString()}` : ''}{' '}
            </Text>
            <View style={{ flexDirection: 'row', alignSelf: "flex-end" }}>
              <TouchableOpacity onPress={() => setOpenDate(true)}>
                <Image source={require("../../../assets/addTask/calendar.png")} style={{ width: 25, height: 25 }} />
              </TouchableOpacity>
              {/* <AntDesign name="calendar" size={24} color="black" onPress={() => setOpenDate(true)} /> */}
              {/* <AntDesign name="clockcircleo" size={24} color="black" onPress={() => setOpenTime(true)} style={{ marginLeft: 15 }} /> */}
              <TouchableOpacity onPress={() => setOpenTime(true)} >
                <Image source={require("../../../assets/addTask/time.png")} style={{ width: 25, height: 25, marginLeft: 15 }} />
              </TouchableOpacity>
            </View>
          </View>
          {errors.selectedDate || errors.selectedTime ? (
            <Text style={styles.errorText}>Date & time are required</Text>
          ) : null}

          {/* open calendar when icon is press */}

          {openDate && (
            <DateTimePicker
              testID="Assigned on date"
              value={new Date()}
              mode="date"
              onChange={(event, selectedDate) => {
                if (selectedDate !== undefined) {
                  setOpenDate(false);
                  setSelectedDate(selectedDate);
                  console.log("Selected Date:", selectedDate);
                }
              }}
              display="default"
            />
          )}

          {/* open time when icon is press */}

          {openTime && (
            <DateTimePicker
              testID="Assigned on time"
              value={selectedTime || new Date()}
              mode="time"
              positiveButton={{ label: 'OK', textColor: 'white' }}
              negativeButton={{ label: 'Cancel', textColor: 'red' }}
              is24Hour={true}
              display="spinner"
              onChange={(event, selectedTime) => {
                if (selectedTime !== undefined) {
                  setOpenTime(false);
                  setSelectedTime(selectedTime);
                  console.log("Selected Time:", selectedTime);
                }
              }}
            />
          )}
          <Text style={styles.label}>Priority:</Text>
          <Dropdown
            style={[styles.dropdown, errors.priority && styles.errorInput, isFocus && { borderColor: '#ffa600' }]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            data={dropDownData}
            maxHeight={250}
            labelField="label"
            valueField="value"
            placeholder="Select Priority"
            value={value}
            onChange={(item) => {
              const { label, value } = item; // Destructure the selected item
              setFormData({ ...formData, priority: { label, value } }); // Store the label and value in the priority property
            }}

          />
          {errors.priority && <Text style={styles.errorText}>{errors.priority}</Text>}
        </View>
      </ScrollView>
      <CustomSubmitButton title="Submit" onPress={handleSubmit} />
      {/* {results.map((result, index) => <Text key={index}>{result}</Text>)} */}
    </View>
  )
}
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
  label: {
    color: "#ffa600",
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 2,
    marginVertical: 10
  },
  input: {
    borderWidth: 0.9,
    paddingHorizontal: 10,
    paddingVertical: 5,
    fontSize: 18,
    borderRadius: 6,
    fontSize: 13,
    color: "black",
    fontWeight: "600",
    borderLeftWidth: 1.5,
    borderLeftColor: "#ffa600",
  },
  taskContainer: {
    padding: 15
  },
  taskInput: {
    borderWidth: 0.9,
    paddingHorizontal: 10,
    // paddingVertical: 15,
    paddingTop: 0,
    padding: 30,
    fontSize: 18,
    borderRadius: 6,
    fontSize: 13,
    color: "black",
    fontWeight: "600",
    borderRightWidth: 2.5,
    borderRightColor: "#ffa600",
    // marginVertical: 20
  },
  alignRight: {
    paddingVertical: 5,
    alignSelf: "flex-end"
  },
  datePicker: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    flex: 1,
    alignItems: "center"
  },
  dropdown: {
    borderRadius: 5,
    borderWidth: 0.9,
    paddingHorizontal: 10,
    borderRightWidth: 2.5,
    borderRightColor: "#ffa600",
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 5,
  },
  fill: {
    flex: 1,
    fontSize: 16,
  },
  errorInput: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    marginBottom: 1,
  },
})

export default AddTask