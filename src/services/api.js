import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api", // ajuste conforme seu backend
});

// Interceptor para adicionar token automaticamente a cada requisição
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
