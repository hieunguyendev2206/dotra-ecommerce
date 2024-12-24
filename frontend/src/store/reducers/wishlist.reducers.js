import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import api from "../../api/api";



// Reducer thêm sản phẩm vào danh sách yêu thích
export const add_to_wishlist = createAsyncThunk("wishlist/add_to_wishlist", async (body, thunkAPI) => {
    try {
        const response = await api.post("wishlist/add-to-wishlist", body, {
            signal: thunkAPI.signal, withCredentials: true,
        });
        return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
});

// Reducer lấy danh sách yêu thích
export const get_wishlist = createAsyncThunk("wishlist/get_wishlist", async (customerId, thunkAPI) => {
    try {
        const response = await api.get(`wishlist/get-wishlist/${customerId}`, {
            signal: thunkAPI.signal, withCredentials: true,
        });
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
});

// Reducer xóa sản phẩm khỏi danh sách yêu thích
export const delete_wishlist = createAsyncThunk("wishlist/delete_wishlist", async (wishlistId, thunkAPi) => {
    try {
        const response = await api.delete(`wishlist/delete-wishlist/${wishlistId}`, {
            signal: thunkAPi.signal, withCredentials: true,
        });
        return thunkAPi.fulfillWithValue(response.data);
    } catch (error) {
        return thunkAPi.rejectWithValue(error.response.data);
    }
});

export const wishlistSlice = createSlice({
    name: "wishlist", initialState: {
        wishlist: [],
        total_wishlist: 0,
        add_wishlist_success_message: "",
        add_wishlist_error_message: "",
        delete_wishlist_success_message: "",
        delete_wishlist_error_message: "",
        currentRequestId: undefined,
    }, reducers: {
        message_clear_add_wishlist: (state) => {
            state.add_wishlist_success_message = "";
            state.add_wishlist_error_message = "";
        }, message_clear_delete_wishlist: (state) => {
            state.delete_wishlist_success_message = "";
            state.delete_wishlist_error_message = "";
        },
    }, extraReducers(builder) {
        builder
            .addCase(add_to_wishlist.fulfilled, (state, action) => {
                state.add_wishlist_success_message = action.payload.message;
                state.total_wishlist = state.total_wishlist + 1;
            })
            .addCase(get_wishlist.fulfilled, (state, action) => {
                state.wishlist = action.payload.data;
                state.total_wishlist = action.payload.total_wishlist;
            })
            .addCase(delete_wishlist.fulfilled, (state, action) => {
                state.delete_wishlist_success_message = action.payload.message;
                state.wishlist = state.wishlist.filter((item) => item._id !== action.payload.data._id);
                state.total_wishlist = state.total_wishlist - 1;
            })
            .addMatcher((action) => action.type.endsWith("/fulfilled"), (state, action) => {
                if (state.currentRequestId === action.meta.requestId) {
                    state.currentRequestId = undefined;
                }
            })
            .addMatcher((action) => action.type.endsWith("/rejected"), (state, action) => {
                if (state.currentRequestId === action.meta.requestId) {
                    state.add_wishlist_error_message = action.payload.message;
                    state.delete_wishlist_error_message = action.payload.message;
                    state.currentRequestId = undefined;
                }
            })
            .addMatcher((action) => action.type.endsWith("/pending"), (state, action) => {
                state.currentRequestId = action.meta.requestId;
            });
    },
});

export const {message_clear_add_wishlist, message_clear_delete_wishlist} = wishlistSlice.actions;
const wishlistReducer = wishlistSlice.reducer;
export default wishlistReducer;