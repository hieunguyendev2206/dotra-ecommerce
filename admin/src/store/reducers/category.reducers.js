import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import api from "../../api/api";

// Reducer thêm danh mục sản phẩm
export const add_category = createAsyncThunk(
    "category/add_category",
    async ({category_name, image}, thunkAPI) => {
        try {
            const formData = new FormData();
            formData.append("category_name", category_name);
            formData.append("image", image);
            const response = await api.post("/add-category", formData, {
                signal: thunkAPI.signal,
                withCredentials: true,
            });
            return thunkAPI.fulfillWithValue(response.data);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

// Reducer lấy danh sách danh mục sản phẩm
export const get_categories = createAsyncThunk(
    "category/get_categories",
    async ({page, parPage, searchValue}, thunkAPI) => {
        try {
            const response = await api.get(
                `/get-categories?page=${page}&&parPage=${parPage}&&searchValue=${searchValue}`,
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

export const categorySlice = createSlice({
    name: "category",
    initialState: {
        success_message: "",
        error_message: "",
        loading: false,
        categories: [],
        totalCategory: 0,
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
            .addCase(add_category.fulfilled, (state, action) => {
                state.loading = false;
                state.success_message = action.payload.message;
                state.categories = [...state.categories, action.payload.data];
            })
            .addCase(get_categories.fulfilled, (state, action) => {
                state.loading = false;
                state.totalCategory = action.payload.totalCategory;
                state.categories = action.payload.category;
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

export const {message_clear} = categorySlice.actions;
const categoryReducer = categorySlice.reducer;
export default categoryReducer;
