
const getPersistedUserIdFromToken = () => {
    const root = localStorage.getItem("persist:root");
    if (!root) return null;

    try {
        const parsed = JSON.parse(root);
        const auth = JSON.parse(parsed.auth);
        const token = auth.token;

        if (!token) return null;

        const payloadBase64 = token.split(".")[1];
        const decodedPayload = JSON.parse(atob(payloadBase64));
        return decodedPayload.id || decodedPayload._id || null;

    } catch (err) {
        console.error("Ошибка при получении userId:", err);
        return null;
    }
};

export default getPersistedUserIdFromToken;
