import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api";

export const fetchBlogs = createAsyncThunk("blog/fetchBlogs", async (_, thunkAPI) => {
    try {
        const response = await api.get("/blogs");
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
});

export const fetchBlogDetails = createAsyncThunk("blog/fetchBlogDetails", async (blogId, thunkAPI) => {
    try {
        const response = await api.get(`/blogs/${blogId}`);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
});

export const fetchBlogBySlug = createAsyncThunk("blog/fetchBlogBySlug", async (slug, thunkAPI) => {
    try {
        const response = await api.get(`/blogs/slug/${slug}`);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
});



export const blogSlice = createSlice({
    name: "blog",
    initialState: { blogs: [], blogDetails: null, loading: false, error: null },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchBlogs.fulfilled, (state, action) => {
                state.blogs = action.payload.data;
                state.loading = false;
            })
            .addCase(fetchBlogDetails.fulfilled, (state, action) => {
                state.blogDetails = action.payload.data;
                state.loading = false;
            });
    },
});

export default blogSlice.reducer;
