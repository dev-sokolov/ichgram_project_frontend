import { getAllUsersApi, updateUserDataApi, getUserByIdApi, getUsersByUsernameApi } from "../../shared/api/users-api";

import { createAsyncThunk } from "@reduxjs/toolkit";

export const getAllUsers = createAsyncThunk(
    "users/getAllUsers",
    async (_, { rejectWithValue }) => {
        try {
            const data = await getAllUsersApi();
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const updateUser = createAsyncThunk(
    "users/updateUser",
    async (payload, { rejectWithValue }) => {
        try {
            const data = await updateUserDataApi(payload);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const getCurrentUserById = createAsyncThunk(
    "users/getCurrentUserById",
    async (userId, { rejectWithValue }) => {
        try {
            const data = await getUserByIdApi(userId);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const getPostUserById = createAsyncThunk(
    "users/getPostUserById",
    async (userId, { rejectWithValue }) => {
        try {
            const data = await getUserByIdApi(userId);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const getUsersByUsername = createAsyncThunk(
    "users/getUsersByUsername",
    async (username, { rejectWithValue }) => {
        try {
            const data = await getUsersByUsernameApi(username);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);