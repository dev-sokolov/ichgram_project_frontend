import { createSlice } from "@reduxjs/toolkit";

import { addComment, getCommentsfromPost } from "./comments-thunks";

import { pending, rejected } from "../../shared/components/lib/redux";

const initialState = {
    comments: [],
    loading: false,
    error: null,
}

const commentsSlice = createSlice({
    name: "comments",
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(addComment.pending, pending)
            .addCase(addComment.rejected, rejected)
            .addCase(addComment.fulfilled, (store, { payload }) => {
                store.loading = false;
                store.comments.push(payload);
            })
            .addCase(getCommentsfromPost.pending, pending)
            .addCase(getCommentsfromPost.rejected, rejected)
            .addCase(getCommentsfromPost.fulfilled, (store, { payload }) => {
                store.loading = false;
                store.comments = payload;
            })
    }
})

export default commentsSlice.reducer;



