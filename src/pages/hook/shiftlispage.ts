import axios from "axios";
const instance = axios.create({
    baseURL: "https://api.noventer.uz/api/v1",
});

instance.interceptors.request.use((config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

instance.interceptors.response.use(
    res => res,
    async error => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem("refresh_token");

            try {
                const { data } = await axios.post("https://api.noventer.uz/api/v1/auth/jwt/refresh/", {
                    refresh: refreshToken,
                });
                localStorage.setItem("access_token", data.access);
                originalRequest.headers.Authorization = `Bearer ${data.access}`;
                return axios(originalRequest);
            } catch (err) {
                console.error("Refresh token eskirgan yoki xato:", err);
                return Promise.reject(err);
            }
        }
        return Promise.reject(error);
    }
);

export default instance;
