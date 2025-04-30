import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_Backend_Url,
  withCredentials: true, 
});

api.interceptors.response.use(
  res => res,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await api.post("/refresh-token"); 
        return api(originalRequest);
      } catch (err) {
        console.error("Session refresh failed.");
      }
    }

    return Promise.reject(error);
  }
);

export default api;
