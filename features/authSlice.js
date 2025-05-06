import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Api from "../api/Api";
import { getHeaders } from "../utils/apiHeaders";


// AsyncThunk for login
export const login = createAsyncThunk(
    "AuthenticateUser",
    async ({ userName, password }, { rejectWithValue }) => {
        try {
            //const headers = await getHeaders();
            const response = await Axios.post(`${Api}Authenticate/AuthenticateUser`, { userName, password });

            if (response.data) {
                // Save user details to AsyncStorage
                const user = response.data;
                await AsyncStorage.setItem("user", JSON.stringify({ ...user }));
                return user;
            } else {
                return rejectWithValue(response.data.message || "Login failed");
            }
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "An error occurred while logging in.");
        }
    }
);

// AsyncThunk for login using OTP
export const loginUsingOTP = createAsyncThunk(
    "LoginUsingOTP",
    async ({ mobileNo }, { rejectWithValue }) => {
        try {
            //const headers = await getHeaders(); 
            const response = await Axios.post(
                `${Api}Authenticate/LoginUsingOTP`,
                { mobileNo },
            );

            if (response.data) {
                const user = response.data;
                await AsyncStorage.setItem("user", JSON.stringify({ ...user }));
                return user;
            } else {
                return rejectWithValue(response.data.message || "OTP login failed");
            }
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "An error occurred while logging in with OTP."
            );
        }
    }
);

//Authenticate User Using Otp
export const AuthenticateUserUsingOtp = createAsyncThunk(
    'AuthenticateUserUsingOtp',
    async (myformData, { rejectWithValue }) => {
        try {
            //const headers = await getHeaders();
            const response = await Axios.post(
                `${Api}Authenticate/AuthenticateUserUsingOtp`,
                myformData,
            );

            if (response.data) {
                const user = response.data;
                await AsyncStorage.setItem("user", JSON.stringify({ ...user }));
                return user; // Return the user object
            } else {
                // Handle unexpected empty response
                return rejectWithValue('No data received from the server');
            }
        } catch (error) {
            console.error('Error:', error);
            return rejectWithValue(error.response?.data || 'Something went wrong');
        }
    }
);

//load User From Storage
export const loadUserFromStorage = createAsyncThunk(
    "auth/loadUserFromStorage",
    async () => {
        try {
            const userString = await AsyncStorage.getItem("user");
            if (userString) {
                const user = JSON.parse(userString);
                return user; // Return the complete user object
            } else {
                return null; // No user found
            }
        } catch (error) {
            console.error("Error loading user from storage:", error);
            return null;
        }
    }
);


//Signup User
export const signupUser = createAsyncThunk("InsertUpdateWebRequestNew",
    async (formData, { rejectWithValue }) => {
        try {
            const response = await Axios.post(`${Api}Authenticate/InsertUpdateWebRequestNew`, formData);
            const user = response.data;
            return user;
        } catch (error) {
            console.error('Error:', error);
            return rejectWithValue(error.response?.data || 'Something went wrong');
        }
    });



const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null, // Initialize user as null
        loading: false,
        error: null,
    },
    reducers: {
        logout(state) {
            state.user = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            }).addCase(loginUsingOTP.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUsingOTP.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(loginUsingOTP.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            }).addCase(AuthenticateUserUsingOtp.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(AuthenticateUserUsingOtp.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(AuthenticateUserUsingOtp.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(loadUserFromStorage.fulfilled, (state, action) => {
                state.user = action.payload;
            })
            .addCase(signupUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(signupUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            }).addCase(signupUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            });
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;