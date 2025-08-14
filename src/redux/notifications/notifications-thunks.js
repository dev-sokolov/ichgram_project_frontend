import { getNotificationsApi } from "../../shared/api/notifications";

import { createAsyncThunk } from "@reduxjs/toolkit";

export const getNotifications = createAsyncThunk(
    "notifications/getNotifications",
    async(_, {rejectWithValue}) => {
        try {
            const data = await getNotificationsApi();
            return data;
        } catch (error) {
             return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

