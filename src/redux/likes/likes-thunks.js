import { toggleLikeApi } from "../../shared/api/likes-api";

import { createAsyncThunk } from "@reduxjs/toolkit";

const getUserIdFromToken = (token) => {
    if (!token) return null;

    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return payload.id || payload._id || null;
    } catch {
        return null;
    }
};

export const toggleLike = createAsyncThunk(
    "likes/toggleLike",
    async (postId, { getState, rejectWithValue }) => {
        try {
            const data = await toggleLikeApi(postId);
            const removed = typeof data?.message === "string";

            return {
                postId,
                userId: getUserIdFromToken(getState().auth.token),
                liked: !removed,
            };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);
