import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { PieChart } from "react-native-gifted-charts";
import { useNavigation } from "@react-navigation/native";
import GoBack from "../NavGoBack/GoBack";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScrollView } from "react-native";
import { baseUrl } from "../../api/const";
import axios from "axios";


export default function TaskStatistics() {
    const navigation = useNavigation();


    const [user, setUser] = useState(null);



    const renderDot = color => {
        return (
            <View
                style={{
                    height: 10,
                    width: 10,
                    borderRadius: 5,
                    backgroundColor: color,
                    marginRight: 10,
                }}
            />
        );
    };


    const [create_by_task, set_create_by_task] = useState([]);
    const [asigned_by_task, set_asigned_by_task] = useState([]);
    const [total_task_data, set_total_task_data] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const storedData = await AsyncStorage.getItem('adminDetails');
                if (storedData !== null) {
                    const userData = JSON.parse(storedData);
                    setUser(userData);
                } else {
                    setUser(null); // Set user to null if data is not found
                }
            } catch (error) {
                console.log('error fetching data', error);
                setUser(null); // Set user to null in case of an error
            }
        };

        fetchData();
    }, []);





    const userId = user && user.related_profile && user.related_profile._id;

    const userName = user && user.related_profile && user.related_profile.name;

    console.log("user _id:", userId);

    console.log("name", userName)


    //URL for statistics
    const statUrl = userId ? `${baseUrl}/taskManagementDashboard?employee_id=${userId}` : '';

    useEffect(() => {
        axios.get(statUrl).then(res => {
            console.log(res.data);
            console.log("")
            set_asigned_by_task(res.data.asigned_by_task);
            set_create_by_task(res.data.create_by_task);
            set_total_task_data(res.data.total_task_data);
        }).catch(err => { console.log("Statics update data", err) });
    }, [userId])


    console.log("Create", typeof (create_by_task));
    console.log("assign", asigned_by_task);
    console.log("total", total_task_data);


    //for conditional rendering of Component
    const shouldRenderContent =
        Object.keys(create_by_task).length > 0 &&
        Object.keys(asigned_by_task).length > 0 &&
        Object.keys(total_task_data).length > 0;


    //variable that stores values of piechart
    const createByTaskData = [
        {
            value: (create_by_task.completed_task_managments / create_by_task.totalCount) * 100,
            color: "#c0ff8c",
            text: `${(create_by_task.completed_task_managments / create_by_task.totalCount) * 100}%`,
        },
        {
            value: (create_by_task.pending_task_managments / create_by_task.totalCount) * 100,
            color: "#8beafe",
            text: `${(create_by_task.pending_task_managments / create_by_task.totalCount) * 100}%`,
        },
        {
            value: (create_by_task.due_task_managments / create_by_task.totalCount) * 100,
            color: "#fd8d9e",
            text: `${(create_by_task.due_task_managments / create_by_task.totalCount) * 100}%`,
        },
    ];

    //filter to  only take values greater than zero for piechart 
    const filteredCreateByTaskData = createByTaskData.filter(item => item.value > 0);

    //variable that stores values of piechart
    const asigned_by_task_data = [
        {
            value: (asigned_by_task.completed_task_managments / asigned_by_task.totalCount) * 100,
            color: "#c0ff8c",
            text: `${(asigned_by_task.completed_task_managments / asigned_by_task.totalCount) * 100}%`,
        },
        {
            value: (asigned_by_task.pending_task_managments / asigned_by_task.totalCount) * 100,
            color: "#8beafe",
            text: `${(asigned_by_task.pending_task_managments / asigned_by_task.totalCount) * 100}%`,
        },
        {
            value: (asigned_by_task.due_task_managments / asigned_by_task.totalCount) * 100,
            color: "#fd8d9e",
            text: `${(asigned_by_task.due_task_managments / asigned_by_task.totalCount) * 100}%`,
        },
    ];

    //filter to  only take values greater than zero for piechart 
    const filtered_asigned_by_task_data = asigned_by_task_data.filter(item => item.value > 0);


    //variable that stores values of piechart
    const total_task_data_data = [
        {
            value: (total_task_data.completed_task_managments / total_task_data.totalCount) * 100,
            color: "#c0ff8c",
            text: `${(total_task_data.completed_task_managments / total_task_data.totalCount) * 100}%`,
        },
        {
            value: (total_task_data.pending_task_managments / total_task_data.totalCount) * 100,
            color: "#8beafe",
            text: `${(total_task_data.pending_task_managments / total_task_data.totalCount) * 100}%`,
        },
        {
            value: (total_task_data.due_task_managments / total_task_data.totalCount) * 100,
            color: "#fd8d9e",
            text: `${(total_task_data.due_task_managments / total_task_data.totalCount) * 100}%`,
        },
    ];

    //filter to  only take values greater than zero for piechart 
    const filtered_total_task_data_data = total_task_data_data.filter(item => item.value > 0);

    return (
        <View style={styles.container}>
            <GoBack title="Task Statistcs" onPress={() => navigation.goBack()} />

            <ScrollView>
                {shouldRenderContent ? (
                    <View style={styles.content}>
                        <View style={styles.field}>
                            <Text style={styles.empname}>Employee Name:</Text>
                            <Text style={styles.empvalue}>{userName}</Text>
                        </View>

                        <View style={styles.field}>
                            <Text style={styles.fieldname}>Total Task:</Text>
                            <Text style={styles.fielddata}>{total_task_data.totalCount}</Text>
                        </View>

                        <View style={{ flexDirection: "row" }}>
                            <TouchableOpacity style={[styles.field]} onPress={() => navigation.navigate('TaskStatisticsList', { userId: userId, type: "all", status: "completed" })}>
                                <Text style={styles.fieldname}>Completed :</Text>
                                <Text style={[styles.fielddata]}>{total_task_data.completed_task_managments}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.field, { marginLeft: 15 }]} onPress={() => navigation.navigate('TaskStatisticsList', { userId: userId, type: "all", status: "pending" })}>
                                <Text style={styles.fieldname}>Pending :</Text>
                                <Text style={[styles.fielddata]}>{total_task_data.pending_task_managments}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.field, { marginLeft: 15 }]} onPress={() => navigation.navigate('TaskStatisticsList', { userId: userId, type: "all", status: "overdue" })}>
                                <Text style={styles.fieldname}>Overdue :</Text>
                                <Text style={[styles.fielddata]}>{total_task_data.due_task_managments}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ alignItems: "center" }}>

                            <PieChart showText textColor="#3e3812" focusOnPress radius={100} textSize={13} data={filtered_total_task_data_data}
                            />
                        </View>

                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'center',
                                marginBottom: 10,
                            }}>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    width: 120,
                                    marginRight: 20,
                                }}>
                                {renderDot('#c0ff8c')}
                                <Text>Compeleted: {(total_task_data.completed_task_managments / total_task_data.totalCount) * 100}%</Text>
                            </View>
                            <View
                                style={{ flexDirection: 'row', alignItems: 'center', width: 120 }}>
                                {renderDot('#8beafe')}
                                <Text>Pending: {(total_task_data.pending_task_managments / total_task_data.totalCount) * 100}%</Text>
                            </View>
                            <View
                                style={{ flexDirection: 'row', alignItems: 'center', width: 120 }}>
                                {renderDot('#fd8d9e')}
                                <Text>Overdue: {(total_task_data.due_task_managments / total_task_data.totalCount) * 100}%</Text>
                            </View>
                        </View>

                        <View style={styles.field}>
                            <Text style={styles.fieldname}>Task Created By Employee :</Text>
                            <Text style={styles.fielddata}>{create_by_task.totalCount}</Text>
                        </View>
                        <View style={{ flexDirection: "row" }}>
                            <TouchableOpacity style={styles.field} onPress={() => navigation.navigate('TaskStatisticsList', { userId: userId, type: "created_by", status: "completed" })}>
                                <Text style={styles.fieldname}>Completed :</Text>
                                <Text style={[styles.fielddata]}>{create_by_task.completed_task_managments}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.field, { marginLeft: 15 }]} onPress={() => navigation.navigate('TaskStatisticsList', { userId: userId, type: "created_by", status: "pending" })}>
                                <Text style={styles.fieldname}>Pending :</Text>
                                <Text style={[styles.fielddata]}>{create_by_task.pending_task_managments}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.field, { marginLeft: 15 }]} onPress={() => navigation.navigate('TaskStatisticsList', { userId: userId, type: "created_by", status: "overdue" })}>
                                <Text style={styles.fieldname}>Overdue :</Text>
                                <Text style={[styles.fielddata]}>{create_by_task.due_task_managments}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ alignItems: "center" }}>
                            <PieChart showText textColor="#3e3812" focusOnPress radius={100} textSize={13} data={filteredCreateByTaskData}
                            />
                        </View>
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'center',
                                marginBottom: 10,
                            }}>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    width: 120,
                                    marginRight: 20,
                                }}>
                                {renderDot('#c0ff8c')}
                                <Text>Compeleted: {(create_by_task.completed_task_managments / create_by_task.totalCount) * 100}%</Text>
                            </View>
                            <View
                                style={{ flexDirection: 'row', alignItems: 'center', width: 120 }}>
                                {renderDot('#8beafe')}
                                <Text>Pending: {(create_by_task.pending_task_managments / create_by_task.totalCount) * 100}%</Text>
                            </View>
                            <View
                                style={{ flexDirection: 'row', alignItems: 'center', width: 120 }}>
                                {renderDot('#fd8d9e')}
                                <Text>Overdue: {(create_by_task.due_task_managments / create_by_task.totalCount) * 100}%</Text>
                            </View>
                        </View>

                        <View style={styles.field}>
                            <Text style={styles.fieldname}>Task Assigned to Employee :</Text>
                            <Text style={styles.fielddata}>{asigned_by_task.totalCount}</Text>
                        </View>
                        <View style={{ flexDirection: "row" }}>
                            <TouchableOpacity style={styles.field} onPress={() => navigation.navigate('TaskStatisticsList', { userId: userId, type: "assigned_by", status: "completed" })}>

                                <Text style={styles.fieldname}>Completed :</Text>
                                <Text style={[styles.fielddata]}>{asigned_by_task.completed_task_managments}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.field, { marginLeft: 15 }]} onPress={() => navigation.navigate('TaskStatisticsList', { userId: userId, type: "assigned_by", status: "pending" })}>

                                <Text style={styles.fieldname}>Pending :</Text>
                                <Text style={[styles.fielddata]}>{asigned_by_task.pending_task_managments}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={[styles.field, { marginLeft: 15 }]} onPress={() => navigation.navigate('TaskStatisticsList', { userId: userId, type: "assigned_by", status: "overdue" })}>
                                <Text style={styles.fieldname}>Overdue :</Text>
                                <Text style={[styles.fielddata]}>{asigned_by_task.due_task_managments}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ alignItems: "center" }}>
                            <PieChart showText textColor="#3e3812" focusOnPress radius={100} textSize={13} data={filtered_asigned_by_task_data}
                            />
                        </View>
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'center',
                                marginBottom: 10,
                            }}>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    width: 120,
                                    marginRight: 20,
                                }}>
                                {renderDot('#c0ff8c')}
                                <Text>Compeleted: {(asigned_by_task.completed_task_managments / asigned_by_task.totalCount) * 100}%</Text>
                            </View>
                            <View
                                style={{ flexDirection: 'row', alignItems: 'center', width: 120 }}>
                                {renderDot('#8beafe')}
                                <Text>Pending: {(asigned_by_task.pending_task_managments / asigned_by_task.totalCount) * 100}%</Text>
                            </View>
                            <View
                                style={{ flexDirection: 'row', alignItems: 'center', width: 120 }}>
                                {renderDot('#fd8d9e')}
                                <Text>Overdue: {(asigned_by_task.due_task_managments / asigned_by_task.totalCount) * 100}%</Text>
                            </View>
                        </View>


                    </View>

                ) : (
                    <Text>Loading...</Text>
                )}


            </ScrollView>

        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    field: {
        flexDirection: 'row',


    },
    empname: {
        fontSize: 20,
        marginBottom: 10,
    },
    empvalue: {
        fontSize: 20,
        marginLeft: 5,
    },
    fieldname: {
        fontSize: 15,
    },
    fielddata: {
        marginLeft: 5,
        marginBottom: 5,
        fontWeight: '700',
        fontSize: 15,
    },
    content: {
        marginHorizontal: 20,
        marginVertical: 10,
    },
    pieChartContainer: {
        alignItems: 'center', // Center the content horizontally
        marginVertical: 20,
    },
    chartLegend: {
        flexDirection: 'row',
        alignItems: 'center',
        width: 120,
        marginVertical: 5,
    },
})
