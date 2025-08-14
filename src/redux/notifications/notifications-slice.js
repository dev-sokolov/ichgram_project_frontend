import { createSlice } from "@reduxjs/toolkit";

import { getNotifications } from "./notifications-thunks";

import { pending, rejected } from "../../shared/components/lib/redux";

const initialState = {
    notifications: [],
    loading: false,
    error: null,
}

const notificationsSlice = createSlice({
    name: "notifications",
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(getNotifications.pending, pending)
            .addCase(getNotifications.rejected, rejected)
            .addCase(getNotifications.fulfilled, (store, { payload }) => {
                store.loading = false;
                store.notifications = payload;
            })
    }
})

export default notificationsSlice.reducer;



