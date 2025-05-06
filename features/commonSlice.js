import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Api from "../api/Api";
import { getHeaders } from "../utils/apiHeaders";

// fetching the provider list 
export const providerList = createAsyncThunk(
    'providerList',
    async (formData, { rejectWithValue }) => {
        try {
            const headers = await getHeaders();
            const response = await Axios.post(`${Api}patient/GetProviderInfo`, formData, { headers });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch provider list');
        }
    }
);
// fetching the patient Details 
export const patientDetails = createAsyncThunk(
    'getpatientDetails',
    async (formData, { rejectWithValue }) => {
        try {
            const headers = await getHeaders();
            const response = await Axios.post(`${Api}Appointment/GetPatientByPatientID`, formData, { headers });
           // console.log("patientDetails", response.data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch patient details');
        }
    }
);

//title List
export const titleList = createAsyncThunk(
    'titleList',
    async (formData, { rejectWithValue }) => {
        try {
            const headers = await getHeaders();
            const response = await Axios.post(`${Api}Setting/GetLookUpsByCategoryForMobile`, formData, { headers });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch data');
        }
    }
);
//Occupation Data
export const Occupation = createAsyncThunk(
    'Occupation',
    async (formData, { rejectWithValue }) => {
        try {
            const headers = await getHeaders();
            const response = await Axios.post(`${Api}Setting/GetLookUpsByCategoryForMobile`, formData, { headers });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch data');
        }
    }
);
//Medical Attributes
export const MedicalAttributes = createAsyncThunk(
    'MedicalAttributes',
    async (formData, { rejectWithValue }) => {
        try {
            const headers = await getHeaders();
            const response = await Axios.post(`${Api}Setting/GetLookUpsByCategoryForMobile`, formData, { headers });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch data');
        }
    }
);
//Get ptient by id 
export const fetchPatient = createAsyncThunk(
    'fetchPatient',
    async (formData, { rejectWithValue }) => {
        try {
            const headers = await getHeaders();
            const response = await Axios.post(`${Api}Patient/GetPatientbyID`, formData, { headers });
            return response.data;

        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch data');
        }
    }
);
// Async thunk to fetch country list and timezones concurrently
export const fetchCountryAndStateData = createAsyncThunk(
    'fetchCountryAndStateData',  // Corrected typo in action name
    async ({ formData }, { rejectWithValue }) => {
        try {
            const headers = await getHeaders();

            // Perform both API calls concurrently
            const [countryResponse, stateResponse] = await Promise.all([
                Axios.post(`${Api}Clinic/GetCountrylist`, {}, { headers }),
                Axios.post(`${Api}Clinic/GetStateByCountryID`, formData, { headers }),
            ]);

            // Return the fetched data
            return {
                countries: countryResponse.data,
                states: stateResponse.data,
            };
        } catch (error) {
            console.error("Error fetching clinic data:", error);
            return rejectWithValue(error.response?.data || "Failed to fetch clinic data");
        }
    }
);

const initialState = {
    providerList: [],
    patientDetails: {},
    titleList: [],
    occupationList: [],
    MedicalAttributesList: [],
    patientInfoData: {},
    countryList: [],
    stateList: [],
    loading: false,
    error: null
}

const commonSlice = createSlice({
    name: 'common',
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(providerList.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(providerList.fulfilled, (state, action) => {
                state.loading = false;
                state.providerList = action.payload;
            })
            .addCase(providerList.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(patientDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(patientDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.patientDetails = action.payload;
            })
            .addCase(patientDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(titleList.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(titleList.fulfilled, (state, action) => {
                state.loading = false;
                state.titleList = action.payload;
            })
            .addCase(titleList.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(Occupation.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(Occupation.fulfilled, (state, action) => {
                state.loading = false;
                state.occupationList = action.payload;
            })
            .addCase(Occupation.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(MedicalAttributes.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(MedicalAttributes.fulfilled, (state, action) => {
                state.loading = false;
                state.MedicalAttributesList = action.payload;
            })
            .addCase(MedicalAttributes.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchPatient.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPatient.fulfilled, (state, action) => {
                state.loading = false;
                state.patientInfoData = action.payload;
            })
            .addCase(fetchPatient.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchCountryAndStateData.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchCountryAndStateData.fulfilled, (state, action) => {
                state.loading = false;
                state.countryList = action.payload.countries;
                state.stateList = action.payload.states;
            })
            .addCase(fetchCountryAndStateData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    }
});

export const { } = commonSlice.actions;

export default commonSlice.reducer;
