import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL
});

// Attach token automatically - prioritize adminToken for admin routes, userToken for others
api.interceptors.request.use((config) => {
  const adminToken = localStorage.getItem("adminToken");
  const userToken = localStorage.getItem("token");
  
  let token = null;
  if (config.url && config.url.includes("/admin")) {
      token = adminToken || userToken;
  } else {
      token = userToken || adminToken; // Prefer userToken for non-admin endpoints
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;


