import { combineReducers } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";

import storage from "redux-persist/lib/storage";

import authReducer from "./auth/auth-slice";
import postsReducer from "./posts/posts-slice";
import usersReducer from "./users/users-slice";
import commentsReducer from "./comments/comments-slice";
import followsReducer from "./follows/follows-slice";
import notificationsReducer from "./notifications/notifications-slice";
import messagesReducer from "./messages/messages-slice";

const rootReducer = combineReducers({
    auth: authReducer,
    posts: postsReducer,
    users: usersReducer,
    comments: commentsReducer,
    follows: followsReducer,
    notifications: notificationsReducer,
    messages: messagesReducer,
});

const persistConfig = {
    key: "root",
    storage,
    whitelist: ["auth"]
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export default persistedReducer;



