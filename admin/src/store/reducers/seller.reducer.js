/* eslint-disable no-unused-vars */
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import api from "../../api/api";

// Reducer lấy danh sách seller yêu cầu kích hoạt tài khoản
export const get_seller_request = createAsyncThunk(
    "seller/get_seller_request",
    async ({page, parPage, searchValue}, thunkAPI) => {
        try {
            const response = await api.get(
                `/get-seller-request?page=${page}&&parPage=${parPage}&&searchValue=${searchValue}`,
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

// Reducer lấy chi tiết thông tin seller
export const get_seller_details = createAsyncThunk(
    "seller/get_seller_details",
    async (sellerId, thunkAPI) => {
        try {
            const response = await api.get(`/get-seller-details/${sellerId}`, {
                signal: thunkAPI.signal,
                withCredentials: true,
            });
            return thunkAPI.fulfillWithValue(response.data);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

// Reducer thay đổi trạng thái seller
export const seller_update_status = createAsyncThunk(
    "seller/seller_update_status",
    async (body, thunkAIP) => {
        try {
            const response = await api.put(`/seller-update-status`, body, {
                signal: thunkAIP.signal,
                withCredentials: true,
            });
            return thunkAIP.fulfillWithValue(response.data);
        } catch (error) {
            return thunkAIP.rejectWithValue(error.response.data);
        }
    }
);

// Reducer lấy danh sách seller đã kích hoạt
export const get_seller_active = createAsyncThunk(
    "seller/get_seller_active",
    async ({page, parPage, searchValue}, thunkAPI) => {
        try {
            const response = await api.get(
                `/get-seller-active?page=${page}&&parPage=${parPage}&&searchValue=${searchValue}`,
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

// Reducer lấy danh sách seller bị vô hiệu hóa
export const get_seller_deactive = createAsyncThunk(
    "seller/get_seller_deactive",
    async ({page, parPage, searchValue}, thunkAPI) => {
        try {
            const response = await api.get(
                `/get-seller-deactive?page=${page}&&parPage=${parPage}&&searchValue=${searchValue}`,
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

export const sellerSlice = createSlice({
    name: "seller",
    initialState: {
        success_message: "",
        error_message: "",
        loading: false,
        totalSeller: 0,
        seller_info: "",
        sellers: [],
        sellers_pending: [],
        sellers_deactive: [],
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
            .addCase(get_seller_request.fulfilled, (state, action) => {
                state.sellers_pending = action.payload.sellers;
                state.totalSeller = action.payload.totalSeller;
            })
            .addCase(get_seller_details.fulfilled, (state, action) => {
                state.seller_info = action.payload.seller_info;
            })
            .addCase(seller_update_status.fulfilled, (state, action) => {
                state.success_message = action.payload.message;
                state.seller_info = action.payload.data;
            })
            .addCase(get_seller_active.fulfilled, (state, action) => {
                state.sellers = action.payload.sellers;
                state.totalSeller = action.payload.totalSeller;
            })
            .addCase(get_seller_deactive.fulfilled, (state, action) => {
                state.sellers_deactive = action.payload.sellers;
                state.totalSeller = action.payload.totalSeller;
            })
            .addMatcher(
                (action) => action.type.endsWith("/fulfilled"),
                (state, action) => {
                    if (
                        state.loading &&
                        state.currentRequestId === action.meta.requestId
                    ) {
                        state.loading = false;
                        state.currentRequestId = undefined;
                    }
                }
            )
            .addMatcher(
                (action) => action.type.endsWith("/rejected"),
                (state, action) => {
                    if (
                        state.loading &&
                        state.currentRequestId === action.meta.requestId
                    ) {
                        state.error_message = action.payload.message;
                        state.loading = false;
                        state.currentRequestId = undefined;
                    }
                }
            )
            .addMatcher(
                (action) => action.type.endsWith("/pending"),
                (state, action) => {
                    if (state.loading === false) {
                        state.loading = true;
                        state.currentRequestId = action.meta.requestId;
                    }
                }
            );
    },
});

export const {message_clear} = sellerSlice.actions;
const sellerReducer = sellerSlice.reducer;
export default sellerReducer;
