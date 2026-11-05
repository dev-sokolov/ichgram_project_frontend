export const selectAuth = store => store.auth;

export const selectAuthUser = store => store.auth.user;

export const selectToken = store => store.auth.token;

export const selectIsGuest = store => Boolean(store.auth.isGuest) && !store.auth.token;