import axios from "axios";

const {VITE_API_URL} = import.meta.env

const backendInstance = axios.create({
    baseURL: VITE_API_URL
});

backendInstance.interceptors.request.use(config => {
    const token = localStorage.getItem("token");;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default backendInstance;