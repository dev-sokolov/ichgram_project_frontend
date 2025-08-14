import backendInstance from "./instance";

export const addCommentApi = async (postId, payload) => {
    const { data } = await backendInstance.post(`/comments/${postId}`, payload);
    return data;
};

export const getCommentsfromPostApi = async (postId) => {
    const { data } = await backendInstance.get(`/comments/fromPost/${postId}`);
    return data;
};