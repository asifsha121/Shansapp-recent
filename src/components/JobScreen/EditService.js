import React from "react";
import { Text,StyleSheet,View,TouchableWithoutFeedback,TextInput,Button } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import * as Yup from 'yup';
import { Formik } from "formik";
import { baseUrl } from "../../api/const";
import axios, { all } from "axios";
import { Dropdown ,MultiSelect } from 'react-native-element-dropdown';

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


export default function EditService({navigation,route}){

    const { job } = route.params;

    const[propaction,setPropaction]=React.useState([]);
    const[service,setService]=React.useState([]);
    const[serviceRequired,setServiceRequired]=React.useState([])
    const [isFocus, setIsFocus] = React.useState(false);
    const[spareparts,setSpareparts]=React.useState([])

    const proposedactionUrl=`${baseUrl}/viewProposedAction/proposed_action_list/proposed_action_dropdown`
    const servicetypeUrl=`${baseUrl}/viewServiceType/service_type_list/service_type_dropdown`
    const servicerequiredUrl=`${baseUrl}/viewPartsOrServiceRequired/parts_or_service_required_list/parts_or_service_required_dropdown`

    React.useEffect(()=>{
        axios.get(proposedactionUrl).then(res=>{
            const proposeactionArray=res.data.data.map((item)=>({
                id:item._id,
                proposed_action:item.proposed_action

            }))
            setPropaction(proposeactionArray);
        })
        axios.get(servicetypeUrl).then(res=>{
            const serviceArray=res.data.data.map((item)=>({
                id:item._id,
                service_type_name:item.service_type_name
                

            }))
            setService(serviceArray);
        })
        axios.get(servicerequiredUrl).then(res=>{
            const service_requiredArray=res.data.data.map((item)=>({
                id:item._id,
                parts_or_service_required:item.parts_or_service_required
                

            }))
            setServiceRequired(service_requiredArray);
        })
    },[])



    // console.log("job in edi page---------------",job)

    console.log("service++++++++++++++",service);

    console.log("propose-------------",propaction);
    console.log("required+++++++++++++",serviceRequired);

    return(
        <View style={styles.container}>
            <CustomButton title={`${job.sequence_no}`} onPress={()=>{navigation.goBack()}}/>
            <Formik
                initialValues={{action:'',action_id:'',service:'',service_id:'',service_charge:'',parts_or_service_required:'',parts_or_service_required_id:''}}
                onSubmit={(values)=>{
                    console.log("submit values",values)
                }}
            >
                {(props)=>{
                    return(
                        <View style={styles.form}>
                            <View style={styles.fieldmargin}>
                                <Text style={styles.fieldtext}>Diagnosis:</Text>
                            </View>
                            <View style={styles.fieldmargin}>
                                <Text style={styles.fieldtext}>Proposed Action:</Text>

                                <Dropdown
                                    style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
                                    data={propaction}
                                    search
                                    maxHeight={300}
                                    labelField="proposed_action"
                                    valueField="id"
                                    placeholder={props.values.action ?props.values.action : "Select Proposed Action"     }
                                    searchPlaceholder="Search Proposed Action"
                                    value={props.values?.action}
                                    onFocus={() => setIsFocus(true)}
                                    onBlur={() => setIsFocus(false)}
                                    onChange={item=>{
                                        console.log("action????????",item)
                                        // props.setFieldValue('customer',item)
                                        props.setFieldValue('action_id', item.id);
                                        props.setFieldValue('action', item.name); // Set the customer ID
                                        
                                    
                                    }}
                                />
                            </View>
                            <View style={styles.fieldmargin}>
                                <Text style={styles.fieldtext}>Service Type:</Text>

                                <Dropdown
                                    style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
                                    data={service}
                                    search
                                    maxHeight={300}
                                    labelField="service_type_name"
                                    valueField="id"
                                    placeholder={props.values.service ?props.values.service : "Select Service Type"     }
                                    searchPlaceholder="Search Service Type"
                                    value={props.values?.service_id}
                                    onFocus={() => setIsFocus(true)}
                                    onBlur={() => setIsFocus(false)}
                                    onChange={item=>{
                                        console.log("proposed????????",item)
                                        // props.setFieldValue('customer',item)
                                        props.setFieldValue('service_id', item.id);
                                        props.setFieldValue('service', item.name); // Set the customer ID
                                        
                                    
                                    }}
                                />
                            </View>
                            <View style={styles.fieldmargin}>
                                <Text style={styles.fieldtext}>Parts/Service Required:</Text>

                                <Dropdown
                                    style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
                                    data={serviceRequired}
                                    search
                                    maxHeight={300}
                                    labelField="parts_or_service_required"
                                    valueField="id"
                                    placeholder={props.values.parts_or_service_required ?props.values.parts_or_service_required : "Select Parts/Service Required"     }
                                    searchPlaceholder="Search Parts/Service Required"
                                    value={props.values?.parts_or_service_required}
                                    onFocus={() => setIsFocus(true)}
                                    onBlur={() => setIsFocus(false)}
                                    onChange={item=>{
                                        console.log("action????????",item)
                                        // props.setFieldValue('customer',item)
                                        props.setFieldValue('parts_or_service_required_id', item.id);
                                        props.setFieldValue('parts_or_service_required', item.name); // Set the customer ID
                                        
                                    
                                    }}
                                />
                            </View>
                            <View style={styles.fieldmargin}>
                                <Text style={styles.fieldtext}>Service Charge:</Text>

                                <TextInput
                                    style={styles.input}
                                    placeholder="Please enter Estimation"
                                    onChangeText={props.handleChange('service_charge')}
                                    value={props.values.service_charge}
                                    keyboardType="numeric"
                                />

                            </View>
                            <View>
                                <Text style={styles.heading}>Under Diagnosis</Text>
                            </View>
                            
                            <View style={{marginTop:7,}}>
                                <CustomAddButton title="Submit" onPress={props.handleSubmit}/>
                            </View>

                        </View>
                    )
                    
                }}

            </Formik>
        </View>

    )



}

const styles=StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:"White",
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