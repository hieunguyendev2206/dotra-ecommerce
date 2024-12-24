import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api";

// 1. Reducer thêm một người bạn vào danh sách chat
export const add_chat_friend = createAsyncThunk(
    "chat/add_chat_friend",
    async (body, thunkAPI) => {
        try {
            const response = await api.post("/chat/add-chat-friend", body, {
                signal: thunkAPI.signal,
                withCredentials: true,
            });
            return thunkAPI.fulfillWithValue(response.data);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

// 2. Reducer gửi tin nhắn
export const send_message = createAsyncThunk(
    "chat/send_message",
    async (body, thunkAPI) => {
        try {
            const response = await api.post("/chat/send-message", body, {
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
        my_friends: [],
        current_friend: {},
        messages: [],
        success_message: "",
        error_message: "",
        currentRequestId: undefined,
    },
    reducers: {
        message_clear: (state) => {
            state.success_message = "";
            state.error_message = "";
        },
        update_message: (state, { payload }) => {
            state.messages = [...state.messages, payload];
        },
    },
    extraReducers(builder) {
        builder
            .addCase(add_chat_friend.fulfilled, (state, action) => {
                state.current_friend = action.payload.current_friend;
                state.my_friends = action.payload.my_friends;
                state.messages = action.payload.messages;
            })
            .addCase(send_message.fulfilled, (state, action) => {
                state.messages.push(action.payload.messages);
                state.success_message = action.payload.message;
                let friendIndex = state.my_friends.findIndex(
                    (friend) => friend.friendId === action.payload.messages.receiverId
                );
                if (friendIndex > 0) {
                    let friend = state.my_friends[friendIndex];
                    state.my_friends.splice(friendIndex, 1);
                    state.my_friends.unshift(friend);
                }
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

export const { message_clear, update_message } = chatSlice.actions;
const chatReducer = chatSlice.reducer;
export default chatReducer;
