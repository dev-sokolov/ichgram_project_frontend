import { toggleLikeApi } from "../../shared/api/likes-api";

import { createAsyncThunk } from "@reduxjs/toolkit";

export const toggleLike = createAsyncThunk(
    "likes/toggleLike",
    async(postId, {rejectWithValue}) => {
        try {
            const data = await toggleLikeApi(postId);
            return data;
        } catch (error) {
             return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);
