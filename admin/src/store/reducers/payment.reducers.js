import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import api from "../../api/api";

// Reducer tạo tài khoản thanh toán Stripe
export const create_stripe_connect_account = createAsyncThunk(
    "payment/create_stripe_connect_account",
    async (_, thunkAPI) => {
        try {
            const {
                data: {url},
            } = await api.get(`/payment/create-stripe-connect-account`, {
                withCredentials: true,
            });
            console.log(url);
            window.location.href = url;
            return {url};
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

// Reducer kích hoạt tài khoản thanh toán Stripe
export const activate_stripe_connect_account = createAsyncThunk(
    "payment/activate_stripe_connect_account",
    async (activeCode, thunkAPI) => {
        try {
            const response = await api.put(
                `/payment/activate-stripe-connect-account/${activeCode}`,
                {},
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

// Reducer lấy thông tin thống kê tài sản seller
export const get_seller_revenue = createAsyncThunk(
    "payment/get_seller_revenue",
    async (sellerId, thunkAPI) => {
        try {
            const response = await api.get(
                `/payment/seller-request-revenue/${sellerId}`,
                {
                    withCredentials: true,
                }
            );
            return thunkAPI.fulfillWithValue(response.data);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

// Reducer gửi yêu cầu rút tiền
export const send_request_withdrawal = createAsyncThunk(
    "payment/send_request_withdrawal",
    async (data, thunkAPI) => {
        try {
            const response = await api.post(
                "/payment/send-request-withdrawal",
                data,
                {
                    withCredentials: true,
                }
            );
            return thunkAPI.fulfillWithValue(response.data);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

// Reducer admin nhận yêu cầu rút tiền
export const admin_receive_withdrawal_request = createAsyncThunk(
    "payment/admin_receive_withdrawal_request",
    async (_, thunkAPI) => {
        try {
            const response = await api.get(
                `/payment/admin-receive-withdrawal-request`,
                {
                    withCredentials: true,
                }
            );
            return thunkAPI.fulfillWithValue(response.data);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

// Reducer xác nhận yêu cầu rút tiền
export const confirm_withdrawal_request = createAsyncThunk(
    "payment/confirm_withdrawal_request",
    async (withdrawalRequestId, thunkAPI) => {
        try {
            const response = await api.post(
                `/payment/confirm-withdrawal-request/${withdrawalRequestId}`,
                {},
                {
                    withCredentials: true,
                }
            );
            return thunkAPI.fulfillWithValue(response.data);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const paymentSlice = createSlice({
    name: "payment",
    initialState: {
        success_message: "",
        error_message: "",
        pendingWithdrawalRequest: [],
        successWithdrawalRequest: [],
        pendingAmount: 0,
        successAmount: 0,
        totalAmount: 0,
        availableAmount: 0,
        loading: false,
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
            .addCase(get_seller_revenue.fulfilled, (state, action) => {
                state.pendingWithdrawalRequest =
                    action.payload.pendingWithdrawalRequest;
                state.successWithdrawalRequest =
                    action.payload.successWithdrawalRequest;
                state.pendingAmount = action.payload.pendingAmount;
                state.successAmount = action.payload.successAmount;
                state.totalAmount = action.payload.totalAmount;
                state.availableAmount = action.payload.availableAmount;
            })
            .addCase(send_request_withdrawal.fulfilled, (state, action) => {
                state.loading = false;
                state.success_message = action.payload.message;
                state.pendingWithdrawalRequest = [
                    ...state.pendingWithdrawalRequest,
                    action.payload.data,
                ];
                state.pendingAmount = state.pendingAmount + action.payload.data.amount;
                state.availableAmount =
                    state.availableAmount - action.payload.data.amount;
            })
            .addCase(activate_stripe_connect_account.fulfilled, (state, action) => {
                state.success_message = action.payload.message;
            })
            .addCase(admin_receive_withdrawal_request.fulfilled, (state, action) => {
                state.pendingWithdrawalRequest =
                    action.payload.pendingWithdrawalRequest;
            })
            .addCase(confirm_withdrawal_request.fulfilled, (state, action) => {
                state.success_message = action.payload.message;
                state.pendingWithdrawalRequest = state.pendingWithdrawalRequest.filter(
                    (item) => item._id !== action.payload.data._id
                );
                state.successWithdrawalRequest = [
                    ...state.successWithdrawalRequest,
                    action.payload.data,
                ];
                state.pendingAmount = state.pendingAmount - action.payload.data.amount;
                state.successAmount = state.successAmount + action.payload.data.amount;
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

export const {message_clear} = paymentSlice.actions;
const paymentReducer = paymentSlice.reducer;
export default paymentReducer;
