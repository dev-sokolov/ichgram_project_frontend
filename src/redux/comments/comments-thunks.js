import { addCommentApi, getCommentsfromPostApi } from "../../shared/api/comments-api";

import { createAsyncThunk } from "@reduxjs/toolkit";

export const addComment = createAsyncThunk(
    "comments/addComment",
    async({postId, payload}, {rejectWithValue}) => {
        try {
            const data = await addCommentApi(postId, payload);
            return data;
        } catch (error) {
             return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const getCommentsfromPost = createAsyncThunk(
    "comments/getCommentsfromPost",
    async(postId, {rejectWithValue}) => {
        try {
            const data = await getCommentsfromPostApi(postId);
            return data;
        } catch (error) {
             return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);
