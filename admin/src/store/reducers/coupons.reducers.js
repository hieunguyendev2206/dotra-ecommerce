import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import api from "../../api/api";

// Reducer thêm mã giảm giá
export const add_coupons = createAsyncThunk(
    "coupons/add_coupons",
    async (data, thunkAPI) => {
        try {
            const response = await api.post("/add-coupons", data, {
                signal: thunkAPI.signal,
                withCredentials: true,
            });
            return thunkAPI.fulfillWithValue(response.data);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

// Reducer lấy danh sách mã giảm giá
export const get_coupons = createAsyncThunk(
    "coupons/get_coupons",
    async ({page, parPage, searchValue}, thunkAPI) => {
        try {
            const response = await api.get(
                `/get-coupons?page=${page}&&parPage=${parPage}&&searchValue=${searchValue}`,
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

// Lấy chi tiết mã giảm giá
export const get_coupon = createAsyncThunk(
    "coupons/get_coupon",
    async (couponId, thunkAPI) => {
        try {
            const response = await api.get(`/get-coupon/${couponId}`, {
                signal: thunkAPI.signal,
                withCredentials: true,
            });
            return thunkAPI.fulfillWithValue(response.data);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

// Reducer chỉnh sửa mã giảm giá
export const update_coupons = createAsyncThunk(
    "coupons/update_coupons",
    async (body, thunkAPI) => {
        try {
            const response = await api.put("/update-coupons", body, {
                signal: thunkAPI.signal,
                withCredentials: true,
            });
            return thunkAPI.fulfillWithValue(response.data);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

// Reducer xóa mã giảm giá
export const delete_coupons = createAsyncThunk(
    "coupons/delete_coupons",
    async (couponId, thunkAPI) => {
        try {
            const response = await api.delete(`/delete-coupons/${couponId}`, {
                signal: thunkAPI.signal,
                withCredentials: true,
            });
            return thunkAPI.fulfillWithValue(response.data);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const couponsSlice = createSlice({
    name: "coupons",
    initialState: {
        coupons: [],
        coupon: "",
        totalCoupons: 0,
        loading: false,
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
            .addCase(add_coupons.fulfilled, (state, action) => {
                state.loading = false;
                state.success_message = action.payload.message;
                state.coupons = [...state.coupons, action.payload.data];
            })
            .addCase(get_coupons.fulfilled, (state, action) => {
                state.loading = false;
                state.coupons = action.payload.data;
                state.totalCoupons = action.payload.totalCoupons;
            })
            .addCase(get_coupon.fulfilled, (state, action) => {
                state.loading = false;
                state.coupon = action.payload.data;
            })
            .addCase(update_coupons.fulfilled, (state, action) => {
                state.loading = false;
                state.success_message = action.payload.message;
                state.coupons = state.coupons.map((coupon) =>
                    coupon._id === action.payload.data._id ? action.payload.data : coupon
                );
            })
            .addCase(delete_coupons.fulfilled, (state, action) => {
                state.loading = false;
                state.success_message = action.payload.message;
                state.coupons = state.coupons.filter(
                    (coupon) => coupon._id !== action.payload.data._id
                );
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

export const {message_clear} = couponsSlice.actions;
const couponsReducer = couponsSlice.reducer;
export default couponsReducer;
