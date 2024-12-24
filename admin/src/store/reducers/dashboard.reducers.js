import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import api from "../../api/api";

// Lấy dữ liệu dashboard cho admin
export const get_admin_dashboard_data = createAsyncThunk(
    "dashboard/get_admin_dashboard_data",
    async (_, thunkAPI) => {
        try {
            const response = await api.get("/dashboard/get-admin-dashboard-data", {
                signal: thunkAPI.signal,
                withCredentials: true,
            });
            return thunkAPI.fulfillWithValue(response.data);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response ? error.response.data : error.message);
        }
    }
);

// Lấy dữ liệu dashboard cho người bán
export const get_seller_dashboard_data = createAsyncThunk(
    "dashboard/get_seller_dashboard_data",
    async (_, thunkAPI) => {
        try {
            const response = await api.get("/dashboard/get-seller-dashboard-data", {
                signal: thunkAPI.signal,
                withCredentials: true,
            });
            return thunkAPI.fulfillWithValue(response.data);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response ? error.response.data : error.message);
        }
    }
);

// Lấy dữ liệu theo tháng (thống kê theo tháng)
export const get_data_on_chart = createAsyncThunk(
    "dashboard/get_data_on_chart",
    async (_, thunkAPI) => {
        try {
            const response = await api.get("/dashboard/get-data-on-chart", {
                signal: thunkAPI.signal,
                withCredentials: true,
            });
            return thunkAPI.fulfillWithValue(response.data);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response ? error.response.data : error.message);
        }
    }
);

// Lấy dữ liệu thống kê trả về cho người bán
export const get_seller_chart_data = createAsyncThunk(
    "dashboard/get_seller_chart_data",
    async (_, thunkAPI) => {
        try {
            const response = await api.get("/dashboard/get-seller-chart-data", {
                signal: thunkAPI.signal,
                withCredentials: true,
            });
            return thunkAPI.fulfillWithValue(response.data);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response ? error.response.data : error.message);
        }
    }
);

export const dashboardSlice = createSlice({
    name: "dashboard",
    initialState: {
        total_amount: 0,
        total_order: 0,
        total_product: 0,
        total_seller: 0,
        total_customer: 0,
        recent_order: [],
        monthlyOrderCounts: [],
        monthlyProductCounts: [],
        monthlyUniqueCustomerCounts: [],
        monthlySellerCounts: [],
        monthlyCustomerCounts: [],
        monthlyCategoryCounts: [],
        monthlyRevenues: [],
        percentagesArray: [],
        loading: false,
        error_message: null,
        currentRequestId: undefined,
    },
    reducers: {},
    extraReducers(builder) {
        builder
            // Khi dữ liệu admin dashboard trả về thành công
            .addCase(get_admin_dashboard_data.fulfilled, (state, action) => {
                state.total_amount = action.payload.data.totalAmount || 0;
                state.total_order = action.payload.data.totalOrder || 0;
                state.total_product = action.payload.data.totalProduct || 0;
                state.total_seller = action.payload.data.totalSeller || 0;
                state.recent_order = action.payload.data.recentOrder || [];
            })

            // Khi dữ liệu seller dashboard trả về thành công
            .addCase(get_seller_dashboard_data.fulfilled, (state, action) => {
                state.total_amount = action.payload.data.totalAmount || 0;
                state.total_order = action.payload.data.totalOrder || 0;
                state.total_product = action.payload.data.totalProduct || 0;
                state.total_customer = action.payload.data.totalCustomer || 0;
                state.recent_order = action.payload.data.recentOrder || [];
            })

            // Khi dữ liệu biểu đồ trả về thành công
            .addCase(get_data_on_chart.fulfilled, (state, action) => {
                state.monthlyOrderCounts = action.payload.monthlyOrderCounts || [];
                state.monthlyProductCounts = action.payload.monthlyProductCounts || [];
                state.monthlySellerCounts = action.payload.monthlySellerCounts || [];
                state.monthlyCustomerCounts = action.payload.monthlyCustomerCounts || [];
                state.monthlyCategoryCounts = action.payload.monthlyCategoryCounts || [];
                state.monthlyRevenues = action.payload.monthlyRevenues || [];
                state.percentagesArray = action.payload.percentagesArray || [];
            })

            // Khi dữ liệu biểu đồ cho người bán trả về thành công
            .addCase(get_seller_chart_data.fulfilled, (state, action) => {
                state.monthlyOrderCounts = action.payload.monthlyOrderCounts || [];
                state.monthlyProductCounts = action.payload.monthlyProductCounts || [];
                state.monthlyUniqueCustomerCounts = action.payload.monthlyUniqueCustomerCounts || [];
                state.monthlyRevenues = action.payload.monthlyRevenues || [];
                state.percentagesArray = action.payload.percentagesArray || [];
            })

            // Matcher cho các case khi fulfilled
            .addMatcher(
                (action) => action.type.endsWith("/fulfilled"),
                (state, action) => {
                    if (state.currentRequestId === action.meta.requestId) {
                        state.loading = false;
                        state.currentRequestId = undefined;
                    }
                }
            )

            // Matcher cho các case khi rejected
            .addMatcher(
                (action) => action.type.endsWith("/rejected"),
                (state, action) => {
                    if (state.currentRequestId === action.meta.requestId) {
                        state.error_message = action.payload?.message || action.error?.message;
                        state.loading = false;
                        state.currentRequestId = undefined;
                    }
                }
            )

            // Matcher cho các case khi pending
            .addMatcher(
                (action) => action.type.endsWith("/pending"),
                (state, action) => {
                    state.loading = true;
                    state.currentRequestId = action.meta.requestId;
                }
            );
    },
});

const dashboardReducer = dashboardSlice.reducer;
export default dashboardReducer;
