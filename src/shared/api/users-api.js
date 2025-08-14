import backendInstance from "./instance";

export const getAllUsersApi = async () => {
    const { data } = await backendInstance.get("/users");
    return data;
};

export const updateUserDataApi = async (payload) => {
    const { data } = await backendInstance.patch("/users/profile", payload, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return data;
};

export const getUserByIdApi = async (userId) => {
    const { data } = await backendInstance.get(`/users/${userId}`);
    return data;
};

export const getUsersByUsernameApi = async (username) => {
    const { data } = await backendInstance.get("/users", {
        params: { username }
    });
    return data;
};