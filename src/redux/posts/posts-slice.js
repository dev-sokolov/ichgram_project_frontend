import { createSlice } from "@reduxjs/toolkit";

import { addPost, getAllPosts, getPostsFromUserById, getOnePostById, deletePost, updatePostData } from "./posts-thunks";
import { toggleLike } from "../likes/likes-thunks";

import { pending, rejected } from "../../shared/components/lib/redux";

const initialState = {
    allPosts: [],
    userPosts: [],
    onePost: null,
    loading: false,
    error: null,
}

const applyLikeChange = (post, { postId, userId, liked }) => {
    if (!post || String(post._id) !== String(postId) || !userId) return;

    const user = String(userId);
    const likedUserIds = post.likedUserIds || [];
    const hasLiked = likedUserIds.some((id) => String(id) === user);

    if (liked && !hasLiked) {
        post.likedUserIds = [...likedUserIds, user];
        post.likesCount = (post.likesCount || 0) + 1;
    }

    if (!liked && hasLiked) {
        post.likedUserIds = likedUserIds.filter((id) => String(id) !== user);
        post.likesCount = Math.max(0, (post.likesCount || 0) - 1);
    }
};

const postsSlice = createSlice({
    name: "posts",
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(addPost.pending, pending)
            .addCase(addPost.rejected, rejected)
            .addCase(addPost.fulfilled, (store, { payload }) => {
                store.loading = false;
                store.allPosts.push(payload);
            })
            .addCase(getAllPosts.pending, pending)
            .addCase(getAllPosts.rejected, rejected)
            .addCase(getAllPosts.fulfilled, (store, { payload }) => {
                store.loading = false;
                store.allPosts = payload;
            })
            .addCase(getPostsFromUserById.pending, pending)
            .addCase(getPostsFromUserById.rejected, rejected)
            .addCase(getPostsFromUserById.fulfilled, (store, { payload }) => {
                store.loading = false;
                store.userPosts = payload;
            })
            .addCase(getOnePostById.pending, pending)
            .addCase(getOnePostById.rejected, rejected)
            .addCase(getOnePostById.fulfilled, (store, { payload }) => {
                store.loading = false;
                store.onePost = payload;
            })
            .addCase(deletePost.pending, pending)
            .addCase(deletePost.rejected, rejected)
            .addCase(deletePost.fulfilled, (store, { payload: id }) => {
                store.loading = false;
                store.onePost = null;
                store.allPosts = store.allPosts.filter(post => post._id !== id)
                store.userPosts = store.userPosts.filter(post => post._id !== id)
            })
            .addCase(updatePostData.pending, pending)
            .addCase(updatePostData.rejected, rejected)
            .addCase(updatePostData.fulfilled, (store, { payload }) => {
                store.loading = false;
                store.onePost = payload;
            })
            .addCase(toggleLike.fulfilled, (store, { payload }) => {
                store.allPosts.forEach((post) => applyLikeChange(post, payload));
                store.userPosts.forEach((post) => applyLikeChange(post, payload));
                applyLikeChange(store.onePost, payload);
            })
    }
})

export default postsSlice.reducer;



