import axios from "axios";

// Determine base API URL cleanly at initialization
let rawUrl = import.meta.env.VITE_API_URL || "";
let baseURL = "/api";

if (rawUrl) {
  rawUrl = rawUrl.trim().replace(/\/+$/, "");
  baseURL = rawUrl.endsWith("/api") ? rawUrl : `${rawUrl}/api`;
}

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to append JWT bearer token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token expiry / unauthenticated responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthRequest = error.config?.url?.includes("/login") || error.config?.url?.includes("/register");
    
    if (error.response && error.response.status === 401 && !isAuthRequest) {
      localStorage.removeItem("token");
      localStorage.removeItem("profile_extra");
      if (
        window.location.pathname !== "/login" &&
        window.location.pathname !== "/register" &&
        window.location.pathname !== "/"
      ) {
        window.location.href = "/login?expired=true";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
