import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Api from "../api/Api";
import { getHeaders } from "../utils/apiHeaders";
import { useNavigation } from "@react-navigation/native";

// Get Clinics By UserID
export const GetClinicsByUserID = createAsyncThunk(
    'GetClinicsByUserID',
    async (formData, { rejectWithValue }) => {
        try {
            const headers = await getHeaders();
            const response = await Axios.post(`${Api}Authenticate/GetClinicsByUserID`, formData, { headers });
           // console.log("API Response:", response.data); // Log the entire API response
            return response.data; // Ensure the API returns a proper structure
        } catch (error) {
            console.error("Error fetching clinic list:", error);
            return rejectWithValue(error.response?.data || "Failed to fetch clinic list");
        }
    }
);

//Inser Extension Request
export const InserExtensionRequest = createAsyncThunk(
    'InserExtensionRequest',
    async(formData,{rejectWithValue})=>{
        try {
            const headers = await getHeaders();
            const response = await Axios.post(`${Api}Clinic/InserExtensionRequest`,formData,{headers});
            return response.data;  
        } catch (error) {
            //console.error("Error to sent extention request:", error.message);
            return rejectWithValue(error.response?.data || "Failed to sent extention request");
        }
    }
);

// Async thunk to fetch country list and timezones concurrently
export const fetchClinicData = createAsyncThunk(
    'fetchClinicData',  // Corrected typo in action name
    async ({ formData, formDataForUserProfile }, { rejectWithValue }) => {
        try {
            const headers = await getHeaders();

            // Perform both API calls concurrently
            const [countryResponse, stateResponse, timezoneResponse, userProfileResponse] = await Promise.all([
                Axios.post(`${Api}Clinic/GetCountrylist`, {}, { headers }),
                Axios.post(`${Api}Clinic/GetStateByCountryID`, formData, { headers }),
                Axios.post(`${Api}Clinic/GetAllTimezone`, {}, { headers }),
                Axios.post(`${Api}Authenticate/GetUserProfileUserIDForMobile`, formDataForUserProfile, { headers }),
            ]);

            // Get the current user data from AsyncStorage before updating
            const userString = await AsyncStorage.getItem('user');
            const user = JSON.parse(userString);
            let updatedUser = null;
            // Ensure the userProfileResponse contains the necessary data (email, mobileNo)
            if (user && userProfileResponse) {
                 updatedUser = { 
                    ...user, 
                    email: userProfileResponse.data.email,  // Adjust based on the actual response structure
                    mobileNumber: userProfileResponse.data.mobileNo // Adjust based on the actual response structure
                };

                // Save the updated user back to AsyncStorage
                await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
            }

            // Return the fetched data
            return {
                countries: countryResponse.data,
                states: stateResponse.data,
                timezones: timezoneResponse.data,
                userProfile: userProfileResponse.data,
                updatedUser 
            };
        } catch (error) {
            console.error("Error fetching clinic data:", error);
            return rejectWithValue(error.response?.data || "Failed to fetch clinic data");
        }
    }
);

//Clinic/InsertClinicForExistingUser
export const InsertClinicForExistingUser = createAsyncThunk(
    "InsertClinicForExistingUser",
    async(formData,{rejectWithValue})=>{
        try {
            const headers = await getHeaders();
            const response = await Axios.post(`${Api}Clinic/InsertClinicForExistingUser`,formData,{headers});
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to insert clinic");
        }
    }
);

const clinicSlice = createSlice({
    name: 'clinic',
    initialState: {
        clinicID: null,
        clinicName: '',
        clinicList: [],
        countryList: [],
        timezoneList: [],
        stateList:[],
        userProfile:{},
        isLoading: false,
        error: null,
    },
    reducers: {
        setClinic: (state, action) => {
            state.clinicID = action.payload.clinicID;
            state.clinicName = action.payload.clinicName;
        },
    },  extraReducers: (builder) => {
        builder
            .addCase(GetClinicsByUserID.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(GetClinicsByUserID.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;
                state.clinicList = action.payload;
            })
            .addCase(GetClinicsByUserID.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(InserExtensionRequest.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(InserExtensionRequest.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;
                //state.clinicList = action.payload;
            })
            .addCase(InserExtensionRequest.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(fetchClinicData.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchClinicData.fulfilled, (state, action) => {
                state.isLoading = false;
                state.countryList = action.payload.countries;
                state.timezoneList = action.payload.timezones;
                state.stateList = action.payload.states;
            })
            .addCase(fetchClinicData.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(InsertClinicForExistingUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(InsertClinicForExistingUser.fulfilled, (state, action) => {
               // console.log(action.payload);
                state.isLoading = false;
                //state.clinicList = action.payload;
                state.error = null;
            })
            .addCase(InsertClinicForExistingUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
            
    },
});

export const { setClinic } = clinicSlice.actions;

export default clinicSlice.reducer;