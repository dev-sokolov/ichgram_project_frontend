import backendInstance from "./instance";

export const toggleLikeApi = async (postId) => {
    const { data } = await backendInstance.post(`/likes/${postId}`);
    return data;
};