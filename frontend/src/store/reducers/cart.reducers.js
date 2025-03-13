import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import api from "../../api/api";



// Reducer thêm sản phẩm vào giỏ hàng
export const add_to_cart = createAsyncThunk("cart/add_to_cart", async (body, thunkAPI) => {
    try {
        const response = await api.post("/cart/add-to-cart", body, {
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
        const response = await api.delete(`/cart/delete-product-cart/${cartId}`, {
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
        const response = await api.put(`/cart/increase-quantity/${cartId}`, {}, {
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
        const response = await api.put(`/cart/decrease-quantity/${cartId}`, {}, {
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
        const response = await api.post("/cart/apply-coupons", body, {
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
        loading: false,
        currentRequestId: undefined,
    }, reducers: {
        message_clear: (state) => {
            state.success_message = "";
            state.error_message = "";
        },
    }, extraReducers(builder) {
        builder
            // add_to_cart
            .addCase(add_to_cart.pending, (state) => {
                state.loading = true;
            })
            .addCase(add_to_cart.fulfilled, (state, action) => {
                state.loading = false;
                state.success_message = action.payload.message;
                state.cart_product_count = state.cart_product_count + 1;
            })
            .addCase(add_to_cart.rejected, (state, action) => {
                state.loading = false;
                state.error_message = action.payload?.message || "Có lỗi xảy ra";
            })

            // get_cart
            .addCase(get_cart.pending, (state) => {
                state.loading = true;
            })
            .addCase(get_cart.fulfilled, (state, action) => {
                state.loading = false;
                state.cart = action.payload.data.cart || [];
                state.total_price = action.payload.data.total_price || 0;
                state.cart_product_count = action.payload.data.cart_product_count || 0;
                state.buy_product_item = action.payload.data.buy_product_item || 0;
                state.out_of_stock = action.payload.data.out_of_stock || [];
                state.shipping_fee = action.payload.data.shipping_fee || 0;
            })
            .addCase(get_cart.rejected, (state, action) => {
                state.loading = false;
                state.error_message = action.payload?.message || "Không thể tải giỏ hàng";
                state.cart = [];
            })

            // delete_product_cart
            .addCase(delete_product_cart.pending, (state) => {
                state.loading = true;
            })
            .addCase(delete_product_cart.fulfilled, (state, action) => {
                state.loading = false;
                state.success_message = action.payload.message;
            })
            .addCase(delete_product_cart.rejected, (state, action) => {
                state.loading = false;
                state.error_message = action.payload?.message || "Không thể xóa sản phẩm";
            })

            // increase_quantity
            .addCase(increase_quantity.pending, (state) => {
                state.loading = true;
            })
            .addCase(increase_quantity.fulfilled, (state, action) => {
                state.loading = false;
                state.success_message = action.payload.message;
            })
            .addCase(increase_quantity.rejected, (state, action) => {
                state.loading = false;
                state.error_message = action.payload?.message || "Không thể tăng số lượng";
            })

            // decrease_quantity
            .addCase(decrease_quantity.pending, (state) => {
                state.loading = true;
            })
            .addCase(decrease_quantity.fulfilled, (state, action) => {
                state.loading = false;
                state.success_message = action.payload.message;
            })
            .addCase(decrease_quantity.rejected, (state, action) => {
                state.loading = false;
                state.error_message = action.payload?.message || "Không thể giảm số lượng";
            })

            // apply_coupons
            .addCase(apply_coupons.pending, (state) => {
                state.loading = true;
            })
            .addCase(apply_coupons.fulfilled, (state, action) => {
                state.loading = false;
                state.success_message = action.payload.message;
                state.coupons_price = action.payload.data || 0;
            })
            .addCase(apply_coupons.rejected, (state, action) => {
                state.loading = false;
                state.error_message = action.payload?.message || "Mã giảm giá không hợp lệ";
            });
    },
});

export const { message_clear } = cartSlice.actions;
const cartReducer = cartSlice.reducer;
export default cartReducer;