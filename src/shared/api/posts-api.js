
import backendInstance from "./instance";

export const addPostApi = async (payload, token) => {
    const { data } = await backendInstance.post("/posts", payload, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
        }
    });
    return data;
}

export const getAllPostsApi = async () => {
    const { data } = await backendInstance.get("/posts");
    return data;
}

export const getPostsFromUserByIdApi = async (id) => {
    const { data } = await backendInstance.get(`/posts/user/${id}`);
    return data;
}

export const getOnePostByIdApi = async (id) => {
    const { data } = await backendInstance.get(`/posts/${id}`);
    return data;
}

export const deletePostApi = async (id) => {
    const { data } = await backendInstance.delete(`/posts/${id}`);
    return data;
}

export const updatePostDataApi = async ({ postId, payload }) => {
    const { data } = await backendInstance.patch(`/posts/${postId}`, payload, {
    headers: {
        "Content-Type": "multipart/form-data",
    }
});
    return data;
}

