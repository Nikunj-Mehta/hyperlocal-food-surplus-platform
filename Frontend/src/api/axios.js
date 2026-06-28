import axios from "axios";

const api = axios.create({
  // Replace with your actual live Render Web Service URL
  baseURL: "https://hyperlocal-food-surplus-platform.onrender.com/", 
});

// Attach token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;