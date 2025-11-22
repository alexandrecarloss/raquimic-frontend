import axios from "axios";
import { useAuthStore } from "../store/auth";

const api = axios.create({
  baseURL: "https://backend-kyrh.onrender.com/api",
});

// Adiciona token nas requisições
api.interceptors.request.use(config => {
  const auth = useAuthStore();
  if (auth.token) config.headers.Authorization = `Bearer ${auth.token}`;
  return config;
});

// 🔥 Interceptor para tratar token expirado
api.interceptors.response.use(
  response => response,
  error => {
    const auth = useAuthStore();

    if (error.response && error.response.status === 401) {
      // Limpa token e dados do usuário
      auth.logout?.(); // caso exista o método logout na store

      // Redireciona para login
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;
