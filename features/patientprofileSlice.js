import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Api from "../api/Api";
import { getHeaders } from "../utils/apiHeaders";

//Update Patient Personal Detai lFor Mobile
export const UpdatePatientPersonalDetailForMobile = createAsyncThunk(
    'UpdatePatientPersonalDetail',
    async (formData, { rejectWithValue }) => {
        try {
            const headers = await getHeaders();
            const response = await Axios.post(`${Api}Patient/UpdatePatientPersonalDetailForMobile`, formData, { headers });
            return response.data;

        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch data');
        }
    }
);
//Get Patient Contact DetailBy PatientID for Mobile
export const GetPatientContactDetailByPatientIDforMobile = createAsyncThunk(
    'GetPatientContactDetailByPatientIDforMobile',
    async (formData, { rejectWithValue }) => {
        try {
            const headers = await getHeaders();
            const response = await Axios.post(`${Api}Patient/GetPatientContactDetailByPatientIDforMobile`, formData, { headers });
            return response.data;

        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch data');
        }
    }
);
//SaveOrUpdatePatientContactDetailforMobile
export const SaveOrUpdatePatientContactDetailforMobile = createAsyncThunk(
    'SaveOrUpdatePatientContactDetailforMobile',
    async (formData, { rejectWithValue }) => {
        try {
            const headers = await getHeaders();
            const response = await Axios.post(`${Api}Patient/SaveOrUpdatePatientContactDetailforMobile`, formData, { headers });
            return response.data;

        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch data');
        }
    }
);
const initialState = {
    PatientPersonalDetail: {},
    patientContactData: {},
    loading: false,
    error: null
}

const patientProfile = createSlice({
    name: 'patientProfile',
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(UpdatePatientPersonalDetailForMobile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(UpdatePatientPersonalDetailForMobile.fulfilled, (state, action) => {
                state.loading = false;
                state.PatientPersonalDetail = action.payload;
            })
            .addCase(UpdatePatientPersonalDetailForMobile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(GetPatientContactDetailByPatientIDforMobile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(GetPatientContactDetailByPatientIDforMobile.fulfilled, (state, action) => {
                state.loading = false;
                state.patientContactData = action.payload;
            })
            .addCase(GetPatientContactDetailByPatientIDforMobile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(SaveOrUpdatePatientContactDetailforMobile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(SaveOrUpdatePatientContactDetailforMobile.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(SaveOrUpdatePatientContactDetailforMobile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    }
});

export const { } = patientProfile.actions;

export default patientProfile.reducer;
