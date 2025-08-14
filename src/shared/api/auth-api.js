import backendInstance from "./instance";

export const verifyUserApi = async code => {
    const { data } = await backendInstance.post("/auth/verify", { code });
    return data;
}

export const loginUserApi = async payload => {
    const { data } = await backendInstance.post("/auth/login", payload);
    backendInstance.defaults.headers["Authorization"] = `Bearer ${data.token}`;
    return data;
}

export const registrUserApi = async payload => {
    const { data } = await backendInstance.post("/auth/registr", payload);
    return data;
}

export const getCurrentUserApi = async token => {
    backendInstance.defaults.headers["Authorization"] = `Bearer ${token}`;
    try {
        const { data } = await backendInstance.get("/auth/current");
        return data;
    }
    catch (error) {
        delete backendInstance.defaults.headers["Authorization"];
        throw error;
    }
}

export const logoutUserApi = async () => {
    const { data } = await backendInstance.post("/auth/logout");
    delete backendInstance.defaults.headers["Authorization"];
    return data;
}


