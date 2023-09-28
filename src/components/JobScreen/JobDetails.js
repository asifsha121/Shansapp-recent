import React, { useEffect } from "react";
import { View,Text,StyleSheet,TouchableWithoutFeedback, TouchableOpacity, ScrollView } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { baseUrl } from "../../api/const";
import axios, { all } from "axios";
import { useIsFocused } from "@react-navigation/native";



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

const Diagnosbutton =({title,onPress})=>{
    return(
        <TouchableOpacity onPress={onPress}>
            <View style={styles.diagnosbutton}>
                <Text style={styles.buttontitle}>{title}</Text>
            </View>
            

        </TouchableOpacity>
    );
}


export default function JobDetails({navigation,route}){

    const isfocused=useIsFocused();

    const { item } = route.params;
    const[detail,setDetail]=React.useState(item)

    const updateUrl=`${baseUrl}/updateJobRegistration`;

    const[diagnosis,setDiagnosis]=React.useState(false);

    console.log("itemS+++++++++++",item)

    useEffect(()=>{
        if(isfocused){
            setDetail(item)
        }

    },[item,isfocused])
    console.log("derails++++++++",detail);

    // const fetchJobsData = React.useCallback(async () => {
    //     try {
    //         const response = await axios.get(updateUrl);
    //         const updatedItem = response.data.data; // Assuming the response contains the updated item data
    //         // Update the 'item' state with the updated data
    //         setItem(updatedItem);
    //     } catch (error) {
    //         console.error("Error fetching data:", error);
    //     }
    // }, [updateUrl]);

    // React.useEffect(() => {
    //     fetchJobsData(); // Fetch data when the component mounts
    // }, [fetchJobsData]);

    // React.useEffect(() => {
    //     const unsubscribe = navigation.addListener("focus", () => {
    //         const shouldRefresh = route.params?.refresh;
    //         if (shouldRefresh) {
    //             // Add your refresh logic here
    //             console.log("Refreshing Jobscreen...");
    //             fetchJobsData(); // Fetch updated data
    //             // Refresh logic: Fetch updated data, re-render components, etc.
    //         }
    //     });

    //     return unsubscribe;
    // }, [navigation, route.params, fetchJobsData]);

    return(
        
            <View style={styles.container}>
                    <CustomButton title={`${detail?.sequence_no}`}  onPress={() => navigation.goBack()} />
                    <ScrollView>
                        <View style={styles.buttonarray}>
                            {(diagnosis || detail.job_stage==="under_diagnosis") ? (
                                <Diagnosbutton title="Complete Diagnosis" onPress={()=>{console.log("Completessss")}}/>
                            ):(
                                <Diagnosbutton title="start diagnosis" onPress={()=>{
                                    console.log("pressed")
                                    setDiagnosis(true);
                                    axios.put(updateUrl,{job_stage:"under_diagnosis",_id:detail.id}).then(res=>{console.log("diagosis+++++++++",res.data)}).catch(err=>console.log(err));
                                    }}/>
                            )}
                            
                            <Diagnosbutton title="ReAssign" onPress={()=>{navigation.navigate('Reassign',{job:detail})}}/>
                            <Diagnosbutton title="Cancel Service" onPress={()=>{navigation.navigate('Cancel',{job:detail})}}/>
                        </View>

                        {(diagnosis || detail.job_stage==="under_diagnosis")  && (
                            <View  style={styles.editbutton}>
                                <Diagnosbutton title="Edit" onPress={()=>{navigation.navigate('EditService',{job:detail})}}/>
                            </View>
                        )
                            

                        }
                        {(diagnosis || detail.job_stage==="under_diagnosis") ? (
                            <Text style={styles.heading}>Under Diagnosis</Text>
                        ) :(
                            <Text style={styles.heading}>PENDING FOR SERVICE</Text>
                        )}
                        

                        <View style={styles.itemborder}>
                            <View style={styles.sectionmargin}>
                                <Text style={{fontWeight:'700',}}>CUSTOMER INFORMATION</Text>
                                <View style={styles.field}>
                                    <Text>Customer Name:</Text>
                                    < Text style={styles.fielddata}>{detail.customer_name || '--'}</Text>
                                </View>
                                <View style={styles.field}>
                                    <Text>Mobile:</Text>
                                    <Text style={styles.fielddata}>{detail.customer_mobile || '--'}</Text>
                                </View>
                                <View style={styles.field}>
                                    <Text>Email:</Text>
                                    <Text style={styles.fielddata}>{detail.customer_email || '--'}</Text>
                                </View>
                                <View style={styles.field}>
                                    <Text>Return Job Order Number:</Text>
                                    <Text style={styles.fielddata}>{detail.job_return_no || '--'}</Text>
                                </View>
                            </View>

                        </View>

                        <View style={styles.itemborder}>
                            <View style={styles.sectionmargin}>
                                <Text style={{fontWeight:'700',}}>JOB SHEET</Text>
                                <View style={styles.field}>
                                    <Text>Warehouse/Shop:</Text>
                                    < Text style={styles.fielddata}>{detail.warehouse_name || '--'}</Text>
                                </View>
                                <View style={styles.field}>
                                    <Text>Incoming Date:</Text>
                                    <Text style={styles.fielddata}>{detail.incoming_date || '--'}</Text>
                                </View>
                                <View style={styles.field}>
                                    <Text>Created On:</Text>
                                    <Text style={styles.fielddata}>{detail.created_on || '--'}</Text>
                                </View>
                                <View style={styles.field}>
                                    <Text>Created By:</Text>
                                    <Text style={styles.fielddata}>{detail.sales_person_name   || '--'}</Text>
                                </View>
                            </View>

                        </View>

                        <View style={styles.itemborder}>
                            <View style={styles.sectionmargin}>
                                <Text style={{fontWeight:'700',}}>PRODUCT ATTRIBUTE</Text>
                                <View style={styles.field}>
                                    <Text>Device:</Text>
                                    < Text style={styles.fielddata}>{detail.device_name || '--'}</Text>
                                </View>
                                <View style={styles.field}>
                                    <Text>Brand:</Text>
                                    <Text style={styles.fielddata}>{detail.brand_name || '--'}</Text>
                                </View>
                                <View style={styles.field}>
                                    <Text>Consumer Model:</Text>
                                    <Text style={styles.fielddata}>{ detail.consumer_model_name|| '--'}</Text>
                                </View>
                                <View style={styles.field}>
                                    <Text>Serial No:</Text>
                                    <Text style={styles.fielddata}>{   detail.serial_no || '--'}</Text>
                                </View>
                            </View>

                        </View>
                        <View style={styles.itemborder}>
                            <View style={styles.sectionmargin}>
                                <Text style={{fontWeight:'700',}}>ACCESSORIES</Text>
                                <View style={styles.field}>
                                        <Text>Accessories:</Text>
                                        {detail.accessories.map((item,index)=>(
                                            < Text key={index} style={styles.fielddata}>{index > 0 ? ", " : ""}{item || '--'}</Text>
                                ))}
                                </View>
                            </View>

                        </View>

                        <Text style={styles.heading}>COMPLAINTS/SERVICE REQUESTS</Text>

                        {detail.job_complaints_or_service_request.map((item,index)=>(
                            <View key={index} style={styles.itemborder}>
                                <View style={styles.sectionmargin}>
                                    <View style={styles.field}>
                                        <Text>Complaint/Service Type:</Text>
                                        < Text style={styles.fielddata}>{item.complaint_type_name || '--'}</Text>
                                    </View>
                                    <View style={styles.field}>
                                        <Text>Remarks:</Text>
                                        < Text style={styles.fielddata}>{item.remarks || '--'}</Text>
                                    </View>

                                </View>

                            </View>

                        ))}

                        

                        <View style={styles.itemborder}>
                            <View style={styles.sectionmargin}>
                                <Text style={{fontWeight:'700',}}>JOB CREATION REMARKS</Text>
                                <View style={styles.field}>
                                    <Text>Assigned To:</Text>
                                    < Text style={styles.fielddata}>{item.assignee_name || '--'}</Text>
                                </View>
                                <View style={styles.field}>
                                    <Text>Assigned On:</Text>
                                    <Text style={styles.fielddata}>{item.assigned_on || '--'}</Text>
                                </View>
                                <View style={styles.field}>
                                    <Text>Total Estimation:</Text>
                                    <Text style={styles.fielddata}>{ item.total_sale_estimation|| '--'}</Text>
                                </View>
                                
                            </View>

                        </View>
                </ScrollView>

                    
            </View>
    )

}

const styles=StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'white',
    },
    heading:{
        fontWeight:'bold',
        fontSize:15,
        marginVertical:15,
        marginHorizontal:17,

    },
    sectionmargin:{
        
        marginHorizontal:15,
        marginVertical:10,

    },
    itemborder:{
        borderWidth:0.7,
        borderRadius:6,
        borderColor:"black",
        marginHorizontal:15,
        marginTop:15,
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
    field:{
        flexDirection:'row',
        
    },
    fielddata:{
        marginLeft:5,
        fontWeight:'700',
    },
    diagnosbutton:{
        textAlign: "center",
        padding:10,
        borderWidth:.7,
        borderRadius:10,
        borderColor:"#ffa600",

        // padding: 10,
        
        backgroundColor: "#ffa600",
    },
    buttonarray:{
        flexDirection:'row',
        marginHorizontal:15,
        marginVertical:10,
        justifyContent:'space-evenly'
        
    },
    buttontitle:{
        textAlign:'center',
        color: "white"
    },
    editbutton:{
        flexDirection:'row',
        marginHorizontal:15,
        marginVertical:10,
        justifyContent:'flex-end',
    },
    }
)