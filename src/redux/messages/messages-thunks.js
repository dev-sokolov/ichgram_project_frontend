import { createAsyncThunk } from "@reduxjs/toolkit";
import { addMessageApi, getConversationByUserIdApi } from "../../shared/api/messages-api";

export const addMessage = createAsyncThunk(
  "messages/addMessage",
  async ({ recipientId, payload }, { rejectWithValue }) => {
    try {
      const data = await addMessageApi(recipientId, payload);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getConversationByUserId = createAsyncThunk(
  "messages/getConversation",
  async (userId, { rejectWithValue }) => {
    try {
      const data = await getConversationByUserIdApi(userId);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

