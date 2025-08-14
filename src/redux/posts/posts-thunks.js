import { addPostApi, getAllPostsApi, getPostsFromUserByIdApi, getOnePostByIdApi, deletePostApi, updatePostDataApi } from "../../shared/api/posts-api";

import { createAsyncThunk } from "@reduxjs/toolkit";

export const addPost = createAsyncThunk(
    "posts/addPost",
    async (payload, { getState, rejectWithValue }) => {
        try {
            const state = getState();
            const token = state.auth.token;
            if (!token) {
                throw new Error("No auth token found. Please login.")
            }
            const data = await addPostApi(payload, token);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const getAllPosts = createAsyncThunk(
    "posts/getAllPosts",
    async (_, { rejectWithValue }) => {
        try {
            const data = await getAllPostsApi();
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const getPostsFromUserById = createAsyncThunk(
    "posts/getPostsFromUserById",
    async (userId, { rejectWithValue }) => {
        try {
            const data = await getPostsFromUserByIdApi(userId);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const getOnePostById = createAsyncThunk(
    "posts/getOnePostById",
    async (userId, { rejectWithValue }) => {
        try {
            const data = await getOnePostByIdApi(userId);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const deletePost = createAsyncThunk(
    "posts/deletePost",
    async (postId, { rejectWithValue }) => {
        try {
            await deletePostApi(postId);
            return postId;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const updatePostData = createAsyncThunk(
    "posts/updatePostData",
    async ({postId, payload}, { rejectWithValue }) => {
        try {
            const data = await updatePostDataApi({postId, payload});
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);