import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Api from "../api/Api";
import { getHeaders } from "../utils/apiHeaders";
import moment from "moment";

// Initial state
const initialState = {
    appointmentList: [],
    provider: [],
    allCount: 0,
    loading: false,
    currentPage: 0,
    pageSize: 10,
    scheduledCount: 0,
    waitingCount: 0,
    engagedCount: 0,
    completedCount: 0,
    missedCount: 0,
    viewType: 'Day View',
    providerName: 'All Doctors',
    startDate: moment().format('YYYY-MM-DD').toString(),
    endDate: moment().add(1, 'days').format('YYYY-MM-DD').toString(),
    error: null,
};

// Async thunk for fetching appointments
export const fetchAppointments = createAsyncThunk(
    'fetchAppointments',
    async ({ formDataForProvider, formDataForAppointmentList }, { rejectWithValue }) => {

        try {
            const headers = await getHeaders();

            const [providerResponse, appointmentResponse] = await Promise.all([
                Axios.post(`${Api}Setting/GetProviderInfoByParameterForMobile`, formDataForProvider, { headers }),
                Axios.post(`${Api}Appointment/GetAppointmentInfoListForMobile`, formDataForAppointmentList, { headers }),
            ]);
            const appointmentData = appointmentResponse.data;

            // Initialize counters
            let allAppointmentCount = 0;
            let scheduledCount = 0;
            let waitingCount = 0;
            let engagedCount = 0;
            let completedCount = 0;
            let missedCount = 0;

            if (
                appointmentData[0]?.getAllAppointmentInfoResultDTOList &&
                appointmentData[0].getAllAppointmentInfoResultDTOList.length > 0
            ) {
                const allAppointments = appointmentData[0].getAllAppointmentInfoResultDTOList;

                allAppointments.forEach((appointment) => {
                    const status = appointment.status;
                    allAppointmentCount++;
                    if (status === 'Scheduled') scheduledCount++;
                    if (status === 'Waiting') waitingCount++;
                    if (status === 'Engaged') engagedCount++;
                    if (status === 'Completed') completedCount++;
                    if (status === 'Missed') missedCount++;
                });
            }

            return {
                provider: providerResponse.data,
                appointmentList: appointmentData || [],
                allCount: allAppointmentCount,
                scheduledCount,
                waitingCount,
                engagedCount,
                completedCount,
                missedCount,
            };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message || 'Unknown error occurred');
        }
    }
);

//fetch Appointments By ViewType
export const fetchAppointmentsByViewType = createAsyncThunk(
    'fetchAppointmentsByViewType',
    async (formData, { rejectWithValue }) => {
        try {
            const headers = await getHeaders();
            const response = await Axios.post(`${Api}Appointment/GetAppointmentInfoListForMobile`, formData, { headers })
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message || 'Unknown error occurred');
        }
    }
);

//fetch Appointments By Dr name and DR ID
export const fetchAppointmentsByProvider = createAsyncThunk(
    'fetchAppointmentsByProvider',
    async (formData, { rejectWithValue }) => {
        try {
            const headers = await getHeaders();
            const response = await Axios.post(`${Api}Appointment/GetAppointmentInfoListForMobile`, formData, { headers })
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch provider list');
        }
    }
);

//Patient Appointment Engaged Completed
export const PatientAppointmentEngagedCompleted = createAsyncThunk(
    'PatientAppointmentEngagedCompleted',
    async (formData, { rejectWithValue }) => {
        try {
            const headers = await getHeaders();
            //console.log("AT SLICE",formData);
            const response = await Axios.post(`${Api}Appointment/PatientAppointmentEngagedCompleted?waitingAreaID=${formData.waitingAreaID}&status=${(formData.status)}`, {}, { headers });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message || 'Failed to change appointment status');
        }
    }
);
//Patient Appointment CheckIn
export const PatientAppointmentCheckIn = createAsyncThunk(
    'PatientAppointmentCheckIn',
    async (formData, { rejectWithValue }) => {
        try {
            const headers = await getHeaders();
            const response = await Axios.post(`${Api}Appointment/PatientAppointmentCheckIn?appointmentID=${formData.selectedAppointmentID}`, {}, { headers })
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message || 'Failed to change appointment status');
        }
    }
);

//handle Status WiseView
export const handleStatusWiseViewForAppointmentList = createAsyncThunk(
    'handleStatusWiseViewForAppointmentList',
    async (formData, { rejectWithValue }) => {
        try {
            const headers = await getHeaders();
            const response = await Axios.post(`${Api}Appointment/GetAppointmentInfoListForMobile`, formData, { headers })
            return response.data
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message || 'Something went wrong');
        }
    }
);
//handle Status WiseView
export const UpdateAppointmentStatus = createAsyncThunk(
    'UpdateAppointmentStatus',
    async (formData, { rejectWithValue }) => {
        try {
            const headers = await getHeaders();
            const response = await Axios.post(`${Api}Appointment/UpdateAppointmentStatus`, formData, { headers })
            return response.data === 1 ? [] : response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message || 'Something went wrong');
        }
    }
);

//Insert Update Appointment Information
export const InsertUpdateAppointmentInformation = createAsyncThunk(
    'InsertUpdateAppointmentInformation',
    async (formData2,{rejectWithValue}) => {
        try {
            const headers = await getHeaders();
            const response = await Axios.post(`${Api}Appointment/InsertUpdateAppointmentInformation`, formData2, { headers });
           //console.log('SLICE RETURN',response.data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message || 'Failed to add new appointment');
        }
    }
);

const appointmentSlice = createSlice({
    name: 'appointments',
    initialState,
    reducers: {
        setViewType: (state, action) => {
            state.viewType = action.payload;
        },
        setProviderName: (state, action) => {
            state.providerName = action.payload;
        },
        setStartDate: (state, action) => {
            state.startDate = action.payload;
        },
        setEndDate: (state, action) => {
            state.endDate = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAppointments.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAppointments.fulfilled, (state, action) => {
                const {
                    provider,
                    appointmentList,
                    allCount,
                    scheduledCount,
                    waitingCount,
                    engagedCount,
                    completedCount,
                    missedCount,
                } = action.payload;

                state.provider = provider;
                state.appointmentList = appointmentList;
                state.allCount = allCount;
                state.scheduledCount = scheduledCount;
                state.waitingCount = waitingCount;
                state.engagedCount = engagedCount;
                state.completedCount = completedCount;
                state.missedCount = missedCount;
                state.loading = false;
                state.error = null;
            })
            .addCase(fetchAppointments.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Error occurred while fetching appointments.';
            })
            .addCase(fetchAppointmentsByViewType.fulfilled, (state, action) => {
                state.appointmentList = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(fetchAppointmentsByViewType.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchAppointmentsByViewType.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAppointmentsByProvider.fulfilled, (state, action) => {
                state.appointmentList = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(fetchAppointmentsByProvider.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchAppointmentsByProvider.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(PatientAppointmentEngagedCompleted.fulfilled, (state, action) => {
                //state.appointmentList = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(PatientAppointmentEngagedCompleted.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(PatientAppointmentEngagedCompleted.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(PatientAppointmentCheckIn.fulfilled, (state, action) => {
                //state.appointmentList = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(PatientAppointmentCheckIn.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(PatientAppointmentCheckIn.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(handleStatusWiseViewForAppointmentList.fulfilled, (state, action) => {
                state.appointmentList = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(handleStatusWiseViewForAppointmentList.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(handleStatusWiseViewForAppointmentList.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(UpdateAppointmentStatus.fulfilled, (state, action) => {
                // state.appointmentList = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(UpdateAppointmentStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(UpdateAppointmentStatus.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(InsertUpdateAppointmentInformation.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(InsertUpdateAppointmentInformation.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(InsertUpdateAppointmentInformation.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
    }
});

export const { setViewType, setProviderName, setStartDate, setEndDate } = appointmentSlice.actions;

export default appointmentSlice.reducer;