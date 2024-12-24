import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import api from "../../api/api";

// Reducer lấy đơn hàng trả về admin
export const get_orders_to_admin = createAsyncThunk(
    "order/get_orders_to_admin",
    async ({pageNumber, parPage, searchValue}, thunkAPI) => {
        try {
            const response = await api.get(
                `/order/get-orders-to-admin?pageNumber=${pageNumber}&&parPage=${parPage}&&searchValue=${searchValue}`,
                {
                    signal: thunkAPI.signal,
                    withCredentials: true,
                }
            );
            return thunkAPI.fulfillWithValue(response.data);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

// Lấy chi tiết đơn hàng trả về admin
export const get_order_details_to_admin = createAsyncThunk(
    "order/get_order_details_to_admin",
    async (orderId, thunkAPI) => {
        try {
            const response = await api.get(
                `/order/get-order-details-to-admin/${orderId}`,
                {
                    signal: thunkAPI.signal,
                    withCredentials: true,
                }
            );
            return thunkAPI.fulfillWithValue(response.data);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

// Reducer admin thay đổi trạng thái đơn hàng
export const admin_change_status_order = createAsyncThunk(
    "order/admin_change_status_order",
    async (data, thunkAPI) => {
        try {
            const response = await api.put(`/order/admin-change-status-order`, data, {
                signal: thunkAPI.signal,
                withCredentials: true,
            });
            return thunkAPI.fulfillWithValue(response.data);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

// Reducer truy vấn đơn hàng
export const admin_query_orders = createAsyncThunk(
    "order/admin_query_orders",
    async (queryParams, thunkAPI) => {
        try {
            const response = await api.get("/order/admin-query-orders", {
                params: queryParams,
                signal: thunkAPI.signal,
                withCredentials: true,
            });
            return thunkAPI.fulfillWithValue(response.data);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);
// Reducer lấy danh sách đơn hàng trả về seller
export const get_orders_to_seller = createAsyncThunk(
    "order/get_orders_to_seller",
    async ({sellerId, pageNumber, parPage, searchValue}, thunkAPI) => {
        try {
            const response = await api.get(
                `/order/get-orders-to-seller/${sellerId}?pageNumber=${pageNumber}&&parPage=${parPage}&&searchValue=${searchValue}`,
                {
                    signal: thunkAPI.signal,
                    withCredentials: true,
                }
            );
            return thunkAPI.fulfillWithValue(response.data);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

// Reducer lấy chi tiết đơn hàng trả về seller
export const get_order_details_to_seller = createAsyncThunk(
    "order/get_order_details_to_seller",
    async (orderId, thunkAPI) => {
        try {
            const response = await api.get(
                `/order/get-order-details-to-seller/${orderId}`,
                {
                    signal: thunkAPI.signal,
                    withCredentials: true,
                }
            );
            return thunkAPI.fulfillWithValue(response.data);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

// Reducer seller thay đổi trạng thái đơn hàng
export const seller_change_status_order = createAsyncThunk(
    "order/seller_change_status_order",
    async (data, thunkAPI) => {
        try {
            const response = await api.put(
                `/order/seller-change-status-order`,
                data,
                {
                    signal: thunkAPI.signal,
                    withCredentials: true,
                }
            );
            return thunkAPI.fulfillWithValue(response.data);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

// Reducer seller truy vấn đơn hàng
export const seller_query_orders = createAsyncThunk(
    "order/seller_query_orders",
    async ({sellerId, queryParams}, thunkAPI) => {
        try {
            const response = await api.get(`/order/seller-query-orders/${sellerId}`, {
                params: queryParams,
                signal: thunkAPI.signal,
                withCredentials: true,
            });
            return thunkAPI.fulfillWithValue(response.data);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const orderSlice = createSlice({
    name: "order",
    initialState: {
        orders: [],
        order_details: {},
        total_orders: 0,
        success_message: "",
        error_message: "",
        currentRequestId: undefined,
    },
    reducers: {
        message_clear: (state) => {
            state.success_message = "";
            state.error_message = "";
        },
    },
    extraReducers(builder) {
        builder
            .addCase(get_orders_to_admin.fulfilled, (state, action) => {
                state.orders = action.payload.data;
                state.total_orders = action.payload.total;
            })
            .addCase(get_order_details_to_admin.fulfilled, (state, action) => {
                state.order_details = action.payload.data;
            })
            .addCase(admin_change_status_order.fulfilled, (state, action) => {
                state.success_message = action.payload.message;
                const index = state.orders.findIndex(
                    (order) => order._id === action.payload.data._id
                );
                if (index !== -1) {
                    state.orders[index] = action.payload.data;
                }
            })
            .addCase(admin_query_orders.fulfilled, (state, action) => {
                state.orders = action.payload.data.orders;
                state.total_orders = action.payload.data.totalOrders;
            })
            .addCase(get_orders_to_seller.fulfilled, (state, action) => {
                state.orders = action.payload.data;
                state.total_orders = action.payload.total;
            })
            .addCase(get_order_details_to_seller.fulfilled, (state, action) => {
                state.order_details = action.payload.data;
            })
            .addCase(seller_change_status_order.fulfilled, (state, action) => {
                state.success_message = action.payload.message;
                const index = state.orders.findIndex(
                    (order) => order._id === action.payload.data._id
                );
                if (index !== -1) {
                    state.orders[index] = action.payload.data;
                }
            })
            .addCase(seller_query_orders.fulfilled, (state, action) => {
                state.orders = action.payload.data.orders;
                state.total_orders = action.payload.data.totalOrders;
            })
            .addMatcher(
                (action) => action.type.endsWith("/fulfilled"),
                (state, action) => {
                    if (state.currentRequestId === action.meta.requestId) {
                        state.currentRequestId = undefined;
                    }
                }
            )
            .addMatcher(
                (action) => action.type.endsWith("/rejected"),
                (state, action) => {
                    if (state.currentRequestId === action.meta.requestId) {
                        state.error_message = action.payload.message;

                        state.currentRequestId = undefined;
                    }
                }
            )
            .addMatcher(
                (action) => action.type.endsWith("/pending"),
                (state, action) => {
                    state.currentRequestId = action.meta.requestId;
                }
            );
    },
});

export const {message_clear} = orderSlice.actions;
const orderReducer = orderSlice.reducer;
export default orderReducer;
