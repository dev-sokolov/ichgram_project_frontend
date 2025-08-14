import { createSelector } from '@reduxjs/toolkit';

export const getAllUsersSelector = createSelector(
  (store) => store.users.users,
  (users) => {
    if (Array.isArray(users)) {
      return users;
    }
    if (users) {
      return [users];
    }
    return [];
  }
);

export const getCurrentUserSelector = store => store.users.currentUser;

export const getPostUserSelector = store => store.users.postUser;


