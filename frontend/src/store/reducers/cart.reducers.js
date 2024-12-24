import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import api from "../../api/api";



// Reducer thêm sản phẩm vào giỏ hàng
export const add_to_cart = createAsyncThunk("cart/add_to_cart", async (body, thunkAPI) => {
    try {
        const response = await api.post("cart/add-to-cart", body, {
            signal: thunkAPI.signal, withCredentials: true,
        });
        return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
});

// Reducer lấy sản phẩm trong giỏ hàng
export const get_cart = createAsyncThunk("cart/get_cart", async (customerId, thunkAPI) => {
    try {
        const response = await api.get(`/cart/get-cart/${customerId}`, {
            signal: thunkAPI.signal, withCredentials: true,
        });
        return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
});

// Reducer xoá sản phẩm khỏi giỏ hàng
export const delete_product_cart = createAsyncThunk("cart/delete_product_cart", async (cartId, thunkAPI) => {
    try {
        const response = await api.delete(`cart/delete-product-cart/${cartId}`, {
            signal: thunkAPI.signal, withCredentials: true,
        });
        return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
});

// Reducer tăng số lượng sản phẩm trong giỏ hàng
export const increase_quantity = createAsyncThunk("cart/increase_quantity", async (cartId, thunkAPI) => {
    try {
        const response = await api.put(`cart/increase-quantity/${cartId}`, {
            signal: thunkAPI.signal, withCredentials: true,
        });
        return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
});

// Reducer giảm số lượng sản phẩm trong giỏ hàng
export const decrease_quantity = createAsyncThunk("cart/decrease_quantity", async (cartId, thunkAPI) => {
    try {
        const response = await api.put(`cart/decrease-quantity/${cartId}`, {
            signal: thunkAPI.signal, withCredentials: true,
        });
        return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
});

// Reducer áp dụng mã giảm giá
export const apply_coupons = createAsyncThunk("cart/apply_coupons", async (body, thunkAPI) => {
    try {
        const response = await api.post("cart/apply-coupons", body, {
            signal: thunkAPI.signal, withCredentials: true,
        });
        return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
});

export const cartSlice = createSlice({
    name: "cart", initialState: {
        cart: [],
        cart_product_count: 0,
        buy_product_item: 0,
        shipping_fee: 0,
        total_price: 0,
        coupons_price: 0,
        out_of_stock: [],
        success_message: "",
        error_message: "",
        currentRequestId: undefined,
    }, reducers: {
        message_clear: (state) => {
            state.success_message = "";
            state.error_message = "";
        },
    }, extraReducers(builder) {
        builder
            .addCase(add_to_cart.fulfilled, (state, action) => {
                state.success_message = action.payload.message;
                state.cart_product_count = state.cart_product_count + 1;
            })
            .addCase(get_cart.fulfilled, (state, action) => {
                state.cart = action.payload.data.cart;
                state.total_price = action.payload.data.total_price;
                state.cart_product_count = action.payload.data.cart_product_count;
                state.buy_product_item = action.payload.data.buy_product_item;
                state.out_of_stock = action.payload.data.out_of_stock;
                state.shipping_fee = action.payload.data.shipping_fee;
            })
            .addCase(delete_product_cart.fulfilled, (state, action) => {
                state.success_message = action.payload.message;
            })
            .addCase(increase_quantity.fulfilled, (state, action) => {
                state.success_message = action.payload.message;
            })
            .addCase(decrease_quantity.fulfilled, (state, action) => {
                state.success_message = action.payload.message;
            })
            .addCase(apply_coupons.fulfilled, (state, action) => {
                state.success_message = action.payload.message;
                state.coupons_price = action.payload.data;
            })
            .addMatcher((action) => action.type.endsWith("/fulfilled"), (state, action) => {
                if (state.currentRequestId === action.meta.requestId) {
                    state.currentRequestId = undefined;
                }
            })
            .addMatcher((action) => action.type.endsWith("/rejected"), (state, action) => {
                if (state.currentRequestId === action.meta.requestId) {
                    state.currentRequestId = undefined;
                    state.error_message = action.payload.message;
                }
            })
            .addMatcher((action) => action.type.endsWith("/pending"), (state, action) => {
                state.currentRequestId = action.meta.requestId;
            });
    },
});

export const {message_clear} = cartSlice.actions;
const cartReducer = cartSlice.reducer;
export default cartReducer;