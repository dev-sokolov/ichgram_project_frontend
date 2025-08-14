import { createAsyncThunk } from "@reduxjs/toolkit";

import { loginUserApi, registrUserApi, logoutUserApi, getCurrentUserApi, verifyUserApi } from "../../shared/api/auth-api";

export const login = createAsyncThunk(
    "auth/login",
    async (payload, { rejectWithValue }) => {
        try {
            const data = await loginUserApi(payload);
            localStorage.setItem("token", data.token);
            return data;
        }
        catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const register = createAsyncThunk(
    "auth/registr",
    async (payload, { rejectWithValue }) => {
        try {
            const data = await registrUserApi(payload);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const getCurrent = createAsyncThunk(
    "auth/current",
    async(_, {getState, rejectWithValue}) => {
        try {
            const store = getState();
            const data = await getCurrentUserApi(store.auth.token);
            return data;
        }
        catch(error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
)

export const logout = createAsyncThunk(
    "auth/logout",
    async (_, { rejectWithValue }) => {
        try {
            await logoutUserApi();
            return true;
        }
        catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
)

