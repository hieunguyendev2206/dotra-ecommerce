import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";

// Reducer lấy danh sách customer đang chat
export const get_customers_chat = createAsyncThunk(
    "chat/get_customers_chat",
    async (sellerId, thunkAPI) => {
        try {
            const response = await api.get(`/chat/get-customers-chat/${sellerId}`, {
                signal: thunkAPI.signal,
                withCredentials: true,
            });
            return thunkAPI.fulfillWithValue(response.data);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

// Reducer lấy tin nhắn của customer trả về seller
export const get_customer_seller_messages = createAsyncThunk(
    "chat/get_customer_seller_messages",
    async (customerId, thunkAPI) => {
        try {
            const response = await api.get(
                `/chat/get-customer-seller-messages/${customerId}`,

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

// Reducer gửi tin nhắn từ seller đến customer
export const send_message_seller_customer = createAsyncThunk(
    "chat/send_message_seller_customer",
    async (body, thunkAPI) => {
        try {
            const response = await api.post(
                "/chat/send-message-seller-customer",
                body,
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

// Reducer lấy danh sách seller đang chat
export const get_sellers_chat = createAsyncThunk(
    "chat/get_sellers_chat",
    async (_, thunkAPI) => {
        try {
            const response = await api.get("/chat/get-sellers-chat", {
                signal: thunkAPI.signal,
                withCredentials: true,
            });
            return thunkAPI.fulfillWithValue(response.data);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

// Reducer gửi tin nhắn từ seller đến admin
export const send_message_seller_admin = createAsyncThunk(
    "chat/send_message_seller_admin",
    async (body, thunkAPI) => {
        try {
            const response = await api.post("/chat/send-message-seller-admin", body, {
                signal: thunkAPI.signal,
                withCredentials: true,
            });
            return thunkAPI.fulfillWithValue(response.data);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

// Reducer lấy tin nhắn của seller đến admin
export const get_seller_messages = createAsyncThunk(
    "chat/get_seller_messages",
    async (receiverId, thunkAPI) => {
        try {
            const response = await api.get(`/chat/get-seller-messages`, {
                signal: thunkAPI.signal,
                withCredentials: true,
            });
            return thunkAPI.fulfillWithValue(response.data);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const get_admin_messages = createAsyncThunk(
    "chat/get_admin_messages",
    async (receiverId, thunkAPI) => {
        try {
            const response = await api.get(`/chat/get-admin-messages/${receiverId}`, {
                signal: thunkAPI.signal,
                withCredentials: true,
            });
            return thunkAPI.fulfillWithValue(response.data);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const chatSlice = createSlice({
    name: "chat",
    initialState: {
        customers: [],
        sellers: [],
        current_customer: {},
        current_seller: {},
        customer_seller_messages: [],
        seller_admin_messages: [],
        activeCustomers: [],
        activeSeller: [],
        activeAdmin: "",
        messageNotification: [],
        success_message: "",
        error_message: "",
        currentRequestId: undefined,
    },
    reducers: {
        message_clear: (state) => {
            state.success_message = "";
            state.error_message = "";
        },
        update_message_customer: (state, action) => {
            state.customer_seller_messages = [
                ...state.customer_seller_messages,
                action.payload,
            ];
        },
        update_active_customer: (state, action) => {
            state.activeCustomers = action.payload.data;
        },
        update_active_seller: (state, action) => {
            state.activeSeller = action.payload.data;
        },
        update_seller_message: (state, action) => {
            if (
                !state.seller_admin_messages.find(
                    (msg) => msg._id === action.payload._id
                )
            ) {
                state.seller_admin_messages = [
                    ...state.seller_admin_messages,
                    action.payload,
                ];
            }
        },
        update_admin_message: (state, action) => {
            if (
                !state.seller_admin_messages.find(
                    (msg) => msg._id === action.payload._id
                )
            ) {
                state.seller_admin_messages = [
                    ...state.seller_admin_messages,
                    action.payload,
                ];
            }
        },
    },
    extraReducers(builder) {
        builder
            .addCase(get_customers_chat.fulfilled, (state, action) => {
                state.customers = action.payload.data;
            })
            .addCase(get_customer_seller_messages.fulfilled, (state, action) => {
                state.current_customer = action.payload.data.customer;
                state.customer_seller_messages = action.payload.data.messages;
            })
            .addCase(send_message_seller_customer.fulfilled, (state, action) => {
                state.customer_seller_messages.push(action.payload.messages);
                state.success_message = action.payload.message;
                let customerIndex = state.customers.findIndex(
                    (customer) => customer.friendId === action.payload.messages.receiverId
                );
                if (customerIndex > 0) {
                    let customer = state.customers[customerIndex];
                    state.customers.splice(customerIndex, 1);
                    state.customers.unshift(customer);
                }
            })
            .addCase(send_message_seller_admin.fulfilled, (state, action) => {
                state.seller_admin_messages = [
                    ...state.seller_admin_messages,
                    action.payload.messages,
                ];
                state.success_message = action.payload.message;
            })
            .addCase(get_seller_messages.fulfilled, (state, action) => {
                state.seller_admin_messages = action.payload.messages;
            })
            .addCase(get_sellers_chat.fulfilled, (state, action) => {
                state.sellers = action.payload.data;
            })
            .addCase(get_admin_messages.fulfilled, (state, action) => {
                state.current_seller = action.payload.data.seller;
                state.seller_admin_messages = action.payload.data.messages;
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

export const {
    message_clear,
    update_message_customer,
    update_active_customer,
    update_active_seller,
    update_admin_message,
    update_seller_message,
} = chatSlice.actions;
const chatReducer = chatSlice.reducer;
export default chatReducer;
