import { createSlice } from "@reduxjs/toolkit";

import { toggleLike } from "./likes-thunks";

import { pending, rejected } from "../../shared/components/lib/redux";

const initialState = {
    likes: [],
    loading: false,
    error: null,
}

const likesSlice = createSlice({
    name: "likes",
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(toggleLike.pending, pending)
            .addCase(toggleLike.rejected, rejected)
            .addCase(toggleLike.fulfilled, (store, { payload }) => {
                store.loading = false;
                store.likes = payload;
            })
    }
})

export default likesSlice.reducer;



