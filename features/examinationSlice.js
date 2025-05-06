import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Api from "../api/Api";
import { getHeaders } from "../utils/apiHeaders";


//Get Patient Examination Details For Mobile
export const GetPatientExamination = createAsyncThunk(
    'GetPatientExamination',
    async (formdata, { rejectWithValue }) => {
        try {
            const headers = await getHeaders();
            const response = await Axios.post(`${Api}Patient/GetPatientExaminationDetailsForMobile`, formdata, { headers });
            //console.log('Response:', response.data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to fetch dashboard data");
        }
    }
);

//fetch examination data for adding new examination 
export const fetchExaminationData = createAsyncThunk(
    'fetchClinicData',  // Corrected typo in action name
    async ({ formData, formData1 }, { rejectWithValue }) => {
        try {
            const headers = await getHeaders();

            // Perform both API calls concurrently
            const [chiefComplaintResponse, diagnosisResponse] = await Promise.all([
                Axios.post(`${Api}Clinic/GetLookUps`, formData, { headers }),
                Axios.post(`${Api}Clinic/GetLookUps`, formData1, { headers }),
               
            ]);
            return {
                chiefComplaint: chiefComplaintResponse.data,
                diagnosis: diagnosisResponse.data,
            };
        } catch (error) {
            console.error("Error fetching clinic data:", error);
            return rejectWithValue(error.response?.data || "Failed to fetch clinic data");
        }
    }
);
//Insert Patien tExamination Detail
export const InsertPatientExaminationDetail = createAsyncThunk(
    'InsertPatientExaminationDetail',
    async (formdata, { rejectWithValue }) => {
        try {
            const headers = await getHeaders();
            const response = await Axios.post(`${Api}Patient/InsertPatientExaminationDetail`, formdata, { headers });
            //console.log('Response:', response.data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to fetch dashboard data");
        }
    }
);

// Fetch patient examination details by ID
export const fetchPatientExaminationByID = createAsyncThunk(
    'fetchPatientExaminationByID',
    async ({ clinicID, examinationID }, { rejectWithValue }) => {
        try {
            const headers = await getHeaders();
            const formData = { parameter: { clinicID, patientExaminationID: examinationID } };
            const response = await Axios.post(`${Api}Patient/GetPatientExaminationByExaminationID`, formData, { headers });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to fetch patient examination details");
        }
    }
);


const initialState ={
    patientExamination: [],
    chiefComplaintList:[],
    diagnosisList:[],
    patientExaminationByID:{},
    error: null,
}

const examinationSlice = createSlice({
    name: 'examination',
    initialState:initialState,
    reducers:{},
    extraReducers: (builder) => {
        builder
            .addCase(GetPatientExamination.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(GetPatientExamination.fulfilled, (state, action) => {
                state.loading = false;
                state.patientExamination = action.payload;
            })
            .addCase(GetPatientExamination.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchExaminationData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchExaminationData.fulfilled, (state, action) => {
                state.loading = false;
                state.chiefComplaintList = action.payload.chiefComplaint;
                state.diagnosisList = action.payload.diagnosis;
            })
            .addCase(fetchExaminationData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(InsertPatientExaminationDetail.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(InsertPatientExaminationDetail.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(InsertPatientExaminationDetail.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
             .addCase(fetchPatientExaminationByID.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchPatientExaminationByID.fulfilled, (state, action) => {
                state.loading = false;
                state.patientExaminationByID = action.payload;
            })
            .addCase(fetchPatientExaminationByID.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    }
});


export default examinationSlice.reducer;
