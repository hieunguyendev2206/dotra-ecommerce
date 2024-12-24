import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import api from "../../api/api";



// Reducer lấy dữ liệu dashboard
export const get_dashboard_data = createAsyncThunk("dashboard/get_dashboard_data", async (customerId, thunkAPI) => {
    try {
        const response = await api.get(`/dashboard/get-dashboard-data/${customerId}`, {
            signal: thunkAPI.signal, withCredentials: true,
        });
        return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
});

export const dashboardSlice = createSlice({
    name: "dashboard", initialState: {
        success_message: "",
        error_message: "",
        recent_orders: 0,
        total_orders: 0,
        total_delivered: 0,
        total_processing: 0,
        total_cancelled: 0,
        currentRequestId: undefined,
    }, reducers: {
        message_clear: (state) => {
            state.success_message = "";
            state.error_message = "";
        },
    }, extraReducers(builder) {
        builder
            .addCase(get_dashboard_data.fulfilled, (state, action) => {
                state.recent_orders = action.payload.data.recent_orders;
                state.total_orders = action.payload.data.total_orders;
                state.total_delivered = action.payload.data.total_delivered;
                state.total_processing = action.payload.data.total_processing;
                state.total_cancelled = action.payload.data.total_cancelled;
            })
            .addMatcher((action) => action.type.endsWith("/fulfilled"), (state, action) => {
                if (state.currentRequestId === action.meta.requestId) {
                    state.currentRequestId = undefined;
                }
            })
            .addMatcher((action) => action.type.endsWith("/rejected"), (state, action) => {
                if (state.currentRequestId === action.meta.requestId) {
                    state.error_message = action.payload.message;
                    state.currentRequestId = undefined;
                }
            })
            .addMatcher((action) => action.type.endsWith("/pending"), (state, action) => {
                state.currentRequestId = action.meta.requestId;
            });
    },
});

export const {message_clear} = dashboardSlice.actions;
const dashboardReducer = dashboardSlice.reducer;
export default dashboardReducer;
