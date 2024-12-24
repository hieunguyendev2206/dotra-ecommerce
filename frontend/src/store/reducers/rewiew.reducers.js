import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import api from "../../api/api";


// Reducer thêm đánh giá sản phẩm
export const add_review = createAsyncThunk("review/add_review", async (body, thunkAPI) => {
    try {
        const response = await api.post("/review/add-review", body, {
            signal: thunkAPI.signal, withCredentials: true,
        });
        return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
});

// Reducer lấy review của khách hàng
export const get_review = createAsyncThunk("review/get_review", async ({productId, pageNumber}, thunkAPI) => {
    try {
        const response = await api.get(`/review/get-review/${productId}?pageNumber=${pageNumber}`, {
            signal: thunkAPI.signal, withCredentials: true,
        });
        return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
});

// Reducer lấy reply bình luận của seller
export const get_reply_review = createAsyncThunk("review/get_reply_review", async (_, thunkAPI) => {
    try {
        const response = await api.get(`review/get-reply-review`, {
            signal: thunkAPI.signal, withCredentials: true,
        });
        return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
});

export const reviewSlice = createSlice({
    name: "review", initialState: {
        rating_review: [],
        reviews: [],
        sellerReply: [],
        total_review: 0,
        success_message: "",
        error_message: "",
        currentRequestId: undefined,
    }, reducers: {
        message_clear: (state) => {
            state.error_message = "";
            state.success_message = "";
        },
    }, extraReducers(builder) {
        builder
            .addCase(add_review.fulfilled, (state, action) => {
                state.success_message = action.payload.message;
                state.reviews = [...state.reviews, action.payload.data];
            })
            .addCase(get_review.fulfilled, (state, action) => {
                state.reviews = action.payload.reviews;
                state.total_review = action.payload.total_review;
                state.rating_review = action.payload.rating_review;
            })
            .addCase(get_reply_review.fulfilled, (state, action) => {
                state.sellerReply = action.payload.sellerReply;
            })
            .addMatcher((action) => action.type.endsWith("/fulfilled"), (state, action) => {
                if (state.currentRequestId === action.meta.requestId) {
                    state.currentRequestId = undefined;
                }
            })
            .addMatcher((action) => action.type.endsWith("/rejected"), (state, action) => {
                if (state.currentRequestId === action.meta.requestId) {
                    state.currentRequestId = undefined;
                    state.error_message = action.payload.message_error_review;
                }
            })
            .addMatcher((action) => action.type.endsWith("/pending"), (state, action) => {
                state.currentRequestId = action.meta.requestId;
            });
    },
});

export const {message_clear} = reviewSlice.actions;
const reviewReducer = reviewSlice.reducer;
export default reviewReducer;

