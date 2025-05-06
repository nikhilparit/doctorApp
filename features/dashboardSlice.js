import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Api from "../api/Api";
import { getHeaders } from "../utils/apiHeaders";

//GetDashboardDetailForMobile
export const GetDashboardDetail = createAsyncThunk(
    'GetDashboardDetailForMobile',
    async (formdata, { rejectWithValue }) => {
        try {
            const headers = await getHeaders();
            const response = await Axios.post(`${Api}Clinic/GetDashboardDetailForMobile`, formdata, { headers });
            //console.log('Response:', response.data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to fetch dashboard data");
        }
    }
);

const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState: {
        dashbordCount: {},
        loading: false,
        error: null,
    },
    reducers:{},
    extraReducers: (builder) => {
        builder
            .addCase(GetDashboardDetail.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(GetDashboardDetail.fulfilled, (state, action) => {
                state.loading = false;
                state.dashbordCount = action.payload;
            })
            .addCase(GetDashboardDetail.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});


export default dashboardSlice.reducer;