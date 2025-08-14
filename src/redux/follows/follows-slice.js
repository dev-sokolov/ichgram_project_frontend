import { createSlice } from "@reduxjs/toolkit";

import { addFollower, getFollowing, unfollow } from "./follows-thunks";

import { pending, rejected } from "../../shared/components/lib/redux";


const initialState = {
    followings: [],
    followers: [],
    loading: false,
    error: null,
}

const commentsSlice = createSlice({
    name: "follows",
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(addFollower.pending, pending)
            .addCase(addFollower.rejected, rejected)
            .addCase(addFollower.fulfilled, (store, { payload }) => {
                store.loading = false;
                store.followings.push(payload.following);
            })
            .addCase(getFollowing.pending, pending)
            .addCase(getFollowing.rejected, rejected)
            .addCase(getFollowing.fulfilled, (store, { payload }) => {
                store.loading = false;
                store.followings = payload.filter(user => user.following !== null);
            })
            .addCase(unfollow.pending, pending)
            .addCase(unfollow.rejected, rejected)
            .addCase(unfollow.fulfilled, (store, { payload }) => {
                store.loading = false;
                store.followings = store.followings.filter(user => user._id !== payload);
            })
    }
})

export default commentsSlice.reducer;



