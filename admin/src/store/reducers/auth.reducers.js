/* eslint-disable no-unused-vars */
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {jwtDecode} from "jwt-decode";
import {getAccessTokenFromLS, removeAccessTokenFromLS, setAccessTokenToLS,} from "../../utils/localStorage";
import api from "../../api/api";

// Reducer admin đăng nhập
export const admin_login = createAsyncThunk(
    "auth/admin_login",
    async (body, thunkAPI) => {
        try {
            const response = await api.post("/admin-login", body, {
                signal: thunkAPI.signal,
                withCredentials: true,
            });
            setAccessTokenToLS(response.data.data.access_token);
            return thunkAPI.fulfillWithValue(response.data);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

// Reducer seller đăng ký
export const seller_register = createAsyncThunk(
    "auth/seller_register",
    async (body, thunkAPI) => {
        try {
            const response = await api.post("/seller-register", body, {
                signal: thunkAPI.signal,
                withCredentials: true,
            });
            return thunkAPI.fulfillWithValue(response.data);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

// Reducer xác thực email
export const verify_email = createAsyncThunk(
    "auth/verify_email",
    async (emailToken, thunkAPI) => {
        try {
            const response = await api.post(`/verify-email/${emailToken}`, {
                signal: thunkAPI.signal,
                withCredentials: true,
            });
            return thunkAPI.fulfillWithValue(response.data);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

// Reducer seller đăng nhập
export const seller_login = createAsyncThunk(
    "auth/seller_login",
    async (body, thunkAPI) => {
        try {
            const response = await api.post("/seller-login", body, {
                signal: thunkAPI.signal,
                withCredentials: true,
            });
            setAccessTokenToLS(response.data.data.access_token);
            return thunkAPI.fulfillWithValue(response.data);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

// Reducer lấy thông tin người dùng
export const get_user_info = createAsyncThunk(
    "auth/get_user_info",
    async (_, thunkAPI) => {
        try {
            const response = await api.get("/get-user-info", {
                signal: thunkAPI.signal,
                withCredentials: true,
            });
            return thunkAPI.fulfillWithValue(response.data);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

// Giải mã acccess_token
export const decode_access_token = (access_token) => {
    if (access_token) {
        const decode = jwtDecode(access_token);
        const expireTime = new Date(decode.exp * 1000);
        if (new Date() > expireTime) {
            removeAccessTokenFromLS();
        } else {
            return decode.role;
        }
    }
    return null;
};

// Đăng xuất
export const logout = createAsyncThunk(
    "auth/logout",
    async ({navigate, role}, thunkAPI) => {
        try {
            const response = await api.get("/logout", {
                signal: thunkAPI.signal,
                withCredentials: true,
            });
            removeAccessTokenFromLS();
            navigate(role === "admin" ? "/admin-login" : "/seller-login");
            return thunkAPI.fulfillWithValue(response.data);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

// Reducer upload ảnh profile
export const upload_profile_image = createAsyncThunk(
    "auth/upload_profile_image",
    async (image, thunkAPI) => {
        try {
            const response = await api.post("/upload-profile-image", image, {
                signal: thunkAPI.signal,
                withCredentials: true,
            });
            return thunkAPI.fulfillWithValue(response.data);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

// Reducer thêm thông tin profile
export const add_profile_info = createAsyncThunk(
    "auth/add_profile_info",
    async (body, thunkAPI) => {
        try {
            const response = await api.post("/add-profile-info", body, {
                signal: thunkAPI.signal,
                withCredentials: true,
            });
            return thunkAPI.fulfillWithValue(response.data);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

// Reducer thay đổi mật khẩu
export const change_password = createAsyncThunk(
    "auth/change_password",
    async (body, thunkAPI) => {
        try {
            const response = await api.post("/change-password", body, {
                signal: thunkAPI.signal,
                withCredentials: true,
            });
            return thunkAPI.fulfillWithValue(response.data);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

// Reducer quên mật khẩu
export const forgot_password = createAsyncThunk(
    "auth/forgot_password",
    async (email, thunkAPI) => {
        try {
            const response = await api.post("/forgot-password", email, {
                signal: thunkAPI.signal,
                withCredentials: true,
            });
            console.log(response.data);
            return thunkAPI.fulfillWithValue(response.data);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

// Reducer đặt lại mật khẩu
export const reset_password = createAsyncThunk(
    "auth/reset_password",
    async (body, thunkAPI) => {
        try {
            const response = await api.post("/reset-password", body, {
                signal: thunkAPI.signal,
                withCredentials: true,
            });
            return thunkAPI.fulfillWithValue(response.data);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const authSlice = createSlice({
    name: "auth",
    initialState: {
        user_info: "",
        role: decode_access_token(getAccessTokenFromLS()),
        access_token: getAccessTokenFromLS(),
        success_message: "",
        error_message: "",
        loading: false,
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
            .addCase(admin_login.fulfilled, (state, action) => {
                state.access_token = action.payload.data.access_token;
                state.role = decode_access_token(action.payload.data.access_token);
                state.success_message = action.payload.message;
                state.loading = false;
            })
            .addCase(seller_register.fulfilled, (state, action) => {
                state.success_message = action.payload.message;
                state.loading = false;
            })
            .addCase(verify_email.fulfilled, (state, action) => {
                state.success_message = action.payload.message;
                state.loading = false;
            })
            .addCase(seller_login.fulfilled, (state, action) => {
                state.access_token = action.payload.data.access_token;
                state.role = decode_access_token(action.payload.data.access_token);
                state.success_message = action.payload.message;
                state.loading = false;
            })
            .addCase(get_user_info.fulfilled, (state, action) => {
                state.user_info = action.payload.data;
                state.role = action.payload.data.role;
                state.loading = false;
            })
            .addCase(upload_profile_image.fulfilled, (state, action) => {
                state.loading = false;
                state.success_message = action.payload.message;
                state.user_info = action.payload.data;
            })
            .addCase(logout.fulfilled, (state, action) => {
                state.success_message = action.payload.message;
                state.loading = false;
                state.access_token = "";
                state.role = "";
                state.user_info = "";
            })
            .addCase(add_profile_info.fulfilled, (state, action) => {
                state.loading = false;
                state.success_message = action.payload.message;
                state.user_info = action.payload.data;
            })
            .addCase(change_password.fulfilled, (state, action) => {
                state.loading = false;
                state.success_message = action.payload.message;
            })
            .addCase(forgot_password.fulfilled, (state, action) => {
                state.loading = false;
                state.success_message = action.payload.message;
            })
            .addCase(reset_password.fulfilled, (state, action) => {
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

export const {message_clear} = authSlice.actions;
const authReducer = authSlice.reducer;
export default authReducer;
