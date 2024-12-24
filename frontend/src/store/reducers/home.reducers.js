import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import api from "../../api/api";



// Lấy danh mục sản phẩm
export const get_categories = createAsyncThunk("home/get_categories", async (_, thunkAPI) => {
    try {
        const response = await api.get("/home/get-categories", {
            signal: thunkAPI.signal, withCredentials: true,
        });
        return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
});

// Lấy danh sách sản phẩm nổi bật
export const get_feature_products = createAsyncThunk("home/get_feature_products", async (_, thunkAPI) => {
    try {
        const response = await api.get("/home/get-feature-products", {
            signal: thunkAPI.signal, withCredentials: true,
        });
        return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
});

// Truy vấn sản phẩm
// export const query_products = createAsyncThunk("home/query_products", async (queryParams, thunkAPI) => {
//     try {
//         const response = await api.get("/home/query-products", {
//             params: queryParams, signal: thunkAPI.signal, withCredentials: true,
//         });
//         return thunkAPI.fulfillWithValue(response.data);
//     } catch (error) {
//         return thunkAPI.rejectWithValue(error.response.data);
//     }
// });

// Truy vấn sản phẩm
export const query_products = createAsyncThunk(
    "home/query_products",
    async (queryParams, thunkAPI) => {
        try {
            const response = await api.get("/home/query-products", {
                params: queryParams, // Bao gồm seller_id và các bộ lọc khác
                signal: thunkAPI.signal,
                withCredentials: true,
            });
            return thunkAPI.fulfillWithValue(response.data);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);



// Lấy chi tiết sản phẩm theo id
export const get_product_details = createAsyncThunk("home/get_product_details", async (productId, thunkAPI) => {
    try {
        const response = await api.get(`/home/get-product-details/${productId}`, {
            signal: thunkAPI.signal, withCredentials: true,
        });
        return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
});

export const get_product_details_by_slug = createAsyncThunk(
    "home/get_product_details_by_slug",
    async (slug, thunkAPI) => {
        try {
            const response = await api.get(`/home/get-product-details/by-slug/${slug}`);
            return thunkAPI.fulfillWithValue(response.data);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);



export const homeSlice = createSlice({
    name: "home", initialState: {
        categories: [],
        products: [],
        product_details: {},
        related_products: [],
        more_products: [],
        latest_products: [],
        top_rated_products: [],
        discount_products: [],
        totalProducts: 0,
        currentRequestId: undefined,
    }, reducers: {}, extraReducers(builder) {
        builder
            .addCase(get_categories.fulfilled, (state, action) => {
                state.categories = action.payload.data;
            })
            .addCase(get_feature_products.fulfilled, (state, action) => {
                state.products = action.payload.data.products;
                state.latest_products = action.payload.data.latest_products;
                state.top_rated_products = action.payload.data.top_rated_products;
                state.discount_products = action.payload.data.discount_products;
            })
            .addCase(query_products.fulfilled, (state, action) => {
                state.products = action.payload.data.products;
                state.totalProducts = action.payload.data.totalProducts;
            })
            .addCase(get_product_details.fulfilled, (state, action) => {
                state.product_details = action.payload.data.product_details;
                state.related_products = action.payload.data.related_products;
                state.more_products = action.payload.data.more_products;
            })
            .addCase(get_product_details_by_slug.fulfilled, (state, action) => {
                console.log("Product details loaded:", action.payload);
                state.product_details = action.payload.data.product_details || {};
                state.related_products = action.payload.data.related_products || [];
                state.more_products = action.payload.data.more_products || []; // Cập nhật more_products
            })
            .addMatcher((action) => action.type.endsWith("/fulfilled"), (state, action) => {
                if (state.currentRequestId === action.meta.requestId) {
                    state.currentRequestId = undefined;
                }
            })
            .addMatcher((action) => action.type.endsWith("/rejected"), (state, action) => {
                if (state.currentRequestId === action.meta.requestId) {
                    state.currentRequestId = undefined;
                }
            })
            .addMatcher((action) => action.type.endsWith("/pending"), (state, action) => {
                state.currentRequestId = action.meta.requestId;
            });
    },
});

const homeReducer = homeSlice.reducer;
export default homeReducer;