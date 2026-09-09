import axios from "axios";

const client = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
});

client.interceptors.request.use((config) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url || "";
    const isAuthRoute = url.includes("/login") || url.includes("/register");

    if (
      error.response?.status === 401 &&
      !isAuthRoute &&
      typeof window !== "undefined" &&
      localStorage.getItem("token")
    ) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);

export default client;
