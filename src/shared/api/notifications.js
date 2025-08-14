import backendInstance from "./instance";

export const getNotificationsApi = async () => {
    const { data } = await backendInstance.get("/notifications");
    return data;
};

