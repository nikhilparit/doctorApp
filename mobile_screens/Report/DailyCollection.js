import React, { useState, useEffect } from "react";
import { View, ScrollView, SafeAreaView, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import {
    FormControl,
    Input,
    Text,
    Box,
    Stack,
    VStack,
    Button,
    Flex,
    Modal,
    HStack,
    Center,
    NativeBaseProvider,
    Radio,
    Popover,
    Divider
} from 'native-base';
import moment from "moment";
import CommonStylesheet from "../../common_stylesheet/CommonStylesheet";
import Icon from 'react-native-vector-icons/FontAwesome5';
import Axios from "axios";
import Api from "../../api/Api";
import Loader from "../../components/Loader";
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getHeaders } from "../../utils/apiHeaders";
const regularFontSize = width < 600 ? 12 : 14;
const { height, width } = Dimensions.get('window');
const DailyCollection = ({ route }) => {
    const navigation = useNavigation();
    // const myclinicID = route.params.clinicID
    // //console.log('ID at Daily Collection', myclinicID);
    const today = moment().tz("Asia/Kolkata").format('YYYY-MM-DD');
    const [reportData, setReportData] = useState([]);
    const [totalamt, setTotalAmt] = useState('');
    const [patientID, setPatientID] = useState('');
    const [receiptID, setReceiptID] = useState('');
    const [clinicID, setClinicID] = useState('');
    //Modal Pop-ups
    const [showModal, setShowModal] = useState(false);
    const [ShowModal1, setShowModal1] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [viewType, setviewType] = useState('');
    const [viewForDate, setViewForDate] = useState('');
    const [token, setToken] = useState('');
    //Loader
    const [loading, setLoading] = useState(false);



    //Year wise start date, end date calculations
    //const currentYear = moment().format('YYYY');
    // const startDate = moment(`${currentYear}-01-01`);
    // const endDate = moment(`${currentYear}-12-31`);

    //Handing All dates at filter
    const [startDate, setstartDate] = useState(today);
    const [endDate, setendDate] = useState(today);
    const [selectedDateType, setSelectedDateType] = useState(null);
    const [showPicker, setShowPicker] = useState(false);
    const [customDate1, setCustomDate1] = useState('');
    const [customDate2, setCustomDate2] = useState('');
    const [category, setCategory] = useState([]);
    //Handing data at select view

    
    const readData = async () => {
        const headers = await getHeaders();
        const userString = await AsyncStorage.getItem('user');
        const user = JSON.parse(userString);
        setClinicID(user.clinicID)
        setviewType('');
        setViewForDate('');
        const formData = {
            clinicID: user.clinicID,
            startDate: startDate,
            endDate: startDate,
            providerID: "",
            modeofpayment: "All",
            reportType: "",
            sortOrder: "",
            sortColumn: "",
            pageIndex: 0,
            pageSize: 0,
            communicationGroupMasterGuid: "00000000-0000-0000-0000-000000000000"
        }
        //console.log('Data To Pass', formData);
        setLoading(true);
        try {
            Axios.post(`${Api}Report/GetDailyCollectionReportDataForMobile`, formData, { headers }).then(resp => {
                //console.log('Daily Collection Report Data', resp.data);
                setReportData(resp.data);
                const data = resp.data;
                if (data.length == 0) {
                    setPatientID('00000000-0000-0000-0000-000000000000');
                } else {
                    setPatientID(data[0].patientID);
                }

                const totalAmount = data.map(item => item.treatmentPayment);
                let sum = 0;
                totalAmount.forEach((number) => {
                    sum += number;
                });
                setTotalAmt(sum)
                //console.log(sum);
                setLoading(false);
            });
        } catch (error) {
            //console.log(error);
        }
        try {
            const response = await Axios.post(`${Api}Setting/GetApplicationLookupsDetailByCategory?clinicid=${user.clinicID}&itemCategory=ModeOfPayment`, {}, {
                headers: headers
            });
            setCategory(response.data); // Set the fetched data to state
        } catch (error) {
            //console.log(error);
        }

    };
    const resetDate = () => {
        setstartDate('');
        setendDate('');
        setCustomDate1('');
        setCustomDate2('');
    }
    useEffect(() => {
        readData();
    }, []);

    const handleView = async(viewType) => {
      const headers = await getHeaders(); 
        //console.log(viewType);
        setviewType(viewType);
        switch (viewType) {
            case viewType:
                //console.log(viewType);
                const formData0 = {
                    clinicID: clinicID,
                    startDate: moment(startDate).format('YYYY-MM-DD'),
                    endDate: moment(endDate).format('YYYY-MM-DD'),
                    providerID: "",
                    modeofpayment: viewType,
                    reportType: "",
                    sortOrder: "",
                    sortColumn: "",
                    pageIndex: 0,
                    pageSize: 0,
                    communicationGroupMasterGuid: "00000000-0000-0000-0000-000000000000"
                }
                //console.log('Data To Pass', formData0);
                setLoading(true);
                try {
                    Axios.post(`${Api}Report/GetDailyCollectionReportDataForMobile`, formData0, { headers }).then(resp => {
                        //console.log('Daily Collection Report Data', resp.data);
                        setReportData(resp.data);
                        const data = resp.data;
                        const totalAmount = data.map(item => item.treatmentPayment);
                        let sum = 0;
                        totalAmount.forEach((number) => {
                            sum += number;
                        });
                        setTotalAmt(sum)
                        //console.log(sum);
                        setLoading(false);
                    });
                } catch (error) {
                    //console.log(error);
                }
                setModalVisible(false);
                break;
            case 'All':
                //console.log(viewType);
                const formData1 = {
                    clinicID: clinicID,
                    startDate: moment(startDate).format('YYYY-MM-DD'),
                    endDate: moment(endDate).format('YYYY-MM-DD'),
                    providerID: "",
                    modeofpayment: 'All',
                    reportType: "",
                    sortOrder: "",
                    sortColumn: "",
                    pageIndex: 0,
                    pageSize: 0,
                    communicationGroupMasterGuid: "00000000-0000-0000-0000-000000000000"
                }
                //console.log('Data To Pass', formData1);
                setLoading(true);
                try {
                    Axios.post(`${Api}Report/GetDailyCollectionReportDataForMobile`, formData1, { headers }).then(resp => {
                        //console.log('Daily Collection Report Data', resp.data);
                        setReportData(resp.data);
                        const data = resp.data;
                        const totalAmount = data.map(item => item.treatmentPayment);
                        let sum = 0;
                        totalAmount.forEach((number) => {
                            sum += number;
                        });
                        setTotalAmt(sum)
                        //console.log(sum);
                        setLoading(false);
                    });
                } catch (error) {
                    //console.log(error);
                }
                setModalVisible(false);
                break;
            case 'Cash':
                //console.log(viewType);
                const formData2 = {
                    clinicID: clinicID,
                    startDate: moment(startDate).format('YYYY-MM-DD'),
                    endDate: moment(endDate).format('YYYY-MM-DD'),
                    providerID: "",
                    modeofpayment: 'Cash',
                    reportType: "",
                    sortOrder: "",
                    sortColumn: "",
                    pageIndex: 0,
                    pageSize: 0,
                    communicationGroupMasterGuid: "00000000-0000-0000-0000-000000000000"
                }
                //console.log('Data To Pass', formData2);
                setLoading(true);
                try {
                    Axios.post(`${Api}Report/GetDailyCollectionReportDataForMobile`, formData2, { headers }).then(resp => {
                        //console.log('Daily Collection Report Data', resp.data);
                        setReportData(resp.data);
                        const data = resp.data;
                        const totalAmount = data.map(item => item.treatmentPayment);
                        let sum = 0;
                        totalAmount.forEach((number) => {
                            sum += number;
                        });
                        setTotalAmt(sum)
                        //console.log(sum);
                        setLoading(false);
                    });
                } catch (error) {
                    //console.log(error);
                }
                setModalVisible(false);
                break;
            case 'Cheque':
                //console.log(viewType);
                const formData3 = {
                    clinicID: clinicID,
                    startDate: moment(startDate).format('YYYY-MM-DD'),
                    endDate: moment(endDate).format('YYYY-MM-DD'),
                    providerID: "",
                    modeofpayment: 'Cheque',
                    reportType: "",
                    sortOrder: "",
                    sortColumn: "",
                    pageIndex: 0,
                    pageSize: 0,
                    communicationGroupMasterGuid: "00000000-0000-0000-0000-000000000000"
                }
                //console.log('Data To Pass', formData3);
                setLoading(true);
                try {
                    Axios.post(`${Api}Report/GetDailyCollectionReportDataForMobile`, formData3, { headers }).then(resp => {
                        //console.log('Daily Collection Report Data', resp.data);
                        setReportData(resp.data);
                        const data = resp.data;
                        const totalAmount = data.map(item => item.treatmentPayment);
                        let sum = 0;
                        totalAmount.forEach((number) => {
                            sum += number;
                        });
                        setTotalAmt(sum)
                        //console.log(sum);
                        setLoading(false);
                    });
                } catch (error) {
                    //console.log(error);
                }
                setModalVisible(false);
                break;
            case 'Card':
                //console.log(viewType);
                const formData4 = {
                    clinicID: clinicID,
                    startDate: moment(startDate).format('YYYY-MM-DD'),
                    endDate: moment(endDate).format('YYYY-MM-DD'),
                    providerID: "",
                    modeofpayment: 'Card',
                    reportType: "",
                    sortOrder: "",
                    sortColumn: "",
                    pageIndex: 0,
                    pageSize: 0,
                    communicationGroupMasterGuid: "00000000-0000-0000-0000-000000000000"
                }
                //console.log('Data To Pass', formData4);
                setLoading(true);
                try {
                    Axios.post(`${Api}Report/GetDailyCollectionReportDataForMobile`, formData4, { headers }).then(resp => {
                        //console.log('Daily Collection Report Data', resp.data);
                        setReportData(resp.data);
                        const data = resp.data;
                        const totalAmount = data.map(item => item.treatmentPayment);
                        let sum = 0;
                        totalAmount.forEach((number) => {
                            sum += number;
                        });
                        setTotalAmt(sum)
                        //console.log(sum);
                        setLoading(false);
                    });
                } catch (error) {
                    //console.log(error);
                }
                setModalVisible(false);
                break;
            case 'RTGS':
                //console.log(viewType);
                const formData5 = {
                    clinicID: clinicID,
                    startDate: moment(startDate).format('YYYY-MM-DD'),
                    endDate: moment(endDate).format('YYYY-MM-DD'),
                    providerID: "",
                    modeofpayment: 'RTGS',
                    reportType: "",
                    sortOrder: "",
                    sortColumn: "",
                    pageIndex: 0,
                    pageSize: 0,
                    communicationGroupMasterGuid: "00000000-0000-0000-0000-000000000000"
                }
                //console.log('Data To Pass', formData5);
                setLoading(true);
                try {
                    Axios.post(`${Api}Report/GetDailyCollectionReportDataForMobile`, formData5, { headers }).then(resp => {
                        //console.log('Daily Collection Report Data', resp.data);
                        setReportData(resp.data);
                        const data = resp.data;
                        const totalAmount = data.map(item => item.treatmentPayment);
                        let sum = 0;
                        totalAmount.forEach((number) => {
                            sum += number;
                        });
                        setTotalAmt(sum)
                        //console.log(sum);
                        setLoading(false);
                    });
                } catch (error) {
                    //console.log(error);
                }
                setModalVisible(false);
            case 'Online':
                //console.log(viewType);
                const formData6 = {
                    clinicID: clinicID,
                    startDate: moment(startDate).format('YYYY-MM-DD'),
                    endDate: moment(endDate).format('YYYY-MM-DD'),
                    providerID: "",
                    modeofpayment: 'Online',
                    reportType: "",
                    sortOrder: "",
                    sortColumn: "",
                    pageIndex: 0,
                    pageSize: 0,
                    communicationGroupMasterGuid: "00000000-0000-0000-0000-000000000000"
                }
                //console.log('Data To Pass', formData6);
                setLoading(true);
                try {
                    Axios.post(`${Api}Report/GetDailyCollectionReportDataForMobile`, formData6, { headers }).then(resp => {
                        //console.log('Daily Collection Report Data', resp.data);
                        setReportData(resp.data);
                        const data = resp.data;
                        const totalAmount = data.map(item => item.treatmentPayment);
                        let sum = 0;
                        totalAmount.forEach((number) => {
                            sum += number;
                        });
                        setTotalAmt(sum)
                        //console.log(sum);
                        setLoading(false);
                    });
                } catch (error) {
                    //console.log(error);
                }
                setModalVisible(false);
            case 'Coupons':
                //console.log(viewType);
                const formData7 = {
                    clinicID: clinicID,
                    startDate: moment(startDate).format('YYYY-MM-DD'),
                    endDate: moment(endDate).format('YYYY-MM-DD'),
                    providerID: "",
                    modeofpayment: 'Coupons',
                    reportType: "",
                    sortOrder: "",
                    sortColumn: "",
                    pageIndex: 0,
                    pageSize: 0,
                    communicationGroupMasterGuid: "00000000-0000-0000-0000-000000000000"
                }
                //console.log('Data To Pass', formData7);
                setLoading(true);
                try {
                    Axios.post(`${Api}Report/GetDailyCollectionReportDataForMobile`, formData7, { headers }).then(resp => {
                        //console.log('Daily Collection Report Data', resp.data);
                        setReportData(resp.data);
                        const data = resp.data;
                        const totalAmount = data.map(item => item.treatmentPayment);
                        let sum = 0;
                        totalAmount.forEach((number) => {
                            sum += number;
                        });
                        setTotalAmt(sum)
                        //console.log(sum);
                        setLoading(false);
                    });
                } catch (error) {
                    //console.log(error);
                }
                setModalVisible(false);
            default:
                setviewType('');
                setViewForDate('');
                const formData = {
                    clinicID: clinicID,
                    startDate: startDate,
                    endDate: startDate,
                    providerID: "",
                    modeofpayment: "All",
                    reportType: "",
                    sortOrder: "",
                    sortColumn: "",
                    pageIndex: 0,
                    pageSize: 0,
                    communicationGroupMasterGuid: "00000000-0000-0000-0000-000000000000"
                }
                //console.log('Data To Pass', formData);
                setLoading(true);
                try {
                    Axios.post(`${Api}Report/GetDailyCollectionReportDataForMobile`, formData, { headers }).then(resp => {
                        //console.log('Daily Collection Report Data', resp.data);
                        setReportData(resp.data);
                        const data = resp.data;
                        if (data.length == 0) {
                            setPatientID('00000000-0000-0000-0000-000000000000');
                        } else {
                            setPatientID(data[0].patientID);
                        }

                        const totalAmount = data.map(item => item.treatmentPayment);
                        let sum = 0;
                        totalAmount.forEach((number) => {
                            sum += number;
                        });
                        setTotalAmt(sum)
                        //console.log(sum);
                        setLoading(false);
                    });
                } catch (error) {
                    //console.log(error);
                }
        }
    }
    const handleViewForDate = async (ViewForDate) => {    
       const headers = await getHeaders();
        setViewForDate(ViewForDate);
        switch (ViewForDate) {
            case "Day View":
                resetDate()
                const todayDate = moment().tz("Asia/Kolkata").format('YYYY-MM-DD');
                setstartDate(todayDate);
                //console.log(ViewForDate);
                const formData = {
                    clinicID: clinicID,
                    startDate: todayDate,
                    endDate: moment(todayDate).add(1, 'days').format('YYYY-MM-DD'),
                    providerID: "",
                    modeofpayment: viewType || "All",
                    reportType: "",
                    sortOrder: "",
                    sortColumn: "",
                    pageIndex: 0,
                    pageSize: 0,
                    communicationGroupMasterGuid: "00000000-0000-0000-0000-000000000000"
                }
                //console.log('Data To Pass', formData);
                setLoading(true);
                try {
                    Axios.post(`${Api}Report/GetDailyCollectionReportDataForMobile`, formData, { headers }).then(resp => {
                        //console.log('Daily Collection Report Data', resp.data);
                        setReportData(resp.data);
                        const data = resp.data;
                        const totalAmount = data.map(item => item.treatmentPayment);
                        let sum = 0;
                        totalAmount.forEach((number) => {
                            sum += number;
                        });
                        setTotalAmt(sum)
                        //console.log(sum);
                        setLoading(false);
                    });
                } catch (error) {
                    //console.log(error);
                }
                setShowModal1(false)

                break;
            case "Week View":
                //console.log(ViewForDate);
                const today = moment();
                const weekStart = today.clone().startOf('week');
                const weekEnd = today.clone().endOf('week');
                const formattedWeekStart = weekStart.format('YYYY-MM-DD').toString();
                const formattedWeekEnd = weekEnd.format('YYYY-MM-DD').toString();
                setstartDate(formattedWeekStart);
                setendDate(formattedWeekEnd);
                //console.log(formattedWeekStart, formattedWeekEnd);
                const formData1 = {
                    clinicID: clinicID,
                    startDate: formattedWeekStart,
                    endDate: formattedWeekEnd,
                    providerID: "",
                    modeofpayment: viewType || "All",
                    reportType: "",
                    sortOrder: "",
                    sortColumn: "",
                    pageIndex: 0,
                    pageSize: 0,
                    communicationGroupMasterGuid: "00000000-0000-0000-0000-000000000000"
                }
                //console.log('Data To Pass', formData1);
                setLoading(true);
                try {
                    Axios.post(`${Api}Report/GetDailyCollectionReportDataForMobile`, formData1, { headers }).then(resp => {
                        //console.log('Daily Collection Report Data', resp.data);
                        setReportData(resp.data);
                        const data = resp.data;
                        const totalAmount = data.map(item => item.treatmentPayment);
                        let sum = 0;
                        totalAmount.forEach((number) => {
                            sum += number;
                        });
                        setTotalAmt(sum)
                        //console.log(sum);
                        setLoading(false);
                    });
                } catch (error) {
                    //console.log(error);
                }
                setShowModal1(false)

                break;
            case "Month View":
                resetDate();
                //console.log(ViewForDate);
                const currentMonth = moment(startDate).tz("Asia/Kolkata").format('MMMM YYYY');
                //console.log("Month", currentMonth);
                const startOfMonth = moment(currentMonth, 'MMMM YYYY').tz("Asia/Kolkata").startOf('month').format('YYYY-MM-DD').toString();
                const endOfMonth = moment(currentMonth, 'MMMM YYYY').tz("Asia/Kolkata").endOf('month').format('YYYY-MM-DD').toString();
                //console.log(startOfMonth, endOfMonth);
                setstartDate(startOfMonth);
                setendDate(endOfMonth);
                const formData2 = {
                    clinicID: clinicID,
                    startDate: startOfMonth,
                    endDate: endOfMonth,
                    providerID: "",
                    modeofpayment: viewType || "All",
                    reportType: "",
                    sortOrder: "",
                    sortColumn: "",
                    pageIndex: 0,
                    pageSize: 0,
                    communicationGroupMasterGuid: "00000000-0000-0000-0000-000000000000"
                }
                //console.log('Data To Pass', formData2);
                setLoading(true);
                try {
                    Axios.post(`${Api}Report/GetDailyCollectionReportDataForMobile`, formData2, { headers }).then(resp => {
                        //console.log('Daily Collection Report Data', resp.data);
                        setReportData(resp.data);
                        const data = resp.data;
                        const totalAmount = data.map(item => item.treatmentPayment);
                        let sum = 0;
                        totalAmount.forEach((number) => {
                            sum += number;
                        });
                        setTotalAmt(sum)
                        //console.log(sum);
                        setLoading(false);
                    });
                } catch (error) {
                    //console.log(error);
                }
                setShowModal1(false)

                break;
            default:
                break;
        }

    }

    const datePlus = async () => {
        const headers = await getHeaders(); 
        if (viewForDate == "Day View" || viewForDate == '') {
            const nextDate = moment(startDate).tz("Asia/Kolkata").add(1, 'days').format('YYYY-MM-DD').toString();
            setstartDate(nextDate);
            //console.log(nextDate);
            const formData = {
                clinicID: clinicID,
                startDate: moment(startDate).add(1, 'days').format('YYYY-MM-DD'),
                endDate: moment(startDate).add(1, 'days').format('YYYY-MM-DD'),
                providerID: "",
                modeofpayment: viewType || "All",
                reportType: "",
                sortOrder: "",
                sortColumn: "",
                pageIndex: 0,
                pageSize: 0,
                communicationGroupMasterGuid: "00000000-0000-0000-0000-000000000000"
            }
            //console.log('Data To Pass', formData);
            setLoading(true);
            try {
                Axios.post(`${Api}Report/GetDailyCollectionReportDataForMobile`, formData, { headers }).then(resp => {
                    //console.log('Daily Collection Report Data', resp.data);
                    setReportData(resp.data);
                    const data = resp.data;
                    const totalAmount = data.map(item => item.treatmentPayment);
                    let sum = 0;
                    totalAmount.forEach((number) => {
                        sum += number;
                    });
                    setTotalAmt(sum)
                    //console.log(sum);
                    setLoading(false);
                });
            } catch (error) {
                //console.log(error);
            }
        }

        if (viewForDate == "Week View") {
            //console.log(startDate, endDate);
            const nextWeekSDate = moment(endDate, 'YYYY-MM-DD').tz("Asia/Kolkata").add(1, 'day').format('YYYY-MM-DD').toString();
            const nextWeekEDate = moment(endDate, 'YYYY-MM-DD').tz("Asia/Kolkata").add(6, 'day').format('YYYY-MM-DD').toString();
            //console.log(nextWeekSDate, nextWeekEDate);
            setstartDate(nextWeekSDate);
            setendDate(nextWeekEDate)
            const formData = {
                clinicID: clinicID,
                startDate: nextWeekSDate,
                endDate: nextWeekEDate,
                providerID: "",
                modeofpayment: viewType || "All",
                reportType: "",
                sortOrder: "",
                sortColumn: "",
                pageIndex: 0,
                pageSize: 0,
                communicationGroupMasterGuid: "00000000-0000-0000-0000-000000000000"
            }
            //console.log('Data To Pass', formData);
            setLoading(true);
            try {
                Axios.post(`${Api}Report/GetDailyCollectionReportDataForMobile`, formData, { headers }).then(resp => {
                    //console.log('Daily Collection Report Data', resp.data);
                    setReportData(resp.data);
                    const data = resp.data;
                    const totalAmount = data.map(item => item.treatmentPayment);
                    let sum = 0;
                    totalAmount.forEach((number) => {
                        sum += number;
                    });
                    setTotalAmt(sum)
                    //console.log(sum);
                    setLoading(false);
                });
            } catch (error) {
                //console.log(error);
            }
        }

        if (viewForDate == "Month View") {
            const nextMonth = moment(startDate).tz("Asia/Kolkata").add(1, 'month').format('MMMM YYYY');
            //console.log("Month", nextMonth);
            const startOfMonth = moment(nextMonth, 'MMMM YYYY').tz("Asia/Kolkata").startOf('month').format('YYYY-MM-DD').toString();
            const endOfMonth = moment(nextMonth, 'MMMM YYYY').tz("Asia/Kolkata").endOf('month').format('YYYY-MM-DD').toString();
            //console.log(startOfMonth, endOfMonth);
            setstartDate(startOfMonth);
            setendDate(endOfMonth);
            const formData = {
                clinicID: clinicID,
                startDate: startOfMonth,
                endDate: endOfMonth,
                providerID: "",
                modeofpayment: viewType || "All",
                reportType: "",
                sortOrder: "",
                sortColumn: "",
                pageIndex: 0,
                pageSize: 0,
                communicationGroupMasterGuid: "00000000-0000-0000-0000-000000000000"
            }
            //console.log('Data To Pass', formData);
            setLoading(true);
            try {
                Axios.post(`${Api}Report/GetDailyCollectionReportDataForMobile`, formData, { headers }).then(resp => {
                    //console.log('Daily Collection Report Data', resp.data);
                    setReportData(resp.data);
                    const data = resp.data;
                    const totalAmount = data.map(item => item.treatmentPayment);
                    let sum = 0;
                    totalAmount.forEach((number) => {
                        sum += number;
                    });
                    setTotalAmt(sum)
                    //////console.log(sum);
                    setLoading(false);
                });
            } catch (error) {
                ////console.log(error);
            }
        }
    }

    const dateMinus = async () => {
        const headers = await getHeaders(); 
        if (viewForDate == "Day View" || viewForDate == '') {
            const backDate = moment(startDate).tz("Asia/Kolkata").subtract(1, 'days').format('YYYY-MM-DD').toString();
            setstartDate(backDate);
            ////console.log(backDate);
            const formData = {
                clinicID: clinicID,
                startDate: moment(startDate).subtract(1, 'days').format('YYYY-MM-DD'),
                endDate: moment(startDate).subtract(1, 'days').format('YYYY-MM-DD'),
                providerID: "",
                modeofpayment: viewType || "All",
                reportType: "",
                sortOrder: "",
                sortColumn: "",
                pageIndex: 0,
                pageSize: 0,
                communicationGroupMasterGuid: "00000000-0000-0000-0000-000000000000"
            }
            ////console.log('Data To Pass', formData);
            setLoading(true);
            try {
                Axios.post(`${Api}Report/GetDailyCollectionReportDataForMobile`, formData, { headers }).then(resp => {
                    ////console.log('Daily Collection Report Data', resp.data);
                    setReportData(resp.data);
                    const data = resp.data;
                    const totalAmount = data.map(item => item.treatmentPayment);
                    let sum = 0;
                    totalAmount.forEach((number) => {
                        sum += number;
                    });
                    setTotalAmt(sum)
                    ////console.log(sum);
                    setLoading(false);
                });
            } catch (error) {
               // //console.log(error);
            }
        }
        if (viewForDate == "Week View") {
            ////console.log(startDate, endDate);
            const nextWeekSDate = moment(startDate, 'YYYY-MM-DD').tz("Asia/Kolkata").subtract(6, 'day').format('YYYY-MM-DD').toString();
            const nextWeekEDate = moment(startDate, 'YYYY-MM-DD').tz("Asia/Kolkata").subtract(1, 'day').format('YYYY-MM-DD').toString();
            ////console.log(nextWeekSDate, nextWeekEDate);
            setstartDate(nextWeekSDate);
            setendDate(nextWeekEDate)
            const formData = {
                clinicID: clinicID,
                startDate: nextWeekSDate,
                endDate: nextWeekEDate,
                providerID: "",
                modeofpayment: viewType || "All",
                reportType: "",
                sortOrder: "",
                sortColumn: "",
                pageIndex: 0,
                pageSize: 0,
                communicationGroupMasterGuid: "00000000-0000-0000-0000-000000000000"
            }
           // //console.log('Data To Pass', formData);
            setLoading(true);
            try {
                Axios.post(`${Api}Report/GetDailyCollectionReportDataForMobile`, formData, { headers }).then(resp => {
                   // //console.log('Daily Collection Report Data', resp.data);
                    setReportData(resp.data);
                    const data = resp.data;
                    const totalAmount = data.map(item => item.treatmentPayment);
                    let sum = 0;
                    totalAmount.forEach((number) => {
                        sum += number;
                    });
                    setTotalAmt(sum)
                   // //console.log(sum);
                    setLoading(false);
                });
            } catch (error) {
                ////console.log(error);
            }
        }
        if (viewForDate == "Month View") {
            const nextMonth = moment(startDate).tz("Asia/Kolkata").subtract(1, 'month').format('MMMM YYYY');
           // //console.log("Month", nextMonth);
            const startOfMonth = moment(nextMonth, 'MMMM YYYY').tz("Asia/Kolkata").startOf('month').format('YYYY-MM-DD').toString();
            const endOfMonth = moment(nextMonth, 'MMMM YYYY').tz("Asia/Kolkata").endOf('month').format('YYYY-MM-DD').toString();
           // //console.log(startOfMonth, endOfMonth);
            setstartDate(startOfMonth);
            setendDate(endOfMonth);
            const formData = {
                clinicID: clinicID,
                startDate: startOfMonth,
                endDate: endOfMonth,
                providerID: "",
                modeofpayment: viewType || "All",
                reportType: "",
                sortOrder: "",
                sortColumn: "",
                pageIndex: 0,
                pageSize: 0,
                communicationGroupMasterGuid: "00000000-0000-0000-0000-000000000000"
            }
            ////console.log('Data To Pass', formData);
            setLoading(true);
            try {
                Axios.post(`${Api}Report/GetDailyCollectionReportDataForMobile`, formData, { headers }).then(resp => {
                    ////console.log('Daily Collection Report Data', resp.data);
                    setReportData(resp.data);
                    const data = resp.data;
                    const totalAmount = data.map(item => item.treatmentPayment);
                    let sum = 0;
                    totalAmount.forEach((number) => {
                        sum += number;
                    });
                    setTotalAmt(sum)
                    ////console.log(sum);
                    setLoading(false);
                });
            } catch (error) {
                //(error);
            }
        }
    }
    const handleDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || (selectedDateType === 'start' ? customDate1 : customDate2);
        setShowPicker(false);
        if (selectedDateType === 'start') {
            setCustomDate1(currentDate);
            setSelectedDateType('end');
            setShowPicker(true);
           // //console.log(currentDate);
            const finalDate1 = moment(currentDate).format('YYYY-MM-DD').toString(); // Update the value of finalDate1
            setCustomDate1(finalDate1);
           // //console.log("Final Date", finalDate1);
        } else {
            setSelectedDateType(null);
            ////console.log(currentDate);
            const finalDate2 = moment(currentDate).format('YYYY-MM-DD').toString();
            setCustomDate2(finalDate2);
            //("Final Date", finalDate2);
            const formData = {
                clinicID: clinicID,
                startDate: moment(customDate1).format('YYYY-MM-DD').toString(),
                endDate: finalDate2,
                providerID: "",
                modeofpayment: viewType || "All",
                reportType: "",
                sortOrder: "",
                sortColumn: "",
                pageIndex: 0,
                pageSize: 0,
                communicationGroupMasterGuid: "00000000-0000-0000-0000-000000000000"
            }
            ////console.log('Data To Pass', formData);
            setLoading(true);
            try {
                Axios.post(`${Api}Report/GetDailyCollectionReportDataForMobile`, formData).then(resp => {
                    ////console.log('Daily Collection Report Data', resp.data);
                    setReportData(resp.data);
                    const data = resp.data;
                    const totalAmount = data.map(item => item.treatmentPayment);
                    let sum = 0;
                    totalAmount.forEach((number) => {
                        sum += number;
                    });
                    setTotalAmt(sum)
                   // //console.log(sum);
                    setLoading(false);
                });
            } catch (error) {
                ////console.log(error);
            }
            setstartDate(formData.startDate);
            setendDate(formData.endDate);
            setShowModal1(!ShowModal1);
        }
    };


    const handlePress = () => {
        setViewForDate('Custom View');
        resetDate();
        if (!customDate1) {
            setSelectedDateType('start');
            setShowPicker(true);
        } else {
            setSelectedDateType('end');
            setShowPicker(true);
        }
    };
    const openModalsubMenu = (id) => {
        setShowModal(!showModal);
       // //console.log(id);
        setReceiptID(id);
    }
    
    const printData = () => {
        navigation.navigate('Print', {
            clinicID: clinicID,
            patientID: patientID,
            viewName: '_PrintReceipt',
            selection: receiptID,
        });
         setShowModal(false);
    }

    return (

        <>
           <View style={{ flex: 1, backgroundColor: '#f2f8ff' }}>


                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>

                        <View style={{ marginLeft: 10 }}>
                            <Button bgColor={'#2196f3'} onPress={() => {
                                setModalVisible(!modalVisible);
                            }}>

                                {viewType ? <Text style={[CommonStylesheet.Text, Styles.alldoctorText]}>{viewType}{' '}<Icon
                                    name="caret-down"
                                    size={15}
                                    color={'white'}
                            />
                            </Text> :
                                <Text style={[Styles.headerText, { color: 'white',fontWeight:500 }]}>Payment Mode{' '}
                                    {/* <Text style={Styles.headerText}>Select View</Text> */}
                                    <Icon
                                    name="caret-down"
                                    size={15}
                                    color={'white'}
                                    />
                                </Text>}
                            </Button>
                        </View>

                        <View style={{ marginRight: 10 }}>

                            <Button bgColor={'#2196f3'} onPress={() => {
                                setShowModal1(!ShowModal1)
                            }}>
                                {viewForDate ? <Text style={[CommonStylesheet.Text, Styles.alldoctorText]}>{viewForDate}{' '}<Icon
                                    name="caret-down"
                                    size={15}
                                    color={'white'}
                            />
                            </Text> :
                                <Text style={[Styles.headerText, { color: 'white',fontWeight:500 }]}>Select View{' '}
                                    <Icon
                                    name="caret-down"
                                    size={15}
                                    color={'white'}
                                /></Text>}
                            </Button>
                        </View>
                    </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10,alignItems:'center' }}>
                        <TouchableOpacity onPress={() => dateMinus()}>
                            <View>
                                {!customDate1 && !customDate2 && (
                                    <Icon
                                        name="chevron-left"
                                    size={20}
                                        color={'#2196f3'}
                                    style={{ marginLeft: 20 }}
                                    />
                                )}
                            </View>
                        </TouchableOpacity>
                    <View >
                            {customDate1 && customDate2 ? (
                                <View>
                                    <View style={{ marginTop: 7, justifyContent: 'center', alignItems: 'center' }}>
                                        <Text style={Styles.TextDate}>
                                            {moment(customDate1).format('DD-MMM-YYYY').toString()} TO {moment(customDate2).format('DD-MMM-YYYY').toString()}
                                        </Text>
                                    </View>
                                </View>
                            ) : (
                                <>
                                    {viewForDate === 'Week View' ? (
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={Styles.TextDate}>
                                            {moment(startDate).format('DD-MMM-YYYY').toString()} - {moment(endDate).format('DD-MMM-YYYY').toString()}
                                            </Text>
                                        </View>
                                    ) : viewForDate === 'Month View' ? (
                                        <Text style={Styles.TextDate}>
                                            {moment(startDate).format('MMMM YYYY').toString()}
                                        </Text>
                                    ) : viewForDate === 'Day View' || viewForDate === '' || viewType === '' ? (
                                        <Text style={Styles.TextDate}>
                                            {moment(startDate).format('DD-MMM-YYYY').toString()}
                                        </Text>
                                    ) : null}
                                </>
                            )}
                        </View>
                        <TouchableOpacity onPress={() => datePlus()}>
                            <View>
                                {!customDate1 && !customDate2 && (
                                    <Icon
                                        name="chevron-right"
                                    size={20}
                                        color={'#2196f3'}
                                    style={{ marginRight: 20 }}
                                    />
                                )}
                            </View>
                        </TouchableOpacity>
                    </View>


                    <View style={{
                    justifyContent: 'center', alignItems: 'center', marginTop: 10, marginBottom: 10, height: 35,
                        width: 250,
                        borderColor: '#2196f3',
                    borderRadius: 5,
                        alignSelf: 'center',
                        backgroundColor: '#2196f3',
                    }}>
                    <Text style={[Styles.headerText,{fontWeight:500,color:'white'}]}>Total Amount: {totalamt || 0} /-</Text>
                    </View>
                <ScrollView>
                    <SafeAreaView  style={{backgroundColor: '#f2f8ff' }}>
                    {loading ? <Loader /> : reportData.length == 0 ?
                        <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 15 }}>
                            <Text style={CommonStylesheet.Text}>
                                Data not Found
                            </Text>

                        </View> : reportData.map(item => (

                            <View style={CommonStylesheet.cardatDailyCollectionScreen} key={item.receiptID}>

                                    <View style={[Styles.header, { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }]}>

                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={[Styles.headerText,{fontWeight:500}]}>
                                            Date :
                                        </Text>
                                            <Text style={Styles.headerText}>
                                            {item.treatmentDate}
                                        </Text>
                                    </View>

                                        <View style={{ marginRight: 10 }}>

                                        <TouchableOpacity
                                            onPress={() => openModalsubMenu(item.receiptID)}>
                                            <View>
                                                <Icon

                                                    name="ellipsis-v"
                                                    size={20}
                                                        color={'black'}
                                                    style={Styles.iconDot}
                                                />
                                            </View>
                                        </TouchableOpacity>

                                    </View>

                                </View>

                                    <View style={{ flexDirection: 'row', width: '100%', marginLeft: 10, marginTop: 10 }}>
                                        <Text style={{ fontFamily: 'Poppins-Bold', fontWeight: 500, fontSize: regularFontSize, width: width < 600 ? 150 : 130 }}>Name</Text>
                                        <Text style={{ fontFamily: 'Poppins-Regular', fontSize: regularFontSize, width: width < 600 ? 30 : 30 }}>:</Text>
                                        <Text style={{ fontFamily: 'Poppins-Regular', fontSize: regularFontSize, width: width < 600 ? 250 : 200 }}>{item.title} {item.firstName} {item.lastName}</Text>
                                </View>


                                    <View style={{ flexDirection: 'row', width: '100%', marginLeft: 10 }}>
                                        <Text style={{ fontFamily: 'Poppins-Bold', fontWeight: 500, fontSize: regularFontSize, width: width < 600 ? 150 : 130 }}>Mode</Text>
                                        <Text style={{ fontFamily: 'Poppins-Regular', fontSize: regularFontSize, width: width < 600 ? 30 : 30 }}>:</Text>
                                        <Text style={{ fontFamily: 'Poppins-Regular', fontSize: regularFontSize, width: width < 600 ? 250 : 200 }}>{item.modeofPayment}</Text>
                                </View>

                                    <View style={{ flexDirection: 'row', width: '100%', marginLeft: 10 }}>
                                        <Text style={{ fontFamily: 'Poppins-Bold', fontWeight: 500, fontSize: regularFontSize, width: width < 600 ? 150 : 130 }}>Amount</Text>
                                        <Text style={{ fontFamily: 'Poppins-Regular', fontSize: regularFontSize, width: width < 600 ? 30 : 30 }}>:</Text>
                                        <Text style={{ fontFamily: 'Poppins-Regular', fontSize: regularFontSize, width: width < 600 ? 250 : 200 }}>{item.treatmentPayment}/-</Text>
                                </View>


                                    <View style={{ flexDirection: 'row', width: '100%', marginLeft: 10, marginBottom: 10, }}>
                                        <Text style={{ fontFamily: 'Poppins-Bold', fontWeight: 500, fontSize: regularFontSize, width: width < 600 ? 150 : 130 }}>Receipt</Text>
                                        <Text style={{ fontFamily: 'Poppins-Regular', fontSize: regularFontSize, width: width < 600 ? 30 : 30 }}>:</Text>
                                        <Text style={{ fontFamily: 'Poppins-Regular', fontSize: regularFontSize, width: width < 600 ? 250 : 200 }}>{item.receiptNumber}</Text>
                                </View>
                            </View>
                        ))}
                </SafeAreaView>
            </ScrollView>
            </View>
            <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}>
                <Modal.Content>
                    <Modal.CloseButton style={CommonStylesheet.CloseButton} />
                    <Modal.Header style={CommonStylesheet.popheader}><Text style={{ color: 'white', fontFamily: 'poppins-bold', fontSize: 18 }}>Select Payment Mode</Text></Modal.Header>
                    <Modal.Body>
                        <VStack space={3}>
                            <TouchableOpacity onPress={() => handleView('All')}>
                                <HStack alignItems="center">
                                    <Text fontFamily='Poppins-Regular' marginBottom={2}>All</Text>
                                </HStack>
                                <Divider />
                            </TouchableOpacity>
                            {category.map(item => (
                                <TouchableOpacity onPress={() => handleView(item.itemTitle)}>
                                    <HStack alignItems="center"  >
                                        <Text style={CommonStylesheet.Text}>{item.itemTitle}</Text>
                                    </HStack>
                                    <Divider />
                                </TouchableOpacity>
                            ))}
                        </VStack>
                    </Modal.Body>
                </Modal.Content>
            </Modal>
            <Modal isOpen={showModal} onClose={() => setShowModal(false)} size="lg">
                <Modal.Content maxWidth="350">
                    <Modal.CloseButton style={CommonStylesheet.CloseButton} />
                    <Modal.Header style={CommonStylesheet.popheader}><Text style={{ color: 'white', fontFamily: 'poppins-bold', fontSize: 18 }}>Actions</Text></Modal.Header>
                    <Modal.Body>
                        <VStack space={3}>
                            <TouchableOpacity >
                                <HStack alignItems="center" >
                                    <Text fontFamily='Poppins-Regular' marginBottom={2}>Call</Text>
                                </HStack>
                                <Divider />
                            </TouchableOpacity>
                            <TouchableOpacity >
                            <HStack alignItems="center"  >
                                    <Text fontFamily='Poppins-Regular' marginBottom={2}>Send SMS</Text>
                            </HStack>
                                <Divider />
                            </TouchableOpacity >
                            <TouchableOpacity onPress={() => printData()}>
                                <HStack alignItems="center" marginBottom={2} >
                                    <Text fontFamily='Poppins-Regular'>Print Receipt</Text>
                                </HStack>
                                <Divider />
                            </TouchableOpacity>

                            <HStack alignItems="center">
                                <Text fontFamily='Poppins-Regular'>View Patient details</Text>
                            </HStack>

                        </VStack>
                    </Modal.Body>

                </Modal.Content>
            </Modal>
            <Modal isOpen={ShowModal1} onClose={() => setShowModal1(false)} >
                <Modal.Content>
                    <Modal.CloseButton style={CommonStylesheet.CloseButton} />
                    <Modal.Header style={CommonStylesheet.popheader}><Text style={{ color: 'white', fontFamily: 'poppins-bold', fontSize: 18 }}>Actions</Text></Modal.Header>
                    <Modal.Body >
                        <VStack space={3}>
                            <TouchableOpacity onPress={() => handleViewForDate('Day View')} >
                                <HStack alignItems="center" marginBottom={2}  >
                                    <Text fontFamily='Poppins-Regular'>Day View</Text>
                                </HStack>
                                <Divider />
                        </TouchableOpacity>
                            <TouchableOpacity onPress={() => handleViewForDate('Week View')} >
                                <HStack alignItems="center" marginBottom={2} >
                                    <Text fontFamily='Poppins-Regular'>Week View</Text>
                                </HStack>
                                <Divider />
                        </TouchableOpacity>

                            <TouchableOpacity onPress={() => handleViewForDate('Month View')}>
                                <HStack alignItems="center"  >
                                    <Text fontFamily='Poppins-Regular'>Month View</Text>
                                </HStack>
                        </TouchableOpacity>
                        </VStack>
                    </Modal.Body>
                </Modal.Content>
            </Modal>
        </>

    );
};

const Styles = StyleSheet.create({
    alldoctorContainer: {
        backgroundColor: '#D3D3D3',
        height: 30,
        width: 150,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,

    },
    header: {
        // backgroundColor: '#F5FCFF',
        backgroundColor: '#90caf9',
        padding: 10,
    },
    monthviewContainer: {
        backgroundColor: '#D3D3D3',
        height: 30,
        width: 150,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10

    },
    alldoctorText: {
        color: 'white'
    },
    containerBottom: {
        width: 50,
        height: 50,
        backgroundColor: '#2196f3',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 1,
        borderRadius: 10,
        marginBottom: 5
    },
    countContainer: {
        height: 20,
        width: 20,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 40
    },
    textCount: {
        fontSize: 10,
        color: 'gray',
        fontFamily: 'Poppins-Medium'
    },
    textall: {
        fontSize: 9,
        color: 'white',
        fontFamily: 'Poppins-Medium'
    },
    cell: {
        borderWidth: 0.5,
        borderColor: '#3399ff',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',

        borderRadius: 1.5,
    },
    TextDate: {
        fontSize: 16,
        color: '#2196f3',
        fontFamily: 'Poppins-Bold'
    },
    headerText: {
        fontSize: regularFontSize,
        color: 'black',
        fontFamily: 'Poppins-Regular',
        // marginHorizontal: 15,
        textAlign: 'center'
    },

})

export default DailyCollection;