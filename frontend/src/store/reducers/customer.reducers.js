import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
    getCustomerAccessTokenFromLS,
    removeCustomerAccessTokenFromLS,
    setCustomerAccessTokenToLS,
} from "../../utils/localStorage";
import {jwtDecode} from "jwt-decode";
import api from "../../api/api";

export const upload_profile_image = createAsyncThunk(
    "customer/upload_profile_image",
    async ({ type, formData }, thunkAPI) => {
        try {
            const response = await api.post("/upload-profile-image", formData, {
                headers: { "Content-Type": "multipart/form-data" },
                withCredentials: true,
            });
            return { type, url: response.data.data[type] };
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || "Đã xảy ra lỗi khi upload ảnh");
        }
    }
);

export const get_customer_profile = createAsyncThunk(
    "customer/get_customer_profile",
    async (_, thunkAPI) => {
        try {
            const response = await api.get("/customer-profile", { withCredentials: true });
            return response.data.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Không tìm thấy thông tin người dùng."
            );
        }
    }
);

export const update_customer_profile = createAsyncThunk(
    "customer/update_customer_profile",
    async (updatedInfo, thunkAPI) => {
        try {
            const response = await api.put("/update-profile", updatedInfo, { withCredentials: true });
            return response.data.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || "Lỗi khi cập nhật thông tin");
        }
    }
);

export const customer_register = createAsyncThunk(
    "customer/customer_register",
    async (body, thunkAPI) => {
        try {
            const response = await api.post("/customer-register", body, {
                signal: thunkAPI.signal,
                withCredentials: true,
            });
            return thunkAPI.fulfillWithValue(response.data);
        } catch (error) {
            const errorMessage = error.response?.data || "Lỗi khi đăng ký customer";
            return thunkAPI.rejectWithValue(errorMessage);
        }
    }
);

export const verify_email_customer = createAsyncThunk(
    "auth/verify_email_customer",
    async (email_token, thunkAPI) => {
        try {
            const response = await api.post(`/verify-email-customer/${email_token}`, {
                signal: thunkAPI.signal,
                withCredentials: true,
            });
            return thunkAPI.fulfillWithValue(response.data);
        } catch (error) {
            const errorMessage = error.response?.data || "Lỗi khi xác thực email";
            return thunkAPI.rejectWithValue(errorMessage);
        }
    }
);

export const customer_login = createAsyncThunk(
    "customer/customer_login",
    async (body, thunkAPI) => {
        try {
            const response = await api.post("/customer-login", body, {
                signal: thunkAPI.signal,
                withCredentials: true,
            });
            setCustomerAccessTokenToLS(response.data.data);
            return thunkAPI.fulfillWithValue(response.data);
        } catch (error) {
            const errorMessage = error.response?.data || "Lỗi khi đăng nhập";
            return thunkAPI.rejectWithValue(errorMessage);
        }
    }
);

export const customer_logout = createAsyncThunk(
    "customer/customer_logout",
    async (_, thunkAPI) => {
        try {
            await api.get("/customer-logout", {
                withCredentials: true,
            });
            removeCustomerAccessTokenFromLS(); // Đảm bảo token bị xóa khỏi localStorage
            return thunkAPI.fulfillWithValue();
        } catch (error) {
            return thunkAPI.rejectWithValue("Lỗi khi đăng xuất");
        }
    }
);




const decode_customer_access_token = (customer_access_token) => {
    if (customer_access_token) {
        try {
            const decoded = jwtDecode(customer_access_token);
            const expireTime = new Date(decoded.exp * 1000);
            if (new Date() > expireTime) {
                removeCustomerAccessTokenFromLS();
                return null;
            }
            return decoded;
        } catch (error) {
            removeCustomerAccessTokenFromLS();
            return null;
        }
    }
    return null;
};

export const customerSlice = createSlice({
    name: "customer",
    initialState: {
        loading: false,
        userInfo: decode_customer_access_token(getCustomerAccessTokenFromLS()),
        profile: null,
        success_message: "",
        error_message: "",
        currentRequestId: undefined,
    },
    reducers: {
        message_clear: (state) => {
            state.success_message = "";
            state.error_message = "";
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(get_customer_profile.fulfilled, (state, action) => {
                state.profile = action.payload;
                state.loading = false;
            })
            .addCase(upload_profile_image.pending, (state) => {
                state.loading = true;  // Bắt đầu gọi API, trạng thái đang tải là true
            })
            .addCase(upload_profile_image.fulfilled, (state, action) => {
                const { type, url } = action.payload;
                if (!state.profile) {
                    state.profile = {};
                }
                if (type === "avatar") {
                    state.profile.avatar = `${url}?t=${new Date().getTime()}`;
                } else if (type === "cover") {
                    state.profile.cover = `${url}?t=${new Date().getTime()}`;
                }
                state.success_message = "Upload ảnh thành công";
                state.loading = false; // Gọi API thành công, trạng thái đang tải là false
            })
            .addCase(upload_profile_image.rejected, (state, action) => {
                state.error_message = action.payload || "Đã xảy ra lỗi khi upload ảnh";
                state.loading = false; // Gọi API thất bại, trạng thái đang tải là false
            })
            .addCase(update_customer_profile.fulfilled, (state, action) => {
                state.profile = { ...state.profile, ...action.payload };
                state.success_message = "Cập nhật thông tin thành công";
                state.loading = false;
            })
            .addCase(customer_register.fulfilled, (state, action) => {
                state.loading = false;
                state.success_message = action.payload.message;
            })
            .addCase(verify_email_customer.fulfilled, (state, action) => {
                state.loading = false;
                state.success_message = action.payload.message;
            })
            .addCase(customer_login.fulfilled, (state, action) => {
                state.loading = false;
                state.success_message = action.payload.message;
                state.userInfo = decode_customer_access_token(action.payload.data);
            })
            .addCase(customer_logout.fulfilled, (state) => {
                state.userInfo = null;
                state.success_message = "Đăng xuất thành công";
                removeCustomerAccessTokenFromLS(); // Đảm bảo token bị xóa khỏi localStorage
            })
            .addCase(customer_logout.rejected, (state, action) => {
                state.error_message = action.payload || "Lỗi khi đăng xuất";
                state.loading = false;
            })
            .addMatcher((action) => action.type.endsWith("/fulfilled"), (state, action) => {
                if (state.loading && state.currentRequestId === action.meta.requestId) {
                    state.loading = false;
                    state.currentRequestId = undefined;
                }
            })
            .addMatcher((action) => action.type.endsWith("/rejected"), (state, action) => {
                if (state.loading && state.currentRequestId === action.meta.requestId) {
                    state.error_message = action.payload || "Đã xảy ra lỗi";
                    state.loading = false;
                    state.currentRequestId = undefined;
                }
            })
            .addMatcher((action) => action.type.endsWith("/pending"), (state, action) => {
                if (state.loading === false) {
                    state.loading = true;
                    state.currentRequestId = action.meta.requestId;
                }
            });
    },
});

export const { message_clear } = customerSlice.actions;
export default customerSlice.reducer;