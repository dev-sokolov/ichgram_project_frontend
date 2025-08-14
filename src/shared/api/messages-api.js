import backendInstance from "./instance";

export const addMessageApi = async (recipientId, payload) => {
    const { data } = await backendInstance.post(`/messages/${recipientId}`, payload);
    return data;
};

export const getConversationByUserIdApi = async (userId) => {
    const { data } = await backendInstance.get(`/messages/${userId}/conversation`);
    return data;
};

