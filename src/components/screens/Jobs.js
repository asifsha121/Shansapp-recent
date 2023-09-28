import React, { useEffect,useCallback } from "react"
import { Text, View, StyleSheet, ScrollView,TouchableOpacity,TouchableWithoutFeedback,Image } from "react-native"
import Calender from "../Calender/Calender";
import { FAB } from 'react-native-paper';
import { AntDesign } from '@expo/vector-icons';
import HorizontalCalendar from "../Calender/Calender";
import { baseUrl } from "../../api/const";
import axios from "axios";
import WeekCalendar from "react-native-calendars/src/expandableCalendar/WeekCalendar";


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


export default function Jobs({ navigation,route }) {
    const[jobs,setJobs]=React.useState([])
    
    const [date, setDate] = React.useState(new Date());

    const formattedDate = date.toISOString().slice(0, 10);

    const viewJobs= `${baseUrl}/viewJobRegistration`


    const fetchJobsData = useCallback(() => {
        axios
        .get(viewJobs)
        .then((res) => {
            const jobArray = res.data.data.map((item) => ({
                id:item._id,
                sequence_no:item.sequence_no,
                invoice_date:item.invoice_date,
                created_on:item.created_on ? item.created_on.split("T")[0] : null,
                created_date:item.created_date? item.created_date.split("T")[0] : null,
                customer_id:item.customer_id,
                customer_name:item.customer_name,
                customer_mobile:item.customer_mobile,
                customer_email:item.customer_email,
                job_return_no:item.job_return_no,
                warehouse_name:item.warehouse_name,
                incoming_date:item.incoming_date ? item.incoming_date.split("T")[0] : null, 
                warehouse_name:item.warehouse_name,
                sales_person_name:item.sales_person_name,
                device_name:item.device_name,
                brand_name:item.brand_name,
                consumer_model_name:item.consumer_model_name,
                serial_no:item.serial_no, 
                accessories:item.accessories.map((accessory) => accessory.accessory_name),
                job_complaints_or_service_request:item.job_complaints_or_service_request.map((request)=>({complaint_type_name:request.complaint_type_name,remarks:request.remarks})),
                assignee_name:item.assignee_name,
                assigned_on:item.assigned_on ? item.assigned_on.split("T")[0] : null,
                total_sale_estimation:item.total_sale_estimation,
                job_stage:item.job_stage,
            }));
            setJobs(jobArray);
        })
        .catch((err) => console.log(err));
    }, [viewJobs]);
    
    useEffect(() => {
        fetchJobsData(); // Fetch data when the component mounts
    }, [fetchJobsData]);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
        const shouldRefresh = route.params?.refresh;
        if (shouldRefresh) {
            // Add your refresh logic here
            console.log('Refreshing Jobscreen...');
            fetchJobsData()
            // Refresh logic: Fetch updated data, re-render components, etc.
        }
        });
    
        return unsubscribe;
    }, [navigation, route.params]);

    useEffect(()=>{
        axios.get(viewJobs).then(res=>{
            const jobArray=res.data.data.map((item)=>({
                id:item._id,
                sequence_no:item.sequence_no,
                invoice_date:item.invoice_date,
                created_on:item.created_on ? item.created_on.split("T")[0] : null,
                created_date:item.created_date? item.created_date.split("T")[0] : null,
                customer_id:item.customer_id,
                customer_name:item.customer_name,
                customer_mobile:item.customer_mobile,
                customer_email:item.customer_email,
                job_return_no:item.job_return_no,
                warehouse_name:item.warehouse_name,
                incoming_date:item.incoming_date ? item.incoming_date.split("T")[0] : null, 
                warehouse_name:item.warehouse_name,
                sales_person_name:item.sales_person_name,
                device_name:item.device_name,
                brand_name:item.brand_name,
                consumer_model_name:item.consumer_model_name,
                serial_no:item.serial_no, 
                accessories:item.accessories.map((accessory) => accessory.accessory_name),
                job_complaints_or_service_request:item.job_complaints_or_service_request.map((request)=>({complaint_type_name:request.complaint_type_name,remarks:request.remarks})),
                assignee_name:item.assignee_name,
                assigned_on:item.assigned_on ? item.assigned_on.split("T")[0] : null,
                total_sale_estimation:item.total_sale_estimation,
                job_stage:item.job_stage,
            }))
            setJobs(jobArray)
        }).catch(err=>console.log(err));
    },[formattedDate])

    console.log("jobsssss_______",jobs)

    return (
        <View style={styles.container}>
            <CustomButton title="Jobs"  onPress={() => navigation.goBack()} />
            {/* <WeekCalendar date={date} onChange={(newDate) => setDate(newDate)} /> */}
        
            {/* <HorizontalCalendar/> */}
            <ScrollView>
                {jobs.map(item=>(
                    <View key={item.id}>
                        
                            <TouchableOpacity  onPress={()=>{navigation.navigate('JobDetail',{item:item})}}>
                                    <View style={styles.item}>
                                        <View style={{flexDirection:'row',}}>  
                                            <Image source={require("../../../assets/job/settings.png")} style={styles.tinyLogo}/>
                                            <View style={styles.itemtext}>
                                                <Text style={styles.text}>{item.sequence_no}</Text>
                                                <Text style={styles.text}>{item.customer_name}</Text>
                                                <Text style={[styles.text,{color:'#ffa600',fontWeight:'700'}]}>{item.job_stage}</Text>
                                            </View>

                                        </View>
                                        
                                        <AntDesign name="arrowright" size={24} color="black" style={{alignSelf:'center',}} />
                                    
                                    </View>
                            </TouchableOpacity>
                        
                            
                        

                        

                    </View>
                ))}
            </ScrollView>
            <FAB
                style={styles.fab}
                icon={() => <AntDesign name="plus" size={24} color="white" />}
                onPress={() => navigation.navigate('AddJobscreen')}
            />
        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: 'white',
        // alignItems: 'center',
        // justifyContent: 'center',
    },

    fab: {
        position: 'absolute',
        right: 28,
        bottom: 200,
        backgroundColor: '#ffa600',
        borderRadius: 30,
        width: 60,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
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
    item:{
        marginHorizontal:15,
        marginBottom:50,
        flexDirection:'row',
        justifyContent:'space-between',
        

    },
    tinyLogo: {
        alignSelf:'center',
        width: 40,
        height: 40,
        
    },
    itemtext:{
        marginHorizontal:15,
    },
    text:{
        marginBottom:3,
    },
    
});