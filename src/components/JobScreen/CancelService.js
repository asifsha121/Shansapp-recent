import React from "react"
import { Text,View,StyleSheet,TouchableWithoutFeedback,TextInput,Button } from "react-native"
import { baseUrl } from "../../api/const"
import { AntDesign } from "@expo/vector-icons";
import { Formik } from "formik";
import axios, { all } from "axios";

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

const CustomAddButton = ({ title, onPress }) => {
        return (
        <TouchableWithoutFeedback onPress={onPress}>
            <View style={styles.addbutton}>
            <Text style={styles.addtitle}>{title}</Text>
            </View>
        </TouchableWithoutFeedback>
        );
};

export default function CancelService({navigation,route}){

    const { job } = route.params;

    const updateUrl=`${baseUrl}/updateJobRegistration`;

    return(
        <View style={styles.container}>
            <CustomButton title="Cancel Service" onPress={() => navigation.goBack()} />
            <Formik
                initialValues={{ remarks: '' }}
                onSubmit={(values) => {
                // Handle form submission here
                console.log('Form values:', values);
                const body={
                    _id:job.id,
                    job_stage_close_reason:values.remarks,
                    job_stage:"cancelled",
                    

                }
                console.log(body);
                axios.put(updateUrl,body).then(res=>{
                    console.log("url message",res.data)
                    navigation.navigate('Jobscreen',{ refresh: true })
                }).catch(err=>console.log("urlerror",err))
                }}
            >
            {(props)=>(
                <View style={styles.form}>
                    <View style={styles.fieldmargin}>
                        <Text style={styles.fieldtext}>Please state reason for cancellation:</Text>
                        <View style={styles.remarkinput}>

                            <TextInput
                                
                                multiline={true}
                                numberOfLines={4}
                                onChangeText={props.handleChange('remarks')}
                                value={props.values.remarks}
                                placeholder="Enter remarks"
                                textAlignVertical="top"

                            />

                        </View>

                    </View>
                    <View style={{marginTop:7,}}>
                            <CustomAddButton title="Submit" onPress={props.handleSubmit}/>
                    </View>
                </View>
            )}

            </Formik>
        </View>
        
    )
}

const styles=StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:"white",
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
        remarkinput:{
            borderWidth:0.5,
            borderColor:"black",
            paddingHorizontal: 10,
            paddingTop:5,
            // fontSize:12,
            borderRadius:6,
            maxWidth:350,
            
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