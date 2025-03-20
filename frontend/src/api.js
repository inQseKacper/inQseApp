import axios from "axios";
import { ACCESS_TOKEN } from "./constants";

const apiUrl = "https://inqseapp-75a17f6e3740.herokuapp.com/";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL : apiUrl,
});


api.interceptors.request.use(
  (config) => {
    // 🚨 Sprawdzamy, czy żądanie nie jest do /verify/
    if (!config.url.includes("/verify/")) {
      const token = localStorage.getItem(ACCESS_TOKEN);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


export default api;