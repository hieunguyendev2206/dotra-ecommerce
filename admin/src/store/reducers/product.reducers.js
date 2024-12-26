/* eslint-disable no-unused-vars */
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import api from "../../api/api";

// Reducer thêm sản phẩm
export const add_product = createAsyncThunk(
    "product/add_product",
    async (body, thunkAPI) => {
        try {
            const response = await api.post("/add-product", body, {
                signal: thunkAPI.signal,
                withCredentials: true,
            });
            return thunkAPI.fulfillWithValue(response.data);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

// Reducer lấy danh sách sản phẩm
export const get_products = createAsyncThunk(
    "product/get_products",
    async ({page, parPage, searchValue}, thunkAPI) => {
        try {
            const response = await api.get(
                `/get-products?page=${page}&&parPage=${parPage}&&searchValue=${searchValue}`,
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

// Reducer chi tiết sản phẩm
export const get_product = createAsyncThunk(
    "product/get_product",
    async (productId, thunkAPI) => {
        try {
            const response = await api.get(`/get-product/${productId}`, {
                signal: thunkAPI.signal,
                withCredentials: true,
            });
            return thunkAPI.fulfillWithValue(response.data);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

// Reducer cập nhật sản phẩm
export const update_product = createAsyncThunk(
    "product/update_product",
    async (body, thunkAPI) => {
        try {
            const response = await api.put("/update-product", body, {
                signal: thunkAPI.signal,
                withCredentials: true,
            });
            return thunkAPI.fulfillWithValue(response.data);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

// Reducer cập nhật ảnh sản phẩm
export const update_product_image = createAsyncThunk(
    "product/update_product_image",
    async ({old_image, new_image, productId}, thunkAPI) => {
        try {
            const formData = new FormData();
            formData.append("old_image", old_image);
            formData.append("new_image", new_image);
            formData.append("productId", productId);
            const response = await api.put("/update-product-image", formData, {
                signal: thunkAPI.signal,
                withCredentials: true,
            });
            return thunkAPI.fulfillWithValue(response.data);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

// Reducer xóa sản phẩm
export const delete_product = createAsyncThunk(
    "product/delete_product",
    async (productIdDelete, thunkAPI) => {
        try {
            const response = await api.delete(`/delete-product/${productIdDelete}`, {
                signal: thunkAPI.signal,
                withCredentials: true,
            });
            return thunkAPI.fulfillWithValue(response.data);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const productSlice = createSlice({
    name: "product",
    initialState: {
        success_message: "",
        error_message: "",
        loading: false,
        totalProduct: 0,
        products: [],
        product: {},
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
            .addCase(add_product.fulfilled, (state, action) => {
                state.loading = false;
                state.success_message = action.payload.message;
                state.products = [...state.products, action.payload.data];
            })
            .addCase(get_products.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload.products;
                state.totalProduct = action.payload.totalProduct;
            })
            .addCase(get_product.fulfilled, (state, action) => {
                state.loading = false;
                state.product = action.payload.product;
            })
            .addCase(update_product.fulfilled, (state, action) => {
                state.loading = false;
                state.success_message = action.payload.message;
                state.product = action.payload.data;
                const index = state.products.findIndex(
                    (product) => product._id === action.payload.data._id
                );
                if (index !== -1) {
                    state.products[index] = action.payload.data;
                }
            })
            .addCase(update_product_image.fulfilled, (state, action) => {
                state.loading = false;
                state.product = action.payload.data;
            })
            .addCase(delete_product.fulfilled, (state, action) => {
                state.products = state.products.filter(
                    (product) => product._id !== action.payload.data._id
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

export const {message_clear} = productSlice.actions;
const productReducer = productSlice.reducer;
export default productReducer;
