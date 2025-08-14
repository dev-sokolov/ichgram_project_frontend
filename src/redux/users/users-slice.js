import { createSlice } from "@reduxjs/toolkit";

import { getAllUsers, updateUser, getCurrentUserById, getPostUserById, getUsersByUsername } from "./users-thunks";

import { pending, rejected } from "../../shared/components/lib/redux";

const initialState = {
    users: [],
    currentUser: null,
    postUser: null,
    loading: false,
    error: null,
}

const usersSlice = createSlice({
    name: "users",
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(getAllUsers.pending, pending)
            .addCase(getAllUsers.rejected, rejected)
            .addCase(getAllUsers.fulfilled, (store, { payload }) => {
                store.loading = false;
                store.users = Array.isArray(payload) ? payload : payload ? [payload] : [];
            })
            .addCase(updateUser.pending, pending)
            .addCase(updateUser.rejected, rejected)
            .addCase(updateUser.fulfilled, (store, { payload }) => {
                store.loading = false;
                store.users = payload;
            })
            .addCase(getCurrentUserById.pending, pending)
            .addCase(getCurrentUserById.rejected, rejected)
            .addCase(getCurrentUserById.fulfilled, (store, { payload }) => {
                store.loading = false;
                store.currentUser = payload;
            })
            .addCase(getPostUserById.pending, pending)
            .addCase(getPostUserById.rejected, rejected)
            .addCase(getPostUserById.fulfilled, (store, { payload }) => {
                store.loading = false;
                store.postUser = payload;
            })
            .addCase(getUsersByUsername.pending, pending)
            .addCase(getUsersByUsername.rejected, rejected)
            .addCase(getUsersByUsername.fulfilled, (store, { payload }) => {
                store.loading = false;
                store.users = payload;
            })
    }
})

export default usersSlice.reducer;



