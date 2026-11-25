import axios from "axios";
import type { ApiError } from "../types";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { "Content-Type": "application/json" },
});

// Bearer
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const esAuth = String(error.config?.url ?? "").includes("/auth/");
    if (error.response?.status === 401 && !esAuth) {
      localStorage.removeItem("token");
      window.location.assign("/login");
    }
    return Promise.reject(error);
  }
);

// Axios
export function getError(error: unknown): { status?: number; code?: string; message?: string } {
  if (axios.isAxiosError<ApiError>(error)) {
    return {
      status: error.response?.status,
      code: error.response?.data?.code,
      message: error.response?.data?.message,
    };
  }
  return {};
}