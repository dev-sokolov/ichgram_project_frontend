import backendInstance from "./instance";

export const addFollowerApi = async ( followingId) => {
    const { data } = await backendInstance.post(`/follows/${followingId}`);
    return data;
};

export const getFollowingApi = async (userId) => {
    const { data } = await backendInstance.get(`/follows/followings/${userId}`);
    return data;
};

export const unfollowApi = async (followingId) => {
    const { data } = await backendInstance.delete(`/follows/${followingId}`);
    return data;
};


