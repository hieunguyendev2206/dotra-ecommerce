import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api";

// Lấy thông tin cửa hàng
export const get_shop_info = createAsyncThunk("/get-seller-details-for-store", async (sellerId) => {
    const response = await api.get(`/get-seller-details-for-store/${sellerId}`);
    return response.data;
});

// Lấy danh sách sản phẩm của cửa hàng
export const get_shop_products = createAsyncThunk("/shop/getShopProducts", async (shopId) => {
    const response = await api.get(`/shop/${shopId}/products`);
    return response.data;
});

// Lấy đánh giá của cửa hàng
export const get_shop_reviews = createAsyncThunk("shop/getShopReviews", async (shopId) => {
    const response = await api.get(`/shop/${shopId}/reviews`);
    return response.data;
});

const shopSlice = createSlice({
    name: "shop",
    initialState: {
        shopInfo: null,
        products: [],
        reviews: [],
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(get_shop_info.fulfilled, (state, action) => {
                state.shopInfo = action.payload;
            })
            .addCase(get_shop_products.fulfilled, (state, action) => {
                state.products = action.payload;
            })
            .addCase(get_shop_reviews.fulfilled, (state, action) => {
                state.reviews = action.payload; // Lưu đánh giá vào state
            });
    },
});

export default shopSlice.reducer;
