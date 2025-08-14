import { createSlice } from "@reduxjs/toolkit";
import { addMessage, getConversationByUserId } from "./messages-thunks";
import { pending, rejected } from "../../shared/components/lib/redux";

const initialState = {
    conversations: {},
    loading: false,
    error: null,
};

const messagesSlice = createSlice({
    name: "messages",
    initialState,

    reducers: {
        addMessageLocal: (store, { payload }) => {
            if (!payload.sender || !payload.recipient) {
                console.warn("Invalid message payload, missing sender or recipient:", payload);
                return;
            }
            const { sender, recipient, currentUserId, _id } = payload;
            const otherUserId = sender === currentUserId ? recipient : sender;

            if (!store.conversations[otherUserId]) {
                store.conversations[otherUserId] = [];
            }

            const exists = store.conversations[otherUserId].some(msg => msg._id === _id);
            if (!exists) {
                store.conversations[otherUserId].push(payload);
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(addMessage.pending, pending)
            .addCase(addMessage.rejected, rejected)
            .addCase(addMessage.fulfilled, (store, { payload, meta }) => {
                store.loading = false;
                const { recipientId } = meta.arg;
                if (!store.conversations[recipientId]) {
                    store.conversations[recipientId] = [];
                }
                const exists = store.conversations[recipientId].some(msg => msg._id === payload._id);
                if (!exists) {
                    store.conversations[recipientId].push(payload);
                }
            })
            .addCase(getConversationByUserId.pending, pending)
            .addCase(getConversationByUserId.rejected, rejected)
            .addCase(getConversationByUserId.fulfilled, (store, { payload, meta }) => {
                store.loading = false;
                const userId = meta.arg;
                store.conversations[userId] = payload;
            });
    },
});

export const { addMessageLocal } = messagesSlice.actions;

export default messagesSlice.reducer;



