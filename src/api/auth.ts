import { api } from "./client";

export type RegisterBody = { name: string; email: string; password: string };
export type LoginBody = { email: string; password: string };

export async function register(body: RegisterBody) {
  const { data } = await api.post("/api/auth/register", body);
  return data;
}

export async function login(body: LoginBody) {
  const { data } = await api.post<{ token: string }>("/api/auth/login", body);
  localStorage.setItem("token", data.token);
  return data;
}

export function logout() {
  localStorage.removeItem("token");
}