import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import api from "../../api/api";

// Reducer lấy bình luận của khách hàng
export const get_review_seller = createAsyncThunk(
    "review/get_review_seller",
    async ({page, parPage, searchValue}, thunkAPI) => {
        try {
            const response = await api.get(
                `review/get-review-seller?page=${page}&&parPage=${parPage}&&searchValue=${searchValue}`,
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

// Reducer lấy bình luận của khách hàng theo id
export const get_review_by_id = createAsyncThunk(
    "review/get_review_by_id",
    async (reviewId, thunkAPI) => {
        try {
            const response = await api.get(`review/get-review-by-id/${reviewId}`, {
                signal: thunkAPI.signal,
                withCredentials: true,
            });
            return thunkAPI.fulfillWithValue(response.data);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

// Reducer trả lời bình luận của khách hàng
export const reply_review = createAsyncThunk(
    "review/reply_review",
    async ({reviewId, reply}, thunkAPI) => {
        try {
            const response = await api.post(
                "review/reply-review",
                {reviewId, reply},
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

export const reviewSlice = createSlice({
    name: "review",
    initialState: {
        reviews: [],
        review: "",
        success_message: "",
        error_message: "",
        totalReview: 0,
        loading: false,
    },
    reducers: {
        message_clear: (_, state) => {
            state.success_message = "";
            state.error_message = "";
        },
    },
    extraReducers(builder) {
        builder
            .addCase(get_review_seller.fulfilled, (state, action) => {
                state.reviews = action.payload.reviews;
                state.totalReview = action.payload.totalReview;
            })
            .addCase(get_review_by_id.fulfilled, (state, action) => {
                state.review = action.payload.review;
            })
            .addCase(reply_review.fulfilled, (state, action) => {
                state.loading = false;
                state.success_message = action.payload.message;
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

export const {message_clear} = reviewSlice.actions;
const reviewReducer = reviewSlice.reducer;
export default reviewReducer;
