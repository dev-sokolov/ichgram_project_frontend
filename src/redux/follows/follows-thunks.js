import { addFollowerApi, getFollowingApi, unfollowApi } from "../../shared/api/follows-api";

import { createAsyncThunk } from "@reduxjs/toolkit";

export const addFollower = createAsyncThunk(
    "follows/addFollower",
    async( followingId, {rejectWithValue}) => {
        try {
            const data = await addFollowerApi(followingId);
            return data;
        } catch (error) {
             return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const getFollowing = createAsyncThunk(
    "follows/getFollowing",
    async( userId, {rejectWithValue}) => {
        try {
            const data = await getFollowingApi(userId);
            return data;
        } catch (error) {
             return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const unfollow = createAsyncThunk(
    "follows/unfollow",
    async( followingId, {rejectWithValue}) => {
        try {
            await unfollowApi(followingId);
            return followingId;
        } catch (error) {
             return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);



