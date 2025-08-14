import { createSlice } from "@reduxjs/toolkit";

import { login, register, logout, getCurrent } from "./auth-thunks";

import { pending, rejected } from "../../shared/components/lib/redux";

const initialState = {
    token: "",
    user: null,
    loading: false,
    error: null,
    successVerify: false,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        clearAuthError: (store) => {
            store.error = null
        }
    },
    extraReducers: builder => {
        builder.addCase(login.pending, pending)
            .addCase(login.rejected, rejected)
            .addCase(login.fulfilled, (store, { payload }) => {
                store.loading = false;
                store.token = payload.token;
                store.user = payload.user;
            })
            .addCase(register.pending, pending)
            .addCase(register.rejected, rejected)
            .addCase(register.fulfilled, (store, { payload }) => {
                store.loading = false;
                store.user = payload.user;
            })
            .addCase(getCurrent.pending, pending)
            .addCase(getCurrent.rejected, () => initialState)
            .addCase(getCurrent.fulfilled, (store, { payload }) => {
                store.loading = false;
                store.token = payload.token;
                store.user = payload.user;
            })
            .addCase(logout.pending, pending)
            .addCase(logout.fulfilled, () => initialState)
            .addCase(logout.rejected, (store, { payload }) => {
                store.loading = false;
                store.error = payload;
            })

    }
});

export const { clearAuthError } = authSlice.actions;
export default authSlice.reducer;