import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Api from "../api/Api";
import { getHeaders } from "../utils/apiHeaders";

//GetPatientsByClinicAndFilters
export const GetPatientsByClinicAndFilters = createAsyncThunk(
    'GetPatientsByClinicAndFilters',
    async (formData, { rejectWithValue }) => {
        try {
            const headers = await getHeaders();
            const response = await Axios.post(`${Api}Patient/GetPatientsByClinicAndFilters`, formData, { headers });
            return response.data
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to fetch patient data");
        }
    }
);
//searchPatients
export const searchPatients = createAsyncThunk(
    'searchPatients',
    async (formData, { rejectWithValue }) => {
        try {
            const headers = await getHeaders();
            const response = await Axios.post(`${Api}Patient/GetPatientsByClinicAndFilters`, formData, { headers });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch patient data');
        }
    }
);
//GetPatientAllDetailForMobile
export const GetPatientAllDetailForMobile = createAsyncThunk(
    'GetPatientAllDetailForMobile',
    async (formData, { rejectWithValue }) => {
        try {
            const headers = await getHeaders();
            const response = await Axios.post(`${Api}Patient/GetPatientAllDetailForMobile`, formData, { headers });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch patient data');
        }
    }
);
//UpdatePatientPortalAccess
export const UpdatePatientPortalAccess = createAsyncThunk(
    'UpdatePatientPortalAccess',
    async (formData, { rejectWithValue }) => {
        try {
            const headers = await getHeaders();
            //console.log("headers",headers);
            const response = await Axios.post(`${Api}Patient/UpdatePatientPortalAccess`, formData, { headers });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to update patient portal access');
        }
    }
);
//fetchDataForNewPatient
export const fetchDataForNewPatient = createAsyncThunk(
    'fetchDataForNewPatient',
    async ({ formDataTitle, formDataOccupation, formDataPatientMedicalAttributes }, { rejectWithValue }) => {
        try {
            const headers = await getHeaders();
            const userString = await AsyncStorage.getItem("user");
            const user = JSON.parse(userString);
            const [countryResponse, newcaseResponse, titlecategoryResponse, occupationcategoryResponse, medicalcategoryResponse] = await Promise.all([
                Axios.post(`${Api}Clinic/GetCountrylist`, {}, { headers }),
                Axios.post(`${Api}Patient/GetNextPatientCode?ClinicID=${user.clinicID}`, {}, { headers }),
                Axios.post(`${Api}Setting/GetLookUpsByCategoryForMobile`, formDataTitle, { headers }),
                Axios.post(`${Api}Setting/GetLookUpsByCategoryForMobile`, formDataOccupation, { headers }),
                Axios.post(`${Api}Setting/GetLookUpsByCategoryForMobile`, formDataPatientMedicalAttributes, { headers }),
            ]);
            //console.log("newcaseResponse.data", newcaseResponse.data);
            return {
                countries: countryResponse.data,
                newcaseNum: newcaseResponse.data,
                title: titlecategoryResponse.data,
                occupation: occupationcategoryResponse.data,
                medicalAttributes: medicalcategoryResponse.data,

            }
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch data for new patient');
        }
    }
);
//Insert New Patient
export const InsertPatient = createAsyncThunk(
    'InsertPatient',
    async (formData, { rejectWithValue }) => {
        try {
            const headers = await getHeaders();
            const response = await Axios.post(`${Api}Patient/InsertPatient`, formData, { headers });
            return response.data;

        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to add new patient');
        }
    }
);
//DeletePatient
export const DeletePatient = createAsyncThunk(
    'DeletePatient',
    async (formData, { rejectWithValue }) => {
        try {
            const headers = await getHeaders();
            const response = await Axios.post(`${Api}Patient/DeletePatient`, formData, { headers })
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to delete patient');
        }
    }
)

const initialState = {
    patientList: [],
    loading: false,
    error: null,
    pageIndex: 0, // Initial page index
    pageSize: 10, // Default page size
    query: '',
    PatientAllDetail: {},
    portalAccess: false,
    countryList: [],
    newcaseNum: '',
    title: [],
    occupation: [],
    medicalAttributes: []
}
const patientSlice = createSlice({
    name: 'patient',
    initialState: initialState,
    reducers: {
        resetPatientList: (state) => {
            state.patientList = [];
            state.pageIndex = 0;
        },
        updatePageIndex: (state, action) => {
            state.pageIndex = action.payload; // Update page index
        },
        updatePageSize: (state, action) => {
            state.pageSize = action.payload; // Update page size
        },
        setQuery: (state, action) => {
            state.query = action.payload; // Update the search query
        },
        setPortalAccess(state, action) {
            state.portalAccess = action.payload;
        },
        updateCaseNumber(state, action) { 
            state.newcaseNum = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(GetPatientsByClinicAndFilters.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(GetPatientsByClinicAndFilters.fulfilled, (state, action) => {
                state.loading = false;
                state.patientList = [...state.patientList, ...action.payload]; // Append new data
            })
            .addCase(GetPatientsByClinicAndFilters.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(searchPatients.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(searchPatients.fulfilled, (state, action) => {
                state.loading = false;
                state.patientList = action.payload; // Replace data with search results
            })
            .addCase(searchPatients.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(GetPatientAllDetailForMobile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(GetPatientAllDetailForMobile.fulfilled, (state, action) => {
                state.loading = false;
                state.PatientAllDetail = action.payload;
            })
            .addCase(GetPatientAllDetailForMobile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(UpdatePatientPortalAccess.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(UpdatePatientPortalAccess.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(UpdatePatientPortalAccess.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchDataForNewPatient.fulfilled, (state, action) => {
                state.loading = false;
                state.countryList = action.payload.countries;
                state.newcaseNum = action.payload.newcaseNum;
                state.title = action.payload.title;
                state.occupation = action.payload.occupation;
                state.medicalAttributes = action.payload.medicalAttributes;
            })
            .addCase(fetchDataForNewPatient.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchDataForNewPatient.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(InsertPatient.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(InsertPatient.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(InsertPatient.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(DeletePatient.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(DeletePatient.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(DeletePatient.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
    },
});

export const { updatePageIndex, updatePageSize, setQuery, resetPatientList, setPortalAccess,updateCaseNumber  } = patientSlice.actions;
export default patientSlice.reducer;


