import React from "react";
import { Text,View,StyleSheet,TextInput,TouchableWithoutFeedback,Button } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import * as Yup from 'yup';
import { Formik } from "formik";
import DateTimePicker from '@react-native-community/datetimepicker';
import { baseUrl } from "../../api/const";
import axios, { all } from "axios";
import { Dropdown ,MultiSelect } from 'react-native-element-dropdown';



export const AddSchema = Yup.object().shape({
    
    assignedto_id:Yup.string().required('Select Employee'),
    assigned_on:Yup.date().required('Select Date'),
    



})

const CustomAddButton = ({ title, onPress }) => {
    return (
    <TouchableWithoutFeedback onPress={onPress}>
        <View style={styles.addbutton}>
        <Text style={styles.addtitle}>{title}</Text>
        </View>
    </TouchableWithoutFeedback>
    );
};




const CustomButton = ({ title, onPress }) => {
    return (
        <TouchableWithoutFeedback onPress={onPress}>
            <View style={styles.button}>
                <AntDesign name="left" size={14} color="black" />
                <Text style={styles.title}>{title}</Text>
            </View>
        </TouchableWithoutFeedback>
        );
    };



export default function ReAssign({navigation,route}){

    const employeeUrl=`${baseUrl}/viewEmployees/employee_list/employee_dropdown`;
    const updateUrl=`${baseUrl}/updateJobRegistration`;

    const[employee,setEmployee]=React.useState([]);
    const [isFocus, setIsFocus] = React.useState(false);

    const { job } = route.params;
    // console.log("itemmssss",job)


    React.useEffect(()=>{

        axios.get(employeeUrl).then((res)=>{

            const employeeArray=res.data.data.map((item)=>({
                id:item._id,
                name:item.name
            }))

            setEmployee(employeeArray)
        })



    },[])

    const[openDate,setOpenDate]=React.useState(false)

    return (
            <View style={styles.container}>
                <CustomButton title="Re-Assign" onPress={() => navigation.goBack()} />
                <Formik
                    initialValues={{ assigned_on: '', assigned_to: '',assignedto_id:'' }}
                    validationSchema={AddSchema}
                    onSubmit={(values) => {
                    // Handle form submission here
                    console.log('Form values:', values);
                    const body={
                        _id:job.id,
                        assignee_id:values.assignedto_id,
                        assignee_name:values.assigned_to,
                        assigned_on:values.assigned_on

                    }
                    console.log(body);
                    axios.put(updateUrl,body).then(res=>{
                        console.log("url message",res.data)
                        navigation.goBack({ refresh: true })
                    }).catch(err=>console.log("urlerror",err))
                    }}
                >
                    {(props) => (
                    <View style={styles.form}>
                        <View style={styles.fieldmargin}>
                            <Text style={styles.fieldtext}> Assigned On:</Text>
                            <View
                            style={[
                                styles.input,
                                { flexDirection: 'row', justifyContent: 'space-between' },
                            ]}
                            >
                            <TextInput
                                
                                placeholder="Select Date"
                                onChangeText={props.handleChange('assigned_on')} // Change 'date' to 'assigned_on'
                                value={props.values.assigned_on} // Change 'date' to 'assigned_on'
                                onBlur={props.handleBlur('assigned_on')} // Change 'date' to 'assigned_on'
                            />
                            <AntDesign
                                name="calendar"
                                size={24}
                                color="black"
                                onPress={() => setOpenDate(true)}
                            />
                            </View>
                
                            {openDate && (
                            <DateTimePicker
                                testID="Assigned on date"
                                value={new Date()}
                                mode="date"
                                onChange={(event, selectedDate) => {
                                if (selectedDate !== undefined) {
                                    setOpenDate(false);
                                    // Set the 'assigned_on' field in Formik
                                    props.setFieldValue(
                                    'assigned_on',
                                    selectedDate.toISOString().split('T')[0]
                                    );
                                    console.log('Selected Date:', selectedDate);
                                }
                                }}
                                display="default"
                            />
                            )}

                            {props.touched.assigned_on && props.errors.assigned_on &&
                                <Text style={styles.errorText}>{props.errors.assigned_on}</Text>
                            }


                        </View>
                        <View style={styles.fieldmargin}>
                                <Text style={styles.fieldtext}>
                                    Assigned To:
                                </Text>
                                <Dropdown
                                    style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
                                    data={employee}
                                    search
                                    maxHeight={300}
                                    labelField="name"
                                    valueField="id"
                                    placeholder={props.values.assignedto_id ?props.values.assignedto_id : "Select employee"     }
                                    searchPlaceholder="Search Employees"
                                    value={props.values?.assignedto_id}
                                    onFocus={() => setIsFocus(true)}
                                    onBlur={() => setIsFocus(false)}
                                    onChange={item=>{
                                        console.log("employee+++++",item)
                                        // props.setFieldValue('customer',item)
                                        props.setFieldValue('assignedto_id', item.id);
                                        props.setFieldValue('assigned_to', item.name); // Set the customer ID
                                        
                                    
                                    }}
                                />
                            {props.touched.assignedto_id && props.errors.assignedto_id &&
                                <Text style={styles.errorText}>{props.errors.assignedto_id}</Text>
                            }
                            </View >
                        
            
                        {/* Add a submit button to submit the form */}
                        <View style={{marginTop:7,}}>
                            <CustomAddButton title="Submit" onPress={props.handleSubmit}/>
                        </View>
                    </View>
                    )}
                </Formik>
            </View>
        );




}

const styles=StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'white'
    },
    button: {
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        backgroundColor: "#ffa600",
        },
    title: {
        marginLeft: 34,
        fontSize: 15,
        color: "white"
        },
    
    form:{
        marginVertical:5,
        marginHorizontal:25,
            
            
    },
    input:{
        borderWidth:0.5,
        borderColor:"black",
        paddingHorizontal: 10,
        paddingVertical:7,
        fontSize:18,
        borderRadius:6,
        maxWidth:390,
        marginTop:5,
    },
    fieldtext:{
        // color:"#ffa600",
        fontWeight:"400",
        fontSize:14,
    },
    fieldmargin:{
        marginVertical:2,
        justifyContent:'center',

    },
    dropdown: {
        height: 50,
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical:7,
    },
    errorText: {
        fontSize: 12,
        color: 'red',
        marginTop: 5,
    },
    addbutton: {
        
        padding: 10,
        alignItems: "center",
        backgroundColor: "#ffa600",
        borderRadius: 13,
    },
    addtitle: {
        fontSize: 15,
        color: "white"
    },
})